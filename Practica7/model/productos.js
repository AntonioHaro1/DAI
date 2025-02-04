import mongoose from "mongoose";

const ProductosSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 4,
    validate: {
      validator: function (value) {
        return /^[A-Z]/.test(value); // Verifica si la primera letra es mayúscula
        },
        message: 'El título debe comenzar con una letra mayúscula.'
    }
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    rate: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
});

const Productos = mongoose.model("productos", ProductosSchema);
export default Productos;
