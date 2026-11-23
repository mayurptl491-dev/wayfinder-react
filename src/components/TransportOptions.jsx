import { ICON } from '../utils/icons.js';
import { hrs } from '../utils/cost.js';
import { useTrip } from '../context/TripContext.jsx';

export default function TransportOptions({ modes }) {
  const { money } = useTrip();
  const fastest = modes.slice().sort((a, b) => a.hrs - b.hrs)[0];
  return (
    <div className="modes">
      {modes.map((m, i) => (
        <div className="mode" key={m.id}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[m.id]} /></svg>
          <div>
            <b>{m.label}</b>
            {i === 0 && modes.length > 1 && <span className="tag">Cheapest</span>}
            {m === fastest && modes.length > 1 && <span className="tag alt">Fastest</span>}
            <div className="meta">{m.sub} · about {hrs(m.hrs)}</div>
          </div>
          <div className="price">{money(m.usd[0])}–{money(m.usd[1])}<small>one way</small></div>
        </div>
      ))}
    </div>
  );
}
