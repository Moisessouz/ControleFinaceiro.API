using System.ComponentModel.DataAnnotations;

namespace ControleFinaceiro.API.Server.Models
{
    public class TransactionEntity
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(400)]
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public Guid PersonId { get; set; }
        public required PersonEntity Person { get; set; }
    }
}
