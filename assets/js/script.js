
//html element to append weather data
let containerEL = document.querySelector('#weatherContainer');
 //div for current weather
 let currentContainerEl = document.createElement('div');
 currentContainerEl.classList = 'border p-3';


//fetch UV index, create html element and append to currentContainer
function getUvIndex(lat, lon) {
    let apiUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=92d341cc17041755a8b8a4b27e865a34&lat=${lat}&lon=${lon}`
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        let uvIndex = data.value;
                       
                        let uvEl = document.createElement('p');
                        uvEl.textContent = `UV Index: `;
                        let uvbadgeEl = document.createElement('span');
                        uvbadgeEl.classList = getUvConditions(uvIndex);
                        uvbadgeEl.textContent = uvIndex;
                        uvEl.appendChild(uvbadgeEl);
                        currentContainerEl.appendChild(uvEl);
                    })
            }
        })

}

//display current weather information for city
function displayCurrent(data) {
    let city = data.name;
    let temp = Math.round((data.main.temp)*10)/10;
    let humidity = data.main.humidity;
    let wind = Math.round((data.wind.speed)*10)/10;
    let iconID = data.weather[0].icon;

    let date = moment().format('MM/DD/YYYY');

    //html element to append current weather
    let containerEL = document.querySelector('#weatherContainer');

    //city, date, and icon
    let locationEl = document.createElement('h2');
    locationEl.textContent = `${city} (${date})`;

    let iconEl = document.createElement('img');
    iconEl.setAttribute('src', `http://openweathermap.org/img/wn/${iconID}@2x.png`);

    locationEl.appendChild(iconEl);
    currentContainerEl.appendChild(locationEl);

    //temp element  
    let tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + ' °F';
    currentContainerEl.appendChild(tempEl);

    //humidity element
    let humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${humidity}%`;
    currentContainerEl.appendChild(humidityEl);

    //windSpeed element
    let windEl = document.createElement('p');
    windEl.textContent = `Wind Speed: ${wind} MPH`;
    currentContainerEl.appendChild(windEl);

    containerEL.appendChild(currentContainerEl);
    getUvIndex(data.coord.lat,data.coord.lon);
}

//returns correct badge class depending on UV index
function getUvConditions(uv) {
    if (uv <= 2) {
        return 'badge badge-success'
    }
    else if (uv <= 5) {
        return 'badge badge-warning'
    }
    else {
        return 'badge badge-danger'
    }
}

function displayForecast(data){
    
}

//gets the current & future weather conditions for city
function getWeather(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=92d341cc17041755a8b8a4b27e865a34`;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // save temp humidity, wind speed & UV index
                        displayCurrent(data);
                        displayForecast(data);
                    })
            }
        })
}

getWeather('san francisco');