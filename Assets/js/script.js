// API call = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&lang={lang}
let searchList;
let dateObj;
// Variable to Store the API Key
const weatherKey = "982cf2fd80afcedc816db8b861517569";

// Beginning string of weather url path
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
// Beginning string of forecast url path
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

// Generates weather URL
const generateWeatherUrl = function (cityName) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherKey}&units=imperial`;
};
let cityWeather, cityForecast;
// Gets weather data by city (via user input in search bar)
const getWeather = (isFromHistory, historicValue) => {
  let searchInput;
  if (isFromHistory) {
    searchInput = historicValue;
  } else {
    searchInput = document
      .getElementById("searchInput")
      .value.replaceAll(" ", "+");
  }
  fetch(generateWeatherUrl(searchInput))
    .then((response) => {
      if (response.ok) {
        return response.json(); // this becomes data in the next function
      } else {
        return false;
      }
    })
    // If a valid city is not entered, an alert message will pop up
    .then((data) => {
      if (!data) {
        alert("Invalid city name, please give a valid city name.");
      } else {
        // Data is now stored in the cityWeather variable
        cityWeather = data;
        if (!isFromHistory) {
          addNewSearch(cityWeather.name);
        }
        cityDash();

        // Gets forecast of selected city
        getForecast(cityWeather);
      }
    });
};

// Adding cityName to the end of the searchList array; `.push` takes a variable and adds it to the end of an array
function addNewSearch(cityName) {
  searchList.push(cityName);
  // Saves searchList items to localStorage as a string.
  localStorage.setItem("searchList", searchList.toString());
  populateSearchHistory();
}

function getSearchList() {
  // if the local storage is empty
  if (localStorage.getItem("searchList") != undefined) {
    searchList = localStorage.getItem("searchList").split(",");
    //  Otherwise it sets searchList to an empty array.
  } else {
    searchList = [];
  }
}

// Generates forecast url by interpolating latitude, longitude, & weatherKey to create a template literal string.
const generateForecastUrl = (lat, lon) => {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=imperial`;
};
// gets the citits coordinates (lat&lon)
const getForecast = (cityWeather) => {
  fetch(generateForecastUrl(cityWeather.coord.lat, cityWeather.coord.lon))
    .then(
      (response) => response.json() // When curly brackets aren't used in a arrow function the default is to return the value. this becomes data in the next function
    )
    .then((data) => {
      cityForecast = data;
      // data is defined
      forecastCards();
    });
};

//getWeather("Atlanta"); //this call gets the weather and the 3 hour 5 day forecast for atlanta.

// When button is selected or `Enter` is pressed, call getWeather function
function setup() {
  let button = document.getElementById("searchButton");
  let searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
  button.addEventListener("click", () => {
    getWeather();
    // cityDash();
    // forecastCards();
  });
}
// Runs setUp function once the HTML doc has been parsed
document.addEventListener("DOMContentLoaded", function () {
  setup();
  currentDate();
  getSearchList();
  populateSearchHistory();
  getWeather(true, "Atlanta");
});

// this function clears search history, creates new <li> list elements of cities entered into search bar
function populateSearchHistory() {
  let searchHistory = document.querySelector(".searchHistory");
  // getting rid of everything inside of searchHistory
  searchHistory.innerHTML = "";
  // for loop that reverses the order of the search list array
  for (let i = searchList.length - 1; i >= 0; i--) {
    console.log(i);
    let newListItem = document.createElement("li");
    // creates a class for list elements
    //newListItem.setAttribute("historicValue", searchList[i]);
    newListItem.classList.add("listItem");
    newListItem.addEventListener("click", function () {
      getWeather(true, searchList[i]);
    });
    newListItem.innerHTML = searchList[i];
    searchHistory.appendChild(newListItem);
  }
}

// Takes in curent weather obj (cityWeather pass in) to populate all the fields in the html
function cityDash() {
  // Date
  let currentDay = document.getElementById("currentDay");
  currentDay.innerHTML = cityWeather.name + " (" + dateObj[0].dateStr + ")";
  // Icon
  let currentIcon = document.getElementById("currentIcon");
  currentIcon.src = `http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}.png`;
  // Temp
  let currentTemp = document.getElementById("currentTemp");
  currentTemp.innerHTML = cityWeather.main.temp;
  // Wind
  let currentWind = document.getElementById("currentWind");
  currentWind.innerHTML = cityWeather.wind.speed;
  // Humidity
  let currentHumidity = document.getElementById("currentHumidity");
  currentHumidity.innerHTML = cityWeather.main.humidity;
}

// Takes in curent forecast obj (cityWeather pass in) to populate all the fields in the html
function forecastCards() {
  let forecastDate,
    forecastIcon,
    forecastTemp,
    forecastWind,
    forecastHumidity,
    dayTime;
  for (let i = 1; i < 6; i++) {
    //function for getting the right position in the array for 3pm date time each day of the forecast.
    dayTime = 3 + 8 * (i - 1);
    forecastDate = document.getElementById("forecastDate" + i);
    forecastDate.innerHTML = dateObj[i].dateStr;
    forecastIcon = document.getElementById("forecastIcon" + i);
    forecastIcon.src = `http://openweathermap.org/img/wn/${cityForecast.list[dayTime].weather[0].icon}.png`;
    forecastTemp = document.getElementById("forecastTemp" + i);
    forecastTemp.innerHTML = cityForecast.list[dayTime].main.temp;
    forecastWind = document.getElementById("forecastWind" + i);
    forecastWind.innerHTML = cityForecast.list[dayTime].wind.speed;
    forecastHumidity = document.getElementById("forecastHumidity" + i);
    forecastHumidity.innerHTML = cityForecast.list[dayTime].main.humidity;
  }
}

// Date return function
function currentDate() {
  // let currentDate = new date();
  let dateTime;
  dateObj = {};
  dateTime = new Date();
  for (let i = 0; i < 6; i++) {
    // Date object to calculate current date and 5 day forecast
    dateObj[i] = {
      dateTime: dateTime,
      dateStr:
        dateTime.getMonth() +
        1 +
        "/" +
        dateTime.getDate() +
        "/" +
        dateTime.getFullYear(),
    };
    dateTime.setDate(dateTime.getDate() + 1);
  }
}
