using System;
using System.Collections.Generic;

namespace meetmeatApi.Dtos
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string DeliveryMethod { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string? Note { get; set; }

        public List<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }
}
