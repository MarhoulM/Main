using System.ComponentModel.DataAnnotations;

namespace Evidence.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public required string Username { get; set; }
        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;
        public required string PasswordHash { get; set; }

        //V budoucnu možnoo rozšířit o možnost zapůjčení
        //public ICollection<RentalItem> ReantalItems {get; set;} = new List<RentalItem>();
    }
}
