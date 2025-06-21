using meetmeatApi.Dtos;      
using meetmeatApi.Models;
using meetmeatApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; 
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace meetmeatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Order validation failed from frontend request.");
                return BadRequest(ModelState); 
            }

            int? userId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedUserId))
                {
                    userId = parsedUserId;
                    _logger.LogInformation($"Order initiated by authenticated user ID: {userId}.");
                }
                else
                {
                    _logger.LogWarning("Authenticated user's token is missing or has an invalid UserId claim.");
                }
            }
            else
            {
                _logger.LogInformation("Order initiated by anonymous user.");
            }

            try
            {
                var order = await _orderService.CreateOrderAsync(request, userId);
                _logger.LogInformation($"New Order ID: {order.Id} created successfully. Total: {order.TotalAmount} CZK. User ID: {userId?.ToString() ?? "Anonymous"}.");
                return Ok(new { Message = "Objednávka byla úspěšně vytvořena!", OrderId = order.Id });
            }
            catch (ArgumentException ex) 
            {
                _logger.LogError(ex, $"Order validation error: {ex.Message}");
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error during order creation.");
                return StatusCode(500, new { Message = $"Nepodařilo se vytvořit objednávku: {ex.Message}" });
            }
        }
        [HttpGet("my-orders")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                _logger.LogWarning("Attempt to access GetMyOrders without a valid UserId claim.");
                return Unauthorized(new { Message = "Nejste přihlášeni nebo chybí ID uživatele." });
            }
            try
            {
                var orders = await _orderService.GetUserOrdersAsync(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving orders for user ID: {userId}.");
                return StatusCode(500, new { Message = "Nepodařilo se načíst objednávky." });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
        {
            var usuerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int? userId = null;
            if (usuerIdClaim != null && int.TryParse(usuerIdClaim.Value, out int parsedUserId))
            { 
            userId = parsedUserId;
            }

            if (!userId.HasValue) {
                return Unauthorized(new { Message = "Pro zobrazení detailu objednávky musíte být přihlášeni." });
            }

            try 
            {
                var order = await _orderService.GetOrderByIdAsync(id, userId);

                if (order == null)
                {
                    return NotFound($"Objednávka s ID {id} nebyla nalezena nebo k ní nemáte přístup.");
                }
                return Ok(order);

            }catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, $"Unauthorized access attempt to order {id} by user {userId}.");
                return Unauthorized(new { Message = ex.Message });
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, $"Error retrieving order {id} for user {userId}.");
                return StatusCode(500, new { Message = "Nepodařilo se načíst detail objednávky." });
            }
        }
    }
}
