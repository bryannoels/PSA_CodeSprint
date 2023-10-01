import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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
);

const Analytics = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyticsDD, setAnalyticsDD] = useState('all');

  const fetchData = async (selectedOption) => {
    try {
      let response = '';
      switch (selectedOption) {
        case 'all':
          response = await fetch('http://localhost:8000/vesselsAll');
          break;
        case '1Y':
          response = await fetch('http://localhost:8000/vessels1Y');
          break;
        case 'YTD':
          response = await fetch('http://localhost:8000/vesselsYTD');
          break;
        case 'future1Y':
          response = await fetch('http://localhost:8000/predictedVessels1Y');
          break;
        case 'future5Y':
          response = await fetch('http://localhost:8000/predictedVessels5Y');
          break;
        case 'futureAll':
          response = await fetch('http://localhost:8000/predictedVessels');
          break;
        default:
          throw new Error('Invalid option');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const dates = jsonData.map((entry) => entry.month);
        const number_of_vessels = jsonData.map((entry) => entry.number_of_vessels);

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

        setLoading(false);
      } else {
        console.error('No data found in the API response.');
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  useEffect(() => {
    fetchData(analyticsDD);
  }, [analyticsDD]);

  const options = {
    plugins: {
      legend: true,
    },
    scales: {},
  };

  return (
    <div className="line-chart">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="analytics">
            <div className="analytics-chart">
              <Line data={chartData} options={options} />
            </div>
            <div className="analytics-info">
              <div className="analytics-info-text">Number of Vessels</div>
              <select
                className="analytics-info-dropdown"
                name="analyticsDD"
                onChange={(e) => setAnalyticsDD(e.target.value)}
                value={analyticsDD}
              >
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
