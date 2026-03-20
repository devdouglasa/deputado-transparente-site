using api_asp.Data;
using api_asp.Models;
using api_asp.Services;
using Microsoft.EntityFrameworkCore;

namespace api_asp.Workers
{
    public class DadosCamaraWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DadosCamaraWorker> logger;

        public DadosCamaraWorker(IServiceProvider serviceProvider, ILogger<DadosCamaraWorker> logger)
        {
            _serviceProvider = serviceProvider;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                logger.LogInformation("Worker iniciado: Sincronizando Deputados e Despesas...");

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var _apiService = scope.ServiceProvider.GetRequiredService<CamaraApiService>();
                        var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var deputadosApi = await _apiService.ObterDeputados();

                        foreach (Deputado depApi in deputadosApi)
                        {
                            var deputadoBanco = await _context.Deputados
                                .FirstOrDefaultAsync(d => d.Id == depApi.Id, stoppingToken);

                            if (deputadoBanco == null)
                            {
                                _context.Deputados.Add(depApi);
                                deputadoBanco = depApi; 

                                await _context.SaveChangesAsync(stoppingToken);
                            }

                            var despesasApi = await _apiService.ObterDespesasPorId(depApi.Id);

                            foreach (var despApi in despesasApi)
                            {
                                var despesaExiste = await _context.Despesas.AnyAsync(d =>
                                    d.DeputadoId == depApi.Id &&
                                    d.DataDocumento == despApi.DataDocumento &&
                                    d.ValorDocumento == despApi.ValorDocumento &&
                                    d.TipoDespesa == despApi.TipoDespesa, 
                                    stoppingToken);

                                if (!despesaExiste)
                                {
                                    despApi.DeputadoId = depApi.Id;
                                    _context.Despesas.Add(despApi);
                                }
                            }
                            
                            await _context.SaveChangesAsync(stoppingToken);
                        }

                        logger.LogInformation("Sincronização completa!");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Erro fatal na sincronização em background.");
                }

                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }
    }
}