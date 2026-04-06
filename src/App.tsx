import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './component/NavBarComponent';
import HomePage from './component/HomePageComponent';
import Categorize from './component/CategorizeComponent';

function App() {
  return (
    <BrowserRouter>
      <div className='app-layout'>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/categorize' element={<Categorize />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
