const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherData = document.getElementById('currentWeatherData');
const forecastView = document.getElementById('forecastData');
const historyList = document.getElementById('historyList');
const apiKey = 'a9f4a56577d0416639a709fdcb2952f0';

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const cityName = cityInput.value;
  fetchWeatherData(cityName);
});

function fetchWeatherData(cityName) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(currentWeatherUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        alert('Please enter a valid location');
      }
    })
    .then(weatherData => {
      displayCurrentWeather(weatherData);
      updateSearchHistory(cityName);
      getForecast(weatherData.coord.lat, weatherData.coord.lon)
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function updateSearchHistory(cityName) {
  const historyItem = document.createElement('li');
  historyItem.textContent = cityName;
  historyList.appendChild(historyItem);
}

function displayCurrentWeather(weatherData) {
  currentWeatherData.innerHTML = `
      <h3>${weatherData.name}</h3>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Temperature: ${weatherData.main.temp} °F</p>
      <p>Humidity: ${weatherData.main.humidity}%</p>
      <p>Wind Speed: ${weatherData.wind.speed} mph</p>
      <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">
    `;
}

function getForecast(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(forecastUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        alert('Error fetching forecast data. Please try again.');
      }
    })
    .then(forecastData => {
      console.log(forecastData);
      displayForecast(forecastData);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}

function displayForecast(forecastData) {
  const forecastItems = forecastData.list.filter(item => item.dt_txt.includes('21:00:00'));
  forecastView.innerHTML = '';

  forecastItems.forEach(item => {
    dateComponents = item.dt_txt.split(" ")[0].split("-");
    forecastView.innerHTML += `
        <div class="forecast-item">
          <p>Date: ${dateComponents[1] + "/" + dateComponents[2] + "/" + dateComponents[0]}</p>
          <p>Temperature: ${item.main.temp} °F</p>
          <p>Humidity: ${item.main.humidity}%</p>
          <p>Wind Speed: ${item.wind.speed} mph</p>
          <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="Weather Icon">
        </div>
      `;
  });
}
