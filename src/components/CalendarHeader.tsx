import React, { useState } from 'react';
import './CalendarHeader.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Define the type for an event
interface Event {
    name: string;
    date: string;
    time: string;
    guests: string[];
    location?: string;
    meetingLink?: string;
  }

const CalendarHeader: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [events, setEvents] = useState<Event[]>([]); // Store events

    // State for the form inputs
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [guests, setGuests] = useState('');
    const [location, setLocation] = useState('');
    const [meetingLink, setMeetingLink] = useState('');

    const handleAddEventClick = () => {
    setIsModalOpen(true);
    };

    const handleCloseModal = () => {
    setIsModalOpen(false);
    };

    const handleSaveEvent = () => {
    if (eventName && eventDate && eventTime) {
        const newEvent: Event = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        guests: guests.split(',').map((guest) => guest.trim()), // Split guests into an array
        location,
        meetingLink,
        };
        setEvents([...events, newEvent]); // Add event to the list
        setIsModalOpen(false); // Close modal after saving
        clearForm(); // Reset form inputs
    }
    };

    const clearForm = () => {
    setEventName('');
    setEventDate('');
    setEventTime('');
    setGuests('');
    setLocation('');
    setMeetingLink('');
    };
    const [currentDate, setCurrentDate] = useState(new Date());
    
    return (
          <div className="month-navigation">
            {/* Add Event Button */}
            <button className="nav-button" onClick={handleAddEventClick}>Add Event</button>        
            <button className="nav-button" >&lt;</button>
            <div className="month-name">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
            <button className="nav-button" >&gt;</button>
    
            {/* View Buttons */}
            <button className="nav-button" >Month</button>
            <button className="nav-button" >Week</button>
            <button className="nav-button" >Day</button>
    
    
          </div>
    );
  };

export default CalendarHeader;