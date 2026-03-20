using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api_asp.Models
{
    public class DespesaResponse
    {
        public List<Despesa> Dados { get; set; }
    }

    public class Despesa
    {
        [Key]
        public int Id { get; set; }
        public int Ano { get; set; }
        public int Mes { get; set; }
        public string TipoDespesa { get; set; }
        public decimal ValorDocumento { get; set; }
        public string TipoDocumento { get; set; }
        public string NomeFornecedor { get; set; }
        public string DataDocumento { get; set; }
        public string NumeroDocumento { get; set; }

        // CHAVE ESTRANGEIRA
        public int DeputadoId { get; set; }

        // Relacionamento com a tabela "deputados"
        [JsonIgnore]
        public Deputado Deputado { get; set; }
    }
}