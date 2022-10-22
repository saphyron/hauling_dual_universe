import'../src/App.css';
import Contracts from './components/Contracts';
import Front from './components/Front';
import SpecificContract from './components/SpecificContract';
import {Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

function AppRouter() {
    return (
    <div className="AppRouter">
        <Routes>
            <Route path="/Contracts" element={<Contracts />}></Route>
            <Route path="" element={<Front />}></Route>
            <Route path="/" render={()=><Front />}></Route>
            <Route path="/Contracts/Contract/:id" element={<SpecificContract />}></Route>
        </Routes>
    </div>  )
}
export default AppRouter;