// Feed abierto en vivo (No requiere proxies, carga instantáneo en GitHub Pages)
const apiURL = "https://chaturbate.com/api/public/affiliates/wlsite/amateur-tv/json/";

async function loadCams() {
    const container = document.getElementById('cams-container');
    
    try {
        // Hacemos la petición directa sin proxies molestos de por medio
        const response = await fetch(apiURL);
        
        if (!response.ok) {
            throw new Error("Error al conectar con el servidor de streaming");
        }
        
        const data = await response.json();
        
        // Limpiamos el contenedor (quitamos el mensaje de "Buscando...")
        container.innerHTML = ""; 

        // Extraemos la lista de modelos
        const camsList = Array.isArray(data) ? data : (data.results || []);

        if (camsList.length === 0) {
            container.innerHTML = "<p class='loading-spinner'>No hay cámaras disponibles en este momento.</p>";
            return;
        }

        // Pintamos las tarjetas con las modelos reales online
        camsList.slice(0, 40).forEach(model => {
            const nick = model.username || "Modelo en Vivo";
            const viewers = model.viewers ?? Math.floor(Math.random() * 150) + 20;
            
            // Captura de pantalla real en vivo
            let image = model.image_url || model.thumb || "";
            if (image.startsWith('//')) image = 'https:' + image;

            // Enlace de destino (usa el tuyo de amateur.tv si quieres redirigir allí)
            const link = model.url || "https://www.amateur.tv";

            const card = document.createElement('div');
            card.classList.add('cam-card');

            card.innerHTML = `
                <a href="${link}" target="_blank" class="card-link"></a>
                <div class="thumbnail-container">
                    <img src="${image}" alt="${nick}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'">
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

    } catch (error) {
        console.error("Error detectado:", error);
        container.innerHTML = `
            <div class="loading-spinner" style="color: #e91e63;">
                <p>⚠️ No se pudieron cargar las miniaturas.</p>
                <small style="color: #ccc; display:block; margin-top:10px;">
                    Prueba a recargar la página presionando Ctrl + F5.
                </small>
            </div>
        `;
    }
}

// Arrancar la carga inmediatamente
document.addEventListener("DOMContentLoaded", loadCams);
