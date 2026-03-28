using ControleFinaceiro.API.Server.DTOs;
using ControleFinaceiro.API.Server.Models;
using ControleGastos.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static ControleFinaceiro.API.Server.Models.PersonEntity;

namespace ControleFinaceiro.API.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PersonsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.Persons.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var person = await _context.Persons.FindAsync(id);
            return person is null ? NotFound() : Ok(person);
        }

        [HttpPost]
        public async Task<IActionResult> Create(PersonDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length > 200)
                return BadRequest("Nome inválido (máx 200 caracteres).");
            if (dto.Age < 0 || dto.Age > 150)
                return BadRequest("Idade inválida.");

            var person = new PersonEntity { Id = Guid.NewGuid(), Name = dto.Name.Trim(), Age = dto.Age };
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = person.Id }, person);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, PersonDTO dto)
        {
            if (id != dto.Id) return BadRequest();
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length > 200)
                return BadRequest("Nome inválido.");
            if (dto.Age < 0 || dto.Age > 150)
                return BadRequest("Idade inválida.");

            var person = await _context.Persons.FindAsync(id);
            if (person is null) return NotFound();

            person.Name = dto.Name.Trim();
            person.Age = dto.Age;
            await _context.SaveChangesAsync();
            return Ok(person);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var person = await _context.Persons.FindAsync(id);
            if (person is null) return NotFound();

            // Remove transações vinculadas
            var transactions = _context.Transactions.Where(t => t.PersonId == id);
            _context.Transactions.RemoveRange(transactions);
            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
