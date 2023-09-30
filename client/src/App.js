import './App.css';
import {useState} from 'react';
import Analytics from './pages/analytics.js';
import Berth from './pages/berth.js';

function App() {
  const [activeTab, setActiveTab] = useState("Analytics");
  return (
    <div className="App">
      <div className = "header">
        <div className = {activeTab==="Analytics"? "tab-active" : "tab"} onClick={()=>setActiveTab("Analytics")}>Analytics</div>
        <div className = {activeTab==="Berth"? "tab-active" : "tab"} onClick={()=>setActiveTab("Berth")}>Berth</div>
        <div className = {activeTab==="Equipment"? "tab-active" : "tab"} onClick={()=>setActiveTab("Equipment")}>Equipment</div>
      </div>
      <div className = "content">
        {activeTab === "Analytics" ? <Analytics/> : null }
        {activeTab === "Berth" ? <Berth/> : null }
      </div>
    </div>
  );
}

export default App;
