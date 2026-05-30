// Función global que recibirá los datos reales de Amateur.tv en vivo
window.procesarCamaras = function(data) {
    const container = document.getElementById('cams-container');
    
    // Si la API no devuelve datos válidos
    if (!data || data.length === 0) {
        container.innerHTML = "<p class='loading-spinner'>No hay modelos online en este momento.</p>";
        return;
    }

    // Limpiamos el contenedor
    container.innerHTML = "";

    // Recorremos las modelos reales que están online en este instante
    data.forEach(model => {
        const nick = model.nick || "Modelo";
        const link = model.url || "#";
        const viewers = model.viewers || 0;
        
        // Corregimos la URL de la imagen en vivo de la modelo
        let image = model.box_live || model.thumb || "";
        if (image.startsWith('//')) {
            image = 'https:' + image;
        }

        const card = document.createElement('div');
        card.classList.add('cam-card');

        card.innerHTML = `
            <a href="${link}" target="_blank" class="card-link"></a>
            <div class="thumbnail-container">
                <img src="${image}" alt="${nick}" loading="lazy">
                <span class="badge-live">LIVE</span>
                <span class="badge-viewers"><i class="fas fa-user"></i> ${viewers}</span>
            </div>
            <div class="cam-info">
                <span class="cam-nick">${nick}</span>
                <span class="btn-play"><i class="fas fa-play-circle"></i></span>
            </div>
        `;
        container.appendChild(card);
    });
};

// Función para llamar a la API sin sufrir bloqueos de CORS
function conectarApiReal() {
    const apiURL = "https://api.a00s.net/v3/cache/affiliates/camsfeed/json?a=15af0898-9f67-4d9c-9a65-638e1f7a7356&lang=es&wl=www.amateur.tv&order=realviewers&camLang=[es]&callback=procesarCamaras";
    
    // Inyectamos la llamada como un script nativo para saltar la seguridad del navegador por completo
    const script = document.createElement('script');
    script.src = apiURL;
    document.body.appendChild(script);
}

// Arrancar la conexión en cuanto cargue la web
document.addEventListener("DOMContentLoaded", conectarApiReal);
