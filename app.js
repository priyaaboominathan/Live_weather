const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index.ejs",{});
});
app.post("/", function (req, res) {
  const city = req.body.cityName;

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=c3eaeb0bf8b550453db6241895c26e25&units=metric";
  
  https.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode == 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const place = weatherData.name;
       
        const temp = weatherData.main.temp;
        const desc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl =
          "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        const date = weatherData.dt * 1000;
        const dateObject = new Date(date);
        const DateFormat = dateObject.toLocaleString(); 
        const wind = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const pressure = weatherData.main.pressure;
        const cloudy = weatherData.clouds.all;

        res.render("main.ejs",{
          place: place,
          date: DateFormat,
          iconurl: iconUrl,
          desc: desc,
          temp: temp + " °C",
          wind: wind + " m/s",
          humidity: humidity+" %",
          pressure: pressure+" hPa",
          cloudy: cloudy +" %",
        })
      });
    }
    else{
        res.render("index.ejs",{
          note: "*please enter a valid city name."
        })
      

    }
  });
});
app.listen(3000, function () {
  console.log("server started on port 3000. ");
});
