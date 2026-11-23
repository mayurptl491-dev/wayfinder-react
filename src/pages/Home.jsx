import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/WorldMap.jsx';
import DestinationBrowser, { useFilteredDestinations } from '../components/DestinationBrowser.jsx';
import { D } from '../data/destinations.js';
import { routes } from '../utils/cost.js';
import { useTrip } from '../context/TripContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { originCity } = useTrip();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState(null);

  const rows = useMemo(
    () => D.map((d) => { const r = routes(originCity, d); return { ...d, r, cheap: r.modes[0] || null }; }),
    [originCity]
  );
  const filter = useFilteredDestinations(rows);
  const shown = rows.map((d) => ({ ...d, dim: !filter.match(d) }));

  // Choosing a place opens its page; signed-out visitors are sent to log in first.
  const open = (id) => navigate(`/place/${id}`);

  return (
    <main className="app">
      <div className="mapcol">
        <WorldMap destinations={shown} origin={originCity} selectedId={null} onSelect={open} hoverId={hoverId} onHover={setHoverId} />
      </div>
      <div className="side">
        {!user && <p className="banner">Choose a destination, then log in or sign up to see the full guide and cost.</p>}
        <DestinationBrowser filter={filter} hoverId={hoverId} onHover={setHoverId} onSelect={open} />
      </div>
    </main>
  );
}
