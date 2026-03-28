using ControleFinaceiro.API.Server.DTOs;
using ControleFinaceiro.API.Server.Models;
using ControleGastos.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleFinaceiro.API.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TransactionsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.Transactions.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create(TransactionDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Description) || dto.Description.Length > 400)
                return BadRequest("Descrição inválida.");

            if (dto.Amount <= 0)
                return BadRequest("Valor deve ser positivo.");

            if (dto.Type != "despesa" && dto.Type != "receita")
                return BadRequest("Tipo inválido.");

            var person = await _context.Persons.FindAsync(dto.PersonId);
            if (person is null) return BadRequest("Pessoa não encontrada.");

            // Regra: menor de 18 só pode ter despesa
            if (person.Age < 18 && dto.Type != "despesa")
                return BadRequest("Menores de 18 anos só podem ter despesas.");

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category is null) return BadRequest("Categoria não encontrada.");

            // Regra: categoria deve ser compatível com o tipo
            if (category.Purpose != "ambas" && category.Purpose != dto.Type)
                return BadRequest("Categoria incompatível com o tipo da transação.");

            var tx = new TransactionEntity
            {
                Id = Guid.NewGuid(),
                Description = dto.Description.Trim(),
                Amount = dto.Amount,
                Type = dto.Type,
                CategoryId = dto.CategoryId,
                PersonId = dto.PersonId,
                Person = person
            };
            _context.Transactions.Add(tx);
            await _context.SaveChangesAsync();
            return Ok(tx);
        }
    }
}
