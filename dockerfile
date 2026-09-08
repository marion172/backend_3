FROM node:20-alpine

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el código fuente de la aplicación
COPY . .

# Exponer el puerto por defecto de la API
EXPOSE 3000

# Variable de entorno de producción por defecto
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]