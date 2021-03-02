// Import required packages
const express = require('express');
const https = require('https');

// Initialize app
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");

// Use middleware to recognize the incoming
// Request Objects as strings or arrays
app.use(express.urlencoded({
  extended: true
}));

// Tell express to look for any incomming requests
// that matches a file in the 'public' directory
app.use(express.static("public"));

// Build api query
let cityWeather = "Los Angeles"; // set los angeles as default city
const units = "imperial";
const apikey = "4aafd3e4423a8f4572676505a5c00a37";
const openweathermapURL = "https://api.openweathermap.org/data/2.5/weather?q=";

app.get("/", function(req, res) {

  // final api query
  const url = openweathermapURL + cityWeather + "&units=" + units + "&appid=" + apikey;

  // https get request
  https.get(url, function(response) {

    // get response
    response.on("data", function(data) {

      const weatherData = JSON.parse(data); // parse data in JSON format

      const responseCode = weatherData.cod;

      if (responseCode !== 200){
        res.render("error", {
          code: responseCode,
          city: cityWeather
        });
      } else{

        // grab data
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const image_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        // Send data to weather.ejs
        res.render("weather", {
          weatherDescription: description,
          city: cityWeather,
          temperature: temp,
          image: image_url
        }); // end res.render
      }

    }); // end response

  }); // end https get

}); // end app.get

// if city exists pass city to get request
app.post("/", function(req, res) {
  cityWeather = req.body.city;
  res.redirect("/"); // Redirect to homepage i.e. app.get("/")
});

// redirect user to home page after error message
app.post("/error", function(req, res) {
  cityWeather = "Los Angeles"; // default city
  res.redirect("/"); // Redirect to homepage i.e. app.get("/")
});

// Have server listen on Heroku's chosen port or localhost port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
