// src/App.tsx
import React from 'react';
import './App.css';
import Calendar from './components/Calendar';
import CalendarHeader from './components/CalendarHeader';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Wes Hu Google Calendar Knockoff</h1>
      <Calendar />
    </div>
  );
}

export default App;
