// app.js
let cantidadNoticias = 5;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

let noticias = {
    "apiKey": "ma29OyzOtmM78dm5PGLDeHNNzT0ziyYiogb1apgn",
    fetchNoticias: function(categoria) {
        fetch(
            `https://api.thenewsapi.com/v1/news/all?language=es&search=${categoria}&api_token=${this.apiKey}`
        )
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la API: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.data && data.data.length > 0) {
                this.displayNoticias(data);
            } else {
                console.log("No se encontraron artículos para la categoría: " + categoria);
                document.querySelector(".container-noticias").textContent = "No se encontraron artículos.";
            }
        })
        .catch(error => {
            console.error("Hubo un problema con la solicitud:", error);
            document.querySelector(".container-noticias").textContent = "Hubo un error al cargar las noticias.";
        });
    },

    displayNoticias: function(data) {
        if (pageInicial === 0) {
            document.querySelector(".container-noticias").textContent = "";
        }
        
        for (let i = pageInicial; i < pageFinal && i < data.data.length; i++) {
            const { title, image_url, published_at, source, url } = data.data[i];
            
            let h2 = document.createElement("h2");
            h2.textContent = title;

            let img = document.createElement("img");
            img.setAttribute("src", image_url);

            let info_item = document.createElement("div");
            info_item.className = "info_item";

            let fecha = document.createElement("span");
            fecha.className = "fecha";
            fecha.textContent = new Date(published_at).toLocaleDateString();

            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = source;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            let item = document.createElement("div");
            item.className = "item";
            item.appendChild(h2);
            item.appendChild(img);
            item.appendChild(info_item);
            item.setAttribute("onclick", `location.href='${url}'`);

            document.querySelector(".container-noticias").appendChild(item);
        }
    }
};

function buscar(cat) {
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    temaActual = cat;
    noticias.fetchNoticias(cat);
}

function buscarTema() {
    let tema = document.querySelector("#busqueda").value;
    buscar(tema);
}

noticias.fetchNoticias(temaActual);
