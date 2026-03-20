import { DeputadoCard } from '@/components/DeputadoCard';
import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Deputado } from '@/types/deputado';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';


const Index = () => {
  const [deputados, setDeputados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Verifique se a URL termina com /api/deputados (conforme sua Controller [Route])
    fetch(`${import.meta.env.VITE_API_URL}/api/deputados`)
      .then(res => res.json())
      .then(data => {
        // Ajuste aqui: se sua API retornar um objeto com { dados: [...] }, use data.dados
        const listaSaneada = Array.isArray(data) ? data : (data.dados || []);
        setDeputados(listaSaneada);
      })
      .catch(err => console.error('Erro ao carregar deputados:', err));
  }, []);

  const deputadosFiltrados = deputados.filter(deputado =>
    // Ajustado para bater com as propriedades do C# (camelCase)
    deputado.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deputado.siglaPartido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deputado.siglaUf?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetar página ao filtrar
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Calcular paginação
  const totalPages = Math.ceil(deputadosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const deputadosPaginados = deputadosFiltrados.slice(startIndex, endIndex);

  // Limitando a quantidade de números paginados
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const pages: (number | 'dots')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1); // Sempre mostra a primeira

    if (currentPage > 4) pages.push('dots');

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) pages.push('dots');

    pages.push(totalPages); // Sempre mostra a última

    return pages;
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-info text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-12 h-12" />
              <h1 className="text-4xl font-bold">Painel de Gastos dos Deputados</h1>
            </div>
            <p className="text-xl opacity-90 mb-8">
              Transparência e acompanhamento dos gastos públicos
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nome, partido ou UF..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Deputados ({deputadosFiltrados.length})
          </h2>
          <p className="text-muted-foreground">
            Clique em "Ver Gastos" para visualizar o detalhamento das despesas de cada deputado
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {deputadosPaginados.map((deputado: Deputado) => (
            <DeputadoCard key={deputado.id} deputado={deputado} />
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="w-full overflow-x-auto">
            <Pagination className="mx-auto w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getVisiblePages(currentPage, totalPages).map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'dots' ? (
                      <span className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {deputadosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum deputado encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os termos da sua busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
