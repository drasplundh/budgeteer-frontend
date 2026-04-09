import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './component/NavBarComponent';
import HomePage from './component/HomePageComponent';
import Categorize from './component/CategorizeComponent';
import ManualEntry from './component/ManualEntryComponent';

function App() {
  return (
    <BrowserRouter>
      <div className='app-layout'>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/categorize' element={<Categorize />} />
          <Route path='/manual-entry' element={<ManualEntry />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
