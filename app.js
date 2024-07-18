const express = require('express');
const https = require('https');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const port = 3000;

app.get('/', (req, res) => {
res.sendFile(__dirname + "/index.html");
   
});

app.post('/',(req,res) =>{
    const query = req.body.cityName
const apikey = '657c01b5cc853cd3a1565e0140a73c89'
const url = 'https://api.openweathermap.org/data/2.5/weather?q='+query +'&appid='+ apikey+'&units=metric';

https.get(url, (response) => {
    let data = '';

    // Append data chunks to `data` variable
    response.on('data', (chunk) => {
        data += chunk;
    });

    // On end of response, parse the data and send it
    response.on('end', () => {
        try {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            res.send(`<h3>Current temperature in ${query} is ${temp}°C with ${description}.</h3>`);
        } catch (error) {
            res.status(500).send('Error parsing weather data.');
        }
    });

}).on('error', (err) => {
    res.status(500).send('Error fetching weather data.');
});
    
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
