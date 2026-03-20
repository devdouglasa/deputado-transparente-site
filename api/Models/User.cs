
using System.ComponentModel.DataAnnotations;

namespace api_asp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Nome deve conter no máximo 50 caracteres!")]
        public string Name { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Email deve conter no máximo 100 caracteres!")]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}