import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, User } from 'lucide-react';
import { Deputado } from '@/types/deputado';
import { useNavigate } from 'react-router-dom';

interface DeputadoCardProps {
  deputado: Deputado;
}

export const DeputadoCard = ({ deputado }: DeputadoCardProps) => {
  const navigate = useNavigate();

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getPartidoCor = (partido: string) => {
    const cores: Record<string, string> = {
      'PT': 'bg-red-500',
      'PSDB': 'bg-blue-500',
      'PDT': 'bg-orange-500',
      'PL': 'bg-green-500',
      'PSOL': 'bg-purple-500',
      'MDB': 'bg-yellow-500'
    };
    return cores[partido] || 'bg-gray-500';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={deputado.urlFoto} alt={deputado.nome} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(deputado.nome)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-card-foreground mb-2 truncate">
              {deputado.nome}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`${getPartidoCor(deputado.siglaPartido)} text-white`}>
                {deputado.siglaPartido}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {deputado.siglaUf}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{deputado.sexo == 'M' ? 'Masculino' : 'Feminino'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatarData(deputado.dataNascimento)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6">
        <Button 
          onClick={() => navigate(`/deputado/${deputado.id}/gastos`)}
          className="w-full bg-gradient-to-r from-primary to-info hover:opacity-90 transition-opacity"
        >
          Ver Gastos
        </Button>
      </CardFooter>
    </Card>
  );
};