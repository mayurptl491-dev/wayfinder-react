import { useState } from 'react';
import { useTrip } from '../context/TripContext.jsx';

export default function TripBudget({ place, cheapest }) {
  const { money } = useTrip();
  const [days, setDays] = useState(place.days);
  const tl = cheapest.usd[0] * 2, th = cheapest.usd[1] * 2;
  const sl = days * place.daily[0], sh = days * place.daily[1];
  return (
    <section>
      <h3>Rough trip budget</h3>
      <div className="slider">
        <input id="days" type="range" min="1" max="21" value={days} onChange={(e) => setDays(+e.target.value)} aria-label="Trip length in days" />
        <output htmlFor="days">{days} {days === 1 ? 'day' : 'days'}</output>
      </div>
      <div className="total">
        <div className="big">{money(tl + sl)} – {money(th + sh)}</div>
        <div className="kv"><span>{cheapest.label}, round trip</span><span>{money(tl)}–{money(th)}</span></div>
        <div className="kv"><span>Stay, food, local travel</span><span>{money(sl)}–{money(sh)}</span></div>
      </div>
    </section>
  );
}
