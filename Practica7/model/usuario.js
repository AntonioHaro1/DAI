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
  admin: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const Usuarios = mongoose.model("usuarios", UsuarioSchema);
export default Usuarios;