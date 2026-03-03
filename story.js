// ---------- STORYMAP FULLSCREEN with SNAKE + FLECHAS + PUNTOS + BOTONERA ----------
(function(){

  // ---------- MAP BASELAYERS: CARTO Positron (sin API key) ----------
  const map = L.map('map', { center:[27,-15], zoom:4, zoomControl:true });

  // Basemap principal (CARTO Positron)
  const terrain = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      maxZoom: 19,
      attribution: '© OpenStreetMap • © CARTO'
    }
  ).addTo(map);

  // Basemap oscuro (opcional)
  const dark = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19, attribution: '© OpenStreetMap • © CARTO' }
  );

  // Control de capas
  L.control.layers(
    { 'CARTO Positron': terrain, 'CARTO Dark': dark },
    null,
    { position:'topleft' }
  ).addTo(map);


  // ---------- BASE ROUTES with ANIMATED OPACITY ----------
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
    style: f => ({
      color: colorByRisk(f.properties.peligrosidad),
      weight:3,
      opacity:baseOpacity
    })
  }).addTo(map);

  function animateFadeBase(to, duration=300){
    const from = baseOpacity;
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      const val = from + (to - from) * t;
      baseRoutes.setStyle({ opacity: val });
      if (t < 1) requestAnimationFrame(frame);
      else baseOpacity = to;
    }
    requestAnimationFrame(frame);
  }

  // ---------- HIGHLIGHT + FLECHAS + SNAKE + PUNTOS ----------
  const highlightLayer = L.geoJSON(null, {
    style:{ color:'#f43f5e', weight:6, opacity:0.95 }
  }).addTo(map);

  let arrowLayer = null;
  let snakeLine  = null;
  let pointsLayer = L.layerGroup().addTo(map);

  function lngLatToLatLngs(coords){
    return coords.map(([lng,lat]) => [lat,lng]);
  }

  function setArrowsOnLatLngs(latlngs){
    if (arrowLayer) { map.removeLayer(arrowLayer); arrowLayer = null; }

    const poly = L.polyline(latlngs);

    arrowLayer = L.polylineDecorator(poly, {
      patterns:[{
        offset:'5%',
        repeat:'10%',
        symbol: L.Symbol.arrowHead({
          pixelSize:10,
          polygon:false,
          pathOptions:{ color:'#f43f5e', weight:2 }
        })
      }]
    }).addTo(map);
  }

  function setPointsOnLatLngs(latlngs, props){
    pointsLayer.clearLayers();

    latlngs.forEach((ll, idx) => {
      const mk = L.circleMarker(ll, {
        radius: 4,
        color:'#f43f5e',
        weight:1,
        fill:true,
        fillOpacity:0.9
      }).bindPopup(`
        <strong>${props?.nombre || props?.codigo || ''}</strong><br>
        Punto ${idx+1}<br>
        ${ll[0].toFixed(2)}, ${ll[1].toFixed(2)}
      `);
      pointsLayer.addLayer(mk);
    });
  }

  // ---------- ACTIVACIÓN DE CAPÍTULO ----------
  function activateChapter(ch){
    const feat = RUTAS_GEOJSON.features.find(f => f.properties.codigo === ch.codigo);
    if(!feat) return;

    animateFadeBase(0.15, 300);

    const latlngs = lngLatToLatLngs(feat.geometry.coordinates);

    highlightLayer.clearLayers();
    if (arrowLayer) { map.removeLayer(arrowLayer); arrowLayer = null; }
    if (snakeLine)  { map.removeLayer(snakeLine);  snakeLine  = null; }

    snakeLine = L.polyline(latlngs, {
      color:'#f43f5e',
      weight:6,
      opacity:0.95,
      snakingSpeed:250
    }).addTo(map);

    snakeLine.once('snakeend', () => {
      highlightLayer.clearLayers();
      highlightLayer.addData(feat);
      setArrowsOnLatLngs(latlngs);
    });

    snakeLine.snakeIn();

    setPointsOnLatLngs(latlngs, feat.properties);

    
    if (ch.location){
      map.flyTo(ch.location.center, ch.location.zoom, { duration: 1.5 });
    }
  }

  // ---------- STEPS ----------
  const stepsContainer = document.getElementById('steps');

  (config.chapters || []).forEach((ch,idx)=>{
    const feat = RUTAS_GEOJSON.features.find(f=>f.properties.codigo===ch.codigo) || {properties:{}};
    const p = feat.properties || {};

    const metaItems = [];
    if (p.peligrosidad) metaItems.push(`Peligrosidad: ${p.peligrosidad}`);
    if (typeof p.distancia_km_aprox !== 'undefined') metaItems.push(`${p.distancia_km_aprox} km aprox.`);
    if (p.frecuencia_anual_aprox) metaItems.push(`Frecuencia: ${p.frecuencia_anual_aprox}`);

    const step = document.createElement('section');
    step.className = 'step';
    step.dataset.index = idx;
    
    const sideClass = (idx % 2 === 0) ? 'img-right' : 'img-left';

    step.innerHTML = `
      <h2>${ch.title}</h2>
      <div class="meta">${metaItems.join(' · ')}</div>

      <div class="img-container ${sideClass}">
        <img src="${ch.image.src}" alt="${ch.image.alt}" />
      </div>

      <p>${ch.text}</p>
`   ;

    stepsContainer.appendChild(step);
  });

  const steps = Array.from(document.querySelectorAll('.step'));
  let active = 0;

  // ---------- SCROLLAMA ----------
  const scroller = scrollama();

  function handleStepEnter(resp){
    const el = resp.element;
    steps.forEach(s => s.classList.remove('active'));
    el.classList.add('active');

    active = Number(el.dataset.index);
    activateChapter(config.chapters[active]);
  }

  function handleStepExit(resp){
    const idx = Number(resp.element.dataset.index);
    if (idx === active){
      animateFadeBase(0.35, 300);
    }
  }

  scroller
    .setup({ step:'.step', offset:0.66 })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  window.addEventListener('resize', scroller.resize);

  // Activar el primer capítulo
  steps[0].classList.add('active');
  activateChapter(config.chapters[0]);

  // ---------- BOTONERA ----------
  document.getElementById('prevBtn').onclick = () => {
    if(active > 0){
      steps[active - 1].scrollIntoView({ behavior:'smooth' });
    }
  };

  document.getElementById('nextBtn').onclick = () => {
    if(active < steps.length - 1){
      steps[active + 1].scrollIntoView({ behavior:'smooth' });
    }
  };

  // ---------- LEYENDA ----------
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
