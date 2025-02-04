# Use una imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

EXPOSE 8000

# Definir variables de entorno
ENV IN=production
ENV USER_DB=root
ENV PASS=example
ENV SECRET_KEY="EsTa MisMa:i8775tyjk,"
ENV DB_HOST=mongo  

# Comando para ejecutar la aplicación
CMD ["node", "tienda.js"]