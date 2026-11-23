import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { W, H, px, py, LAND_D, WATER_D, GRAT_D } from '../data/geo.js';
import { DEST } from '../data/destinations.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clampView = (v) => ({ k: clamp(v.k, 1, 14), cx: clamp(v.cx, 0, W), cy: clamp(v.cy, 0, H) });

const Base = memo(function Base() {
  return (
    <g>
      <rect className="ocean" x="-2000" y="-2000" width="5000" height="5000" />
      <path className="grat" d={GRAT_D} />
      <path className="land" d={LAND_D} />
      <path className="water" d={WATER_D} />
    </g>
  );
});

/**
 * Pannable, zoomable world map.
 * props: destinations [{id,name,lat,lon,dim}], origin {name,lat,lon}, selectedId, onSelect(id)
 */
export default function WorldMap({ destinations, origin, selectedId, onSelect, hoverId, onHover }) {
  const frame = useRef(null);
  const svgRef = useRef(null);
  const [view, setViewState] = useState({ k: 1, cx: W / 2, cy: H / 2 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const viewRef = useRef(view);
  const sizeRef = useRef(size);
  const anim = useRef(0);
  const moved = useRef(false);

  const setView = useCallback((n) => {
    const c = clampView(n);
    viewRef.current = c;
    setViewState(c);
  }, []);
  useEffect(() => { sizeRef.current = size; }, [size]);

  const cancelFly = useCallback(() => cancelAnimationFrame(anim.current), []);
  const fly = useCallback((target) => {
    cancelAnimationFrame(anim.current);
    const t = clampView(target);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setView(t); return; }
    const s = viewRef.current;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 650);
      const e = 1 - Math.pow(1 - p, 3);
      setView({ cx: s.cx + (t.cx - s.cx) * e, cy: s.cy + (t.cy - s.cy) * e, k: s.k * Math.pow(t.k / s.k, e) });
      if (p < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, [setView]);

  useEffect(() => {
    const el = frame.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(anim.current); };
  }, []);

  const zoomBy = useCallback((f, fx = 0.5, fy = 0.5) => {
    cancelFly();
    const c = viewRef.current;
    const sz = sizeRef.current;
    const k = clamp(c.k * f, 1, 14);
    const vw = W / c.k, vh = (vw * sz.h) / sz.w;
    const nvw = W / k, nvh = (nvw * sz.h) / sz.w;
    const wx = c.cx - vw / 2 + fx * vw;
    const wy = c.cy - vh / 2 + fy * vh;
    setView({ k, cx: wx - (fx - 0.5) * nvw, cy: wy - (fy - 0.5) * nvh });
  }, [setView, cancelFly]);

  useEffect(() => {
    const el = frame.current;
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomBy(e.deltaY < 0 ? 1.3 : 1 / 1.3, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  // Fly to the route (or back to the world) when the selection or origin changes.
  useEffect(() => {
    if (!size.w) return;
    if (!selectedId) { fly({ cx: W / 2, cy: H / 2, k: 1 }); return; }
    const d = DEST[selectedId];
    const x1 = px(origin.lon), y1 = py(origin.lat), x2 = px(d.lon), y2 = py(d.lat);
    const bw = Math.max(Math.abs(x1 - x2), 20), bh = Math.max(Math.abs(y1 - y2), 12);
    const k = Math.min(W / (bw * 1.8), (W * size.h) / (size.w * bh * 2.2));
    fly({ cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, k: clamp(k, 1, 9) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, origin.lat, origin.lon, size.w > 0]);

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelFly();
    const v = viewRef.current;
    const s = { x: e.clientX, y: e.clientY, cx: v.cx, cy: v.cy, k: v.k, m: false };
    const move = (ev) => {
      const dx = ev.clientX - s.x, dy = ev.clientY - s.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) s.m = true;
      if (!s.m) return;
      const u = W / s.k / sizeRef.current.w;
      setView({ k: s.k, cx: s.cx - dx * u, cy: s.cy - dy * u });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      moved.current = s.m;
      setTimeout(() => { moved.current = false; }, 0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };
  const pick = (id) => { if (!moved.current) onSelect(id); };

  const vw = W / view.k;
  const vh = size.w ? (vw * size.h) / size.w : vw * 0.75;
  const u = vw / (size.w || 800);
  const viewBox = `${view.cx - vw / 2} ${view.cy - vh / 2} ${vw} ${vh}`;
  const ox = px(origin.lon), oy = py(origin.lat);
  let route = null;
  if (selectedId) {
    const d = DEST[selectedId];
    const dx = px(d.lon), dy = py(d.lat);
    const len = Math.hypot(dx - ox, dy - oy);
    route = `M${ox},${oy}Q${(ox + dx) / 2},${(oy + dy) / 2 - len * 0.22} ${dx},${dy}`;
  }
  const ordered = [...destinations].sort((a, b) => (a.id === selectedId) - (b.id === selectedId));
  const showAll = view.k >= 2.4;

  return (
    <div className="frame" ref={frame}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        onPointerDown={onPointerDown}
        style={{ touchAction: view.k > 1.05 ? 'none' : 'pan-y' }}
        role="group"
        aria-label="World map of destinations"
      >
        <Base />
        {route && <path className="route" d={route} />}
        {ordered.map((d) => {
          const x = px(d.lon), y = py(d.lat);
          const on = d.id === selectedId, h = d.id === hoverId;
          return (
            <g
              key={d.id}
              role="button"
              tabIndex={0}
              aria-label={`${d.name}, ${d.country}`}
              onClick={() => pick(d.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(d.id); } }}
              onPointerEnter={() => onHover?.(d.id)}
              onPointerLeave={() => onHover?.(null)}
            >
              {on && <circle className="halo" cx={x} cy={y} r={15 * u} />}
              <circle cx={x} cy={y} r={14 * u} fill="transparent" />
              <circle className={'pin' + (on ? ' sel' : '') + (d.dim ? ' dim' : '')} cx={x} cy={y} r={(on || h ? 7 : 5) * u} />
              {(on || h || (showAll && !d.dim)) && (
                <text className="lbl" x={x + 10 * u} y={y + 4 * u} fontSize={12 * u} strokeWidth={3.5 * u}>{d.name}</text>
              )}
            </g>
          );
        })}
        <g>
          <rect className="origin" x={ox - 5 * u} y={oy - 5 * u} width={10 * u} height={10 * u} transform={`rotate(45 ${ox} ${oy})`} />
          <text className="lbl you" x={ox + 10 * u} y={oy + 4 * u} fontSize={11 * u} strokeWidth={3.5 * u}>{'You · ' + origin.name}</text>
        </g>
      </svg>
      <div className="zoom">
        <button aria-label="Zoom in" onClick={() => zoomBy(1.6)}>+</button>
        <button aria-label="Zoom out" onClick={() => zoomBy(1 / 1.6)}>−</button>
      </div>
      <div className="hint">Drag to pan · Ctrl + scroll to zoom</div>
    </div>
  );
}
