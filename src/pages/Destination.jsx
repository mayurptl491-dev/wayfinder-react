import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import WorldMap from '../components/WorldMap.jsx';
import DestinationDetail from '../components/DestinationDetail.jsx';
import { D, DEST } from '../data/destinations.js';
import { routes } from '../utils/cost.js';
import { useTrip } from '../context/TripContext.jsx';

export default function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { originCity } = useTrip();
  const [hoverId, setHoverId] = useState(null);
  const place = DEST[id];
  const route = useMemo(() => (place ? routes(originCity, place) : null), [originCity, place]);
  const pins = useMemo(() => D.map((d) => ({ ...d, dim: false })), []);

  if (!place) return <Navigate to="/" replace />;

  return (
    <main className="app">
      <div className="mapcol">
        <WorldMap
          destinations={pins} origin={originCity} selectedId={id}
          onSelect={(next) => navigate(`/place/${next}`)} hoverId={hoverId} onHover={setHoverId}
        />
      </div>
      <DestinationDetail place={place} route={route} onBack={() => navigate('/')} />
    </main>
  );
}
