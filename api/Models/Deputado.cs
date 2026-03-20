using System.ComponentModel.DataAnnotations;

namespace api_asp.Models
{
    public class DeputadosResponse
    {
        public List<Deputado> Dados { get; set; }
    }

    public class DeputadoDetalhadoResponse
    {
        public Deputado Dados { get; set; }
    }

    public class Deputado
    {
        [Key]
        public int Id { get; set; } // O ID VEM DA API
        public string Nome { get; set; }
        public string SiglaPartido { get; set; }
        public string SiglaUf { get; set; }
        public string UrlFoto { get; set; }
        public string Email { get; set; }

        // Endpoint /deputados/{id}
        public string Cpf { get; set; }
        public string DataNascimento { get; set; }
        public string NomeCivil { get; set; }
        public string Sexo { get; set; }

        // Relacionamento com a tabela "despesas"
        public ICollection<Despesa> Despesas { get; set; } = [];
    }
}