using System.ComponentModel.DataAnnotations;

namespace Evidence.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Název produktu je povinný.")]
        [StringLength(100)]
        public required string Name { get; set; }
        public string? Author { get; set; }
        public  string? Director { get; set; }
        [Required(ErrorMessage = "Kategorie je povinná.")]
        [StringLength(100)]
        public required string Category {  get; set; }
        [Required(ErrorMessage = "Žánr je povinný.")]
        [StringLength(100)]
        public required string Genre { get; set; }
        public string? Description { get; set; }
        public string? Borrowed { get; set; }
        public DateTime DateOfAcquisition { get; set; }
        public bool Availability { get; set; }


    }
}
