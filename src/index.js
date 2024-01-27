// Import your CSS file
import './styles/style.css';
import $ from 'jquery';

$(document).ready(function () {
  const app = $(".weather-app");
  const temp = $(".temp");
  const dateOutput = $(".date");
  const timeOutput = $(".time");
  const conditionOutput = $(".condition");
  const nameOutput = $(".name");
  const icon = $(".icon");
  const cloudOutput = $(".cloud");
  const humidityOutput = $(".humidity");
  const windOutput = $(".wind");
  const form = $("#locationInput");
  const search = $(".search");
  const btn = $(".submit");
  const cities = $(".city");

  let cityInput = "Jakarta";

  // Add click event to each city in the panel
  cities.on("click", function (e) {
    // Change from default city to the clicked one
    cityInput = $(this).text();
    // Function that fetches and displays all the data from the weather API
    fetchWeatherData();
    // Fade out the app (simple animation)
    app.css("opacity", "0");
  });

  // Add submit event to the form
  form.on("submit", function (e) {
    // If the input field (search bar) is empty, throw an alert
    if (search.val().length === 0) {
      alert("Please type in a city name");
    } else {
      // Change from default city to the one written in the input field
      cityInput = search.val();
      // Function that fetches and displays all the data from the Weather API
      fetchWeatherData();
      // Remove all text from the input field
      search.val("");
      // Fade out the app (simple animation)
      app.css("opacity", "0");

      e.preventDefault();
    }
  });

  function fetchWeatherData() {
    if (!cityInput) {
      alert("Please provide a city name");
      return;
    }

    const apiKey = "5836ddf871ba42b088b02150242701";
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data);
        temp.html(data.current.temp_c + "&#176");
        conditionOutput.html(data.current.condition.text);

        // Get the date and time from the city
        const date = new Date(data.location.localtime);
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const time = date.toLocaleTimeString();

        // Format the date and time
        dateOutput.html(`${date.toLocaleDateString(undefined, options)}`);
        timeOutput.html(time);
        nameOutput.html(data.location.name);

        // Get the corresponding icon URL for the weather
        const iconUrl = data.current.condition.icon;
        icon.attr("src", iconUrl);

        // Add the weather details to the page
        cloudOutput.html(`cloudy: ${data.current.cloud}%`);
        humidityOutput.html(`humidity: ${data.current.humidity}%`);
        windOutput.html(`wind: ${data.current.wind_kph} km/h`);

        // Set default rule of day
        let timeOfDay = "day";
        const code = data.current.condition.code;

        // Change to night if it's night time in the city
        if (!data.current.is_day) {
          timeOfDay = "night";
        }

        function setWeatherBackground(code, timeOfDay) {
          console.log("Code:", code);
          console.log("Time of Day:", timeOfDay);

          let backgroundImage, buttonColor;

          switch (code) {
            case 1000:
              backgroundImage = `url(${require(`./images/${timeOfDay}/clear.jpg`)})`;
              buttonColor = timeOfDay === "night" ? "#181e27" : "#e5ba92";
              break;
            case 1003:
            case 1006:
            case 1009:
            case 1030:
            case 1069:
            case 1087:
            case 1135:
            case 1273:
            case 1276:
            case 1279:
            case 1282:
              backgroundImage = `url(${require(`./images/${timeOfDay}/cloudy.jpg`)})`;
              buttonColor = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
              app.css("opacity", "1");
              break;
            case 1065:
            case 1069:
            case 1072:
            case 1150:
            case 1159:
            case 1180:
            case 1183:
            case 1186:
            case 1189:
            case 1192:
            case 1195:
            case 1204:
            case 1207:
            case 1240:
            case 1243:
            case 1246:
            case 1249:
            case 1252:
              backgroundImage = `url(${require(`./images/${timeOfDay}/rainy.jpg`)})`;
              buttonColor = timeOfDay === "night" ? "#325c80" : "#647d75";
              app.css("opacity", "1");
              break;
            default:
              console.log("Unknown weather code:", code);
              backgroundImage = `url(${require(`./images/${timeOfDay}/snowy.jpg`)})`;
              buttonColor = timeOfDay === "night" ? "#000000" : "#FFFFFF";
              app.css("opacity", "1");
          }

          console.log("Background Image:", backgroundImage);
          console.log("Button Color:", buttonColor);

          app.css("backgroundImage", backgroundImage);
          btn.css("background", buttonColor);

          // Add responsive styles based on screen width
          if (window.innerWidth <= 600) {
            app.css("backgroundSize", "contain");
          } else {
            app.css("backgroundSize", "cover");
          }
        }

        setWeatherBackground(data.current.condition.code, data.current.is_day ? "day" : "night");

        app.css("opacity", "1");
      },
      error: function (error) {
        console.error(error);
        alert("City not found, please try again");
        app.css("opacity", "1");
      },
    });
  }

  // Initial data fetch
  fetchWeatherData();
});

// Define the custom element class
class MyBrand extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Define the HTML template
    this.shadowRoot.innerHTML = `
      <style>
        /* Add any additional styling here */
        :host {
          color: #007BFF; /* Set the color to blue, you can adjust as needed */
        }
      </style>
      <h3>The weather-app</h3>
    `;
  }
}

// Define the custom element
customElements.define('my-brand', MyBrand);
