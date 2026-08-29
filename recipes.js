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

  hiddenAchievements: {
    fuego_descontrolado: {
      icon: "🔥",
      title: "Aprendiz del Humo Norteño",
      description: "Avivaste el fuego hasta descubrir que hasta la mejor olla necesita paciencia."
    },
    mezcla_imposible: {
      icon: "🫧",
      title: "Alquimista del Desastre",
      description: "Probaste tantos ingredientes ajenos a la comanda que encontraste el camino de la mezcla imposible."
    },
    cucharon_porfiado: {
      icon: "🥄",
      title: "Cucharón Porfiado",
      description: "Insististe tres veces con el mismo ingrediente y descubriste que una receta también sabe decir que no."
    },
    fogon_dormido: {
      icon: "🪵",
      title: "Guardián/a de las Brasas Dormidas",
      description: "Completaste la comanda, pero el fuego quedó tan bajo que la preparación no alcanzó su punto."
    },
    termometro_bailarin: {
      icon: "🌡️",
      title: "Termómetro Bailarín",
      description: "Subiste y bajaste el fuego tantas veces que la cocción perdió su ritmo."
    },
    pulso_del_fogon: {
      icon: "🌡️",
      title: "Pulso del Fogón",
      description: "Rescataste una cocción en zona crítica bajando el fuego antes de que fuera tarde."
    },
    viajero_regional: {
      icon: "🧭",
      title: "Viajero/a de Sabores",
      description: "Transformaste una receta siguiendo la pista de una variación regional."
    }
  },

  didYouKnow: [
    "La empanada salteña suele ser pequeña, jugosa y llevar papa junto con carne cortada a cuchillo.",
    "La empanada tucumana se reconoce por el matambre, el verdeo y el limón que suele acompañarla al servir.",
    "El nombre humita se vincula con la voz quechua humint'a y con una antigua tradición andina del maíz.",
    "La chala no es solo un envoltorio: protege la humedad y aporta aroma durante la cocción de humitas y tamales.",
    "El locro reúne raíces prehispánicas y aportes criollos; por eso existen tantas versiones como comunidades que lo cocinan.",
    "La palabra tamal proviene del náhuatl tamalli, asociada a una preparación envuelta.",
    "El charqui permitió conservar carne mediante salado y secado mucho antes de que existieran las heladeras.",
    "La cocina del NOA guarda encuentros entre saberes indígenas, andinos y criollos en cada receta familiar."
  ],

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

  cookbookChapters: {
    empanadas: {
      anchor: "receta-empanadas",
      name: "Empanadas regionales",
      navName: "Empanadas",
      emoji: "🥟",
      region: "Salta · Tucumán · Córdoba",
      introduction: "Una masa fina guarda un relleno jugoso cuya identidad cambia de provincia en provincia. Esta receta maestra parte de la versión salteña y explica cómo llevarla hacia la tucumana o la cordobesa.",
      meta: [
        { label: "Rinde", value: "18 empanadas" },
        { label: "Preparación", value: "45 minutos" },
        { label: "Reposo", value: "2 horas" },
        { label: "Cocción", value: "12–15 minutos" },
        { label: "Dificultad", value: "Intermedia" }
      ],
      equipment: ["Cuchillo bien afilado", "Tabla separada para carne", "Cacerola amplia", "Bandeja para enfriar", "Placa de horno", "Pincel de cocina"],
      ingredientGroups: [
        { title: "Relleno salteño", items: ["700 g de carne vacuna magra cortada a cuchillo", "450 g de cebolla picada", "300 g de papa en cubos de 5 mm", "3 huevos duros picados", "2 cucharadas de grasa vacuna o aceite", "2 cebollas de verdeo, parte verde, para terminar"] },
        { title: "Masa y armado", items: ["18 tapas criollas para horno de 12–13 cm", "1 huevo batido para pintar", "Harina extra para la mesa", "Agua apenas tibia para humedecer los bordes"] },
        { title: "Condimentos", items: ["1½ cucharaditas de pimentón dulce", "1 cucharadita de comino molido", "½ cucharadita de ají molido", "Sal fina y pimienta negra", "Opcional: una pizca de orégano seco"] }
      ],
      variations: [
        { name: "Salteña", place: "Salta", detail: "Conservá la papa, la carne cortada a cuchillo y el perfil especiado. Se busca una empanada pequeña, jugosa y de masa firme." },
        { name: "Tucumana", place: "Tucumán", detail: "Reemplazá la carne por 750 g de matambre hervido y cortado; quitá la papa, aumentá el verdeo y serví con gajos de limón. Cerrá con 13 repulgues." },
        { name: "Cordobesa", place: "Córdoba", detail: "Sumá 70 g de pasas hidratadas, aceitunas picadas y una pizca de azúcar al relleno; espolvoreá muy levemente la tapa antes de hornear." }
      ],
      steps: [
        { title: "Organizar y enfriar", time: "10 min", detail: "Separá los utensilios para carne y vegetales. Mantené la carne fría hasta cortarla: así se logran cubos limpios de aproximadamente 5 mm.", tip: "No piques la carne como pasta; los pequeños cubos conservan mejor textura y jugo." },
        { title: "Blanquear la papa", time: "5 min", detail: "Herví los cubitos en agua con sal durante 3 a 4 minutos. Deben quedar apenas tiernos, todavía firmes. Colá y extendé para cortar la cocción.", tip: "Si la papa se cocina de más, se desarma al mezclar el relleno." },
        { title: "Construir la base", time: "12 min", detail: "Calentá la grasa a fuego medio. Cociná la cebolla con una pizca de sal hasta que esté transparente, sin dorarla en exceso. Añadí pimentón, comino y ají fuera del fuego durante 20 segundos.", tip: "Las especias se queman rápido; el calor residual alcanza para despertar su aroma." },
        { title: "Sellar la carne", time: "6 min", detail: "Volvé al fuego fuerte, incorporá la carne y mezclá solo hasta que cambie de color por fuera. Retirá aunque el centro aún esté rosado: terminará de cocinarse en el horno.", tip: "Una cocción breve evita un relleno seco." },
        { title: "Enfriar y madurar", time: "2 h", detail: "Mezclá la papa, corregí sal y pimienta y extendé el relleno en una bandeja. Cuando esté frío, tapá y llevá a heladera. Al final agregá huevo duro y verdeo.", tip: "El relleno frío protege la masa y permite un repulgue limpio." },
        { title: "Rellenar", time: "15 min", detail: "Colocá 1½ cucharadas en el centro de cada disco. Dejá un borde libre de 1,5 cm; humedecelo apenas, cerrá expulsando aire y presioná sin aplastar el relleno.", tip: "Demasiado relleno abre la empanada durante la cocción." },
        { title: "Repulgar y pintar", time: "10 min", detail: "Formá el repulgue de la variante elegida. Acomodá con la unión hacia arriba sobre placa fría y pincelá una capa fina de huevo batido.", tip: "Mantené las empanadas armadas en frío mientras el horno termina de calentarse." },
        { title: "Hornear fuerte", time: "12–15 min", detail: "Calentá el horno a 230 °C. Horneá hasta que la base esté firme y la superficie dorada. Esperá 3 minutos antes de servir: el interior conserva mucho calor.", tip: "Una placa precalentada ayuda a obtener una base más crocante." }
      ],
      serving: "Serví calientes, no recién salidas del horno. Para una mesa regional, acompañá con salsa de ají suave y gajos de limón para la versión tucumana.",
      storage: "El relleno cocido se conserva hasta 48 horas refrigerado. Las empanadas armadas pueden congelarse separadas; hornealas sin descongelar agregando unos minutos.",
      safety: "Enfriá el relleno rápidamente en una fuente baja y evitá dejar carne cocida a temperatura ambiente por períodos prolongados."
    },
    humita: {
      anchor: "receta-humita",
      name: "Humita: en olla y en chala",
      navName: "Humita",
      emoji: "🌽",
      region: "Salta · Jujuy · Tucumán",
      introduction: "El choclo fresco y el zapallo forman una crema de raíz prehispánica. La misma preparación puede servirse en plato o convertirse en paquetes envueltos en chala.",
      meta: [
        { label: "Rinde", value: "10–12 porciones" },
        { label: "Preparación", value: "50 minutos" },
        { label: "Cocción en olla", value: "25–35 minutos" },
        { label: "Cocción en chala", value: "50–60 minutos" },
        { label: "Dificultad", value: "Intermedia" }
      ],
      equipment: ["Rallador grueso o procesadora", "Cacerola de fondo pesado", "Sartén", "Cuchara de madera", "Olla alta para hervir", "Hilo de algodón si faltan tiras de chala"],
      ingredientGroups: [
        { title: "Base de choclo", items: ["12 choclos frescos con sus chalas", "500 g de zapallo amarillo rallado", "200–250 ml de leche", "250 g de queso criollo o cremoso en cubos", "2 cucharadas de aceite de maíz o girasol"] },
        { title: "Sofrito", items: ["2 cebollas medianas picadas finas", "1 pimiento rojo pequeño", "1 tomate maduro sin semillas, opcional", "1 cucharada de albahaca fresca picada"] },
        { title: "Condimentos", items: ["1 cucharadita de pimentón dulce", "½ cucharadita de comino", "Ají molido a gusto", "Sal y pimienta negra"] }
      ],
      variations: [
        { name: "Humita en olla", place: "NOA", detail: "Se sirve cremosa en cazuela. Reservá parte de la leche para ajustar la textura al final y añadí el queso poco antes de servir." },
        { name: "Humita en chala", place: "Región andina", detail: "Usá una pasta algo más firme. Cruzá dos chalas, rellená, cerrá bien y herví los paquetes hasta que la hoja cambie de color." }
      ],
      steps: [
        { title: "Elegir y guardar las chalas", time: "10 min", detail: "Pelá los choclos sin romper las hojas. Separá las chalas interiores más anchas y flexibles; lavalas con cuidado y reservá algunas para cortar tiras de atado.", tip: "Dos hojas grandes por paquete facilitan un cierre seguro." },
        { title: "Rallar el choclo", time: "20 min", detail: "Rallá los granos sobre un recipiente profundo, aprovechando la leche natural del choclo. También podés procesar por pulsos, sin convertirlo en líquido.", tip: "Un choclo tierno y lechoso necesita menos leche agregada." },
        { title: "Preparar el sofrito", time: "12 min", detail: "Calentá el aceite y cociná cebolla y pimiento a fuego bajo hasta que estén suaves. Agregá pimentón, comino y ají al final para que no se quemen.", tip: "El sofrito debe quedar dulce y húmedo, no tostado." },
        { title: "Cocinar la crema", time: "25–35 min", detail: "Incorporá choclo y zapallo. Cociná a fuego bajo y revolvé, raspando fondo y esquinas. Sumá leche de a poco hasta lograr una crema espesa que se desprenda lentamente de la cuchara.", tip: "Si salpica o se pega, bajá el fuego y agregá un pequeño chorro de leche caliente." },
        { title: "Condimentar y terminar", time: "5 min", detail: "Probá y corregí sal, pimienta y picante. Apagá el fuego, añadí albahaca y parte del queso. Para servir en olla, dejá reposar 5 minutos y terminá con más queso.", tip: "La albahaca conserva mejor su perfume cuando entra fuera del fuego." },
        { title: "Acondicionar las hojas", time: "8 min", detail: "Para humita en chala, pasá las hojas por agua muy caliente hasta que sean flexibles. Escurrí, secá y colocá dos en cruz, con las partes anchas superpuestas.", tip: "No las hiervas demasiado: se vuelven frágiles y difíciles de atar." },
        { title: "Rellenar y atar", time: "20 min", detail: "Poné 3 cucharadas de pasta firme y un cubo de queso en el centro. Cerrá primero los laterales, luego las puntas, y sujetá el paquete con una tira de chala.", tip: "Dejá espacio para que la preparación se expanda durante la cocción." },
        { title: "Hervir los paquetes", time: "50–60 min", detail: "Sumergí en abundante agua con sal ya hirviendo. Mantené un hervor moderado y los paquetes cubiertos. Retirá, escurrí y esperá 5 minutos antes de abrir.", tip: "La chala amarillenta y la masa firme indican que la cocción está completa." }
      ],
      serving: "En olla, serví en cazuelas calientes con queso y una cucharadita de aceite de ají. En chala, llevá el paquete cerrado al plato para conservar aroma y temperatura.",
      storage: "La humita cocida se conserva hasta 3 días en heladera. Los paquetes fríos pueden congelarse; recalentá al vapor o en agua suave.",
      safety: "Enfriá la preparación antes de refrigerarla y utilizá chalas limpias, sin hongos ni zonas deterioradas."
    },
    locro: {
      anchor: "receta-locro",
      name: "Locro criollo de cocción lenta",
      navName: "Locro",
      emoji: "🥘",
      region: "Noroeste argentino y Cuyo",
      introduction: "Maíz blanco, porotos y zapallo se cocinan hasta formar un guiso espeso y comunitario. La paciencia, más que la harina o la crema, es la responsable de su textura.",
      meta: [
        { label: "Rinde", value: "10–12 porciones" },
        { label: "Remojo", value: "8–12 horas" },
        { label: "Preparación", value: "45 minutos" },
        { label: "Cocción", value: "3½–4 horas" },
        { label: "Dificultad", value: "Intermedia" }
      ],
      equipment: ["Olla de 8–10 litros", "Dos recipientes para remojo", "Cuchillo y tablas separadas", "Espumadera", "Cucharón de madera", "Sartén pequeña para la salsa"],
      ingredientGroups: [
        { title: "Legumbres y vegetales", items: ["1 kg de maíz blanco pisado", "250 g de porotos blancos", "1 kg de zapallo anco o criollo", "500 g de papa o batata", "2 cebollas", "2 puerros o cebollas de verdeo"] },
        { title: "Carnes", items: ["700 g de carne vacuna para guiso", "300 g de panceta o cuerito de cerdo", "2 chorizos colorados", "Opcional: 300 g de falda o pechito de cerdo"] },
        { title: "Condimentos y salsa", items: ["2 cucharadas de pimentón dulce", "1 cucharadita de ají molido", "1 cucharadita de comino", "2 dientes de ajo", "4 cucharadas de aceite", "Sal, pimienta y verdeo fresco"] }
      ],
      variations: [
        { name: "Locro criollo", place: "Noroeste y Cuyo", detail: "Usá carnes frescas, panceta y chorizo colorado. El zapallo debe deshacerse para unir maíz, porotos y caldo." },
        { name: "Locro de altura", place: "Puna", detail: "Reemplazá parte de las carnes por 350–400 g de charqui desalado y deshilachado; incorporá papa andina y moderá la sal hasta el final." }
      ],
      steps: [
        { title: "Remojar por separado", time: "8–12 h", detail: "Lavá maíz y porotos hasta que el agua salga clara. Cubrilos por separado con al menos tres veces su volumen de agua y dejalos en frío durante la noche.", tip: "Separarlos permite controlar sus distintos tiempos de cocción." },
        { title: "Preparar con seguridad", time: "20 min", detail: "Cortá vegetales y carnes en tablas distintas. Retirá exceso de grasa, cortá la carne en cubos medianos y el chorizo en ruedas gruesas.", tip: "Lavá manos, cuchillos y superficies después de manipular carnes crudas." },
        { title: "Iniciar el maíz", time: "60 min", detail: "Escurrí el maíz, ponelo en la olla y cubrí con agua nueva unos 6 cm por encima. Llevá a hervor suave, revolviendo cada tanto para que no se asiente.", tip: "Tené agua caliente aparte para reponer sin detener la cocción." },
        { title: "Sumar porotos y carnes", time: "75 min", detail: "Agregá porotos escurridos, carne vacuna y panceta. Retirá con espumadera las impurezas de la superficie y mantené un hervor bajo, sin tapar por completo.", tip: "No sales todavía: la sal temprana puede retrasar el ablandamiento de los porotos." },
        { title: "Incorporar chorizo y aromáticos", time: "35 min", detail: "Añadí chorizo, cebolla y puerro. Mezclá desde el fondo con suavidad. Si usás charqui, desalalo previamente y sumalo deshilachado en esta etapa.", tip: "Un fuego demasiado fuerte rompe el maíz antes de que quede tierno." },
        { title: "Espesar con zapallo", time: "45–60 min", detail: "Agregá zapallo y papa. Cociná hasta que el zapallo se deshaga; ayudalo presionando algunos cubos contra la pared de la olla. El locro debe quedar cremoso, no seco.", tip: "Si se espesa demasiado, corregí con agua o caldo caliente en pequeñas cantidades." },
        { title: "Preparar la salsa", time: "10 min", detail: "Calentá aceite a fuego bajo, sumá ajo y verdeo y apagá. Incorporá pimentón y ají molido; mezclá y dejá reposar para que el aceite tome color.", tip: "Nunca quemes el pimentón: se vuelve amargo." },
        { title: "Reposar y servir", time: "20 min", detail: "Ajustá sal, pimienta y comino solo cuando todo esté tierno. Apagá y dejá reposar tapado. Serví en plato hondo con la salsa picante aparte.", tip: "Como muchos guisos, el sabor se integra todavía más al día siguiente." }
      ],
      serving: "Serví porciones generosas en platos hondos precalentados. Ofrecé salsa de ají, verdeo fresco y pan casero por separado.",
      storage: "Dividí en recipientes bajos y refrigerá hasta 3 días. Se puede congelar por porciones; descongelá en heladera y recalentá hasta hervor completo.",
      safety: "No uses los mismos utensilios para carnes crudas y vegetales listos para consumir. Enfriá rápidamente las sobras y no recalientes más de una vez."
    },
    tamales: {
      anchor: "receta-tamales",
      name: "Tamales norteños en chala",
      navName: "Tamales",
      emoji: "🌾",
      region: "Salta · Jujuy · Catamarca · Tucumán",
      introduction: "Una masa de maíz y zapallo envuelve un corazón de carne condimentada. La técnica depende tanto de la consistencia de la masa como de un paquete bien cerrado.",
      meta: [
        { label: "Rinde", value: "12 tamales" },
        { label: "Preparación", value: "1 h 20 min" },
        { label: "Reposo", value: "20 minutos" },
        { label: "Cocción", value: "30–40 minutos" },
        { label: "Dificultad", value: "Intermedia/alta" }
      ],
      equipment: ["Olla grande", "Sartén amplia", "Dos recipientes", "Cuchara de madera", "Cucharón o taza medidora", "Hilo de algodón opcional"],
      ingredientGroups: [
        { title: "Masa", items: ["500 g de harina de maíz fina", "450 g de zapallo anco cocido y hecho puré", "80–120 ml de caldo tibio", "2 cucharadas de grasa o aceite", "24 chalas secas más tiras para atar"] },
        { title: "Relleno", items: ["450 g de carne de cerdo o vacuna picada a cuchillo", "2 cebollas medianas", "2 huevos duros", "2 cebollas de verdeo", "Opcional para versión agridulce: 60 g de pasas hidratadas"] },
        { title: "Condimentos", items: ["1½ cucharaditas de pimentón", "1 cucharadita de comino", "½ cucharadita de ají molido", "Sal y pimienta", "Opcional: pizca de orégano"] }
      ],
      variations: [
        { name: "Tamal norteño", place: "NOA", detail: "Relleno salado de carne, cebolla y huevo con una masa de maíz condimentada y equilibrada." },
        { name: "Tamal agridulce", place: "Recetas familiares", detail: "Agregá pasas hidratadas al relleno y reducí levemente el ají; el contraste dulce no debe dominar el maíz ni la carne." }
      ],
      steps: [
        { title: "Hidratar las chalas", time: "20 min", detail: "Cubrilas con agua muy caliente hasta que sean flexibles. Enjuagá, escurrí y secá. Elegí las más grandes para envolver y cortá las pequeñas en tiras largas.", tip: "Mantenelas bajo un paño húmedo para que no vuelvan a quebrarse." },
        { title: "Cocinar el zapallo", time: "20 min", detail: "Cocinalo al vapor o al horno para evitar exceso de agua. Hacé un puré liso y dejalo entibiar antes de mezclar con la harina.", tip: "Un puré acuoso obliga a sumar demasiada harina y endurece el tamal." },
        { title: "Preparar el relleno", time: "20 min", detail: "Rehogá cebolla en grasa, incorporá la carne y cociná hasta que cambie de color. Sumá comino, pimentón y ají fuera del fuego. Enfriá y agregá huevo y verdeo.", tip: "El relleno debe estar frío antes del armado." },
        { title: "Amasar", time: "12 min", detail: "Mezclá harina, puré, grasa y sal. Agregá caldo tibio de a cucharadas hasta lograr una masa suave que conserve la forma sin agrietarse.", tip: "Probá una bolita: debe poder aplanarse entre los dedos sin desarmarse." },
        { title: "Formar las porciones", time: "10 min", detail: "Dividí la masa en 12 partes. Aplastá cada una hasta formar un óvalo de 1 cm, colocá una cucharada de relleno y cerrá la masa alrededor.", tip: "El relleno no debe tocar la chala; así el paquete queda más firme." },
        { title: "Envolver", time: "20 min", detail: "Superponé dos chalas con las partes anchas al centro. Colocá la porción, plegá laterales y puntas y atá sin estrangular el paquete.", tip: "Todos los tamales del mismo tamaño se cocinan de manera uniforme." },
        { title: "Hervir", time: "30–40 min", detail: "Acomodá en olla con agua salada hirviendo. Mantené hervor moderado y cubiertos de agua. Retirá uno, abrilo y comprobá que la masa esté firme y se separe de la hoja.", tip: "Si flotan, apoyá encima un plato resistente al calor para mantenerlos sumergidos." },
        { title: "Asentar antes de servir", time: "10 min", detail: "Escurrí y dejá reposar tapados con un paño. El vapor interior termina de estabilizar la masa y evita que se rompa al abrir.", tip: "Abrí la chala con cuidado: el centro conserva mucho calor." }
      ],
      serving: "Serví uno o dos por persona, todavía envueltos, con salsa de ají y una ensalada fresca. La chala se abre en el plato y no se come.",
      storage: "Refrigerá cocidos hasta 3 días o congelá individualmente. Recalentá al vapor o en agua caliente sin retirar la chala.",
      safety: "Usá chalas limpias y descartá las que tengan hongos. Enfriá el relleno antes de armar y cociná completamente la carne."
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
