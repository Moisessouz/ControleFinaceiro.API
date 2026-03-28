using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleFinaceiro.API.Server.Models
{
    public class PersonEntity
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int Age { get; set; }

        // Navegação para o EF Core saber que uma pessoa tem várias transações
        [JsonIgnore]
        public ICollection<TransactionEntity> Transactions { get; set; } = new List<TransactionEntity>();
    }
}
