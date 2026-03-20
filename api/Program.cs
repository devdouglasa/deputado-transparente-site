using api_asp.Data;
using api_asp.Services;
using api_asp.Workers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// ADD API SERVICE
builder.Services.AddHttpClient<CamaraApiService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// ADD WORKER SERVICE
builder.Services.AddHostedService<DadosCamaraWorker>();


// CONECTIONSTRING DATABASE
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

var app = builder.Build();

// --- EXECUTA AS MIGRATIONS AUTOMATICAMENTE ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Isso aplica todas as Migrations pendentes e cria o banco/tabelas
        context.Database.Migrate();
        Console.WriteLine("MIGRAÇÕES APLICADAS COM SUCESSO!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"ERRO AO APLICAR MIGRAÇÕES: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
