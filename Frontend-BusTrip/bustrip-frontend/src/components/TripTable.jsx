import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export default function TripTable({ trips, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Trip</th><th>Travel date</th><th>Passengers</th><th>Status</th><th aria-label="Actions" /></tr></thead>
        <tbody>
          {trips.map((trip) => <tr key={trip.id}>
            <td><strong>{trip.routeName}</strong><small>Trip #{trip.id}</small></td>
            <td>{trip.travelDate || '—'}</td>
            <td>{trip.passengerCount}</td>
            <td><span className={trip.delayed ? 'status delayed' : 'status on-time'}><span className="status-dot" />{trip.delayed ? 'Delayed' : 'On time'}</span></td>
            <td className="table-actions"><button onClick={() => onEdit(trip)} aria-label={`Edit ${trip.routeName}`}><Edit3 size={16} /></button><button onClick={() => onDelete(trip)} aria-label={`Delete ${trip.routeName}`}><Trash2 size={16} /></button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
