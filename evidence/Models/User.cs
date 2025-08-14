using System.ComponentModel.DataAnnotations;

namespace Evidence.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public required string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public required string PasswordHash { get; set; }

        public bool Admin { get; set; }
        //V budoucnu možnoo rozšířit o možnost zapůjčení
        //public ICollection<RentalItem> ReantalItems {get; set;} = new List<RentalItem>();
    }
}
