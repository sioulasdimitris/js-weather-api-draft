document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "cf84a9e23f42409790f92249200606";
  const $locationInput = document.querySelector("#location-query");
  const $locations = document.querySelector("#locations");
  const $weatherWidget = document.querySelector("#weather-widget");

  $locationInput.addEventListener("input", async (e) => {
    const serchTerm = e.target.value;
    $locations.innerHTML = "";

    if (serchTerm.length >= 3) {
      const res = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${serchTerm}`
      );
      const locations = await res.json();
      const locationsHTML = locations
        .map(({ lat, lon, name }) => {
          return `<li><a href="#" data-lat="${lat}" data-lon="${lon}">${name}</a></li>`;
        })
        .join("");
      console.log(locations);

      $locations.innerHTML = `<ul>${locationsHTML}</ul>`;
    }
  });

  $locations.addEventListener("click", async (e) => {
    e.preventDefault();

    if (e.target.tagName === "A") {
      $locations.innerHTML = "";
      $locationInput.value = e.target.innerText;
      const { dataset } = e.target;
      const query = `${dataset.lat},${dataset.lon}`;
      const res = await fetch(`
        http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}
        `);
      const weatherData = await res.json();
      const { current, location } = weatherData;
      const weatherCard = `
        <div class="card text-center">
          <div class="card-header">
            <h4>${location.name}, ${location.region}, ${location.country}</h4>
          </div>
          <div class="weather-condition">
            <div class="icon">
              <img
                src="http:${current.condition.icon}"
                alt="${current.condition.text}"
              />
            </div>
            <div>
              <h2>${current.temp_c}&#8451;</h2>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${current.condition.text}</h5>
            <p class="card-text">Humidity: ${current.humidity}%</p>
          </div>
        </div>
        `;

      $weatherWidget.innerHTML = weatherCard;
    }
  });
});
