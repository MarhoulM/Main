using System.ComponentModel.DataAnnotations;

namespace Evidence.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Author { get; set; }
        public string? Director { get; set; }

        public  string Category { get; set; }
        public string Genre { get; set; }
        public string Description { get; set; }
        public string Borrowed { get; set; }

        public DateTime DateOfAcquisition { get; set; }
        public bool Availability { get; set; }
    }
}
