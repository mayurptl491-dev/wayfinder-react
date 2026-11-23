import { useTrip } from '../context/TripContext.jsx';
import TransportOptions from './TransportOptions.jsx';
import TripBudget from './TripBudget.jsx';
import PlacesList from './PlacesList.jsx';

export default function DestinationDetail({ place, route, onBack }) {
  const { originCity, money } = useTrip();
  const cheapest = route.modes[0];
  return (
    <div className="panel">
      <button className="back" onClick={onBack}>← All destinations</button>
      <div>
        <h2>{place.name}</h2>
        <p className="sub">{place.country} · {Math.round(route.dist).toLocaleString('en-IN')} km from {originCity.name}</p>
      </div>
      <div className="chips">
        <span className="chip">Best time: {place.best}</span>
        <span className="chip">Suggested: {place.days} days</span>
        <span className="chip">Daily budget {money(place.daily[0])}–{money(place.daily[1])}</span>
      </div>
      <section>
        <h3>Getting there from {originCity.name}</h3>
        {route.local ? (
          <p className="how">You are already within about 80 km, so local transport is all you need.</p>
        ) : route.modes.length === 0 ? (
          <p className="how">No direct option fits this pair in the estimator. Look for a flight with a connection.</p>
        ) : (
          <TransportOptions modes={route.modes} />
        )}
        <p className="how spaced">{place.how}</p>
      </section>
      {!route.local && cheapest && <TripBudget key={place.id + originCity.id} place={place} cheapest={cheapest} />}
      <PlacesList places={place.places} />
      <p className="note">
        Estimates are based on distance and typical fares, per person, and are not live prices. Fares change with
        season and booking date, so confirm before paying. Check visa and entry rules for your passport.
      </p>
    </div>
  );
}
