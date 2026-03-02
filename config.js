// -------------------------
// GeoJSON completo
// -------------------------
const RUTAS_GEOJSON = {
  "type": "FeatureCollection",
  "name": "rutas_migratorias_hacia_españa_ampliado",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta Atlántica Principal (Senegal → Canarias)",
        "codigo": "WAAR_1",
        "peligrosidad": "Muy alta",
        "distancia_km_aprox": 1500,
        "frecuencia_anual_aprox": "Alta (decenas de miles de personas)",
        "descripcion": "Ruta marítima desde Senegal hacia Canarias, identificada como la ruta más activa y peligrosa, especialmente reactivada desde 2023-2024.",
        "fuentes": ["EOM 2024", "IOM DTM", "UNODC"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-17.473, 14.692], 
          [-16.25, 16.03], 
          [-15.95, 20.9],  
          [-15.94, 23.7], 
          [-17.92, 28.11]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta Atlántica Mauritania → Canarias",
        "codigo": "WAAR_2",
        "peligrosidad": "Muy alta",
        "distancia_km_aprox": 1400,
        "frecuencia_anual_aprox": "Media-Alta",
        "descripcion": "Ruta documentada por UNODC como parte de la Northwest African Atlantic Route.",
        "fuentes": ["UNODC 2022"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-15.95, 20.9],
          [-15.94, 23.7],
          [-17.92, 28.11]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta desde Sahara Occidental (El Aaiún) → Canarias",
        "codigo": "WAAR_3",
        "peligrosidad": "Muy alta",
        "distancia_km_aprox": 450,
        "frecuencia_anual_aprox": "Alta",
        "descripcion": "Ruta muy activa desde 2020 según UNODC y EOM.",
        "fuentes": ["UNODC 2022", "EOM 2024"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-13.53, 28.94],
          [-15.8, 29.23],
          [-17.92, 28.11]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta Mediterránea Occidental (Tánger → Tarifa)",
        "codigo": "WMR_1",
        "peligrosidad": "Alta",
        "distancia_km_aprox": 30,
        "frecuencia_anual_aprox": "Media",
        "descripcion": "Ruta corta pero peligrosa a través del Estrecho de Gibraltar, identificada como WMR por IOM.",
        "fuentes": ["IOM DTM"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-5.81, 35.76],
          [-5.35, 35.89],
          [-5.61, 36.01]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta Nador → Melilla",
        "codigo": "WMR_2",
        "peligrosidad": "Alta",
        "distancia_km_aprox": 12,
        "frecuencia_anual_aprox": "Media",
        "descripcion": "Ruta marítima y terrestre hacia Melilla.",
        "fuentes": ["IOM DTM"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-2.93, 35.25],
          [-2.93, 35.18],
          [-2.93, 35.29]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta Argelia → Andalucía (Argel → Málaga)",
        "codigo": "WMR_3",
        "peligrosidad": "Alta",
        "distancia_km_aprox": 500,
        "frecuencia_anual_aprox": "Media",
        "descripcion": "Ruta documentada por IOM desde Argel hacia la costa andaluza.",
        "fuentes": ["IOM DTM"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [3.05, 36.75],
          [-1.9, 37.0],
          [-4.42, 36.72]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Ruta Gambia → Canarias (variante atlántica sur)",
        "codigo": "WAAR_4",
        "peligrosidad": "Extrema",
        "distancia_km_aprox": 1700,
        "frecuencia_anual_aprox": "Baja-Media",
        "descripcion": "Ruta documentada como extremadamente peligrosa en informes de pérdidas en la ruta atlántica.",
        "fuentes": ["UNODC 2022"]
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-16.58, 13.45],
          [-16.25, 16.03],
          [-17.92, 28.11]
        ]
      }
    }
  ]
};

// -------------------------
// StoryMap (capítulos) con imágenes
// Usa rutas relativas a una carpeta /images que tú coloques junto al index.html
// -------------------------
const config = {
  chapters: [
    {
      codigo: 'WAAR_1',
      title: 'Ruta Atlántica Principal (Senegal → Canarias)',
      text: 'La ruta más activa y peligrosa hacia España, reactivada desde 2023–2024.',
      image: { src: 'images/WAAR_1.jpg', alt: 'Cayucos en la costa de Senegal rumbo a Canarias' },
      location: { center: [20, -16], zoom: 5 }
    },
    {
      codigo: 'WAAR_2',
      title: 'Mauritania → Canarias',
      text: 'Incluida en la Northwest African Atlantic Route según UNODC.',
      image: { src: 'images/WAAR_2.jpg', alt: 'Tramo costero de Mauritania hacia Canarias' },
      location: { center: [23, -16], zoom: 6 }
    },
    {
      codigo: 'WAAR_3',
      title: 'Sahara Occidental → Canarias',
      text: 'Una de las rutas más utilizadas desde 2020.',
      image: { src: 'images/WAAR_3.jpg', alt: 'Embarcaciones cercanas a El Aaiún rumbo a Canarias' },
      location: { center: [28, -15], zoom: 6 }
    },
    {
      codigo: 'WMR_1',
      title: 'Tánger → Tarifa (Estrecho de Gibraltar)',
      text: 'Una ruta corta pero muy peligrosa.',
      image: { src: 'images/WMR_1.jpg', alt: 'Vista del Estrecho de Gibraltar entre Tánger y Tarifa' },
      location: { center: [35.8, -5.5], zoom: 8 }
    },
    {
      codigo: 'WMR_2',
      title: 'Nador → Melilla',
      text: 'Ruta mixta marítima y terrestre hacia la ciudad española.',
      image: { src: 'images/WMR_2.jpg', alt: 'Bahía próxima a Melilla desde Nador' },
      location: { center: [35.25, -2.9], zoom: 9 }
    },
    {
      codigo: 'WMR_3',
      title: 'Argel → Andalucía',
      text: 'Ruta mediterránea con destino sur de España.',
      image: { src: 'images/WMR_3.jpg', alt: 'Trayecto marítimo desde Argel hacia Andalucía' },
      location: { center: [36.5, 0], zoom: 5 }
    },
    {
      codigo: 'WAAR_4',
      title: 'Gambia → Canarias',
      text: 'Una variante extremadamente peligrosa de la ruta atlántica.',
      image: { src: 'images/WAAR_4.jpg', alt: 'Costa de Gambia con embarcaciones artesanales' },
      location: { center: [18, -17], zoom: 5 }
    }
  ]
};
