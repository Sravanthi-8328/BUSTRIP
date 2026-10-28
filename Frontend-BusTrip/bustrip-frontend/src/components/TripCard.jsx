import React from 'react';
import { CalendarDays, ChevronRight, Clock3, Users } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const [day, month, year] = String(value).split('-');
  const date = day && month && year ? new Date(`${year}-${month}-${day}T00:00:00`) : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function TripCard({ trip, onEdit, onDelete }) {
  return (
    <article className="trip-card">
      <div className="trip-card-top">
        <span className={trip.delayed ? 'status delayed' : 'status on-time'}>
          <span className="status-dot" /> {trip.delayed ? 'Delayed' : 'On time'}
        </span>
        <span className="trip-id">#{trip.id}</span>
      </div>
      <div className="route-line">
        <div><strong>{trip.routeName || 'Unnamed route'}</strong><span>Bus route · Trip #{trip.id}</span></div>
        <ChevronRight className="route-arrow" size={20} />
      </div>
      <div className="trip-details">
        <span><CalendarDays size={16} /> {formatDate(trip.travelDate)}</span>
        <span><Users size={16} /> {trip.passengerCount} {trip.passengerCount === 1 ? 'passenger' : 'passengers'}</span>
        <span><Clock3 size={16} /> {trip.delayed ? 'Needs attention' : 'On schedule'}</span>
      </div>
      <div className="trip-card-actions">
        <button className="text-button" onClick={() => onEdit(trip)}>Edit trip</button>
        <button className="delete-button" onClick={() => onDelete(trip)}>Delete</button>
      </div>
    </article>
  );
}
