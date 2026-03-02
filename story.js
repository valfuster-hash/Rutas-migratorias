// ---------- STORYMAP FULLSCREEN with DRAW LINE (snake) + FLECHAS + PUNTOS + BOTONERA ----------
(function(){
  // ---------- MAP BASELAYERS: Physical (default) + Dark
  const map = L.map('map', { center:[27,-15], zoom:4, zoomControl:true });

  const physical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri — Source: Esri, USGS, NOAA, Natural Earth'
  }).addTo(map);

  const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap · © CARTO'
  });

  L.control.layers({ 'Físico (Esri)': physical, 'Oscuro (CARTO)': dark }, null, { position:'topleft' }).addTo(map);

  // ---------- BASE ROUTES with ANIMATED OPACITY (0.3s)
  let baseOpacity = 0.35;

  const colorByRisk = val => {
    if (!val) return '#9ca3af';
    const v = String(val).toLowerCase();
    if (v.includes('extrema')) return '#8b0000';
    if (v.includes('muy alta')) return '#e34a33';
    if (v.includes('alta')) return '#fdbb84';
    return '#9ca3af';
  };

  const baseRoutes = L.geoJSON(RUTAS_GEOJSON, {
    style: f => ({ color: colorByRisk(f.properties.peligrosidad), weight:3, opacity:baseOpacity })
  }).addTo(map);

  function animateFadeBase(to, duration=300){
    const from = baseOpacity; const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start)/duration);
      const val = from + (to - from)*t;
      baseRoutes.setStyle({ opacity: val });
      if (t < 1) requestAnimationFrame(frame); else baseOpacity = to;
    }
    requestAnimationFrame(frame);
  }

  // ---------- HIGHLIGHT + FLECHAS + SNAKE + PUNTOS
  const highlightLayer = L.geoJSON(null, { style:{ color:'#f43f5e', weight:6, opacity:0.95 } }).addTo(map);
  let arrowLayer = null;
  let snakeLine = null;
  let pointsLayer = L.layerGroup().addTo(map);

  function lngLatToLatLngs(coords){ return coords.map(([lng,lat]) => [lat,lng]); }

  function setArrowsOnLatLngs(latlngs){
    if (arrowLayer) { map.removeLayer(arrowLayer); arrowLayer = null; }
    const poly = L.polyline(latlngs);
    arrowLayer = L.polylineDecorator(poly, {
      patterns:[{
        offset:'5%', repeat:'10%',
        symbol: L.Symbol.arrowHead({ pixelSize:10, polygon:false, pathOptions:{ color:'#f43f5e', weight:2 } })
      }]
    }).addTo(map);
  }

  function setPointsOnLatLngs(latlngs, props){
    pointsLayer.clearLayers();
    latlngs.forEach((ll, idx) => {
      const mk = L.circleMarker(ll, {
        radius: 4, color:'#f43f5e', weight:1, fill:true, fillOpacity:0.9
      }).bindPopup(`<strong>${props?.nombre || props?.codigo || ''}</strong><br>Punto ${idx+1}<br>${ll[0].toFixed(2)}, ${ll[1].toFixed(2)}`);
      pointsLayer.addLayer(mk);
    });
  }

  function activateChapter(ch){
    const feat = RUTAS_GEOJSON.features.find(f => f.properties.codigo === ch.codigo);
    if(!feat) return;

    // Atenuar base al entrar
    animateFadeBase(0.15, 300);

    // Preparar geometría
    const latlngs = lngLatToLatLngs(feat.geometry.coordinates);

    // Limpiar capas previas
    highlightLayer.clearLayers();
    if (arrowLayer) { map.removeLayer(arrowLayer); arrowLayer = null; }
    if (snakeLine) { map.removeLayer(snakeLine); snakeLine = null; }

    // Dibujar línea con animación tipo "draw" (snake)
    snakeLine = L.polyline(latlngs, { color:'#f43f5e', weight:6, opacity:0.95, snakingSpeed: 250 }).addTo(map);
    snakeLine.once('snakeend', () => {
      // Al terminar el trazado, fijar highlight y flechas
      highlightLayer.clearLayers();
      highlightLayer.addData(feat);
      setArrowsOnLatLngs(latlngs);
    });
    // Iniciar animación
    snakeLine.snakeIn();

    // Puntos interactivos en la ruta
    setPointsOnLatLngs(latlngs, feat.properties || {});

    // Enfocar
    const b = L.latLngBounds(latlngs);
    map.flyToBounds(b, { padding:[50,50], duration:1.6 });
  }

  // ---------- BUILD STEPS
  const stepsContainer = document.getElementById('steps');
  (config.chapters || []).forEach((ch,idx)=>{
    const feat = RUTAS_GEOJSON.features.find(f=>f.properties.codigo===ch.codigo) || {properties:{}};
    const p = feat.properties || {};
    const step = document.createElement('section');
    step.className='step'; step.dataset.index=idx;

    const metaItems = [];
    if (p.peligrosidad) metaItems.push(`Peligrosidad: ${p.peligrosidad}`);
    if (typeof p.distancia_km_aprox!== 'undefined') metaItems.push(`${p.distancia_km_aprox} km aprox.`);
    if (p.frecuencia_anual_aprox) metaItems.push(`Frecuencia: ${p.frecuencia_anual_aprox}`);

    step.innerHTML = `
      <h2>${ch.title || p.nombre || ch.codigo}</h2>
      <div class="meta">${metaItems.join(' · ')}</div>
      ${ ch.image && ch.image.src ? `<img src="${ch.image.src}" alt="${ch.image.alt}">` : '' }
      <p>${ch.text || p.descripcion || ''}</p>
    `;

    stepsContainer.appendChild(step);
  });

  const steps = Array.from(document.querySelectorAll('.step'));
  let active = 0;

  // ---------- SCROLLAMA
  const scroller = scrollama();

  function handleStepEnter(resp){
    const el = resp.element;
    steps.forEach(s=>s.classList.remove('active'));
    el.classList.add('active');
    active = Number(el.dataset.index);
    activateChapter(config.chapters[active]);
  }

  function handleStepExit(resp){
    // Si sales del capítulo activo, restaurar opacidad base
    const idx = Number(resp.element.dataset.index);
    if (idx === active){ animateFadeBase(0.35, 300); }
  }

  scroller
    .setup({ step:'.step', offset:0.66 })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  window.addEventListener('resize', scroller.resize);

  // Activate first
  steps[0].classList.add('active');
  activateChapter(config.chapters[0]);

  // ---------- BUTTON NAVIGATION
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.onclick = () => { if(active > 0){ steps[active-1].scrollIntoView({ behavior:'smooth' }); } };
  nextBtn.onclick = () => { if(active < steps.length-1){ steps[active+1].scrollIntoView({ behavior:'smooth' }); } };

  // ---------- LEGEND
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
