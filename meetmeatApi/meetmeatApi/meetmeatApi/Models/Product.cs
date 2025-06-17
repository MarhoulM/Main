using System.ComponentModel.DataAnnotations;

namespace meetmeatApi.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Jméno produktu je povinné.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Jméno musí být v rozpětí 3 až 100 znaků.")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Cena produktu je povinná.")]
        [Range(0.01, 10000.00, ErrorMessage ="Cena musí být v rozpětí 0,01 až 10000,00.")]
        public decimal Price { get; set; }
        [Required(ErrorMessage = "Měna je povinná.")]
        [StringLength(3, MinimumLength = 2, ErrorMessage = "Měna musí mít 2-3 znaky (CZK, Kč, EUR, atd.).")]
        public required string Currency { get; set; } = "Kč";
        [Url(ErrorMessage ="Url obrázku není platná.")]
        public string? ImageUrl { get; set; }
        [StringLength(500, ErrorMessage ="Popis nesmí přesáhnout 500 znaků.")]
        public string? Description { get; set; }
        [Required(ErrorMessage ="Kategorie produktu je povinná.")]
        [StringLength(50, ErrorMessage ="Název kategorie nesmí přesáhnout 50 znaků.")]
        public required string Category { get; set; }
        public required ProductDetailDescription DetailDescription { get; set; }
    }
    public class ProductDetailDescription
    {
        [StringLength(50, ErrorMessage ="Typ masa nesmí přesáhnout 50 znaků.")]
        public string? MeatType { get; set; }
        [StringLength(250, ErrorMessage = "Proces nesmí přesáhnout 250 znaků.")]
        public string? Process {  get; set; }
        [StringLength(50, ErrorMessage = "Hmotnost nesmí přesáhnout 50 znaků.")]
        public string? Weight { get; set; }
        [StringLength(200, ErrorMessage = "Výživové údaje nesmí přesáhnout 200 znaků.")]
        public string? Nutrition { get; set; }
        [StringLength(100, ErrorMessage = "Původ nesmí přesáhnout 200 znaků.")]
        public string? Origin { get; set; }
        [StringLength(100, ErrorMessage = "Trvanlivost údaje nesmí přesáhnout 200 znaků.")]
        public string? ShelfLife { get; set; }

    }
}
