

let cityFormEL = document.querySelector(".city-form")
let cityInput = document.querySelector("#city-name");
let cityName;



let submitHandler = function (event) {
  event.preventDefault();
  cityName = cityInput.value;
  if (cityName) {
    getCityCoordinates(cityName);
    saveCity(cityName);
  } else {
    alert("Please enter a city name");
  }
};

let saveCity = function (cityName) {
  let cityNames = JSON.parse(localStorage.getItem('cityNames'));
  console.log(cityNames.indexOf('austin'));
  if (cityNames.indexOf(cityName) === -1) {
    cityNames.push(cityName);
    localStorage.setItem('cityNames', JSON.stringify(cityNames));
    updateSavedCities();
  }
}

let savedCityInput = function (cityName) {
  let btnEl = document.createElement("button");
  btnEl.setAttribute("class", "saved-city-button");
  let cityListEl = document.querySelector(".cities-list");
  cityListEl.appendChild(btnEl);
  btnEl.textContent = cityName;

}


let getCityCoordinates = function (cityName) {
  let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=efd3e308974d444aaa1899062b489de3"
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        getCityWeather(data[0].lat, data[0].lon);
      })
    }
  })
}

let getCityWeather = function (latitude, longitude) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=hourly&units=imperial&appid=efd3e308974d444aaa1899062b489de3";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data)
        updateCurrentWeather(data.current)
        updateDailyWeathers(data.daily);

      })
    }
  })
}

let updateSavedCities = function () {
  if (localStorage.getItem('cityNames') === null) {
    localStorage.setItem('cityNames', '[]');
  }
  let cityNames = JSON.parse(localStorage.getItem('cityNames'))
  for (let i = 0; i < cityNames.length; i++) {
    savedCityInput(cityNames[i]);
  }
}
updateSavedCities();


let updateCurrentWeather = function (currentWeather) {
  console.log(currentWeather);
  let divEl = document.createElement("div");
  divEl.setAttribute("id", "current-city-weather");
  let h2CityEl = document.createElement("h2");
  h2CityEl.setAttribute("id", "city-heading")
  h2CityEl.textContent = cityName + ' ' + moment().format("L");
  divEl.appendChild(h2CityEl);
  let div2El = document.createElement("div");
  div2El.setAttribute("class", "current-city-weather-data");
  divEl.appendChild(div2El)
  let humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity :" + currentWeather.humidity + "%";
  let windEl = document.createElement("p");
  windEl.textContent = "Wind :" + currentWeather.wind_speed + "MPH";
  let tempEl = document.createElement("p");
  tempEl.textContent = "Temp :" + currentWeather.temp + "*F";
  let uvIndexEl = document.createElement("p");
  uvIndexEl.textContent = "UV Index :" + currentWeather.uvi;
  div2El.appendChild(humidityEl);
  div2El.appendChild(windEl);
  div2El.appendChild(tempEl);
  div2El.appendChild(uvIndexEl);
  let rightSectionCityWeather = document.querySelector(".city-weather");
  rightSectionCityWeather.appendChild(divEl);
};

let updateDailyWeathers = function (dailyWeathers) {
  let div1El = document.createElement("div");
  div1El.setAttribute("id", "five-day-div")
  for (let i = 0; i < 5; i++) {
    let divEl = document.createElement("div");
    divEl.setAttribute("class", "five-day-weather");
    div1El.appendChild(divEl);
    let tempEl = document.createElement("p");
    tempEl.textContent = "Temp :" + dailyWeathers[i].temp.day + "*F";
    let windEl = document.createElement("p");
    windEl.textContent = "Wind :" + dailyWeathers[i].wind_speed + "MPH";
    let humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity :" + dailyWeathers[i].humidity + "%";
    divEl.appendChild(tempEl);
    divEl.appendChild(windEl);
    divEl.appendChild(humidityEl);
  }
  let rightSectionDailyWeathers = document.querySelector(".five-day-forecast");
  rightSectionDailyWeathers.appendChild(div1El);
};

cityFormEL.addEventListener("submit", submitHandler);