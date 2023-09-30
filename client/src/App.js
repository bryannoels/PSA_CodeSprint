import './App.css';
import {useState} from 'react';

function App() {
  const [activeTab, setActiveTab] = useState("Analysis");
  return (
    <div className="App">
      <div className = "header">
        <div className = {activeTab==="Analysis"? "tab-active" : "tab"} onClick={()=>setActiveTab("Analysis")}>Analysis</div>
        <div className = {activeTab==="Berth"? "tab-active" : "tab"} onClick={()=>setActiveTab("Berth")}>Berth</div>
        <div className = {activeTab==="Equipment"? "tab-active" : "tab"} onClick={()=>setActiveTab("Equipment")}>Equipment</div>
      </div>
      <div className = "content">
      </div>
    </div>
  );
}

export default App;
