let cantidadNoticias = 5;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

let noticias = {
    "apiKey":"5ab8d57816694114b6bfe11471412301",
    fetchNoticias:function(categoria){
        // Utilizamos el proxy CORS para evitar el error CORS
        const url = "https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=" 
                     + categoria + "&language=es&apiKey=" + this.apiKey;

        fetch(url)
        .then((response) => response.json())
        .then((data) => this.displayNoticias(data))
        .catch(error => {
            console.error('Error fetching news:', error);
        });
    },
    displayNoticias: function(data){
        // Elimino todo si ha seleccionado un nuevo tema
        if(pageInicial == 0){
            document.querySelector(".container-noticias").textContent = "";
        }

        // Verifico si hay artículos disponibles antes de intentar acceder a ellos
        if (data.articles && data.articles.length > 0) {
            for (let i = pageInicial; i <= pageFinal && i < data.articles.length; i++) {
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
                let date = publishedAt.split("T")[0].split("-").reverse().join("-");
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

            let btnSiguiente = document.createElement("span");
            btnSiguiente.id = "btnSiguiente";
            btnSiguiente.textContent = "Ver más";
            btnSiguiente.setAttribute("onclick", "siguiente()");
            document.querySelector(".container-noticias").appendChild(btnSiguiente);
        } else {
            console.error('No articles found or error with data.');
        }
    }
}

function buscar(cat){
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    temaActual = cat;
    noticias.fetchNoticias(cat);
}

function buscarTema(){
    pageInicial = 0;
    pageFinal = cantidadNoticias;

    let tema = document.querySelector("#busqueda").value;
    temaActual = tema;
    noticias.fetchNoticias(temaActual);
}

function siguiente(){
    pageInicial = pageFinal + 1;
    pageFinal = pageFinal + cantidadNoticias + 1;
    // Eliminamos el botón siguiente
    document.querySelector("#btnSiguiente").remove();
    noticias.fetchNoticias(temaActual);
}

noticias.fetchNoticias(temaActual);
