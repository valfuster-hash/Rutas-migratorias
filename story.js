// ---------- STORYMAP FULLSCREEN with SNAKE + FLECHAS + PUNTOS + BOTONERA ----------
(function(){

  // ---------- MAP BASELAYER: CARTO Positron ----------
  const map = L.map('map', { center:[27,-15], zoom:4, zoomControl:true });

  const terrain = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19, attribution: '© OpenStreetMap • © CARTO' }
  ).addTo(map);

  const dark = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19, attribution: '© OpenStreetMap • © CARTO' }
  );

  L.control.layers({ 'Positron': terrain, 'Dark': dark }).addTo(map);


  // ---------- BASE ROUTES ----------
  let baseOpacity = 0.35;

  const colorByRisk = val => {
    if (!val) return '#9ca3af';
    const v = val.toLowerCase();
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

  function animateFadeBase(to, time=300){
    const from = baseOpacity;
    const start = performance.now();
    function frame(now){
      const t = Math.min(1,(now-start)/time);
      const val = from + (to-from)*t;
      baseRoutes.setStyle({opacity:val});
      if (t<1) requestAnimationFrame(frame);
      else baseOpacity = to;
    }
    requestAnimationFrame(frame);
  }


  // ---------- LAYERS: highlight + arrows + snake + points ----------

  const highlightLayer = L.geoJSON(null,{
    style:{color:'#f43f5e',weight:6,opacity:0.95}
  }).addTo(map);

  let arrowLayer=null;
  let snakeLine=null;
  const pointsLayer=L.layerGroup().addTo(map);

  function lngLatToLatLngs(coords){
    return coords.map(c=>[c[1],c[0]]);
  }

  function setArrows(latlngs){
    if (arrowLayer) map.removeLayer(arrowLayer);
    arrowLayer = L.polylineDecorator(L.polyline(latlngs), {
      patterns:[{
        offset:'5%',
        repeat:'10%',
        symbol: L.Symbol.arrowHead({
          pixelSize:10,
          polygon:false,
          pathOptions:{color:'#f43f5e',weight:2}
        })
      }]
    }).addTo(map);
  }

  function setPoints(latlngs,props){
    pointsLayer.clearLayers();
    latlngs.forEach((ll,i)=>{
      L.circleMarker(ll,{
        radius:4,color:'#f43f5e',
        fill:true,fillOpacity:0.9
      }).bindPopup(`<strong>${props.nombre}</strong><br>Punto ${i+1}`).addTo(pointsLayer);
    });
  }


  // ---------- CHAPTER ACTIVATION ----------
  function activateChapter(ch){
    const feat = RUTAS_GEOJSON.features.find(f=>f.properties.codigo===ch.codigo);
    if (!feat) return;

    animateFadeBase(0.15);

    const latlngs = lngLatToLatLngs(feat.geometry.coordinates);

    highlightLayer.clearLayers();
    if (arrowLayer) map.removeLayer(arrowLayer);
    if (snakeLine) map.removeLayer(snakeLine);

    snakeLine = L.polyline(latlngs,{
      color:'#f43f5e',
      weight:6,
      opacity:0.95,
      snakingSpeed:250
    }).addTo(map);

    snakeLine.once('snakeend',()=>{
      highlightLayer.addData(feat);
      setArrows(latlngs);
    });

    snakeLine.snakeIn();
    setPoints(latlngs,feat.properties);

    if (ch.location){
      map.flyTo(ch.location.center, ch.location.zoom, {duration:1.5});
    }
  }


  // ---------- BUILD STEPS (TWO PER CHAPTER) ----------
  const stepsContainer = document.getElementById('steps');
  const allSteps = [];

  (config.chapters || []).forEach((ch,idx)=>{
    const feat = RUTAS_GEOJSON.features.find(f=>f.properties.codigo===ch.codigo);
    const p = feat.properties;

    const meta = [];
    if (p.peligrosidad) meta.push(`Peligrosidad: ${p.peligrosidad}`);
    if (p.distancia_km_aprox) meta.push(`${p.distancia_km_aprox} km aprox.`);
    if (p.frecuencia_anual_aprox) meta.push(`Frecuencia: ${p.frecuencia_anual_aprox}`);

    // ---- STEP A: TEXTO ----
    const stepText = document.createElement('section');
    stepText.className='step step-text';
    stepText.dataset.index = idx;

    stepText.innerHTML = `
      <h2>${ch.title}</h2>
      <div class="meta">${meta.join(' · ')}</div>
      <p>${ch.text}</p>
    `;

    // ---- STEP B: IMAGEN ----
    const stepImg = document.createElement('section');
    stepImg.className = 'step step-image ' + ((idx % 2 === 0) ? 'right' : 'left');

    stepImg.innerHTML = `
      <img src="${ch.image.src}" alt="${ch.image.alt}">
    `;

    stepsContainer.appendChild(stepText);
    stepsContainer.appendChild(stepImg);

    allSteps.push(stepText);
    allSteps.push(stepImg);
  });


  // ---------- SCROLLAMA ----------
  const scroller = scrollama();

  function handleEnter(resp){
    const el = resp.element;

    // Solo activar ruta si el step es de texto
    if (el.classList.contains('step-text')){
      allSteps.forEach(s=>s.classList.remove('active'));
      el.classList.add('active');

      const idx = Number(el.dataset.index);
      activateChapter(config.chapters[idx]);
    }
  }

  function handleExit(resp){
    const el = resp.element;
    if (el.classList.contains('step-text')){
      animateFadeBase(0.35);
    }
  }

  scroller
    .setup({
      step:'.step',
      offset:0.65  
    })
    .onStepEnter(handleEnter)
    .onStepExit(handleExit);

  window.addEventListener('resize', scroller.resize);


  // ---------- START (primer capítulo) ----------
  allSteps[0].classList.add('active');
  activateChapter(config.chapters[0]);


  // ---------- BOTONERA ----------
  document.getElementById('prevBtn').onclick = ()=>{
    const current = allSteps.findIndex(s=>s.classList.contains('active'));
    if (current > 1){
      allSteps[current-2].scrollIntoView({behavior:'smooth'});
    }
  };

  document.getElementById('nextBtn').onclick = ()=>{
    const current = allSteps.findIndex(s=>s.classList.contains('active'));
    if (current < allSteps.length-2){
      allSteps[current+2].scrollIntoView({behavior:'smooth'});
    }
  };


  // ---------- LEYENDA ----------
  const legend = L.control({ position:'bottomleft' });

  legend.onAdd = function(){
    const div = L.DomUtil.create('div','legend');
    div.innerHTML = `
      <strong>Peligrosidad (base)</strong><br>
      <div class="row"><span class="sw" style="background:#8b0000"></span>Extrema</div>
      <div class="row"><span class="sw" style="background:#e34a33"></span>Muy Alta</div>
      <div class="row"><span class="sw" style="background:#fdbb84"></span>Alta</div>
    `;
    return div;
  };

  legend.addTo(map);

})();
``
