
const apiKey = '92d341cc17041755a8b8a4b27e865a34';
//html element to append weather data
 let currentContainerEl = document.querySelector('#current-weather');
 let forecastContainerEl = document.querySelector('#forecast-weather');
 let date = moment().format('M/DD/YYYY');


//fetch UV index, create html element and append to currentContainer
function getUvIndex(lat, lon) {
    let apiUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
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



    //html element to append current weather
    let containerEL = document.querySelector('#weatherContainer');

    //city, date, and icon
    let locationEl = document.createElement('h2');
    locationEl.textContent = `${city} (${date})`;

    let iconEl = document.createElement('img');
    iconEl.setAttribute('src', `http://openweathermap.org/img/wn/${iconID}@2x.png`);
    iconEl.setAttribute('width','50px');
    
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


    getUvIndex(data.coord.lat,data.coord.lon);

    displayForecast(data.coord.lat,data.coord.lon);
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

function displayForecast(lat,lon){
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&appid=${apiKey}`;
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                let forecastTitleEl = document.createElement('h3');
                forecastTitleEl.textContent = '5-Day Forecast';
                forecastContainerEl.appendChild(forecastTitleEl);

                let forecastContainerRow = document.createElement('div');
                forecastContainerRow.classList ='row';
            
                for(i=0;i<5;i++){
                    let newDate = moment().clone().add(i+1,'day').format('M/DD/YYYY');
                    let dayCard = document.createElement('div');
                    dayCard.classList = 'card bg-primary text-light col-sm ml-2 mr-2';

                    //date
                    let dateEl = document.createElement('p');
                    dateEl.classList='font-weight-bold';
                    dateEl.textContent = newDate;
                   dayCard.appendChild(dateEl);
                    
                    //icon
                    let iconEl = document.createElement('img');
                    let iconID = data.daily[i].weather[0].icon;
                    iconEl.setAttribute('src', `http://openweathermap.org/img/wn/${iconID}@2x.png`);
                    iconEl.setAttribute('width','50px');
                    dayCard.appendChild(iconEl);
                    
                    //temp
                    let tempEl =document.createElement('p');
                    tempEl.textContent=`Temp: ${data.daily[i].temp.day} °F`;
                    dayCard.appendChild(tempEl);

                    //humidity
                    let humidityEl = document.createElement('p');
                    humidityEl.textContent = `Humidity: ${data.daily[i].humidity}%`;
                    dayCard.appendChild(humidityEl);

                    forecastContainerRow.appendChild(dayCard);


                }
                forecastContainerEl.appendChild(forecastContainerRow);
            })
        }
    })

}

//gets the current & future weather conditions for city
function getWeather(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // save temp humidity, wind speed & UV index
                        displayCurrent(data);
                    })
            }
        })
}

getWeather('san francisco');