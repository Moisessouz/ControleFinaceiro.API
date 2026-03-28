namespace ControleFinaceiro.API.Server.DTOs
{
    public class TransactionDTO
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public Guid PersonId { get; set; }
    }
}
