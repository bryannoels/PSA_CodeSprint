import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../App.css';

function Equipment() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [cranesDD, setCranesDD] = useState("");
    const [cranesNumbers, setCranesNumbers] = useState(0);
    const [handlignEquipmentsDD, sethandlignEquipmentsDD] = useState("");
    const [handlingEquipmentsNumber, setHandlingEquipmentsNumber] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/cranesAndHandlingEquipments.csv');
                const csvData = await response.text();
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                Papa.parse(csvData, {
                    header: true, // Treat the first row as headers
                    dynamicTyping: true, // Automatically detect numeric values
                    complete: (result) => {
                      if (Array.isArray(result.data) && result.data.length > 0) {
                        setData(result.data[0]);
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
        fetchData();
        
    },[]);
    console.log(data?data.cranes:null);
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
                    <div className="equipment-cranes-button">Send</div>
                </div>
            </div>
            <div className="equipment-handling-equipments">
                <div className="equipment-handling-equipments-top">
                    <div className="equipment-handling-equipments-top-name">Handling Equipments</div>
                    <div className="equipment-handling-equipments-top-number">{data?data.handling_equipments:null}</div>
                </div>
                <div className="equipment-handling-equipments-middle">
                    Send <textarea className = "equipment-text-area" value={handlingEquipmentsNumber} onChange={(e)=>setHandlingEquipmentsNumber(e.target.value)} /> to 
                    <select className="equipments-dropdown" name="handlignEquipmentsDD" onChange={(e) => sethandlignEquipmentsDD(e.target.value)}>
                    {Array.from({ length: 55 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                        Berth {index + 1}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="equipment-handling-equipments-bottom">
                    <div className="equipment-handling-equipments-button">Send</div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Equipment;
