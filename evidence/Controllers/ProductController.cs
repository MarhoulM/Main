using Microsoft.AspNetCore.Mvc;
using Evidence.Models;
using Evidence.Services;
using Evidence.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Evidence.Data;

namespace Evidence.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductController> _logger;
        private readonly ApplicationDbContext _context;

        public ProductController(IProductService productService, ILogger<ProductController> logger, ApplicationDbContext context)
        {
            _productService = productService;
            _logger = logger;
            _context = context;
        }
        [Authorize]
        [HttpPost("createProduct")]
        public async Task<IActionResult> CreateProductAsync([FromBody] ProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Product validation failed from frontend request.");
                return BadRequest(ModelState);
            }
            int? userId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedUserId))
                {
                    var user = await _context.Users.FindAsync(parsedUserId);
                    if (user != null && user.Admin)
                    {
                        userId = parsedUserId;
                        _logger.LogInformation($"Product initiated by authenticaded user ID : {userId}");
                    }
                    else
                    {
                        _logger.LogWarning("Authenticated user doesn´t have rights.");
                        return Unauthorized(new
                        {
                            Message = "Uživatel nemá dostatečná práva pro přidání produktu."
                        });
                    }
                }else
                {
                    _logger.LogWarning("Authenticated user´s token is missing or has an invalid UserId claim.");
                }
            }else
            {
                _logger.LogInformation("Product initiated by anonymous user.");
            }
            try
            {
                if(userId == null)
                {
                    _logger.LogWarning("User ID is missing. Cannot create Product for unauthenticaded user.");
                    _logger.LogDebug($"IsAuthenticated: {User.Identity?.IsAuthenticated}");
                    _logger.LogDebug($"NameIdentifier: {User.FindFirst(ClaimTypes.NameIdentifier)?.Value}");
                    return Unauthorized(new {Message = "Nepřihlášený uživatel nemůže přidat produkt."});
                }
                var product = await _productService.CreateProductAsync(dto, userId.Value);
                _logger.LogInformation($"New Product created successfully. User ID: {userId.ToString() ?? "Anonymous"}.");
                return Ok(new { Message = "Produkt byl úspěšně vytvořen.", Data = product });
            }
            catch (ArgumentException ex)  
            {
                _logger.LogError(ex, $"Product validation error: {ex.Message}");
                return StatusCode(500, new { Message = $"Nepodařilo se vytvořit produkt: {ex.Message}" });
            }
        }
        [AllowAnonymous]
        [HttpGet("readProduct")]
        public async Task<ActionResult<ProductDto>> GetProductAsync(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if(product == null)
            {
                return NotFound($"Produkt s ID {id} nebyl nalezen.");
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Author = product.Author,
                Director = product.Director,
                Category = product.Category,
                Genre = product.Genre,
                Description = product.Description,
                Borrowed = product.Borrowed,
                DateOfAcquisition = product.DateOfAcquisition,
                Availability = product.Availability
            };
            return Ok(productDto);
        }
        [AllowAnonymous]
        [HttpGet("searchProduct")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> SearchProductAsync([FromQuery] string? query, [FromQuery] string? category, [FromQuery] string? genre, [FromQuery] string? availability)
        {
            var productsQuery = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                productsQuery = productsQuery.Where(p =>
                   EF.Functions.Like(p.Name, $"%{query}%") ||
                   EF.Functions.Like(p.Author, $"%{query}%") ||
                   EF.Functions.Like(p.Director, $"%{query}%") ||
                   EF.Functions.Like(p.Description, $"%{query}%"));
            }
            if (!string.IsNullOrWhiteSpace(category))
            {
                productsQuery = productsQuery.Where(p => p.Category == category);
            }

            if (!string.IsNullOrWhiteSpace(genre))
            {
                productsQuery = productsQuery.Where(p => EF.Functions.Like(p.Genre, $"%{genre}%"));
            }

            if (!string.IsNullOrWhiteSpace(availability))
            {
                bool isAvailable = availability == "Dostupné";
                productsQuery = productsQuery.Where(p => p.Availability == isAvailable);
            }

            var products = await productsQuery
               .OrderBy(p => p.Name)
               .Select(p => new ProductDto
               {
                   Id = p.Id,
                   Name = p.Name,
                   Author = p.Author,
                   Director = p.Director,
                   Category = p.Category,
                   Genre = p.Genre,
                   Description = p.Description,
                   Borrowed = p.Borrowed,
                   DateOfAcquisition = p.DateOfAcquisition,
                   Availability = p.Availability
               })
               .ToListAsync();

            return Ok(new { data = products });
        }
        [Authorize]
        [HttpPut("updateProduct")]
        public async Task<ActionResult<ProductDto>> UpdateProductAsync(int id, [FromBody] ProductDto dto)
        {
            if(!ModelState.IsValid)
            {
                _logger.LogWarning("Product validation failed from frontend request.");
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int parsedUserId))
            {
                _logger.LogWarning("Authenticated user's token is missing or has an invalid UserId claim.");
                return Unauthorized(new { Message = "Neplatný nebo chybějící identifikátor uživatele." });
            }

            var user = await _context.Users.FindAsync(parsedUserId);
            if (user == null || !user.Admin)
            {
                _logger.LogWarning($"Uživatel s ID {parsedUserId} nemá práva pro aktualizaci produktu.");
                return Unauthorized(new { Message = "Uživatel nemá dostatečná práva pro aktualizaci produktu." });
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                _logger.LogWarning($"Product for ID: {id} was not found.");
                return NotFound($"Produkt ID: {id} nebyl nalezen.");
            }
            if (dto.Name !=null) product.Name = dto.Name;
            product.Author = dto.Author;
            product.Director = dto.Director;
            if(dto.Category != null) product.Category = dto.Category;
            if(dto.Genre != null) product.Genre = dto.Genre;
            product.Description = dto.Description;
            product.Borrowed = dto.Borrowed;
            product.DateOfAcquisition = dto.DateOfAcquisition;
            product.Availability = dto.Availability;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Chyba při ukládání produktu pro ID: {id}");
                return StatusCode(500, new { Message = "Nepodařilo se aktualizovat produkt." });
            }
            return Ok(product);
        }
        //PATCH
        [Authorize]
        [HttpPatch("patchProduct")]
        public async Task<ActionResult<PatchProductDto>> PatchProductAsync(int id, [FromBody] PatchProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Product validation failed from frontend request.");
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int parsedUserId))
            {
                _logger.LogWarning("Authenticated user's token is missing or has an invalid UserId claim.");
                return Unauthorized(new { Message = "Neplatný nebo chybějící identifikátor uživatele." });
            }

            var user = await _context.Users.FindAsync(parsedUserId);
            if (user == null || !user.Admin)
            {
                _logger.LogWarning($"Uživatel s ID {parsedUserId} nemá práva pro aktualizaci produktu.");
                return Unauthorized(new { Message = "Uživatel nemá dostatečná práva pro aktualizaci produktu." });
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                _logger.LogWarning($"Product for ID: {id} was not found.");
                return NotFound($"Produkt ID: {id} nebyl nalezen.");
            }
     
            product.Borrowed = dto.Borrowed;
            product.Availability = dto.Availability;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Chyba při ukládání produktu pro ID: {id}");
                return StatusCode(500, new { Message = "Nepodařilo se aktualizovat produkt." });
            }
            return Ok(product);
        }
        [Authorize]
        [HttpDelete("deleteProduct")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int parsedUserId))
            {
                _logger.LogWarning("Authenticated user's token is missing or has an invalid UserId claim.");
                return Unauthorized(new { Message = "Neplatný nebo chybějící identifikátor uživatele." });
            }

            var user = await _context.Users.FindAsync(parsedUserId);
            if (user == null || !user.Admin)
            {
                _logger.LogWarning($"Uživatel s ID {parsedUserId} nemá práva pro smazání produktu.");
                return Unauthorized(new { Message = "Uživatel nemá dostatečná práva pro smazání produktu." });
            }
            var wasDeleted = await _productService.DeleteProductAsync(id);
            if(!wasDeleted)
            {
                _logger.LogWarning($"Produkt s ID {id} nebyl nalezen.");
                return NotFound(new { Message = $"Produkt s ID {id} nebyl nalezen." });
            }
            return NoContent();
        }
    }
}
