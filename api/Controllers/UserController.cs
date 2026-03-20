using api_asp.Data;
using api_asp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api_asp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public UserController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _appDbContext.Add(user);
            await _appDbContext.SaveChangesAsync();

            return Created("Usuário criado com sucesso!", user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _appDbContext.Users.ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetOneUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Usuário não encontrado!"
                });
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User userAtualizado)
        {
            var user = await _appDbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Usuário não encontrado!"
                });
            }

            _appDbContext.Entry(user).CurrentValues.SetValues(userAtualizado);

            await _appDbContext.SaveChangesAsync();

            return StatusCode(201, user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Usuário não encontrado!"
                });
            }

            _appDbContext.Users.Remove(user);

            await _appDbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "Usuário deletado com sucesso!"
            });
        }
    }
}