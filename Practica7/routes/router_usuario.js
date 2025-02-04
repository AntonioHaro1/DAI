// ./routes/router_usuario.js
import express from "express";
import Usuarios from "../model/usuario.js";
import Productos from "../model/productos.js";
const routerUsuario = express.Router();
import jwt from "jsonwebtoken"

//mostrar formulario de login
routerUsuario.get('/login', (req, res)=>{

  const usuario = req.username;
  if (!req.session.carrito) {
    req.session.carrito = [];
  }
  const productosCarrito = req.session.carrito.length;

  res.render("login.html", { usuario, productosCarrito});
})


// recoger datos del usuario
routerUsuario.post('/login', async (req, res)=> {

  const username = req.body.username;
  const password = req.body.password;

  const usuario = await Usuarios.findOne({ username: username, password: password });
  

  if(usuario){
    const token = jwt.sign({ usuario: username , admin: usuario.admin},  process.env.SECRET_KEY);     
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === 'production'
    }).render("login.html" , {usuario: username});
  return;
  }else{
    // probar si ha sido por la contraseña o por username o ambos
    const usuario = await Usuarios.findOne({ username: username});
    const usuarioContrase = await Usuarios.findOne({ username: username, password: password});

    if(usuario && !usuarioContrase){
      res.render("login.html", {error1: "Contraseña incorrecta"});
    }

    if(!usuario){
      res.render("login.html", {error2: "Usuario incorrecto"});
    }

  }
});

// post para desloguear
routerUsuario.post('/desloguear', async (req, res) => {
  
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.IN === 'production'
  });
  req.session.carrito = [];

  res.redirect("/");
});

// post para cambiar nombre producto
routerUsuario.post('/Modificar_nombre', async (req, res) => {
  const nombre = req.body.nombre;
  const id = req.body.id;

  // Me aseguro de que sea array
  if (!req.session.carrito) {
    req.session.carrito = [];
  }
  
  try {
    // Buscar el producto usando el `id` personalizado
    const producto = await Productos.findOne({ id: id });
    
    // Ahora que tenemos el producto, podemos acceder al `_id` el cual usa mongoDB
    const _id = producto._id;

    await Productos.findByIdAndUpdate(
      _id,
      { title: nombre }, 
      { new: true, runValidators: true } 
    );

    res.redirect(`/producto_${id}`);
} catch (err) {

    console.error('Error al consultar el producto:', err.message); 
    res.status(500).send({ err: err.message }); 
}

});

// post para cambiar el precio del producto
routerUsuario.post('/Modificar_precio', async (req, res) => {
  const precio = req.body.precio;
  const id = req.body.id;

  // Me aseguro de que sea array
  if (!req.session.carrito) {
    req.session.carrito = [];
  }
  
  try {
    // Buscar el producto usando el `id` personalizado
    const producto = await Productos.findOne({ id: id });
    
    // Ahora que tenemos el producto, podemos acceder al `_id` el cual usa mongoDB
    const _id = producto._id;

    await Productos.findByIdAndUpdate(
      _id,
      { price: precio }, 
      { new: true, runValidators: true } 
    );

    res.redirect(`/producto_${id}`);
} catch (err) {
    console.error('Error al consultar el producto:', err.message); 
    res.status(500).send({ err: err.message }); 
}
});

export default routerUsuario