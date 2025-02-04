document.addEventListener('DOMContentLoaded', () => {

    console.log('Iniciando fetch ...')
    const ele_stars = document.getElementsByClassName('stars')  // todos los elementos de la clase 'stars' que haya en la página
    
    for (const ele of ele_stars) {
     const ide = ele.dataset._id   // _id esta en los atributos del dataset
      ...
      // hacer el fecth, y con lo que devuelva formar el html y ponerlo:
      ele.innerHTML = html_nuevo_con_las_estrellas
    }
  })