const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const csvParser = require('csv-parser');
const Papa = require('papaparse');

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

app.put('/sendCranes', (req, res) => {
  const { number, berth } = req.query;

  // Read cranes and handling equipments data
  const equipmentData = [];
  fs.createReadStream('./data/cranesAndHandlingEquipments.csv')
    .pipe(csvParser())
    .on('data', (data) => equipmentData.push(data))
    .on('end', () => {
      // Update the cranes for the specified berth
      const updatedEquipmentData = equipmentData.map((equipment) => {
        const updatedCranes = equipment.cranes - number;
        return {
          ...equipment,
          cranes: updatedCranes,
        };
      });

      // Write back the updated cranes and handling equipments data
      fs.writeFileSync('./data/cranesAndHandlingEquipments.csv', Papa.unparse(updatedEquipmentData));

      // Read berth availability data
      const berthAvailabilityData = [];
      fs.createReadStream('./data/berthAvailability.csv')
        .pipe(csvParser())
        .on('data', (data) => berthAvailabilityData.push(data))
        .on('end', () => {
          // Update the cranes for the specified berth in berth availability data
          const updatedBerthAvailabilityData = berthAvailabilityData.map((berthData) => {
            if (berthData.berth === berth) {
              const updatedCranes = parseInt(berthData.cranes) + parseInt(number);
              return {
                ...berthData,
                cranes: updatedCranes,
              };
            }
            return berthData;
          });

          // Write back the updated berth availability data
          fs.writeFileSync('./data/berthAvailability.csv', Papa.unparse(updatedBerthAvailabilityData));

          res.json({ message: 'Cranes and berth availability updated successfully' });
        });
    });
});

app.put('/sendHandlingEquipments', (req, res) => {
  const { number, berth } = req.query;

  // Read cranes and handling equipments data
  const equipmentData = [];
  fs.createReadStream('./data/cranesAndHandlingEquipments.csv')
    .pipe(csvParser())
    .on('data', (data) => equipmentData.push(data))
    .on('end', () => {
      // Update the cranes for the specified berth
      const updatedEquipmentData = equipmentData.map((equipment) => {
        const updatedHandlingEquipments = equipment.handling_equipments - number;
        return {
          ...equipment,
          handling_equipments: updatedHandlingEquipments,
        };
      });

      // Write back the updated cranes and handling equipments data
      fs.writeFileSync('./data/cranesAndHandlingEquipments.csv', Papa.unparse(updatedEquipmentData));

      // Read berth availability data
      const berthAvailabilityData = [];
      fs.createReadStream('./data/berthAvailability.csv')
        .pipe(csvParser())
        .on('data', (data) => berthAvailabilityData.push(data))
        .on('end', () => {
          // Update the cranes for the specified berth in berth availability data
          const updatedBerthAvailabilityData = berthAvailabilityData.map((berthData) => {
            if (berthData.berth === berth) {
              const updatedHandlingEquipments = parseInt(berthData.handling_equipments) + parseInt(number);
              return {
                ...berthData,
                handling_equipments: updatedHandlingEquipments,
              };
            }
            return berthData;
          });

          // Write back the updated berth availability data
          fs.writeFileSync('./data/berthAvailability.csv', Papa.unparse(updatedBerthAvailabilityData));

          res.json({ message: 'Cranes and berth availability updated successfully' });
        });
    });
});

app.put('/setVessel', (req, res) => {
  const { berth, vessel } = req.query;

  // Read berth availability data
  const berthAvailabilityData = [];
  fs.createReadStream('./data/berthAvailability.csv')
    .pipe(csvParser())
    .on('data', (data) => berthAvailabilityData.push(data))
    .on('end', () => {
      // Update berth availability data
      const updatedBerthAvailabilityData = berthAvailabilityData.map((berthData) => {
        if (berthData.berth === berth) {
          return {
            ...berthData,
            availability: 'occupied',
            current_vessel: vessel,
          };
        }
        return berthData;
      });

      // Write back the updated berth availability data
      fs.writeFileSync('./data/berthAvailability.csv', Papa.unparse(updatedBerthAvailabilityData));

      // Read upcoming vessels data
      const upcomingVesselsData = [];
      fs.createReadStream('./data/upcomingVessels.csv')
        .pipe(csvParser())
        .on('data', (data) => upcomingVesselsData.push(data))
        .on('end', () => {
          // Remove the row where upcoming_vessel matches the specified vessel
          const updatedUpcomingVesselsData = upcomingVesselsData.filter((upcomingVesselData) => {
            return upcomingVesselData.upcoming_vessel !== vessel;
          });

          // Write back the updated upcoming vessels data
          fs.writeFileSync('./data/upcomingVessels.csv', Papa.unparse(updatedUpcomingVesselsData));

          res.json({ message: 'Berth availability and upcoming vessel updated successfully' });
        });
    });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
