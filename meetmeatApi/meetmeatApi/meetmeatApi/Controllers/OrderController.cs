using meetmeatApi.Dtos;      
using meetmeatApi.Models;
using meetmeatApi.Services; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; 
using System;                 
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
    }
}
