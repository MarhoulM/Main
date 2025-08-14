using System.ComponentModel.DataAnnotations;

namespace Evidence.DTOs
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Uživatelské jméno je povinné.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Uživatelské jméno musí mít od 3 do 50 znaků.")]
        public required string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Heslo je povinné.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Heslo musí obsahovat od 6 do 50 znaků.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}
