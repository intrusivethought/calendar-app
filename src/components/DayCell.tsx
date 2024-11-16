import React from 'react';
import './DayCell.css';

interface DayCellProps {
  day: number;
}

const DayCell: React.FC<DayCellProps> = ({ day }) => (
  <div className="day-cell">
    <span className="day-number">{day}</span>
  </div>
);

export default DayCell;