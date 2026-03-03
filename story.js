// ---------- STORYMAP FULLSCREEN with FLECHAS + OPACITY + BOTONERA ----------
(function(){
  // ---------- MAP DARK BASEMAP
  const map = L.map('map', { center:[27,-15], zoom:4, zoomControl:true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'© OpenStreetMap · CARTO'
  }).addTo(map);

  // ---------- BASE ROUTES with ANIMATED OPACITY
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

  function fadeBase(to){
    baseRoutes.setStyle({ opacity:to });
  }

  // ---------- HIGHLIGHT LAYER + FLECHAS
  const highlightLayer = L.geoJSON(null, { style:{ color:'#f43f5e', weight:6, opacity:0.95 } }).addTo(map);
  let arrowLayer = null;

  function setArrowsOnFeature(feature){
    if(arrowLayer) map.removeLayer(arrowLayer);
    arrowLayer = L.polylineDecorator(L.geoJSON(feature).getLayers()[0],{
      patterns:[{
        offset:'5%',
        repeat:'10%',
        symbol:L.Symbol.arrowHead({ pixelSize:10, polygon:false, pathOptions:{ color:'#f43f5e', weight:2 } })
      }]
    }).addTo(map);
  }

  // ---------- CHAPTER HANDLING
  function getFeatureByCodigo(codigo){ return RUTAS_GEOJSON.features.find(f => f.properties.codigo===codigo); }

  function activateChapter(ch){
    const feat = getFeatureByCodigo(ch.codigo);
    if(!feat) return;

    fadeBase(0.15);    // opacidad baja al entrar

    highlightLayer.clearLayers();
    highlightLayer.addData(feat);

    setArrowsOnFeature(feat);

    const b = L.geoJSON(feat).getBounds();
    map.flyToBounds(b, { padding:[50,50], duration:1.6 });
  }

  // ---------- BUILD STEPS
  const stepsContainer = document.getElementById('steps');

  config.chapters.forEach((ch,idx)=>{
    const step = document.createElement('section');
    step.className='step'; step.dataset.index=idx;

    step.innerHTML = `
      <h2>${ch.title}</h2>
      <div class="meta">${ch.codigo}</div>
      ${ ch.image && ch.image.src ? `<img src="${ch.image.src}" alt="${ch.image.alt}">` : '' }
      <p>${ch.text}</p>
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

  scroller.setup({ step:'.step', offset:0.66 }).onStepEnter(handleStepEnter);
  window.addEventListener('resize', scroller.resize);

  // Activate first
  steps[0].classList.add('active');
  activateChapter(config.chapters[0]);

  // ---------- BUTTON NAVIGATION
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.onclick = () => {
    if(active > 0){ steps[active-1].scrollIntoView({ behavior:'smooth' }); }
  };

  nextBtn.onclick = () => {
    if(active < steps.length-1){ steps[active+1].scrollIntoView({ behavior:'smooth' }); }
  };

})();
