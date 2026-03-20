FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# O Vite precisa da variável de ambiente no build se for estático
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Servidor leve para os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copia config do nginx se tiver (opcional)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]