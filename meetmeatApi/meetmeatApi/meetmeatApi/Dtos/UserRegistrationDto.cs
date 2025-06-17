using System.ComponentModel.DataAnnotations;

namespace meetmeatApi.Dtos
{
    public class UserRegistrationDto
    {
        [Required(ErrorMessage ="Uživatelské jméno je povinné.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage ="Uživatelské jméno musí mít 3 až 50 znaků.")]
        public required string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage ="Heslo je povinné.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Heslo musí mít alespoň 6 znaků.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}
