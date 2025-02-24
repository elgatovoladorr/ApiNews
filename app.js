// Cantidad de noticias que se cargarán cada vez que se presione siguiente (5 por página)
let cantidadNoticias = 5;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

let noticias = {
    apiKey: "5ab8d57816694114b6bfe11471412301",
    fetchNoticias: function (categoria) {
        fetch(
            "https://newsapi.org/v2/everything?q=" + encodeURIComponent(categoria) +
            "&language=es&apiKey=" + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => {
                // Si se detecta un error en la respuesta, lo mostramos y detenemos la ejecución
                if (data.status === "error") {
                    console.error("Error fetching news: " + data.message);
                    document.querySelector(".container-noticias").textContent = "Error: " + data.message;
                    return;
                }
                this.displayNoticias(data);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                document.querySelector(".container-noticias").textContent = "Error: " + error;
            });
    },
    displayNoticias: function (data) {
        // Limpia el contenedor si se ha seleccionado un nuevo tema
        if (pageInicial === 0) {
            document.querySelector(".container-noticias").textContent = "";
        }

        // Recorre los artículos disponibles sin exceder la cantidad total
        for (let i = pageInicial; i < pageFinal && i < data.articles.length; i++) {
            const { title } = data.articles[i];
            let h2 = document.createElement("h2");
            h2.textContent = title;

            const { urlToImage } = data.articles[i];
            let img = document.createElement("img");
            img.setAttribute("src", urlToImage);

            let info_item = document.createElement("div");
            info_item.className = "info_item";
            const { publishedAt } = data.articles[i];
            let fecha = document.createElement("span");
            let date = publishedAt;
            date = date.split("T")[0].split("-").reverse().join("-");
            fecha.className = "fecha";
            fecha.textContent = date;

            const { name } = data.articles[i].source;
            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = name;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            const { url } = data.articles[i];
            let item = document.createElement("div");
            item.className = "item";
            item.appendChild(h2);
            item.appendChild(img);
            item.appendChild(info_item);
            item.setAttribute("onclick", "location.href='" + url + "'");
            document.querySelector(".container-noticias").appendChild(item);
        }

        // Agrega el botón "Ver más" solo si hay más artículos disponibles
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
    let btnSiguiente = document.querySelector("#btnSiguiente");
    if (btnSiguiente) btnSiguiente.remove();
    noticias.fetchNoticias(temaActual);
}

noticias.fetchNoticias(temaActual);
