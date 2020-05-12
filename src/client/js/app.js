/* Global Variables */
// API key
const pixabayApiKey = '11454438-c9bc7864fb50abf1efb41c3e2';
const weatherBitsApiKey = 'd7e14b30873b423782abf240a013dc63';
// Geonames API will not let me use my personal username for some reason so I am using some one else's. I've registered and everything and it still wont work. My username is trentschnee
const geoNameUser = 'timetotravel';


const getRecentTrip = async () => {
    const getTripData = await fetch(`http://localhost:8081/getTrip`);
    try {
        return await getTripData.json();
    }
    catch (error) {
        console.log('Error(getRecentTrip):', error)
    }
};
const delTripData = async () => {
    const delTripData = await fetch(`http://localhost:8081/delTrip`);
    try {
        return await delTripData.json();
    }
    catch (error) {
        console.log('Error(delTripData):', error)
    }
};
const postTrip = async (tripObj) => {
    const postTripData = await fetch(`http://localhost:8081/postTrip`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(tripObj)
    });
    try {
        return await postTripData.json();
    }
    catch (error) {
        console.log('Error(postTrip):', error)
    }
};
const getWeatherData = async (lat, lon) => {
    const weatherData = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&units=i&key=${weatherBitsApiKey}`);
    try {
        return await weatherData.json();
    }
    catch (error) {
        console.log('Error(getWeatherData):', error)
    }
};
const getCityData = async (location) => {
    const CityData = await fetch(`http://api.geonames.org/searchJSON?q=${location}&maxRows=10&&username=${geoNameUser}`);
    try {
        return await CityData.json();
    }
    catch (error) {
        console.log('Error(getCityData):', error)
    }
};
const getPicData = async (lQuery) => {
    const picData = await fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=${lQuery}&image_type=photo&pretty=true`);
    try {
        return await picData.json();
    }
    catch (error) {
        console.log('Error(getPicData):', error)
    }
};

// This function will take in an object and then manipulate the dom according to the object's value.
 function changeUi(data){
    var src = document.getElementById("imgPane");
    const detailsPane = document.getElementById('detailsPane');
    const detailsPanel = document.getElementById('detailsPanel');
    var img = document.createElement("img");
    // If the data object is not empty, assign the variables and add the details
    if (Object.keys(data).length !== 0) {
        const { name, image, currentTemp, departureDate, currentForecast } = data;
        img.src = image;

        detailsPane.innerHTML = ` <p>You're going to: <span id="location-details">${name}</span></p>
        <p>You're departing on: <span id="departure-date-details">${departureDate}</span></p>
        <div class="weatherInfo">
          <p>Current weather is: <span id="current-weather-details">${currentTemp} °F</span></p> <p>Forecast for today: <span id="current-weather-details">${currentForecast}</span></p>`;
        detailsPanel.insertAdjacentHTML('beforeend', `<button id="delButton" class="delButton" onclick="return Client.handleDeleteData()">Delete</button>`);
        src.appendChild(img);

    }
    else {
        const detailsPane = document.getElementById('detailsPane');
        detailsPane.innerHTML = ` <p>There are currently no results.</p>`;
        img.src = '';
        document.getElementById("delButton").remove();
        src.replaceChild(img, src.childNodes[0]);
    }


}

// When the DOM is loaded, update all elements
document.addEventListener('DOMContentLoaded', () => {

    getRecentTrip().then((tripData) => {
        (Object.keys(tripData).length !== 0) ? changeUi(tripData) : null;
    })
})
// Async function which does a promise chain of dependent promises and then posts the trip to the server
const handleTripData = async (location, date) => {
    let postObject = {};
    const resultCity = await (getCityData(location))
    const lat = resultCity.geonames[0].lat;
    const lon = resultCity.geonames[0].lng;
    const resultWeather = await (getWeatherData(lat, lon));
    const queryName = `${resultWeather.data[0].city_name}, ${resultWeather.data[0].country_code}`;
    const resultPic = await (getPicData(resultWeather.data[0].city_name));
    postObject.name = queryName;
    postObject.image = resultPic.hits[0].webformatURL;
    postObject.currentTemp = resultWeather.data[0].temp;
    postObject.currentForecast = resultWeather.data[0].weather.description;
    postObject.departureDate = date;
    //post the trip
    const resultpostTrip = await postTrip(postObject);
    await (changeUi(resultpostTrip))
}
const handleDeleteData = async (location, date) => {
    const resultDelete = await (delTripData())
    await (changeUi(resultDelete))
}

function validateForm(location, date, cb) {
    let error;
    // Test if the input is valid, if so return true
    if (location && date) {
        cb(true);
    }
    else {
        !date ? error = 'Empty date' : error = 'Invalid location format. Enter in location like so -> "Paris, France"'
        cb(false, error);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const date = document.getElementById('departure-date').value;
    validateForm(location, date, (response, error) => {
        response ? handleTripData(location, date) : alert(error)
            ;
    })


}
export {
    handleSubmit, handleDeleteData, changeUi
}