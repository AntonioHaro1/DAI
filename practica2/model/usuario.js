import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

const Usuarios = mongoose.model("usuarios", UsuarioSchema);
export default Usuarios;