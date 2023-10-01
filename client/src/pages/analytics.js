// src/components/LineChartWithData.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import 'chartjs-adapter-moment';
import '../App.css';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  TimeScale
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  TimeScale,
)

const Analytics = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyticsDD, setAnalyticsDD] = useState("all");

  useEffect(() => {
    // Load CSV data and parse it
    const fetchData = async () => {
      try {
        let response = "";
        if (analyticsDD === "all") {
          response = await fetch('/data/vesselsAll.csv');
        }
        else if (analyticsDD === "1Y") {
          response = await fetch('/data/vessels1Y.csv');
        }
        else if (analyticsDD === "YTD") {
          response = await fetch('/data/vesselsYTD.csv');
        }
        else if (analyticsDD === "future1Y") {
          response = await fetch('/data/predictedVessels1Y.csv');
        }
        else if (analyticsDD === "future5Y") {
          response = await fetch('/data/predictedVessels5Y.csv');
        }
        else if (analyticsDD === "futureAll") {
          response = await fetch('/data/predictedVessels.csv');
        }
        const csvData = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        Papa.parse(csvData, {
          header: true, // Treat the first row as headers
          dynamicTyping: true, // Automatically detect numeric values
          complete: (result) => {
            if (Array.isArray(result.data) && result.data.length > 0) {
              // Extract data from the parsed CSV
              const dates = result.data.map((row) => {
                const date = new Date(row.month);
                if (isNaN(date.getTime())) {
                  // Handle invalid dates, you can set them to a default value or skip them
                  return null; // Skip invalid dates
                }
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                const month = monthNames[date.getMonth()]; // Get the month name
                const year = date.getFullYear().toString(); // Get the full year
                if (year < 1995) return null;
                return `${month} ${year}`;
              }).filter(date => date !== null);              
              console.log(dates);
              const number_of_vessels = result.data.map((row) => row.number_of_vessels);

              // Set chart data
              setChartData({
                labels: dates,
                datasets: [
                  {
                    label: 'Number of Vessels',
                    data: number_of_vessels,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    pointBorderColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.2,
                  },
                ],
              });

              setLoading(false); // Data has been loaded
            } else {
              console.error('No data found in CSV file.');
            }
          },
        });

      } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
      }
    };

    fetchData();
  }, [analyticsDD]);

  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      // y: {},
      // x: {
      //   type: 'time',
      //   time: {
      //     unit:"year",
      //     displayFormats:{year:'YYYY'},
      //     min:'1970' ,
      //     max:'2018',
      //     // unit: 'month',
      //     // stepSize: 12, // Display only every January
      //     // tooltipFormat: 'MM', // Format for tooltip (e.g., "01" for January)
      //     // min: '1995-01',
      //   },
      // },
    },
  };
  
  
  

  return (
    <div className="line-chart">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className = "analytics">
            <div className = "analytics-chart">
              <Line data={chartData} options={options}/>
            </div>
            <div className = "analytics-info">
              <div className = "analytics-info-text">Number of Vessels</div>
              <select className = "analytics-info-dropdown" name="analyticsDD" onChange={(e) => setAnalyticsDD(e.target.value)}>
                <option value="all">All time</option>
                <option value="1Y">Past 1 Year</option>
                <option value="YTD">Year to Date</option>
                <option value="future1Y">Future 1 year</option>
                <option value="future5Y">Future 5 years</option>
                <option value="futureAll">Future All</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
