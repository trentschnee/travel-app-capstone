var path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()

let trip = {};
// configure express to use body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use(express.static('dist'))




app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})
app.get('/getTrip', function (req, res) {
    res.send(trip)
})
app.get('/delTrip', function (req, res) {
    trip = {};
    console.log('deleting')
    res.send(trip)
})

app.post('/postTrip', function (req, res) {
    trip = req.body;
    res.send(trip)

   
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})


