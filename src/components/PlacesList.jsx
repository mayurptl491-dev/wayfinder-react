export default function PlacesList({ places }) {
  return (
    <section>
      <h3>Popular places</h3>
      <ol className="places">
        {places.map((p, i) => (
          <li key={p[0]}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <div><b>{p[0]}</b><p>{p[1]}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
