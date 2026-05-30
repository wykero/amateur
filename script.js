const originalURL = "https://api.a00s.net/v3/cache/affiliates/camsfeed/json?a=15af0898-9f67-4d9c-9a65-638e1f7a7356&lang=es&wl=www.amateur.tv&order=realviewers&camLang=[es]";
const proxyURL = "https://api.allorigins.win/get?url=" + encodeURIComponent(originalURL);

// DATOS DE RESPALDO CON IMÁGENES REALES Y SEGURAS DE INTERNET
const backupCams = [
    { nick: "Sweet_Carla", box_live: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60", url: "https://www.amateur.tv", viewers: 342 },
    { nick: "Naughty_Sofia", box_live: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60", url: "https://www.amateur.tv", viewers: 215 },
    { nick: "Daniella_Hot", box_live: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60", url: "https://www.amateur.tv", viewers: 189 },
    { nick: "Parejita_X", box_live: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60", url: "https://www.amateur.tv", viewers: 512 },
    { nick: "Marta_Rubia", box_live: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60", url: "https://www.amateur.tv", viewers: 94 },
    { nick: "Gatita_Mimi", box_live: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60", url: "https://www.amateur.tv", viewers: 423 }
];

async function loadAmateurCams() {
    const container = document.getElementById('cams-container');
    
    try {
        const response = await fetch(proxyURL);
        if (!response.ok) throw new Error("Error de red");
        
        const wrapperData = await response.json();
        if (!wrapperData.contents) throw new Error("Proxy vacío");

        const data = JSON.parse(wrapperData.contents);
        
        // REVISIÓN DE ESTRUCTURA: Buscamos dónde vienen guardadas las modelos en tu JSON real
        const cams = Array.isArray(data) ? data : (data.cams || data.results || data.data || []);
        
        if (cams.length > 0) {
            renderCams(cams);
        } else {
            throw new Error("Sin datos");
        }

    } catch (error) {
        console.log("Cargando modo demostración seguro.");
        renderCams(backupCams);
    }
}

function renderCams(camsList) {
    const container = document.getElementById('cams-container');
    container.innerHTML = ""; 

    camsList.forEach(model => {
        const nick = model.nick || model.username || model.name || "Modelo";
        const link = model.url || model.link || "#";
        const viewers = model.viewers || Math.floor(Math.random() * 300) + 40;

        // SISTEMA INTELIGENTE PARA DETECTAR LA IMAGEN CORRECTA
        // Intenta leer todas las variables posibles que Amateur.tv suele enviar
        let image = model.box_live || model.image_url || model.thumb || model.image || model.screenshot || "";
        
        // Si la API no devuelve imagen o está vacía, le asignamos una foto de catálogo para que no quede rota
        if (!image) {
            image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
        }

        // REGLA DE ORO: Si la URL de la imagen empieza por "//", le añadimos "https:" obligatoriamente
        if (image.startsWith('//')) {
            image = 'https:' + image;
        }

        const card = document.createElement('div');
        card.classList.add('cam-card');

        card.innerHTML = `
            <a href="${link}" target="_blank" class="card-link"></a>
            <div class="thumbnail-container">
                <!-- El atributo onerror es un salvavidas: si la imagen de la modelo falla, pone una de repuesto automáticamente -->
                <img src="${image}" alt="${nick}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400';">
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
}

document.addEventListener("DOMContentLoaded", loadAmateurCams);
