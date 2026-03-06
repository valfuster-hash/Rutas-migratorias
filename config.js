// -------------------------
// GeoJSON completo
// -------------------------
const RUTAS_GEOJSON = {
  type: "FeatureCollection",
  name: "rutas_migratorias_hacia_españa_ampliado",
  features: [
    {
      type: "Feature",
      properties: {
        nombre: "Ruta Atlántica Principal (Senegal → Canarias)",
        codigo: "WAAR_1",
        peligrosidad: "Muy alta",
        distancia_km_aprox: 1500,
        frecuencia_anual_aprox: "Alta (decenas de miles de personas)",
        descripcion: "La ruta más activa y peligrosa hacia España, reactivada desde 2023–2024.",
        fuentes: ["EOM 2024", "IOM DTM", "UNODC"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-17.473, 14.692],
          [-16.25, 16.03],
          [-15.95, 20.9],
          [-15.94, 23.7],
          [-17.92, 28.11]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        nombre: "Ruta Atlántica Mauritania → Canarias",
        codigo: "WAAR_2",
        peligrosidad: "Muy alta",
        distancia_km_aprox: 1400,
        frecuencia_anual_aprox: "Media-Alta",
        descripcion: "Ruta documentada por UNODC como parte de la Northwest African Atlantic Route.",
        fuentes: ["UNODC 2022"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-15.95, 20.9],
          [-15.94, 23.7],
          [-17.92, 28.11]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        nombre: "Ruta desde Sahara Occidental (El Aaiún) → Canarias",
        codigo: "WAAR_3",
        peligrosidad: "Muy alta",
        distancia_km_aprox: 450,
        frecuencia_anual_aprox: "Alta",
        descripcion: "Ruta muy activa desde 2020 según UNODC y EOM.",
        fuentes: ["UNODC 2022", "EOM 2024"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-13.53, 28.94],
          [-15.8, 29.23],
          [-17.92, 28.11]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        nombre: "Ruta Mediterránea Occidental (Tánger → Tarifa)",
        codigo: "WMR_1",
        peligrosidad: "Alta",
        distancia_km_aprox: 30,
        frecuencia_anual_aprox: "Media",
        descripcion: "Ruta corta pero peligrosa a través del Estrecho de Gibraltar.",
        fuentes: ["IOM DTM"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-5.81, 35.76],
          [-5.35, 35.89],
          [-5.61, 36.01]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        nombre: "Ruta Nador → Melilla",
        codigo: "WMR_2",
        peligrosidad: "Alta",
        distancia_km_aprox: 12,
        frecuencia_anual_aprox: "Media",
        descripcion: "Ruta marítima y terrestre hacia Melilla.",
        fuentes: ["IOM DTM"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-2.93, 35.25],
          [-2.93, 35.18],
          [-2.93, 35.29]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        nombre: "Ruta Argelia → Andalucía (Argel → Málaga)",
        codigo: "WMR_3",
        peligrosidad: "Alta",
        distancia_km_aprox: 500,
        frecuencia_anual_aprox: "Media",
        descripcion: "Ruta documentada por IOM desde Argel hacia Andalucía.",
        fuentes: ["IOM DTM"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [3.05, 36.75],
          [-1.9, 37.0],
          [-4.42, 36.72]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        nombre: "Ruta Gambia → Canarias (variante atlántica sur)",
        codigo: "WAAR_4",
        peligrosidad: "Extrema",
        distancia_km_aprox: 1700,
        frecuencia_anual_aprox: "Baja-Media",
        descripcion: "Ruta documentada como extremadamente peligrosa en informes de pérdidas en la ruta atlántica.",
        fuentes: ["UNODC 2022"]
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-16.58, 13.45],
          [-16.25, 16.03],
          [-17.92, 28.11]
        ]
      }
    }
  ]
};

// -------------------------
// StoryMap (capítulos)
// -------------------------
const config = {
  chapters: [
    {
      codigo: "WAAR_1",
      title: "Ruta Atlántica Principal (Senegal → Canarias)",
      text: `
Ruta marítima desde Senegal hacia Canarias, hoy uno de los principales corredores migratorios hacia España. En 2024 llegaron 46843 personas, el mayor número registrado. Pero también es una de las rutas más mortales del mundo: más de 10000 migrantes murieron ese mismo año intentando alcanzar las islas. En 2025 las llegadas bajaron a unas 17500, aunque el peligro de la travesía sigue siendo extremo frente a un océano impredecible y embarcaciones frágiles.
<br><br>
<a href="https://www.rtve.es/noticias/20240220/busca-dorado-ruta-cayuco-senegal-canarias/15978904.shtml"
target="_blank" rel="noopener noreferrer">
Lee la noticia en RTVE
</a>
`,
      image: {
        src: "images/Senegal_Canarias_v1.jpg",
        alt: "Cayucos en la costa de Senegal rumbo a Canarias"
      },
      location: { center: [20, -16], zoom: 5 }
    },

    {
      codigo: "WAAR_2",
      title: "Ruta Atlántica Mauritania → Canarias",
      text: `
La ruta atlántica entre Mauritania y las Islas Canarias es una de las principales vías de migración irregular hacia Europa. Cada año miles de personas intentan cruzar el Atlántico en cayucos o embarcaciones precarias, recorriendo entre 700 y 900 km de océano abierto. La travesía puede durar hasta una semana y está expuesta a corrientes fuertes, falta de combustible y escasez de agua. Por su distancia y condiciones extremas, se considera una de las rutas migratorias más peligrosas del mundo, con cientos de muertes o desapariciones registradas anualmente según la Organización Internacional para las Migraciones.
<br><br>
<a href="https://www.rtve.es/noticias/20240212/mauritania-a-canarias-clandestinidad-enganos-connivencia/15967225.shtml"
target="_blank" rel="noopener noreferrer">
Lee la noticia en RTVE
</a>
`,
      image: {
        src: "images/Mauritania_Canarias_v1.jpg",
        alt: "Tramo costero de Mauritania hacia Canarias"
      },
      location: { center: [23, -16], zoom: 6 }
    },

    {
      codigo: "WAAR_3",
      title: "Ruta Atlántica Sahara Occidental → Canarias",
      text: `
La ruta desde El Aaiún en el Sáhara Occidental hacia las Islas Canarias se ha convertido en uno de los trayectos más utilizados dentro del corredor atlántico desde 2020. Las embarcaciones recorren unos 450 km de océano abierto, generalmente en lanchas neumáticas o pequeñas pateras con alta sobrecarga. Aunque la distancia es menor que otras rutas atlánticas, las corrientes, el viento y la falta de medios de navegación hacen que la travesía sea muy peligrosa. Cada año miles de migrantes intentan este cruce, con numerosos rescates y desapariciones en el mar registrados por organismos como la Organización Internacional para las Migraciones.
<br><br>
<a href="https://caminandofronteras.org/rutas/ruta-canaria/"
target="_blank" rel="noopener noreferrer">
Lee los informes de la organización Caminando Fronteras
</a>
`,
      image: {
        src: "images/Sahara_Canarias_v1.jpg",
        alt: "Embarcaciones cercanas a El Aaiún rumbo a Canarias"
      },
      location: { center: [28, -15], zoom: 6 }
    },

    {
      codigo: "WMR_1",
      title: "Ruta Mediterránea Occidental Tánger → Tarifa (Estrecho de Gibraltar)",
      text: `
La ruta mediterránea occidental entre Tánger (Marruecos) y Tarifa (España) atraviesa el Estrecho de Gibraltar, uno de los pasos marítimos más transitados del mundo. Con unos 14 km de distancia en su punto más corto, es una de las rutas más breves hacia Europa, pero también muy peligrosa debido a fuertes corrientes, intenso tráfico marítimo y embarcaciones precarias. Cada año miles de personas intentan cruzarla en pateras o lanchas rápidas, registrándose rescates frecuentes y numerosas desapariciones según datos de la Organización Internacional para las Migraciones.
<br><br>
<a href="https://www.diarioarea.com/campo-de-gibraltar/la-inmigracion-ilegal-en-el-estrecho-de-gibraltar-aumenta-un-57-en-enero/"
target="_blank" rel="noopener noreferrer">
Lee la noticia del Diario Área
</a>
`,
      image: {
        src: "images/Tanger_Tarifa_v1.jpg",
        alt: "Vista del Estrecho de Gibraltar entre Tánger y Tarifa"
      },
      location: { center: [35.8, -5.5], zoom: 8 }
    },

    {
      codigo: "WMR_2",
      title: "Ruta Nador → Melilla",
      text: `
Ruta mixta marítima y terrestre. La ruta entre Nador (Marruecos) y Melilla (España) es uno de los pasos más cortos hacia territorio europeo en el norte de África. Aunque la distancia marítima es reducida, muchos migrantes intentan acceder rodeando la costa en pequeñas embarcaciones o intentando saltar el perímetro fronterizo de la ciudad. La fuerte vigilancia y los dispositivos de control convierten esta ruta en altamente peligrosa, con frecuentes intentos colectivos, rescates en el mar y enfrentamientos en la frontera, documentados por organizaciones como la Organización Internacional para las Migraciones.
<br><br>
<a href="https://www.borderforensics.org/es/investigations/nadormelilla/"
target="_blank" rel="noopener noreferrer">
Lee el informe sobre la tragedia de Nador del 24 de junio de 2022
</a>
`,
      image: {
        src: "images/Nador-Melilla_v1.jpg",
        alt: "Bahía próxima a Melilla desde Nador"
      },
      location: { center: [35.25, -2.9], zoom: 9 }
    },

    {
      codigo: "WMR_3",
      title: "Ruta Argelia → Andalucía (Argel → Málaga)",
      text: `
La ruta marítima entre Argel (Argelia) y Málaga (España) forma parte del corredor migratorio del Mediterráneo occidental. Las embarcaciones recorren entre 180 y 220 km de mar abierto, generalmente en pateras o pequeñas lanchas con escasos medios de navegación. La travesía puede durar más de 24 horas y está expuesta a cambios bruscos de viento y oleaje, lo que aumenta el riesgo para los ocupantes. Cada año cientos o miles de personas intentan este cruce, con operativos frecuentes de rescate y desapariciones en el mar registradas por la Organización Internacional para las Migraciones.
<br><br>
<a href="https://www.larazon.es/andalucia/inmigracion-argelia-nota-centros-menores-andalucia_2026012769784672eb223406e5b03a98.html"
target="_blank" rel="noopener noreferrer">
Lee la noticia en La Razón
</a>
`,
      image: {
        src: "images/Argel-Andalucia_v1.jpg",
        alt: "Trayecto marítimo desde Argel hacia Andalucía"
      },
      location: { center: [36.5, 0], zoom: 5 }
    },

    {
      codigo: "WAAR_4",
      title: "Ruta Gambia → Canarias (variante atlántica sur)",
      text: `
La ruta atlántica entre Gambia y las Islas Canarias es una de las variantes más largas del corredor migratorio hacia España. Las embarcaciones recorren más de 1500 km de océano abierto, normalmente en cayucos de pesca adaptados para largas travesías. El viaje puede durar entre una y dos semanas, con alto riesgo por corrientes atlánticas, falta de combustible y escasez de agua y alimentos. Debido a su distancia extrema, se considera una de las rutas más extremadamente peligrosas hacia Europa, con numerosas muertes y desapariciones registradas cada año según la Organización Internacional para las Migraciones.
<br><br>
<a href="https://www.laprovincia.es/canarias/2026/01/07/jinack-nuevo-epicentro-mortal-ruta-125459243.html"
target="_blank" rel="noopener noreferrer">
Lee la noticia en La Provincia
</a>
`,
      image: {
        src: "images/Gambia-Canarias_v1.jpg",
        alt: "Costa de Gambia con embarcaciones artesanales"
      },
      location: { center: [18, -17], zoom: 5 }
    }
  ]
};
