/ ---------- STORYMAP FULLSCREEN with ZOOM CINEMÁTICO + DESENFOQUE + SLIDE IMAGES ----------
(function(){

  // ---------- MAPA BASE ----------
  const map = L.map('map', { center:[27,-15], zoom:4 });

  const positron = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19, attribution: '© OpenStreetMap · © CARTO' }
  ).addTo(map);

  const dark = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19, attribution:'© OpenStreetMap · © CARTO' }
  );

  L.control.layers({ "Positron": positron, "Dark": dark }).addTo(map);

  // ---------- BASE ROUTES ----------
  let baseOpacity = 0.35;

  const colorByRisk = v => {
    v = (v||"").toLowerCase();
    if(v.includes("extrema")) return "#8b0000";
    if(v.includes("muy alta")) return "#e34a33";
    if(v.includes("alta")) return "#fdbb84";
    return "#9ca3af";
  };

  const baseRoutes = L.geoJSON(RUTAS_GEOJSON,{
    style:f=>({
      color:colorByRisk(f.properties.peligrosidad),
      weight:3,
      opacity:baseOpacity
    })
  }).addTo(map);

  function fadeBase(to,d=300){
    const from=baseOpacity;
    const s=performance.now();
    function f(n){
      const t=Math.min(1,(n-s)/d);
      baseRoutes.setStyle({opacity:from+(to-from)*t});
      if(t<1) requestAnimationFrame(f);
      else baseOpacity=to;
    }
    requestAnimationFrame(f);
  }

  // ---------- HIGHLIGHT + ARROWS + SNAKE + POINTS ----------
  const highlightLayer = L.geoJSON(null,{ style:{color:"#f43f5e",weight:6} });
  highlightLayer.addTo(map);

  let arrowLayer = null;
  let snake = null;
  const points = L.layerGroup().addTo(map);

  const toLatLngs = coords => coords.map(c => [c[1],c[0]]);

  function setArrows(latlngs){
    if(arrowLayer) map.removeLayer(arrowLayer);

    arrowLayer = L.polylineDecorator(
      L.polyline(latlngs),
      {
        patterns:[{
          offset:'5%',
          repeat:'10%',
          symbol:L.Symbol.arrowHead({
            pixelSize:10,
            polygon:false,
            pathOptions:{color:'#f43f5e',weight:2}
          })
        }]
      }
    ).addTo(map);
  }

  function setPoints(latlngs,p){
    points.clearLayers();
    latlngs.forEach((ll,i)=>{
      L.circleMarker(ll,{
        radius:4,
        color:'#f43f5e',
        fill:true,
        fillOpacity:.9
      }).bindPopup(`${p.nombre}<br>Punto ${i+1}`).addTo(points);
    });
  }

  // ---------- ACTIVACIÓN DE CAPÍTULO ----------
  function activateChapter(ch){
    const feat = RUTAS_GEOJSON.features.find(f=>f.properties.codigo===ch.codigo);
    if(!feat) return;

    fadeBase(0.15);

    const latlngs = toLatLngs(feat.geometry.coordinates);

    highlightLayer.clearLayers();
    if(arrowLayer) map.removeLayer(arrowLayer);
    if(snake) map.removeLayer(snake);

    snake = L.polyline(latlngs,{
      color:"#f43f5e",
      weight:6,
      opacity:0.95,
      snakingSpeed:250
    }).addTo(map);

    // ⭐ ZOOM CINEMÁTICO AGRESIVO después del snake
    snake.once("snakeend",()=>{
      highlightLayer.addData(feat);
      setArrows(latlngs);

      if(ch.location){
        const extraZoom = ch.location.zoom + 3; 
        map.flyTo(ch.location.center, extraZoom, { duration: 2.3 });
      }
    });

    snake.snakeIn();
    setPoints(latlngs,feat.properties);
  }

  // ---------- CREACIÓN DE STEPS (IMAGEN + TEXTO) ----------
  const stepsContainer=document.getElementById("steps");

  config.chapters.forEach((ch,idx)=>{
    const feat = RUTAS_GEOJSON.features.find(f=>f.properties.codigo===ch.codigo);
    const p = feat.properties;

    const meta=[];
    if(p.peligrosidad) meta.push(`Peligrosidad: ${p.peligrosidad}`);
    if(p.distancia_km_aprox) meta.push(`${p.distancia_km_aprox} km aprox.`);
    if(p.frecuencia_anual_aprox) meta.push(`Frecuencia: ${p.frecuencia_anual_aprox}`);

    const step=document.createElement("section");
    step.className="step inactive";
    step.dataset.index=idx;

    // ⭐ AQUÍ SÍ SE INSERTA LA IMAGEN CORRECTAMENTE
    step.innerHTML = `
      <h2>${ch.title}</h2>
      <div class="meta">${meta.join(" · ")}</div>

      ${ch.image.src}

      <p>${ch.text}</p>
    `;

    stepsContainer.appendChild(step);
  });

  const steps=[...document.querySelectorAll(".step")];
  let active=0;

  // ---------- SCROLLAMA (incluye desenfoque + slide images) ----------
  const scroller=scrollama();

  scroller
    .setup({ step:'.step', offset:0.65 })
    .onStepEnter(resp=>{
      steps.forEach(s=>s.classList.remove("active","inactive"));

      resp.element.classList.add("active");
      active = Number(resp.element.dataset.index);

      steps.forEach((el,i)=>{
        if(i!==active) el.classList.add("inactive");
      });

      activateChapter(config.chapters[active]);
    })
    .onStepExit(()=>fadeBase(0.35));

  window.addEventListener("resize",scroller.resize);

  // ---------- START ----------
  steps[0].classList.remove("inactive");
  steps[0].classList.add("active");
  activateChapter(config.chapters[0]);

  // ---------- BOTONERA ----------
  document.getElementById("prevBtn").onclick=()=>{
    if(active>0) steps[active-1].scrollIntoView({behavior:"smooth"});
  };

  document.getElementById("nextBtn").onclick=()=>{
    if(active<steps.length-1) steps[active+1].scrollIntoView({behavior:"smooth"});
  };

  // ---------- LEYENDA ----------
  const legend=L.control({position:"bottomleft"});
  legend.onAdd=function(){
    const div=L.DomUtil.create("div","legend");
    div.innerHTML=`
      <strong>Peligrosidad (base)</strong><br>
      <div class="row"><span class="sw" style="background:#8b0000"></span>Extrema</div>
      <div class="row"><span class="sw" style="background:#e34a33"></span>Muy Alta</div>
      <div class="row"><span class="sw" style="background:#fdbb84"></span>Alta</div>
    `;
    return div;
  };
  legend.addTo(map);

})();
