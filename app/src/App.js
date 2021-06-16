import React from 'react';
import FileUpload from './Components/FileUpload';
import './App.css';
import logo from './shazamLogo.png';

const App = () => (
  <div className="App">
    
    <header className="App-header">
      <img src={logo} className="App-logo mt-5 mb-5" alt="logo" />
      <h1 className="mb-5">Shamalyse</h1>
      <FileUpload />
    </header>
  </div>
);
 
export default App;

