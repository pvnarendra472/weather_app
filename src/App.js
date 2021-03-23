import React from 'react';
import './App.css';
import Search from './Search';


function App() {
    return (
    <div style={{"fontFamily":"Montserrat,Sans-Seriff", "color":'white'}} className="App-Background">
      <header>
        <Search/>
      </header>
    </div>
  );
}

export default App;
