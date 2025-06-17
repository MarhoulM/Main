using meetmeatApi.Models;

namespace meetmeatApi.Dtos 
{
    public class ProductReadDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Currency { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public required string Category { get; set; }
        public ProductDetailDescriptionReadDto? DetailDescription { get; set; }
    }

    public class ProductDetailDescriptionReadDto
    {
        public string? MeatType { get; set; }
        public string? Process { get; set; }
        public string? Weight { get; set; }
        public string? Nutrition { get; set; }
        public string? Origin { get; set; }
        public string? ShelfLife { get; set; }
    }
}
