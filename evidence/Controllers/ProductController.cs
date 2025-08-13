using Microsoft.AspNetCore.Mvc;
using Evidence.Models;
using Evidence.Services;
using Evidence.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Evidence.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IProductService productService, ILogger<ProductController> logger)
        {
            _productService = productService;
            _logger = logger;
        }
        [Authorize]
        [HttpPost("CreateProduct")]
        public async Task<IActionResult> CreateProductAsync([FromBody] ProductDto dto)
        {

        }

    }
}
