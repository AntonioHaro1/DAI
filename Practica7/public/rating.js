let rating;

document.addEventListener('DOMContentLoaded', () => {

    console.log('Iniciando fetch ...')
    const ele_stars = document.getElementsByClassName('stars')  // todos los elementos de la clase 'stars' que haya en la página
    
    for (const ele of ele_stars) {
    const ide = ele.dataset._id   // _id esta en los atributos del dataset
    //console.log(ide);

    // Realizar el fetch
    fetch(`http://localhost:8000/api/ratings/${ide}`) 
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al obtener rating para el producto ${ide}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(`Rating recibido para ${ide}:`, data);

        rating = data.rating;
        //console.log(rating);
        const maxStars = 5;
        let html_nuevo_con_las_estrellas = '';

        // Generar las estrellas
        for (let i = 1; i <= maxStars; i++) {
            if (i <= rating.rate) {
                html_nuevo_con_las_estrellas += `<span class="fa fa-star checked" data-star="${i}" data-_id="${ide}"></span>`; // Estrella llena
            }else{
                html_nuevo_con_las_estrellas += `<span class="fa fa-star" data-star="${i}" data-_id="${ide}"></span>`; // Estrella vacía
            }
        }

        // Actualizar el contenido del html
        ele.innerHTML = html_nuevo_con_las_estrellas;

        // añadimos un evento para cada estrella
        const estrellas = ele.querySelectorAll(".fa");
        estrellas.forEach(estrella => {
            estrella.addEventListener("click", Vota);
        });
        })

    }
  })

function Vota(evt) {
    const ele = evt.currentTarget.parentElement; 
    const ide = evt.target.dataset._id; 
    const pun = parseInt(evt.target.dataset.star); // el numero de la estrella introducida

    console.log(`Calificación enviada para el producto ${ide}: ${pun} estrellas`);

    // Realizar el fetch para enviar la calificación
    fetch(`http://localhost:8000/api/ratings/${ide}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rate: pun, count: rating.count + 1 }), 
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al enviar la calificación para el producto ${ide}`);
            }
            return response.json(); 
        })
        .then(data => {
            console.log(`Respuesta del servidor para ${ide}:`, data);

        // actualizamos estrellas
        const ele_stars = document.getElementsByClassName('stars') 
        const ele_votos = document.querySelector('.Votos'); 
        //Cambiamos los votos en el html con la respuesta recibida
        rating.count = data.updatedProducto.rating.count;
        ele_votos.innerHTML = `Votos: ${rating.count}`;        
        console.log(ele_stars);
        rating.rate = data.updatedProducto.rating.rate;

        // Convierte la colección HTML en un array para poder iterar
        Array.from(ele_stars).forEach(starElement => {
            const children = starElement.children;
            const totalStars = children.length;

            //Actualiza los hijos dependiendo del rate del producto actualizado
            for (let i = 0; i < totalStars; i++) {
                if (i < rating.rate) {
                    children[i].classList.add('checked');
                } else {
                    children[i].classList.remove('checked');
                }
            }

        });


        })
        .catch(error => {
            console.error(`Error procesando la votación para ${ide}:`, error);
        });
}


