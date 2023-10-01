import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../App.css';

function Berth() {
    const [loading, setLoading] = useState(true);
    const [berthData, setBerthData] = useState([]);
    const [vesselData, setVesselData] = useState([]);
    const [vesselDD, setVesselDD] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch berthAvailability data
                const berthResponse = await fetch('http://localhost:8000/berthAvailability'); // Update the URL
                if (!berthResponse.ok) {
                    throw new Error(`Failed to fetch berthAvailability: ${berthResponse.status} ${berthResponse.statusText}`);
                }

                // Parse berthAvailability JSON data
                const berthJsonData = await berthResponse.json();
                if (Array.isArray(berthJsonData) && berthJsonData.length > 0) {
                    setBerthData(berthJsonData);
                    setLoading(false);
                } else {
                    console.error('No data found in berthAvailability JSON response.');
                }

                // Fetch upcomingVessels data
                const vesselResponse = await fetch('http://localhost:8000/upcomingVessels'); // Update the URL
                if (!vesselResponse.ok) {
                    throw new Error(`Failed to fetch upcomingVessels: ${vesselResponse.status} ${vesselResponse.statusText}`);
                }

                // Parse upcomingVessels JSON data
                const vesselJsonData = await vesselResponse.json();
                if (Array.isArray(vesselJsonData) && vesselJsonData.length > 0) {
                    setVesselData(vesselJsonData);
                } else {
                    console.error('No data found in upcomingVessels JSON response.');
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);
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
