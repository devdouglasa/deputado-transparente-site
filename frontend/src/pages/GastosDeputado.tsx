import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, TrendingUp, DollarSign, FileText, Calendar } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';

export const GastosDeputado = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gastosData, setGastosData] = useState<{
    deputado: any;
    despesas: any[];
    totalGasto: number;
  } | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/deputados/${id}/despesas`)
    .then(res => res.json())
    .then(data => {
      setGastosData(data)
    })
    .catch(err => {
      console.error('Erro ao carregar as despesas:', err);
    });
  }, [id]);
  
  if (!gastosData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando despesas...</h1>
        </div>
      </div>
    );
  }

  const { deputado, despesas, totalGasto } = gastosData;
  
  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatCurrency = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Agregar despesas por tipo para o gráfico
  const despesasPorTipo = despesas.reduce((acc, despesa) => {
    const tipo = despesa.tipoDespesa;
    if (!acc[tipo]) {
      acc[tipo] = 0;
    }
    acc[tipo] += Number(despesa.valorDocumento);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(despesasPorTipo).map(([tipo, valor]) => ({
    tipo,
    valor,
    valorFormatado: formatCurrency(valor as number)
  }));

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const pieData = chartData.map((item, index) => ({
    ...item,
    color: pieColors[index % pieColors.length]
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Button>

          

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={deputado.urlFoto} alt={deputado.nome} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(deputado.nome)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {deputado.nome}
                  </h1>
                  <div className="flex gap-3">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {deputado.siglaPartido} - {deputado.siglaUf}
                    </Badge>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {despesas.length} despesas registradas
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total de Gastos</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(totalGasto)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gasto Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalGasto)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Despesas</p>
                  <p className="text-2xl font-bold">{despesas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Média por Despesa</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalGasto / despesas.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Tipo de Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="tipo" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Valor']}
                    labelFormatter={(label) => `Tipo: ${label}`}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="valor"
                    label={({ tipo, valor }) => `${tipo}: ${formatCurrency(valor)}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Lista detalhada de despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento das Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {despesas.map((despesa) => (
                <div 
                  key={despesa.deputadoId}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{despesa.tipoDespesa}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(despesa.dataDocumento).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{despesa.nomeFornecedor}</h4>
                      <p className="text-sm text-muted-foreground">
                        Documento: {despesa.numeroDocumento}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(despesa.valorDocumento)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};