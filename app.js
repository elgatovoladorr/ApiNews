// Parámetros de paginación
let cantidadNoticias = 5;
let paginaActual = 1;
let temaActual = "Tecnología";

const loader = document.getElementById("loader");
const containerNoticias = document.querySelector(".container-noticias");

const noticias = {
  apiKey: "ma29OyzOtmM78dm5PGLDeHNNzT0ziyYiogb1apgn",
  
  fetchNoticias: function(categoria) {
    loader.style.display = "block";
    fetch(`https://api.thenewsapi.com/v1/news/all?language=es&search=${categoria}&api_token=${this.apiKey}&limit=${cantidadNoticias}&page=${paginaActual}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener datos: " + response.status);
        }
        return response.json();
      })
      .then(data => {
        loader.style.display = "none";
        if (data.data && data.data.length > 0) {
          // Si es la primera página, limpiamos el contenedor
          if (paginaActual === 1) {
            containerNoticias.innerHTML = "";
          }
          this.displayNoticias(data);
        } else {
          if (paginaActual === 1) {
            containerNoticias.textContent = "No se encontraron artículos.";
          }
        }
      })
      .catch(error => {
        loader.style.display = "none";
        containerNoticias.textContent = "Error al cargar noticias.";
        console.error("Error:", error);
      });
  },
  
  displayNoticias: function(data) {
    data.data.forEach(article => {
      const { title, image_url, published_at, source, url } = article;
      
      // Crear contenedor de la noticia
      const item = document.createElement("div");
      item.className = "item";
      item.addEventListener("click", () => {
        window.location.href = url;
      });
      
      // Imagen
      const img = document.createElement("img");
      img.src = image_url || "https://via.placeholder.com/300x200?text=No+Image";
      
      // Contenedor de contenido
      const content = document.createElement("div");
      content.className = "content";
      
      // Título
      const h2 = document.createElement("h2");
      h2.textContent = title;
      
      // Información (fecha y fuente)
      const info_item = document.createElement("div");
      info_item.className = "info_item";
      
      const fecha = document.createElement("span");
      fecha.className = "fecha";
      fecha.textContent = new Date(published_at).toLocaleDateString();
      
      const fuente = document.createElement("span");
      fuente.className = "fuente";
      fuente.textContent = source;
      
      info_item.appendChild(fecha);
      info_item.appendChild(fuente);
      
      content.appendChild(h2);
      content.appendChild(info_item);
      
      item.appendChild(img);
      item.appendChild(content);
      
      containerNoticias.appendChild(item);
    });
  }
};

// Función para buscar por categoría o término ingresado
function buscar(categoria) {
  temaActual = categoria;
  paginaActual = 1;
  noticias.fetchNoticias(categoria);
}

function buscarTema() {
  const tema = document.getElementById("busqueda").value;
  if (tema.trim() !== "") {
    buscar(tema);
  }
}

// Eventos
document.getElementById("btnBuscar").addEventListener("click", buscarTema);

document.getElementById("modoOscuro").addEventListener("click", () => {
  document.body.classList.toggle("modo-oscuro");
});

document.getElementById("btnCargarMas").addEventListener("click", () => {
  paginaActual++;
  noticias.fetchNoticias(temaActual);
});

// Eventos para los spans de categorías
document.querySelectorAll("nav .cat").forEach(cat => {
  cat.addEventListener("click", function() {
    buscar(this.getAttribute("data-cat"));
  });
});

// Carga inicial
noticias.fetchNoticias(temaActual);
