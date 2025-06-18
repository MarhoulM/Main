using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace meetmeatApi.Dtos
{
    public class CreateOrderRequestDto
    {
        [Required(ErrorMessage = "Jméno je povinné.")]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Příjmení je povinné.")]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-mail je povinný.")]
        [EmailAddress(ErrorMessage = "Neplatný formát e-mailu.")]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Adresa je povinná.")]
        [MaxLength(255)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Město je povinné.")]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "PSČ je povinné.")]
        [MaxLength(10)]
        public string ZipCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon je povinný.")]
        [Phone(ErrorMessage = "Neplatný formát telefonního čísla.")]
        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Způsob doručení je povinný.")]
        [MaxLength(50)]
        public string DeliveryMethod { get; set; } = string.Empty;

        [Required(ErrorMessage = "Způsob platby je povinný.")]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

 
        [Required(ErrorMessage = "Objednávka musí obsahovat alespoň jednu položku.")]
        [MinLength(1, ErrorMessage = "Objednávka musí obsahovat alespoň jednu položku.")]
        public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();

        [MaxLength(1000)]
        public string? Note { get; set; } 
    }
    public class CreateOrderItemDto
    {

        [Required(ErrorMessage = "ID produktu je povinné.")]
        [Range(1, int.MaxValue, ErrorMessage = "ID produktu musí být kladné číslo.")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Množství je povinné.")]
        [Range(1, 100, ErrorMessage = "Množství musí být mezi 1 a 100.")]
        public int Quantity { get; set; }
    }
}
