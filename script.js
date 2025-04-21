const apiKey = '9372c9c4dcb48a5b89a446f675443c7d';

function getWeather() {
    const city = document.getElementById('city-input').value;

    if (!city) {
        alert('Please enter a city!');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert('City not found!');
                return;
            }

            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Error fetching data. Please try again.');
        });

    // Fetch hourly forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== '200') {
                alert('Error fetching forecast!');
                return;
            }

            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('weather-description').textContent = description.charAt(0).toUpperCase() + description.slice(1);
}

function displayHourlyForecast(forecastData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous forecast

    // Loop through forecast data and display next 8 hours
    forecastData.slice(0, 8).forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert to Date object
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
