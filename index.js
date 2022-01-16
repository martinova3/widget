let geopositionResult = fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=8cc515ecf98d406987a1d83da70a5e60');

geopositionResult.then(response => {
    return response.json();
}).then(dataGeoposition => {
    const {city, region} = dataGeoposition;
    const select = document.querySelector('.select');
    select.value = city;
    let weatherResult = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${dataGeoposition.city}&appid=e72a5be9de4deb0f2d280218079ed0f9`);
    weatherResult.then(response => {
        return response.json();
    }).then(dataWeatherResult =>{
        update(dataWeatherResult);
        setInterval(cityWeather, 60000);

})
})

geopositionResult.catch(errorGeoposition => {});

function cityWeather(event){
    let cityName;
    if(event){
        cityName = event.target.value;
    }else{
        cityName = select.value;
    }
    let weatherResult = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e72a5be9de4deb0f2d280218079ed0f9`);
    weatherResult.then(response => {
        return response.json();
    }).then(dataWeatherResult =>{
        update(dataWeatherResult);
    })

};

const select = document.querySelector('select');
select.addEventListener('change', cityWeather);


function update(data){
    const locationName = data.name;
    let h = document.querySelector('h1');
    h.innerText = `${locationName}`;

    const tempMinData = changeToCelsius(data.main.temp_min);
    const tempMaxData = changeToCelsius(data.main.temp_max);
    const humidityData = data.main.humidity;
    const feelslikeData = changeToCelsius(data.main.feels_like); 
    const cloudsData = data.clouds.all;
    const windData = Math.round(data.wind.speed);
    const meanData = averageTemp(data.main.temp_min, data.main.temp_max);

    let mean = document.querySelector('.mean');
    mean.innerText = `${meanData}`;
    let tempMin = document.querySelector('.temp-min span');
    tempMin.innerText = `${tempMinData}`;
    let tempMax = document.querySelector('.temp-max span');
    tempMax.innerText = `${tempMaxData}`;
    let humidity = document.querySelector('.humidity span');
    humidity.innerText = `${humidityData}`;
    let feelslike = document.querySelector('.feels-like span');
    feelslike.innerText = `${feelslikeData}`;
    let clouds = document.querySelector('.clouds span');
    clouds.innerText = `${cloudsData}`;
    
    const weatherBox = document.querySelector('.weather-box');
    
    if(cloudsData>50){
        weatherBox.setAttribute('weather-type', 'cloudy');
    }else{
        if(cloudsData>25){
            weatherBox.setAttribute('weather-type', 'semi-cloudy');
    }else{
        weatherBox.setAttribute('weather-type', 'sunny');
    }
    };

    let wind = document.querySelector('.wind span');
    wind.innerText = `${windData}`;

    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    
    let hours = now.getHours();
    let minutes = now.getMinutes();

    let hTime = document.querySelector('.update-text-time');
    hTime.innerText = `${ hours<10 ? `0${hours}` : hours}:${minutes<10 ? `0${minutes}` : minutes}`;
    let hTimeText = document.querySelector('.update-text-date');
    hTimeText.innerText = `${day<10 ? `0${day}` : day}.${month<10 ? `0${month}` : month}.${year}`;


    hours>19 || hours<6 ? weatherBox.setAttribute('day-phase', 'night') : 
    weatherBox.setAttribute('day-phase', 'day');

};

  function changeToCelsius(degree){
    return Math.round(degree - 273.15) + ' C°';
  };

  function averageTemp(minTemp, maxTemp){
      return changeToCelsius(Math.round((minTemp + maxTemp)/ 2));
  };


async function getCurrencies(){

    let response = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
    let result = await response.json();
    updateCurrencies(result);

}

getCurrencies();

function updateCurrencies(currencies){
    currencies.forEach(element => {
        const {base_ccy, ccy, buy, sale} = element;
        const currenceLine = document.querySelector(`.${ccy} h3`);
        currenceLine.innerText = `${ccy}/${base_ccy} - ${Number(buy).toFixed(2)} / ${Number(sale).toFixed(2)}`;
    });

}
