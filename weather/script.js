const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
const weatherCard = document.getElementById('weatherCard');
const loader = document.getElementById('loader');

const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const desc = document.getElementById('desc');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecastEl = document.getElementById('forecast');

// Geocoding + Weather using Open-Meteo (FREE, NO KEY)
async function getWeather(city) {
  try {
    errorMsg.textContent = "";
    loader.classList.remove('hidden');
    weatherCard.classList.add('hidden');

    if(!city.trim()){
      throw new Error("Please enter a city name");
    }

    // 1. Get coordinates
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geoRes.json();

    if(!geoData.results) throw new Error("City not found. Try another city.");

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Get weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    const weatherData = await weatherRes.json();

    // 3. Render
    cityName.textContent = `${name}, ${country}`;
    temp.textContent = `${weatherData.current.temperature_2m}°C`;
    humidity.textContent = `💧 ${weatherData.current.relative_humidity_2m}% Humidity`;
    wind.textContent = `💨 ${weatherData.current.wind_speed_10m} km/h`;
    desc.textContent = getWeatherDesc(weatherData.current.weather_code);
    weatherIcon.src = getWeatherIcon(weatherData.current.weather_code);

    // 4. 5-day forecast
    forecastEl.innerHTML = "";
    for(let i=0; i<5; i++){
      const day = new Date(weatherData.daily.time[i]).toLocaleDateString('en-US',{weekday:'short'});
      forecastEl.innerHTML += `
        <div>
          <p><b>${day}</b></p>
          <p>${getIconEmoji(weatherData.daily.weather_code[i])}</p>
          <p>${weatherData.daily.temperature_2m_max[i]}° / ${weatherData.daily.temperature_2m_min[i]}°</p>
        </div>
      `;
    }

    weatherCard.classList.remove('hidden');
  } catch(err){
    errorMsg.textContent = err.message;
  } finally {
    loader.classList.add('hidden');
  }
}

function getWeatherDesc(code){
  const map = {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',51:'Light drizzle',61:'Slight rain',71:'Slight snow',80:'Slight showers',95:'Thunderstorm'};
  return map[code] || 'Weather';
}
function getWeatherIcon(code){
  if(code==0) return 'https://openweathermap.org/img/wn/01d@2x.png';
  if(code<=3) return 'https://openweathermap.org/img/wn/02d@2x.png';
  if(code<=48) return 'https://openweathermap.org/img/wn/50d@2x.png';
  if(code<=67) return 'https://openweathermap.org/img/wn/09d@2x.png';
  if(code<=77) return 'https://openweathermap.org/img/wn/13d@2x.png';
  return 'https://openweathermap.org/img/wn/11d@2x.png';
}
function getIconEmoji(code){
  if(code==0) return '☀️';
  if(code<=3) return '⛅';
  if(code<=48) return '🌫️';
  if(code<=67) return '🌧️';
  if(code<=77) return '❄️';
  return '⛈️';
}

searchBtn.addEventListener('click',()=>getWeather(cityInput.value));
cityInput.addEventListener('keypress',(e)=>{if(e.key==='Enter') getWeather(cityInput.value)});

// Load default
getWeather("Bareilly");