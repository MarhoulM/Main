using System.ComponentModel.DataAnnotations;

namespace meetmeatApi.Dtos
{
    public class CreateOrderItemDto
    {
        [Required(ErrorMessage = "ID produktu je povinné.")]
        [Range(1, int.MaxValue, ErrorMessage = "ID produktu musí být kladné číslo.")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Množství je povinné.")]
        [Range(1,100, ErrorMessage = "Množství musí být mezi 1 a 100.")]
        public int Quantity { get; set; }
    }
}
