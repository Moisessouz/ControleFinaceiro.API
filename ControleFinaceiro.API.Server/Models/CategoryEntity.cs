using System.ComponentModel.DataAnnotations;

namespace ControleFinaceiro.API.Server.Models
{
    public class CategoryEntity
    {
        public Guid Id { get; set; }
        [Required]
        [MaxLength(400)]
        public string Description { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
    }
}
