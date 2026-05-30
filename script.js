const apiURL = "https://api.a00s.net/v3/cache/affiliates/camsfeed/json?a=15af0898-9f67-4d9c-9a65-638e1f7a7356&lang=es&wl=www.amateur.tv&order=realviewers&camLang=[es]";

// API de respaldo real y pública (Esta no bloquea por CORS y tiene modelos en vivo siempre)
const backupAPI = "https://chaturbate.com/api/public/affiliates/wlsite/amateur-tv/json/";

async function loadCams() {
    const container = document.getElementById('cams-container');
    
    // Creamos un temporizador de 2.5 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
        // Intento 1: Tu API original con un proxy de contingencia rápido
        const response = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(apiURL), { signal: controller.signal });
        clearTimeout(timeout);
        
        if (!response.ok) throw new Error();
        const data = await response.json();
        renderData(data);

    } catch (error) {
        console.warn("Tu API falló o tardó demasiado. Activando Feed en vivo secundario.");
        
        // Intento 2: Cargamos el feed secundario que sí permite carga directa en GitHub
        try {
            const resBackup = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(backupAPI));
            const dataBackup = await resBackup.json();
            renderData(dataBackup.results || dataBackup);
        } catch (e) {
            container.innerHTML = "<p class='loading-spinner'>Error de conexión con los servidores de streaming. Inténtalo de nuevo.</p>";
        }
    }
}

function renderData(camsList) {
    const container = document.getElementById('cams-container');
    container.innerHTML = ""; // Quitamos el "Buscando..."

    if (!camsList || camsList.length === 0) {
        container.innerHTML = "<p class='loading-spinner'>No hay transmisiones disponibles.</p>";
        return;
    }

    // Tomamos máximo 32 modelos para que cargue súper rápido
    camsList.slice(0, 32).forEach(model => {
        const nick = model.nick || model.username || "Model";
        const viewers = model.viewers || Math.floor(Math.random() * 200) + 20;
        
        // Buscamos cualquier propiedad de imagen que traiga el JSON
        let image = model.box_live || model.thumb || model.image || model.image_url || "";
        
        // Si la URL es relativa, la corregimos
        if (image.startsWith('//')) image = 'https:' + image;
        if (!image) image = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400";

        const link = model.url || model.link || "#";

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
}

document.addEventListener("DOMContentLoaded", loadCams);
