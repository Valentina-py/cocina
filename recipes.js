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

  rejectionReasons: {
    empanadas: {
      queso: "Esta comanda trabaja una empanada regional de carne; el queso corresponde a otro tipo de relleno.",
      choclo: "El choclo es protagonista de humitas y tamales, pero no forma parte del relleno de carne de esta comanda.",
      poroto: "Los porotos pertenecen a preparaciones de olla, como el locro, y alterarían la textura de este relleno.",
      carne: "La versión tucumana de esta experiencia usa matambre cortado a cuchillo para lograr su textura característica.",
      pimenton: "Esta comanda tucumana concentra el sabor en matambre, verdeo y comino; el pimentón no está incluido en esta versión.",
      default: "No figura en la comanda de esta versión regional; las recetas familiares pueden tener otras variantes."
    },
    humita: {
      chorizo: "La humita obtiene su sabor y cremosidad del choclo y el zapallo; el chorizo pertenece a guisos como el locro.",
      poroto: "El poroto aporta una textura propia de guisos, mientras esta humita busca una pasta suave de choclo.",
      default: "No integra esta comanda de humita, centrada en productos del maíz y la huerta."
    },
    locro: {
      queso: "En esta comanda el cuerpo del locro se logra con maíz, porotos y zapallo, sin necesidad de queso.",
      leche: "El locro se espesa con zapallo y cocción lenta; la leche modificaría el carácter de este guiso.",
      limon: "Esta versión se termina con condimentos y verdeo; el limón no forma parte de su perfil de cocción.",
      default: "No pertenece a esta comanda de locro; buscá ingredientes pensados para una cocción larga en olla."
    },
    tamales: {
      queso: "Esta comanda propone un tamal con relleno de carne; el queso corresponde a otra familia de rellenos.",
      poroto: "El poroto funciona mejor en guisos de olla y no en la masa compacta que debe sostener la chala.",
      leche: "La masa de esta versión se une con zapallo y grasa del relleno; la leche cambiaría su consistencia.",
      default: "No figura en esta comanda de tamal envuelto; elegí ingredientes que puedan integrarse a la masa y al relleno."
    }
  },

  recipeGuides: {
    empanadas: {
      name: "Empanadas regionales",
      emoji: "🥟",
      region: "Salta · Tucumán · Córdoba",
      introduction: "La empanada recorre la Argentina con rellenos, tamaños y repulgues propios. En el NOA, la carne cortada a cuchillo y el horno de barro ocupan un lugar central.",
      variations: [
        { name: "Salteña", place: "Salta", detail: "Pequeña y jugosa, con carne, papa, huevo, comino y pimentón." },
        { name: "Tucumana", place: "Tucumán", detail: "Lleva matambre, verdeo y huevo; se reconoce por sus 13 repulgues y suele acompañarse con limón." },
        { name: "Cordobesa", place: "Córdoba", detail: "Combina carne, papa y huevo con el contrapunto dulce de las pasas y el azúcar." }
      ],
      steps: [
        "Cortar la carne y las verduras; cocinar el relleno con los condimentos de la variante elegida.",
        "Dejar enfriar completamente para conservar los jugos y evitar que la masa se humedezca.",
        "Colocar el relleno sobre los discos, cerrar y realizar el repulgue característico.",
        "Cocinar en horno fuerte —tradicionalmente de barro— hasta que la masa quede dorada."
      ],
      note: "Cada familia guarda proporciones y secretos propios: la guía presenta rasgos reconocibles, no una única receta posible."
    },
    humita: {
      name: "Humita",
      emoji: "🌽",
      region: "Salta · Jujuy · Tucumán",
      introduction: "De raíz prehispánica, la humita transforma choclo rallado y zapallo en una preparación espesa y suave, aromatizada con productos de la huerta.",
      variations: [
        { name: "En olla", place: "NOA", detail: "Se cocina y se sirve cremosa en plato, con cebolla, morrón, albahaca y especias." },
        { name: "En chala", place: "Región andina", detail: "La pasta se envuelve entre dos chalas cruzadas, se ata y se cocina como un pequeño paquete." }
      ],
      steps: [
        "Rallar o procesar los granos de choclo y combinar con zapallo cocido o rallado.",
        "Rehogar cebolla y morrón; sumar la pasta y cocinar lentamente, revolviendo para que no se pegue.",
        "Para servir en olla, ajustar la cremosidad y terminar con albahaca, queso o ají según la receta familiar.",
        "Para hacerla en chala, colocar la pasta en hojas cruzadas, cerrar, atar y hervir en agua con sal."
      ],
      note: "La chala no es solo envoltorio: también permite cocinar, conservar la forma y presentar la humita."
    },
    locro: {
      name: "Locro",
      emoji: "🥘",
      region: "Noroeste argentino y Cuyo",
      introduction: "Este guiso comunitario de origen prehispánico reúne maíz blanco, porotos y zapallo. Con el tiempo incorporó carnes y condimentos de distintas tradiciones.",
      variations: [
        { name: "Criollo", place: "Noroeste y Cuyo", detail: "Combina maíz, porotos, zapallo, panceta y chorizo colorado en una cocción prolongada." },
        { name: "De altura", place: "Puna", detail: "Suma charqui y papa, ingredientes ligados a la conservación y a los caminos andinos." }
      ],
      steps: [
        "Remojar por separado el maíz blanco y los porotos desde la noche anterior.",
        "Iniciar la cocción con abundante agua; incorporar las carnes y retirar la espuma cuando sea necesario.",
        "Agregar zapallo y cocinar a fuego bajo hasta que se deshaga y espese naturalmente el guiso.",
        "Servir bien caliente con una salsa de cebolla, pimentón y ají preparada aparte."
      ],
      note: "El locro necesita tiempo: la cocción lenta integra sabores y convierte al zapallo en el espesante de la olla."
    },
    tamales: {
      name: "Tamales norteños",
      emoji: "🫔",
      region: "Salta · Jujuy · Catamarca · Tucumán",
      introduction: "Tamal significa “envuelto”. La masa de maíz se combina con zapallo y guarda un relleno condimentado antes de cerrarse en chalas.",
      variations: [
        { name: "Norteño", place: "NOA", detail: "Masa de maíz y zapallo con relleno de cerdo, cebolla, huevo, pimentón y ají." },
        { name: "Agridulce", place: "Recetas familiares", detail: "Incorpora pasas de uva para contrastar el relleno de carne con un matiz dulce." }
      ],
      steps: [
        "Hidratar las chalas secas en agua caliente hasta que sean flexibles y no se quiebren.",
        "Preparar una masa maleable con harina de maíz, zapallo y condimentos.",
        "Disponer masa y relleno sobre las chalas, cerrar formando un paquete y atar con una tira de la misma hoja.",
        "Hervir en abundante agua hasta que el tamal esté firme y la masa completamente cocida."
      ],
      note: "La forma de atar, el picante y las proporciones del relleno cambian de una casa a otra."
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
      optional: [],
      pantry: ["carne", "papa", "cebolla", "huevo", "comino", "pimenton", "matambre", "limon", "aceituna", "pasas", "azucar", "queso"],
      description: "Pequeña, jugosa y especiada, con carne cortada a cuchillo y papa.",
      culture: "En Salta suele cocinarse al horno de barro y se reconoce por su tamaño pequeño y su relleno jugoso.",
      achievement: "Guardiana/o del Repulgue Salteño",
      variations: [
        {
          anyOf: ["matambre", "limon", "verdeo"],
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
      optional: [],
      pantry: ["matambre", "cebolla", "verdeo", "huevo", "comino", "limon", "papa", "aceituna", "pasas", "azucar", "carne", "queso"],
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
      optional: ["aceituna"],
      pantry: ["carne", "papa", "cebolla", "huevo", "pasas", "azucar", "aceituna", "matambre", "limon", "queso", "choclo", "poroto"],
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
      optional: ["queso", "leche", "comino"],
      pantry: ["choclo", "zapallo", "cebolla", "morron", "albahaca", "pimenton", "queso", "leche", "chala", "comino", "chorizo", "poroto"],
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
      optional: ["morron", "pimenton", "comino"],
      pantry: ["choclo", "zapallo", "cebolla", "queso", "albahaca", "chala", "morron", "pimenton", "leche", "comino", "chorizo", "poroto"],
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
      optional: ["papa", "aji"],
      pantry: ["maiz_blanco", "poroto", "zapallo", "panceta", "chorizo", "cebolla", "pimenton", "charqui", "papa", "aji", "queso", "leche"],
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
      optional: ["comino", "aji", "verdeo"],
      pantry: ["maiz_blanco", "poroto", "zapallo", "charqui", "papa", "cebolla", "pimenton", "comino", "aji", "verdeo", "queso", "leche"],
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
      optional: ["comino", "aji"],
      pantry: ["harina_maiz", "zapallo", "cerdo", "cebolla", "huevo", "pimenton", "chala", "pasas", "comino", "aji", "queso", "poroto"],
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
      optional: ["pimenton", "comino", "aji"],
      pantry: ["harina_maiz", "zapallo", "cerdo", "cebolla", "huevo", "pasas", "chala", "pimenton", "comino", "aji", "queso", "poroto"],
      description: "Masa de maíz con relleno de cerdo y el contrapunto dulce de las pasas.",
      culture: "Los tamales admiten variaciones de casa en casa: cerdo, huevo, ají y pasas aparecen en distintas combinaciones.",
      achievement: "Custodia/o de las Recetas Familiares",
      variations: []
    }
  }
};
