// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();
      
router.get('/', async (req, res)=>{
  try {
    // Me aseguro de que sea array
    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    const usuario = req.username;


    const productos = await Productos.find({}) ;
    const productosCarrito = req.session.carrito.length;
    res.render('home.html', { productos, productosCarrito, usuario })    // ../views/portada.html, 
  } catch (err) {       
    console.error('Error al consultar productos:', err);                         // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/producto_:id', async (req, res) => {
  // Convertir el ID a un número
  const productoId = parseInt(req.params.id, 10);

  const usuario = req.username;


  try {
      // Busco el producto por el ID
      const producto = await Productos.findOne({ id: productoId });

      res.render('producto.html', { producto , usuario}); //renderizo con el producto encontrado
  } catch (err) {
      console.error('Error al consultar el producto:', err.message); 
      res.status(500).send({ err: err.message }); 
  }
});

router.get('/carrito', async (req, res) => {

  try {
      // Me aseguro de que sea array y si no existe
      if (!req.session.carrito) {
        req.session.carrito = [];
      }

      const usuario = req.username;

      // Array para almacenar productos
      const productos = [];
      let precio_total = 0;

      // 
      for (const item of req.session.carrito) {
        // Busco en los productos los que estan en el carrito
        const producto = await Productos.findOne({ id: item.id });
        if (producto) {
          productos.push(producto);
          precio_total += producto.price; // Suma al precio al total
        }
    }


      res.render('carrito.html', { productos , precio_total, usuario}); // Renderizar la vista de los productos y su suma total
  } catch (err) {
      console.error('Error al consultar el producto:', err.message); 
      res.status(500).send({ err: err.message }); 
  }
});


router.post('/buscar',express.urlencoded({ extended: true}), async (req,res) => {
  const busqueda = req.body.search;

  const usuario = req.username;


  try{
    const productos = await Productos.find({
      $or: [
        { title: { $regex: '\\b' + busqueda + '\\b', $options: 'i' } }, 
        { description: { $regex: '\\b' + busqueda + '\\b', $options: 'i' } } 
      ]
    });
    res.render('home.html', { productos, usuario });
  } catch (err) {
    console.error('Error al consultar el producto:', err.message); 
    res.status(500).send({ err: err.message });
  }
});

router.post('/Anadir_carrito', async (req, res) => {
  const productoId = req.body.productoId; 

  if (!req.session.carrito) {
      req.session.carrito = [];
  }

  req.session.carrito.push({ id: productoId}); // Agrega el nuevo producto al carrito

  res.redirect("/");
});

router.post('/Quitar_carrito', async (req, res) => {
  const productoId = req.body.productoId;
  
  const usuario = req.username;


  if (!req.session.carrito) {
    req.session.carrito = [];
  }

  const index = req.session.carrito.findIndex(item => item.id === productoId);

  if (index !== -1) {
    req.session.carrito.splice(index, 1); // Elimina solo la primera vez que lo pilla
  }

  res.redirect("/carrito");
});



router.get('/categoria_jewelery', async (req, res)=>{
  try {
    const productos = await Productos.find({ category: 'jewelery' });
    const usuario = req.username;

    res.render('home.html', { productos, usuario })  
  } catch (err) {       
    console.error('Error al consultar productos:', err);                
  }
})

router.get('/categoria_mens_clothing', async (req, res)=>{
  try {
    const productos = await Productos.find({ category: "men's clothing" });
    const usuario = req.username;

    res.render('home.html', { productos, usuario }) 
  } catch (err) {       
    console.error('Error al consultar productos:', err);      
    res.status(500).send({err})
  }
})

router.get('/categoria_electronics', async (req, res)=>{
  try {
    const productos = await Productos.find({ category: 'electronics' });
    const usuario = req.username;

    res.render('home.html', { productos, usuario })  
  } catch (err) {       
    console.error('Error al consultar productos:', err);   
    res.status(500).send({err})
  }
})

router.get('/categoria_womens_clothing', async (req, res)=>{
  try {
    const productos = await Productos.find({ category: "women's clothing" });
    const usuario = req.username;

    res.render('home.html', { productos, usuario }) 
  } catch (err) {       
    console.error('Error al consultar productos:', err);      
    res.status(500).send({err})
  }
})

// ... más rutas aquí

export default router