using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using meetmeatApi.Data;
using meetmeatApi.Models;
using meetmeatApi.Dtos; 
using meetmeatApi.QueryParams; 
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System; 

namespace meetmeatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        [AllowAnonymous] 
        public async Task<ActionResult<PagedResponse<ProductReadDto>>> GetProducts([FromQuery] ProductQueryParameters queryParams)
        {

            var productsQuery = _context.Products.Include(p => p.DetailDescription).AsQueryable();

  
            if (!string.IsNullOrWhiteSpace(queryParams.Category))
            {
                productsQuery = productsQuery.Where(p => p.Category.ToLower() == queryParams.Category.ToLower());
            }


            if (!string.IsNullOrWhiteSpace(queryParams.SearchTerm))
            {
                var searchTermLower = queryParams.SearchTerm.ToLower();
                productsQuery = productsQuery.Where(p =>
                    (p.Name != null && p.Name.ToLower().Contains(searchTermLower)) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTermLower))
                );
            }


            if (queryParams.MinPrice.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.Price >= queryParams.MinPrice.Value);
            }
            if (queryParams.MaxPrice.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.Price <= queryParams.MaxPrice.Value);
            }


            var totalCount = await productsQuery.CountAsync();

            if (!string.IsNullOrWhiteSpace(queryParams.OrderBy))
            {
                productsQuery = queryParams.OrderBy.ToLower() switch
                {
                    "name" => productsQuery.OrderBy(p => p.Name),
                    "name_desc" => productsQuery.OrderByDescending(p => p.Name),
                    "price" => productsQuery.OrderBy(p => p.Price),
                    "price_desc" => productsQuery.OrderByDescending(p => p.Price),
                    "category" => productsQuery.OrderBy(p => p.Category),
                    "category_desc" => productsQuery.OrderByDescending(p => p.Category),
                    _ => productsQuery.OrderBy(p => p.Id) 
                };
            }
            else
            {
                productsQuery = productsQuery.OrderBy(p => p.Id); 
            }

            var products = await productsQuery
                                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                                .Take(queryParams.PageSize)
                                .ToListAsync();

            var productDtos = products.Select(p => new ProductReadDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Currency = p.Currency,
                ImageUrl = p.ImageUrl,
                Description = p.Description,
                Category = p.Category,
                DetailDescription = p.DetailDescription != null ? new ProductDetailDescriptionReadDto
                {
                    MeatType = p.DetailDescription.MeatType,
                    Process = p.DetailDescription.Process,
                    Weight = p.DetailDescription.Weight,
                    Nutrition = p.DetailDescription.Nutrition,
                    Origin = p.DetailDescription.Origin,
                    ShelfLife = p.DetailDescription.ShelfLife
                } : null
            }).ToList();

            return Ok(new PagedResponse<ProductReadDto>(productDtos, queryParams.PageNumber, queryParams.PageSize, totalCount));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDto>> GetProduct(int id)
        {
            var product = await _context.Products
                                        .Include(p => p.DetailDescription)
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound($"Produkt s ID {id} nebyl nalezen.");
            }

            var productDto = new ProductReadDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Currency = product.Currency,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
                Category = product.Category,
                DetailDescription = product.DetailDescription != null ? new ProductDetailDescriptionReadDto
                {
                    MeatType = product.DetailDescription.MeatType,
                    Process = product.DetailDescription.Process,
                    Weight = product.DetailDescription.Weight,
                    Nutrition = product.DetailDescription.Nutrition,
                    Origin = product.DetailDescription.Origin,
                    ShelfLife = product.DetailDescription.ShelfLife
                } : null
            };

            return Ok(productDto);
        }

        [HttpPost]
        public async Task<ActionResult<ProductReadDto>> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                Currency = productDto.Currency,
                ImageUrl = productDto.ImageUrl,
                Description = productDto.Description,
                Category = productDto.Category,
                DetailDescription = productDto.DetailDescription != null ? new ProductDetailDescription
                {
                    MeatType = productDto.DetailDescription.MeatType,
                    Process = productDto.DetailDescription.Process,
                    Weight = productDto.DetailDescription.Weight,
                    Nutrition = productDto.DetailDescription.Nutrition,
                    Origin = productDto.DetailDescription.Origin,
                    ShelfLife = productDto.DetailDescription.ShelfLife
                } : new ProductDetailDescription()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var createdProductDto = new ProductReadDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Currency = product.Currency,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
                Category = product.Category,
                DetailDescription = product.DetailDescription != null ? new ProductDetailDescriptionReadDto
                {
                    MeatType = product.DetailDescription.MeatType,
                    Process = product.DetailDescription.Process,
                    Weight = product.DetailDescription.Weight,
                    Nutrition = product.DetailDescription.Nutrition,
                    Origin = product.DetailDescription.Origin,
                    ShelfLife = product.DetailDescription.ShelfLife
                } : null
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, createdProductDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _context.Products
                                        .Include(p => p.DetailDescription)
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound($"Produkt s ID {id} nebyl nalezen.");
            }

            if (productDto.Name != null) product.Name = productDto.Name;
            if (productDto.Price.HasValue) product.Price = productDto.Price.Value;
            if (productDto.Currency != null) product.Currency = productDto.Currency;
            if (productDto.ImageUrl != null) product.ImageUrl = productDto.ImageUrl;
            if (productDto.Description != null) product.Description = productDto.Description;
            if (productDto.Category != null) product.Category = productDto.Category;

            if (productDto.DetailDescription != null)
            {
                if (product.DetailDescription == null)
                {
                    product.DetailDescription = new ProductDetailDescription();
                }
                if (productDto.DetailDescription.MeatType != null) product.DetailDescription.MeatType = productDto.DetailDescription.MeatType;
                if (productDto.DetailDescription.Process != null) product.DetailDescription.Process = productDto.DetailDescription.Process;
                if (productDto.DetailDescription.Weight != null) product.DetailDescription.Weight = productDto.DetailDescription.Weight;
                if (productDto.DetailDescription.Nutrition != null) product.DetailDescription.Nutrition = productDto.DetailDescription.Nutrition;
                if (productDto.DetailDescription.Origin != null) product.DetailDescription.Origin = productDto.DetailDescription.Origin;
                if (productDto.DetailDescription.ShelfLife != null) product.DetailDescription.ShelfLife = productDto.DetailDescription.ShelfLife;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                {
                    return NotFound($"Produkt s ID {id} nebyl nalezen.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound($"Produkt s ID {id} nebyl nalezen.");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}