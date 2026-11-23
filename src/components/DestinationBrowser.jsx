import { useState, useMemo } from 'react';
import { REGIONS } from '../data/destinations.js';
import { useTrip } from '../context/TripContext.jsx';

export function useFilteredDestinations(rows) {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('All');
  const [sort, setSort] = useState('az');
  const ql = q.trim().toLowerCase();
  const match = (d) =>
    (region === 'All' || d.region === region) && (!ql || (d.name + ' ' + d.country).toLowerCase().includes(ql));
  const list = useMemo(
    () =>
      rows
        .filter(match)
        .sort((a, b) =>
          sort === 'az'
            ? a.name.localeCompare(b.name)
            : sort === 'near'
            ? a.r.dist - b.r.dist
            : (a.cheap ? a.cheap.usd[0] : 1e9) - (b.cheap ? b.cheap.usd[0] : 1e9)
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, q, region, sort]
  );
  return { q, setQ, region, setRegion, sort, setSort, list, match };
}

export default function DestinationBrowser({ filter, hoverId, onHover, onSelect }) {
  const { originCity, money } = useTrip();
  const { q, setQ, region, setRegion, sort, setSort, list } = filter;
  return (
    <div className="panel">
      <div>
        <h2>Where to?</h2>
        <p className="sub">Tap a pin on the map or pick from the list. Prices are from {originCity.name}.</p>
      </div>
      <input
        className="search" id="search" type="search" placeholder="Search a place or country"
        value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search destinations"
      />
      <div className="chips" role="group" aria-label="Region">
        {REGIONS.map((r) => (
          <button key={r} className="chip" aria-pressed={region === r} onClick={() => setRegion(r)}>{r}</button>
        ))}
      </div>
      <div className="chips" role="group" aria-label="Sort">
        <span className="chip plain">Sort</span>
        {[['az', 'A–Z'], ['near', 'Nearest'], ['cheap', 'Cheapest']].map(([id, label]) => (
          <button key={id} className="chip" aria-pressed={sort === id} onClick={() => setSort(id)}>{label}</button>
        ))}
      </div>
      <ul className="list">
        {list.length ? (
          list.map((x) => (
            <li key={x.id}>
              <button
                className={'row' + (hoverId === x.id ? ' hov' : '')}
                onClick={() => onSelect(x.id)}
                onPointerEnter={() => onHover(x.id)}
                onPointerLeave={() => onHover(null)}
              >
                <div><b>{x.name}</b><br /><span>{x.country}</span></div>
                <div className="price">
                  {x.r.local ? 'Nearby' : x.cheap ? money(x.cheap.usd[0]) : '—'}
                  <small>{x.r.local ? 'local travel' : x.cheap ? 'from · ' + x.cheap.label.toLowerCase() : 'no route'}</small>
                </div>
              </button>
            </li>
          ))
        ) : (
          <li className="empty">Nothing matches that search.</li>
        )}
      </ul>
    </div>
  );
}
