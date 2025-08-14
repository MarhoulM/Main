using System.ComponentModel.DataAnnotations;

namespace Evidence.DTOs
{
    public class UserLoginDto
    {
        [Required(ErrorMessage = "Uživatelské jméno je povinné.")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Heslo je povinné.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}
