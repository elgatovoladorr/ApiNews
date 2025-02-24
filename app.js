let cantidadNoticias = 5;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

let noticias = {
    "apiKey":"5ab8d57816694114b6bfe11471412301",
    fetchNoticias: function(categoria) {
        fetch(
            "https://newsapi.org/v2/everything?q="
            + categoria +
            "&language=es&apiKey=" + this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la API: ' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            if (data.articles && data.articles.length > 0) {
                this.displayNoticias(data);
            } else {
                console.log("No se encontraron artículos para la categoría: " + categoria);
                document.querySelector(".container-noticias").textContent = "No se encontraron artículos.";
            }
        })
        .catch((error) => {
            console.error("Hubo un problema con la solicitud:", error);
            document.querySelector(".container-noticias").textContent = "Hubo un error al cargar las noticias.";
        });
    },
    
    displayNoticias: function(data) {
        // Elimino todo si se ha seleccionado un nuevo tema
        if (pageInicial == 0) {
            document.querySelector(".container-noticias").textContent = "";
        }

        for (let i = pageInicial; i < pageFinal && i < data.articles.length; i++) {
            const { title, urlToImage, publishedAt, source, url } = data.articles[i];

            let h2 = document.createElement("h2");
            h2.textContent = title;

            let img = document.createElement("img");
            img.setAttribute("src", urlToImage);

            let info_item = document.createElement("div");
            info_item.className = "info_item";

            let fecha = document.createElement("span");
            let date = publishedAt.split("T")[0].split("-").reverse().join("-");
            fecha.className = "fecha";
            fecha.textContent = date;

            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = source.name;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            let item = document.createElement("div");
            item.className = "item";
            item.appendChild(h2);
            item.appendChild(img);
            item.appendChild(info_item);
            item.setAttribute("onclick", "location.href='" + url + "'");

            document.querySelector(".container-noticias").appendChild(item);
        }

        // Mostrar botón "Ver más" solo si hay más noticias para cargar
        if (pageFinal < data.articles.length) {
            let btnSiguiente = document.createElement("span");
            btnSiguiente.id = "btnSiguiente";
            btnSiguiente.textContent = "Ver más";
            btnSiguiente.setAttribute("onclick", "siguiente()");
            document.querySelector(".container-noticias").appendChild(btnSiguiente);
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
    pageInicial = 0;
    pageFinal = cantidadNoticias;

    let tema = document.querySelector("#busqueda").value;
    temaActual = tema;
    noticias.fetchNoticias(temaActual);
}

function siguiente() {
    pageInicial = pageFinal;
    pageFinal = pageFinal + cantidadNoticias;

    // Eliminamos el botón siguiente
    document.querySelector("#btnSiguiente").remove();
    noticias.fetchNoticias(temaActual);
}

// Cargar las noticias iniciales
noticias.fetchNoticias(temaActual);
