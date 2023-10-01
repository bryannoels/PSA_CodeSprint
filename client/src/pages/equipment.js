import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../App.css';

function Equipment() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [cranesDD, setCranesDD] = useState(1);
    const [cranesNumbers, setCranesNumbers] = useState(0);
    const [handlingEquipmentsDD, setHandlingEquipmentsDD] = useState(1);
    const [handlingEquipmentsNumber, setHandlingEquipmentsNumber] = useState(0);
    const fetchData = async () => {
        try {
            // Fetch equipment data
            const response = await fetch('http://localhost:8000/cranesAndHandlingEquipments'); // Update the URL
            if (!response.ok) {
                throw new Error(`Failed to fetch equipment data: ${response.status} ${response.statusText}`);
            }

            // Parse equipment JSON data
            const jsonData = await response.json();
            if (jsonData) {
                setData(jsonData[0]);
                setLoading(false);
            } else {
                console.error('No data found in equipment JSON response.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sendCranes = async () => {
        try {
            // Get the values of cranesNumbers and cranesDD from state
            const number = cranesNumbers;
            const berth = cranesDD;

            // Create a PUT request to send the cranes data
            const response = await fetch(`http://localhost:8000/sendCranes?number=${number}&berth=${berth}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error(`Failed to send cranes data: ${response.status} ${response.statusText}`);
            }

            // Refetch the data after sending cranes
            fetchData();

            // Handle the response as needed
            // You can update the state or show a success message here
            setCranesDD(1);
            setCranesNumbers(0);

            // For now, let's log a success message
            console.log('Cranes data sent successfully.');
        } catch (err) {
            console.error(err);
        }
    };

    const sendHandlingEquipments = async () => {
        try {
            // Get the values of handlingEquipmentsNumber and handlingEquipmentsDD from state
            const number = handlingEquipmentsNumber;
            const berth = handlingEquipmentsDD;

            // Create a PUT request to send the handling equipments data
            const response = await fetch(`http://localhost:8000/sendHandlingEquipments?number=${number}&berth=${berth}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error(`Failed to send handling equipments data: ${response.status} ${response.statusText}`);
            }

            // Refetch the data after sending handling equipments
            fetchData();

            // Handle the response as needed
            // You can update the state or show a success message here
            setHandlingEquipmentsDD(1);
            setHandlingEquipmentsNumber(0);

            // For now, let's log a success message
            console.log('Handling equipments data sent successfully.');
        } catch (err) {
            console.error(err);
        }
    };
    
  return (
    <div className="equipment">
        <div className="equipment-content">
            <div className="equipment-cranes">
                <div className="equipment-cranes-top">
                    <div className="equipment-cranes-top-name">Cranes</div>
                    <div className="equipment-cranes-top-number">{data?data.cranes:null}</div>
                </div>
                <div className="equipment-cranes-middle">
                    Send <textarea className = "equipment-text-area" value={cranesNumbers} onChange={(e)=>setCranesNumbers(e.target.value)} /> to 
                    <select className="equipments-dropdown" name="analyticsDD" onChange={(e) => setCranesDD(e.target.value)}>
                    {Array.from({ length: 55 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                        Berth {index + 1}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="equipment-cranes-bottom">
                    <div className="equipment-cranes-button" onClick={sendCranes}>Send</div>
                </div>
            </div>
            <div className="equipment-handling-equipments">
                <div className="equipment-handling-equipments-top">
                    <div className="equipment-handling-equipments-top-name">Handling Equipments</div>
                    <div className="equipment-handling-equipments-top-number">{data?data.handling_equipments:null}</div>
                </div>
                <div className="equipment-handling-equipments-middle">
                    Send <textarea className = "equipment-text-area" value={handlingEquipmentsNumber} onChange={(e)=>setHandlingEquipmentsNumber(e.target.value)} /> to 
                    <select className="equipments-dropdown" name="handlignEquipmentsDD" onChange={(e) => setHandlingEquipmentsDD(e.target.value)}>
                    {Array.from({ length: 55 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                        Berth {index + 1}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="equipment-handling-equipments-bottom">
                    <div className="equipment-handling-equipments-button" onClick={sendHandlingEquipments}>Send</div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Equipment;
