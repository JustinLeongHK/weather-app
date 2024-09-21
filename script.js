document.addEventListener("DOMContentLoaded", () => {
  const OPENWEATHER_APIKEY = ""; // Please insert your own OPENWEATHER_APIKEY

  const refreshButton = document.getElementById("refresh-button");
  const temperatureReadings = [
    document.getElementById("temp-reading-0"),
    document.getElementById("temp-reading-1"),
    document.getElementById("temp-reading-2"),
    document.getElementById("temp-reading-3"),
  ];
  const weatherIcons = [
    document.getElementById("weather-icon-0"),
    document.getElementById("weather-icon-1"),
    document.getElementById("weather-icon-2"),
    document.getElementById("weather-icon-3"),
  ];
  const times = [
    document.getElementById("time-0"),
    document.getElementById("time-1"),
    document.getElementById("time-2"),
    document.getElementById("time-3"),
  ];
  const location = document.getElementById("location");

  async function getCurrentTemp(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`
      );

      if (!response.ok) throw new Error(`HTTP error status ${response.status}`);

      const data = await response.json();
      const currentTimeDate = new Date();

      let i = 0;
      while (currentTimeDate > new Date(data.list[i].dt_txt)) i++;
      i--; // Subtract 1 to get the nearest time

      // set location
      location.innerHTML = `<p>${data.city.name}<span style="font-size: 0.5em; margin-left:1em;">${data.city.country}</span></p>`;

      // Set current and next readings
      for (let j = 0; j < 4; j++) {
        temperatureReadings[
          j
        ].innerHTML = `<p>${data.list[i].main.temp}&deg;C</p>`;
        weatherIcons[
          j
        ].src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
        if (j == 0) {
          times[j].innerHTML = `<p>Now</p>`;
        } else {
          times[j].innerHTML = `<p>${data.list[i].dt_txt.slice(-8, -3)}</p>`;
        }
        i++;
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  function getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getCurrentTemp(lat, lon);
        },
        (error) => {
          if (error.message === "User denied Geolocation") {
            alert(
              "Please enable geolocation to get accurate local weather predictions."
            );
          }
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  refreshButton.addEventListener("click", getGeolocation);

  getGeolocation();
});
