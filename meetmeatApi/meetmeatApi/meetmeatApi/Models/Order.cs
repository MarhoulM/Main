using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace meetmeatApi.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required(ErrorMessage = "Jméno je povinné.")]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Příjmení je povinné.")]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-mail je povinný.")]
        [EmailAddress(ErrorMessage = "Neplatný formát e-mailu.")]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Adresa je povinná.")]
        [MaxLength(255)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Město je povinné.")]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

   
        [Required(ErrorMessage = "PSČ je povinné.")]
        [MaxLength(10)]
        public string ZipCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon je povinný.")]
        [Phone(ErrorMessage = "Neplatný formát telefonního čísla.")]
        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Způsob doručení je povinný.")]
        [MaxLength(50)]
        public string DeliveryMethod { get; set; } = string.Empty;

        [Required(ErrorMessage = "Způsob platby je povinný.")]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Note { get; set; } 


        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    }
}
