import React, { useState } from "react";
import "./Calendar.css";
import DayCell from "./DayCell"; // Import DayCell component
import CalendarHeader from "./CalendarHeader"; // Import CalendarHeader component

interface Event {
  name: string;
  date: string; // Date and time in ISO format
  time: string; // Time in "HH:mm" format
  location?: string;
  guests?: string;
}

// Helper functions for getting days of the week and days in a month
const getDaysOfWeek = () => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getDaysInMonth = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const changeDate = (unit: "month" | "week" | "day", direction: "prev" | "next", currentDate: Date) => {
  const newDate = new Date(currentDate);
  switch (unit) {
    case "month":
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      break;
    case "week":
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      break;
    case "day":
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
      break;
  }
  return newDate;
};

// Individual View Rendering Components (Day, Week, Month Views)
const renderDayView = (currentDate: Date, events: Event[]) => (
  <div className="scrollable-day-view">
    <table className="calendar-table">
      <thead>
        <tr>
          <th colSpan={2} className="day-header">
            {currentDate.toLocaleDateString('en-US', {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })}
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 24 }, (_, hour) => (
          <tr key={hour}>
            <td className="time-labels">
              {new Date(currentDate.setHours(hour, 0, 0, 0)).toLocaleTimeString([], { hour: "numeric", hour12: true })}
            </td>
            <td className="event-column">
              {events.filter(event => new Date(event.date).getDate() === currentDate.getDate() && new Date(event.date).getHours() === hour)
                .map(event => (
                  <div key={event.name} className="event">
                    <p>{event.name}</p>
                    <p>{event.time}</p>
                  </div>
                ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderWeekView = (currentDate: Date, events: Event[]) => (
  <div className="scrollable-week-view">
    <table className="calendar-table">
      <thead>
        <tr>
          <th></th>
          {getDaysOfWeek().map(day => <th key={day}>{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 24 }, (_, hour) => (
          <tr key={hour}>
            <td className="time-labels">
              {new Date(currentDate.setHours(hour, 0, 0, 0)).toLocaleTimeString([], { hour: "numeric", hour12: true })}
            </td>
            {getDaysOfWeek().map((_, index) => (
              <td key={index} className="event-cell">
                {events.filter(event => new Date(event.date).getDay() === index && new Date(event.date).getHours() === hour)
                  .map(event => (
                    <div key={event.name} className="event">
                      <p>{event.name}</p>
                      <p>{event.time}</p>
                    </div>
                  ))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderMonthView = (currentDate: Date, events: Event[]) => {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // First day of the month (0 = Sunday, 6 = Saturday)
  const daysInMonth = getDaysInMonth(currentDate); // Get the number of days in the month
  const daysInMonthCount = daysInMonth.length;

  // Get the number of days in the previous month (to fill the gray days before the 1st of the month)
  const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Get the previous month's last day
  const prevMonthDaysCount = prevMonthDate.getDate(); // Number of days in the previous month

  // Get the number of days in the next month (to fill the gray days after the last day of the month)
  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Get the next month's last day
  const nextMonthDaysCount = nextMonthDate.getDate(); // Number of days in the next month

  const weeks: (number | null)[][] = []; // Holds the weeks, each week is an array of days
  let currentWeek: (number | null)[] = []; // Holds the days for the current week (including null for empty slots)

  // Fill the first week with previous month's days (gray)
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(prevMonthDaysCount - firstDayOfMonth + i + 1); // Add the previous month's days in gray
  }

  // Add the days of the current month
  for (let day = 1; day <= daysInMonthCount; day++) {
    currentWeek.push(day); // Add the current day's number
    if (currentWeek.length === 7) {
      weeks.push(currentWeek); // Push the current week to the weeks array
      currentWeek = []; // Reset the current week for the next week
    }
  }

  // Fill the last week with next month's days (gray)
  const remainingCells = 7 - currentWeek.length;
  if (remainingCells < 7) {
    for (let i = 1; i <= remainingCells; i++) {
      currentWeek.push(i); // Add the next month's days in gray
    }
    weeks.push(currentWeek); // Push the last week (with next month's gray days)
  }

  return (
    <div className="month-view">
      <table className="calendar-table">
        <thead>
          <tr>
            {getDaysOfWeek().map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map((day, dayIndex) => {
                const dayEvents = events.filter(
                  (event) => new Date(event.date).getDate() === day
                );
                return (
                  <td key={dayIndex}>
                    <div className="day-number">{day}</div>
                    {dayEvents.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="event-stripe"
                        style={{
                          position: 'absolute',
                          top: `${new Date(event.date).getHours() * 4}px`, // Adjust vertical position based on time
                          height: '30px',
                          width: '100%',
                          backgroundColor: '#f4f4f4',
                          borderRadius: '5px',
                          padding: '2px',
                        }}
                      >
                        <span>{event.name}</span> at {event.time}
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Calendar Component
const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    guests: ''
  });
  
  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setShowModal(false); // Close modal after adding event
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");

  const changeView = (newView: "day" | "week" | "month") => setView(newView);

  return (
    <div className="calendar">
      <h1>Wes Hu Google Calendar Knockoff</h1>
        <div className="month-navigation">

        {/* Add Event Button */}
        <button onClick={() => setShowModal(true)}>Add Event</button>

        {/* Modal for adding an event */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Event</h3>
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={handleInputChange}
            />
            <input
              type="datetime-local"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newEvent.location}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="guests"
              placeholder="Guests (comma-separated)"
              value={newEvent.guests}
              onChange={handleInputChange}
            />
            <button onClick={handleAddEvent}>Add Event</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
        
        <button className="nav-button" onClick={() => setCurrentDate(changeDate(view, "prev", currentDate))}>&lt;</button>
        <div className="month-name">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <button className="nav-button" onClick={() => setCurrentDate(changeDate(view, "next", currentDate))}>&gt;</button>

        {/* View Buttons */}
        <button className="nav-button" onClick={() => changeView('month')}>Month</button>
        <button className="nav-button" onClick={() => changeView('week')}>Week</button>
        <button className="nav-button" onClick={() => changeView('day')}>Day</button>


      </div>
      

      {view === "month" && renderMonthView(currentDate, events)}
      {view === "week" && renderWeekView(currentDate, events)}
      {view === "day" && renderDayView(currentDate, events)}
    </div>
  );
};

export default Calendar;
