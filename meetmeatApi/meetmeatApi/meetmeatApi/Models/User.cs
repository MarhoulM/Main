using System.ComponentModel.DataAnnotations;

namespace meetmeatApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public required string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public required string PasswordHash { get; set; }
    }
}
