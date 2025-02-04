// ./routes/router_usuario.js
import express from "express";
import Usuarios from "../model/usuario.js";
const routerUsuario = express.Router();
import jwt from "jsonwebtoken"

//mostrar formulario de login
routerUsuario.get('/login', (req, res)=>{

  const usuario = req.username;

  res.render("login.html", { usuario});
})


// recoger datos del usuario
routerUsuario.post('/login', async (req, res)=> {

  const username = req.body.username;
  const password = req.body.password;
  
  const usuario = await Usuarios.findOne({ username: username, password: password });
  

  if(usuario){
    const token = jwt.sign({ usuario: username},  process.env.SECRET_KEY);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === 'production'
    }).render("login.html" , {usuario: username});
  return;
  }

  res.render("login.html", {usuario})
})
// post para desloguear
routerUsuario.post('/desloguear', async (req, res) => {
  
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.IN === 'production'
  });

  res.redirect("/");
});

export default routerUsuario