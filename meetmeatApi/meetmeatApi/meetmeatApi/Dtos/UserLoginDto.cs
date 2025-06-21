using System.ComponentModel.DataAnnotations;

namespace meetmeatApi.Dtos
{
    public class UserLoginDto
    {
        [Required(ErrorMessage ="Uživatelské jméno je povinné.")]
        public required string Username { get; set; }
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage ="Helso je povinné.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}
