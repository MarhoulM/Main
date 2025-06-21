using System.Threading.Tasks;
using meetmeatApi.Dtos;
using meetmeatApi.Models;

namespace meetmeatApi.Services
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(CreateOrderRequestDto request, int? userId = null);
        Task<IEnumerable<OrderResponseDto>> GetUserOrdersAsync(int userId);
        Task<OrderResponseDto?> GetOrderByIdAsync(int orderId, int? userId);
    }
}
