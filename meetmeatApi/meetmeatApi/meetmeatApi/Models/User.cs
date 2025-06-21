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
        public string Email { get; set; } = string.Empty;
        public required string PasswordHash { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
