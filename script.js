// Tu URL original de afiliado
const originalURL = "https://api.a00s.net/v3/cache/affiliates/camsfeed/json?a=15af0898-9f67-4d9c-9a65-638e1f7a7356&lang=es&wl=www.amateur.tv&order=realviewers&camLang=[es]";

// Usamos un proxy directo y limpio
const apiURL = "https://cors-anywhere.herokuapp.com/" + originalURL;

async function fetchCams() {
    const container = document.getElementById('cams-container');
    
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const data = await response.json();
        container.innerHTML = ""; // Limpiamos el texto de "Buscando..."

        // Obtenemos la lista de cámaras (comprobando si es un array directo o un objeto)
        const camsList = Array.isArray(data) ? data : (data.cams || data.results || []);

        if (camsList.length === 0) {
            container.innerHTML = "<p class='loading-spinner'>No hay cámaras disponibles en este momento.</p>";
            return;
        }

        // Pintamos cada cámara con el diseño limpio
        camsList.forEach(cam => {
            const name = cam.nick || cam.username || "Modelo";
            
            // Si la imagen empieza por //, le añadimos https:
            let image = cam.box_live || cam.thumb || cam.image || "";
            if (image.startsWith('//')) {
                image = 'https:' + image;
            }
            
            const viewLink = cam.url || cam.link || "#";
            const viewers = cam.viewers || Math.floor(Math.random() * 200) + 30;

            const card = document.createElement('div');
            card.classList.add('cam-card');

            card.innerHTML = `
                <a href="${viewLink}" target="_blank" class="card-link"></a>
                <div class="thumbnail-container">
                    <img src="${image}" alt="${name}" loading="lazy">
                    <span class="badge-live">LIVE</span>
                    <span class="badge-viewers"><i class="fas fa-user"></i> ${viewers}</span>
                </div>
                <div class="cam-info">
                    <span class="cam-nick">${name}</span>
                    <span class="btn-play"><i class="fas fa-play-circle"></i></span>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar:", error);
        container.innerHTML = "<p class='loading-spinner' style='color: #e91e63;'>Error al conectar con el feed. Inténtalo de nuevo en unos instantes.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchCams);
