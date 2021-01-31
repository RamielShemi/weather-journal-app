/* Global Variables */

let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
let apikey = '2ecfff579c5412ddc82c718cc4a19482';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    e.preventDefault();
    const newZip = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;
    console.log(newDate);
    getTemperature(baseURL, newZip, apikey)
    .then(function (data){
        postData('http://localhost:5000/addWeatherData', {temperature: data.main.temp, date: newDate, user_response: content } )
        .then(function() {
            updateUI()
        })
    })
}

// Async GET
const getTemperature = async (baseURL, newZip, apikey)=>{
    const response = await fetch(baseURL + newZip + '&APPID=' + apikey)
    console.log(response);
    try {
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch(error) {
        console.log('error', error);
    }
}

// Async POST
const postData = async (url = '', data = {}) => {
    const req = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json;chareset=utf-8',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await req.json();
        return newData;
    }
    catch (error){
        console.log('Error', error);
    }
}

//  convert to celsius
function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        return (kelvin - 273.15).toFixed(2);
    }
}

// Update user interface
const updateUI = async () => {
    const req = await fetch('http://localhost:5000/all');
    try {
        const allData = await req.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temperature + ' degree C';
        document.getElementById('content').innerHTML = allData.user_response;
    }
    catch (error) {
        console.log('error', error);
    }
}
