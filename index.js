// Require the express module
const express = require("express");

// Initialize a new express app
const app = express();

// Requiring https module
const https = require("https");

app.use(express.static("public"));

// Require body parse
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Get request
app.get("/", function (req, res) {
    var data = {
        currDate: new Date().toLocaleDateString(),
        currDay: new Date().getDay(),
        day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };
    res.render("index.ejs", data);
});

// Post request
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const unit = "metric";
    const appKey = "bbe1efaf9a793fac6540ff1d4b7e2961";
    const api = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + appKey;

    // Making an HTTP get request over the internet to the API
    https.get(api, function (response) {
        console.log(response.statusCode);

        // Using JSON parse to convert data into JavaScript object
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            const temp = weatherData.main.temp;
            const dis = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconImage = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            const humidity = weatherData.main.humidity;
            const wind = weatherData.wind.speed;
            const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            // Rendering the EJS file with data
            res.render("index", { temp, cityName: query, dis, iconImage, humidity, wind, day, currDay: new Date().getDay(), currDate: new Date().toLocaleDateString() });
        });
    });
});

app.listen(3000, function () {
    console.log("server is running");
});
