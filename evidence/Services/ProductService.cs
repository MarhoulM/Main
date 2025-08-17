using Evidence.Data;
using Evidence.DTOs;
using Evidence.Models;
using Microsoft.EntityFrameworkCore;

namespace Evidence.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ApplicationDbContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ProductDto> CreateProductAsync(ProductDto dto, int userId)
        {
            var newProduct = new Product
            {
                Id = dto.Id,
                Name = dto.Name,
                Author = dto.Author,
                Director = dto.Director,
                Category = dto.Category,
                Genre = dto.Genre,
                Description = dto.Description,
                Borrowed = dto.Borrowed,
                DateOfAcquisition = dto.DateOfAcquisition,
                Availability = dto.Availability
            };

            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"New Product created.");
            return new ProductDto
            {
                Id = newProduct.Id,
                Name = newProduct.Name,
                Author = newProduct.Author,
                Director = newProduct.Director,
                Category = newProduct.Category,
                Genre = newProduct.Genre,
                Description = newProduct.Description,
                Borrowed = newProduct.Borrowed,
                DateOfAcquisition = newProduct.DateOfAcquisition,
                Availability = newProduct.Availability
            };
        }
        public async Task<Product> GetProductAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }
        public async Task<IEnumerable<ProductDto>> SearchProductAsync(string query)
        {
            if (string.IsNullOrEmpty(query))
                return Enumerable.Empty<ProductDto>();
            return await _context.Products
                .Where(p => EF.Functions.Like(p.Name, $"%{query}%") ||
                            EF.Functions.Like(p.Category, $"%{query}%") ||
                            EF.Functions.Like(p.Director, $"%{query}%") ||
                            EF.Functions.Like(p.Genre, $"%{query}%"))
                .OrderBy(p => p.Name)
                .Take(20)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Author = p.Author!,
                    Director = p.Director!,
                    Genre = p.Genre,
                    Description = p.Description!,
                    Borrowed = p.Borrowed!,
                    DateOfAcquisition = p.DateOfAcquisition,
                    Availability = p.Availability
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            return await _context.Products
                .OrderBy(p => p.Name)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Author = p.Author!,
                    Director = p.Director!,
                    Category = p.Category,
                    Genre = p.Genre,
                    Description = p.Description!,
                    Borrowed = p.Borrowed!,
                    DateOfAcquisition = p.DateOfAcquisition,
                    Availability = p.Availability
                })
                .ToListAsync();
        }
        public async Task<ProductDto> UpdateProductAsync(int id, ProductDto dto)
        {
            _logger.LogInformation($"Searching for Product ID: {id}");
            if(id <= 0)
            {
                _logger.LogWarning($"Invalid ID: {id}");
                return null;
            }

            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
            {
                _logger.LogWarning($"ID: {id} has no Product");
                return null;
            }
            //existingProduct.Id = dto.Id;
            existingProduct.Name = dto.Name;
            existingProduct.Author = dto.Author;
            existingProduct.Director = dto.Director;
            existingProduct.Category = dto.Category;
            existingProduct.Genre = dto.Genre;
            existingProduct.Description = dto.Description;
            existingProduct.Borrowed = dto.Borrowed;
            existingProduct.DateOfAcquisition = dto.DateOfAcquisition;
            existingProduct.Availability = dto.Availability;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Product updated for ID: {id}.");
            return new ProductDto
            {
                Name = existingProduct.Name,
                Author = existingProduct.Author,
                Director = existingProduct.Director,
                Category = existingProduct.Category,
                Genre = existingProduct.Genre,
                Description = existingProduct.Description,
                Borrowed = existingProduct.Borrowed,
                DateOfAcquisition = existingProduct.DateOfAcquisition,
                Availability = existingProduct.Availability
            };
        }

        //PATCH
        public async Task<PatchProductDto> PatchProductAsync(int id, PatchProductDto dto)
        {
            _logger.LogInformation($"Searching for Product ID: {id}");
            if (id <= 0)
            {
                _logger.LogWarning($"Invalid ID: {id}");
                return null;
            }

            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
            {
                _logger.LogWarning($"ID: {id} has no Product");
                return null;
            }
            //existingProduct.Id = dto.Id;
            existingProduct.Borrowed = dto.Borrowed;
            existingProduct.Availability = dto.Availability;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Product updated for ID: {id}.");
            return new PatchProductDto
            {
                Borrowed = existingProduct.Borrowed,
                Availability = existingProduct.Availability
            };
        }
        public async Task<bool> DeleteProductAsync(int id)
        {
            _logger.LogInformation($"Searching Product ID: {id}");

            if (id <= 0)
            {
                _logger.LogWarning($"Invalid ID: {id}");
                return false;
            }

            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
            {
                _logger.LogWarning($"No Product found for ID: {id}");
                return false;
            }
            _context.Products.Remove(existingProduct);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Product ID {id} deleted.");
            return true;
        }
    }
}
