import React from 'react';
import { AlertCircle, ArrowRight, Bus, CalendarDays, CheckCircle2, Clock3, Filter, LoaderCircle, MapPin, Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Logo from './components/Logo';
import TripCard from './components/TripCard';
import TripForm from './components/TripForm';
import TripTable from './components/TripTable';
import * as tripService from './services/busTripService';

function EmptyState({ searching, onReset }) {
  return <div className="empty-state"><div className="empty-icon"><Bus size={26} /></div><h3>{searching ? 'No trips found' : 'Your trip list is empty'}</h3><p>{searching ? 'Try another route name or view all trips.' : 'Add your first trip to start managing your journeys.'}</p>{searching && <button className="text-button" onClick={onReset}>Show all trips →</button>}</div>;
}

function formatShortDate(value) {
  if (!value) return 'Date unavailable';
  const [day, month, year] = String(value).split('-');
  const date = day && month && year ? new Date(`${year}-${month}-${day}T00:00:00`) : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

function App() {
  const [trips, setTrips] = useState([]);
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formTrip, setFormTrip] = useState(undefined);
  const [saving, setSaving] = useState(false);

  const loadTrips = useCallback(async (loader = tripService.getAllTrips) => {
    setLoading(true); setError('');
    try { setTrips(await loader()); } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTrips(); }, [loadTrips]);
  useEffect(() => { if (!notice) return undefined; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer); }, [notice]);

  const filteredTrips = useMemo(() => trips.filter((trip) => {
    const matchesDate = !travelDate || trip.travelDate === travelDate || trip.travelDate === travelDate.split('-').reverse().join('-');
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'delayed' ? trip.delayed : !trip.delayed);
    return matchesDate && matchesStatus;
  }).sort((a, b) => sortBy === 'route' ? a.routeName.localeCompare(b.routeName) : String(a.travelDate).localeCompare(String(b.travelDate))), [trips, travelDate, statusFilter, sortBy]);
  const delayedCount = trips.filter((trip) => trip.delayed).length;
  const totalPassengers = trips.reduce((sum, trip) => sum + trip.passengerCount, 0);
  const onTimeRate = trips.length ? Math.round(((trips.length - delayedCount) / trips.length) * 100) : 0;
  const routes = [...new Set(trips.map((trip) => trip.routeName).filter(Boolean))].slice(0, 4);
  const recentTrips = [...trips].sort((a, b) => String(b.travelDate).localeCompare(String(a.travelDate))).slice(0, 4);

  const showAll = () => { setActiveFilter('all'); setQuery(''); setTravelDate(''); loadTrips(); };
  const showDelayed = () => { setActiveFilter('delayed'); setQuery(''); setTravelDate(''); loadTrips(tripService.getDelayedTrips); };
  const search = async (event) => {
    event?.preventDefault();
    if (!query.trim()) return showAll();
    setActiveFilter('search');
    await loadTrips(() => tripService.searchTrips(query.trim()));
  };
  const chooseRoute = (route) => {
    setQuery(route);
    setActiveFilter('search');
    loadTrips(() => tripService.searchTrips(route));
  };
  const dateOptions = [...new Set(trips.map((trip) => trip.travelDate).filter(Boolean))].sort();
  const navigate = (section) => {
    setView(section);
    const target = section === 'manage' ? 'manage' : section === 'search' ? 'search' : 'home';
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  const saveTrip = async (data) => {
    setSaving(true); setError('');
    try { if (formTrip) await tripService.updateTrip(formTrip.id, data); else await tripService.addTrip(data); setFormTrip(undefined); setNotice(formTrip ? 'Trip updated successfully.' : 'Trip added successfully.'); await loadTrips(); }
    catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const deleteTrip = async (trip) => {
    if (!window.confirm(`Delete the trip “${trip.routeName}”?`)) return;
    setError('');
    try { await tripService.deleteTrip(trip.id); setNotice('Trip deleted successfully.'); await loadTrips(); } catch (err) { setError(err.message); }
  };

  return <>
    <Header activeSection={view} onNavigate={navigate} />
    <main>
      <section className="hero" id="home">
        <div className="hero-shape shape-one" /><div className="hero-shape shape-two" />
        <div className="container hero-content">
          <div className="hero-copy"><span className="eyebrow light"><Sparkles size={14} /> Your journey, simplified</span><h1>Every journey<br /><em>starts here.</em></h1><p>Plan, track, and manage your bus trips in one calm, simple space.</p><button className="button white" onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}>Find a trip <ArrowRight size={17} /></button></div>
          <div className="hero-illustration"><div className="sun" /><div className="road" /><div className="bus-illustration"><div className="bus-window"><i /><i /><i /></div><div className="bus-body" /><div className="wheel wheel-one" /><div className="wheel wheel-two" /></div></div>
        </div>
      </section>
      <section className="overview-section">
        <div className="container">
          <div className="overview-heading"><div><span className="eyebrow"><TrendingUp size={14} /> Live operations overview</span><h2>Good morning, trip manager</h2></div><span className="live-pill"><i /> Live data</span></div>
          <div className="metric-grid">
            <div className="metric-card"><span className="metric-icon blue"><Bus size={19} /></span><div><strong>{trips.length}</strong><span>Scheduled trips</span></div><small>Across all routes</small></div>
            <div className="metric-card"><span className="metric-icon violet"><Users size={19} /></span><div><strong>{totalPassengers}</strong><span>Passengers</span></div><small>Planned travellers</small></div>
            <div className="metric-card"><span className="metric-icon green"><Clock3 size={19} /></span><div><strong>{onTimeRate}%</strong><span>On-time rate</span></div><small>Current performance</small></div>
            <div className="metric-card"><span className="metric-icon orange"><AlertCircle size={19} /></span><div><strong>{delayedCount}</strong><span>Need attention</span></div><small>Delayed journeys</small></div>
          </div>
        </div>
      </section>
      <section className="search-panel-section" id="search">
        <div className="container">
          <form className="search-panel" onSubmit={search}><div className="search-field"><span className="search-icon"><Search size={20} /></span><div><label htmlFor="route-search">FROM / TO</label><input id="route-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any route" /></div></div><div className="date-field"><CalendarDays size={18} /><label htmlFor="travel-date">TRAVEL DATE</label><input id="travel-date" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} /></div><button className="button primary" type="submit">SEARCH <ArrowRight size={16} /></button></form>
          <div className="date-strip"><span className="date-strip-label">Available dates</span><button className={!travelDate ? 'date-chip active' : 'date-chip'} onClick={() => setTravelDate('')}>All</button>{dateOptions.map((date) => <button key={date} className={travelDate === date || travelDate === date.split('-').reverse().join('-') ? 'date-chip active' : 'date-chip'} onClick={() => setTravelDate(date)}>{formatShortDate(date)}</button>)}</div>
          <div className="filter-row"><span>Quick access <strong>{routes.length ? 'Popular routes' : 'Waiting for routes'}</strong></span><div className="route-chips">{routes.map((route) => <button key={route} className="route-chip" onClick={() => chooseRoute(route)}><MapPin size={13} />{route}</button>)}<button className={activeFilter === 'all' ? 'filter active' : 'filter'} onClick={showAll}>All trips <b>{trips.length}</b></button><button className={activeFilter === 'delayed' ? 'filter active' : 'filter'} onClick={showDelayed}>Delayed <b>{delayedCount}</b></button></div></div>
        </div>
      </section>
      <section className="trips-section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Your journeys</span><h2>{activeFilter === 'delayed' ? 'Trips needing attention' : activeFilter === 'search' ? 'Search results' : 'All your trips'}</h2><p className="result-count">{filteredTrips.length} trips found</p></div><div className="result-tools"><label><Filter size={14} /> Status<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All</option><option value="on-time">On time</option><option value="delayed">Delayed</option></select></label><label>Sort<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="date">Travel date</option><option value="route">Route name</option></select></label><button className="button outline" onClick={() => setFormTrip(null)}>+ Add trip</button></div></div>
          {error && <div className="alert error"><AlertCircle size={18} /><span>{error}<small>Check that the Spring Boot API is running at the configured URL.</small></span><button onClick={() => loadTrips()}>Try again</button></div>}
          {notice && <div className="alert success"><CheckCircle2 size={18} />{notice}</div>}
          {loading ? <div className="loading"><LoaderCircle className="spin" size={28} /><span>Loading your trips…</span></div> : filteredTrips.length ? <div className="trip-grid">{filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} onEdit={setFormTrip} onDelete={deleteTrip} />)}</div> : <EmptyState searching={Boolean(query) || Boolean(travelDate) || activeFilter === 'delayed' || activeFilter === 'search'} onReset={showAll} />}
        </div>
      </section>
      <section className="activity-section">
        <div className="container activity-layout"><div><span className="eyebrow">Operational pulse</span><h2>Recent activity</h2><p className="section-lead">A quick look at the latest journeys in your network.</p><div className="activity-list">{recentTrips.length ? recentTrips.map((trip) => <div className="activity-item" key={`activity-${trip.id}`}><span className={`activity-icon ${trip.delayed ? 'warning' : 'success'}`}>{trip.delayed ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}</span><div><strong>{trip.routeName}</strong><span>{trip.delayed ? 'Flagged for attention' : 'Ready for departure'} · {formatShortDate(trip.travelDate)}</span></div><b>{trip.passengerCount} pax</b></div>) : <EmptyState onReset={showAll} />}</div></div><aside className="insight-card"><span className="metric-icon blue"><Sparkles size={18} /></span><span className="eyebrow">Manager insight</span><h3>Keep every route moving</h3><p>Use the live filters above to spot delayed journeys and keep your daily schedule organized.</p><button className="button outline" onClick={() => setFormTrip(null)}>Add a trip <ArrowRight size={15} /></button></aside></div>
      </section>
      <section className="manage-section" id="manage"><div className="container"><div className="manage-heading"><div><span className="eyebrow">Trip control center</span><h2>Manage trips</h2><p>Keep every journey organized and up to date.</p></div><div className="stat"><strong>{trips.length}</strong><span>Total trips</span></div><div className="stat warning"><strong>{delayedCount}</strong><span>Delayed</span></div></div>{loading ? <div className="loading"><LoaderCircle className="spin" size={28} /><span>Loading table…</span></div> : trips.length ? <TripTable trips={trips} onEdit={setFormTrip} onDelete={deleteTrip} /> : <EmptyState onReset={showAll} />}</div></section>
    </main>
    <footer><div className="container"><div><Logo /><p>Making bus travel feel a little easier.</p></div><span>© {new Date().getFullYear()} BusTrip</span></div></footer>
    {formTrip !== undefined && <TripForm trip={formTrip} onClose={() => setFormTrip(undefined)} onSubmit={saveTrip} saving={saving} />}
  </>;
}

export default App;
