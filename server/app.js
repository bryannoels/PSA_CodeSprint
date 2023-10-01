const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const port = 8000;

// Serve static files (optional, but useful for serving JSON)
app.use(express.static('public'));
app.use(cors());

// Define a route to get the JSON data from the CSV
app.get('/vesselsYTD', (req, res) => {
  const results = [];
  fs.createReadStream('./data/vesselsYTD.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/vesselsAll', (req, res) => {
  const results = [];
  fs.createReadStream('./data/vesselsAll.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/vessels1Y', (req, res) => {
  const results = [];
  fs.createReadStream('./data/vessels1Y.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/berthAvailability', (req, res) => {
  const results = [];
  fs.createReadStream('./data/berthAvailability.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/cranesAndHandlingEquipments', (req, res) => {
  const results = [];
  fs.createReadStream('./data/cranesAndHandlingEquipments.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/upcomingVessels', (req, res) => {
  const results = [];
  fs.createReadStream('./data/upcomingVessels.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/predictedVessels', (req, res) => {
  const results = [];
  fs.createReadStream('./data/predictedVessels.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/predictedVessels1Y', (req, res) => {
  const results = [];
  fs.createReadStream('./data/predictedVessels1Y.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.get('/predictedVessels5Y', (req, res) => {
  const results = [];
  fs.createReadStream('./data/predictedVessels5Y.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
