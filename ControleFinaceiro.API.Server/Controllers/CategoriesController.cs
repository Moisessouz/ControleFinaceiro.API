using ControleFinaceiro.API.Server.DTOs;
using ControleFinaceiro.API.Server.Models;
using ControleGastos.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static ControleFinaceiro.API.Server.Models.CategoryEntity;

namespace ControleFinaceiro.API.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoriesController(AppDbContext context) => _context = context;

        private static readonly string[] ValidPurposes = { "despesa", "receita", "ambas" };

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.Categories.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create(CategoryDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Description) || dto.Description.Length > 400)
                return BadRequest("Descrição inválida (máx 400).");
            if (!ValidPurposes.Contains(dto.Purpose))
                return BadRequest("Finalidade inválida (despesa, receita ou ambas).");

            var cat = new CategoryEntity { Id = Guid.NewGuid(), Description = dto.Description.Trim(), Purpose = dto.Purpose };
            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok(cat);
        }
    }
}
