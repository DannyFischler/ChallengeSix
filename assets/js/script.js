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
      } else {
        alert('Please enter a valid location');
      }
    })
    .then(weatherData => {
      displayCurrentWeather(weatherData);
      updateSearchHistory(cityName);
      getForecast(weatherData.coord.lat, weatherData.coord.lon);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function updateSearchHistory(cityName) {
  const historyItem = document.createElement('li');
  historyItem.textContent = cityName;
  historyItem.classList.add('history-item'); // Fixed: Add the class here
  historyList.appendChild(historyItem);

  const historyItems = Array.from(historyList.children).map(item => item.textContent);
  localStorage.setItem('searchHistory', JSON.stringify(historyItems));
}

function loadSearchHistory() {
  const historyItems = JSON.parse(localStorage.getItem('searchHistory')) || [];
  historyItems.forEach(item => {
    const historyItem = document.createElement('li');
    historyItem.textContent = item;
    historyItem.classList.add('history-item'); // Fixed: Add the class here
    historyList.appendChild(historyItem);
  });
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
      } else {
        alert('Error fetching forecast data. Please try again.');
      }
    })
    .then(forecastData => {
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
    const dateComponents = item.dt_txt.split(' ')[0].split('-');
    forecastView.innerHTML += `
        <div class="forecast-item">
          <p>Date: ${dateComponents[1] + '/' + dateComponents[2] + '/' + dateComponents[0]}</p>
          <p>Temperature: ${item.main.temp} °F</p>
          <p>Humidity: ${item.main.humidity}%</p>
          <p>Wind Speed: ${item.wind.speed} mph</p>
          <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="Weather Icon">
        </div>
      `;
  });
}

window.addEventListener('load', function () {
  loadSearchHistory();

  historyList.addEventListener('click', event => {
    if (event.target.classList.contains('history-item')) {
      const cityName = event.target.textContent;
      fetchWeatherData(cityName);
    }
  });
});
