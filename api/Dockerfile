# 1. Use o SDK do .NET 10 para o Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copiar arquivos de projeto e restaurar dependências
COPY *.csproj ./
RUN dotnet restore

# Copiar tudo e publicar
COPY . ./
RUN dotnet publish -c Release -o out

# 2. Use o Runtime do .NET 10 para rodar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

# Porta padrão do ASP.NET Core em containers modernos
EXPOSE 8080
ENTRYPOINT ["dotnet", "api-asp.dll"]