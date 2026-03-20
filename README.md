# Sistema Deputado Transparente

### Sistema de acompanhamento de gastos de deputados.


### ➦ Tecnologias utilizadas:

- .NET / C# - SDK Version 10.0
- React
- PostgreSQL
- Docker
- Git
- Github

### ➦ Rodando a aplicação:

No seu terminal (bash/powershell/cmd), digite os seguintes comandos:

Será necessário ter o Git instalado na sua máquina.

```
git clone https://github.com/devdouglasa/deputado-transparente-site.git
```

Entre na pasta do projeto.
```
cd deputado-transparente-site
```
Será necessário ter o docker e o docker-compose instalado na sua máquina.
```
docker compose up --build
```

Pronto, sua aplicação irá começar a buildar! <br>
Talvez demore um pouco dependendo da sua maquina.


A aplicação estará disponivel no endereço http://localhost:3000

Caso entre no site e não exiba nenhum dado, aguarde um pouco até o Worker popular o banco de dados.


### ➦ Observações:

Ao rodar a aplicação pela primeira vez não se asuste com essa tela:

<img src="img/building-app.gif" width="85%">

<br>

É apenas o banco de dados sendo populado pelos dados da API Externa.

### ➦ Fonte de dados:

Todos os dados são da API Pública da [Câmara dos Deputados - Palácio do Congresso Nacional](https://dadosabertos.camara.leg.br/swagger/api.html).

### ➦ Autor:

#### - DevDouglas
#### Para contato, visite o [Meu Site](https://devdouglas.site).