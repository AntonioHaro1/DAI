import React from "react";
import "./App.css";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  const { data, error, isLoading } = useSWR("https://fakestoreapi.com/products", fetcher);

  if (error) return <div>Error al cargar los productos</div>;
  if (isLoading) return <div className="contenedor">Cargando...</div>;

  return (
    <div className="contenedor">
      <h1>Productos Destacados</h1>
      <div className="grid_producto">
        {data.map((product) => (
          <div key={product.id} className="tarjeta_producto">
            <img src={product.image} alt={product.title} className="imagen_producto" />
            <div className="info_producto">
              <h2 className="titulo_producto">{product.title}</h2>
              <p className="descripcion_producto">{product.description.slice(0, 100)}...</p>
              <button className="button_compra">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;