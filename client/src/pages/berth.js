import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../App.css';

function Berth() {
    const [loading, setLoading] = useState(true);
    const [berthData, setBerthData] = useState([]);
    const [vesselData, setVesselData] = useState([]);
    const [vesselDD, setVesselDD] = useState("");
    useEffect(() => {
        const fetchBerthData = async () => {
            try {
                const response = await fetch('/data/berthAvailability.csv');
                const csvData = await response.text();
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                Papa.parse(csvData, {
                    header: true, // Treat the first row as headers
                    dynamicTyping: true, // Automatically detect numeric values
                    complete: (result) => {
                      if (Array.isArray(result.data) && result.data.length > 0) {
                        setBerthData(result.data);
                        console.log(result.data);
                        setLoading(false); // Data has been loaded
                      } else {
                        console.error('No data found in CSV file.');
                      }
                    },
                  });
          
            } catch (err) {
                console.error(err);
            }
        }
        const fetchVesselData = async () => {
            try {
                const response = await fetch('/data/upcomingVessels.csv');
                const csvData = await response.text();
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                Papa.parse(csvData, {
                    header: true, // Treat the first row as headers
                    dynamicTyping: true, // Automatically detect numeric values
                    complete: (result) => {
                      if (Array.isArray(result.data) && result.data.length > 0) {
                        setVesselData(result.data);
                        console.log(result.data);
                        setLoading(false); // Data has been loaded
                      } else {
                        console.error('No data found in CSV file.');
                      }
                    },
                  });
          
            } catch (err) {
                console.error(err);
            }
        }
        fetchBerthData();
        fetchVesselData();
    },[]);
  return (
    <div className="berth">
        <div className="berth-table">
            <div className="berth-table-header">
                <div className="berth-table-header-item">Berth</div>
                <div className="berth-table-header-availability">Availability</div>
                <div className="berth-table-header-action">Action</div>
            </div>
            <div className="berth-table-content">
            { berthData.map((row) => (
                <div className="berth-table-row">
                    <div className="berth-table-content-item">
                        <div className="berth-table-content-item-berth-name">Berth {row.berth}</div>
                        <div className="berth-table-content-item-berth-equipments">
                            Cranes: {row.cranes} Handling Equipments: {row.handling_equipments}
                        </div>
                    </div>
                    <div className={row.availability === 'available'?"berth-table-content-availability berth-table-content-availability-available":"berth-table-content-availability berth-table-content-availability-occupied"}>{row.availability}</div>
                    <div className="berth-table-content-action">{row.availability === 'available'?
                        <div className = "berth-table-content-set-vessel">
                            <select className = "berth-table-content-vesselDD" name="vesselDD" onChange={(e)=>setVesselDD(e.target.value)}>
                                {vesselData.map((row) => (<option value={row.upcoming_vessel}>{row.upcoming_vessel}</option>))};
                            </select>
                            <button className="berth-table-content-action-button">Set</button>
                        </div>:
                        <div className="berth-table-content-action-current-vessel">{row.current_vessel}</div>}
                    </div>
                </div>
             ))}
             </div>
        </div>
    </div>
  );
}

export default Berth;
