import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Discover from './components/Discover';
import AIPlanner from './components/AIPlanner';
import Recommendations from './components/Recommendations';
import Hotels from './components/Hotels';
import BudgetCalculator from './components/BudgetCalculator';
import Checklist from './components/Checklist';
import Weather from './components/Weather';
import TravelJournal from './components/TravelJournal';
import TripSummary from './components/TripSummary';
import Profile from './components/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/aiplanner" element={<AIPlanner />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/budgetcalculator" element={<BudgetCalculator />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/traveljournal" element={<TravelJournal />} />
        <Route path="/summary" element={<TripSummary />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;