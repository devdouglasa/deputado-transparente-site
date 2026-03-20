using api_asp.Data;
using api_asp.Models;
using api_asp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api_asp.Controllers
{
    [ApiController]
    [Route("api/deputados")]
    public class DeputadoController(AppDbContext appDbContext) : ControllerBase
    {
        private readonly AppDbContext _appDbContext = appDbContext;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Deputado>>> ObterDeputados()
        {
            var deputados = await _appDbContext.Deputados.ToListAsync<Deputado>();

            return Ok(deputados);
        }

        [HttpGet("{id}/despesas")]
        public async Task<ActionResult> ObterDespesasPorDeputado(int id)
        {
            var deputado = await _appDbContext.Deputados
                .FirstOrDefaultAsync(d => d.Id == id);

            if (deputado == null)
            {
                return NotFound(new { mensagem = "Deputado não encontrado!" });
            }

            var despesas = await _appDbContext.Despesas
                .Where(d => d.DeputadoId == id)
                .OrderByDescending(d => d.DataDocumento)
                .ToListAsync();

            var resultado = new
            {
                Deputado = deputado,
                Despesas = despesas,
                TotalGasto = despesas.Sum(d => d.ValorDocumento)
            };

            return Ok(resultado);
        }
    }
}