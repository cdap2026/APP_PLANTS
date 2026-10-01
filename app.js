// Referencias al DOM
const cameraInput = document.getElementById('camera-input');
const galleryInput = document.getElementById('gallery-input');
const btnCamera = document.getElementById('btn-camera');
const btnGallery = document.getElementById('btn-gallery');
const btnIdentify = document.getElementById('btn-identify');
const imagePreview = document.getElementById('image-preview');
const placeholderText = document.getElementById('placeholder-text');
const loadingSpinner = document.getElementById('loading-spinner');
const resultsSection = document.getElementById('results-section');
const resultsContent = document.getElementById('results-content');
const btnReset = document.getElementById('btn-reset');

// Modal API Refs
const btnSettings = document.getElementById('btn-settings');
const apiModal = document.getElementById('api-modal');
const apiKeyInput = document.getElementById('api-key-input');
const btnSaveApi = document.getElementById('btn-save-api');
const btnCloseModal = document.getElementById('btn-close-modal');
const apiError = document.getElementById('api-error');

let currentFile = null;

// Inicialización de API Key
document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('plantnet_api_key');
    if (savedKey) apiKeyInput.value = savedKey;
});

// Manejo del Modal de Configuración
btnSettings.addEventListener('click', () => apiModal.style.display = 'flex');
btnCloseModal.addEventListener('click', () => apiModal.style.display = 'none');

btnSaveApi.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key.length < 10) {
        apiError.textContent = "Por favor ingresa una API Key válida.";
        return;
    }
    localStorage.setItem('plantnet_api_key', key);
    apiError.textContent = "";
    apiModal.style.display = 'none';
    
    // Si había una foto esperando, iniciar identificación
    if (currentFile && !btnIdentify.disabled) {
        btnIdentify.click();
    }
});

// Manejo de Imágenes
btnCamera.addEventListener('click', () => cameraInput.click());
btnGallery.addEventListener('click', () => galleryInput.click());

cameraInput.addEventListener('change', handleFileSelect);
galleryInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        currentFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            placeholderText.style.display = 'none';
            btnIdentify.disabled = false;
            resultsSection.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}

// Lógica de Identificación Real con Pl@ntNet API
btnIdentify.addEventListener('click', async () => {
    if (!currentFile) return;

    const apiKey = localStorage.getItem('plantnet_api_key');
    if (!apiKey) {
        apiModal.style.display = 'flex';
        return;
    }

    // UI Feedback
    document.querySelector('.controls-section').style.display = 'none';
    loadingSpinner.style.display = 'block';
    resultsSection.style.display = 'none';
    document.getElementById('loading-text').textContent = "Consultando base de datos botánica global...";

    const formData = new FormData();
    formData.append('images', currentFile);
    // 'auto' permite a la IA determinar si es hoja, flor, fruto o corteza
    formData.append('organs', 'auto'); 

    const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}&lang=es`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error("Clave de API inválida o expirada.");
        }
        if (response.status === 404) {
            throw new Error("Especie no encontrada en la base de datos.");
        }
        if (!response.ok) {
            throw new Error("Error de conexión con el servidor botánico.");
        }

        const data = await response.json();
        displayResults(data.results);

    } catch (error) {
        console.error("Error API:", error);
        alert(`Error: ${error.message}\nAsegúrate de tener conexión y una API Key correcta.`);
        resetApp();
    }
});

function displayResults(results) {
    loadingSpinner.style.display = 'none';
    resultsSection.style.display = 'block';
    document.querySelector('.controls-section').style.display = 'block';
    btnIdentify.style.display = 'none';

    resultsContent.innerHTML = '';

    if (!results || results.length === 0) {
        resultsContent.innerHTML = '<p style="color: red; text-align: center;">No se pudo identificar la planta. Intenta con una foto más clara de la hoja o flor.</p>';
        return;
    }

    // Tomar los 3 mejores resultados
    const topResults = results.slice(0, 3);

    topResults.forEach((item, index) => {
        const isTopMatch = index === 0;
        
        // Extraer datos botánicos
        const scientificName = item.species.scientificNameWithoutAuthor || "Desconocido";
        const commonNames = item.species.commonNames && item.species.commonNames.length > 0 
                            ? item.species.commonNames[0] 
                            : scientificName;
        const family = item.species.family ? item.species.family.scientificNameWithoutAuthor : "Familia desconocida";
        
        // Probabilidad (Score) a Porcentaje
        const scorePct = (item.score * 100).toFixed(1);
        
        // Construir la tarjeta
        const card = document.createElement('div');
        card.className = `result-card ${isTopMatch ? 'top-match' : ''}`;
        
        card.innerHTML = `
            <div class="match-header">
                <div class="match-names">
                    <div class="common-name">${commonNames}</div>
                    <div class="scientific-name">${scientificName}</div>
                    <div class="family-name">${family}</div>
                </div>
                <div class="match-score">${scorePct}%</div>
            </div>
            <div class="progress-bg">
                <div class="progress-fill" style="width: ${scorePct}%; ${!isTopMatch ? 'background: var(--secondary-color);' : ''}"></div>
            </div>
        `;
        
        resultsContent.appendChild(card);
    });
}

// Resetear
function resetApp() {
    currentFile = null;
    imagePreview.src = "";
    imagePreview.style.display = 'none';
    placeholderText.style.display = 'block';
    
    resultsSection.style.display = 'none';
    btnIdentify.style.display = 'block';
    btnIdentify.disabled = true;
    
    document.querySelector('.controls-section').style.display = 'block';
    loadingSpinner.style.display = 'none';
    
    cameraInput.value = "";
    galleryInput.value = "";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnReset.addEventListener('click', resetApp);
