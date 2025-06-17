using Microsoft.OpenApi.MicrosoftExtensions;
using System.ComponentModel.DataAnnotations;


namespace meetmeatApi.Dtos
{
    public class EmailRequestDto
    {
        [Required(ErrorMessage = "E-mail je povinný.")]
        [EmailAddress(ErrorMessage = "Neplatný formát e-mailové adresy.")]
        public string To { get; set; }
        [Required(ErrorMessage = "Předmět je povinný.")]
        public string Subject { get; set; }
        [Required(ErrorMessage = "Zpráva je povinná.")]
        public string Body { get; set; }
    }
}
