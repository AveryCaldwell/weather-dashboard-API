let searchList;
let dateObj;
let cityWeather;
let cityForecast;
// Variable to Store the API Key
const weatherKey = "982cf2fd80afcedc816db8b861517569";

// Beginning string of weather url path
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
// Beginning string of forecast url path
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

// Generates weather URL with a pass in cityName
const generateWeatherUrl = function (cityName) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherKey}&units=imperial`;
};

// Gets weather data by city (via user input in searchbar)
const getWeather = (isFromHistory, historicValue) => {
  let searchInput;
  if (isFromHistory) {
    searchInput = historicValue;
  } else {
    searchInput = document
      .getElementById("searchInput")
      .value.replaceAll(" ", "+");
  }
  // Uses fetch on the weather url to call their api, and then if the response is okay, it sets the data to response.json.
  fetch(generateWeatherUrl(searchInput))
    .then((response) => {
      if (response.ok) {
        return response.json(); // this becomes data in the next function
      } else {
        return false;
      }
    })
    // If an invalid city is entered, an alert message will pop up
    .then((data) => {
      if (!data) {
        alert("Invalid city name, please give a valid city name.");
      } else {
        // Data is now stored in the cityWeather variable
        cityWeather = data;
        // if a new city is searched, then the city name is added to search history
        if (!isFromHistory) {
          addNewSearch(cityWeather.name);
        }
        // Calls cityDash function
        cityDash();
        // Gets forecast of selected city
        getForecast(cityWeather);
      }
    });
};

// Adding cityName to the end of the searchList array; `.push` takes a variable and adds it to the end of an array.
function addNewSearch(cityName) {
  searchList.push(cityName);
  // Saves searchList items to localStorage as a string.
  localStorage.setItem("searchList", searchList.toString());
  populateSearchHistory();
}

function getSearchList() {
  // if the local storage is not empty,
  if (localStorage.getItem("searchList") != undefined) {
    // searchList items are turned into an ordered list of substrings, puts these substrings into an array.
    searchList = localStorage.getItem("searchList").split(",");
  } else {
    //  Otherwise it sets searchList to an empty array.
    searchList = [];
  }
}

// Generates forecast url by interpolating latitude, longitude, & weatherKey to create a template literal string.
const generateForecastUrl = (lat, lon) => {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=imperial`;
};
// gets the cities coordinates (lat&lon)
const getForecast = (cityWeather) => {
  fetch(generateForecastUrl(cityWeather.coord.lat, cityWeather.coord.lon))
    .then(
      // When curly brackets aren't used in a arrow function the default is to return the value. this becomes data in the next function
      (response) => response.json()
    )
    .then((data) => {
      cityForecast = data;
      // data is defined
      forecastCards();
    });
};

// When button is selected or `Enter` is pressed, getWeather function is called.
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
  });
}

// Runs multiple functions once the HTML doc has been parsed.
document.addEventListener("DOMContentLoaded", function () {
  setup();
  currentDate();
  getSearchList();
  populateSearchHistory();
  getWeather(true, "Atlanta");
});

// This function clears search history, creates new <li> list elements of cities entered into search bar
function populateSearchHistory() {
  let searchHistory = document.querySelector(".searchHistory");
  // Clears searchHistory
  searchHistory.innerHTML = "";
  // for loop that reverses the order of the search list array
  for (let i = searchList.length - 1; i >= 0; i--) {
    console.log(i);
    let newListItem = document.createElement("li");
    // creates a class for list elements
    newListItem.classList.add("listItem");
    newListItem.addEventListener("click", function () {
      getWeather(true, searchList[i]);
    });
    // newListItems are added to the end of the list
    newListItem.innerHTML = searchList[i];
    searchHistory.appendChild(newListItem);
  }
}

// Takes in curent weather obj to populate all the fields in the html
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

// Takes in curent forecast obj to populate all the fields in the html
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
