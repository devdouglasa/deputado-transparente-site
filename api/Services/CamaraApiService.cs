using api_asp.Models;

namespace api_asp.Services
{
    public class CamaraApiService(HttpClient http)
    {
        private readonly HttpClient _http = http;
        private const string BaseUrl = "https://dadosabertos.camara.leg.br/api/v2";

        public async Task<List<Deputado>> ObterDeputados()
        {
            List<Deputado> deputadosCompletos = [];

            var response = await _http.GetFromJsonAsync<DeputadosResponse>($"{BaseUrl}/deputados");

            var deputados = response.Dados;

            foreach (Deputado deputado in deputados)
            {
                var responseDetail = await _http.GetFromJsonAsync<DeputadoDetalhadoResponse>($"{BaseUrl}/deputados/{deputado.Id}");

                var deputadoDetalhado = responseDetail.Dados;

                deputado.NomeCivil = deputadoDetalhado.NomeCivil;
                deputado.Cpf = deputadoDetalhado.Cpf;
                deputado.DataNascimento = deputadoDetalhado.DataNascimento;
                deputado.Sexo = deputadoDetalhado.Sexo;

                deputadosCompletos.Add(deputado);
            }

            return deputadosCompletos;
        }

        public async Task<List<Despesa>> ObterDespesasPorId(int id)
        {
            List<Despesa> despesas = [];

            var response = await _http.GetFromJsonAsync<DespesaResponse>($"{BaseUrl}/deputados/{id}/despesas");

            var despesa = response.Dados;

            despesas.AddRange(despesa);

            return despesas;
        }
    }
}