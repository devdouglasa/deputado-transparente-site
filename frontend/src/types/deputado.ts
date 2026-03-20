export interface Deputado {
  id: string;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  sexo: string;
  dataNascimento: string;
}

export interface Despesa {
  deputadoId: string;
  ano: string;
  mes: string;
  tipoDespesa: string;
  valorDocumento: number;
  nomeFornecedor: string;
  dataDocumento: string;
  numeroDocumento: string;
}

export interface GastosDeputado {
  deputado: Deputado;
  despesas: Despesa[];
  totalGasto: number;
}