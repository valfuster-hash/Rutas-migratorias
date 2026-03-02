// ---------- Story logic (Leaflet + Scrollama) ----------
(function(){
  // Map init
  const map = L.map('map', {
    center: [27, -15],
    zoom: 4,
    zoomControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Base routes (muted)
  const colorByRisk = (val) => {
    if (!val) return '#9ca3af';
    const v = String(val).toLowerCase();
    if (v.includes('extrema')) return '#8b0000';
    if (v.includes('muy alta')) return '#e34a33';
    if (v.includes('alta')) return '#fdbb84';
    return '#9ca3af';
  };

  const baseRoutes = L.geoJSON(RUTAS_GEOJSON, {
    style: f => ({ color: colorByRisk(f.properties?.peligrosidad), weight: 3, opacity: 0.35 })
  }).addTo(map);

  // Highlight layer for active chapter
  const highlightLayer = L.geoJSON(null, { style: { color: '#f43f5e', weight: 6, opacity: 0.95 } }).addTo(map);

  function getFeatureByCodigo(codigo){
    return RUTAS_GEOJSON.features.find(f => f.properties && f.properties.codigo === codigo);
  }

  function fitFeature(feat){
    try{
      const layer = L.geoJSON(feat);
      const b = layer.getBounds();
      map.flyToBounds(b, { padding: [48,48], duration: 1.6 });
    }catch(e){
      // fallback center/zoom from config if provided
    }
  }

  function activateChapter(chapter){
    const feat = getFeatureByCodigo(chapter.codigo);
    if (!feat) return;
    highlightLayer.clearLayers();
    highlightLayer.addData(feat);
    highlightLayer.bringToFront();
    fitFeature(feat);
  }

  // ---------- Build steps from config ----------
  const stepsContainer = document.getElementById('steps');

  (config.chapters || []).forEach((ch, idx) => {
    const feat = getFeatureByCodigo(ch.codigo) || { properties:{} };
    const p = feat.properties || {};

    const section = document.createElement('section');
    section.className = 'step';
    section.dataset.index = idx;

    const h2 = document.createElement('h2');
    h2.textContent = ch.title || p.nombre || ch.codigo;

    const meta = document.createElement('div');
    meta.className = 'meta';
    const pieces = [];
    if (p.peligrosidad) pieces.push(`Peligrosidad: ${p.peligrosidad}`);
    if (typeof p.distancia_km_aprox !== 'undefined') pieces.push(`${p.distancia_km_aprox} km aprox.`);
    if (p.frecuencia_anual_aprox) pieces.push(`Frecuencia: ${p.frecuencia_anual_aprox}`);
    meta.textContent = pieces.join(' · ');

    const img = document.createElement('img');
    const src = (ch.image && (ch.image.src || ch.image)) || '';
    if (src){ img.src = src; img.alt = (ch.image && ch.image.alt) || h2.textContent; }

    const para = document.createElement('p');
    para.textContent = ch.text || p.descripcion || '';

    // sources if available
    if (Array.isArray(p.fuentes) && p.fuentes.length){
      const sources = document.createElement('p');
      sources.className = 'meta';
      sources.textContent = `Fuentes: ${p.fuentes.join(', ')}`;
      section.appendChild(sources);
    }

    section.appendChild(h2);
    section.appendChild(meta);
    if (src) section.appendChild(img);
    section.appendChild(para);

    stepsContainer.appendChild(section);
  });

  // ---------- Scrollama setup ----------
  const scroller = scrollama();

  function handleStepEnter(resp){
    const el = resp.element; // section
    document.querySelectorAll('.step.active').forEach(s => s.classList.remove('active'));
    el.classList.add('active');

    const idx = Number(el.dataset.index || 0);
    const chapter = config.chapters[idx];
    activateChapter(chapter);
  }

  function initScroll(){
    scroller
      .setup({ step: '.step', offset: 0.66, debug: false })
      .onStepEnter(handleStepEnter);

    window.addEventListener('resize', scroller.resize);

    // Activate first chapter
    const first = document.querySelector('.step');
    if (first){ first.classList.add('active'); handleStepEnter({ element:first }); }
  }

  initScroll();

  // Optional: legend for risk colors
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function(){
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
      <div><strong>Peligrosidad (base)</strong></div>
      <div class="row"><span class="sw" style="background:#8b0000"></span>Extrema</div>
      <div class="row"><span class="sw" style="background:#e34a33"></span>Muy alta</div>
      <div class="row"><span class="sw" style="background:#fdbb84"></span>Alta</div>
    `;
    return div;
  };
  legend.addTo(map);
})();
