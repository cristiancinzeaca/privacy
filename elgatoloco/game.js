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
const S = { lang: 'ro', age: 1, learn: 'both', sound: true, setup: false, stars: {}, stickers: [], byAge: {} };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
if (!S.setup) {
  const n = (navigator.language || 'ro').slice(0, 2);
  if (LANGS.includes(n)) S.lang = n;
  S.learn = S.lang === 'es' ? 'en' : S.lang === 'en' ? 'es' : 'both';
}

/* ---------- text ---------- */
const STR = {
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
];
const ABC = { es: 'ABCDEFGHIJLMNÑOPQRSTUVZ', en: 'ABCDEFGHIJKLMNOPRSTUVWY' };
const GROUPS = {
  farm: W('🐮 🐷 🐑 🐴 🐰'), wild: W('🦁 🐘 🐒 🦒 🦓 🐻'), sea: W('🐟 🐬 🐋 🦈 🐙 🦀'), birds: W('🦉 🦅 🦜 🐦 🦢'), insects: W('🦋 🐝 🐜 🐞'),
  fruit: W('🍎 🍌 🍊 🍓 🍇 🍉 🍋'), veg: W('🥕 🍅 🥦 🌽 🥒'), vehicles: W('🚗 🚲 ✈️ 🚂 ⛵ 🚌'), clothes: W('👟 🎩 👕 🧦 👗'), sky: W('☀️ 🌙 ⭐ ☁️ 🌈'),
};
const FAR_PAIRS = [['fruit', 'vehicles'], ['farm', 'sky'], ['clothes', 'fruit'], ['sea', 'vehicles'], ['wild', 'veg'], ['insects', 'clothes'], ['sky', 'veg'], ['birds', 'fruit']];
const NEAR_PAIRS = [['sea', 'wild'], ['fruit', 'veg'], ['insects', 'birds'], ['sea', 'farm'], ['birds', 'wild'], ['vehicles', 'clothes']];
const SHAPES = W('🔴 🔵 ⭐ 💚 🌙 🔺 🍋 🌸');
const HAB = { sea: ['🌊', W('🐟 🐬 🐋 🦈 🐙 🦀')], farm: ['🚜', W('🐮 🐷 🐑 🐔 🐴')], jungle: ['🌴', W('🦁 🐘 🐒 🦒 🦓')], forest: ['🌲', W('🐻 🦊 🐺 🦉 🦌 🐿️')], ice: ['❄️', W('🐧')] };
const EATS = [['🐰', '🥕'], ['🐒', '🍌'], ['🐝', '🌸'], ['🐭', '🧀'], ['🐼', '🎋'], ['🐿️', '🌰'], ['🐶', '🦴'], ['🐱', '🐟'], ['🐮', '🌿'], ['🐻', '🍯']];
const LEGS = [['🐶', 4], ['🐔', 2], ['🐝', 6], ['🕷️', 8], ['🐍', 0], ['🐜', 6], ['🦆', 2], ['🐴', 4], ['🐟', 0], ['🐘', 4], ['🦋', 6], ['🐧', 2]];
const KLASS = { mammal: W('🐶 🐘 🐒 🐻 🐬 🐋 🦇'), bird: W('🦅 🦉 🐔 🦆 🐧'), fish: W('🦈 🐟 🐠'), reptile: W('🐍 🐢 🐊 🦎'), insect: W('🦋 🐝 🐜 🐞'), amph: W('🐸') };
const KLASS_HARD = W('🐬 🐋 🦇 🐧');
const DIET = { h: W('🐮 🐰 🦒 🐘 🦓 🐑 🐴'), c: W('🦁 🦈 🦅 🐺 🐊 🐍'), o: W('🐻 🐷 🐔 🐒') };
const DIET_ICON = { h: '🌿', c: '🍖', o: '🍽️' };
// [level, question, options — the first option is the correct one]
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
];

const WORLDS = [
  { id: 'words', em: '🌳', far: '🌲🌳🌲🌲🌳🌲', near: '🍄🌼🌿🌼', obst: ['🕸️', '🍄', '🚧'], stickers: W('🦊 🦉 🐿️ 🦌 🐻 🦋') },
  { id: 'math', em: '⛰️', far: '⛰️🏔️⛰️⛰️🏔️⛰️', near: '🌱🌾🌱🌾', obst: ['🧱', '🌋', '⛄'], stickers: W('🦅 🐐 🐺 🐏 🦙 🐉') },
  { id: 'logic', em: '💎', far: '💎🔮💎💎🔮💎', near: '🕯️✨🕯️✨', obst: ['🔒', '🚪', '🗝️'], night: true, stickers: W('🦇 🕷️ 🦎 🐭 🦔 🤖') },
  { id: 'nature', em: '🏝️', far: '🌴🏝️🌴🌴🏝️🌴', near: '🐚🌺🐚🌺', obst: ['🌊', '🦀', '🐊'], stickers: W('🐬 🐢 🐙 🦜 🐠 🦩') },
  { id: 'mix', em: '🏰', far: '🏰☁️✨🏰☁️✨', near: '⭐✨⭐✨', obst: ['☁️', '🌪️', '🔒'], night: true, stickers: W('🦄 🚀 👑 🪐 🌟 🏆') },
];
const CASTLE_NEED = 20, STEPS = 5, PER_WORLD = 6;
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
function sfx(name, i) {
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
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
  ({ title: vTitle, map: vMap, album: vAlbum, settings: vSettings })[v]();
}
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
  app.innerHTML = `<div class="map">
    <header class="topbar"><button class="cat mini" data-act="pet" aria-label="ElGatoLoco">${cat('sit')}</button><span class="pill">⭐ ${tot} / ${WORLDS.length * PER_WORLD * 3}</span><span class="grow"></span>
      <button class="icon-btn" data-act="go" data-v="album" aria-label="${T('album')}">📒</button>
      <button class="icon-btn" data-act="go" data-v="settings" aria-label="${T('settings')}">⚙️</button></header>
    <div class="worlds">${cards}</div></div>`;
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
  const c = G[pick(ARC[w][S.age])](S.age, cur.idx);
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
    { k: 'arc', g: GAME_ORDER[a] }, { k: 'quiz', g: qz[0] }, { k: 'break', g: idx % 2 ? 'pet' : 'tickle' },
    { k: 'arc', g: GAME_ORDER[(a + 1) % 4] }, { k: 'quiz', g: qz[1] }, { k: 'arc', g: GAME_ORDER[(a + 2) % 4] },
  ];
  cur = { world, idx, w, step: 0, pos: 0, mistakes: 0, stageMist: 0, seq, ch: null, hi: 0, hiId: 0 };
  view = 'level';
  app.innerHTML = `<div class="level w-${world}">
    <header class="topbar" style="padding-bottom:0"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button>
      <div class="steps">${'<i>★</i>'.repeat(STEPS)}</div>
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
  later(st && st.k === 'break' ? 800 : 1450, () => {
    scene.classList.remove('walking');
    if (last) return finish();
    cur.stageMist = 0; cur.wrong = 0; cur.lock = false; cur.ch = null; cur.arc = null; cur.pz = null;
    if (st.k === 'quiz') { cur.ch = G[st.g](S.age, cur.idx); renderCh(); }
    else if (st.k === 'break') petBreak(st.g);
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
  cur.mistakes++; cur.stageMist++; sfx('bad');
  const hero = $('.hero'); hero.classList.remove('oops'); void hero.offsetWidth; hero.classList.add('oops');
}
function solved() {
  cur.lock = true; sfx('good');
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
    if (now - lastFx > 260) { lastFx = now; floatEm(z, pick(mode === 'tickle' ? ['😹', '😆', '✨'] : ['💗', '💜', '😻']), x, y); sfx(mode === 'tickle' ? 'giggle' : 'purr'); }
    if (dist >= need) { done = true; sfx('meow'); kitty.classList.remove('wig'); kitty.classList.add('boing'); cur.pos++; later(1000, walk); }
  };
  z.addEventListener('pointerdown', e => { lx = null; try { z.setPointerCapture(e.pointerId); } catch (_) {} mv(e); });
  z.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') mv(e); });
  z.addEventListener('pointerup', () => { lx = null; });
}

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
  save(); sfx('win');
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

/* ---------- input ---------- */
const ACT = {
  set(d) {
    if (d.k === 'age' && +d.v !== S.age) { // each age group keeps its own stars and stickers
      S.byAge[S.age] = { stars: S.stars, stickers: S.stickers };
      const p = S.byAge[+d.v] || {}; S.stars = p.stars || {}; S.stickers = p.stickers || [];
    }
    S[d.k] = d.k === 'age' ? +d.v : d.k === 'sound' ? d.v === 'true' : d.v;
    if (d.k === 'lang' && !S.setup) S.learn = S.lang === 'es' ? 'en' : S.lang === 'en' ? 'es' : 'both';
    save(); sfx('tap'); show(view);
  },
  start() { S.setup = true; save(); sfx('good'); show('map'); },
  go(d) { sfx('tap'); show(d.v); },
  level(d) { sfx('tap'); startLevel(d.w, +d.i); },
  mute(d, b) { S.sound = !S.sound; save(); b.textContent = S.sound ? '🔊' : '🔇'; if (!S.sound) { hush(); } },
  say(d) { say(d.text, d.lang); },
  reset() {
    if (!resetArmed) { resetArmed = true; return vSettings(); }
    S.stars = {}; S.stickers = []; S.byAge = {}; S.setup = false; save(); show('title');
  },
  pet(d, b) { sfx('meow'); b.classList.remove('boing'); void b.offsetWidth; b.classList.add('boing'); floatEm(b, pick(['💗', '💜', '😻']), b.clientWidth / 2 - 12, -6); },
  hi5(d, b) {
    if (!cur || !cur.hi) return;
    cur.hi = 0; sfx('clap'); b.classList.add('hit');
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

window.__chispa = { state: S, cur: () => cur, G, plan };
show(S.setup ? 'map' : 'title');
})();
