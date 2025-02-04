import express   from "express"
import nunjucks  from "nunjucks"      
import connectDB from "./model/db.js"
import TiendaRouter from "./routes/router_tienda.js";
import UsuarioRouter from "./routes/router_usuario.js";
import session from 'express-session';
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"



const app = express()

const IN = process.env.IN || 'development'


nunjucks.configure('views', {         // directorio 'views' para las plantillas html
	autoescape: true,
	noCache:    IN == 'development',   // true para desarrollo, sin cache
	watch:      IN == 'development',   // reinicio con Ctrl-S
	express: app
})
app.set('view engine', 'html')

app.use(express.static('public'))     // directorio public para archivos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser())

const autentificación = (req, res, next) => {
	const token = req.cookies.access_token;
	if (token) {
		const data = jwt.verify(token, process.env.SECRET_KEY);
		req.username = data.usuario;  // username en el request
		req.admin = data.admin;
	}
	next()
}
app.use(autentificación);


app.use("/", TiendaRouter);
app.use("/", UsuarioRouter);


connectDB()
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en  http://localhost:${PORT}`);
})
