// Clé API fournie par l'utilisateur
const API_KEY = '9372c9c4dcb48a5b89a446f675443c7d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Éléments DOM
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const initialMessage = document.getElementById('initial-message');
const forecastContainer = document.getElementById('forecast');

// Éléments d'affichage météo
const cityName = document.getElementById('city-name');
const country = document.getElementById('country');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feels-like');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');

// Écouteurs d'événements
searchButton.addEventListener('click', searchWeather);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Fonction pour rechercher la météo
async function searchWeather() {
    const city = searchInput.value.trim();
    
    if (!city) return;
    
    try {
        // Afficher un état de chargement (à implémenter)
        initialMessage.classList.add('hidden');
        weatherInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');
        forecastContainer.innerHTML = '';
        
        // Récupérer les données météo actuelles
        const weatherData = await getCurrentWeather(city);
        
        // Afficher les données météo
        displayCurrentWeather(weatherData);
        
        // Récupérer les prévisions
        const forecastData = await getForecast(weatherData.coord.lat, weatherData.coord.lon);
        
        // Afficher les prévisions
        displayForecast(forecastData);
        
        // Afficher le conteneur météo
        weatherInfo.classList.remove('hidden');
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
        errorMessage.classList.remove('hidden');
    }
}

// Fonction pour récupérer les données météo actuelles
async function getCurrentWeather(city) {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`);
    
    if (!response.ok) {
        throw new Error('Ville non trouvée');
    }
    
    return await response.json();
}

// Fonction pour récupérer les prévisions météo
async function getForecast(lat, lon) {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`);
    
    if (!response.ok) {
        throw new Error('Impossible de récupérer les prévisions');
    }
    
    return await response.json();
}

// Fonction pour afficher les données météo actuelles
function displayCurrentWeather(data) {
    cityName.textContent = data.name;
    country.textContent = data.sys.country;
    
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = data.weather[0].description;
    
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = capitalizeFirstLetter(data.weather[0].description);
    
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Conversion m/s en km/h
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Ajuster l'arrière-plan en fonction de la météo (optionnel)
    adjustBackground(data.weather[0].id);
}

// Fonction pour afficher les prévisions météo
function displayForecast(data) {
    forecastContainer.innerHTML = '';
    
    // Obtenir uniquement les prévisions pour 12h (midi) des jours suivants
    const dailyForecasts = data.list.filter(item => {
        const time = new Date(item.dt * 1000).getHours();
        return time === 12;
    }).slice(0, 5); // Limiter à 5 jours
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${day}</p>
            <img src="${iconUrl}" alt="${forecast.weather[0].description}">
            <p class="temp">${Math.round(forecast.main.temp)}°C</p>
            <p class="desc">${capitalizeFirstLetter(forecast.weather[0].description)}</p>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Fonction pour ajuster l'arrière-plan en fonction de la météo
function adjustBackground(weatherId) {
    const body = document.body;
    
    // Réinitialiser le style
    body.style.background = '';
    
    if (weatherId >= 200 && weatherId < 300) {
        // Orage
        body.style.background = 'linear-gradient(135deg, #4b6cb7, #182848)';
    } else if (weatherId >= 300 && weatherId < 400) {
        // Bruine
        body.style.background = 'linear-gradient(135deg, #757F9A, #D7DDE8)';
    } else if (weatherId >= 500 && weatherId < 600) {
        // Pluie
        body.style.background = 'linear-gradient(135deg, #3a7bd5, #3a6073)';
    } else if (weatherId >= 600 && weatherId < 700) {
        // Neige
        body.style.background = 'linear-gradient(135deg, #E0EAFC, #CFDEF3)';
    } else if (weatherId >= 700 && weatherId < 800) {
        // Brouillard
        body.style.background = 'linear-gradient(135deg, #B993D6, #8CA6DB)';
    } else if (weatherId === 800) {
        // Ciel dégagé
        body.style.background = 'linear-gradient(135deg, #56CCF2, #2F80ED)';
    } else {
        // Nuageux
        body.style.background = 'linear-gradient(135deg, #7F7FD5, #91EAE4)';
    }
}

// Fonction utilitaire pour mettre en majuscule la première lettre
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Détecter la position de l'utilisateur au chargement (optionnel)
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const response = await fetch(`${BASE_URL}/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric&lang=fr`);
                
                if (response.ok) {
                    const data = await response.json();
                    searchInput.value = data.name;
                    searchWeather();
                }
            } catch (error) {
                console.error('Erreur de géolocalisation:', error);
            }
        }, () => {
            console.log('L\'utilisateur a refusé la géolocalisation');
        });
    }
});