/*
 * Base cultural y lúdica del simulador.
 * Para usar el QR real del proyecto, reemplazá recipeBookUrl por la URL final.
 */
window.KITCHEN_DATA = {
  config: {
    // Se completa con la URL definitiva de Vercel o del dominio propio.
    recipeBookUrl: "",
    inactivityMs: 40000,
    warningMs: 10000
  },

  ingredients: {
    carne: { name: "Carne a cuchillo", icon: "🥩", tone: "red" },
    matambre: { name: "Matambre", icon: "🥩", tone: "red" },
    cerdo: { name: "Carne de cerdo", icon: "🍖", tone: "red" },
    panceta: { name: "Panceta", icon: "🥓", tone: "red" },
    chorizo: { name: "Chorizo colorado", icon: "🌶️", tone: "red" },
    charqui: { name: "Charqui", icon: "🥓", tone: "red" },
    papa: { name: "Papa", icon: "🥔", tone: "ochre" },
    zapallo: { name: "Zapallo", icon: "🎃", tone: "ochre" },
    choclo: { name: "Choclo rallado", icon: "🌽", tone: "yellow" },
    maiz_blanco: { name: "Maíz blanco", icon: "🌽", tone: "yellow" },
    harina_maiz: { name: "Harina de maíz", icon: "🟡", tone: "yellow" },
    poroto: { name: "Porotos", icon: "🫘", tone: "red" },
    cebolla: { name: "Cebolla", icon: "🧅", tone: "cream" },
    verdeo: { name: "Cebolla de verdeo", icon: "🌿", tone: "green" },
    morron: { name: "Ají morrón", icon: "🫑", tone: "red" },
    tomate: { name: "Tomate", icon: "🍅", tone: "red" },
    huevo: { name: "Huevo duro", icon: "🥚", tone: "cream" },
    queso: { name: "Queso criollo", icon: "🧀", tone: "yellow" },
    leche: { name: "Leche", icon: "🥛", tone: "cream" },
    chala: { name: "Chalas", icon: "🍂", tone: "ochre" },
    albahaca: { name: "Albahaca", icon: "🌿", tone: "green" },
    comino: { name: "Comino", icon: "🟤", tone: "ochre" },
    pimenton: { name: "Pimentón", icon: "🔴", tone: "red" },
    aji: { name: "Ají molido", icon: "🌶️", tone: "red" },
    limon: { name: "Limón", icon: "🍋", tone: "yellow" },
    aceituna: { name: "Aceitunas", icon: "🫒", tone: "green" },
    pasas: { name: "Pasas de uva", icon: "🍇", tone: "purple" },
    azucar: { name: "Azúcar", icon: "◻️", tone: "cream" }
  },

  families: {
    empanadas: {
      title: "Empanadas regionales",
      subtitle: "Empezá por una versión. Los ingredientes sorpresa pueden hacerla viajar.",
      options: ["empanada_saltena", "empanada_tucumana", "empanada_cordobesa"]
    },
    humita: {
      title: "Dos maneras de compartir la humita",
      subtitle: "La misma raíz andina, servida al plato o envuelta en la hoja del choclo.",
      options: ["humita_olla", "humita_chala"]
    }
  },

  recipes: {
    empanada_saltena: {
      family: "empanadas",
      name: "Empanada Salteña",
      region: "Salta · Valles y quebradas",
      emoji: "🥟",
      vessel: "board",
      required: ["carne", "papa", "cebolla", "huevo", "comino", "pimenton"],
      pantry: ["carne", "papa", "cebolla", "huevo", "comino", "pimenton", "matambre", "limon", "aceituna", "pasas", "azucar", "verdeo"],
      description: "Pequeña, jugosa y especiada, con carne cortada a cuchillo y papa.",
      culture: "En Salta suele cocinarse al horno de barro y se reconoce por su tamaño pequeño y su relleno jugoso.",
      achievement: "Guardiana/o del Repulgue Salteño",
      variations: [
        {
          anyOf: ["matambre", "limon"],
          target: "empanada_tucumana",
          message: "La combinación de matambre y limón nos lleva a Tucumán, donde la empanada se celebra con 13 repulgues."
        },
        {
          anyOf: ["aceituna", "pasas", "azucar"],
          target: "empanada_cordobesa",
          message: "El contraste dulce y salado es una marca muy reconocible de la empanada cordobesa."
        }
      ]
    },

    empanada_tucumana: {
      family: "empanadas",
      name: "Empanada Tucumana",
      region: "Tucumán · Jardín de la República",
      emoji: "🥟",
      vessel: "board",
      required: ["matambre", "cebolla", "verdeo", "huevo", "comino", "limon"],
      pantry: ["matambre", "cebolla", "verdeo", "huevo", "comino", "limon", "papa", "aceituna", "pasas", "azucar", "carne", "pimenton"],
      description: "Jugosa, con matambre, verdeo y el toque fresco del limón al servir.",
      culture: "La tucumana se distingue por sus 13 repulgues y por la Fiesta Nacional de la Empanada de Famaillá.",
      achievement: "Maestra/o de los Trece Repulgues",
      variations: [
        {
          anyOf: ["papa"],
          target: "empanada_saltena",
          message: "La papa en el relleno nos acerca a la versión salteña: pequeña, especiada y muy jugosa."
        },
        {
          anyOf: ["aceituna", "pasas", "azucar"],
          target: "empanada_cordobesa",
          message: "Pasas, aceitunas o azúcar abren la puerta al perfil agridulce cordobés."
        }
      ]
    },

    empanada_cordobesa: {
      family: "empanadas",
      name: "Empanada Cordobesa",
      region: "Córdoba · Sierras y llanura",
      emoji: "🥟",
      vessel: "board",
      required: ["carne", "papa", "cebolla", "huevo", "pasas", "azucar"],
      pantry: ["carne", "papa", "cebolla", "huevo", "pasas", "azucar", "aceituna", "matambre", "limon", "comino", "pimenton", "verdeo"],
      description: "Una versión agridulce con papa, pasas y azúcar sobre la masa.",
      culture: "Su contraste entre carne, pasas y azúcar recuerda herencias de la cocina colonial.",
      achievement: "Alquimista del Sabor Agridulce",
      variations: [
        {
          anyOf: ["matambre", "limon"],
          target: "empanada_tucumana",
          message: "El matambre y el limón cambian el rumbo hacia la tradición tucumana."
        }
      ]
    },

    humita_olla: {
      family: "humita",
      name: "Humita en Olla",
      region: "Salta · Jujuy · Tucumán",
      emoji: "🌽",
      vessel: "pot",
      required: ["choclo", "zapallo", "cebolla", "morron", "albahaca", "pimenton"],
      pantry: ["choclo", "zapallo", "cebolla", "morron", "albahaca", "pimenton", "queso", "leche", "chala", "comino", "tomate", "aji"],
      description: "Cremosa y suave, nacida de la mezcla de choclo rallado y zapallo.",
      culture: "La humita es de raíz prehispánica. En olla se cocina lentamente hasta lograr una textura espesa y sedosa.",
      achievement: "Maestra/o del Choclo y la Pacha",
      variations: [
        {
          anyOf: ["chala"],
          target: "humita_chala",
          message: "Al sumar la hoja del choclo, la humita deja el plato y se vuelve un pequeño paquete cocido en agua."
        }
      ]
    },

    humita_chala: {
      family: "humita",
      name: "Humita en Chala",
      region: "Región andina del NOA",
      emoji: "🌽",
      vessel: "bowl",
      required: ["choclo", "zapallo", "cebolla", "queso", "albahaca", "chala"],
      pantry: ["choclo", "zapallo", "cebolla", "queso", "albahaca", "chala", "morron", "pimenton", "leche", "comino", "tomate", "aji"],
      description: "Pasta de choclo con corazón de queso, envuelta y atada en chalas.",
      culture: "Las chalas se cruzan, se rellenan y se atan para formar un paquete que luego se hierve.",
      achievement: "Tejedora/or de Chalas Andinas",
      variations: [
        {
          anyOf: ["leche"],
          target: "humita_olla",
          message: "La leche suma cremosidad y lleva la preparación hacia una humita servida en olla."
        }
      ]
    },

    locro_criollo: {
      family: "locro",
      name: "Locro Criollo",
      region: "Noroeste y Cuyo",
      emoji: "🥘",
      vessel: "pot",
      required: ["maiz_blanco", "poroto", "zapallo", "panceta", "chorizo", "cebolla", "pimenton"],
      pantry: ["maiz_blanco", "poroto", "zapallo", "panceta", "chorizo", "cebolla", "pimenton", "charqui", "papa", "comino", "aji", "verdeo"],
      description: "Guiso comunitario de maíz blanco, porotos, zapallo y carnes.",
      culture: "De origen prehispánico, el locro cambió con los siglos y hoy reúne a familias y comunidades alrededor de la olla.",
      achievement: "Maestra/o del Fuego Comunitario",
      variations: [
        {
          anyOf: ["charqui"],
          target: "locro_puneno",
          message: "El charqui —carne conservada por secado— nos lleva hacia los sabores de la Puna y los caminos de altura."
        }
      ]
    },

    locro_puneno: {
      family: "locro",
      name: "Locro de Altura",
      region: "Puna jujeña y salteña",
      emoji: "🥘",
      vessel: "pot",
      required: ["maiz_blanco", "poroto", "zapallo", "charqui", "papa", "cebolla", "pimenton"],
      pantry: ["maiz_blanco", "poroto", "zapallo", "charqui", "papa", "cebolla", "pimenton", "panceta", "chorizo", "comino", "aji", "verdeo"],
      description: "Una lectura de altura con maíz, papa y charqui secado al aire.",
      culture: "El charqui fue una forma ancestral de conservar carne y transportarla por los caminos andinos.",
      achievement: "Guardiana/o de los Sabores de Altura",
      variations: []
    },

    tamales_saltenos: {
      family: "tamales",
      name: "Tamales Norteños",
      region: "Salta · Jujuy · Tucumán",
      emoji: "🫔",
      vessel: "bowl",
      required: ["harina_maiz", "zapallo", "cerdo", "cebolla", "huevo", "pimenton", "chala"],
      pantry: ["harina_maiz", "zapallo", "cerdo", "cebolla", "huevo", "pimenton", "chala", "pasas", "comino", "aji", "verdeo", "queso"],
      description: "Masa de maíz y zapallo, rellena, envuelta en chala y hervida.",
      culture: "Tamal significa “envuelto”. Cada familia guarda una proporción, un condimento y una forma de atarlo.",
      achievement: "Maestra/o del Envoltorio Ancestral",
      variations: [
        {
          anyOf: ["pasas"],
          target: "tamales_dulces",
          message: "Las pasas resaltan una de las tantas versiones familiares que combinan lo salado con un toque dulce."
        }
      ]
    },

    tamales_dulces: {
      family: "tamales",
      name: "Tamal Norteño Agridulce",
      region: "Recetas familiares del NOA",
      emoji: "🫔",
      vessel: "bowl",
      required: ["harina_maiz", "zapallo", "cerdo", "cebolla", "huevo", "pasas", "chala"],
      pantry: ["harina_maiz", "zapallo", "cerdo", "cebolla", "huevo", "pasas", "chala", "pimenton", "comino", "aji", "verdeo", "queso"],
      description: "Masa de maíz con relleno de cerdo y el contrapunto dulce de las pasas.",
      culture: "Los tamales admiten variaciones de casa en casa: cerdo, huevo, ají y pasas aparecen en distintas combinaciones.",
      achievement: "Custodia/o de las Recetas Familiares",
      variations: []
    }
  }
};
