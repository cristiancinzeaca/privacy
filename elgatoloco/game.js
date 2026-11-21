/* ElGatoLoco and the Lost Stars — educational adventure for ages 5–12. No network, no tracking. */
(() => {
'use strict';

/* ---------- helpers ---------- */
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const W = s => s.split(' ');
const LANGS = ['ro', 'es', 'en'];

/* ---------- state ---------- */
const KEY = 'elgatoloco-v1';
const S = { lang: 'ro', age: 1, learn: 'both', sound: true, setup: false, stars: {}, stickers: [], byAge: {}, best: {}, vibe: true, stat: { plays: 0, smart: 0, daily: 0 }, daily: null };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
if (!S.setup) {
  const n = (navigator.language || 'ro').slice(0, 2);
  if (LANGS.includes(n)) S.lang = n;
  S.learn = S.lang === 'es' ? 'en' : S.lang === 'en' ? 'es' : 'both';
}

/* ---------- text ---------- */
const STR = {
  games: ['Jocuri', 'Juegos', 'Games'],
  adventure: ['Aventura', 'Aventura', 'Adventure'],
  g_snake: ['Pisica lungă', 'El gato largo', 'Long cat'],
  g_run: ['Fuga pisicii', 'La carrera del gato', 'Cat dash'],
  g_catch: ['Ploaia de pești', 'Lluvia de peces', 'Fish rain'],
  g_whack: ['Prinde șoarecii', 'Atrapa ratones', 'Catch the mice'],
  g_memory: ['Perechi', 'Parejas', 'Pairs'],
  g_fly: ['Zbor printre nori', 'Vuelo entre nubes', 'Cloud flight'],
  g_blocks: ['Sparge cuburile', 'Rompe los cubos', 'Block pop'],
  g_kart: ['Cursa de carturi', 'Carrera de karts', 'Kart race'],
  blocksHint: ['Atinge două sau mai multe cuburi lipite, de aceeași culoare', 'Toca dos o más cubos juntos del mismo color', 'Tap two or more touching blocks of the same colour'],
  kartHint: ['Glisează stânga-dreapta. Depășește pisicile și ocolește conurile!', 'Desliza a izquierda y derecha. ¡Adelanta a los gatos y esquiva los conos!', 'Slide left and right. Overtake the cats and dodge the cones!'],
  feed: ['Pauză de gustare! Hrănește pisicul cu toți peștii', '¡Pausa de merienda! Dale al gato todos los peces', 'Snack break! Give the cat all the fish'],
  bubbles: ['Pauză de baloane! Sparge toate baloanele de săpun', '¡Pausa de pompas! Explota todas las pompas de jabón', 'Bubble break! Pop all the soap bubbles'],
  hide: ['De-a v-ați ascunselea! În ce cutie e pisicul?', '¡Al escondite! ¿En qué caja está el gato?', 'Hide and seek! Which box is the cat in?'],
  chase: ['Pauză de joacă! Atinge șoricelul și pisicul îl prinde', '¡Pausa de juego! Enséñale el ratón al gato', 'Play break! Show the cat the mouse'],
  runHint: ['Atinge ca să sari. Atinge de două ori pentru salt dublu!', 'Toca para saltar. ¡Toca dos veces para un salto doble!', 'Tap to jump. Tap twice for a double jump!'],
  catchHint: ['Mișcă pisicul și prinde peștii. Ferește-te de apă!', 'Mueve al gato y atrapa los peces. ¡Cuidado con el agua!', 'Move the cat and catch the fish. Watch out for water!'],
  whackHint: ['Atinge șoarecii, dar nu ariciul!', 'Toca los ratones, ¡pero no el erizo!', 'Tap the mice, but not the hedgehog!'],
  memHint: ['Găsește perechile înainte să se termine timpul', 'Encuentra las parejas antes de que se acabe el tiempo', 'Find the pairs before time runs out'],
  flyHint: ['Atinge ca să zbori în sus. Adună stelele și ocolește norii!', 'Toca para subir. ¡Recoge las estrellas y esquiva las nubes!', 'Tap to fly up. Collect the stars and dodge the clouds!'],
  chance: ['A doua șansă! Răspunde corect și mergi mai departe', '¡Segunda oportunidad! Responde bien y sigue jugando', 'Second chance! Answer right and keep playing'],
  skip: ['Nu, mulțumesc', 'No, gracias', 'No, thanks'],
  daily: ['Provocarea zilei', 'Reto del día', 'Daily challenge'],
  dailyDone: ['Provocarea zilei, reușită!', '¡Reto del día conseguido!', 'Daily challenge done!'],
  newTrophy: ['Trofeu nou!', '¡Trofeo nuevo!', 'New trophy!'],
  quests: ['Provocări', 'Retos', 'Challenges'],
  q_plays: ['Jocuri jucate', 'Partidas jugadas', 'Games played'],
  q_stars: ['Stele din aventură', 'Estrellas de la aventura', 'Adventure stars'],
  q_stickers: ['Autocolante adunate', 'Pegatinas reunidas', 'Stickers collected'],
  q_smart: ['A doua șansă câștigată', 'Segundas oportunidades ganadas', 'Second chances won'],
  q_daily: ['Provocări zilnice reușite', 'Retos diarios conseguidos', 'Daily challenges done'],
  vibe: ['Vibrații', 'Vibración', 'Vibration'],
  vtest: ['Probează vibrația', 'Probar la vibración', 'Test vibration'],
  vNone: ['Acest browser nu poate vibra (iPhone și iPad nu permit vibrații din pagini web).', 'Este navegador no puede vibrar (iPhone y iPad no lo permiten en páginas web).', 'This browser cannot vibrate (iPhone and iPad do not allow it for web pages).'],
  vBlocked: ['Browserul a refuzat vibrația. Deschide jocul direct în Chrome.', 'El navegador ha rechazado la vibración. Abre el juego directamente en Chrome.', 'The browser refused to vibrate. Open the game directly in Chrome.'],
  vSent: ['Am trimis o vibrație lungă. Dacă nu ai simțit nimic, e oprită din telefon: Setări → Sunete și vibrații → intensitatea vibrațiilor / feedback la atingere. Verifică și modul Nu deranja și economisirea bateriei.', 'He enviado una vibración larga. Si no has notado nada, está apagada en el teléfono: Ajustes → Sonidos y vibración → intensidad de vibración / respuesta táctil. Revisa también No molestar y el ahorro de batería.', 'A long vibration was sent. If you felt nothing, it is turned off on the phone: Settings → Sounds and vibration → vibration intensity / touch feedback. Also check Do Not Disturb and battery saver.'],
  snake: ['Pisica lungă', 'El gato largo', 'Long cat'],
  snakeSub: ['Joacă liber: prinde pești și crește!', 'Juego libre: ¡atrapa peces y crece!', 'Free play: catch fish and grow!'],
  snakeHint: ['Glisează ca să schimbi direcția', 'Desliza para cambiar de dirección', 'Swipe to change direction'],
  bonus: ['Bonus', 'Bonus', 'Bonus'],
  record: ['Record', 'Récord', 'Best'],
  newRecord: ['Record nou!', '¡Nuevo récord!', 'New best!'],
  sub: ['și stelele pierdute', 'y las estrellas perdidas', 'and the Lost Stars'],
  story: ['Stelele au căzut din cer pe insule. Ajută-l pe ElGatoLoco să le adune pe toate!', 'Las estrellas se han caído del cielo a las islas. ¡Ayuda a ElGatoLoco a recogerlas todas!', 'The stars have fallen from the sky onto the islands. Help ElGatoLoco collect them all!'],
  play: ['Joacă', 'Jugar', 'Play'],
  language: ['Limba jocului', 'Idioma del juego', 'Game language'],
  age: ['Vârsta', 'Edad', 'Age'],
  years: ['ani', 'años', 'years'],
  learn: ['Învăț cuvinte în', 'Aprendo palabras en', 'I learn words in'],
  both: ['Ambele', 'Ambos', 'Both'],
  sound: ['Sunet', 'Sonido', 'Sound'],
  on: ['Pornit', 'Activado', 'On'],
  off: ['Oprit', 'Desactivado', 'Off'],
  settings: ['Setări', 'Ajustes', 'Settings'],
  album: ['Albumul cu autocolante', 'Álbum de pegatinas', 'Sticker album'],
  albumNote: ['Termină un nivel nou ca să primești un autocolant.', 'Termina un nivel nuevo para ganar una pegatina.', 'Finish a new level to earn a sticker.'],
  reset: ['Șterge progresul', 'Borrar el progreso', 'Erase progress'],
  resetSure: ['Sigur? Apasă din nou', '¿Seguro? Pulsa otra vez', 'Sure? Tap again'],
  privacy: ['Jocul nu colectează date și nu are reclame. Progresul se salvează doar pe acest dispozitiv.', 'El juego no recoge datos ni tiene anuncios. El progreso se guarda solo en este dispositivo.', 'The game collects no data and has no ads. Progress is saved only on this device.'],
  w_words: ['Pădurea Cuvintelor', 'El Bosque de las Palabras', 'Word Forest'],
  w_math: ['Muntele Numerelor', 'La Montaña de los Números', 'Number Mountain'],
  w_logic: ['Peștera Enigmelor', 'La Cueva de los Enigmas', 'Puzzle Cave'],
  w_nature: ['Laguna Vie', 'La Laguna Viva', 'Living Lagoon'],
  w_mix: ['Castelul Stelelor', 'El Castillo de las Estrellas', 'Star Castle'],
  s_words: ['Litere și cuvinte în spaniolă și engleză', 'Letras y palabras en español e inglés', 'Letters and words in Spanish and English'],
  s_math: ['Numere și calcule', 'Números y cálculos', 'Numbers and sums'],
  s_logic: ['Logică și memorie', 'Lógica y memoria', 'Logic and memory'],
  s_nature: ['Animale, plante și planete', 'Animales, plantas y planetas', 'Animals, plants and planets'],
  s_mix: ['Câte puțin din toate', 'Un poco de todo', 'A bit of everything'],
  locked: ['Adună {0} stele ca să deschizi castelul. Ai {1}.', 'Reúne {0} estrellas para abrir el castillo. Tienes {1}.', 'Collect {0} stars to open the castle. You have {1}.'],
  done3: ['Perfect!', '¡Perfecto!', 'Perfect!'],
  done2: ['Foarte bine!', '¡Muy bien!', 'Well done!'],
  done1: ['Ai reușit!', '¡Lo lograste!', 'You did it!'],
  newSticker: ['Autocolant nou!', '¡Pegatina nueva!', 'New sticker!'],
  next: ['Nivelul următor', 'Siguiente nivel', 'Next level'],
  again: ['Încă o dată', 'Otra vez', 'Play again'],
  toMap: ['Hartă', 'Mapa', 'Map'],
  q_picWord: ['Ce este în imagine?', '¿Qué hay en la imagen?', 'What is in the picture?'],
  q_wordPic: ['Găsește imaginea potrivită', 'Encuentra la imagen correcta', 'Find the matching picture'],
  q_first: ['Cu ce literă începe?', '¿Con qué letra empieza?', 'Which letter does it start with?'],
  q_missing: ['Ce literă lipsește?', '¿Qué letra falta?', 'Which letter is missing?'],
  q_spell: ['Scrie cuvântul', 'Escribe la palabra', 'Spell the word'],
  q_toen: ['Cum se spune în engleză?', '¿Cómo se dice en inglés?', 'How do you say it in English?'],
  q_toes: ['Cum se spune în spaniolă?', '¿Cómo se dice en español?', 'How do you say it in Spanish?'],
  q_count: ['Câte sunt?', '¿Cuántos hay?', 'How many are there?'],
  q_solve: ['Cât face?', '¿Cuánto es?', 'What is the answer?'],
  q_missNum: ['Ce număr lipsește?', '¿Qué número falta?', 'Which number is missing?'],
  q_biggest: ['Care număr este cel mai mare?', '¿Cuál es el número más grande?', 'Which number is the biggest?'],
  q_next: ['Ce urmează?', '¿Qué sigue?', 'What comes next?'],
  q_odd: ['Care nu se potrivește?', '¿Cuál no encaja?', 'Which one does not belong?'],
  q_memory: ['Găsește perechile', 'Encuentra las parejas', 'Find the pairs'],
  q_simon: ['Privește cu atenție…', 'Mira con atención…', 'Watch carefully…'],
  q_simonGo: ['Rândul tău! Repetă.', '¡Tu turno! Repite.', 'Your turn! Repeat it.'],
  q_habitat: ['Unde trăiește?', '¿Dónde vive?', 'Where does it live?'],
  q_eats: ['Ce îi place să mănânce?', '¿Qué le gusta comer?', 'What does it like to eat?'],
  q_legs: ['Câte picioare are?', '¿Cuántas patas tiene?', 'How many legs does it have?'],
  q_klass: ['Ce fel de animal este?', '¿Qué tipo de animal es?', 'What kind of animal is it?'],
  q_diet: ['Cum se hrănește?', '¿Cómo se alimenta?', 'How does it feed?'],
  q_puzzle: ['Refă imaginea', 'Arma la imagen', 'Rebuild the picture'],
  hint_puzzle: ['Atinge două piese ca să le schimbi între ele', 'Toca dos piezas para intercambiarlas', 'Tap two pieces to swap them'],
  hint_sling: ['Trage înapoi și dă drumul spre răspunsul corect', 'Tira hacia atrás y suelta hacia la respuesta correcta', 'Pull back and let go at the right answer'],
  hint_fly: ['Atinge ecranul ca să zbori în răspunsul corect', 'Toca la pantalla para volar hasta la respuesta correcta', 'Tap to fly into the right answer'],
  hint_slice: ['Taie cu gheara răspunsul corect', 'Corta con la garra la respuesta correcta', 'Slash the right answer with your claw'],
  hi5: ['Bate palma!', '¡Choca esos cinco!', 'High five!'],
  tickle: ['Pauză de gâdilat! Gâdilă-l pe pisic', '¡Pausa de cosquillas! Hazle cosquillas al gato', 'Tickle break! Tickle the cat'],
  pet: ['Pauză de mângâiat! Mângâie-l pe pisic', '¡Pausa de mimos! Acaricia al gato', 'Cuddle break! Pet the cat'],
  half: ['Jumătate din {0}', 'La mitad de {0}', 'Half of {0}'],
  dbl: ['Dublul lui {0}', 'El doble de {0}', 'Double {0}'],
  quarter: ['Un sfert din {0}', 'Un cuarto de {0}', 'A quarter of {0}'],
  h_sea: ['Mare', 'Mar', 'Sea'], h_farm: ['Fermă', 'Granja', 'Farm'], h_jungle: ['Savană și junglă', 'Sabana y selva', 'Savanna & jungle'],
  h_forest: ['Pădure', 'Bosque', 'Forest'], h_ice: ['Gheață', 'Hielo', 'Ice'],
  k_mammal: ['Mamifer', 'Mamífero', 'Mammal'], k_bird: ['Pasăre', 'Ave', 'Bird'], k_fish: ['Pește', 'Pez', 'Fish'],
  k_reptile: ['Reptilă', 'Reptil', 'Reptile'], k_insect: ['Insectă', 'Insecto', 'Insect'], k_amph: ['Amfibian', 'Anfibio', 'Amphibian'],
  d_h: ['Erbivor (plante)', 'Herbívoro (plantas)', 'Herbivore (plants)'], d_c: ['Carnivor (carne)', 'Carnívoro (carne)', 'Carnivore (meat)'], d_o: ['Omnivor (de toate)', 'Omnívoro (de todo)', 'Omnivore (both)'],
};
const PRAISE = [['Bravo!', 'Super!', 'Grozav!', 'Excelent!'], ['¡Bravo!', '¡Genial!', '¡Muy bien!', '¡Súper!'], ['Great!', 'Awesome!', 'Well done!', 'Super!']];
const li = () => LANGS.indexOf(S.lang);
const T = (k, ...a) => { let s = (STR[k] || [k, k, k])[li()]; a.forEach((v, i) => { s = s.replace('{' + i + '}', v); }); return s; };
const LNAME = { ro: 'Română', es: 'Español', en: 'English' };

/* ---------- content ---------- */
// [emoji, español, english, category]
const V = [
  ['🐶', 'perro', 'dog', 'a'], ['🐱', 'gato', 'cat', 'a'], ['🐴', 'caballo', 'horse', 'a'], ['🐮', 'vaca', 'cow', 'a'], ['🐷', 'cerdo', 'pig', 'a'],
  ['🐑', 'oveja', 'sheep', 'a'], ['🐔', 'gallina', 'hen', 'a'], ['🦆', 'pato', 'duck', 'a'], ['🐰', 'conejo', 'rabbit', 'a'], ['🐭', 'ratón', 'mouse', 'a'],
  ['🦁', 'león', 'lion', 'a'], ['🐘', 'elefante', 'elephant', 'a'], ['🐒', 'mono', 'monkey', 'a'], ['🦒', 'jirafa', 'giraffe', 'a'], ['🦓', 'cebra', 'zebra', 'a'],
  ['🐻', 'oso', 'bear', 'a'], ['🦊', 'zorro', 'fox', 'a'], ['🐺', 'lobo', 'wolf', 'a'], ['🐸', 'rana', 'frog', 'a'], ['🐢', 'tortuga', 'turtle', 'a'],
  ['🐍', 'serpiente', 'snake', 'a'], ['🐟', 'pez', 'fish', 'a'], ['🐬', 'delfín', 'dolphin', 'a'], ['🐋', 'ballena', 'whale', 'a'], ['🦈', 'tiburón', 'shark', 'a'],
  ['🐙', 'pulpo', 'octopus', 'a'], ['🦀', 'cangrejo', 'crab', 'a'], ['🦋', 'mariposa', 'butterfly', 'a'], ['🐝', 'abeja', 'bee', 'a'], ['🐜', 'hormiga', 'ant', 'a'],
  ['🦉', 'búho', 'owl', 'a'], ['🦅', 'águila', 'eagle', 'a'], ['🐧', 'pingüino', 'penguin', 'a'],
  ['🍎', 'manzana', 'apple', 'f'], ['🍌', 'plátano', 'banana', 'f'], ['🍊', 'naranja', 'orange', 'f'], ['🍓', 'fresa', 'strawberry', 'f'], ['🍇', 'uvas', 'grapes', 'f'],
  ['🍉', 'sandía', 'watermelon', 'f'], ['🍋', 'limón', 'lemon', 'f'], ['🥕', 'zanahoria', 'carrot', 'f'], ['🍅', 'tomate', 'tomato', 'f'], ['🍞', 'pan', 'bread', 'f'],
  ['🧀', 'queso', 'cheese', 'f'], ['🥚', 'huevo', 'egg', 'f'], ['🥛', 'leche', 'milk', 'f'],
  ['🏠', 'casa', 'house', 't'], ['🚗', 'coche', 'car', 't'], ['🚲', 'bicicleta', 'bicycle', 't'], ['✈️', 'avión', 'plane', 't'], ['🚂', 'tren', 'train', 't'],
  ['⛵', 'barco', 'boat', 't'], ['📖', 'libro', 'book', 't'], ['✏️', 'lápiz', 'pencil', 't'], ['🔑', 'llave', 'key', 't'], ['⚽', 'pelota', 'ball', 't'],
  ['🎈', 'globo', 'balloon', 't'], ['⏰', 'reloj', 'clock', 't'], ['👟', 'zapato', 'shoe', 't'], ['🎩', 'sombrero', 'hat', 't'],
  ['☀️', 'sol', 'sun', 'n'], ['🌙', 'luna', 'moon', 'n'], ['⭐', 'estrella', 'star', 'n'], ['☁️', 'nube', 'cloud', 'n'], ['🌧️', 'lluvia', 'rain', 'n'],
  ['🌳', 'árbol', 'tree', 'n'], ['🌸', 'flor', 'flower', 'n'], ['🔥', 'fuego', 'fire', 'n'], ['🌈', 'arcoíris', 'rainbow', 'n'], ['⛰️', 'montaña', 'mountain', 'n'], ['❄️', 'nieve', 'snow', 'n'],
  ['🐯', 'tigre', 'tiger', 'a'], ['🦌', 'ciervo', 'deer', 'a'], ['🐿️', 'ardilla', 'squirrel', 'a'], ['🦔', 'erizo', 'hedgehog', 'a'], ['🐊', 'cocodrilo', 'crocodile', 'a'],
  ['🦜', 'loro', 'parrot', 'a'], ['🦢', 'cisne', 'swan', 'a'], ['🐌', 'caracol', 'snail', 'a'], ['🐞', 'mariquita', 'ladybug', 'a'], ['🕷️', 'araña', 'spider', 'a'],
  ['🦇', 'murciélago', 'bat', 'a'], ['🐫', 'camello', 'camel', 'a'], ['🦘', 'canguro', 'kangaroo', 'a'], ['🐐', 'cabra', 'goat', 'a'], ['🦃', 'pavo', 'turkey', 'a'],
  ['🦭', 'foca', 'seal', 'a'], ['🐛', 'oruga', 'caterpillar', 'a'], ['🦩', 'flamenco', 'flamingo', 'a'], ['🦏', 'rinoceronte', 'rhino', 'a'], ['🦛', 'hipopótamo', 'hippo', 'a'], ['🐆', 'leopardo', 'leopard', 'a'],
  ['🍐', 'pera', 'pear', 'f'], ['🍑', 'melocotón', 'peach', 'f'], ['🍒', 'cerezas', 'cherries', 'f'], ['🍍', 'piña', 'pineapple', 'f'], ['🥥', 'coco', 'coconut', 'f'],
  ['🌽', 'maíz', 'corn', 'f'], ['🥔', 'patata', 'potato', 'f'], ['🧅', 'cebolla', 'onion', 'f'], ['🥒', 'pepino', 'cucumber', 'f'], ['🍄', 'seta', 'mushroom', 'f'],
  ['🍚', 'arroz', 'rice', 'f'], ['🍰', 'tarta', 'cake', 'f'], ['🍪', 'galleta', 'cookie', 'f'], ['🍯', 'miel', 'honey', 'f'], ['🧃', 'zumo', 'juice', 'f'],
  ['🥣', 'sopa', 'soup', 'f'], ['🧂', 'sal', 'salt', 'f'], ['🍗', 'pollo', 'chicken', 'f'],
  ['🚌', 'autobús', 'bus', 't'], ['🚀', 'cohete', 'rocket', 't'], ['🚁', 'helicóptero', 'helicopter', 't'], ['🛏️', 'cama', 'bed', 't'], ['🪑', 'silla', 'chair', 't'],
  ['🚪', 'puerta', 'door', 't'], ['📱', 'teléfono', 'phone', 't'], ['🎁', 'regalo', 'gift', 't'], ['✂️', 'tijeras', 'scissors', 't'], ['🔔', 'campana', 'bell', 't'],
  ['🕯️', 'vela', 'candle', 't'], ['☂️', 'paraguas', 'umbrella', 't'], ['👓', 'gafas', 'glasses', 't'], ['🎸', 'guitarra', 'guitar', 't'], ['🥁', 'tambor', 'drum', 't'],
  ['🎒', 'mochila', 'backpack', 't'], ['👕', 'camiseta', 'shirt', 't'], ['🧦', 'calcetín', 'sock', 't'], ['👗', 'vestido', 'dress', 't'], ['🧤', 'guante', 'glove', 't'],
  ['🥄', 'cuchara', 'spoon', 't'], ['🍴', 'tenedor', 'fork', 't'], ['🔨', 'martillo', 'hammer', 't'], ['🧹', 'escoba', 'broom', 't'], ['📷', 'cámara', 'camera', 't'],
  ['👑', 'corona', 'crown', 't'], ['💍', 'anillo', 'ring', 't'], ['💻', 'ordenador', 'computer', 't'], ['🗺️', 'mapa', 'map', 't'], ['🏆', 'trofeo', 'trophy', 't'],
  ['🌊', 'ola', 'wave', 'n'], ['🌋', 'volcán', 'volcano', 'n'], ['🏝️', 'isla', 'island', 'n'], ['🍃', 'hoja', 'leaf', 'n'], ['🌱', 'planta', 'plant', 'n'],
  ['🌻', 'girasol', 'sunflower', 'n'], ['🌹', 'rosa', 'rose', 'n'], ['⚡', 'rayo', 'lightning', 'n'], ['💨', 'viento', 'wind', 'n'], ['🏖️', 'playa', 'beach', 'n'],
  ['🏜️', 'desierto', 'desert', 'n'], ['💧', 'gota', 'drop', 'n'], ['🧊', 'hielo', 'ice', 'n'],
];
const ABC = { es: 'ABCDEFGHIJLMNÑOPQRSTUVZ', en: 'ABCDEFGHIJKLMNOPRSTUVWY' };
const GROUPS = {
  farm: W('🐮 🐷 🐑 🐴 🐰 🐔 🐐'), wild: W('🦁 🐘 🐒 🦒 🦓 🐻 🐯 🦏'), sea: W('🐟 🐬 🐋 🦈 🐙 🦀 🐠 🦑'), birds: W('🦉 🦅 🦜 🐦 🦢 🦩 🦆'), insects: W('🦋 🐝 🐜 🐞 🦗 🦟'),
  fruit: W('🍎 🍌 🍊 🍓 🍇 🍉 🍋 🍐 🍒 🍍 🍑'), veg: W('🥕 🍅 🥦 🌽 🥒 🥔 🧅 🌶️'), vehicles: W('🚗 🚲 ✈️ 🚂 ⛵ 🚌 🚀 🚁 🚜'), clothes: W('👟 🎩 👕 🧦 👗 🧤 🧣 👖'), sky: W('☀️ 🌙 ⭐ ☁️ 🌈 ⚡ ☄️'),
  music: W('🎸 🥁 🎹 🎺 🎻'), sports: W('⚽ 🏀 🎾 🏈 🏐'), sweets: W('🍰 🍪 🍫 🍭 🍩'),
};
const FAR_PAIRS = [['fruit', 'vehicles'], ['farm', 'sky'], ['clothes', 'fruit'], ['sea', 'vehicles'], ['wild', 'veg'], ['insects', 'clothes'], ['sky', 'veg'], ['birds', 'fruit'], ['music', 'farm'], ['sports', 'veg'], ['sweets', 'vehicles'], ['music', 'sea'], ['sports', 'insects'], ['sweets', 'wild'], ['clothes', 'birds'], ['vehicles', 'insects']];
const NEAR_PAIRS = [['sea', 'wild'], ['fruit', 'veg'], ['insects', 'birds'], ['sea', 'farm'], ['birds', 'wild'], ['vehicles', 'clothes'], ['fruit', 'sweets'], ['music', 'sports'], ['farm', 'wild'], ['insects', 'sea']];
const SHAPES = W('🔴 🔵 ⭐ 💚 🌙 🔺 🍋 🌸');
const HAB = { sea: ['🌊', W('🐟 🐬 🐋 🦈 🐙 🦀 🐠 🦑 🦞')], farm: ['🚜', W('🐮 🐷 🐑 🐔 🐴 🐐 🦃')], jungle: ['🌴', W('🦁 🐘 🐒 🦒 🦓 🐯 🦏 🦛 🦜 🐆')], forest: ['🌲', W('🐻 🦊 🐺 🦉 🦌 🐿️ 🦔 🐗 🦝')], ice: ['❄️', W('🐧 🦭')] };
const EATS = [['🐰', '🥕'], ['🐒', '🍌'], ['🐝', '🌸'], ['🐭', '🧀'], ['🐼', '🎋'], ['🐿️', '🌰'], ['🐶', '🦴'], ['🐱', '🐟'], ['🐮', '🌿'], ['🐻', '🍯'], ['🐸', '🦟'], ['🐴', '🍎'], ['🐘', '🥜'], ['🐔', '🌽'], ['🐦', '🐛'], ['🦔', '🐌'], ['🐷', '🥔'], ['🐢', '🥬'], ['🐋', '🦐'], ['🐹', '🌻']];
const LEGS = [['🐶', 4], ['🐔', 2], ['🐝', 6], ['🕷️', 8], ['🐍', 0], ['🐜', 6], ['🦆', 2], ['🐴', 4], ['🐟', 0], ['🐘', 4], ['🦋', 6], ['🐧', 2], ['🐱', 4], ['🐮', 4], ['🐞', 6], ['🦅', 2], ['🐸', 4], ['🐢', 4], ['🐬', 0], ['🐌', 0], ['🦉', 2], ['🐙', 8], ['🦒', 4], ['🐊', 4], ['🦟', 6], ['🦈', 0], ['🦜', 2], ['🐰', 4]];
const KLASS = { mammal: W('🐶 🐘 🐒 🐻 🐬 🐋 🦇 🐱 🐴 🐮 🦁 🐰 🦊'), bird: W('🦅 🦉 🐔 🦆 🐧 🦜 🦢 🦩 🐦'), fish: W('🦈 🐟 🐠 🐡'), reptile: W('🐍 🐢 🐊 🦎'), insect: W('🦋 🐝 🐜 🐞 🦟 🦗'), amph: W('🐸') };
const KLASS_HARD = W('🐬 🐋 🦇 🐧');
const DIET = { h: W('🐮 🐰 🦒 🐘 🦓 🐑 🐴 🐐 🦌 🦏 🦛 🐨 🐼'), c: W('🦁 🦈 🦅 🐺 🐊 🐍 🐯 🐆 🦉 🐬'), o: W('🐻 🐷 🐔 🐒 🐭 🦝 🐗') };
const DIET_ICON = { h: '🌿', c: '🍖', o: '🍽️' };
// [level, question, options — the first option is the correct one]
const N3 = (...a) => a.map(x => [String(x), String(x), String(x)]);
const FACTS = [
  [1, ['Ce fac albinele?', '¿Qué fabrican las abejas?', 'What do bees make?'], [['Miere', 'Miel', 'Honey'], ['Lapte', 'Leche', 'Milk'], ['Lână', 'Lana', 'Wool'], ['Mătase', 'Seda', 'Silk']]],
  [1, ['Ce devine o omidă?', '¿En qué se convierte una oruga?', 'What does a caterpillar become?'], [['Fluture', 'Mariposa', 'Butterfly'], ['Albină', 'Abeja', 'Bee'], ['Păianjen', 'Araña', 'Spider'], ['Pasăre', 'Pájaro', 'Bird']]],
  [1, ['Cum se numește apa înghețată?', '¿Cómo se llama el agua congelada?', 'What is frozen water called?'], [['Gheață', 'Hielo', 'Ice'], ['Abur', 'Vapor', 'Steam'], ['Nisip', 'Arena', 'Sand'], ['Sare', 'Sal', 'Salt']]],
  [1, ['Ce anotimp vine după iarnă?', '¿Qué estación viene después del invierno?', 'Which season comes after winter?'], [['Primăvara', 'La primavera', 'Spring'], ['Vara', 'El verano', 'Summer'], ['Toamna', 'El otoño', 'Autumn']]],
  [1, ['Ce parte a copacului stă sub pământ?', '¿Qué parte del árbol está bajo tierra?', 'Which part of a tree is underground?'], [['Rădăcinile', 'Las raíces', 'The roots'], ['Frunzele', 'Las hojas', 'The leaves'], ['Florile', 'Las flores', 'The flowers'], ['Fructele', 'Los frutos', 'The fruit']]],
  [1, ['De ce au nevoie plantele ca să crească?', '¿Qué necesitan las plantas para crecer?', 'What do plants need to grow?'], [['Apă și lumină', 'Agua y luz', 'Water and light'], ['Întuneric', 'Oscuridad', 'Darkness'], ['Gheață', 'Hielo', 'Ice'], ['Zgomot', 'Ruido', 'Noise']]],
  [1, ['Ce se învârte în jurul Pământului?', '¿Qué gira alrededor de la Tierra?', 'What goes around the Earth?'], [['Luna', 'La Luna', 'The Moon'], ['Soarele', 'El Sol', 'The Sun'], ['Marte', 'Marte', 'Mars'], ['Jupiter', 'Júpiter', 'Jupiter']]],
  [2, ['Care este cea mai mare planetă din sistemul solar?', '¿Cuál es el planeta más grande del sistema solar?', 'Which is the largest planet in the solar system?'], [['Jupiter', 'Júpiter', 'Jupiter'], ['Pământ', 'La Tierra', 'Earth'], ['Marte', 'Marte', 'Mars'], ['Venus', 'Venus', 'Venus']]],
  [2, ['Câte planete are sistemul solar?', '¿Cuántos planetas tiene el sistema solar?', 'How many planets are in the solar system?'], [['8', '8', '8'], ['7', '7', '7'], ['9', '9', '9'], ['10', '10', '10']]],
  [2, ['Ce organ pompează sângele în corp?', '¿Qué órgano bombea la sangre por el cuerpo?', 'Which organ pumps blood around the body?'], [['Inima', 'El corazón', 'The heart'], ['Plămânii', 'Los pulmones', 'The lungs'], ['Stomacul', 'El estómago', 'The stomach'], ['Creierul', 'El cerebro', 'The brain']]],
  [2, ['Care este cel mai mare animal de pe Pământ?', '¿Cuál es el animal más grande de la Tierra?', 'Which is the largest animal on Earth?'], [['Balena albastră', 'La ballena azul', 'The blue whale'], ['Elefantul', 'El elefante', 'The elephant'], ['Girafa', 'La jirafa', 'The giraffe'], ['Rechinul alb', 'El tiburón blanco', 'The white shark']]],
  [2, ['Ce gaz respirăm ca să trăim?', '¿Qué gas respiramos para vivir?', 'Which gas do we breathe to live?'], [['Oxigen', 'Oxígeno', 'Oxygen'], ['Heliu', 'Helio', 'Helium'], ['Abur', 'Vapor', 'Steam'], ['Fum', 'Humo', 'Smoke']]],
  [2, ['Care mamifer poate zbura?', '¿Qué mamífero puede volar?', 'Which mammal can fly?'], [['Liliacul', 'El murciélago', 'The bat'], ['Vulturul', 'El águila', 'The eagle'], ['Bufnița', 'El búho', 'The owl'], ['Fluturele', 'La mariposa', 'The butterfly']]],
  [2, ['Câte picioare are un păianjen?', '¿Cuántas patas tiene una araña?', 'How many legs does a spider have?'], [['8', '8', '8'], ['6', '6', '6'], ['4', '4', '4'], ['10', '10', '10']]],
  [2, ['Care este cea mai apropiată stea de Pământ?', '¿Cuál es la estrella más cercana a la Tierra?', 'Which star is closest to Earth?'], [['Soarele', 'El Sol', 'The Sun'], ['Luna', 'La Luna', 'The Moon'], ['Steaua Polară', 'La Estrella Polar', 'The North Star'], ['Marte', 'Marte', 'Mars']]],
  [2, ['În ce se transformă apa când fierbe?', '¿En qué se convierte el agua cuando hierve?', 'What does water turn into when it boils?'], [['Abur', 'Vapor', 'Steam'], ['Gheață', 'Hielo', 'Ice'], ['Zăpadă', 'Nieve', 'Snow'], ['Nisip', 'Arena', 'Sand']]],
  [2, ['Care planetă este numită Planeta Roșie?', '¿A qué planeta se le llama el Planeta Rojo?', 'Which planet is called the Red Planet?'], [['Marte', 'Marte', 'Mars'], ['Venus', 'Venus', 'Venus'], ['Saturn', 'Saturno', 'Saturn'], ['Neptun', 'Neptuno', 'Neptune']]],
  [1, ['Câte zile are o săptămână?', '¿Cuántos días tiene una semana?', 'How many days are in a week?'], N3(7, 5, 6, 10)],
  [1, ['Câte anotimpuri are un an?', '¿Cuántas estaciones tiene un año?', 'How many seasons are in a year?'], N3(4, 2, 3, 5)],
  [1, ['Câte luni are un an?', '¿Cuántos meses tiene un año?', 'How many months are in a year?'], N3(12, 10, 7, 24)],
  [1, ['Câte ore are o zi?', '¿Cuántas horas tiene un día?', 'How many hours are in a day?'], N3(24, 12, 10, 60)],
  [1, ['Câte minute are o oră?', '¿Cuántos minutos tiene una hora?', 'How many minutes are in an hour?'], N3(60, 100, 30, 24)],
  [1, ['Câte degete avem la o mână?', '¿Cuántos dedos tenemos en una mano?', 'How many fingers are on one hand?'], N3(5, 4, 6, 10)],
  [1, ['Câte culori are curcubeul?', '¿Cuántos colores tiene el arcoíris?', 'How many colours are in a rainbow?'], N3(7, 3, 5, 10)],
  [1, ['Câte laturi are un triunghi?', '¿Cuántos lados tiene un triángulo?', 'How many sides does a triangle have?'], N3(3, 4, 5, 6)],
  [1, ['Câte laturi are un pătrat?', '¿Cuántos lados tiene un cuadrado?', 'How many sides does a square have?'], N3(4, 3, 5, 6)],
  [1, ['Câte roți are o bicicletă?', '¿Cuántas ruedas tiene una bicicleta?', 'How many wheels does a bicycle have?'], N3(2, 3, 4, 1)],
  [1, ['Ce animal ne dă lapte?', '¿Qué animal nos da leche?', 'Which animal gives us milk?'], [['Vaca', 'La vaca', 'The cow'], ['Găina', 'La gallina', 'The hen'], ['Calul', 'El caballo', 'The horse'], ['Pisica', 'El gato', 'The cat']]],
  [1, ['Ce animal face ouă?', '¿Qué animal pone huevos?', 'Which animal lays eggs?'], [['Găina', 'La gallina', 'The hen'], ['Vaca', 'La vaca', 'The cow'], ['Câinele', 'El perro', 'The dog'], ['Oaia', 'La oveja', 'The sheep']]],
  [1, ['Ce animal ne dă lână?', '¿Qué animal nos da lana?', 'Which animal gives us wool?'], [['Oaia', 'La oveja', 'The sheep'], ['Porcul', 'El cerdo', 'The pig'], ['Rața', 'El pato', 'The duck'], ['Câinele', 'El perro', 'The dog']]],
  [1, ['Cum se numește puiul câinelui?', '¿Cómo se llama la cría del perro?', 'What is a baby dog called?'], [['Cățel', 'Cachorro', 'Puppy'], ['Pisoi', 'Gatito', 'Kitten'], ['Mânz', 'Potro', 'Foal'], ['Vițel', 'Ternero', 'Calf']]],
  [1, ['Cum se numește puiul pisicii?', '¿Cómo se llama la cría del gato?', 'What is a baby cat called?'], [['Pisoi', 'Gatito', 'Kitten'], ['Cățel', 'Cachorro', 'Puppy'], ['Miel', 'Cordero', 'Lamb'], ['Vițel', 'Ternero', 'Calf']]],
  [1, ['Ce culoare iese din galben și albastru?', '¿Qué color sale de mezclar amarillo y azul?', 'Which colour do yellow and blue make?'], [['Verde', 'Verde', 'Green'], ['Roșu', 'Rojo', 'Red'], ['Mov', 'Morado', 'Purple'], ['Portocaliu', 'Naranja', 'Orange']]],
  [1, ['Ce culoare iese din roșu și galben?', '¿Qué color sale de mezclar rojo y amarillo?', 'Which colour do red and yellow make?'], [['Portocaliu', 'Naranja', 'Orange'], ['Verde', 'Verde', 'Green'], ['Albastru', 'Azul', 'Blue'], ['Mov', 'Morado', 'Purple']]],
  [1, ['Ce culoare iese din roșu și albastru?', '¿Qué color sale de mezclar rojo y azul?', 'Which colour do red and blue make?'], [['Mov', 'Morado', 'Purple'], ['Verde', 'Verde', 'Green'], ['Portocaliu', 'Naranja', 'Orange'], ['Galben', 'Amarillo', 'Yellow']]],
  [1, ['Ce apare pe cer când plouă și e soare?', '¿Qué aparece en el cielo cuando llueve y hace sol?', 'What appears in the sky when it rains and the sun shines?'], [['Curcubeul', 'El arcoíris', 'A rainbow'], ['Luna', 'La luna', 'The moon'], ['Zăpada', 'La nieve', 'Snow'], ['Ceața', 'La niebla', 'Fog']]],
  [1, ['Când vedem stelele pe cer?', '¿Cuándo vemos las estrellas en el cielo?', 'When do we see stars in the sky?'], [['Noaptea', 'Por la noche', 'At night'], ['La prânz', 'Al mediodía', 'At noon'], ['Dimineața', 'Por la mañana', 'In the morning']]],
  [1, ['Care anotimp este cel mai cald?', '¿Cuál es la estación más calurosa?', 'Which season is the hottest?'], [['Vara', 'El verano', 'Summer'], ['Iarna', 'El invierno', 'Winter'], ['Toamna', 'El otoño', 'Autumn'], ['Primăvara', 'La primavera', 'Spring']]],
  [1, ['În ce anotimp cad frunzele din copaci?', '¿En qué estación se caen las hojas de los árboles?', 'In which season do leaves fall from the trees?'], [['Toamna', 'En otoño', 'Autumn'], ['Vara', 'En verano', 'Summer'], ['Primăvara', 'En primavera', 'Spring']]],
  [1, ['În ce anotimp ninge?', '¿En qué estación nieva?', 'In which season does it snow?'], [['Iarna', 'En invierno', 'Winter'], ['Vara', 'En verano', 'Summer'], ['Toamna', 'En otoño', 'Autumn']]],
  [1, ['Cu ce auzim?', '¿Con qué oímos?', 'What do we hear with?'], [['Cu urechile', 'Con las orejas', 'Our ears'], ['Cu ochii', 'Con los ojos', 'Our eyes'], ['Cu nasul', 'Con la nariz', 'Our nose'], ['Cu limba', 'Con la lengua', 'Our tongue']]],
  [1, ['Cu ce mirosim?', '¿Con qué olemos?', 'What do we smell with?'], [['Cu nasul', 'Con la nariz', 'Our nose'], ['Cu urechile', 'Con las orejas', 'Our ears'], ['Cu ochii', 'Con los ojos', 'Our eyes'], ['Cu mâinile', 'Con las manos', 'Our hands']]],
  [1, ['Cu ce simțim gustul?', '¿Con qué notamos el sabor?', 'What do we taste with?'], [['Cu limba', 'Con la lengua', 'Our tongue'], ['Cu nasul', 'Con la nariz', 'Our nose'], ['Cu urechile', 'Con las orejas', 'Our ears'], ['Cu ochii', 'Con los ojos', 'Our eyes']]],
  [1, ['Ce pasăre nu poate zbura?', '¿Qué ave no puede volar?', 'Which bird cannot fly?'], [['Pinguinul', 'El pingüino', 'The penguin'], ['Vulturul', 'El águila', 'The eagle'], ['Rândunica', 'La golondrina', 'The swallow'], ['Porumbelul', 'La paloma', 'The pigeon']]],
  [1, ['Care animal are gâtul cel mai lung?', '¿Qué animal tiene el cuello más largo?', 'Which animal has the longest neck?'], [['Girafa', 'La jirafa', 'The giraffe'], ['Elefantul', 'El elefante', 'The elephant'], ['Zebra', 'La cebra', 'The zebra'], ['Leul', 'El león', 'The lion']]],
  [1, ['Care animal are trompă?', '¿Qué animal tiene trompa?', 'Which animal has a trunk?'], [['Elefantul', 'El elefante', 'The elephant'], ['Girafa', 'La jirafa', 'The giraffe'], ['Calul', 'El caballo', 'The horse'], ['Ursul', 'El oso', 'The bear']]],
  [1, ['Care animal are dungi albe și negre?', '¿Qué animal tiene rayas blancas y negras?', 'Which animal has black and white stripes?'], [['Zebra', 'La cebra', 'The zebra'], ['Leul', 'El león', 'The lion'], ['Girafa', 'La jirafa', 'The giraffe'], ['Ursul brun', 'El oso pardo', 'The brown bear']]],
  [1, ['Care animal are cocoașă?', '¿Qué animal tiene joroba?', 'Which animal has a hump?'], [['Cămila', 'El camello', 'The camel'], ['Calul', 'El caballo', 'The horse'], ['Vaca', 'La vaca', 'The cow'], ['Capra', 'La cabra', 'The goat']]],
  [1, ['Unde trăiesc peștii?', '¿Dónde viven los peces?', 'Where do fish live?'], [['În apă', 'En el agua', 'In water'], ['În copaci', 'En los árboles', 'In trees'], ['În nisip', 'En la arena', 'In sand'], ['În nori', 'En las nubes', 'In clouds']]],
  [1, ['Ce animal își duce casa în spate?', '¿Qué animal lleva su casa a cuestas?', 'Which animal carries its home on its back?'], [['Melcul', 'El caracol', 'The snail'], ['Fluturele', 'La mariposa', 'The butterfly'], ['Șoarecele', 'El ratón', 'The mouse'], ['Vrabia', 'El gorrión', 'The sparrow']]],
  [1, ['Ce ne dă lumină și căldură ziua?', '¿Qué nos da luz y calor durante el día?', 'What gives us light and warmth in the daytime?'], [['Soarele', 'El Sol', 'The Sun'], ['Luna', 'La Luna', 'The Moon'], ['Stelele', 'Las estrellas', 'The stars'], ['Norii', 'Las nubes', 'The clouds']]],
  [1, ['De unde cade ploaia?', '¿De dónde cae la lluvia?', 'Where does rain fall from?'], [['Din nori', 'De las nubes', 'From clouds'], ['Din soare', 'Del sol', 'From the sun'], ['Din lună', 'De la luna', 'From the moon'], ['Din stele', 'De las estrellas', 'From the stars']]],
  [1, ['Ce formă are o minge?', '¿Qué forma tiene una pelota?', 'What shape is a ball?'], [['Rotundă', 'Redonda', 'Round'], ['Pătrată', 'Cuadrada', 'Square'], ['Triunghiulară', 'Triangular', 'Triangular']]],
  [1, ['Ce culoare a semaforului înseamnă „stai”?', '¿Qué color del semáforo significa «para»?', 'Which traffic light colour means "stop"?'], [['Roșu', 'Rojo', 'Red'], ['Verde', 'Verde', 'Green'], ['Albastru', 'Azul', 'Blue']]],
  [1, ['Ce insectă luminează noaptea?', '¿Qué insecto brilla por la noche?', 'Which insect glows at night?'], [['Licuriciul', 'La luciérnaga', 'The firefly'], ['Albina', 'La abeja', 'The bee'], ['Furnica', 'La hormiga', 'The ant'], ['Musca', 'La mosca', 'The fly']]],
  [1, ['Ce animal doarme toată iarna?', '¿Qué animal duerme todo el invierno?', 'Which animal sleeps all winter?'], [['Ursul', 'El oso', 'The bear'], ['Lupul', 'El lobo', 'The wolf'], ['Vulpea', 'El zorro', 'The fox'], ['Calul', 'El caballo', 'The horse']]],
  [1, ['Ce animal sare și își poartă puiul în marsupiu?', '¿Qué animal salta y lleva a su cría en una bolsa?', 'Which animal hops and carries its baby in a pouch?'], [['Cangurul', 'El canguro', 'The kangaroo'], ['Leul', 'El león', 'The lion'], ['Zebra', 'La cebra', 'The zebra'], ['Cămila', 'El camello', 'The camel']]],
  [1, ['Din ce se face pâinea?', '¿De qué se hace el pan?', 'What is bread made from?'], [['Din făină', 'De harina', 'Flour'], ['Din nisip', 'De arena', 'Sand'], ['Din lapte', 'De leche', 'Milk'], ['Din lemn', 'De madera', 'Wood']]],
  [1, ['Ce pasăre ne trezește dimineața cu cântecul ei?', '¿Qué ave nos despierta por la mañana con su canto?', 'Which bird wakes us up in the morning?'], [['Cocoșul', 'El gallo', 'The rooster'], ['Bufnița', 'El búho', 'The owl'], ['Rața', 'El pato', 'The duck'], ['Pinguinul', 'El pingüino', 'The penguin']]],
  [1, ['Ce pasăre stă trează noaptea?', '¿Qué ave está despierta por la noche?', 'Which bird stays awake at night?'], [['Bufnița', 'El búho', 'The owl'], ['Găina', 'La gallina', 'The hen'], ['Rândunica', 'La golondrina', 'The swallow'], ['Rața', 'El pato', 'The duck']]],
  [1, ['Ce plantă are țepi și trăiește în deșert?', '¿Qué planta tiene pinchos y vive en el desierto?', 'Which plant has spines and lives in the desert?'], [['Cactusul', 'El cactus', 'The cactus'], ['Laleaua', 'El tulipán', 'The tulip'], ['Bradul', 'El abeto', 'The fir tree'], ['Trifoiul', 'El trébol', 'Clover']]],
  [1, ['Ce copac rămâne verde și iarna?', '¿Qué árbol sigue verde en invierno?', 'Which tree stays green in winter?'], [['Bradul', 'El abeto', 'The fir tree'], ['Mărul', 'El manzano', 'The apple tree'], ['Stejarul', 'El roble', 'The oak'], ['Cireșul', 'El cerezo', 'The cherry tree']]],
  [1, ['Care este cel mai mare animal de pe uscat?', '¿Cuál es el animal terrestre más grande?', 'Which is the largest land animal?'], [['Elefantul', 'El elefante', 'The elephant'], ['Girafa', 'La jirafa', 'The giraffe'], ['Ursul', 'El oso', 'The bear'], ['Calul', 'El caballo', 'The horse']]],
  [1, ['Pe ce planetă trăim?', '¿En qué planeta vivimos?', 'Which planet do we live on?'], [['Pământ', 'La Tierra', 'Earth'], ['Marte', 'Marte', 'Mars'], ['Jupiter', 'Júpiter', 'Jupiter'], ['Saturn', 'Saturno', 'Saturn']]],
  [1, ['Ce animal doarme atârnat cu capul în jos?', '¿Qué animal duerme colgado boca abajo?', 'Which animal sleeps hanging upside down?'], [['Liliacul', 'El murciélago', 'The bat'], ['Bufnița', 'El búho', 'The owl'], ['Veverița', 'La ardilla', 'The squirrel'], ['Ariciul', 'El erizo', 'The hedgehog']]],
  [2, ['Care este cel mai rapid animal de pe uscat?', '¿Cuál es el animal terrestre más rápido?', 'Which is the fastest land animal?'], [['Ghepardul', 'El guepardo', 'The cheetah'], ['Leul', 'El león', 'The lion'], ['Calul', 'El caballo', 'The horse'], ['Antilopa', 'El antílope', 'The antelope']]],
  [2, ['Care este cel mai înalt animal?', '¿Cuál es el animal más alto?', 'Which is the tallest animal?'], [['Girafa', 'La jirafa', 'The giraffe'], ['Elefantul', 'El elefante', 'The elephant'], ['Struțul', 'El avestruz', 'The ostrich'], ['Cămila', 'El camello', 'The camel']]],
  [2, ['Care este cea mai mare pasăre?', '¿Cuál es el ave más grande?', 'Which is the largest bird?'], [['Struțul', 'El avestruz', 'The ostrich'], ['Vulturul', 'El águila', 'The eagle'], ['Lebăda', 'El cisne', 'The swan'], ['Pinguinul', 'El pingüino', 'The penguin']]],
  [2, ['Care este cel mai înalt munte din lume?', '¿Cuál es la montaña más alta del mundo?', 'Which is the highest mountain in the world?'], N3('Everest', 'Mont Blanc', 'Kilimanjaro', 'Aconcagua')],
  [2, ['Care este cel mai mare ocean?', '¿Cuál es el océano más grande?', 'Which is the largest ocean?'], [['Pacific', 'El Pacífico', 'The Pacific'], ['Atlantic', 'El Atlántico', 'The Atlantic'], ['Indian', 'El Índico', 'The Indian'], ['Arctic', 'El Ártico', 'The Arctic']]],
  [2, ['Care este cel mai mare deșert cald?', '¿Cuál es el desierto cálido más grande?', 'Which is the largest hot desert?'], N3('Sahara', 'Gobi', 'Kalahari', 'Atacama')],
  [2, ['În ce țară trăiesc cangurii în sălbăticie?', '¿En qué país viven los canguros en libertad?', 'In which country do kangaroos live in the wild?'], [['Australia', 'Australia', 'Australia'], ['Brazilia', 'Brasil', 'Brazil'], ['India', 'India', 'India'], ['Canada', 'Canadá', 'Canada']]],
  [2, ['Pe ce continent se află Egiptul?', '¿En qué continente está Egipto?', 'On which continent is Egypt?'], [['Africa', 'África', 'Africa'], ['Asia', 'Asia', 'Asia'], ['Europa', 'Europa', 'Europe'], ['America', 'América', 'America']]],
  [2, ['Care este cel mai rece continent?', '¿Cuál es el continente más frío?', 'Which is the coldest continent?'], [['Antarctica', 'La Antártida', 'Antarctica'], ['Europa', 'Europa', 'Europe'], ['Asia', 'Asia', 'Asia'], ['Africa', 'África', 'Africa']]],
  [2, ['Care este cea mai mare țară din lume?', '¿Cuál es el país más grande del mundo?', 'Which is the largest country in the world?'], [['Rusia', 'Rusia', 'Russia'], ['China', 'China', 'China'], ['Canada', 'Canadá', 'Canada'], ['Brazilia', 'Brasil', 'Brazil']]],
  [2, ['Care este capitala Spaniei?', '¿Cuál es la capital de España?', 'What is the capital of Spain?'], N3('Madrid', 'Barcelona', 'Sevilla', 'Valencia')],
  [2, ['Care este capitala României?', '¿Cuál es la capital de Rumanía?', 'What is the capital of Romania?'], [['București', 'Bucarest', 'Bucharest'], ['Cluj-Napoca', 'Cluj-Napoca', 'Cluj-Napoca'], ['Iași', 'Iași', 'Iași'], ['Timișoara', 'Timișoara', 'Timișoara']]],
  [2, ['Care este capitala Franței?', '¿Cuál es la capital de Francia?', 'What is the capital of France?'], [['Paris', 'París', 'Paris'], ['Lyon', 'Lyon', 'Lyon'], ['Marsilia', 'Marsella', 'Marseille'], ['Nisa', 'Niza', 'Nice']]],
  [2, ['Care este capitala Italiei?', '¿Cuál es la capital de Italia?', 'What is the capital of Italy?'], [['Roma', 'Roma', 'Rome'], ['Milano', 'Milán', 'Milan'], ['Veneția', 'Venecia', 'Venice'], ['Napoli', 'Nápoles', 'Naples']]],
  [2, ['Care este capitala Regatului Unit?', '¿Cuál es la capital del Reino Unido?', 'What is the capital of the United Kingdom?'], [['Londra', 'Londres', 'London'], ['Manchester', 'Mánchester', 'Manchester'], ['Liverpool', 'Liverpool', 'Liverpool'], ['Edinburgh', 'Edimburgo', 'Edinburgh']]],
  [2, ['În ce țară se află piramidele din Giza?', '¿En qué país están las pirámides de Guiza?', 'In which country are the pyramids of Giza?'], [['Egipt', 'Egipto', 'Egypt'], ['Mexic', 'México', 'Mexico'], ['Grecia', 'Grecia', 'Greece'], ['India', 'India', 'India']]],
  [2, ['Ce limbă se vorbește în Brazilia?', '¿Qué idioma se habla en Brasil?', 'Which language is spoken in Brazil?'], [['Portugheza', 'Portugués', 'Portuguese'], ['Spaniola', 'Español', 'Spanish'], ['Engleza', 'Inglés', 'English'], ['Franceza', 'Francés', 'French']]],
  [2, ['Care planetă este cea mai apropiată de Soare?', '¿Qué planeta está más cerca del Sol?', 'Which planet is closest to the Sun?'], [['Mercur', 'Mercurio', 'Mercury'], ['Venus', 'Venus', 'Venus'], ['Marte', 'Marte', 'Mars'], ['Pământ', 'La Tierra', 'Earth']]],
  [2, ['Care planetă are inele mari, ușor de văzut?', '¿Qué planeta tiene grandes anillos fáciles de ver?', 'Which planet has big rings that are easy to see?'], [['Saturn', 'Saturno', 'Saturn'], ['Marte', 'Marte', 'Mars'], ['Venus', 'Venus', 'Venus'], ['Mercur', 'Mercurio', 'Mercury']]],
  [2, ['În cât timp ocolește Pământul Soarele?', '¿Cuánto tarda la Tierra en dar una vuelta al Sol?', 'How long does the Earth take to go around the Sun?'], [['Un an', 'Un año', 'One year'], ['O zi', 'Un día', 'One day'], ['O lună', 'Un mes', 'One month'], ['O săptămână', 'Una semana', 'One week']]],
  [2, ['În cât timp se învârte Pământul o dată în jurul axei sale?', '¿Cuánto tarda la Tierra en girar una vez sobre sí misma?', 'How long does the Earth take to spin around once?'], [['O zi', 'Un día', 'One day'], ['O oră', 'Una hora', 'One hour'], ['O lună', 'Un mes', 'One month'], ['Un an', 'Un año', 'One year']]],
  [2, ['Ce este Soarele?', '¿Qué es el Sol?', 'What is the Sun?'], [['O stea', 'Una estrella', 'A star'], ['O planetă', 'Un planeta', 'A planet'], ['Un satelit', 'Un satélite', 'A moon'], ['O cometă', 'Un cometa', 'A comet']]],
  [2, ['Cum se numește galaxia noastră?', '¿Cómo se llama nuestra galaxia?', 'What is our galaxy called?'], [['Calea Lactee', 'La Vía Láctea', 'The Milky Way'], ['Andromeda', 'Andrómeda', 'Andromeda'], ['Orion', 'Orión', 'Orion'], ['Ursa Mare', 'La Osa Mayor', 'The Great Bear']]],
  [2, ['Cine a fost primul om care a pășit pe Lună?', '¿Quién fue la primera persona que pisó la Luna?', 'Who was the first person to walk on the Moon?'], [['Neil Armstrong', 'Neil Armstrong', 'Neil Armstrong'], ['Iuri Gagarin', 'Yuri Gagarin', 'Yuri Gagarin'], ['Albert Einstein', 'Albert Einstein', 'Albert Einstein'], ['Cristofor Columb', 'Cristóbal Colón', 'Christopher Columbus']]],
  [2, ['Câte oase are corpul unui adult?', '¿Cuántos huesos tiene el cuerpo de un adulto?', 'How many bones are in an adult body?'], N3(206, 106, 306, 52)],
  [2, ['Câți dinți are un adult?', '¿Cuántos dientes tiene un adulto?', 'How many teeth does an adult have?'], N3(32, 20, 28, 40)],
  [2, ['Cu ce organ respirăm?', '¿Con qué órgano respiramos?', 'Which organ do we breathe with?'], [['Plămânii', 'Los pulmones', 'The lungs'], ['Inima', 'El corazón', 'The heart'], ['Ficatul', 'El hígado', 'The liver'], ['Stomacul', 'El estómago', 'The stomach']]],
  [2, ['Ce organ conduce tot corpul?', '¿Qué órgano dirige todo el cuerpo?', 'Which organ controls the whole body?'], [['Creierul', 'El cerebro', 'The brain'], ['Inima', 'El corazón', 'The heart'], ['Plămânii', 'Los pulmones', 'The lungs'], ['Rinichii', 'Los riñones', 'The kidneys']]],
  [2, ['Care este cel mai tare material din corpul nostru?', '¿Cuál es el material más duro de nuestro cuerpo?', 'What is the hardest material in our body?'], [['Smalțul dinților', 'El esmalte dental', 'Tooth enamel'], ['Osul', 'El hueso', 'Bone'], ['Unghia', 'La uña', 'Nail'], ['Pielea', 'La piel', 'Skin']]],
  [2, ['La câte grade Celsius îngheață apa?', '¿A cuántos grados Celsius se congela el agua?', 'At how many degrees Celsius does water freeze?'], N3(0, 10, 100, 32)],
  [2, ['La câte grade Celsius fierbe apa?', '¿A cuántos grados Celsius hierve el agua?', 'At how many degrees Celsius does water boil?'], N3(100, 50, 0, 200)],
  [2, ['Ce gaz iau plantele din aer?', '¿Qué gas toman las plantas del aire?', 'Which gas do plants take from the air?'], [['Dioxid de carbon', 'Dióxido de carbono', 'Carbon dioxide'], ['Heliu', 'Helio', 'Helium'], ['Abur', 'Vapor', 'Steam'], ['Fum', 'Humo', 'Smoke']]],
  [2, ['Cum se numește felul în care plantele își fac hrana din lumină?', '¿Cómo se llama la forma en que las plantas fabrican su alimento con la luz?', 'What is it called when plants make food from light?'], [['Fotosinteză', 'Fotosíntesis', 'Photosynthesis'], ['Digestie', 'Digestión', 'Digestion'], ['Evaporare', 'Evaporación', 'Evaporation'], ['Hibernare', 'Hibernación', 'Hibernation']]],
  [2, ['Ce forță ne ține pe Pământ?', '¿Qué fuerza nos mantiene en la Tierra?', 'Which force keeps us on the ground?'], [['Gravitația', 'La gravedad', 'Gravity'], ['Magnetismul', 'El magnetismo', 'Magnetism'], ['Vântul', 'El viento', 'Wind'], ['Electricitatea', 'La electricidad', 'Electricity']]],
  [2, ['Ce călătorește cel mai repede?', '¿Qué viaja más rápido?', 'What travels the fastest?'], [['Lumina', 'La luz', 'Light'], ['Sunetul', 'El sonido', 'Sound'], ['Vântul', 'El viento', 'Wind'], ['Un avion', 'Un avión', 'A plane']]],
  [2, ['Câte picioare are o insectă?', '¿Cuántas patas tiene un insecto?', 'How many legs does an insect have?'], N3(6, 8, 4, 10)],
  [2, ['Ce animal este mamifer, deși trăiește în apă?', '¿Qué animal es mamífero aunque vive en el agua?', 'Which animal is a mammal even though it lives in water?'], [['Delfinul', 'El delfín', 'The dolphin'], ['Rechinul', 'El tiburón', 'The shark'], ['Somonul', 'El salmón', 'The salmon'], ['Caracatița', 'El pulpo', 'The octopus']]],
  [2, ['Ce animal își poate schimba culoarea?', '¿Qué animal puede cambiar de color?', 'Which animal can change its colour?'], [['Cameleonul', 'El camaleón', 'The chameleon'], ['Crocodilul', 'El cocodrilo', 'The crocodile'], ['Ursul', 'El oso', 'The bear'], ['Vulturul', 'El águila', 'The eagle']]],
  [2, ['Câte inimi are o caracatiță?', '¿Cuántos corazones tiene un pulpo?', 'How many hearts does an octopus have?'], N3(3, 1, 2, 8)],
  [2, ['Cum se numesc animalele care mănâncă doar plante?', '¿Cómo se llaman los animales que solo comen plantas?', 'What are animals that eat only plants called?'], [['Erbivore', 'Herbívoros', 'Herbivores'], ['Carnivore', 'Carnívoros', 'Carnivores'], ['Omnivore', 'Omnívoros', 'Omnivores'], ['Insectivore', 'Insectívoros', 'Insectivores']]],
  [2, ['Cum se numește omul de știință care studiază stelele?', '¿Cómo se llama el científico que estudia las estrellas?', 'What do we call a scientist who studies the stars?'], [['Astronom', 'Astrónomo', 'Astronomer'], ['Biolog', 'Biólogo', 'Biologist'], ['Geolog', 'Geólogo', 'Geologist'], ['Chimist', 'Químico', 'Chemist']]],
  [2, ['Din ce familie de animale dispărute făcea parte T-Rex?', '¿A qué grupo de animales extinguidos pertenecía el T-Rex?', 'Which group of extinct animals did T-Rex belong to?'], [['Dinozauri', 'Dinosaurios', 'Dinosaurs'], ['Balene', 'Ballenas', 'Whales'], ['Elefanți', 'Elefantes', 'Elephants'], ['Păsări', 'Aves', 'Birds']]],
  [2, ['De unde iese lava?', '¿De dónde sale la lava?', 'Where does lava come from?'], [['Dintr-un vulcan', 'De un volcán', 'A volcano'], ['Dintr-o peșteră', 'De una cueva', 'A cave'], ['Dintr-un ghețar', 'De un glaciar', 'A glacier'], ['Dintr-un râu', 'De un río', 'A river']]],
  [2, ['Câte zile are un an obișnuit?', '¿Cuántos días tiene un año normal?', 'How many days are in a normal year?'], N3(365, 300, 360, 400)],
  [2, ['Câți ani are un secol?', '¿Cuántos años tiene un siglo?', 'How many years are in a century?'], N3(100, 10, 50, 1000)],
  [2, ['Câte laturi are un hexagon?', '¿Cuántos lados tiene un hexágono?', 'How many sides does a hexagon have?'], N3(6, 5, 7, 8)],
  [2, ['Câte grade are un unghi drept?', '¿Cuántos grados tiene un ángulo recto?', 'How many degrees are in a right angle?'], N3(90, 45, 180, 360)],
  [2, ['Cum se numește figura cu 5 laturi?', '¿Cómo se llama la figura de 5 lados?', 'What is a shape with 5 sides called?'], [['Pentagon', 'Pentágono', 'Pentagon'], ['Hexagon', 'Hexágono', 'Hexagon'], ['Octogon', 'Octógono', 'Octagon'], ['Triunghi', 'Triángulo', 'Triangle']]],
  [2, ['Ce instrument măsoară temperatura?', '¿Qué instrumento mide la temperatura?', 'Which tool measures temperature?'], [['Termometrul', 'El termómetro', 'The thermometer'], ['Cântarul', 'La báscula', 'The scales'], ['Rigla', 'La regla', 'The ruler'], ['Busola', 'La brújula', 'The compass']]],
  [2, ['Ce instrument arată nordul?', '¿Qué instrumento señala el norte?', 'Which tool points north?'], [['Busola', 'La brújula', 'The compass'], ['Termometrul', 'El termómetro', 'The thermometer'], ['Ceasul', 'El reloj', 'The clock'], ['Microscopul', 'El microscopio', 'The microscope']]],
  [2, ['Cu ce privim lucrurile foarte mici?', '¿Con qué miramos las cosas muy pequeñas?', 'What do we use to look at very small things?'], [['Microscopul', 'El microscopio', 'A microscope'], ['Telescopul', 'El telescopio', 'A telescope'], ['Busola', 'La brújula', 'A compass'], ['Termometrul', 'El termómetro', 'A thermometer']]],
  [2, ['Cu ce privim planetele și stelele?', '¿Con qué miramos los planetas y las estrellas?', 'What do we use to look at planets and stars?'], [['Telescopul', 'El telescopio', 'A telescope'], ['Microscopul', 'El microscopio', 'A microscope'], ['Stetoscopul', 'El estetoscopio', 'A stethoscope'], ['Termometrul', 'El termómetro', 'A thermometer']]],
  [2, ['Ce metal este atras de magnet?', '¿Qué metal es atraído por un imán?', 'Which metal does a magnet attract?'], [['Fierul', 'El hierro', 'Iron'], ['Aurul', 'El oro', 'Gold'], ['Aluminiul', 'El aluminio', 'Aluminium'], ['Cuprul', 'El cobre', 'Copper']]],
  [2, ['Cine a pictat Mona Lisa?', '¿Quién pintó la Mona Lisa?', 'Who painted the Mona Lisa?'], [['Leonardo da Vinci', 'Leonardo da Vinci', 'Leonardo da Vinci'], ['Picasso', 'Picasso', 'Picasso'], ['Van Gogh', 'Van Gogh', 'Van Gogh'], ['Michelangelo', 'Miguel Ángel', 'Michelangelo']]],
  [2, ['Cum se numește puiul broaștei?', '¿Cómo se llama la cría de la rana?', 'What is a baby frog called?'], [['Mormoloc', 'Renacuajo', 'Tadpole'], ['Omidă', 'Oruga', 'Caterpillar'], ['Mânz', 'Potro', 'Foal'], ['Cățel', 'Cachorro', 'Puppy']]],
  [2, ['Ce animal construiește baraje pe râuri?', '¿Qué animal construye presas en los ríos?', 'Which animal builds dams on rivers?'], [['Castorul', 'El castor', 'The beaver'], ['Vidra', 'La nutria', 'The otter'], ['Ursul', 'El oso', 'The bear'], ['Veverița', 'La ardilla', 'The squirrel']]],
  [2, ['Cum respiră peștii?', '¿Cómo respiran los peces?', 'How do fish breathe?'], [['Prin branhii', 'Por las branquias', 'Through gills'], ['Prin plămâni', 'Por los pulmones', 'Through lungs'], ['Prin piele', 'Por la piel', 'Through skin'], ['Prin nas', 'Por la nariz', 'Through a nose']]],
  [2, ['Unde trăiesc urșii polari?', '¿Dónde viven los osos polares?', 'Where do polar bears live?'], [['La Polul Nord', 'En el Polo Norte', 'Around the North Pole'], ['La Polul Sud', 'En el Polo Sur', 'Around the South Pole'], ['În Sahara', 'En el Sahara', 'In the Sahara'], ['În junglă', 'En la selva', 'In the jungle']]],
  [2, ['Ce parte a plantei prinde lumina soarelui?', '¿Qué parte de la planta capta la luz del sol?', 'Which part of a plant catches sunlight?'], [['Frunzele', 'Las hojas', 'The leaves'], ['Rădăcinile', 'Las raíces', 'The roots'], ['Semințele', 'Las semillas', 'The seeds'], ['Scoarța', 'La corteza', 'The bark']]],
];

const WORLDS = [
  { id: 'words', em: '🌳', far: '🌲🌳🌲🌲🌳🌲', near: '🍄🌼🌿🌼', obst: ['🕸️', '🍄', '🚧'], stickers: W('🦊 🦉 🐿️ 🦌 🐻 🦋 🐰 🦡 🦝 🐸 🐞 🐌') },
  { id: 'math', em: '⛰️', far: '⛰️🏔️⛰️⛰️🏔️⛰️', near: '🌱🌾🌱🌾', obst: ['🧱', '🌋', '⛄'], stickers: W('🦅 🐐 🐺 🐏 🦙 🐉 🐧 🐆 🐻‍❄️ ⛄ 🦫 🦬') },
  { id: 'logic', em: '💎', far: '💎🔮💎💎🔮💎', near: '🕯️✨🕯️✨', obst: ['🔒', '🚪', '🗝️'], night: true, stickers: W('🦇 🕷️ 🦎 🐭 🦔 🤖 🐍 🪲 🐛 👻 💎 🐲') },
  { id: 'nature', em: '🏝️', far: '🌴🏝️🌴🌴🏝️🌴', near: '🐚🌺🐚🌺', obst: ['🌊', '🦀', '🐊'], stickers: W('🐬 🐢 🐙 🦜 🐠 🦩 🐳 🦀 🐡 🦭 🦈 🐒') },
  { id: 'mix', em: '🏰', far: '🏰☁️✨🏰☁️✨', near: '⭐✨⭐✨', obst: ['☁️', '🌪️', '🔒'], night: true, stickers: W('🦄 🚀 👑 🪐 🌟 🏆 👽 🌙 ☄️ 🌈 🧙 🪔') },
];
const CASTLE_NEED = 20, STEPS = 5, PER_WORLD = 12;
// how hard the questions of a level are: grows with every level up to 6, then every second level
const hard = idx => (idx < 6 ? idx : 5 + Math.floor((idx - 4) / 2));
const totalStars = () => Object.values(S.stars).reduce((a, b) => a + b, 0);

/* ElGatoLoco art: assets/cat_<pose>.webp (wave, cheer, sit, walk, fly) */
const pic = (name, alt = '') => `<img class="pic" src="assets/${name}.webp" alt="${alt}" draggable="false">`;
const stickerPic = (w, i) => pic(`st_${w.id}_${i}`, w.stickers[i]);
// animated poses: assets/anim_<pose>.webp is one row of frames — [frame count, frame width, frame height, frames per second]
const SPR = { walk: [16, 233, 256, 14], wave: [12, 283, 384, 8], cheer: [16, 237, 320, 12], purr: [10, 307, 384, 8] };
const cat = pose => {
  const s = SPR[pose];
  return s ? `<span class="sprite" style="--src:url(assets/anim_${pose}.webp);--n:${s[0]};--ar:${s[1]}/${s[2]};--dur:${(s[0] / s[3]).toFixed(2)}s"></span>`
    : `<img class="catimg" src="assets/cat_${pose}.webp" alt="" draggable="false">`;
};

/* ---------- sound ---------- */
let ac;
function tone(f, at, d, type, v) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type || 'triangle'; o.frequency.value = f;
  g.gain.setValueAtTime(v || 0.14, at); g.gain.exponentialRampToValueAtTime(0.001, at + d);
  o.connect(g); g.connect(ac.destination); o.start(at); o.stop(at + d + 0.02);
}
/* Recorded cat sounds live in assets/sfx. Until a file has loaded (or if it is missing) the synthesised
   version further down plays instead. */
const SND = {}, HOLD = {};
function loadSnd() {
  if (SND.asked) return; SND.asked = true;
  ['meow1.mp3', 'meow2.mp3', 'tickle.mp3', 'slap.mp3', 'purr.wav'].forEach(f =>
    fetch('assets/sfx/' + f).then(r => r.arrayBuffer()).then(b => ac.decodeAudioData(b)).then(a => { SND[f.split('.')[0]] = a; }).catch(() => {}));
}
function playSnd(name, vol, loop) {
  const b = SND[name]; if (!b) return null;
  const src = ac.createBufferSource(), g = ac.createGain();
  src.buffer = b; src.loop = !!loop; g.gain.value = vol; src.connect(g); g.connect(ac.destination); src.start();
  return { src, g };
}
// a sound that lasts while the player keeps rubbing: every call keeps it going a little longer, then it fades
function holdSnd(name, vol, loop) {
  let h = HOLD[name];
  if (!h || h.dead) {
    h = playSnd(name, vol, loop); if (!h) return false;
    HOLD[name] = h; if (!loop) h.src.onended = () => { h.dead = true; };
  }
  h.g.gain.cancelScheduledValues(ac.currentTime); h.g.gain.setTargetAtTime(vol, ac.currentTime, 0.03);
  clearTimeout(h.t);
  h.t = setTimeout(() => {
    h.g.gain.setTargetAtTime(0, ac.currentTime, 0.15);
    if (loop) { h.dead = true; setTimeout(() => { try { h.src.stop(); } catch (e) {} }, 800); }
  }, 450);
  return true;
}
// phone vibration (a number of milliseconds or an on/off pattern); silently does nothing where unsupported
let vibeMsg = '';
function buzz(pattern) {
  if (S.vibe === false) return;
  // phone motors need about 40 ms to spin up: shorter pulses are not felt at all
  const p = [].concat(pattern).map((v, i) => i % 2 ? Math.max(60, v) : Math.max(45, Math.round(v * 1.6)));
  try {
    if (window.ElGatoApp) { ElGatoApp.vibrate(p.join(',')); return true; } // Android app: the phone's own vibrator
    if (navigator.vibrate) return navigator.vibrate(p);
  } catch (e) {}
}
function sfx(name, i) {
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    loadSnd();
    if (name === 'meow' && playSnd(pick(['meow1', 'meow2']), 0.9)) return;
    if (name === 'purr' && holdSnd('purr', 1, true)) return;
    if (name === 'giggle' && holdSnd('tickle', 0.9, false)) return;
    if (name === 'clap' && playSnd('slap', 1)) return;
    const n = ac.currentTime;
    if (name === 'good') [523, 659, 784].forEach((f, k) => tone(f, n + k * 0.09, 0.2));
    else if (name === 'bad') tone(170, n, 0.25, 'sawtooth', 0.07);
    else if (name === 'tap') tone(520, n, 0.07, 'sine', 0.08);
    else if (name === 'win') [523, 659, 784, 1047, 784, 1047].forEach((f, k) => tone(f, n + k * 0.13, 0.24));
    else if (name === 'meow') {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle';
      o.frequency.setValueAtTime(620, n); o.frequency.linearRampToValueAtTime(980, n + 0.12); o.frequency.linearRampToValueAtTime(520, n + 0.38);
      g.gain.setValueAtTime(0.001, n); g.gain.linearRampToValueAtTime(0.16, n + 0.05); g.gain.exponentialRampToValueAtTime(0.001, n + 0.42);
      o.connect(g); g.connect(ac.destination); o.start(n); o.stop(n + 0.45);
    }
    else if (name === 'giggle') [900, 1150, 1000].forEach((f, k) => tone(f, n + k * 0.06, 0.07, 'sine', 0.09));
    else if (name === 'purr') tone(48, n, 0.24, 'sawtooth', 0.12);
    else if (name === 'whoosh') tone(300, n, 0.14, 'sine', 0.06);
    else if (name === 'clap') {
      const bf = ac.createBuffer(1, ac.sampleRate * 0.12, ac.sampleRate), d = bf.getChannelData(0);
      for (let k = 0; k < d.length; k++) d[k] = (Math.random() * 2 - 1) * (1 - k / d.length);
      const src = ac.createBufferSource(), g = ac.createGain(); src.buffer = bf; g.gain.value = 0.35;
      src.connect(g); g.connect(ac.destination); src.start(n); tone(880, n, 0.15, 'triangle', 0.1);
    }
    else if (name === 'gem') tone([330, 415, 494, 622][i], n, 0.32, 'sine', 0.2);
  } catch (e) {}
}
/* Recorded voice: assets/voice/<lang>.mp3 holds MP3 clips one after another and index.json maps
   lang -> text -> [offset, length]. Phrases without a clip fall back to the device's own voice. */
const VOICE = { idx: null, bin: {}, q: [], cur: null, busy: false, tok: null };
try { fetch('assets/voice/index.json').then(r => r.json()).then(j => { VOICE.idx = j; }).catch(() => {}); } catch (e) {}
const voicePack = lang => VOICE.bin[lang] || (VOICE.bin[lang] = fetch(`assets/voice/${lang}.mp3`).then(r => r.arrayBuffer()));
function hush() {
  VOICE.q = []; VOICE.tok = null; VOICE.busy = false;
  if (VOICE.cur) { try { VOICE.cur.onended = null; VOICE.cur.stop(); } catch (e) {} VOICE.cur = null; }
  try { speechSynthesis.cancel(); } catch (e) {}
}
// keep = say it after whatever is being spoken instead of interrupting it
function say(text, lang, keep) {
  if (!S.sound || !text) return;
  if (!keep) hush();
  VOICE.q.push([text, lang]);
  if (!VOICE.busy) nextVoice();
}
function nextVoice() {
  const it = VOICE.q.shift();
  if (!it) { VOICE.busy = false; return; }
  VOICE.busy = true;
  const [text, lang] = it, tok = VOICE.tok = {}, e = VOICE.idx && VOICE.idx[lang] && VOICE.idx[lang][text];
  const done = () => { if (VOICE.tok === tok) { VOICE.cur = null; nextVoice(); } };
  const tts = () => {
    if (VOICE.tok !== tok) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-US' : 'ro-RO';
      u.rate = 0.85; u.onend = u.onerror = done;
      speechSynthesis.speak(u); setTimeout(done, 7000);
    } catch (err) { done(); }
  };
  if (!e) return tts();
  voicePack(lang).then(buf => {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    return ac.decodeAudioData(buf.slice(e[0], e[0] + e[1]));
  }).then(a => {
    if (VOICE.tok !== tok) return;
    const src = ac.createBufferSource(), g = ac.createGain();
    src.buffer = a; g.gain.value = 1; src.connect(g); g.connect(ac.destination);
    src.onended = done; VOICE.cur = src; src.start();
  }).catch(tts);
}

/* ---------- challenge generators ---------- */
let used = new Set();
const keyOf = x => Array.isArray(x) ? x[0] : x;
function fresh(arr) {
  const pool = arr.filter(x => !used.has(keyOf(x)));
  const x = pick(pool.length ? pool : arr);
  used.add(keyOf(x));
  return x;
}
const nOpt = t => (t === 0 ? 3 : 4);
function numOpts(c, n, spread) {
  const s = new Set([c]); let g = 0;
  while (s.size < n && g++ < 200) { const v = c + rnd(spread * 2 + 1) - spread; if (v >= 0) s.add(v); }
  let k = 1; while (s.size < n) s.add(c + spread + k++);
  const o = shuffle([...s]);
  return { opts: o.map(String), ans: o.indexOf(c), cls: 'num' };
}
function mix(correct, others) {
  const o = shuffle([correct, ...others]);
  return { opts: o, ans: o.indexOf(correct) };
}
const big = e => `<span class="big">${e}</span>`;
const expr = s => `<span class="expr">${s}</span>`;
const learnLang = () => (S.learn === 'both' ? pick(['es', 'en']) : S.learn);
const wd = (w, lang) => w[lang === 'es' ? 1 : 2];
const up = s => s.toLocaleUpperCase('es');
const chip = lang => `<span class="chip">${LNAME[lang]}</span>`;
const sayBtn = (text, lang) => `<button class="say" data-act="say" data-text="${text}" data-lang="${lang}" aria-label="🔊">🔊</button>`;
const wordStim = (text, lang) => `<span class="word">${up(text)}</span><span class="brk"></span>${chip(lang)}${sayBtn(text, lang)}`;

const G = {
  /* words */
  picWord(t) {
    const lang = learnLang(), w = fresh(V);
    const pool = V.filter(x => x !== w && (t < 2 || x[3] === w[3]));
    const m = mix(up(wd(w, lang)), sample(pool, nOpt(t) - 1).map(x => up(wd(x, lang))));
    return { type: 'choice', q: T('q_picWord'), stim: big(w[0]) + '<span class="brk"></span>' + chip(lang), ...m, cls: 'txt', after: [wd(w, lang), lang] };
  },
  wordPic(t) {
    const lang = learnLang(), w = fresh(V);
    const pool = V.filter(x => x !== w && (t < 2 || x[3] === w[3]));
    const m = mix(w[0], sample(pool, nOpt(t) - 1).map(x => x[0]));
    return { type: 'choice', q: T('q_wordPic'), stim: wordStim(wd(w, lang), lang), ...m, cls: 'em', auto: [wd(w, lang), lang] };
  },
  letter(t, p, first) {
    const lang = learnLang();
    const w = fresh(V.filter(x => wd(x, lang).length <= (t === 0 ? 6 : 9)));
    const word = up(wd(w, lang));
    const i = first ? 0 : 1 + rnd(word.length - 1);
    const c = word[i];
    const others = sample([...ABC[lang]].filter(x => x !== c), nOpt(t) - 1);
    const shown = word.slice(0, i) + '_' + word.slice(i + 1);
    return { type: 'choice', q: T(first ? 'q_first' : 'q_missing'), stim: `<span class="mid">${w[0]}</span><span class="word">${shown}</span><span class="brk"></span>${chip(lang)}${sayBtn(wd(w, lang), lang)}`, ...mix(c, others), cls: 'num', auto: t === 0 ? [wd(w, lang), lang] : null, after: [wd(w, lang), lang] };
  },
  firstLetter(t, p) { return G.letter(t, p, true); },
  missingLetter(t, p) { return G.letter(t, p, false); },
  spell(t) {
    const lang = learnLang();
    const w = fresh(V.filter(x => { const n = wd(x, lang).length; return t < 2 ? n <= 5 : n >= 5; }));
    const word = up(wd(w, lang));
    const extra = t < 2 ? [] : sample([...ABC[lang]].filter(c => !word.includes(c)), 2);
    return { type: 'spell', q: T('q_spell'), emoji: w[0], word, lang, raw: wd(w, lang), tiles: shuffle([...word, ...extra]) };
  },
  translate(t, p) {
    if (S.learn !== 'both') return G.wordPic(t, p);
    const from = pick(['es', 'en']), to = from === 'es' ? 'en' : 'es', w = fresh(V);
    const m = mix(up(wd(w, to)), sample(V.filter(x => x !== w && x[3] === w[3]), 3).map(x => up(wd(x, to))));
    return { type: 'choice', q: T('q_to' + to), stim: wordStim(wd(w, from), from), ...m, cls: 'txt', after: [wd(w, to), to] };
  },

  /* math */
  count(t, p) {
    const n = 2 + rnd(5 + p), e = pick(GROUPS.fruit);
    return { type: 'choice', q: T('q_count'), stim: `<span class="sm grp">${e.repeat(n)}</span>`, ...numOpts(n, 3, 2) };
  },
  add(t, p) {
    const max = [6 + p, 20 + p * 16, 200 + p * 160][t];
    const a = 1 + rnd(max - 1), b = 1 + rnd(Math.max(1, max - a));
    let stim = expr(`${a} + ${b}`);
    if (t === 0 && p < 3) { const e = pick(GROUPS.fruit); stim = `<span class="sm grp">${e.repeat(a)}</span><span class="expr">+</span><span class="sm grp">${e.repeat(b)}</span><span class="brk"></span>` + stim; }
    return { type: 'choice', q: T('q_solve'), stim, ...numOpts(a + b, nOpt(t), t === 2 ? 20 : 3) };
  },
  sub(t, p) {
    const max = [6 + p, 20 + p * 16, 200 + p * 160][t];
    const a = 2 + rnd(max - 1), b = 1 + rnd(a - 1);
    return { type: 'choice', q: T('q_solve'), stim: expr(`${a} − ${b}`), ...numOpts(a - b, nOpt(t), t === 2 ? 20 : 3) };
  },
  mul(t, p) {
    const a = 2 + rnd(t === 1 ? 4 + p : 11), b = 2 + rnd(t === 1 ? 4 : 11);
    return { type: 'choice', q: T('q_solve'), stim: expr(`${a} × ${b}`), ...numOpts(a * b, 4, Math.max(4, a)) };
  },
  div(t) {
    const b = 2 + rnd(t === 1 ? 4 : 11), q = 2 + rnd(t === 1 ? 5 : 11);
    return { type: 'choice', q: T('q_solve'), stim: expr(`${b * q} ÷ ${b}`), ...numOpts(q, 4, 3) };
  },
  missNum(t, p) {
    if (t === 2 && rnd(2)) { const b = 2 + rnd(11), x = 2 + rnd(11); return { type: 'choice', q: T('q_missNum'), stim: expr(`? × ${b} = ${b * x}`), ...numOpts(x, 4, 3) }; }
    const max = [10, 30 + p * 10, 300][t], c = 3 + rnd(max - 2), a = 1 + rnd(c - 1);
    return { type: 'choice', q: T('q_missNum'), stim: expr(`${a} + ? = ${c}`), ...numOpts(c - a, nOpt(t), t === 2 ? 12 : 3) };
  },
  biggest(t, p) {
    const max = t === 0 ? 10 + p * 2 : 100 + p * 180, s = new Set();
    while (s.size < 3) s.add(1 + rnd(max));
    const o = [...s], c = Math.max(...o);
    return { type: 'choice', q: T('q_biggest'), stim: '', opts: o.map(String), ans: o.indexOf(c), cls: 'num', n3: true };
  },
  nextNum(t, p) {
    const a = 1 + rnd(6 + p * 2);
    return { type: 'choice', q: T('q_next'), stim: expr(`${a}, ${a + 1}, ${a + 2}, ?`), ...numOpts(a + 3, 3, 2) };
  },
  mixed(t, p) {
    const k = rnd(4);
    if (k === 0) { const a = 2 + rnd(9), b = 2 + rnd(9), c = 1 + rnd(20); return { type: 'choice', q: T('q_solve'), stim: expr(`${a} × ${b} + ${c}`), ...numOpts(a * b + c, 4, 6) }; }
    if (k === 1) { const n = 2 * (6 + rnd(60)); return { type: 'choice', q: T('q_solve'), stim: expr(T('half', n)), ...numOpts(n / 2, 4, 5) }; }
    if (k === 2) { const n = 4 * (3 + rnd(22)); return { type: 'choice', q: T('q_solve'), stim: expr(T('quarter', n)), ...numOpts(n / 4, 4, 4) }; }
    const n = 13 + rnd(80); return { type: 'choice', q: T('q_solve'), stim: expr(T('dbl', n)), ...numOpts(n * 2, 4, 6) };
  },
  halfDouble(t, p) {
    if (rnd(2)) { const n = 2 * (2 + rnd(10 + p * 3)); return { type: 'choice', q: T('q_solve'), stim: expr(T('half', n)), ...numOpts(n / 2, 4, 3) }; }
    const n = 3 + rnd(12 + p * 4); return { type: 'choice', q: T('q_solve'), stim: expr(T('dbl', n)), ...numOpts(n * 2, 4, 4) };
  },

  /* logic */
  pattern(t) {
    const tpl = pick([['ABABAB', 'AABAAB', 'ABBABB'], ['ABCABC', 'AABBAABB', 'ABACABAC', 'ABCCABCC'], ['ABCDABCD', 'ABBCABBC', 'AABCAABC', 'ABCBABCB']][t]);
    const sym = sample(SHAPES, 5), seq = [...tpl].map(c => sym['ABCD'.indexOf(c)]);
    const ansSym = seq.pop(), set = [...new Set(seq.concat(ansSym))];
    let i = 4; while (set.length < 3) set.push(sym[i--]);
    return { type: 'choice', q: T('q_next'), stim: `<span class="${seq.length > 6 ? 'sm' : 'mid'}">${seq.join(' ')} ❓</span>`, ...mix(ansSym, set.filter(x => x !== ansSym)), cls: 'em', n3: set.length === 3 };
  },
  seqNum(t, p) {
    let s;
    const a = 1 + rnd(9), k = 2 + rnd(t === 1 ? 4 : 8), kind = t === 1 ? rnd(2) : rnd(5);
    if (kind === 0) s = [0, 1, 2, 3, 4].map(i => a + i * k);
    else if (kind === 1) s = [4, 3, 2, 1, 0].map(i => a + i * k);
    else if (kind === 2) { const b = 1 + rnd(3); s = [0, 1, 2, 3, 4].map(i => b * 2 ** i); }
    else if (kind === 3) { const j = 1 + rnd(3); s = [a]; for (let i = 0; i < 4; i++) s.push(s[i] + (i % 2 ? j : k)); }
    else { const b = 1 + rnd(4); s = [0, 1, 2, 3, 4].map(i => (b + i) * (b + i)); }
    const c = s.pop();
    return { type: 'choice', q: T('q_next'), stim: expr(s.join(', ') + ', ?'), ...numOpts(c, 4, Math.max(3, k)) };
  },
  odd(t) {
    let [a, b] = pick(t === 2 ? NEAR_PAIRS : FAR_PAIRS);
    if (rnd(2)) [a, b] = [b, a];
    const o = mix(pick(GROUPS[b]), sample(GROUPS[a], 3));
    return { type: 'choice', q: T('q_odd'), stim: '', ...o, cls: 'em' };
  },
  memory(t) {
    const pairs = [3, 4, 6][t];
    const em = sample(V.filter(x => x[3] === 'a'), pairs).map(x => x[0]);
    return { type: 'memory', q: T('q_memory'), cards: shuffle([...em, ...em]), cols: pairs === 3 ? 3 : 4 };
  },
  simon(t, p) {
    const len = 3 + t + (p >= 3 ? 1 : 0), seq = [];
    while (seq.length < len) { const g = rnd(4); if (seq[seq.length - 1] !== g) seq.push(g); }
    return { type: 'simon', q: T('q_simon'), seq };
  },

  /* nature */
  habitat(t) {
    const keys = Object.keys(HAB), h = pick(keys.filter(k => k !== 'ice' || !used.has('🐧')));
    const a = fresh(HAB[h][1]);
    const lab = k => `<span class="oi">${HAB[k][0]}</span><span>${T('h_' + k)}</span>`;
    return { type: 'choice', q: T('q_habitat'), stim: big(a), ...mix(lab(h), sample(keys.filter(k => k !== h), nOpt(t) - 1).map(lab)), cls: 'txt' };
  },
  eats(t) {
    const e = fresh(EATS);
    return { type: 'choice', q: T('q_eats'), stim: big(e[0]), ...mix(e[1], sample(EATS.filter(x => x[1] !== e[1]).map(x => x[1]), nOpt(t) - 1)), cls: 'em' };
  },
  legs(t) {
    const e = fresh(LEGS);
    const o = [e[1], ...sample([0, 2, 4, 6, 8].filter(x => x !== e[1]), nOpt(t) - 1)].sort((a, b) => a - b);
    return { type: 'choice', q: T('q_legs'), stim: big(e[0]), opts: o.map(String), ans: o.indexOf(e[1]), cls: 'num' };
  },
  klass(t) {
    const keys = Object.keys(KLASS), k = pick(keys);
    const a = fresh(KLASS[k].filter(x => t === 2 || !KLASS_HARD.includes(x)));
    const lab = x => T('k_' + x);
    return { type: 'choice', q: T('q_klass'), stim: big(a), ...mix(lab(k), sample(keys.filter(x => x !== k), 3).map(lab)), cls: 'txt' };
  },
  diet() {
    const k = pick(['h', 'c', 'o']), a = fresh(DIET[k]);
    const o = ['h', 'c', 'o'];
    return { type: 'choice', q: T('q_diet'), stim: big(a), opts: o.map(x => `<span class="oi">${DIET_ICON[x]}</span><span>${T('d_' + x)}</span>`), ans: o.indexOf(k), cls: 'txt', col: true };
  },
  fact(t) {
    const f = fresh(FACTS.filter(x => (t === 2 ? x[0] === 2 : x[0] === 1)).map(x => [x[1][0], x]))[1];
    const l = li(), m = mix(f[2][0][l], f[2].slice(1).map(x => x[l]));
    return { type: 'choice', q: f[1][l], stim: '', ...m, cls: 'txt', col: true };
  },
};

const PLANS = {
  words: [['picWord', 'firstLetter', 'wordPic', 'picWord', 'firstLetter'], ['picWord', 'missingLetter', 'spell', 'wordPic', 'spell'], ['spell', 'translate', 'missingLetter', 'spell', 'translate']],
  math: [null, ['add', 'sub', 'mul', 'missNum', 'halfDouble'], ['mul', 'div', 'mixed', 'missNum', 'add', 'sub']],
  logic: [['pattern', 'odd', 'M', 'pattern', 'odd'], ['pattern', 'odd', 'M', 'seqNum', 'pattern'], ['seqNum', 'odd', 'M', 'pattern', 'seqNum']],
  nature: [['habitat', 'eats', 'legs', 'habitat', 'eats'], ['habitat', 'legs', 'klass', 'fact', 'eats'], ['klass', 'diet', 'fact', 'fact', 'klass']],
};
function plan(world, idx) {
  const t = S.age;
  if (world === 'mix') return shuffle(['words', 'math', 'logic', 'nature', pick(['words', 'math', 'logic', 'nature'])]).map((w, i) => pick(plan(w, idx + i)));
  if (world === 'math' && t === 0) return shuffle(idx < 2 ? ['count', 'biggest', 'nextNum', 'add', 'count'] : ['count', 'add', 'sub', 'biggest', 'missNum']);
  if (world === 'math' && t === 1 && idx >= 3) return shuffle(['add', 'sub', 'mul', 'div', 'missNum']);
  return shuffle(PLANS[world][t]).slice(0, STEPS).map(g => (g === 'M' ? (idx % 2 ? 'simon' : 'memory') : g));
}

/* ---------- views ---------- */
const app = document.getElementById('app');
let cur = null, view = 'title', resetArmed = false;
const seg = (k, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-act="set" data-k="${k}" data-v="${v}" aria-pressed="${String(S[k]) === String(v)}">${l}</button>`).join('')}</div>`;
const langSeg = () => seg('lang', LANGS.map(l => [l, LNAME[l]]));
const ageSeg = () => seg('age', [[0, '5–6'], [1, '7–9'], [2, '10–12']].map(([v, l]) => [v, `${l} ${T('years')}`]));

function show(v) {
  cur = null; view = v; resetArmed = false;
  hush();
  ({ title: vTitle, map: vMap, album: vAlbum, settings: vSettings, snake: vSnake, quests: vQuests, run: vRun, catch: vCatch, whack: vWhack, memory: vMemory, fly: vFly, blocks: vBlocks, kart: vKart })[v]();
}
// the Android back button: leave a game or page for the map; false lets the app close
window.__back = () => { if (view === 'map' || view === 'title') return false; show('map'); return true; };
function vTitle() {
  app.innerHTML = `<div class="title">
    <button class="cat" data-act="pet" aria-label="ElGatoLoco">${cat('wave')}</button>
    <h1>ElGatoLoco<small>${T('sub')}</small></h1>
    <p class="story">${T('story')}</p>
    <div class="pick"><span class="label">${T('language')}</span>${langSeg()}</div>
    <div class="pick"><span class="label">${T('age')}</span>${ageSeg()}</div>
    <button class="btn" data-act="start">${T('play')} ▶</button>
  </div>`;
}
function starsStr(n) { return `<span class="st"><b>${'★'.repeat(n)}</b>${'★'.repeat(3 - n)}</span>`; }
function vMap() {
  const tot = totalStars();
  const cards = WORLDS.map(w => {
    let body;
    if (w.id === 'mix' && tot < CASTLE_NEED) body = `<p class="lockmsg">🔒 ${T('locked', CASTLE_NEED, tot)}</p>`;
    else {
      body = '<div class="nodes">';
      for (let i = 0; i < PER_WORLD; i++) {
        const st = S.stars[w.id + '-' + i] || 0, open = i === 0 || S.stars[w.id + '-' + (i - 1)];
        body += open ? `<button class="node${st ? '' : ' next'}" data-act="level" data-w="${w.id}" data-i="${i}">${i + 1}${starsStr(st)}</button>` : `<button class="node" disabled aria-label="🔒">🔒</button>`;
      }
      body += '</div>';
    }
    return `<section class="world w-${w.id}${w.night ? ' night' : ''}"><div class="head"><span class="em">${pic('ic_' + w.id, w.em)}</span><div><h3>${T('w_' + w.id)}</h3><p class="sub">${T('s_' + w.id)}</p></div></div>${body}</section>`;
  }).join('');
  const dl = daily();
  const games = `<section class="games"><div class="g-headline"><h3>${T('games')}</h3><button class="pill alt" data-act="go" data-v="quests" aria-label="${T('quests')}">🏆 ${trophies()} / ${QUESTS.length * 3}</button></div>
      <button class="daily${dl.done ? ' done' : ''}" data-act="go" data-v="${dl.id}"><span class="d-ic">${pic(dl.ic)}</span><span class="pc-tx"><b>${T('daily')}</b><small>${T('g_' + dl.id)}: ${dl.unit} ${dl.need}</small></span><span class="pc-go">${dl.done ? '✅' : '▶'}</span></button>
      <div class="g-grid">${GAMES.map(([id, ic]) => `<button class="g-tile" data-act="go" data-v="${id}"><span class="g-ic">${pic(ic)}</span><b>${T('g_' + id)}</b><small>🏆 ${S.best[id] || 0}</small></button>`).join('')}</div>
      <button class="btn alt" data-act="go" data-v="quests">🏅 ${T('quests')}</button></section><h3 class="g-sect">${T('adventure')}</h3>`;
  app.innerHTML = `<div class="map">
    <header class="topbar"><button class="cat mini" data-act="pet" aria-label="ElGatoLoco">${cat('sit')}</button><span class="pill">⭐ ${tot} / ${WORLDS.length * PER_WORLD * 3}</span><span class="grow"></span>
      <button class="icon-btn" data-act="go" data-v="album" aria-label="${T('album')}">📒</button>
      <button class="icon-btn" data-act="go" data-v="settings" aria-label="${T('settings')}">⚙️</button></header>
    <div class="worlds">${games}${cards}</div></div>`;
}
function vAlbum() {
  const cells = WORLDS.flatMap(w => w.stickers.map((s, i) => (S.stickers.includes(w.id + '-' + i) ? `<div class="sticker">${stickerPic(w, i)}</div>` : `<div class="sticker off">?</div>`))).join('');
  app.innerHTML = `<div class="page"><header class="topbar"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button><h2 class="grow">${T('album')}</h2><span class="pill">${S.stickers.length} / ${WORLDS.length * PER_WORLD}</span></header>
    <div class="body"><p class="note">${T('albumNote')}</p><div class="album">${cells}</div></div></div>`;
}
function vSettings() {
  app.innerHTML = `<div class="page"><header class="topbar"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button><h2 class="grow">${T('settings')}</h2></header>
    <div class="body">
      <div class="field"><span class="label">${T('language')}</span>${langSeg()}</div>
      <div class="field"><span class="label">${T('age')}</span>${ageSeg()}</div>
      <div class="field"><span class="label">${T('learn')}</span>${seg('learn', [['both', T('both')], ['es', 'Español'], ['en', 'English']])}</div>
      <div class="field"><span class="label">${T('sound')}</span>${seg('sound', [[true, T('on')], [false, T('off')]])}</div>
      <div class="field"><span class="label">${T('vibe')}</span>${seg('vibe', [[true, T('on')], [false, T('off')]])}</div>
      <button class="btn alt small" data-act="vtest">📳 ${T('vtest')}</button>${vibeMsg ? `<p class="label vmsg">${T(vibeMsg)}</p>` : ''}
      <p class="note">${T('privacy')}</p>
      <div><button class="btn ${resetArmed ? 'danger' : 'alt'}" data-act="reset">${resetArmed ? T('resetSure') : T('reset')}</button></div>
    </div></div>`;
}

/* ---------- level ---------- */
const later = (ms, fn) => { const tok = cur; setTimeout(() => { if (cur === tok && tok) fn(); }, ms); };
const $ = s => app.querySelector(s);
const GAME_ORDER = ['sling', 'fly', 'slice', 'puzzle'];
// question types whose answers are short enough to live inside the action games
const ARC = {
  words: [['picWord', 'firstLetter', 'wordPic'], ['picWord', 'missingLetter', 'wordPic'], ['picWord', 'missingLetter', 'translate', 'wordPic']],
  math: [['count', 'add', 'sub', 'nextNum', 'biggest'], ['add', 'sub', 'mul', 'missNum', 'halfDouble', 'div'], ['mul', 'div', 'mixed', 'missNum', 'add', 'sub']],
  logic: [['pattern', 'odd'], ['pattern', 'odd', 'seqNum'], ['pattern', 'odd', 'seqNum']],
  nature: [['eats', 'legs', 'habitat'], ['eats', 'legs', 'habitat', 'klass'], ['klass', 'legs', 'habitat', 'eats']],
};
const plain = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
function askQ(n) {
  const w = cur.world === 'mix' ? pick(Object.keys(ARC)) : cur.world;
  const c = G[pick(ARC[w][S.age])](S.age, hard(cur.idx));
  let ids = c.opts.map((_, i) => i);
  if (ids.length > n) ids = shuffle([c.ans, ...sample(ids.filter(i => i !== c.ans), n - 1)]);
  return { q: c.q, stim: c.stim, opts: ids.map(i => plain(c.opts[i])), ans: ids.indexOf(c.ans), auto: c.auto, after: c.after };
}
function floatEm(box, em, x, y) {
  const s = document.createElement('span');
  s.className = 'fem'; s.textContent = em; s.style.left = x + 'px'; s.style.top = y + 'px';
  box.appendChild(s); setTimeout(() => s.remove(), 950);
}

function startLevel(world, idx) {
  const w = WORLDS.find(x => x.id === world);
  used = new Set();
  const a = idx % 4, qz = plan(world, idx);
  const seq = [
    { k: 'arc', g: GAME_ORDER[a] }, { k: 'quiz', g: qz[0] }, { k: 'break', g: nextBreak() },
    { k: 'arc', g: GAME_ORDER[(a + 1) % 4] }, { k: 'quiz', g: qz[1] }, { k: 'arc', g: GAME_ORDER[(a + 2) % 4] },
  ];
  if (idx >= 6) seq.push({ k: 'break', g: nextBreak() }, { k: 'quiz', g: qz[2] }, { k: 'arc', g: GAME_ORDER[(a + 3) % 4] });
  cur = { world, idx, w, step: 0, pos: 0, mistakes: 0, stageMist: 0, seq, ch: null, hi: 0, hiId: 0 };
  view = 'level';
  app.innerHTML = `<div class="level w-${world}">
    <header class="topbar" style="padding-bottom:0"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button>
      <div class="steps">${'<i>★</i>'.repeat(seq.filter(x => x.k !== 'break').length)}</div>
      <button class="icon-btn" data-act="mute" aria-label="${T('sound')}">${S.sound ? '🔊' : '🔇'}</button></header>
    <div class="scene"><div class="bg"></div>
      <div class="hero">${cat('walk')}</div><div class="obst"></div><div class="toast"></div></div>
    <div class="panel" id="panel"></div></div>`;
  walk();
}
function walk() {
  const scene = $('.scene'), ob = $('.obst'), p = $('#panel'), st = cur.seq[cur.pos], last = !st;
  $('.level').classList.remove('arcade');
  p.innerHTML = ''; p.className = 'panel';
  ob.style.transition = 'none'; ob.className = 'obst';
  ob.innerHTML = last ? pic('ob_gift', '🎁') : st.k === 'break' ? '' : pic(`ob_${cur.w.id}_${cur.step % cur.w.obst.length}`, cur.w.obst[cur.step % cur.w.obst.length]);
  void ob.offsetWidth; ob.style.transition = '';
  scene.classList.add('walking'); ob.classList.add('in');
  if (Math.random() < 0.3) later(450, () => sfx('meow'));
  later(st && st.k === 'break' ? 800 : 1450, () => {
    scene.classList.remove('walking');
    if (last) return finish();
    cur.stageMist = 0; cur.wrong = 0; cur.lock = false; cur.ch = null; cur.arc = null; cur.pz = null;
    if (st.k === 'quiz') { cur.ch = G[st.g](S.age, hard(cur.idx)); renderCh(); }
    else if (st.k === 'break') (BREAK_FN[st.g] || petBreak)(st.g);
    else if (st.g === 'puzzle') puzzle();
    else arcade(st.g);
  });
}
function renderCh() {
  const c = cur.ch, p = $('#panel');
  let h = `<p class="q" id="q" data-act="say" data-lang="${S.lang}" data-text="${plain(c.q).replace(/"/g, '')}">${c.q}</p>`;
  if (c.type === 'choice') {
    if (c.stim) h += `<div class="stim">${c.stim}</div>`; else h += '<div class="stim" style="min-height:0;flex:.4"></div>';
    h += `<div class="opts${c.opts.length === 3 || c.n3 ? ' n3' : ''}${c.col ? ' col' : ''}">${c.opts.map((o, i) => `<button class="opt ${c.cls || ''}" data-act="opt" data-i="${i}">${o}</button>`).join('')}</div>`;
  } else if (c.type === 'spell') {
    c.pos = 0;
    h += `<div class="stim"><span class="big">${c.emoji}</span><span class="brk"></span>${chip(c.lang)}${sayBtn(c.raw, c.lang)}</div>
      <div class="slots">${[...c.word].map((_, i) => `<span class="${i ? '' : 'cur'}"></span>`).join('')}</div>
      <div class="tiles">${c.tiles.map((l, i) => `<button class="tile" data-act="tile" data-i="${i}">${l}</button>`).join('')}</div>`;
  } else if (c.type === 'memory') {
    c.open = []; c.seen = new Set(); c.left = c.cards.length / 2;
    h += `<div class="mem" style="--cols:${c.cols}">${c.cards.map((_, i) => `<button class="mcard" data-act="card" data-i="${i}">★</button>`).join('')}</div>`;
  } else if (c.type === 'simon') {
    const col = ['#ff6b6b', '#3d8bfd', '#2fbf71', '#f5a524'], sh = ['●', '▲', '■', '★'];
    h += `<div class="gems">${col.map((g, i) => `<button class="gem" style="--g:${g}" data-act="gem" data-i="${i}">${sh[i]}</button>`).join('')}</div><p class="hintline"></p>`;
  }
  p.innerHTML = h; p.className = 'panel show';
  say(plain(c.q), S.lang);
  if (c.auto) say(c.auto[0], c.auto[1], true);
  if (c.type === 'simon') later(700, playSeq);
}
function mistake() {
  cur.mistakes++; cur.stageMist++; sfx('bad'); buzz([70, 50, 70]);
  const hero = $('.hero'); hero.classList.remove('oops'); void hero.offsetWidth; hero.classList.add('oops');
}
function solved() {
  cur.lock = true; sfx('good'); buzz(25);
  const c = cur.ch; if (c && c.after) later(350, () => say(c.after[0], c.after[1]));
  $('.level').classList.remove('arcade');
  $('.steps').children[cur.step].classList.add('on');
  cur.step++; cur.pos++;
  const toast = $('.toast'); toast.textContent = pick(PRAISE[li()]); toast.classList.remove('go'); void toast.offsetWidth; toast.classList.add('go');
  const hero = $('.hero'); hero.classList.remove('hop', 'oops'); void hero.offsetWidth; hero.classList.add('hop');
  $('.obst').classList.add('poof');
  const wait = c && c.after ? 1500 : 1000;
  if (cur.stageMist === 0) later(wait - 200, hi5); else later(wait, walk);
}
function playSeq() {
  const c = cur.ch, gems = $('.gems'); if (!gems) return;
  c.input = 0; c.playing = true; gems.classList.remove('ready');
  $('#q').textContent = T('q_simon');
  c.seq.forEach((g, i) => {
    later(i * 650, () => { const b = gems.children[g]; b.classList.add('lit'); sfx('gem', g); later(420, () => b.classList.remove('lit')); });
  });
  later(c.seq.length * 650, () => { c.playing = false; gems.classList.add('ready'); $('#q').textContent = T('q_simonGo'); });
}

/* high five after a stage with no mistakes */
function hi5() {
  const p = $('#panel'), id = ++cur.hiId; cur.hi = id;
  p.innerHTML = `<p class="q">${T('hi5')}</p><div class="hi5"><button class="five" data-act="hi5" aria-label="${T('hi5')}">${pic('cat_hi5')}<span class="ring"></span></button></div>`;
  p.className = 'panel show'; sfx('meow'); say(T('hi5'), S.lang, true);
  later(6000, () => { if (cur.hi === id) { cur.hi = 0; walk(); } });
}

/* tickle / cuddle break: rub the cat until the meter fills */
function petBreak(mode) {
  const p = $('#panel'), need = 2400;
  let dist = 0, lx = null, ly = 0, lastFx = 0, done = false, tmr;
  p.innerHTML = `<p class="q">${T(mode)}</p><div class="petzone ${mode}"><div class="cat">${cat('purr')}</div></div><div class="meter"><i></i></div>`;
  p.className = 'panel show'; sfx('meow'); say(T(mode), S.lang, true);
  const z = $('.petzone'), bar = $('.meter i'), kitty = z.firstChild;
  const mv = e => {
    if (done || !cur) return;
    const r = z.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (lx !== null) dist += Math.hypot(x - lx, y - ly);
    lx = x; ly = y;
    kitty.classList.add('wig'); clearTimeout(tmr); tmr = setTimeout(() => kitty.classList.remove('wig'), 220);
    bar.style.width = Math.min(100, dist / need * 100) + '%';
    const now = performance.now();
    if (now - lastFx > 260) { lastFx = now; floatEm(z, pick(mode === 'tickle' ? ['😹', '😆', '✨'] : ['💗', '💜', '😻']), x, y); sfx(mode === 'tickle' ? 'giggle' : 'purr'); buzz(mode === 'tickle' ? 12 : 24); }
    if (dist >= need) { done = true; sfx('meow'); kitty.classList.remove('wig'); kitty.classList.add('boing'); cur.pos++; later(1000, walk); }
  };
  z.addEventListener('pointerdown', e => { lx = null; try { z.setPointerCapture(e.pointerId); } catch (_) {} mv(e); });
  z.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') mv(e); });
  z.addEventListener('pointerup', () => { lx = null; });
}

/* the other breaks: short toys with no wrong answers. Each one fills the meter and then the walk goes on */
const BREAKS = ['tickle', 'pet', 'feed', 'bubbles', 'hide', 'chase'];
let breakLog = [];
// a break that was not among the last four, so a child rarely sees the same one twice in a row of levels
function nextBreak() {
  const b = pick(BREAKS.filter(x => !breakLog.includes(x)));
  breakLog = [...breakLog, b].slice(-4);
  return b;
}
function breakPanel(mode, inner) {
  const p = $('#panel');
  p.innerHTML = `<p class="q">${T(mode)}</p><div class="petzone ${mode}">${inner}</div><div class="meter"><i></i></div>`;
  p.className = 'panel show'; sfx('meow'); say(T(mode), S.lang, true);
  const z = $('.petzone'), bar = $('.meter i');
  return { z, kitty: z.querySelector('.cat'), fill: f => { bar.style.width = Math.min(100, f * 100) + '%'; }, end: () => { sfx('good'); cur.pos++; later(1000, walk); } };
}
const hop = el => { el.classList.remove('boing'); void el.offsetWidth; el.classList.add('boing'); };
// snack: fish lie around the cat; every tapped fish flies into its mouth
function feedBreak(mode) {
  const n = 7, b = breakPanel(mode, `<div class="cat">${cat('purr')}</div>`);
  let got = 0;
  for (let i = 0; i < n; i++) {
    const a = (i + Math.random() * 0.5) / n * Math.PI * 2, f = document.createElement('button');
    f.className = 'toy'; f.innerHTML = pic('fish'); f.setAttribute('aria-label', '🐟');
    f.style.left = 50 + 39 * Math.cos(a) + '%'; f.style.top = 46 + 36 * Math.sin(a) + '%';
    f.addEventListener('pointerdown', () => {
      if (f.classList.contains('gone') || !cur) return;
      f.classList.add('gone'); f.style.left = '50%'; f.style.top = '46%';
      sfx('tap'); buzz(18); hop(b.kitty); floatEm(b.z, pick(['😋', '💗', '✨']), b.z.clientWidth / 2 - 14, b.z.clientHeight * 0.2);
      b.fill(++got / n);
      if (got === n) { sfx('meow'); b.end(); }
    });
    b.z.appendChild(f);
  }
}
// soap bubbles drift up around the cat until every one is popped
function bubbleBreak(mode) {
  const n = 10, b = breakPanel(mode, `<div class="cat">${cat('purr')}</div>`);
  let got = 0;
  for (let i = 0; i < n; i++) {
    const u = document.createElement('button'), s = 54 + rnd(34), d = 4 + Math.random() * 3;
    u.className = 'bub'; u.setAttribute('aria-label', '🫧');
    u.style.cssText = `left:${4 + (i * 37 + rnd(12)) % 80}%;width:${s}px;height:${s}px;animation-duration:${d.toFixed(2)}s;animation-delay:-${(Math.random() * d).toFixed(2)}s`;
    u.addEventListener('pointerdown', () => {
      if (u.classList.contains('pop') || !cur) return;
      const r = u.getBoundingClientRect(), zr = b.z.getBoundingClientRect();
      u.classList.add('pop'); setTimeout(() => u.remove(), 180);
      sfx('gem', got % 4); buzz(15); floatEm(b.z, '✨', r.left - zr.left + s / 2 - 14, r.top - zr.top);
      b.fill(++got / n);
      if (got === n) { hop(b.kitty); b.end(); }
    });
    b.z.appendChild(u);
  }
}
// hide and seek: the cat is in one of three boxes (the right one wobbles now and then); three rounds
function hideBreak(mode) {
  const rounds = 3, b = breakPanel(mode, `<div class="boxes">${[0, 1, 2].map(i => `<button class="box" data-i="${i}" aria-label="${i + 1}"><span class="peek">${pic('cat_head')}</span>${pic('ob_gift', '🎁')}</button>`).join('')}</div>`);
  const boxes = [...b.z.querySelectorAll('.box')];
  let spot = -1, found = 0, lock = false;
  const deal = () => {
    spot = pick([0, 1, 2].filter(i => i !== spot)); lock = false;
    boxes.forEach((x, i) => { x.className = 'box' + (i === spot ? ' has' : ''); });
  };
  boxes.forEach((x, i) => x.addEventListener('pointerdown', () => {
    if (lock || !cur || x.classList.contains('empty')) return;
    if (i !== spot) { x.classList.add('empty'); sfx('whoosh'); floatEm(x, '💨', x.clientWidth / 2 - 14, 0); return; }
    lock = true; x.classList.add('found'); sfx('meow'); buzz([20, 30, 45]); floatEm(x, pick(['😻', '💜', '✨']), x.clientWidth / 2 - 14, -10);
    b.fill(++found / rounds);
    if (found === rounds) b.end(); else later(1000, deal);
  }));
  deal();
}
// a mouse keeps popping up somewhere else; tap it and the cat pounces there
function chaseBreak(mode) {
  const n = 6, b = breakPanel(mode, `<div class="cat">${cat('purr')}</div><button class="toy" aria-label="🐭">${pic('g_mouse')}</button>`);
  const m = b.z.querySelector('.toy');
  let got = 0, turn = 0, mx = 50, my = 52;
  b.kitty.style.left = '50%'; b.kitty.style.top = '52%';
  const place = () => {
    if (got >= n) return;
    let x, y;
    do { x = 12 + rnd(76); y = 16 + rnd(66); } while (Math.hypot(x - mx, y - my) < 30);
    mx = x; my = y; m.style.left = x + '%'; m.style.top = y + '%'; m.classList.remove('gone');
    const t = ++turn; later(1500, () => { if (t === turn) place(); });
  };
  m.addEventListener('pointerdown', () => {
    if (m.classList.contains('gone') || !cur) return;
    turn++; m.classList.add('gone');
    b.kitty.style.left = mx + '%'; b.kitty.style.top = my + '%';
    sfx(got % 2 ? 'meow' : 'tap'); buzz(22); floatEm(b.z, pick(['💥', '✨', '😹']), b.z.clientWidth * mx / 100 - 14, b.z.clientHeight * my / 100 - 40);
    b.fill(++got / n);
    if (got === n) { hop(b.kitty); b.end(); } else later(450, place);
  });
  place();
}
const BREAK_FN = { feed: feedBreak, bubbles: bubbleBreak, hide: hideBreak, chase: chaseBreak };

/* picture puzzle: swap tiles, then name the picture */
function puzzle() {
  const t = S.age, cols = [3, 3, 4][t], rows = [2, 3, 3][t], n = cols * rows, w = fresh(V), lang = learnLang();
  const c = document.createElement('canvas'); c.width = cols * 120; c.height = rows * 120;
  const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, c.width, c.height);
  const [c1, c2] = pick([['#ffe29a', '#ff9a8b'], ['#a8edea', '#7fb8ff'], ['#d4fc79', '#6fd6a8'], ['#e0c3fc', '#8ec5fc']]);
  gr.addColorStop(0, c1); gr.addColorStop(1, c2); x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  const dec = ['⭐', '🌸', '☁️', '✨', '🎈', '🍀', '💜', '🌙', '🎵', '🐾', '🦋', '🌈'];
  x.font = '34px sans-serif';
  for (let i = 0; i < n; i++) { const cc = i % cols, r = Math.floor(i / cols); x.fillText(dec[i % dec.length], cc * 120 + (cc % 2 ? 92 : 28), r * 120 + (r % 2 ? 28 : 92)); }
  x.font = `${Math.min(c.height, c.width) * 0.66}px sans-serif`; x.fillText(w[0], c.width / 2, c.height / 2 + 8);
  let order; do { order = shuffle([...Array(n).keys()]); } while (order.filter((v, i) => v === i).length > n / 3);
  cur.pz = { order, cols, rows, sel: -1, w, lang };
  $('.level').classList.add('arcade');
  const p = $('#panel');
  p.innerHTML = `<p class="q">${T('q_puzzle')}</p><p class="hintline">${T('hint_puzzle')}</p>
    <div class="pzwrap"><div class="pz" style="--cols:${cols};--rows:${rows};aspect-ratio:${cols}/${rows}">${order.map((_, i) => `<button class="ptile" data-act="ptile" data-i="${i}"></button>`).join('')}</div></div>`;
  p.className = 'panel show';
  $('.pz').style.setProperty('--img', `url(${c.toDataURL('image/png')})`);
  paintPz();
}
function paintPz() {
  const { order, cols, rows, sel } = cur.pz, tiles = $('.pz').children;
  order.forEach((v, i) => {
    tiles[i].style.backgroundPosition = `${(v % cols) / (cols - 1) * 100}% ${Math.floor(v / cols) / (rows - 1) * 100}%`;
    tiles[i].classList.toggle('sel', i === sel);
  });
}

/* action games on canvas: every target is an answer to the question above */
const loadImg = n => { const i = new Image(); i.src = `assets/${n}.webp`; return i; };
const catSit = loadImg('cat_sit'), flyAnim = loadImg('anim_fly'), yarnImg = loadImg('yarn');
function arcade(kind) {
  const tok = cur, p = $('#panel');
  $('.level').classList.add('arcade');
  p.innerHTML = `<div class="abar"><p class="q" id="q" data-act="say" data-lang="${S.lang}"></p><div class="stim mini" id="stim"></div><p class="hintline">${T('hint_' + kind)}</p></div><canvas class="cv"></canvas>`;
  p.className = 'panel show arc';
  const cv = $('.cv'), ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
  let Wd = 0, Ht = 0, Q = null, got = 0, run = true, last = performance.now(), time = 0;
  const need = kind === 'sling' ? 2 : 3, fx = [], FONT = '"Baloo 2", Nunito, system-ui, sans-serif';
  const fit = () => { Wd = cv.clientWidth; Ht = cv.clientHeight; cv.width = Wd * dpr; cv.height = Ht * dpr; };
  fit();
  // draw an image h pixels tall, centred on x; y is its centre, or its bottom edge when `bottom` is set
  const drawFit = (img, x, y, h, bottom) => { if (!img.naturalWidth) return; const w = h * img.naturalWidth / img.naturalHeight; ctx.drawImage(img, x - w / 2, bottom ? y - h : y - h / 2, w, h); };
  // draw the current frame of a one-row animation strip with n frames, centred on x, y
  const drawAnim = (img, n, x, y, h, fps) => { if (!img.naturalWidth) return; const fw = img.naturalWidth / n, w = h * fw / img.naturalHeight; ctx.drawImage(img, (Math.floor(time * fps) % n) * fw, 0, fw, img.naturalHeight, x - w / 2, y - h / 2, w, h); };
  const burst = (x, y, e) => { for (let i = 0; i < 10; i++) { const a = Math.random() * 6.28, s = 80 + Math.random() * 170; fx.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 90, life: 0.8, t: e || pick(['⭐', '✨', '💜']) }); } };
  const mk = (label, i) => {
    let fs = [...label].length <= 3 ? 34 : 22, tw;
    do { ctx.font = `800 ${fs}px ${FONT}`; tw = ctx.measureText(label).width; fs -= 2; } while (tw + 28 > Wd * 0.62 && fs > 12);
    return { label, i, fs: fs + 2, w: Math.max(66, tw + 28), h: 58, alive: true, x: 0, y: 0 };
  };
  const hit = (px, py, pr, t) => { const dx = Math.max(Math.abs(px - t.x) - t.w / 2, 0), dy = Math.max(Math.abs(py - t.y) - t.h / 2, 0); return dx * dx + dy * dy < pr * pr; };
  const pill = (t, ring) => {
    const x = t.x - t.w / 2, y = t.y - t.h / 2, r = t.h / 2;
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + t.w, y, x + t.w, y + t.h, r); ctx.arcTo(x + t.w, y + t.h, x, y + t.h, r); ctx.arcTo(x, y + t.h, x, y, r); ctx.arcTo(x, y, x + t.w, y, r); ctx.closePath();
    const gr = ctx.createLinearGradient(0, y, 0, y + t.h); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#e9edff');
    ctx.save(); ctx.shadowColor = 'rgba(29,43,83,.28)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; ctx.fillStyle = gr; ctx.fill(); ctx.restore();
    ctx.lineWidth = 5; ctx.strokeStyle = ring; ctx.stroke();
    ctx.fillStyle = '#1d2b53'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `800 ${t.fs}px ${FONT}`; ctx.fillText(t.label, t.x, t.y + t.fs * 0.07);
  };
  const RING = ['#ff6b6b', '#3d8bfd', '#2fbf71', '#f5a524'];
  function newQ() {
    Q = askQ(kind === 'slice' ? 4 : 3);
    $('#q').textContent = Q.q; $('#q').dataset.text = Q.q; $('#stim').innerHTML = Q.stim || '';
    say(Q.q, S.lang);
    if (Q.auto) say(Q.auto[0], Q.auto[1], true);
    g.onQ();
  }
  function correct(x, y) {
    const q = Q; Q = null; got++; burst(x, y); sfx('good');
    if (q.after) say(q.after[0], q.after[1]);
    const h = p.querySelector('.hintline'); if (h) h.textContent = '';
    if (got >= need) later(850, () => { run = false; p.innerHTML = ''; solved(); });
    else later(900, newQ);
  }
  const wrong = (x, y) => { burst(x, y, '💨'); mistake(); };

  const GM = {
    sling() {
      const A = () => ({ x: Wd * 0.2, y: Ht * 0.64 }), K = 9.5, GR = 1000;
      let ball, drag = null, pull = { x: 0, y: 0 }, tg = [];
      const reset = () => { const a = A(); ball = { x: a.x, y: a.y, vx: 0, vy: 0, fly: false }; pull = { x: 0, y: 0 }; };
      reset();
      return {
        onQ() {
          const ys = shuffle([0.13, 0.33, 0.53]);
          tg = Q.opts.map(mk); tg.forEach((t, k) => { t.y0 = Ht * ys[k]; t.ph = Math.random() * 6; t.x = Wd - t.w / 2 - 10 - rnd(Math.max(1, Wd * 0.48 - t.w)); });
        },
        target: () => tg.find(t => Q && t.i === Q.ans),
        down(x, y) { if (!ball.fly) drag = { x, y }; },
        move(x, y) {
          if (!drag) return;
          let dx = x - drag.x, dy = y - drag.y; const m = Math.hypot(dx, dy);
          if (m > 95) { dx *= 95 / m; dy *= 95 / m; }
          pull = { x: dx, y: dy }; const a = A(); ball.x = a.x + dx; ball.y = a.y + dy;
        },
        up() {
          if (!drag) return; drag = null;
          if (Math.hypot(pull.x, pull.y) > 14) { ball.fly = true; ball.vx = -pull.x * K; ball.vy = -pull.y * K; sfx('whoosh'); } else reset();
        },
        step(dt) {
          tg.forEach(t => { t.y = t.y0 + Math.sin(time * 2 + t.ph) * 6; });
          if (!ball.fly) return;
          ball.vy += GR * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt;
          for (const t of tg) {
            if (!t.alive || !Q || !hit(ball.x, ball.y, 14, t)) continue;
            if (t.i === Q.ans) { correct(t.x, t.y); tg = []; } else { t.alive = false; wrong(t.x, t.y); }
            reset(); return;
          }
          if (ball.x > Wd + 40 || ball.x < -40 || ball.y > Ht - 26) reset();
        },
        draw() {
          const a = A(), gy = Ht - 26;
          ctx.fillStyle = '#bfe8c9'; ctx.fillRect(0, gy, Wd, 26);
          drawFit(catSit, Math.max(30, a.x - 50), gy + 6, 72, true);
          ctx.lineCap = 'round'; ctx.strokeStyle = '#8a5a3c'; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.moveTo(a.x, gy); ctx.lineTo(a.x, a.y + 20); ctx.lineTo(a.x - 15, a.y - 4); ctx.moveTo(a.x, a.y + 20); ctx.lineTo(a.x + 15, a.y - 4); ctx.stroke();
          if (drag) {
            ctx.strokeStyle = '#5a3fd6'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(a.x - 15, a.y - 4); ctx.lineTo(ball.x, ball.y); ctx.lineTo(a.x + 15, a.y - 4); ctx.stroke();
            ctx.fillStyle = 'rgba(124,92,255,.55)';
            let px = ball.x, py = ball.y, vx = -pull.x * K, vy = -pull.y * K;
            for (let i = 0; i < (S.age === 2 ? 9 : 18); i++) { for (let k = 0; k < 3; k++) { vy += GR * 0.016; px += vx * 0.016; py += vy * 0.016; } ctx.beginPath(); ctx.arc(px, py, 3.5, 0, 7); ctx.fill(); }
          }
          tg.forEach((t, k) => { if (t.alive) pill(t, RING[k % 4]); });
          drawFit(yarnImg, ball.x, ball.y, 38);
        },
      };
    },
    fly() {
      const GR = S.age ? 950 : 760, FLAP = S.age ? -340 : -300, LANES = [0.24, 0.5, 0.76];
      let cy = Ht * 0.4, vy = 0, col = null;
      const clouds = [0, 1, 2, 3].map(i => ({ x: Math.random() * 400, y: 30 + i * 90, s: 20 + i * 8 }));
      return {
        onQ() { const it = Q.opts.map(mk), mw = Math.max(...it.map(t => t.w)); it.forEach((t, k) => { t.ly = LANES[k]; }); col = { x: Wd + mw / 2 + 20, mw, it }; },
        target: () => col && col.it.find(t => Q && t.i === Q.ans),
        down() { vy = FLAP; sfx('tap'); },
        move() {}, up() {},
        step(dt) {
          vy += GR * dt; cy += vy * dt;
          if (cy < 26) { cy = 26; vy = 0; } if (cy > Ht - 26) { cy = Ht - 26; vy = 0; }
          clouds.forEach(c => { c.x -= c.s * dt; if (c.x < -40) c.x = Wd + 40; });
          if (!col) return;
          col.x -= Wd * (S.age ? 0.3 : 0.24) * dt;
          for (const t of col.it) {
            t.x = col.x; t.y = Ht * t.ly;
            if (!t.alive || !Q || !hit(Wd * 0.22, cy, 22, t)) continue;
            if (t.i === Q.ans) { correct(t.x, t.y); col = null; return; }
            t.alive = false; wrong(t.x, t.y);
          }
          if (col.x < -col.mw) col.x = Wd + col.mw / 2 + 20;
        },
        draw() {
          ctx.fillStyle = 'rgba(255,255,255,.85)';
          clouds.forEach(c => { ctx.beginPath(); for (const [dx, dy, r] of [[-20, 4, 13], [-4, -5, 18], [15, 2, 14], [0, 8, 14]]) { ctx.moveTo(c.x + dx + r, c.y + dy); ctx.arc(c.x + dx, c.y + dy, r, 0, 7); } ctx.fill(); });
          if (col) col.it.forEach((t, k) => { if (t.alive) pill(t, RING[k % 4]); });
          ctx.save(); ctx.translate(Wd * 0.22, cy); ctx.rotate(Math.max(-0.45, Math.min(0.6, vy / 700)));
          drawAnim(flyAnim, 16, 0, 0, 66, 14); ctx.restore();
        },
      };
    },
    slice() {
      const GR = 520;
      let items = [], pool = [], spawn = 0.4, trail = [], dn = false, lp = null;
      const cut = (x0, y0, x1, y1) => {
        if (!Q) return;
        const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 8) + 1;
        for (const t of items) {
          if (!t.alive) continue;
          for (let k = 0; k <= n; k++) {
            if (!hit(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, 8, t)) continue;
            sfx('whoosh');
            if (t.i === Q.ans) { correct(t.x, t.y); items = []; return; }
            t.alive = false; wrong(t.x, t.y); break;
          }
        }
      };
      return {
        onQ() { items = []; spawn = 0.4; pool = Q.opts.map(mk); },
        target: () => items.find(t => Q && t.alive && t.i === Q.ans && t.y > 40 && t.y < Ht - 40),
        down(x, y) { dn = true; lp = { x, y }; trail = [{ x, y, t: time }]; cut(x, y, x, y); },
        move(x, y) { if (!dn) return; cut(lp.x, lp.y, x, y); lp = { x, y }; trail.push({ x, y, t: time }); },
        up() { dn = false; },
        step(dt) {
          spawn -= dt;
          if (Q && spawn <= 0 && items.length < 5) {
            spawn = S.age ? 0.75 : 1;
            const i = !items.some(t => t.i === Q.ans) && Math.random() < 0.6 ? Q.ans : rnd(pool.length), b = pool[i];
            const x = b.w / 2 + 8 + Math.random() * Math.max(1, Wd - b.w - 16), h = Ht * (0.55 + Math.random() * 0.3);
            items.push({ ...b, x, y: Ht + 40, vx: (Wd / 2 - x) * 0.25, vy: -Math.sqrt(2 * GR * h) });
          }
          items.forEach(t => { t.vy += GR * dt; t.x += t.vx * dt; t.y += t.vy * dt; });
          items = items.filter(t => t.alive && !(t.y > Ht + 60 && t.vy > 0));
          trail = trail.filter(q => time - q.t < 0.25);
        },
        draw() {
          items.forEach(t => pill(t, RING[t.i % 4]));
          if (trail.length > 1) {
            ctx.strokeStyle = '#7c5cff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            for (const off of [-7, 0, 7]) { ctx.lineWidth = off ? 2.5 : 5; ctx.beginPath(); trail.forEach((q, k) => (k ? ctx.lineTo(q.x + off, q.y - off) : ctx.moveTo(q.x + off, q.y - off))); ctx.stroke(); }
          }
        },
      };
    },
  };
  const g = GM[kind]();
  cur.arc = { kind, q: () => Q, target: () => g.target(), win: () => Q && correct(Wd / 2, Ht / 2) };
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} g.down(...pos(e)); });
  cv.addEventListener('pointermove', e => g.move(...pos(e)));
  cv.addEventListener('pointerup', e => g.up(...pos(e)));
  cv.addEventListener('pointercancel', e => g.up(...pos(e)));
  function frame(now) {
    if (!run || cur !== tok || !cv.isConnected) return;
    if (cv.clientWidth !== Wd || cv.clientHeight !== Ht) fit();
    const dt = Math.min(0.033, (now - last) / 1000); last = now; time += dt;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wd, Ht);
    g.step(dt); g.draw();
    ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = fx.length - 1; i >= 0; i--) {
      const f = fx[i]; f.life -= dt; if (f.life <= 0) { fx.splice(i, 1); continue; }
      f.vy += 500 * dt; f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = Math.min(1, f.life * 2); ctx.fillText(f.t, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  later(450, newQ);
}

function finish() {
  const { world, idx, mistakes, w } = cur, key = world + '-' + idx;
  const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
  const isNew = !S.stickers.includes(key);
  S.stars[key] = Math.max(S.stars[key] || 0, stars);
  if (isNew) S.stickers.push(key);
  save(); sfx('win'); setTimeout(() => sfx('meow'), 950);
  const canNext = idx + 1 < PER_WORLD;
  cur = null; view = 'done';
  app.innerHTML = `<div class="done">
    <button class="cat" data-act="pet" aria-label="ElGatoLoco">${cat('cheer')}</button><h2>${T('done' + stars)}</h2>
    <div class="stars3">${[1, 2, 3].map(i => `<span class="${i <= stars ? 'on' : ''}">★</span>`).join('')}</div>
    ${isNew ? `<div class="sticker new">${stickerPic(w, idx)}</div><p class="label">${T('newSticker')}</p>` : ''}
    <div class="row">
      ${canNext ? `<button class="btn" data-act="level" data-w="${world}" data-i="${idx + 1}">${T('next')} ▶</button>` : ''}
      ${stars < 3 ? `<button class="btn alt" data-act="level" data-w="${world}" data-i="${idx}">${T('again')}</button>` : ''}
      <button class="btn alt" data-act="go" data-v="map">${T('toMap')}</button>
    </div></div>`;
}

/* ---------- free play: the long cat (a snake game; questions are an optional bonus) ---------- */
const headImg = loadImg('cat_head'), fishImg = loadImg('fish');
let snakeTurn = null;
// a question whose answers are short enough to sit on one square of the board
function bonusQ() {
  const kinds = [['firstLetter', 'missingLetter', 'wordPic'], ['count', 'add', 'sub', 'nextNum', 'biggest', 'missNum'], ['pattern', 'odd']];
  for (let k = 0; k < 14; k++) {
    let c;
    try { c = G[pick(pick(kinds))](S.age, 2); } catch (e) { continue; }
    if (!c || c.type !== 'choice' || !c.opts) continue;
    const opts = c.opts.map(plain);
    if (opts.some(o => [...o].length > 3)) continue;
    let ids = opts.map((_, i) => i);
    if (ids.length > 3) ids = shuffle([c.ans, ...sample(ids.filter(i => i !== c.ans), 2)]);
    return { q: plain(c.q), stim: c.stim || '', opts: ids.map(i => opts[i]), ans: ids.indexOf(c.ans) };
  }
  return null;
}
function vSnake() {
  const tok = {}, easy = S.age === 0, best0 = S.best.snake || 0;
  app.innerHTML = `<div class="page snake">
    <header class="topbar"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button>
      <span class="pill" id="sn-score">🐟 0</span><span class="grow"></span><span class="pill alt" id="sn-best">🏆 ${best0}</span></header>
    <div class="sn-bonus" id="sn-bonus"></div>
    <div class="sn-wrap"><canvas class="sn-cv"></canvas><div class="sn-over" id="sn-over" hidden></div></div>
    <p class="hintline">${T('snakeHint')}</p></div>`;
  const cv = app.querySelector('.sn-cv'), ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const banner = app.querySelector('#sn-bonus'), FONT = '"Baloo 2", Nunito, system-ui, sans-serif';
  const COLS = easy ? 9 : 11;
  let Wd = cv.clientWidth, Ht = cv.clientHeight, cell = Math.floor(Wd / COLS), ROWS = Math.max(8, Math.floor(Ht / cell));
  if (ROWS * cell > Ht) cell = Math.floor(Ht / ROWS);
  const ox = Math.floor((Wd - COLS * cell) / 2), oy = Math.floor((Ht - ROWS * cell) / 2);
  cv.width = Wd * dpr; cv.height = Ht * dpr;
  const cy0 = Math.floor(ROWS / 2);
  let body = [{ x: 4, y: cy0 }, { x: 3, y: cy0 }, { x: 2, y: cy0 }], prev = body.map(b => ({ ...b }));
  let dir = { x: 1, y: 0 }, queue = [], food = null, bonus = null, score = 0, eaten = 0, alive = true, started = false;
  let stepMs = easy ? 300 : S.age === 1 ? 230 : 190, acc = 0, last = performance.now(), time = 0, pops = [];
  const taken = (x, y) => body.some(b => b.x === x && b.y === y) || (food && food.x === x && food.y === y) || (bonus && bonus.tokens.some(t => t.x === x && t.y === y));
  const spot = () => { for (let k = 0; k < 400; k++) { const x = rnd(COLS), y = rnd(ROWS); if (!taken(x, y) && Math.abs(x - body[0].x) + Math.abs(y - body[0].y) > 2) return { x, y }; } return { x: 0, y: 0 }; };
  food = spot();
  const px = c => ox + (c + 0.5) * cell, py = c => oy + (c + 0.5) * cell;
  const setScore = () => { app.querySelector('#sn-score').textContent = '🐟 ' + score; };
  function endBonus() { bonus = null; banner.innerHTML = ''; }
  function startBonus() {
    const q = bonusQ(); if (!q) return;
    bonus = { q, tokens: [], until: time + 16 };
    q.opts.forEach((label, i) => { const s = spot(); bonus.tokens.push({ ...s, label, ok: i === q.ans }); });
    banner.innerHTML = `<b class="chip">⭐ ${T('bonus')} +5</b><span class="sn-q">${q.q}</span>${q.stim ? `<span class="stim mini">${q.stim}</span>` : ''}`;
    say(q.q, S.lang);
  }
  function die() {
    alive = false; sfx('bad'); buzz(220); hush();
    const r = gameEnd('snake', score), o = app.querySelector('#sn-over');
    if (r.rec) app.querySelector('#sn-best').textContent = '🏆 ' + score;
    o.innerHTML = overHTML('snake', '🐟', score, r);
    o.hidden = false; if (r.rec || r.won || r.dailyWon) sfx('win');
  }
  function step() {
    while (queue.length) { const d = queue.shift(); if (d.x !== -dir.x || d.y !== -dir.y) { dir = d; break; } }
    let nx = body[0].x + dir.x, ny = body[0].y + dir.y;
    if (easy) { nx = (nx + COLS) % COLS; ny = (ny + ROWS) % ROWS; }   // the youngest players pass through the walls
    else if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return die();
    if (body.slice(0, -1).some(b => b.x === nx && b.y === ny)) return die();
    prev = body.map(b => ({ ...b }));
    body.unshift({ x: nx, y: ny });
    if (food.x === nx && food.y === ny) {
      score++; eaten++; setScore(); sfx('tap'); buzz(15); pops.push({ x: px(nx), y: py(ny), t: '+1', life: 0.7 });
      prev.push({ ...prev[prev.length - 1] });
      food = spot(); stepMs = Math.max(easy ? 190 : 120, stepMs - 4);
      if (eaten % 5 === 0 && !bonus) startBonus();
    } else body.pop();
    if (bonus) {
      const t = bonus.tokens.find(k => k.x === nx && k.y === ny);
      if (t) {
        if (t.ok) { score += 5; setScore(); sfx('good'); buzz([20, 30, 45]); pops.push({ x: px(nx), y: py(ny), t: '⭐ +5', life: 1 }); }
        else { sfx('whoosh'); pops.push({ x: px(nx), y: py(ny), t: '💨', life: 0.7 }); }
        endBonus();
      } else if (time > bonus.until) endBonus();
    }
  }
  function draw(k) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wd, Ht);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { ctx.fillStyle = (x + y) % 2 ? '#c4e8b6' : '#d3f0c6'; ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // food
    const bob = Math.sin(time * 5) * cell * 0.05, fw = cell * 0.95;
    if (fishImg.naturalWidth) ctx.drawImage(fishImg, px(food.x) - fw / 2, py(food.y) - fw * fishImg.naturalHeight / fishImg.naturalWidth / 2 + bob, fw, fw * fishImg.naturalHeight / fishImg.naturalWidth);
    else { ctx.font = `${cell * 0.7}px sans-serif`; ctx.fillText('🐟', px(food.x), py(food.y)); }
    // bonus answers
    if (bonus) bonus.tokens.forEach((t, i) => {
      const r = cell * 0.46 * (1 + Math.sin(time * 4 + i) * 0.04);
      ctx.beginPath(); ctx.arc(px(t.x), py(t.y), r, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = ['#ff6b6b', '#3d8bfd', '#f5a524'][i % 3]; ctx.stroke();
      let fs = cell * 0.5; ctx.font = `800 ${fs}px ${FONT}`;
      while (ctx.measureText(t.label).width > cell * 0.72 && fs > 9) { fs -= 1; ctx.font = `800 ${fs}px ${FONT}`; }
      ctx.fillStyle = '#1d2b53'; ctx.fillText(t.label, px(t.x), py(t.y) + fs * 0.06);
    });
    // the cat: tail first, head last; each piece slides from its old square to the new one
    const at = i => {
      const a = prev[Math.min(i, prev.length - 1)], b = body[i];
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > 1 ? { x: px(b.x), y: py(b.y) } : { x: px(a.x + (b.x - a.x) * k), y: py(a.y + (b.y - a.y) * k) };
    };
    const pts = body.map((_, i) => at(i));
    for (let i = pts.length - 1; i >= 1; i--) {
      const r = cell * (i === pts.length - 1 ? 0.3 : i === pts.length - 2 ? 0.38 : 0.44), a = pts[i], b = pts[i - 1];
      ctx.fillStyle = i % 4 === 2 ? '#2a2340' : '#1b1726';
      ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, 7); ctx.fill();
      if (Math.hypot(a.x - b.x, a.y - b.y) < cell * 1.5) { ctx.beginPath(); ctx.arc((a.x + b.x) / 2, (a.y + b.y) / 2, r, 0, 7); ctx.fill(); }
    }
    const h = pts[0], hs = cell * 1.5;
    if (headImg.naturalWidth) ctx.drawImage(headImg, h.x - hs / 2, h.y - hs / 2, hs, hs * headImg.naturalHeight / headImg.naturalWidth);
    else { ctx.fillStyle = '#1b1726'; ctx.beginPath(); ctx.arc(h.x, h.y, cell * 0.55, 0, 7); ctx.fill(); }
    // floating score pops
    ctx.font = `800 ${cell * 0.5}px ${FONT}`; ctx.fillStyle = '#5a3fd6';
    pops.forEach(p => { ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillText(p.t, p.x, p.y - (1 - p.life) * cell); });
    ctx.globalAlpha = 1;
  }
  function frame(now) {
    if (view !== 'snake' || !cv.isConnected) { if (snakeTurn === turn) snakeTurn = null; return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    pops = pops.filter(p => (p.life -= dt) > 0);
    if (alive && started) { acc += dt * 1000; while (acc >= stepMs && alive) { acc -= stepMs; step(); } }
    draw(alive && started ? Math.min(1, acc / stepMs) : 1);
    requestAnimationFrame(frame);
  }
  const turn = (x, y) => { if (!alive) return; started = true; const l = queue[queue.length - 1] || dir; if ((l.x !== x || l.y !== y) && queue.length < 3) queue.push({ x, y }); };
  snakeTurn = turn;
  window.__chispa.snake = () => ({ head: body[0], dir, food, bonus, score, alive, length: body.length, cols: COLS, rows: ROWS });   // for automated play-tests
  let sp = null;
  cv.addEventListener('pointerdown', e => { e.preventDefault(); sp = { x: e.clientX, y: e.clientY }; try { cv.setPointerCapture(e.pointerId); } catch (_) {} started = true; });
  cv.addEventListener('pointermove', e => {
    if (!sp) return;
    const dx = e.clientX - sp.x, dy = e.clientY - sp.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0); else turn(0, Math.sign(dy));
    sp = { x: e.clientX, y: e.clientY };
  });
  const lift = () => { sp = null; };
  cv.addEventListener('pointerup', lift); cv.addEventListener('pointercancel', lift);
  sfx('meow');
  requestAnimationFrame(frame);
}
document.addEventListener('keydown', e => {
  const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
  if (d && snakeTurn && view === 'snake') { e.preventDefault(); snakeTurn(d[0], d[1]); }
  else if (gameKey && view !== 'snake' && [' ', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); gameKey(e.key); }
});

/* ---------- free play: more mini-games, challenges and trophies ---------- */
// [view id, icon, score unit]
const GAMES = [['snake', 'cat_head', '🐟'], ['run', 'ic_run', '⭐'], ['catch', 'ic_catch', '🐟'], ['whack', 'ic_whack', '🐭'], ['memory', 'ic_memory', '🃏'], ['fly', 'ic_fly', '⭐'], ['blocks', 'ic_blocks', '🧊'], ['kart', 'ic_kart', '🏁']];
// [id, bronze, silver, gold]: a game id counts its best score, the others count something collected over time
const QUESTS = [['snake', 10, 25, 50], ['run', 12, 30, 60], ['catch', 20, 45, 90], ['whack', 15, 28, 40], ['memory', 6, 12, 20], ['fly', 8, 20, 40], ['blocks', 70, 110, 160], ['kart', 12, 30, 60],
  ['plays', 5, 25, 75], ['stars', 15, 45, 90], ['stickers', 5, 15, 30], ['smart', 3, 10, 25], ['daily', 1, 5, 15]];
const stat = () => (S.stat = S.stat || { plays: 0, smart: 0, daily: 0 });
const questVal = id => (id === 'stars' ? totalStars() : id === 'stickers' ? S.stickers.length : id in stat() ? stat()[id] : S.best[id] || 0);
const questTier = q => q.slice(1).filter(n => questVal(q[0]) >= n).length;
const trophies = () => QUESTS.reduce((a, q) => a + questTier(q), 0);
const questName = id => (GAMES.some(g => g[0] === id) ? T('g_' + id) : T('q_' + id));
// one challenge a day: reach a score in the game of the day
function daily() {
  const d = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5), g = GAMES[d % GAMES.length], q = QUESTS.find(x => x[0] === g[0]);
  if (!S.daily || S.daily.day !== d) S.daily = { day: d, done: false };
  return { id: g[0], ic: g[1], unit: g[2], need: Math.round((q[1] + q[2]) / 2), done: S.daily.done };
}
// book a finished game: record, play count, challenge of the day, and how many new trophies it brought
function gameEnd(id, score) {
  const before = trophies(), best0 = S.best[id] || 0, rec = score > best0, dl = daily();
  if (rec) S.best[id] = score;
  stat().plays++;
  let dailyWon = false;
  if (dl.id === id && !dl.done && score >= dl.need) { S.daily.done = true; stat().daily++; dailyWon = true; }
  save();
  return { rec, best0, won: trophies() - before, dailyWon };
}
const overHTML = (id, unit, score, r) => `<div class="sn-head">${pic('cat_head')}</div><h2>${unit} ${score}</h2>
  <p class="label">${r.rec ? T('newRecord') : T('record') + ': ' + r.best0}</p>
  ${r.dailyWon ? `<p class="g-won">🎯 ${T('dailyDone')}</p>` : ''}${r.won ? `<p class="g-won">🏆 ${T('newTrophy')}${r.won > 1 ? ' ×' + r.won : ''}</p>` : ''}
  <button class="btn" data-act="go" data-v="${id}">${T('again')} ▶</button><button class="btn alt" data-act="go" data-v="map">${T('toMap')}</button>`;

function vQuests() {
  const dl = daily(), medals = ['🥉', '🥈', '🥇'];
  const rows = QUESTS.map(q => {
    const v = questVal(q[0]), tier = questTier(q), goal = q[Math.min(3, tier + 1)], g = GAMES.find(x => x[0] === q[0]);
    return `<div class="qs-row"><span class="qs-ic">${g ? pic(g[1]) : { plays: '🎮', stars: '⭐', stickers: '📒', smart: '💡', daily: '🎯' }[q[0]]}</span>
      <div class="qs-tx"><b>${questName(q[0])}</b><div class="qs-bar"><i style="width:${Math.min(100, Math.round(v / goal * 100))}%"></i></div><small>${Math.min(v, goal)} / ${goal}</small></div>
      <span class="qs-med">${medals.map((m, i) => `<span class="${i < tier ? 'on' : ''}">${m}</span>`).join('')}</span></div>`;
  }).join('');
  app.innerHTML = `<div class="page"><header class="topbar"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button><h2 class="grow">${T('quests')}</h2><span class="pill alt">🏆 ${trophies()} / ${QUESTS.length * 3}</span></header>
    <div class="body"><button class="daily${dl.done ? ' done' : ''}" data-act="go" data-v="${dl.id}"><span class="d-ic">${pic(dl.ic)}</span><span class="pc-tx"><b>${T('daily')}</b><small>${T('g_' + dl.id)}: ${dl.unit} ${dl.need}</small></span><span class="pc-go">${dl.done ? '✅' : '▶'}</span></button>
    <div class="qs">${rows}</div></div></div>`;
}

const IMG = {}, gi = n => IMG[n] || (IMG[n] = loadImg(n)), walkAnim = loadImg('anim_walk');
const GFONT = '"Baloo 2", Nunito, system-ui, sans-serif';
let reviveCb = null, gameKey = null, domHit = null;
// the frame every mini-game shares: top bar with score and record, a canvas, room for buttons, and the game-over sheet.
// The first time a game is lost the player gets a question; a right answer lets them carry on (education as a bonus, never a gate).
function shell(id, unit, hint) {
  const best0 = S.best[id] || 0;
  app.innerHTML = `<div class="page snake">
    <header class="topbar"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button>
      <span class="pill" id="g-score">${unit} 0</span><span class="pill soft" id="g-info"></span><span class="grow"></span><span class="pill alt" id="g-best">🏆 ${best0}</span></header>
    <div class="sn-wrap g-${id}"><canvas class="sn-cv"></canvas><div class="g-dom" id="g-dom"></div><div class="sn-over" id="sn-over" hidden></div></div>
    <p class="hintline">${hint}</p></div>`;
  const cv = app.querySelector('.sn-cv'), ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const g = { id, cv, ctx, W: cv.clientWidth, H: cv.clientHeight, dom: app.querySelector('#g-dom'), score: 0, revived: false, over: false, t: 0, pops: [] };
  cv.width = g.W * dpr; cv.height = g.H * dpr;
  g.live = () => view === id && cv.isConnected;
  g.add = n => { g.score = Math.max(0, g.score + n); app.querySelector('#g-score').textContent = unit + ' ' + g.score; };
  g.info = s => { const e = app.querySelector('#g-info'); if (e.textContent !== s) e.textContent = s; };
  g.pop = (x, y, t) => g.pops.push({ x, y, t, life: 0.8 });
  g.drawPops = dt => {
    g.pops = g.pops.filter(p => (p.life -= dt) > 0);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `800 26px ${GFONT}`; ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.fillStyle = '#5a3fd6';
    g.pops.forEach(p => { ctx.globalAlpha = Math.min(1, p.life * 2.5); const y = p.y - (0.8 - p.life) * 60; ctx.strokeText(p.t, p.x, y); ctx.fillText(p.t, p.x, y); });
    ctx.globalAlpha = 1;
  };
  g.end = resume => {
    if (g.over) return;
    g.over = true; sfx('bad'); buzz(220);
    const o = app.querySelector('#sn-over'), q = !g.revived && resume && g.score > 0 ? bonusQ() : null;
    const fin = () => {
      hush();
      const r = gameEnd(id, g.score);
      if (r.rec) app.querySelector('#g-best').textContent = '🏆 ' + g.score;
      o.innerHTML = overHTML(id, unit, g.score, r); o.hidden = false;
      if (r.rec || r.won || r.dailyWon) sfx('win');
    };
    if (!q) return fin();
    g.revived = true;
    o.innerHTML = `<b class="chip sun">💖 ${T('chance')}</b><p class="sn-q">${q.q}</p>${q.stim ? `<div class="stim mini">${q.stim}</div>` : ''}
      <div class="g-opts">${q.opts.map((t, i) => `<button class="btn" data-act="revive" data-i="${i}">${t}</button>`).join('')}</div>
      <button class="btn alt small" data-act="revive" data-i="-1">${T('skip')}</button>`;
    o.hidden = false; say(q.q, S.lang);
    reviveCb = i => {
      reviveCb = null;
      if (!g.live()) return;
      if (i === q.ans) { stat().smart++; save(); sfx('good'); buzz([20, 30, 45]); o.hidden = true; o.innerHTML = ''; g.over = false; resume(); }
      else { if (i >= 0) sfx('whoosh'); fin(); }
    };
  };
  // update(dt) runs every frame; dt is 0 while the game-over sheet is up
  g.loop = update => {
    let last = performance.now();
    const f = now => {
      if (!g.live()) return;
      const dt = g.over ? 0 : Math.min(0.05, (now - last) / 1000); last = now; g.t += dt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      update(dt);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  g.img = (img, x, y, h, bottom) => { if (!img.naturalWidth) return h; const w = h * img.naturalWidth / img.naturalHeight; ctx.drawImage(img, x - w / 2, bottom ? y - h : y - h / 2, w, h); return w; };
  g.anim = (img, n, fps, x, y, h, bottom) => { if (!img.naturalWidth) return; const fw = img.naturalWidth / n, w = h * fw / img.naturalHeight; ctx.drawImage(img, (Math.floor(g.t * fps) % n) * fw, 0, fw, img.naturalHeight, x - w / 2, bottom ? y - h : y - h / 2, w, h); };
  // a world backdrop that covers the canvas and slides sideways by `off` pixels
  g.back = (img, off) => {
    if (!img.naturalWidth) { ctx.fillStyle = '#bfe3ff'; ctx.fillRect(0, 0, g.W, g.H); return; }
    const s = g.H / img.naturalHeight, bw = img.naturalWidth * s;
    for (let x = -(((off % bw) + bw) % bw); x < g.W; x += bw - 1) ctx.drawImage(img, x, 0, bw, g.H);
  };
  domHit = null; gameKey = null;
  window.__chispa.game = () => g;   // for automated play-tests
  return g;
}

/* the cat runs by itself; tap to jump over what is in the way */
function vRun() {
  const g = shell('run', '⭐', T('runHint')), { ctx } = g, w = pick(WORLDS), bg = gi('bg_' + w.id), obs = [0, 1, 2].map(i => gi(`ob_${w.id}_${i}`));
  const k = g.H / 520, gy = g.H * 0.9, ch = Math.min(g.H * 0.27, 150), cx = g.W * 0.22, GR = 2600 * k, JV = Math.sqrt(2 * GR * ch * 1.3);
  const top = (S.age === 0 ? 360 : 520) * k;
  let y = 0, vy = 0, jumps = 0, speed = (S.age === 0 ? 200 : 250) * k, dist = 0, next = g.W * 0.9, items = [];
  const jump = () => { if (g.over || jumps >= 2) return; vy = JV * (jumps ? 0.82 : 1); jumps++; sfx('whoosh'); };
  g.cv.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });
  gameKey = key => { if (key === ' ' || key === 'ArrowUp') jump(); };
  g.state = () => ({ y, jumps, speed, items, cx, ch, gy });
  g.loop(dt => {
    speed = Math.min(top, speed + dt * 6 * k); dist += speed * dt;
    vy -= GR * dt; y += vy * dt; if (y <= 0) { y = 0; vy = 0; jumps = 0; }
    if (dist >= next) {
      const img = pick(obs), h = ch * (0.5 + Math.random() * 0.2), gap = speed * (1.05 + Math.random() * 0.9);
      items.push({ ob: true, img, h, x: g.W + 80 });
      if (Math.random() < 0.6) items.push({ x: g.W + 80 + gap * (0.35 + Math.random() * 0.3), up: ch * (0.45 + Math.random() * 1.2) });
      next = dist + gap;
    }
    g.back(bg, dist * 0.5);
    for (const it of items) {
      it.x -= speed * dt;
      if (it.ob) {
        const ow = g.img(it.img, it.x, gy, it.h, true);
        if (!it.done && Math.abs(it.x - cx) < ow * 0.34 + ch * 0.16 && y < it.h * 0.72) { g.end(() => { items = items.filter(o => o.x > g.W * 0.8); vy = 0; }); }
        else if (!it.done && it.x < cx - ow * 0.5 - ch * 0.2) { it.done = true; g.add(1); }
      } else if (!it.done) {
        const fy = gy - it.up + Math.sin(g.t * 5 + it.x * 0.01) * 4;
        g.img(fishImg, it.x, fy, ch * 0.34);
        if (Math.abs(it.x - cx) < ch * 0.36 && Math.abs(gy - y - ch * 0.5 - fy) < ch * 0.6) { it.done = true; g.add(1); sfx('tap'); buzz(15); g.pop(it.x, fy, '+1'); }
      }
    }
    items = items.filter(it => it.x > -120);
    ctx.fillStyle = 'rgba(20,20,40,.22)'; ctx.beginPath(); ctx.ellipse(cx, gy - 2, ch * 0.3 * (1 - Math.min(0.6, y / (ch * 3))), ch * 0.06, 0, 0, 7); ctx.fill();
    g.anim(walkAnim, 16, y > 0 ? 0 : 16, cx, gy - y, ch, true);
    g.drawPops(dt);
  });
  sfx('meow');
}

/* fish fall from the sky: slide the cat under them, but keep it dry */
function vCatch() {
  const g = shell('catch', '🐟', T('catchHint')), { ctx } = g, bg = gi('bg_nature'), gold = gi('g_goldfish'), drop = gi('g_drop');
  const k = g.H / 520, ch = Math.min(g.H * 0.25, 140), by = g.H - 6, easy = S.age === 0;
  let cx = g.W / 2, tx = cx, lives = 3, items = [], spawn = 0.5;
  const hearts = () => g.info('❤️'.repeat(lives) + '🤍'.repeat(3 - lives));
  const aim = e => { tx = Math.max(ch * 0.4, Math.min(g.W - ch * 0.4, e.clientX - g.cv.getBoundingClientRect().left)); };
  g.cv.addEventListener('pointerdown', e => { e.preventDefault(); aim(e); });
  g.cv.addEventListener('pointermove', aim);
  gameKey = key => { if (key === 'ArrowLeft') tx = Math.max(ch * 0.4, tx - g.W * 0.16); if (key === 'ArrowRight') tx = Math.min(g.W - ch * 0.4, tx + g.W * 0.16); };
  g.state = () => ({ items, cx, lives, ch, by, set: x => { tx = cx = x; } });
  hearts();
  g.loop(dt => {
    const hard = Math.min(1, g.t / 80);
    cx += (tx - cx) * Math.min(1, dt * 16);
    if (dt && (spawn -= dt) <= 0) {
      const r = Math.random(), kind = r < 0.18 + hard * 0.2 ? 'drop' : r > 0.92 ? 'gold' : 'fish';
      items.push({ kind, x: ch * 0.4 + Math.random() * (g.W - ch * 0.8), y: -40, v: (150 + hard * 190 + Math.random() * 60) * k * (easy ? 0.75 : 1), ph: Math.random() * 6 });
      spawn = 0.6 - hard * 0.3 + Math.random() * 0.3;
    }
    g.back(bg, 0);
    for (const it of items) {
      it.y += it.v * dt;
      ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.kind === 'drop' ? 0 : Math.sin(g.t * 4 + it.ph) * 0.3);
      g.img(it.kind === 'drop' ? drop : it.kind === 'gold' ? gold : fishImg, 0, 0, ch * (it.kind === 'drop' ? 0.46 : 0.4)); ctx.restore();
      if (!it.done && it.y > by - ch * 0.95 && it.y < by - ch * 0.3 && Math.abs(it.x - cx) < ch * 0.42) {
        it.done = true;
        if (it.kind === 'drop') {
          lives--; hearts(); sfx('bad'); buzz([70, 50, 70]); g.pop(it.x, it.y - 20, '💦');
          if (lives <= 0) g.end(() => { lives = 1; hearts(); items = []; });
        } else { const n = it.kind === 'gold' ? 3 : 1; g.add(n); sfx(n > 1 ? 'good' : 'tap'); buzz(15); g.pop(it.x, it.y - 20, '+' + n); }
      }
    }
    items = items.filter(it => !it.done && it.y < g.H + 60);
    g.img(catSit, cx, by, ch, true);
    g.drawPops(dt);
  });
  sfx('meow');
}

/* tap to flap: collect the stars, keep away from the grumpy clouds */
function vFly() {
  const g = shell('fly', '⭐', T('flyHint')), { ctx } = g, cloud = gi('g_cloud'), star = gi('g_star');
  const k = g.H / 520, ch = Math.min(g.H * 0.17, 96), cx = g.W * 0.26, GR = 1500 * k, top = (S.age === 0 ? 250 : 360) * k;
  let y = g.H * 0.45, vy = 0, speed = (S.age === 0 ? 150 : 190) * k, dist = 0, next = g.W * 0.8, items = [], started = false;
  const puffs = Array.from({ length: 7 }, (_, i) => ({ x: Math.random() * g.W, y: Math.random() * g.H * 0.9, r: 26 + Math.random() * 34, s: 0.2 + Math.random() * 0.3 }));
  const flap = () => { if (g.over) return; started = true; vy = -430 * k; sfx('whoosh'); };
  g.cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
  gameKey = key => { if (key === ' ' || key === 'ArrowUp') flap(); };
  g.state = () => ({ y, vy, items, cx, ch, started });
  g.loop(dt => {
    if (started) {
      speed = Math.min(top, speed + dt * 4 * k); dist += speed * dt;
      vy += GR * dt; y += vy * dt;
      if (y < ch * 0.5) { y = ch * 0.5; vy = 0; }
      if (y > g.H - ch * 0.5) { y = g.H - ch * 0.5; vy = -160 * k; }
      if (dist >= next) {
        const cs = ch * (1 + Math.random() * 0.35), cy = cs * 0.5 + Math.random() * (g.H - cs), x = g.W + 90;
        items.push({ cloud: true, x, y: cy, s: cs });
        if (Math.random() < 0.3 + Math.min(0.4, g.t / 150)) { const y2 = (cy + g.H * (0.42 + Math.random() * 0.16)) % g.H; items.push({ cloud: true, x: x + 30, y: Math.max(cs * 0.5, Math.min(g.H - cs * 0.5, y2)), s: cs }); }
        items.push({ x: x + speed * 0.75, y: ch + Math.random() * (g.H - ch * 2) });
        next = dist + speed * (1.5 + Math.random() * 0.5);
      }
    }
    const sky = ctx.createLinearGradient(0, 0, 0, g.H); sky.addColorStop(0, '#7cc4ff'); sky.addColorStop(1, '#e3f4ff');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, g.W, g.H);
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    for (const p of puffs) {
      p.x -= speed * p.s * dt * (started ? 1 : 0.3); if (p.x < -p.r * 3) { p.x = g.W + p.r * 3; p.y = Math.random() * g.H * 0.9; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.arc(p.x + p.r, p.y + p.r * 0.2, p.r * 0.75, 0, 7); ctx.arc(p.x - p.r, p.y + p.r * 0.25, p.r * 0.65, 0, 7); ctx.fill();
    }
    for (const it of items) {
      it.x -= speed * dt;
      const d = Math.hypot(it.x - cx, it.y - y);
      if (it.cloud) {
        g.img(cloud, it.x, it.y + Math.sin(g.t * 2 + it.x * 0.01) * 3, it.s);
        if (d < it.s * 0.36 + ch * 0.27) g.end(() => { items = []; y = g.H * 0.45; vy = 0; started = false; });
      } else if (!it.done) {
        g.img(star, it.x, it.y, ch * 0.5 * (1 + Math.sin(g.t * 6 + it.x) * 0.06));
        if (d < ch * 0.62) { it.done = true; g.add(1); sfx('tap'); buzz(15); g.pop(it.x, it.y, '+1'); }
      }
    }
    items = items.filter(it => it.x > -120);
    ctx.save(); ctx.translate(cx, y); ctx.rotate(Math.max(-0.35, Math.min(0.5, vy / (900 * k))));
    g.anim(flyAnim, 16, 14, 0, 0, ch); ctx.restore();
    g.drawPops(dt);
  });
  sfx('meow');
}

/* mice pop out of their holes for a moment: tap them, but leave the hedgehog alone */
function vWhack() {
  const g = shell('whack', '🐭', T('whackHint')), easy = S.age === 0, up = {};
  let left = 40;
  g.cv.hidden = true;
  g.dom.innerHTML = `<div class="wh-grid">${Array.from({ length: 9 }, (_, i) => `<button class="wh-hole" data-act="dom" data-i="${i}" aria-label="${i + 1}"><span class="wh-pop"></span></button>`).join('')}</div>`;
  const holes = [...g.dom.querySelectorAll('.wh-hole')];
  const hide = i => { up[i] = null; holes[i].classList.remove('up'); };
  const pop = () => {
    if (!g.live()) return;
    const free = holes.map((_, i) => i).filter(i => !up[i]);
    if (!g.over && free.length > 5) {
      const i = pick(free), tk = up[i] = { bad: Math.random() < 0.2 }, hard = Math.min(1, g.t / 40);
      holes[i].querySelector('.wh-pop').innerHTML = pic(tk.bad ? 'g_hedgehog' : 'g_mouse');
      holes[i].classList.add('up');
      setTimeout(() => { if (up[i] === tk) hide(i); }, (easy ? 1600 : 1200) - hard * 450);
    }
    setTimeout(pop, 330 + Math.random() * 480 - Math.min(180, g.t * 4));
  };
  domHit = (d, b) => {
    const i = +d.i, u = up[i];
    if (!u || g.over) return;
    hide(i); b.classList.add(u.bad ? 'ouch' : 'hit'); setTimeout(() => b.classList.remove('hit', 'ouch'), 320);
    if (u.bad) { left = Math.max(0, left - 4); sfx('bad'); buzz([70, 50, 70]); floatEm(b, '−4 ⏱', b.clientWidth / 2 - 22, 0); }
    else { g.add(1); sfx(Math.random() < 0.12 ? 'meow' : 'tap'); buzz(20); floatEm(b, '+1', b.clientWidth / 2 - 10, 0); }
  };
  g.state = () => ({ up, left });
  g.loop(dt => {
    left -= dt; g.info('⏱ ' + Math.max(0, Math.ceil(left)));
    if (left <= 0) g.end(() => { left = 12; });
  });
  pop();
}

/* find the matching sticker pairs before the clock runs out; every cleared board adds time and cards */
function vMemory() {
  const g = shell('memory', '🃏', T('memHint')), all = WORLDS.flatMap(w => w.stickers.map((_, i) => `st_${w.id}_${i}`));
  let left = 60, round = 0, open = [], busy = false, remain = 0, cards = [];
  g.cv.hidden = true;
  const deal = () => {
    if (!g.live()) return;
    const pairs = [3, 4, 6, 6, 8][Math.min(round, 4)];
    cards = shuffle(sample(all, pairs).flatMap(x => [x, x])); remain = pairs; open = []; busy = false;
    g.dom.innerHTML = `<div class="mm-grid" style="--c:${pairs === 4 || pairs === 8 ? 4 : 3}">${cards.map((c, i) => `<button class="mm-card" data-act="dom" data-i="${i}" aria-label="${i + 1}"><span class="mm-back">🐾</span>${pic(c)}</button>`).join('')}</div>`;
  };
  domHit = (d, b) => {
    const i = +d.i;
    if (busy || g.over || b.classList.contains('up')) return;
    b.classList.add('up'); sfx('tap'); open.push(i);
    if (open.length < 2) return;
    const [x, y] = open, els = g.dom.querySelectorAll('.mm-card'); open = [];
    if (cards[x] === cards[y]) {
      els[x].classList.add('done'); els[y].classList.add('done'); g.add(1); sfx('good'); buzz(25);
      if (--remain === 0) { round++; left += 12; busy = true; setTimeout(deal, 750); }
    } else { busy = true; setTimeout(() => { els[x].classList.remove('up'); els[y].classList.remove('up'); busy = false; }, 750); }
  };
  g.state = () => ({ cards, left, round });
  g.loop(dt => {
    left -= dt; g.info('⏱ ' + Math.max(0, Math.ceil(left)));
    if (left <= 0) g.end(() => { left = 20; });
  });
  deal();
}

/* tap a group of two or more touching blocks of one colour: they burst, the rest fall and new ones drop in */
function vBlocks() {
  const g = shell('blocks', '🧊', T('blocksHint')), { ctx } = g, cube = [0, 1, 2, 3, 4].map(i => gi('b_' + i)), bg = gi('bg_mix');
  const COLS = 7, ROWS = Math.max(7, Math.min(11, Math.floor(g.H / (g.W / COLS)))), cs =Math.floor(Math.min(g.W / COLS, g.H / ROWS)), ox = (g.W - cs * COLS) / 2, oy = (g.H + cs * ROWS) / 2;
  const KIND = [['#ff5d6c', '♥'], ['#3d8bfd', '●'], ['#2fbf71', '▲'], ['#f5a524', '★'], ['#9b6bff', '■']], nk = S.age === 0 ? 4 : 5;
  // grid[c] is one column, bottom block first; y is where the block is drawn (in rows) while it falls to its place
  let grid, moves = 25, bits = [], idle = 0;
  const fresh = y => ({ k: rnd(nk), y, sq: 0 });
  const group = (c, r) => {
    const k = grid[c][r].k, seen = new Set([c * 100 + r]), todo = [[c, r]];
    while (todo.length) {
      const [x, y] = todo.pop();
      for (const [a, b] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (a < 0 || a >= COLS || b < 0 || b >= ROWS || seen.has(a * 100 + b) || grid[a][b].k !== k) continue;
        seen.add(a * 100 + b); todo.push([a, b]);
      }
    }
    return [...seen].map(v => [Math.floor(v / 100), v % 100]);
  };
  const playable = () => grid.some((col, c) => col.some((_, r) => (c + 1 < COLS && grid[c + 1][r].k === col[r].k) || (r + 1 < ROWS && col[r + 1].k === col[r].k)));
  const deal = () => { do { grid = Array.from({ length: COLS }, () => Array.from({ length: ROWS }, (_, r) => fresh(r + ROWS))); } while (!playable()); };
  const tap = (c, r) => {
    if (g.over || moves <= 0 || c < 0 || c >= COLS || r < 0 || r >= ROWS || grid[c][r].y > r + 0.4) return 0;
    const grp = group(c, r), n = grp.length, x = ox + (c + 0.5) * cs, y = oy - (r + 0.5) * cs;
    if (n < 2) { sfx('whoosh'); grid[c][r].sh = 0.3; return 0; }
    const pts = n < 4 ? n : n < 7 ? n * 2 : n * 3;
    moves--; g.add(pts); g.pop(x, y, n >= 7 ? `WOW +${pts}` : '+' + pts); sfx(n >= 5 ? 'good' : 'gem', grid[c][r].k % 4); buzz(n >= 5 ? [25, 30, 60] : 18);
    for (const [a, b] of grp) {
      for (let i = 0; i < 3; i++) bits.push({ x: ox + (a + 0.5) * cs, y: oy - (b + 0.5) * cs, vx: (Math.random() - 0.5) * 260, vy: -80 - Math.random() * 220, c: KIND[grid[a][b].k][0], life: 0.5 });
      grid[a][b] = null;
    }
    grid = grid.map(col => { const keep = col.filter(Boolean), add = ROWS - keep.length; for (let i = 0; i < add; i++) keep.push(fresh(ROWS + i)); return keep; });
    if (!playable()) deal();
    return n;
  };
  g.cv.addEventListener('pointerdown', e => {
    e.preventDefault();
    const r = g.cv.getBoundingClientRect();
    tap(Math.floor((e.clientX - r.left - ox) / cs), Math.floor((oy - (e.clientY - r.top)) / cs));
  });
  g.state = () => ({ grid, moves, tap, group, COLS, ROWS });
  deal();
  g.loop(dt => {
    g.info('👆 ' + moves);
    g.back(bg, g.t * 6);
    ctx.fillStyle = 'rgba(24,18,58,.55)'; ctx.fillRect(0, 0, g.W, g.H);
    ctx.fillStyle = 'rgba(20,14,60,.55)'; ctx.beginPath(); ctx.roundRect(ox - 4, oy - cs * ROWS - 4, cs * COLS + 8, cs * ROWS + 8, 14); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(ox - 4, oy - cs * ROWS - 4, cs * COLS + 8, cs * ROWS + 8); ctx.clip();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `800 ${Math.round(cs * 0.5)}px ${GFONT}`;
    let falling = false;
    grid.forEach((col, c) => col.forEach((b, r) => {
      if (b.y > r) { b.y = Math.max(r, b.y - dt * 16); falling = true; }
      if (b.sh) b.sh = Math.max(0, b.sh - dt);
      const x = ox + c * cs + (b.sh ? Math.sin(b.sh * 60) * 3 : 0), y = oy - (b.y + 1) * cs, img = cube[b.k];
      // a block squashes a little as it lands
      const land = b.y > r ? 0 : Math.max(0, (b.sq = Math.max(0, (b.sq || 0) - dt * 5))), sx = 1 + land * 0.12, sy = 1 - land * 0.14;
      if (b.y > r) b.sq = 1;
      if (img.naturalWidth) ctx.drawImage(img, x + cs / 2 - cs * 0.48 * sx, y + cs - cs * 0.96 * sy, cs * 0.96 * sx, cs * 0.96 * sy);
      else { ctx.fillStyle = KIND[b.k][0]; ctx.beginPath(); ctx.roundRect(x + 2, y + 2, cs - 4, cs - 4, cs * 0.2); ctx.fill(); }
    }));
    ctx.restore();
    bits = bits.filter(b => (b.life -= dt) > 0);
    for (const b of bits) { b.vy += 900 * dt; b.x += b.vx * dt; b.y += b.vy * dt; ctx.globalAlpha = b.life * 2; ctx.fillStyle = b.c; ctx.beginPath(); ctx.roundRect(b.x - 5, b.y - 5, 10, 10, 3); ctx.fill(); }
    ctx.globalAlpha = 1;
    g.drawPops(dt);
    // out of moves: let the last blocks land, then end (a right answer gives a few more moves)
    idle = moves <= 0 && !falling ? idle + dt : 0;
    if (idle > 0.6) { idle = 0; g.end(() => { moves = 6; }); }
  });
  sfx('meow');
}

/* cats race karts up the road: slide to steer, overtake the others, keep away from cones */
function vKart() {
  const g = shell('kart', '🏁', T('kartHint')), { ctx } = g, easy = S.age === 0, k = g.H / 520;
  const me = gi('k_player'), rivals = [0, 1, 2, 3].map(i => gi('k_rival_' + i)), cone = gi('k_cone'), deco = [gi('k_tree'), gi('k_bush'), gi('k_tyres'), gi('k_tree')];
  const rl = g.W * 0.13, rr = g.W * 0.87, lane = (rr - rl) / 3, kh = Math.min(g.H * 0.17, lane * 0.98), kw = kh * 0.74, py = g.H * 0.8, top = (easy ? 360 : 480) * k;
  let cx = g.W / 2, tx = cx, speed = (easy ? 190 : 230) * k, dist = 0, next = 200 * k, nextDeco = 0, lives = 3, safe = 0, items = [], side = [], puffs = [], puffT = 0;
  const hearts = () => g.info('❤️'.repeat(lives) + '🤍'.repeat(3 - lives));
  const clampX = x => Math.max(rl + kw * 0.55, Math.min(rr - kw * 0.55, x));
  const aim = e => { tx = clampX(e.clientX - g.cv.getBoundingClientRect().left); };
  g.cv.addEventListener('pointerdown', e => { e.preventDefault(); aim(e); });
  g.cv.addEventListener('pointermove', aim);
  gameKey = key => { if (key === 'ArrowLeft') tx = clampX(tx - lane); if (key === 'ArrowRight') tx = clampX(tx + lane); };
  g.state = () => ({ items, cx, lives, speed, kw, kh, py, lane, rl, set: x => { tx = cx = x; } });
  const shadow = (x, y, w, h) => { ctx.fillStyle = 'rgba(15,12,40,.28)'; ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, 7); ctx.fill(); };
  const kart = (img, x, y, tilt) => {
    shadow(x, y + kh * 0.36, kh * 0.5, kh * 0.16);
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); g.img(img, 0, 0, kh); ctx.restore();
  };
  // the road is drawn once into a tile that repeats every 240 px, so every frame is two picture copies
  const TILE = 240, road = document.createElement('canvas');
  road.width = Math.ceil(g.W); road.height = TILE;
  (() => {
    const x = road.getContext('2d');
    for (let y = 0; y < TILE; y += 60) { x.fillStyle = (y / 60) % 2 ? '#7fce63' : '#74c259'; x.fillRect(0, y, g.W, 60); }
    x.fillStyle = 'rgba(255,255,255,.16)';
    for (let i = 0; i < 26; i++) { const gx = (i * 53) % rl, gy = (i * 97) % TILE; x.fillRect(gx, gy, 3, 7); x.fillRect(g.W - gx - 3, (gy + 40) % TILE, 3, 7); }
    const as = x.createLinearGradient(rl, 0, rr, 0); as.addColorStop(0, '#4a4c63'); as.addColorStop(0.5, '#62657e'); as.addColorStop(1, '#4a4c63');
    x.fillStyle = as; x.fillRect(rl, 0, rr - rl, TILE);
    x.fillStyle = 'rgba(255,255,255,.05)';
    for (let i = 0; i < 90; i++) x.fillRect(rl + ((i * 71) % (rr - rl)), (i * 37) % TILE, 2 + (i % 3), 2);
    for (let y = 0; y < TILE; y += 40) { x.fillStyle = (y / 40) % 2 ? '#fff' : '#ff4d5e'; x.fillRect(rl - 9, y, 9, 40); x.fillRect(rr, y, 9, 40); }
    x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(rl, 0, 4, TILE); x.fillRect(rr - 4, 0, 4, TILE);
    x.fillStyle = 'rgba(255,255,255,.85)';
    for (let y = 10; y < TILE; y += 80) for (const lx of [rl + lane, rl + lane * 2]) { x.beginPath(); x.roundRect(lx - 3, y, 6, 42, 3); x.fill(); }
  })();
  hearts();
  g.loop(dt => {
    speed = Math.min(top, speed + dt * 4 * k); dist += speed * dt; safe = Math.max(0, safe - dt);
    cx += (tx - cx) * Math.min(1, dt * 14);
    if (dist >= next) {
      const lanes = shuffle([0, 1, 2]), two = Math.random() < Math.min(0.55, 0.15 + g.t / 120), r = Math.random();
      const mk = (l, kind) => ({ kind, x: rl + lane * (l + 0.5) + (Math.random() - 0.5) * lane * 0.2, y: -kh, v: kind === 'cat' ? 0.4 + Math.random() * 0.2 : 1, i: rnd(4), ph: Math.random() * 6 });
      items.push(mk(lanes[0], r < 0.62 ? 'cat' : r < 0.84 ? 'cone' : 'fish'));
      if (two) items.push(mk(lanes[1], Math.random() < 0.5 ? 'cone' : 'cat'));
      next = dist + kh * (3.6 + Math.random() * 1.8);
    }
    if (dist >= nextDeco) {
      const left = Math.random() < 0.5, img = pick(deco), h = rl * (img === deco[0] ? 1.9 : 1.1);
      side.push({ img, h, x: left ? rl * 0.42 : g.W - rl * 0.42, y: -h });
      nextDeco = dist + 70 + Math.random() * 150;
    }
    for (let y = (dist % TILE) - TILE; y < g.H; y += TILE) ctx.drawImage(road, 0, y, g.W, TILE);
    // the start line slides away under the wheels
    if (dist < g.H) for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = (i + j) % 2 ? '#fff' : '#26233a'; ctx.fillRect(rl + (rr - rl) / 12 * i, py - kh * 0.9 + dist + j * 12, (rr - rl) / 12 + 1, 12); }
    for (const d of side) { d.y += speed * dt; shadow(d.x, d.y + d.h * 0.46, d.h * 0.3, d.h * 0.09); g.img(d.img, d.x, d.y, d.h); }
    side = side.filter(d => d.y < g.H + d.h);
    if (dt && (puffT -= dt) <= 0) { puffT = 0.07; puffs.push({ x: cx + (Math.random() - 0.5) * kw * 0.7, y: py + kh * 0.42, r: 4 + Math.random() * 5, life: 0.45 }); }
    for (const p of puffs) { p.life -= dt; p.y += speed * 0.7 * dt; p.r += 22 * dt; ctx.globalAlpha = Math.max(0, p.life) * 1.1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1; puffs = puffs.filter(p => p.life > 0);
    for (const it of items) {
      it.y += speed * it.v * dt;
      const ix = it.kind === 'cat' && !easy ? it.x + Math.sin(g.t * 1.6 + it.ph) * lane * 0.14 : it.x;
      const hitX = Math.abs(ix - cx), hitY = Math.abs(it.y - py);
      if (it.kind === 'cat') {
        if (it.spin) { it.spin += dt * 9; it.x += it.dir * 260 * dt; }
        kart(rivals[it.i], ix, it.y, it.spin || Math.sin(g.t * 1.6 + it.ph + 1.5) * 0.06);
        if (!it.done && !it.spin && it.y > py + kh * 0.75) { it.done = true; g.add(1); g.pop(cx, py - kh * 0.8, '+1'); sfx('tap'); }
      } else if (it.kind === 'cone') { shadow(it.x, it.y + kh * 0.2, kh * 0.24, kh * 0.08); g.img(cone, it.x, it.y, kh * 0.5); }
      else if (!it.done) g.img(fishImg, it.x, it.y, kh * 0.4 * (1 + Math.sin(g.t * 6 + it.ph) * 0.06));
      if (it.done || it.spin) continue;
      if (it.kind === 'fish') { if (hitX < kw * 0.7 && hitY < kh * 0.6) { it.done = true; g.add(2); g.pop(it.x, it.y, '+2'); sfx('good'); buzz(15); } continue; }
      const wide = it.kind === 'cat' ? kw * 0.82 : kw * 0.5 + kh * 0.14, tall = it.kind === 'cat' ? kh * 0.8 : kh * 0.55;
      if (!safe && hitX < wide && hitY < tall) {
        it.done = true; if (it.kind === 'cat') { it.spin = 0.01; it.dir = ix < cx ? -1 : 1; }
        lives--; safe = 1.2; hearts(); sfx('bad'); buzz([70, 50, 70]); g.pop(cx, py - kh * 0.8, '💥'); speed *= 0.7;
        if (lives <= 0) g.end(() => { lives = 1; hearts(); items = []; safe = 1.5; });
      }
    }
    items = items.filter(it => it.y < g.H + kh && !(it.done && it.kind !== 'cat'));
    if (!safe || Math.floor(g.t * 12) % 2) kart(me, cx, py, Math.max(-0.28, Math.min(0.28, (tx - cx) / lane * 0.5)));
    g.drawPops(dt);
  });
  sfx('meow');
}

/* ---------- input ---------- */
const ACT = {
  set(d) {
    if (d.k === 'age' && +d.v !== S.age) { // each age group keeps its own stars and stickers
      S.byAge[S.age] = { stars: S.stars, stickers: S.stickers };
      const p = S.byAge[+d.v] || {}; S.stars = p.stars || {}; S.stickers = p.stickers || [];
    }
    S[d.k] = d.k === 'age' ? +d.v : d.k === 'sound' || d.k === 'vibe' ? d.v === 'true' : d.v;
    if (d.k === 'vibe' && S.vibe) buzz(60);
    if (d.k === 'lang' && !S.setup) S.learn = S.lang === 'es' ? 'en' : S.lang === 'en' ? 'es' : 'both';
    save(); sfx('tap'); show(view);
  },
  start() { S.setup = true; save(); sfx('good'); show('map'); },
  go(d) { sfx('tap'); show(d.v); },
  revive(d) { if (reviveCb) reviveCb(+d.i); },
  vtest() {
    let r; try { r = window.ElGatoApp ? (ElGatoApp.vibrate('500,200,500'), true) : navigator.vibrate ? navigator.vibrate([500, 200, 500]) : null; } catch (e) { r = false; }
    vibeMsg = r === null ? 'vNone' : r ? 'vSent' : 'vBlocked'; show(view);
  },
  dom(d, b) { if (domHit) domHit(d, b); },
  level(d) { sfx('tap'); startLevel(d.w, +d.i); },
  mute(d, b) { S.sound = !S.sound; save(); b.textContent = S.sound ? '🔊' : '🔇'; if (!S.sound) { hush(); } },
  say(d) { say(d.text, d.lang); },
  reset() {
    if (!resetArmed) { resetArmed = true; return vSettings(); }
    S.stars = {}; S.stickers = []; S.byAge = {}; S.best = {}; S.stat = null; S.daily = null; S.setup = false; save(); show('title');
  },
  pet(d, b) { sfx('meow'); b.classList.remove('boing'); void b.offsetWidth; b.classList.add('boing'); floatEm(b, pick(['💗', '💜', '😻']), b.clientWidth / 2 - 12, -6); },
  hi5(d, b) {
    if (!cur || !cur.hi) return;
    cur.hi = 0; sfx('clap'); buzz([35, 25, 170]); b.classList.add('hit');
    // stars fly out of the paw, which sits at 79% / 20% of the picture
    for (let i = 0; i < 10; i++) floatEm(b.parentNode, pick(['✨', '⭐', '💜', '💥']), b.offsetLeft + b.offsetWidth * 0.79 - 14 + rnd(90) - 45, b.offsetTop + b.offsetHeight * 0.2 - 14 + rnd(70) - 35);
    later(800, walk);
  },
  ptile(d) {
    const z = cur && cur.pz, i = +d.i; if (!z || z.lock) return;
    sfx('tap');
    if (z.sel < 0) z.sel = i;
    else { [z.order[z.sel], z.order[i]] = [z.order[i], z.order[z.sel]]; z.sel = -1; }
    paintPz();
    if (z.order.every((v, k) => v === k)) {
      z.lock = true; $('.pz').classList.add('solved'); sfx('good');
      const t = S.age, w = z.w, lang = z.lang;
      later(1100, () => {
        const m = mix(up(wd(w, lang)), sample(V.filter(x => x !== w), nOpt(t) - 1).map(x => up(wd(x, lang))));
        cur.ch = { type: 'choice', q: T('q_picWord'), stim: big(w[0]) + '<span class="brk"></span>' + chip(lang), ...m, cls: 'txt', after: [wd(w, lang), lang] };
        cur.wrong = 0; renderCh();
      });
    }
  },
  opt(d, b) {
    const c = cur && cur.ch; if (!c || cur.lock || b.classList.contains('no')) return;
    if (+d.i === c.ans) { b.classList.add('ok'); solved(); }
    else {
      b.classList.add('no'); mistake();
      if (++cur.wrong >= 2) $('.opts').children[c.ans].classList.add('hint');
    }
  },
  tile(d, b) {
    const c = cur && cur.ch; if (!c || cur.lock) return;
    if (b.textContent === c.word[c.pos]) {
      const slots = $('.slots').children;
      slots[c.pos].textContent = b.textContent; slots[c.pos].classList.remove('cur');
      b.classList.add('used'); sfx('tap'); c.pos++;
      if (c.pos === c.word.length) { c.after = [c.raw, c.lang]; solved(); } else slots[c.pos].classList.add('cur');
    } else { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); mistake(); }
  },
  card(d, b) {
    const c = cur && cur.ch, i = +d.i; if (!c || cur.lock || c.busy || b.classList.contains('up')) return;
    b.classList.add('up'); b.textContent = c.cards[i]; sfx('tap'); c.open.push(i);
    if (c.open.length < 2) return;
    const [x, y] = c.open, cards = $('.mem').children; c.open = [];
    if (c.cards[x] === c.cards[y]) {
      cards[x].classList.add('done'); cards[y].classList.add('done');
      if (--c.left === 0) solved(); else sfx('good');
    } else {
      if (c.seen.has(x) || c.seen.has(y)) mistake();
      c.seen.add(x); c.seen.add(y); c.busy = true;
      later(800, () => { [x, y].forEach(k => { cards[k].classList.remove('up'); cards[k].textContent = '★'; }); c.busy = false; });
    }
  },
  gem(d, b) {
    const c = cur && cur.ch, i = +d.i; if (!c || cur.lock || c.playing || c.playing === undefined) return;
    b.classList.add('lit'); later(200, () => b.classList.remove('lit'));
    if (i === c.seq[c.input]) { sfx('gem', i); if (++c.input === c.seq.length) solved(); }
    else { mistake(); c.playing = true; later(900, playSeq); }
  },
};
app.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b && !b.disabled) ACT[b.dataset.act](b.dataset, b);
});

window.__chispa = { state: S, cur: () => cur, G, plan, walk: () => walk() };
show(S.setup ? 'map' : 'title');
})();
