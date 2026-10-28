import React from 'react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const blankTrip = { routeName: '', travelDate: '', passengerCount: 1, delayed: false };

function toInputDate(value) {
  if (!value) return '';
  const [day, month, year] = String(value).split('-');
  return day && month && year ? `${year}-${month}-${day}` : value;
}

function toApiDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  return year && month && day ? `${day}-${month}-${year}` : value;
}

export default function TripForm({ trip, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(trip ? { ...trip, travelDate: toInputDate(trip.travelDate) } : blankTrip);
  const [error, setError] = useState('');
  const editing = Boolean(trip);

  useEffect(() => setForm(trip ? { ...trip, travelDate: toInputDate(trip.travelDate) } : blankTrip), [trip]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.routeName.trim() || !form.travelDate || Number(form.passengerCount) < 1) {
      setError('Please complete the route, date, and passenger count.');
      return;
    }
    setError('');
    await onSubmit({ ...form, routeName: form.routeName.trim(), travelDate: toApiDate(form.travelDate), passengerCount: Number(form.passengerCount), delayed: Boolean(form.delayed) });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="trip-form-title">
        <div className="modal-header">
          <div><span className="eyebrow">Trip details</span><h2 id="trip-form-title">{editing ? 'Edit trip' : 'Add a new trip'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="trip-form">
          <label>Route name<input value={form.routeName} onChange={(e) => update('routeName', e.target.value)} placeholder="e.g. Hyderabad → Bengaluru" autoFocus /></label>
          <div className="form-grid">
            <label>Travel date<input type="date" value={form.travelDate} onChange={(e) => update('travelDate', e.target.value)} /></label>
            <label>Passengers<input type="number" min="1" value={form.passengerCount} onChange={(e) => update('passengerCount', e.target.value)} /></label>
          </div>
          <label className="checkbox-label"><input type="checkbox" checked={Boolean(form.delayed)} onChange={(e) => update('delayed', e.target.checked)} /> Mark this trip as delayed</label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="submit" className="button primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add trip'}</button></div>
        </form>
      </section>
    </div>
  );
}
