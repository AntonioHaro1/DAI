// seed.js

import fs from 'fs';
import path from 'path'; 
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Collection, MongoClient } from 'mongodb'
import fetch from 'node-fetch';



  
console.log( '🏁 seed.js ----------------->')

// del archivo .env
const USER_DB = process.env.USER_DB
const PASS    = process.env.PASS
  
const url    = `mongodb://${USER_DB}:${PASS}@localhost:27017`
const client = new MongoClient(url);
  
// Database Name
const dbName = 'myProject';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// función asíncrona
async function Inserta_datos_en_colección (colección, url) {
                                  
    try {
      const datos = await fetch(url).then(res => res.json())
      //console.log(datos)
      
      // me conecto a la base de datos
      await client.connect();
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      
      const collection = db.collection(colección);
      //insertar los datos
      const insertResult = await collection.insertMany(datos);
      console.log(` Insertados ${insertResult.insertedCount} documentos en la colección ${colección}`);

      const documentos = await collection.find({}).toArray();

      console.log('Documentos en la colección:', documentos);
    
      // cerramos la conexion
      await client.close();
      console.log('Conexión cerrada');

      return `${datos.length} datos traidos para ${colección}`

  }catch (err) {
    console.error(`Error al insertar datos en la colección ${colección}:`, err.message);
    throw new Error(`Error en fetch ${colección}: ${err.message}`);
  }
}

// Función para consultar productos con precio mayor a 100
async function Consulta_productos_100() {
  try {
      // Acceder a la base de datos
      const db = client.db(dbName);
      const collection = db.collection('productos');

      // Consultar productos con precio mayor a 100 // gt = greaterthan 
      const productos100 = await collection.find({ price: {$gt: 100 }  }).toArray();
      console.log('Productos con precio mayor a 100:', productos100);

  } catch (err) {
      console.error(`Error en Consulta_productos_100: ${err.message}`);
  }
}

// Función para consultar productos con la palabra winter en la descripcion
async function Consulta_productos_winter() {
  try {

      // Acceder a la base de datos
      const db = client.db(dbName);
      const collection = db.collection('productos');

      // paso a array para trabajar con ellos
      const todosLosProductos = await collection.find().toArray();

      // Creo un array donde almacenare los productos con la palabra winter
      // y la expresion winter con espacios para que no se confunda con otra palabra compuesta
      const productoswinter = new Array;
      const palabrawinter = new RegExp('\\bwinter\\b', 'gi');

      // busco los productos y los meto en el array
      todosLosProductos.forEach(producto => {
        if(palabrawinter.test(producto.description)){
          productoswinter.push(producto);
        }

      });

      //ordenar los productos por precio
      productoswinter.sort((a,b) => a.price - b.price);

      console.log('Productos con la palabra winter', productoswinter);

  } catch (err) {
      console.error(`Error en Consulta_productos_winter: ${err.message}`);
  }
}

// Función para consultar productos joyeria ordenado por el rating
async function Consulta_productos_rating() {
  try {

    // Acceder a la base de datos
    const db = client.db(dbName);
    const collection = db.collection('productos');

    // Consultar productos de la categoria joyeria
    const productosjoyeria = await collection.find({ category: 'jewelery' }).toArray();

    //ordenar la joyeria por rating
    productosjoyeria.sort((a,b) => b.rating.rate - a.rating.rate);

    console.log('Productos ordenados por rating', productosjoyeria);

} catch (err) {
    console.error(`Error en Consulta_productos_rating: ${err.message}`);
}

}

// Función para consultar las reseñas
async function Consulta_reseñas() {

  try {

    // Acceder a la base de datos
    const db = client.db(dbName);
    const collection = db.collection('productos');

    // pasar a arrays todos los productos
    const todosLosProductos = await collection.find().toArray();
    var ratings = 0;

    // sumamos los rating de cada producto
    todosLosProductos.forEach(producto => {
      ratings += producto.rating.count;
    })

    console.log('Reseñas totales', ratings);

  } catch (err) {
    console.error(`Error en Consulta_rating: ${err.message}`);

  }
}

// Función para consultar las reseñas
async function Consulta_puntuacion_media() {
  try {

    // Acceder a la base de datos
    const db = client.db(dbName);
    const collection = db.collection('productos');

    // pasar a arrays todos los productos
    const todosLosProductos = await collection.find().toArray();
    let categorias = new Map();

    // sumamos los rating de cada producto
    todosLosProductos.forEach(producto => {
      if(!categorias.has(producto.category)){
        categorias.set(producto.category, { productos : 1 , suma : producto.rating.rate, media : producto.rating.rate});
      }else{
        // Si la categoría ya existe, actualizamos los valores
        let categoriaData = categorias.get(producto.category);
    
        // Actualizamos la cantidad de productos y la suma de ratings
        categoriaData.productos += 1;
        categoriaData.suma += producto.rating.rate;
    
        // Recalculamos la media
        categoriaData.media = categoriaData.suma / categoriaData.productos;
    
        // Guardamos nuevamente los valores actualizados
        categorias.set(producto.category, categoriaData);
      }
    })

    console.log('Media ', categorias);

} catch (err) {
    console.error(`Error en Consulta_rating: ${err.message}`);
}
}

// Función para consultar las reseñas
async function Consulta_users_sin_numeros() {
  try {

    // Acceder a la base de datos
    const db = client.db(dbName);
    const collection = db.collection('usuarios');

    // pasar a arrays todos los usuarios
    const todosLosUsuarios = await collection.find().toArray();

    // te consigue los usuario si en la contraseña no hay ningun digito gracias a \d/
    const usuariosSinNumerosEnContraseña = todosLosUsuarios.filter(usuario => {
      return !/\d/.test(usuario.password);
    });

    console.log('Media ', usuariosSinNumerosEnContraseña);

} catch (err) {
    console.error(`Error en Consulta_rating: ${err.message}`);
}
}
// Funcion para descargar imagenes
async function descargarImagenes() {
  const rutaCarpeta = path.resolve(__dirname, 'imagenes');

  // Acceder a la base de datos
  const db = client.db(dbName);
  const collection = db.collection('productos');
  
  // paso a array para trabajar con ellos
  const todosLosProductos = await collection.find().toArray();

  todosLosProductos.forEach(async imagen => {
    const url = imagen.image;
    const nombreImagen =  `${Tituloimagen(imagen.title)}.jpg`;
    const rutaArchivo = path.resolve(rutaCarpeta, nombreImagen); // Ruta donde guardo la imagen

    try{
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });

      // Crear el stream para guardar la imagen en el archivo
      const writer = fs.createWriteStream(rutaArchivo);

      // introduce datos en el archivo
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch(error){
      console.error('Error al descargar la imagen:', error);
    }
    
  });

}
// funcion para quitar caracteres no permitidos o raros del nombre
function Tituloimagen(fileName) {
  return fileName.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-'); 
}
  
// Inserción consecutiva
/*
Inserta_datos_en_colección('productos', 'https://fakestoreapi.com/products')
   .then((r)=>console.log(`Todo bien: ${r}`))                                 // OK
   .then(()=>Inserta_datos_en_colección('usuarios', 'https://fakestoreapi.com/users'))
   .then((r)=>console.log(`Todo bien: ${r}`))                                // OK
   .catch((err)=>console.error('Algo mal: ', err.errorResponse))             // error
  
  */

async function seed() {
  
  try{

    await client.connect();
    console.log('Connected successfully to server');

    await Consulta_productos_100()
      .then(() => console.log('Consulta de productos mas de 100 euros completada.'))
      .catch((err) => console.error('Algo mal: ', err.message));

    await Consulta_productos_winter()
      .then(() => console.log('Consulta de productos con la palabra winter en su descripcion completada'))
      .catch((err) => console.error('Algo mal: ', err.message));

    await Consulta_productos_rating()
      .then(() => console.log('Consulta de productos joyeria completada'))
      .catch((err) => console.error('Algo mal: ', err.message));

    await Consulta_reseñas()
      .then(() => console.log('Consulta los ratings totales completada'))
      .catch((err) => console.error('Algo mal: ', err.message));
    
    await Consulta_puntuacion_media()
      .then(() => console.log('Consulta la puntuacion media por categoria completada'))
      .catch((err) => console.error('Algo mal: ', err.message));

    await Consulta_users_sin_numeros()
      .then(() => console.log('Consulta de los usuarios sin numeros en la contraseña completada'))
      .catch((err) => console.error('Algo mal: ', err.message));

    await descargarImagenes()
      .then(() => console.log('Imagenes de los productos descargadas  '))
      .catch((err) => console.error('Algo mal: ', err.message));

  } finally{
         // Cerrar la conexión
    await client.close();
    console.log('Conexión cerrada');
  }
}

seed()
  .then(() => console.log('Consultas completadas.'))
  .catch((err) => console.error('Algo mal: ', err.message));


console.log('Lo primero que pasa')
