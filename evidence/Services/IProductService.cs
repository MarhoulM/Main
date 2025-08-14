using Evidence.DTOs;
using Evidence.Models;

namespace Evidence.Services
{
    public interface IProductService
    {
        Task<ProductDto> CreateProductAsync(ProductDto dto, int userId);
        Task<IEnumerable<ProductDto>> SearchProductAsync(string query);
        Task<Product> GetProductAsync(int id);
        Task<ProductDto> UpdateProductAsync(int id, ProductDto dto);
        Task<bool> DeleteProductAsync(int id);
    }
}
