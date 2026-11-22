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
const S = { lang: 'ro', age: 1, learn: 'both', sound: true, music: true, setup: false, stars: {}, stickers: [], byAge: {}, best: {}, vibe: true, stat: { plays: 0, smart: 0, daily: 0 }, daily: null };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
if (!S.school || !Array.isArray(S.school.m)) S.school = { m: [] };
if (!Array.isArray(S.school.r)) S.school.r = [];
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
  g_pop: ['Sparge baloanele', 'Explota los globos', 'Pop the balloons'], g_dots: ['Unește punctele', 'Une los puntos', 'Join the dots'],
  popHint: ['Sparge baloanele care se potrivesc cu ce scrie sus', 'Explota los globos que coinciden con lo de arriba', 'Pop the balloons that match what is at the top'],
  dotsHint: ['Atinge punctele în ordine: 1, 2, 3…', 'Toca los puntos en orden: 1, 2, 3…', 'Tap the dots in order: 1, 2, 3…'],
  q_mice: ['Surprize prinse', 'Sorpresas atrapadas', 'Surprises caught'], ev_caught: ['Prins!', '¡Atrapado!', 'Caught!'],
  sc_catHelp: ['Stai, te ajut eu!', '¡Espera, que te ayudo!', 'Wait, let me help!'], sc_catLook: ['Uită-te bine: răspunsul bun clipește.', 'Fíjate bien: la respuesta buena parpadea.', 'Look closely: the right answer is blinking.'],
  cine_1: ['Într-o noapte, stelele au început să cadă din cer.', 'Una noche, las estrellas empezaron a caer del cielo.', 'One night, the stars began to fall from the sky.'],
  cine_2: ['ElGatoLoco a găsit una și a pornit să le adune pe toate. Îl ajuți?', 'ElGatoLoco encontró una y salió a recogerlas todas. ¿Le ayudas?', 'ElGatoLoco found one and set off to collect them all. Will you help?'],
  cine_w: ['Stelele se întorc pe cer. Bravo!', 'Las estrellas vuelven al cielo. ¡Bravo!', 'The stars go back to the sky. Well done!'],
  cine_ch: ['Ai terminat un capitol întreg! Stelele se întorc pe cer.', '¡Has terminado un capítulo entero! Las estrellas vuelven al cielo.', 'You finished a whole chapter! The stars go back to the sky.'],
  cine_skip: ['Sari peste', 'Saltar', 'Skip'], cine_again: ['Vezi povestea', 'Ver la historia', 'Watch the story'],
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
  music: ['Muzică', 'Música', 'Music'],
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
  school: ['Școala pisicului', 'La escuela del gato', 'Cat school'], schoolSub: ['Calcule și citit, pas cu pas', 'Cálculo y lectura, paso a paso', 'Sums and reading, step by step'],
  schoolNote: ['Lecțiile merg pe rând, ca la școală: fiecare adaugă un singur lucru nou. Întâi pisicul explică, apoi descoperi, înțelegi, scrii și exersezi. Între pași te joci puțin cu pisicul.', 'Las lecciones van en orden, como en el cole: cada una añade una sola cosa nueva. Primero el gato explica; luego descubres, entiendes, escribes y practicas. Entre paso y paso juegas un poco con el gato.', 'The lessons go in order, like at school: each one adds a single new thing. First the cat explains, then you discover, understand, write and practise. Between steps you play a little with the cat.'],
  ph_ex: ['Pisicul explică', 'El gato explica', 'The cat explains'], ph_w: ['Scrie', 'Escribe', 'Write'],
  ph_0: ['Descoperă', 'Descubre', 'Discover'], ph_1: ['Înțelege', 'Entiende', 'Understand'], ph_2: ['Exersează', 'Practica', 'Practise'],
  sc_i_show: ['Arată numărul {0} cu bilele', 'Muestra el número {0} con las bolas', 'Show the number {0} with the beads'],
  sc_i_add: ['Mai adaugă {0} bile', 'Añade {0} bolas más', 'Add {0} more beads'], sc_i_sub: ['Ia {0} bile', 'Quita {0} bolas', 'Take away {0} beads'],
  sc_i_bond: ['Adaugă bile până ai {0}', 'Añade bolas hasta tener {0}', 'Add beads until you have {0}'],
  sc_i_mul: ['Fă {0} rânduri de câte {1} bile', 'Haz {0} filas de {1} bolas', 'Make {0} rows of {1} beads'],
  sc_i_div: ['Împarte {0} bile în {1} rânduri egale', 'Reparte {0} bolas en {1} filas iguales', 'Share {0} beads into {1} equal rows'],
  sc_ready: ['Gata', 'Listo', 'Done'], sc_hint: ['Trebuie să fie {0} bile', 'Tiene que haber {0} bolas', 'There should be {0} beads'],
  sc_hintRows: ['{0} rânduri de câte {1}', '{0} filas de {1}', '{0} rows of {1}'],
  sc_retry: ['Aproape! Ne mai uităm la bile și exersăm încă o dată.', '¡Casi! Miramos otra vez las bolas y practicamos de nuevo.', 'Almost! Let us look at the beads again and practise once more.'],
  sc_pass: ['Lecție terminată!', '¡Lección terminada!', 'Lesson complete!'],
  sc_math: ['Calcule', 'Cálculo', 'Sums'], sc_read: ['Citit', 'Lectura', 'Reading'], sc_next: ['Lecția următoare', 'Siguiente lección', 'Next lesson'],
  sc_true: ['Este corect?', '¿Es correcto?', 'Is it right?'], sc_type: ['Scrie rezultatul', 'Escribe el resultado', 'Type the answer'],
  sc_pop: ['Sparge balonul potrivit', 'Explota el globo correcto', 'Pop the right balloon'],
  rd_letter: ['Aceasta este litera {0}. Atinge-o!', 'Esta es la letra {0}. ¡Tócala!', 'This is the letter {0}. Tap it!'],
  rd_same: ['Găsește la fel, cu litere mari', 'Busca lo mismo en mayúsculas', 'Find the same in capital letters'],
  rd_starts: ['Cu ce silabă începe?', '¿Con qué sílaba empieza?', 'How does the word start?'],
  rd_makeSyl: ['Formează silaba {0}', 'Forma la sílaba {0}', 'Make {0}'], rd_makeWord: ['Formează cuvântul', 'Forma la palabra', 'Build the word'],
  rd_readPick: ['Citește și alege imaginea', 'Lee y elige la imagen', 'Read and pick the picture'], rd_match: ['Se potrivesc?', '¿Coinciden?', 'Do they match?'],
  rd_order: ['Pune cuvintele în ordine', 'Ordena las palabras', 'Put the words in order'],
  q_missNum: ['Ce număr lipsește?', '¿Qué número falta?', 'Which number is missing?'],
  sc_bigger: ['Care număr este mai mare?', '¿Qué número es mayor?', 'Which number is bigger?'], sc_smaller: ['Care număr este mai mic?', '¿Qué número es menor?', 'Which number is smaller?'],
  rd_small: ['Găsește aceeași literă, mică', 'Busca la misma letra en minúscula', 'Find the same letter, small'], rd_startsPic: ['Ce începe cu litera {0}?', '¿Qué empieza por la letra {0}?', 'Which one starts with {0}?'],
  rd_true: ['Citește. Este adevărat?', 'Lee. ¿Es verdad?', 'Read. Is it true?'],
  sc_more: ['Mai departe', 'Siguiente', 'Next'], sc_gotit: ['Am înțeles', 'Entendido', 'Got it'],
  sc_trace: ['Scrie cu degetul: {0}', 'Escribe con el dedo: {0}', 'Write with your finger: {0}'], sc_clear: ['Șterge', 'Borrar', 'Clear'],
  sc_traceIn: ['Mai încet, pe forma desenată', 'Más despacio, por encima de la forma', 'Slower, on top of the shape'],
  sc_tapCount: ['Atinge-le pe rând și numără', 'Tócalos uno a uno y cuenta', 'Tap them one by one and count'],
  sc_story: ['Ascultă și rezolvă', 'Escucha y resuelve', 'Listen and solve'],
  sc_match: ['Potrivește perechile', 'Une las parejas', 'Match the pairs'], sc_matchHint: ['Alege întâi din stânga', 'Elige primero a la izquierda', 'Pick one on the left first'],
  dm_show1: ['Numărăm împreună: {0}.', 'Contamos juntos: {0}.', 'Let us count together: {0}.'],
  dm_show2: ['Sunt {0}. Așa se scrie numărul {0}.', 'Hay {0}. Así se escribe el número {0}.', 'There are {0}. This is how we write the number {0}.'],
  dm_ten: ['Un rând plin are 10 bile. Îi spunem o zece.', 'Una fila llena tiene 10 bolas. La llamamos una decena.', 'A full row has 10 beads. We call it a ten.'],
  dm_tens: ['{0} rânduri pline și încă {1} bile fac numărul {2}.', '{0} filas llenas y {1} bolas más forman el número {2}.', '{0} full rows and {1} more beads make the number {2}.'],
  dm_have: ['Aici sunt {0}.', 'Aquí hay {0}.', 'Here there are {0}.'], dm_more: ['Mai vin {0}.', 'Llegan {0} más.', '{0} more arrive.'],
  dm_all: ['Le numărăm pe toate. Sunt {0}.', 'Las contamos todas. Hay {0}.', 'We count them all. There are {0}.'],
  dm_plus: ['{0} plus {1} fac {2}.', '{0} más {1} son {2}.', '{0} plus {1} makes {2}.'],
  dm_cross: ['Întâi umplem rândul până la 10, apoi punem restul dedesubt.', 'Primero llenamos la fila hasta 10 y el resto va debajo.', 'First we fill the row up to 10, then the rest goes below.'],
  dm_take: ['Luăm {0}.', 'Quitamos {0}.', 'We take away {0}.'], dm_left: ['Au rămas {0}.', 'Quedan {0}.', '{0} are left.'],
  dm_minus: ['{0} minus {1} fac {2}.', '{0} menos {1} son {2}.', '{0} minus {1} makes {2}.'],
  dm_bond1: ['Aici sunt {0}. Vrem să fie {1}.', 'Aquí hay {0}. Queremos que haya {1}.', 'Here there are {0}. We want {1}.'],
  dm_bond2: ['Mai trebuie {0}.', 'Faltan {0}.', 'We need {0} more.'],
  dm_cmp1: ['Sus sunt {0}, iar jos sunt {1}.', 'Arriba hay {0} y abajo hay {1}.', 'There are {0} on top and {1} below.'],
  dm_cmpB: ['Avem numerele {0} și {1}. Ne uităm întâi la zeci.', 'Tenemos los números {0} y {1}. Miramos primero las decenas.', 'We have the numbers {0} and {1}. We look at the tens first.'],
  dm_cmp2: ['{0} este mai mare decât {1}. {1} este mai mic decât {0}.', '{0} es mayor que {1}. {1} es menor que {0}.', '{0} is bigger than {1}. {1} is smaller than {0}.'],
  dm_seq1: ['Numerele stau la rând: {0}.', 'Los números van en fila: {0}.', 'The numbers go in order: {0}.'],
  dm_seq2: ['După {0} vine {1}. Înainte de {0} este {2}.', 'Después del {0} va el {1}. Antes del {0} está el {2}.', 'After {0} comes {1}. Before {0} comes {2}.'],
  dm_grp1: ['O grupă are {0}.', 'Un grupo tiene {0}.', 'One group has {0}.'],
  dm_grp2: ['Facem {0} grupe la fel, de câte {1}.', 'Hacemos {0} grupos iguales de {1}.', 'We make {0} equal groups of {1}.'],
  dm_times: ['{0} ori {1} fac {2}.', '{0} por {1} son {2}.', '{0} times {1} makes {2}.'],
  dm_div1: ['Împărțim {0} în {1} rânduri egale.', 'Repartimos {0} en {1} filas iguales.', 'We share {0} into {1} equal rows.'],
  dm_div2: ['În fiecare rând sunt {0}. {1} împărțit la {2} fac {0}.', 'En cada fila hay {0}. {1} entre {2} son {0}.', 'Each row has {0}. {1} divided by {2} makes {0}.'],
  rd_dm_l1: ['Aceasta este litera {0}. Are o formă mare și una mică.', 'Esta es la letra {0}. Tiene una forma grande y una pequeña.', 'This is the letter {0}. It has a big shape and a small shape.'],
  rd_dm_l2: ['{0} de la {1}.', '{0} de {1}.', '{0} is for {1}.'],
  rd_dm_s1: ['Litera {0} și litera {1}.', 'La letra {0} y la letra {1}.', 'The letter {0} and the letter {1}.'],
  rd_dm_s2: ['Împreună se citesc: {0}.', 'Juntas se leen: {0}.', 'Together they say: {0}.'],
  rd_dm_w1: ['Citim pe bucăți: {0}.', 'Leemos por partes: {0}.', 'We read it in parts: {0}.'], rd_dm_w2: ['Împreună: {0}.', 'Todo junto: {0}.', 'All together: {0}.'],
  rd_dm_p1: ['Citim cuvânt cu cuvânt.', 'Leemos palabra por palabra.', 'We read word by word.'],
  rd_dm_p2: ['O propoziție începe cu literă mare și se termină cu punct.', 'Una frase empieza con mayúscula y termina con punto.', 'A sentence starts with a capital letter and ends with a full stop.'],
  rd_dm_t1: ['Ascultă și urmărește textul.', 'Escucha y sigue el texto.', 'Listen and follow the text.'],
  rd_dm_t2: ['Apoi citești tu și răspunzi la întrebări.', 'Luego lees tú y respondes a las preguntas.', 'Then you read it yourself and answer the questions.'],
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
const T = (k, ...a) => { let s = (STR[k] || [k, k, k])[li()]; a.forEach((v, i) => { s = s.split('{' + i + '}').join(v); }); return s; };
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

/* ---------- drawn pictures instead of emoji ----------
   Every picture emoji has a drawing in assets/em/<code points>.webp (made by tools/batch_em.py).
   Whatever text lands in the page is scanned and the emoji in it swapped for its drawing, so the game
   looks the same on every phone. EMK lists the drawings that exist (written by tools/em_index.py). */
const EMK = new Set('1f308 1f30a 1f30b 1f319 1f31f 1f327 1f32a 1f330 1f331 1f332 1f333 1f334 1f336 1f338 1f339 1f33a 1f33b 1f33c 1f33d 1f33e 1f33f 1f340 1f343 1f344 1f345 1f347 1f349 1f34a 1f34b 1f34c 1f34d 1f34e 1f34f 1f350 1f351 1f352 1f353 1f356 1f357 1f35a 1f35e 1f369 1f36a 1f36b 1f36d 1f36f 1f370 1f372 1f374 1f37d 1f381 1f382 1f388 1f38b 1f392 1f393 1f3a9 1f3ae 1f3af 1f3b2 1f3b5 1f3b8 1f3b9 1f3ba 1f3bb 1f3be 1f3c0 1f3c1 1f3c5 1f3c6 1f3c8 1f3d0 1f3d4 1f3d6 1f3dc 1f3dd 1f3e0 1f3f0 1f404 1f406 1f409 1f40a 1f40b 1f40c 1f40d 1f40f 1f410 1f411 1f412 1f414 1f417 1f418 1f419 1f41a 1f41b 1f41c 1f41d 1f41e 1f41f 1f420 1f421 1f422 1f424 1f426 1f427 1f428 1f42b 1f42c 1f42d 1f42e 1f42f 1f430 1f431 1f432 1f433 1f434 1f435 1f436 1f437 1f438 1f439 1f43a 1f43b 1f43b-200d-2744 1f43c 1f43e 1f43f 1f441 1f442 1f443 1f444 1f44d 1f44e 1f451 1f453 1f455 1f456 1f457 1f45e 1f45f 1f466 1f467 1f468 1f469 1f475 1f47b 1f47d 1f48d 1f48e 1f496 1f497 1f49a 1f49c 1f4a1 1f4a5 1f4a7 1f4bb 1f4d2 1f4d6 1f4f1 1f4f7 1f50d 1f511 1f512 1f514 1f525 1f528 1f52e 1f56f 1f577 1f578 1f5dd 1f5fa 1f606 1f60b 1f639 1f63b 1f680 1f681 1f682 1f68c 1f690 1f697 1f69c 1f6a2 1f6a7 1f6aa 1f6b2 1f6c1 1f6cf 1f90d 1f916 1f941 1f944 1f947 1f948 1f949 1f952 1f954 1f955 1f95a 1f95b 1f95c 1f95d 1f963 1f965 1f966 1f96c 1f980 1f981 1f983 1f984 1f985 1f986 1f987 1f988 1f989 1f98a 1f98b 1f98c 1f98e 1f98f 1f990 1f991 1f992 1f993 1f994 1f997 1f998 1f999 1f99b 1f99c 1f99d 1f99e 1f99f 1f9a1 1f9a2 1f9a9 1f9ab 1f9ac 1f9ad 1f9b4 1f9b5 1f9b7 1f9c0 1f9c2 1f9c3 1f9c5 1f9ca 1f9d9 1f9e3 1f9e4 1f9e6 1f9ee 1f9f1 1f9f8 1f9f9 1fa90 1fa91 1fa94 1fab2 1fae7 23f0 23f1 2600 2601 2602 2604 2614 2699 26a1 26bd 26c4 26f0 26f5 2702 2708 270b 270f 2728 2744 2764 2b50'.split(' '));
const EM_RE = /[\u{1F300}-\u{1FAFF}☀-➿⬀-⯿←-⇿⌀-⏿■-◿]️?(?:‍[\u{1F300}-\u{1FAFF}☀-➿]️?)*/gu;
const emKey = e => [...e].filter(c => c !== '️').map(c => c.codePointAt(0).toString(16)).join('-');
const EMI = {};
// the drawing for an emoji as an Image (for canvases); cb runs once it has loaded
function emImg(e, cb) {
  const k = emKey(e); if (!EMK.has(k)) return null;
  let im = EMI[k];
  if (!im) { im = EMI[k] = new Image(); im.src = `assets/em/${k}.webp`; }
  if (cb && !im.naturalWidth) im.addEventListener('load', cb, { once: true });
  return im;
}
// draw a label that is just one emoji as its drawing; false when there is none (the caller writes the text)
function emDraw(ctx, s, x, y, size) {
  const im = EMK.has(emKey(s)) && emImg(s); if (!im || !im.naturalWidth) return false;
  const k = size / Math.max(im.naturalWidth, im.naturalHeight);
  ctx.drawImage(im, x - im.naturalWidth * k / 2, y - im.naturalHeight * k / 2, im.naturalWidth * k, im.naturalHeight * k); return true;
}
function emText(node) {
  const t = node.nodeValue, p = node.parentNode;
  if (!p || !t || t.length > 4000) return;
  EM_RE.lastIndex = 0; if (!EM_RE.test(t)) return;
  const frag = document.createDocumentFragment(); let at = 0, hit = false;
  t.replace(EM_RE, (e, i) => {
    const k = emKey(e); if (!EMK.has(k)) return e;
    hit = true; if (i > at) frag.append(t.slice(at, i));
    const im = document.createElement('img');
    im.className = 'emo'; im.alt = e; im.draggable = false; im.src = `assets/em/${k}.webp`;
    im.onerror = () => { EMK.delete(k); im.replaceWith(e); };
    frag.append(im); at = i + e.length; return e;
  });
  if (!hit) return;
  if (at < t.length) frag.append(t.slice(at));
  p.replaceChild(frag, node);
}
function emFix(node) {
  if (node.nodeType === 3) return emText(node);
  if (node.nodeType !== 1) return;
  const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), list = [];
  while (w.nextNode()) list.push(w.currentNode);
  list.forEach(emText);
}
try {
  new MutationObserver(ms => ms.forEach(m => { if (m.type === 'characterData') emText(m.target); else m.addedNodes.forEach(emFix); }))
    .observe(document.getElementById('app'), { childList: true, subtree: true, characterData: true });
} catch (e) {}

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
/* ---------- music ----------
   A small tune played by the browser's own synthesiser, so it needs no files. Three moods: the map,
   the mini-games (faster, with a soft beat) and the school (slower, no beat). It goes quiet while the
   voice speaks and stops when the page is hidden. */
const MUS = { out: null, t: 0, step: 0, mood: 'map', vol: 0 };
const PENTA = [0, 2, 4, 7, 9];
const CHORDS = [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]]; // C, Am, F, G
const TUNES = {
  map: { bpm: 100, key: 0, beat: 0.5, bars: [
    [2, null, 4, null, 3, 2, 1, null], [0, 1, 2, null, 3, null, 2, null], [2, null, 4, null, 3, 2, 1, null], [1, 2, 1, 0, 0, null, null, null],
    [4, null, 5, 4, 3, null, 2, null], [0, 1, 2, null, 3, null, 4, null], [5, null, 4, 3, 2, null, 1, null], [2, 1, 0, null, 0, null, null, null]] },
  game: { bpm: 132, key: 2, beat: 1, bars: [
    [0, 2, 4, 2, 5, 4, 2, null], [3, 2, 0, 2, 3, null, 3, null], [0, 2, 4, 2, 5, 4, 2, null], [4, 3, 2, 1, 0, null, 0, null],
    [5, null, 5, 4, 5, 7, 5, null], [4, 3, 2, 3, 4, null, 2, null], [5, null, 5, 4, 5, 7, 5, null], [4, 3, 2, 1, 0, null, null, null]] },
  calm: { bpm: 78, key: -3, beat: 0, bars: [
    [2, null, null, 3, 4, null, null, null], [3, null, 2, null, 0, null, null, null], [2, null, null, 3, 4, null, 5, null], [4, null, 3, null, 2, null, null, null],
    [0, null, 2, null, 4, null, null, 3], [2, null, null, null, 1, null, 0, null], [0, null, 2, null, 4, null, 5, null], [4, null, 2, null, 0, null, null, null]] },
};
const hz = semi => 261.63 * Math.pow(2, semi / 12);
function mNote(f, at, d, v, type) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type || 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, at + d);
  o.connect(g); g.connect(MUS.out); o.start(at); o.stop(at + d + 0.05);
}
function mHat(at, v) {
  if (!MUS.noise) {
    const b = ac.createBuffer(1, 2205, 44100), ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
    MUS.noise = b;
  }
  const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = 6000; s.buffer = MUS.noise; g.gain.value = v;
  s.connect(f); f.connect(g); g.connect(MUS.out); s.start(at);
}
function mKick(at, v) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(140, at); o.frequency.exponentialRampToValueAtTime(48, at + 0.12);
  g.gain.setValueAtTime(v, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
  o.connect(g); g.connect(MUS.out); o.start(at); o.stop(at + 0.2);
}
function musicStep(at) {
  const tn = TUNES[MUS.mood], s = MUS.step % 64, bar = s >> 3, i = s & 7, ch = CHORDS[bar % 4], k = tn.key;
  const deg = tn.bars[bar][i];
  if (deg != null) { // the tune: a soft mallet (a note with a quick bright overtone)
    const f = hz(k + 12 + PENTA[deg % 5] + 12 * Math.floor(deg / 5));
    mNote(f, at, 0.5, 0.16); mNote(f * 4, at, 0.09, 0.035);
  }
  if (i === 0 || i === 4 || (i === 6 && tn.beat)) mNote(hz(k + ch[i === 6 ? 2 : 0] - 24), at, 0.45, 0.2, 'triangle'); // bass
  if (i === 2 || i === 6) ch.forEach(n => mNote(hz(k + n - (n > 7 ? 12 : 0)), at, 0.32, 0.035, 'triangle')); // chord
  if (tn.beat) {
    if (i % 2) mHat(at, 0.035 * tn.beat);
    if (tn.beat === 1 && (i === 0 || i === 4)) mKick(at, 0.22);
  }
}
const GAME_VIEWS = ['snake', 'run', 'catch', 'whack', 'memory', 'fly', 'blocks', 'kart', 'pop', 'dots'];
function musicTick() {
  const want = S.sound && S.music !== false && ac && ac.state === 'running' && !document.hidden;
  if (!want) { if (MUS.out && MUS.vol) { MUS.vol = 0; MUS.out.gain.setTargetAtTime(0, ac.currentTime, 0.1); } MUS.t = 0; return; }
  if (!MUS.out) { MUS.out = ac.createGain(); MUS.out.gain.value = 0; MUS.out.connect(ac.destination); }
  const mood = GAME_VIEWS.includes(view) ? 'game' : view === 'school' || view === 'lesson' || (cur && cur.school) ? 'calm' : 'map';
  if (mood !== MUS.mood) { MUS.mood = mood; MUS.step = 0; MUS.t = 0; }
  const vol = VOICE.busy ? 0.22 : 0.6;
  if (vol !== MUS.vol) { MUS.vol = vol; MUS.out.gain.setTargetAtTime(vol, ac.currentTime, 0.25); }
  const dur = 30 / TUNES[mood].bpm, now = ac.currentTime;
  if (MUS.t < now) MUS.t = now + 0.08;
  while (MUS.t < now + 0.35) { musicStep(MUS.t); MUS.t += dur; MUS.step++; }
}
setInterval(musicTick, 120);
// the browser only lets sound start after a touch: wake the synthesiser on the first one
document.addEventListener('pointerdown', () => {
  if (!S.sound) return;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) {}
}, true);

/* ---------- the story as short films (assets/cine/*.mp4, made with tools/clip.py) ---------- */
let cineSt = null;
function cine(clips, after) {
  hush(); cur = null; view = 'cine';
  cineSt = { clips, at: 0, after };
  cinePaint();
}
function cinePaint() {
  const st = cineSt, c = st.clips[st.at], tok = st.at;
  app.innerHTML = `<div class="cine"><video src="assets/cine/${c[0]}.mp4" playsinline autoplay ${S.sound ? '' : 'muted'}></video>
    <p class="cine-cap">${T(c[1])}</p><button class="btn alt small cine-skip" data-act="cskip">${T('cine_skip')} ▶</button></div>`;
  const v = app.querySelector('video'), next = () => { if (view === 'cine' && cineSt === st && st.at === tok) cineNext(); };
  v.volume = 0.7; v.onended = () => setTimeout(next, 500); v.onerror = next;
  const p = v.play(); if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(next); });
  say(T(c[1]), S.lang);
}
function cineNext() {
  const st = cineSt; if (!st) return;
  if (++st.at < st.clips.length) return cinePaint();
  cineSt = null; hush(); st.after();
}
const INTRO = [['a', 'cine_1'], ['b', 'cine_2']];
const WINS = ['w', 'w2', 'w3'];

/* ---------- surprise: now and then a mouse dashes across the screen and the cat runs after it ---------- */
let mouseAt = Date.now() + 40000;
function mouseRun(kind) {
  if (document.hidden || !S.setup || ['title', 'splash', 'cine'].includes(view) || document.querySelector('.chase')) return;
  kind = kind || pick(['mouse', 'mouse', 'fly', 'star']);
  const box = document.createElement('div'), rtl = Math.random() < 0.5, mouse = kind === 'mouse';
  box.className = `chase k-${kind}${rtl ? ' rtl' : ''}`; box.style.top = (kind === 'star' ? 6 + Math.random() * 20 : 16 + Math.random() * 56) + '%';
  box.innerHTML = `<button class="ch-mouse" aria-label="!">${mouse ? pic('ev_mouse') : `<img src="assets/em/${kind === 'fly' ? '1f98b' : '2b50'}.webp" alt="" draggable="false">`}</button>${mouse ? `<span class="ch-cat">${cat('walk')}</span>` : ''}`;
  document.body.appendChild(box);
  const m = box.firstChild, c = mouse ? box.lastChild : null; let done = false;
  const bye = setTimeout(() => box.remove(), 7000);
  m.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation(); if (done) return; done = true; clearTimeout(bye);
    // it freezes where it was tapped; the cat catches up with the mouse
    const mr = m.getBoundingClientRect(), mx = rtl ? innerWidth - mr.right : mr.left, my = mr.top - box.getBoundingClientRect().top;
    const cx = c ? (rtl ? innerWidth - c.getBoundingClientRect().right : c.getBoundingClientRect().left) : 0;
    m.style.animation = 'none'; m.style.left = '0'; m.style.transform = `translate(${mx}px, ${my}px)`;
    if (c) { c.style.animation = 'none'; c.style.left = '0'; c.style.transform = `translateX(${cx}px)`; void c.offsetWidth; c.style.transition = 'transform .4s cubic-bezier(.3, 1.4, .5, 1)'; c.style.transform = `translateX(${mx - 46}px)`; }
    box.classList.add('caught'); sfx(mouse ? 'meow' : 'good'); buzz([30, 40, 60]); stat().mice++; save();
    const b = document.createElement('b'); b.className = 'ch-pop'; b.textContent = `${T('ev_caught')} ${mouse ? '🐭' : kind === 'fly' ? '🦋' : '⭐'} ${stat().mice}`; b.style.left = Math.max(4, Math.min(innerWidth - 170, mx - 30)) + 'px'; b.style.top = (my - 64) + 'px'; box.appendChild(b);
    if (mouse) setTimeout(() => sfx('good'), 350);
    setTimeout(() => box.remove(), 1900);
  });
}
window.__chispa_ev = mouseRun; // for automated tests
setInterval(() => { if (!document.hidden && Date.now() > mouseAt) { mouseAt = Date.now() + 50000 + Math.random() * 70000; mouseRun(); } }, 2500);

/* ---------- confetti ---------- */
function confetti() {
  const box = document.createElement('div'); box.className = 'confetti';
  const cols = ['#ffc93c', '#ff6b6b', '#19a999', '#7c5cff', '#4aa8ff', '#ff8fd0'];
  let h = '';
  for (let i = 0; i < 46; i++) h += `<i style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};--dx:${(Math.random() * 2 - 1) * 90}px;--r:${Math.random() * 900 - 450}deg;animation-delay:${Math.random() * 0.5}s;animation-duration:${1.6 + Math.random() * 1.2}s;${i % 3 ? '' : 'border-radius:50%;'}"></i>`;
  box.innerHTML = h; document.body.appendChild(box); setTimeout(() => box.remove(), 3600);
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
  try { if (window.ElGatoApp && ElGatoApp.stopSpeak) ElGatoApp.stopSpeak(); } catch (e) {}
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
      if (window.ElGatoApp && ElGatoApp.speak) { // Android app: the phone's own voice, asked for through the app
        window.__ttsDone = done;
        if (!ElGatoApp.speak(text, lang)) return done();
        return void setTimeout(done, 1500 + text.length * 110);
      }
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
  const moved = v !== view;
  cur = null; view = v; resetArmed = false;
  hush();
  if (moved) { app.classList.remove('vin'); void app.offsetWidth; app.classList.add('vin'); }
  ({ title: vTitle, splash: vSplash, map: vMap, album: vAlbum, settings: vSettings, snake: vSnake, quests: vQuests, run: vRun, catch: vCatch, whack: vWhack, memory: vMemory, fly: vFly, blocks: vBlocks, kart: vKart, school: vSchool, pop: vPop, dots: vDots })[v]();
}
// the Android back button: leave a game or page for the map; false lets the app close
window.__back = () => { if (view === 'cine') { cineNext(); return true; }
  if (view === 'map' || view === 'title' || view === 'splash') return false; show(view === 'lesson' ? 'school' : 'map'); return true; };
// twinkling stars and a shooting star for the night screens
const nightSky = () => {
  let h = '';
  for (let i = 0; i < 16; i++) h += `<i style="left:${(i * 37 + 11) % 96}%;top:${(i * 53 + 7) % 62}%;font-size:${10 + (i * 7) % 14}px;animation-delay:${(i * 0.37) % 2.4}s"></i>`;
  return `<div class="sky">${h}<b></b><b class="s2"></b></div>`;
};
// the screen every visit starts on: logo, the cat and one big button
function vSplash() {
  app.innerHTML = `<div class="splash nightbg">${nightSky()}
    <h1 class="logo">ElGatoLoco<small>${T('sub')}</small></h1>
    <button class="cat" data-act="pet" aria-label="ElGatoLoco">${cat('wave')}</button>
    <button class="btn play" data-act="go" data-v="map">${T('play')} ▶</button>
  </div>`;
}
function vTitle() {
  app.innerHTML = `<div class="title nightbg">${nightSky()}
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
      <button class="btn alt" data-act="go" data-v="quests">🏅 ${T('quests')}</button></section><button class="daily school" data-act="go" data-v="school"><span class="d-ic">🎓</span><span class="pc-tx"><b>${T('school')}</b><small>${T('schoolSub')}</small></span><span class="pc-go">${schoolDone()} / ${schoolAll()}</span></button><h3 class="g-sect">${T('adventure')}</h3>`;
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
      <div class="field"><span class="label">${T('music')}</span>${seg('music', [[true, T('on')], [false, T('off')]])}</div>
      <div class="field"><span class="label">${T('vibe')}</span>${seg('vibe', [[true, T('on')], [false, T('off')]])}</div>
      <button class="btn alt small" data-act="vtest">📳 ${T('vtest')}</button>${vibeMsg ? `<p class="label vmsg">${T(vibeMsg)}</p>` : ''}
      <button class="btn alt small" data-act="story">🎬 ${T('cine_again')}</button>
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
  if (cur && cur.school) return lessonStep(); // a break inside a school lesson ends here
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
  const tok = cur;
  const again = () => { if (cur === tok && cur.pz && $('.pz')) { paint(); $('.pz').style.setProperty('--img', `url(${c.toDataURL('image/png')})`); } };
  const put = (e, cx, cy, size) => {
    const im = emImg(e, again);
    if (im && im.naturalWidth) { const k = size / Math.max(im.naturalWidth, im.naturalHeight); x.drawImage(im, cx - im.naturalWidth * k / 2, cy - im.naturalHeight * k / 2, im.naturalWidth * k, im.naturalHeight * k); }
    else if (!im) { x.font = `${size * 0.85}px sans-serif`; x.fillText(e, cx, cy); }
  };
  const paint = () => {
    x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < n; i++) { const cc = i % cols, r = Math.floor(i / cols); put(dec[i % dec.length], cc * 120 + (cc % 2 ? 92 : 28), r * 120 + (r % 2 ? 28 : 92), 38); }
    put(w[0], c.width / 2, c.height / 2, Math.min(c.height, c.width) * 0.78);
  };
  paint();
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
    ctx.fillStyle = '#1d2b53'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `800 ${t.fs}px ${FONT}`; if (!emDraw(ctx, t.label, t.x, t.y, t.fs * 1.3)) ctx.fillText(t.label, t.x, t.y + t.fs * 0.07);
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

function finish(seen) {
  const { world, idx, mistakes, w } = cur, key = world + '-' + idx;
  const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
  const isNew = !S.stickers.includes(key);
  if (isNew && idx + 1 === PER_WORLD && !seen) { const keep = cur; return cine([[pick(WINS), 'cine_w']], () => { cur = keep; finish(true); }); }
  S.stars[key] = Math.max(S.stars[key] || 0, stars);
  if (isNew) S.stickers.push(key);
  save(); sfx('win'); confetti(); setTimeout(() => sfx('meow'), 950);
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
    o.hidden = false; if (r.rec || r.won || r.dailyWon) { sfx('win'); confetti(); }
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
      ctx.fillStyle = '#1d2b53'; if (!emDraw(ctx, t.label, px(t.x), py(t.y), cell * 0.62)) ctx.fillText(t.label, px(t.x), py(t.y) + fs * 0.06);
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
const GAMES = [['snake', 'cat_head', '🐟'], ['run', 'ic_run', '⭐'], ['catch', 'ic_catch', '🐟'], ['whack', 'ic_whack', '🐭'], ['memory', 'ic_memory', '🃏'], ['fly', 'ic_fly', '⭐'], ['blocks', 'ic_blocks', '🧊'], ['kart', 'ic_kart', '🏁'], ['pop', 'ic_pop', '🎈'], ['dots', 'ic_dots', '⭐']];
// [id, bronze, silver, gold]: a game id counts its best score, the others count something collected over time
const QUESTS = [['snake', 10, 25, 50], ['run', 12, 30, 60], ['catch', 20, 45, 90], ['whack', 15, 28, 40], ['memory', 6, 12, 20], ['fly', 8, 20, 40], ['blocks', 70, 110, 160], ['kart', 12, 30, 60], ['pop', 12, 25, 45], ['dots', 3, 6, 10],
  ['plays', 5, 25, 75], ['stars', 15, 45, 90], ['stickers', 5, 15, 30], ['smart', 3, 10, 25], ['daily', 1, 5, 15], ['mice', 3, 10, 25]];
const stat = () => { S.stat = S.stat || { plays: 0, smart: 0, daily: 0 }; if (S.stat.mice == null) S.stat.mice = 0; return S.stat; };
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
    return `<div class="qs-row"><span class="qs-ic">${g ? pic(g[1]) : { plays: '🎮', stars: '⭐', stickers: '📒', smart: '💡', daily: '🎯', mice: '🐭' }[q[0]]}</span>
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
  g.info = s => { const e = app.querySelector('#g-info'); if (e._s !== s) { e._s = s; e.textContent = s; } };
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
      if (r.rec || r.won || r.dailyWon) { sfx('win'); confetti(); }
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

/* ---------- school: sums and reading, step by step ----------
   Two fixed paths of lessons. Each lesson has three stages: discover (do it with your hands),
   understand (see it, pick the answer) and practise (on your own, with earlier lessons mixed in).
   Between stages there is a short break with the cat. The next lesson opens only after practice is passed. */
const ri = (a, b) => a + rnd(b - a + 1);
const sAdd = (a, b, rows) => ({ kind: 'add', txt: `${a} + ${b}`, ans: a + b, start: a, target: a + b, a, b, rows });
const sSub = (a, b, rows) => ({ kind: 'sub', txt: `${a} − ${b}`, ans: a - b, start: a, target: a - b, a, b, rows });
const sShow = (n, rows) => ({ kind: 'show', txt: String(n), ans: n, start: 0, target: n, a: n, b: 0, rows });
const sMul = (a, b) => ({ kind: 'mul', txt: `${a} × ${b}`, ans: a * b, start: 0, target: a * b, a, b, rows: Math.min(10, a + 1) });
const sDiv = (q, b) => ({ kind: 'div', txt: `${q * b} ÷ ${b}`, ans: q, start: 0, target: q * b, a: q * b, b, rows: Math.min(10, b + 1) });
const near = (c, lo, hi) => { const o = shuffle([c, ...sample([c - 1, c + 1, c - 2, c + 2, c - 3, c + 3].filter(v => v >= lo && v <= hi), 3)]); return { opts: o.map(String), ans: o.indexOf(c) }; };
const mBond = (a, s) => ({ kind: 'bond', txt: `${a} + ? = ${s}`, ans: s - a, start: a, target: s, a, b: s - a, rows: s > 10 ? 2 : 1 });
// four numbers in a row with one of them hidden: the next one, the one before, or one in the middle
function mSeq(lo, hi) {
  const a = ri(lo, hi - 3), s = [a, a + 1, a + 2, a + 3], at = pick([3, 3, 0, 1, 2]), c = s[at];
  s[at] = '?';
  return { mode: 'choice', kind: 'seq', a, txt: 'q' + at + '.' + a, q: T('q_missNum'), stim: expr(s.join(', ')), o: near(c, Math.max(0, lo - 1), hi + 1), cls: 'num', sy: [] };
}
// two numbers: which is bigger, which is smaller; small numbers come with a row of beads each until practice
function mCmp(lo, hi, ph) {
  const a = ri(lo, hi); let b; do { b = ri(lo, hi); } while (b === a);
  const big = rnd(2), rod = (n, c) => `<div class="rod">${[...c.repeat(n).padEnd(10, '.')].map(x => `<i class="bead ${x === '.' ? 'off' : x}"></i>`).join('')}</div>`;
  return { mode: 'choice', kind: 'cmp', a, b, txt: 'c' + big + '.' + a + '.' + b, q: T(big ? 'sc_bigger' : 'sc_smaller'), stim: '',
    help: hi <= 10 && ph < 2 ? `<div class="abacus r2">${rod(a, 'a')}${rod(b, 'b')}</div>` : '', helpOn: true,
    o: { opts: [String(a), String(b)], ans: (a > b) === !!big ? 0 : 1 }, cls: 'num', sy: [] };
}
const any = (...fs) => () => pick(fs)();
const gAdd5 = () => { const s = ri(2, 5), a = ri(1, s - 1); return sAdd(a, s - a, 1); };
const gAdd10 = () => { const s = ri(6, 10), a = ri(1, s - 1); return sAdd(a, s - a, 1); };
const gSub5 = () => { const a = ri(2, 5); return sSub(a, ri(1, a), 1); };
const gSub10 = () => { const a = ri(6, 10); return sSub(a, ri(1, a), 1); };
const gAdd20 = () => { const a = ri(11, 18); return sAdd(a, ri(1, 9 - a % 10), 2); };
const gSub20 = () => { const a = ri(12, 19); return sSub(a, ri(1, a % 10), 2); };
const gAddX = () => { const a = ri(2, 9); return sAdd(a, ri(11 - a, 9), 2); };
const gSubX = () => { const a = ri(11, 18); return sSub(a, ri(a % 10 + 1, 9), 2); };
const gTens = () => { const a = ri(1, 8), b = ri(1, 9 - a); return rnd(2) ? sAdd(a * 10, b * 10, 10) : sSub((a + b) * 10, b * 10, 10); };
const gAdd100 = () => { const ta = ri(1, 7), tb = ri(1, 8 - ta), ua = ri(0, 8), ub = ri(1, 9 - ua); return sAdd(ta * 10 + ua, tb * 10 + ub, 10); };
const gAdd100c = () => { const ua = ri(2, 9), ub = ri(11 - ua, 9), ta = ri(1, 6), tb = ri(1, 7 - ta); return sAdd(ta * 10 + ua, tb * 10 + ub, 10); };
const gSub100 = () => { const ta = ri(2, 9), tb = ri(1, ta - 1), ua = ri(1, 9), ub = ri(0, ua); return sSub(ta * 10 + ua, tb * 10 + ub, 10); };
const gSub100b = () => { const ua = ri(0, 8), ub = ri(ua + 1, 9), ta = ri(2, 9), tb = ri(1, ta - 1); return sSub(ta * 10 + ua, tb * 10 + ub, 10); };
const gMul = (...ts) => () => sMul(ri(1, 10), pick(ts));
const gDiv = (...ts) => () => sDiv(ri(1, 10), pick(ts));
// ch = the chapter that starts with this lesson
const LESSONS = [
  { ch: ['Numerele până la 10', 'Los números hasta 10', 'Numbers to 10'],
    n: ['Numerele 1, 2 și 3', 'Los números 1, 2 y 3', 'The numbers 1, 2 and 3'], g: () => sShow(ri(1, 3), 1) },
  { n: ['Numerele 4 și 5', 'Los números 4 y 5', 'The numbers 4 and 5'], g: () => sShow(pick([4, 5, 4, 5, 3, 2]), 1) },
  { n: ['Șirul numerelor până la 5', 'La fila de números hasta 5', 'Counting in order to 5'], g: () => mSeq(0, 5) },
  { n: ['Mai mult sau mai puțin, până la 5', 'Más o menos, hasta 5', 'More or less, up to 5'], g: p => mCmp(1, 5, p) },
  { n: ['Numerele 6 și 7', 'Los números 6 y 7', 'The numbers 6 and 7'], g: () => sShow(pick([6, 7, 6, 7, 5]), 1) },
  { n: ['Numerele 8, 9 și 10', 'Los números 8, 9 y 10', 'The numbers 8, 9 and 10'], g: () => sShow(pick([8, 9, 10, 8, 9, 10, 7]), 1) },
  { n: ['Șirul numerelor până la 10', 'La fila de números hasta 10', 'Counting in order to 10'], g: () => mSeq(0, 10) },
  { n: ['Comparăm numere până la 10', 'Comparamos números hasta 10', 'Comparing numbers to 10'], g: p => mCmp(1, 10, p) },

  { ch: ['Adunarea până la 10', 'La suma hasta 10', 'Adding up to 10'],
    n: ['Încă unul', 'Uno más', 'One more'], g: () => sAdd(ri(1, 4), 1, 1) },
  { n: ['Adunări până la 5', 'Sumas hasta 5', 'Adding up to 5'], g: gAdd5 },
  { n: ['Adunăm 1 sau 2', 'Sumamos 1 o 2', 'Adding 1 or 2'], g: () => { const a = ri(3, 8); return sAdd(a, ri(1, Math.min(2, 10 - a)), 1); } },
  { n: ['Adunări până la 10', 'Sumas hasta 10', 'Adding up to 10'], g: gAdd10 },
  { n: ['Dublele: 1 + 1, 2 + 2…', 'Los dobles: 1 + 1, 2 + 2…', 'Doubles: 1 + 1, 2 + 2…'], g: () => { const n = ri(1, 5); return sAdd(n, n, 1); } },
  { n: ['Prietenii lui 10', 'Los amigos del 10', 'Friends of 10'], g: () => mBond(ri(1, 9), 10) },
  { n: ['Numărul ascuns', 'El número escondido', 'The hidden number'], g: () => { const s = ri(4, 9); return mBond(ri(1, s - 1), s); } },

  { ch: ['Scăderea până la 10', 'La resta hasta 10', 'Taking away up to 10'],
    n: ['Cu unul mai puțin', 'Uno menos', 'One less'], g: () => sSub(ri(2, 6), 1, 1) },
  { n: ['Scăderi până la 5', 'Restas hasta 5', 'Taking away up to 5'], g: gSub5 },
  { n: ['Scădem 1 sau 2', 'Restamos 1 o 2', 'Taking away 1 or 2'], g: () => sSub(ri(4, 10), ri(1, 2), 1) },
  { n: ['Scăderi până la 10', 'Restas hasta 10', 'Taking away up to 10'], g: gSub10 },
  { n: ['Adunări și scăderi până la 10', 'Sumas y restas hasta 10', 'Adding and taking away to 10'], g: any(gAdd5, gAdd10, gSub5, gSub10) },

  { ch: ['Numerele până la 20', 'Los números hasta 20', 'Numbers to 20'],
    n: ['Numerele de la 11 la 20', 'Los números del 11 al 20', 'The numbers 11 to 20'], g: () => sShow(ri(11, 20), 2) },
  { n: ['Șirul numerelor până la 20', 'La fila de números hasta 20', 'Counting in order to 20'], g: () => mSeq(8, 20) },
  { n: ['Comparăm numere până la 20', 'Comparamos números hasta 20', 'Comparing numbers to 20'], g: p => mCmp(5, 20, p) },
  { n: ['Zece și încă câteva', 'Diez y algunos más', 'Ten and some more'], g: () => sAdd(10, ri(1, 9), 2) },
  { n: ['Adunări până la 20, fără trecere', 'Sumas hasta 20, sin llevar', 'Adding to 20, no carrying'], g: gAdd20 },
  { n: ['Scăderi până la 20, fără trecere', 'Restas hasta 20, sin llevar', 'Taking away to 20, no borrowing'], g: gSub20 },
  { n: ['Adunări cu trecere peste 10', 'Sumas que pasan de 10', 'Adding across 10'], g: gAddX },
  { n: ['Scăderi cu trecere peste 10', 'Restas que pasan de 10', 'Taking away across 10'], g: gSubX },
  { n: ['Adunări și scăderi până la 20', 'Sumas y restas hasta 20', 'Adding and taking away to 20'], g: any(gAdd20, gSub20, gAddX, gSubX) },

  { ch: ['Numerele până la 100', 'Los números hasta 100', 'Numbers to 100'],
    n: ['Zecile: 10, 20, 30…', 'Las decenas: 10, 20, 30…', 'The tens: 10, 20, 30…'], g: () => sShow(ri(1, 10) * 10, 10) },
  { n: ['Zeci și unități', 'Decenas y unidades', 'Tens and ones'], g: () => sShow(ri(21, 99), 10) },
  { n: ['Șirul numerelor până la 100', 'La fila de números hasta 100', 'Counting in order to 100'], g: () => mSeq(18, 100) },
  { n: ['Comparăm numere până la 100', 'Comparamos números hasta 100', 'Comparing numbers to 100'], g: p => mCmp(10, 100, p) },
  { n: ['Adunăm și scădem zeci', 'Sumamos y restamos decenas', 'Adding and taking away tens'], g: gTens },
  { n: ['Zeci plus unități', 'Decenas más unidades', 'Tens plus ones'], g: () => { const t = ri(2, 9) * 10, u = ri(0, 7); return sAdd(t + (rnd(2) ? u : 0), ri(1, 9 - u), 10); } },
  { n: ['Scădem unități', 'Restamos unidades', 'Taking away ones'], g: () => { const a = ri(2, 9) * 10 + ri(2, 9); return sSub(a, ri(1, a % 10), 10); } },
  { n: ['Adunări până la 100, fără trecere', 'Sumas hasta 100, sin llevar', 'Adding to 100, no carrying'], g: gAdd100 },
  { n: ['Scăderi până la 100, fără împrumut', 'Restas hasta 100, sin llevar', 'Taking away to 100, no borrowing'], g: gSub100 },
  { n: ['Adunăm unități cu trecere', 'Sumamos unidades llevando', 'Adding ones with carrying'], g: () => { const u = ri(2, 9); return sAdd(ri(1, 8) * 10 + u, ri(11 - u, 9), 10); } },
  { n: ['Adunări până la 100, cu trecere', 'Sumas hasta 100, llevando', 'Adding to 100 with carrying'], g: gAdd100c },
  { n: ['Scădem unități cu împrumut', 'Restamos unidades llevando', 'Taking away ones with borrowing'], g: () => { const u = ri(0, 8); return sSub(ri(2, 9) * 10 + u, ri(u + 1, 9), 10); } },
  { n: ['Scăderi până la 100, cu împrumut', 'Restas hasta 100, llevando', 'Taking away to 100 with borrowing'], g: gSub100b },
  { n: ['Adunări și scăderi până la 100', 'Sumas y restas hasta 100', 'Adding and taking away to 100'], g: any(gAdd100, gAdd100c, gSub100, gSub100b) },

  { ch: ['Înmulțirea', 'La multiplicación', 'Multiplying'],
    n: ['Grupe egale', 'Grupos iguales', 'Equal groups'], g: () => { const a = ri(2, 4), b = ri(2, 5); return { ...sMul(a, b), txt: Array(a).fill(b).join(' + ') }; } },
  { n: ['Înmulțirea cu 2', 'La tabla del 2', 'Times 2'], g: gMul(2) },
  { n: ['Înmulțirea cu 3', 'La tabla del 3', 'Times 3'], g: gMul(3) },
  { n: ['Înmulțirea cu 4', 'La tabla del 4', 'Times 4'], g: gMul(4) },
  { n: ['Înmulțirea cu 5 și cu 10', 'Las tablas del 5 y del 10', 'Times 5 and times 10'], g: gMul(5, 10) },
  { n: ['Înmulțirea cu 6 și cu 7', 'Las tablas del 6 y del 7', 'Times 6 and times 7'], g: gMul(6, 7) },
  { n: ['Înmulțirea cu 8 și cu 9', 'Las tablas del 8 y del 9', 'Times 8 and times 9'], g: gMul(8, 9) },
  { n: ['Toată tabla înmulțirii', 'Todas las tablas', 'All the times tables'], g: () => sMul(ri(2, 9), ri(2, 9)) },

  { ch: ['Împărțirea', 'La división', 'Dividing'],
    n: ['Jumătatea: împărțim la 2', 'La mitad: dividir entre 2', 'Half: dividing by 2'], g: gDiv(2) },
  { n: ['Împărțiri la 3 și la 4', 'Dividir entre 3 y entre 4', 'Dividing by 3 and by 4'], g: gDiv(3, 4) },
  { n: ['Împărțiri la 5 și la 10', 'Dividir entre 5 y entre 10', 'Dividing by 5 and by 10'], g: gDiv(5, 10) },
  { n: ['Împărțiri la 6, 7, 8 și 9', 'Dividir entre 6, 7, 8 y 9', 'Dividing by 6, 7, 8 and 9'], g: gDiv(6, 7, 8, 9) },
  { n: ['Înmulțiri și împărțiri', 'Multiplicar y dividir', 'Multiplying and dividing'], g: any(() => sMul(ri(2, 9), ri(2, 9)), () => sDiv(ri(2, 10), ri(2, 9))) },
];
// questions in the three steps of a lesson, and how many of the last step must be right first time
const PASS = 8;
// the number lessons end with writing the digits with a finger
[[0, ['1', '2', '3']], [1, ['4', '5']], [4, ['6', '7']], [5, ['8', '9', '10']]].forEach(([i, w]) => { LESSONS[i].w = () => w; });

/* reading: letters -> syllables -> words -> sentences, in the language of the menus.
   Letters come with a picture word; words are written in the pieces a child builds them from. */
const RL = {
  ro: ['A🐝albină E🐘elefant I🐰iepure O🥚ou U🐻urs', 'M🚗mașină N☁️nor L🦁leu R🦆rață S☀️soare T🚂tren', 'P🐱pisică C🏠casă D🦷dinte B🍌banană V🐄vacă F🦋fluture', 'G🐔găină H🗺️hartă J🧸jucărie Z🦓zebră Ș🐍șarpe Ț🐢țestoasă'],
  es: ['A🐝abeja E🐘elefante I🏝️isla O🐻oso U🍇uva', 'M✋mano N☁️nube L🌙luna R🐸rana S☀️sol T🐢tortuga', 'P🦆pato C🏠casa D🎲dado B⛵barco V🐄vaca F🌸flor', 'G🐱gato H🐜hormiga J🦒jirafa Z👞zapato Q🧀queso K🥝kiwi'],
  en: ['A🍎apple E🥚egg I🐛insect O🐙octopus U☂️umbrella', 'M🌙moon N👃nose L🦁lion R🐰rabbit S☀️sun T🐯tiger', 'P🐷pig C🐱cat D🐶dog B🐻bear V🚐van F🐟fish', 'G🐐goat H🎩hat J✈️jet K🔑key W🐋whale Z🦓zebra'],
};
const RW = {
  ro: ['🐻urs 🐺lup 🐷porc 🚂tren 🐴cal 🛏️pat ☁️nor 🍎măr 🦀rac 🌳pom 👃nas 🥚ou 🦁leu',
    '🏠ca-să 🌙lu-nă 💧a-pă 🚪u-șă 👄gu-ră ✋mâ-nă 🍐pa-ră 🐄va-că 🦆ra-ță 🥛lap-te ☀️soa-re 🌸floa-re 🍞pâi-ne 🐟peș-te 🦷din-te 📖car-te ⛵bar-că 🐶câi-ne 🦊vul-pe 🐸broas-că',
    '🐱pi-si-că 🚗ma-și-nă 🍌ba-na-nă ✈️a-vi-on 🐘e-le-fant 🦋flu-tu-re 🐝al-bi-nă 🐰ie-pu-re 🍅ro-și-e 🥕mor-cov 🍋lă-mâ-ie 🎩pă-lă-ri-e ☂️um-bre-lă 🥒cas-tra-ve-te 🐔gă-i-nă 🐵mai-mu-ță',
    '🍒ci-re-șe ⚽min-ge 🦒gi-ra-fă 🔑che-ie 👁️ochi 👂u-re-che 🎒ghioz-dan 🦔a-rici ⏰ceas 🚲bi-ci-cle-tă 🦌cerb 🍄ciu-per-că 🦵ge-nunchi'],
  es: ['☀️sol 🍞pan 🐟pez 🌊mar 💡luz 🌸flor 🚂tren 🧂sal 🐻o-so 👁️o-jo 🍇u-va',
    '🏠ca-sa 🌙lu-na 🐱ga-to 🦆pa-to ✋ma-no 🐄va-ca 🐸ra-na 🐺lo-bo 🐵mo-no 👄bo-ca 🍐pe-ra 🌹ro-sa 🍲so-pa 🛏️ca-ma 🎲da-do 📖li-bro ☁️nu-be 🐯ti-gre 🍋li-món ⛵bar-co',
    '⚽pe-lo-ta 🍅to-ma-te 👞za-pa-to 🐰co-ne-jo 🐝a-be-ja 🐘e-le-fan-te 🦋ma-ri-po-sa 🍌plá-ta-no 🍎man-za-na ✈️a-vión 🎩som-bre-ro 🐢tor-tu-ga 📱te-lé-fo-no 🐜hor-mi-ga ☂️pa-ra-guas 🥕za-na-ho-ria',
    '🥛le-che 🚗co-che 🔑lla-ve 🌧️llu-via 🐤po-llo 🐴ca-ba-llo 🧀que-so 🐶pe-rro 👦ni-ño 🕷️a-ra-ña 🎸gui-ta-rra ⛰️mon-ta-ña 🥄cu-cha-ra 🐔ga-lli-na'],
  en: ['🐱cat 🐶dog 🐷pig ☀️sun 🎩hat 🚌bus 🛏️bed 🦊fox 🐔hen 🦇bat 🐛bug 🗺️map 🐜ant 🚐van 🥚egg',
    '🐸frog 🥛milk ⭐star 🦆duck 🐻bear 🦁lion ⚽ball 🔔bell 🥁drum 🦀crab ✋hand 🎂cake 🦴bone 🌹rose ⛵boat 🌧️rain ❄️snow 🍃leaf',
    '🍎ap-ple 🐯ti-ger 🦓ze-bra 🍋lem-on 🤖ro-bot 🐰rab-bit 🐵mon-key 🍌ba-na-na 🌸flow-er ✏️pen-cil 🥕car-rot 🚀rock-et 🐢tur-tle 🕷️spi-der 🐉drag-on 🐘el-e-phant 🦋but-ter-fly',
    '🐟f-i-sh 🚢sh-i-p 👞sh-oe 🐑sh-ee-p 🦈sh-ar-k 🧀ch-ee-se 🐤ch-i-ck 🌙m-oo-n 📖b-oo-k 🌳t-r-ee 🐝b-ee 🦷t-oo-th 🛁b-a-th 🍒ch-err-y'],
};
// sentence | question | right answer | three wrong answers; the pictures are shared by all languages
const SPIC = ['🐱🥛', '👧🍎', '🐶🌳', '👨📖', '☀️☁️', '🐟🌊', '👩🎂', '🐝🌸', '👦🚲', '🌧️☔', '🐵🍌', '👵🎩',
  '🐸💧', '🐦🌳', '👧⚽', '🐭🧀', '👦🛏️', '🐄🌿', '👩🚗', '⛄❄️', '🐻🍯', '👨🚂', '🐰🥕', '🌙⭐'];
const RS = {
  ro: ['Pisica bea lapte.|Ce bea pisica?|lapte|apă|suc|ceai', 'Ana are un măr roșu.|Ce are Ana?|un măr|o pară|o minge|o carte', 'Câinele aleargă în parc.|Unde aleargă câinele?|în parc|în casă|la școală|pe plajă',
    'Tata citește o carte.|Cine citește?|tata|mama|bunica|pisica', 'Soarele este pe cer.|Unde este soarele?|pe cer|în apă|sub pat|în copac', 'Peștele înoată în apă.|Ce face peștele?|înoată|zboară|doarme|cântă',
    'Mama face o prăjitură.|Ce face mama?|o prăjitură|o supă|un desen|un pod', 'Albina zboară la floare.|Unde zboară albina?|la floare|la mare|la lună|la școală', 'Dan merge cu bicicleta.|Cu ce merge Dan?|cu bicicleta|cu trenul|cu barca|cu avionul',
    'Afară plouă mult.|Cum este vremea?|plouă|ninge|e soare|bate vântul', 'Maimuța mănâncă o banană.|Ce mănâncă maimuța?|o banană|un măr|pâine|pește', 'Bunica are o pălărie.|Ce are bunica?|o pălărie|o umbrelă|o cheie|o minge',
    'Broasca sare în apă.|Unde sare broasca?|în apă|pe casă|în pat|în copac', 'Pasărea cântă în copac.|Unde cântă pasărea?|în copac|în apă|sub masă|în mașină', 'Ema se joacă cu mingea.|Cu ce se joacă Ema?|cu mingea|cu păpușa|cu trenul|cu pisica',
    'Șoarecele mănâncă brânză.|Ce mănâncă șoarecele?|brânză|pește|morcovi|miere', 'Radu doarme în pat.|Unde doarme Radu?|în pat|pe scaun|în parc|în barcă', 'Vaca mănâncă iarbă.|Ce mănâncă vaca?|iarbă|carne|pâine|ouă',
    'Mama merge cu mașina.|Cu ce merge mama?|cu mașina|cu trenul|cu barca|pe jos', 'Afară ninge și e frig.|Cum este afară?|e frig|e cald|e soare|plouă', 'Ursul caută miere.|Ce caută ursul?|miere|pește|mere|apă',
    'Unchiul vine cu trenul.|Cine vine cu trenul?|unchiul|mama|bunica|pisica', 'Iepurele are un morcov.|Ce are iepurele?|un morcov|un măr|o floare|o minge', 'Noaptea vedem luna și stelele.|Când vedem luna?|noaptea|dimineața|la prânz|la școală'],
  es: ['El gato bebe leche.|¿Qué bebe el gato?|leche|agua|zumo|té', 'Ana tiene una manzana roja.|¿Qué tiene Ana?|una manzana|una pera|una pelota|un libro', 'El perro corre en el parque.|¿Dónde corre el perro?|en el parque|en casa|en la escuela|en la playa',
    'Papá lee un libro.|¿Quién lee?|papá|mamá|la abuela|el gato', 'El sol está en el cielo.|¿Dónde está el sol?|en el cielo|en el agua|bajo la cama|en el árbol', 'El pez nada en el agua.|¿Qué hace el pez?|nada|vuela|duerme|canta',
    'Mamá hace un pastel.|¿Qué hace mamá?|un pastel|una sopa|un dibujo|un puente', 'La abeja vuela a la flor.|¿A dónde vuela la abeja?|a la flor|al mar|a la luna|a la escuela', 'Dani va en bicicleta.|¿En qué va Dani?|en bicicleta|en tren|en barco|en avión',
    'Hoy llueve mucho.|¿Qué tiempo hace?|llueve|nieva|hace sol|hace viento', 'El mono come un plátano.|¿Qué come el mono?|un plátano|una manzana|pan|pescado', 'La abuela tiene un sombrero.|¿Qué tiene la abuela?|un sombrero|un paraguas|una llave|una pelota',
    'La rana salta al agua.|¿A dónde salta la rana?|al agua|a la casa|a la cama|al árbol', 'El pájaro canta en el árbol.|¿Dónde canta el pájaro?|en el árbol|en el agua|bajo la mesa|en el coche', 'Ema juega con la pelota.|¿Con qué juega Ema?|con la pelota|con la muñeca|con el tren|con el gato',
    'El ratón come queso.|¿Qué come el ratón?|queso|pescado|zanahorias|miel', 'Raúl duerme en la cama.|¿Dónde duerme Raúl?|en la cama|en la silla|en el parque|en el barco', 'La vaca come hierba.|¿Qué come la vaca?|hierba|carne|pan|huevos',
    'Mamá va en coche.|¿En qué va mamá?|en coche|en tren|en barco|a pie', 'Fuera nieva y hace frío.|¿Qué tiempo hace fuera?|hace frío|hace calor|hace sol|llueve', 'El oso busca miel.|¿Qué busca el oso?|miel|pescado|manzanas|agua',
    'El tío viene en tren.|¿Quién viene en tren?|el tío|mamá|la abuela|el gato', 'El conejo tiene una zanahoria.|¿Qué tiene el conejo?|una zanahoria|una manzana|una flor|una pelota', 'De noche vemos la luna y las estrellas.|¿Cuándo vemos la luna?|de noche|por la mañana|al mediodía|en la escuela'],
  en: ['The cat drinks milk.|What does the cat drink?|milk|water|juice|tea', 'Anna has a red apple.|What does Anna have?|an apple|a pear|a ball|a book', 'The dog runs in the park.|Where does the dog run?|in the park|at home|at school|on the beach',
    'Dad reads a book.|Who reads?|Dad|Mum|Grandma|the cat', 'The sun is in the sky.|Where is the sun?|in the sky|in the water|under the bed|in the tree', 'The fish swims in the water.|What does the fish do?|it swims|it flies|it sleeps|it sings',
    'Mum makes a cake.|What does Mum make?|a cake|a soup|a drawing|a bridge', 'The bee flies to the flower.|Where does the bee fly?|to the flower|to the sea|to the moon|to school', 'Dan rides a bike.|What does Dan ride?|a bike|a train|a boat|a plane',
    'It rains a lot today.|What is the weather like?|it rains|it snows|it is sunny|it is windy', 'The monkey eats a banana.|What does the monkey eat?|a banana|an apple|bread|fish', 'Grandma has a hat.|What does Grandma have?|a hat|an umbrella|a key|a ball',
    'The frog jumps into the water.|Where does the frog jump?|into the water|onto the house|into the bed|into the tree', 'The bird sings in the tree.|Where does the bird sing?|in the tree|in the water|under the table|in the car', 'Emma plays with the ball.|What does Emma play with?|the ball|the doll|the train|the cat',
    'The mouse eats cheese.|What does the mouse eat?|cheese|fish|carrots|honey', 'Sam sleeps in the bed.|Where does Sam sleep?|in the bed|on the chair|in the park|in the boat', 'The cow eats grass.|What does the cow eat?|grass|meat|bread|eggs',
    'Mum goes by car.|How does Mum go?|by car|by train|by boat|on foot', 'It snows and it is cold outside.|What is it like outside?|it is cold|it is hot|it is sunny|it rains', 'The bear looks for honey.|What does the bear look for?|honey|fish|apples|water',
    'My uncle comes by train.|Who comes by train?|my uncle|Mum|Grandma|the cat', 'The rabbit has a carrot.|What does the rabbit have?|a carrot|an apple|a flower|a ball', 'At night we see the moon and the stars.|When do we see the moon?|at night|in the morning|at noon|at school'],
};
// short texts: text | question | right | wrong | wrong | question | right | wrong | wrong | a true sentence | a false sentence
// the first six have two sentences, the last six have three; the pictures are shared by all languages
const TPIC = ['🐶⚽', '👧📖', '🐦🌳', '👦🚲', '🌧️☂️', '🐟🌊', '🐻🍯', '👵🎂', '🐰🥕', '⛄❄️', '🚂⛰️', '🐝🌻'];
const RT = {
  ro: ['Rex este un câine mic. El se joacă cu o minge roșie.|Cine este Rex?|un câine|o pisică|un băiat|Ce culoare are mingea?|roșie|albastră|verde|Rex se joacă cu o minge.|Rex este o pisică.',
    'Ana are o carte nouă. Ea citește în fiecare seară.|Ce are Ana?|o carte|o păpușă|o bicicletă|Când citește Ana?|seara|dimineața|la prânz|Ana citește seara.|Ana are o minge nouă.',
    'O pasăre stă în copac. Ea are un cuib cu trei ouă.|Unde stă pasărea?|în copac|pe casă|în apă|Câte ouă sunt în cuib?|trei|două|cinci|Pasărea are un cuib.|În cuib sunt cinci ouă.',
    'Dan are o bicicletă albastră. El merge cu ea în parc.|Ce culoare are bicicleta?|albastră|roșie|galbenă|Unde merge Dan?|în parc|la școală|la mare|Dan merge în parc.|Bicicleta este roșie.',
    'Azi plouă. Mara își ia umbrela galbenă.|Cum este vremea?|plouă|ninge|e soare|Ce își ia Mara?|umbrela|pălăria|mingea|Umbrela este galbenă.|Azi ninge.',
    'Peștele trăiește în mare. El înoată repede.|Unde trăiește peștele?|în mare|în copac|în casă|Cum înoată peștele?|repede|încet|deloc|Peștele înoată.|Peștele trăiește în copac.',
    'Ursul Martin iubește mierea. Dimineața caută miere în pădure. Seara doarme în peșteră.|Ce iubește ursul?|mierea|peștele|merele|Unde doarme ursul?|în peșteră|în copac|în casă|Ursul caută miere în pădure.|Ursul doarme dimineața.',
    'Bunica face o prăjitură cu mere. Ema o ajută în bucătărie. La final mănâncă împreună.|Cu ce este prăjitura?|cu mere|cu cireșe|cu banane|Cine o ajută pe bunica?|Ema|tata|pisica|Ema și bunica mănâncă împreună.|Prăjitura este cu banane.',
    'Iepurele Țup locuiește în grădină. Îi plac morcovii dulci. În fiecare zi mănâncă doi morcovi.|Unde locuiește iepurele?|în grădină|în pădure|la școală|Câți morcovi mănâncă pe zi?|doi|trei|zece|Iepurelui îi plac morcovii.|Iepurele locuiește în pădure.',
    'Iarna ninge mult. Copiii fac un om de zăpadă. Îi pun un morcov în loc de nas.|Ce fac copiii?|un om de zăpadă|o casă|un tort|Ce are omul de zăpadă în loc de nas?|un morcov|un măr|o piatră|Iarna ninge.|Copiii fac un castel.',
    'Tata și Radu merg cu trenul la munte. Pe drum văd vaci și cai. Radu este foarte fericit.|Cu ce merg la munte?|cu trenul|cu mașina|cu avionul|Ce văd pe drum?|vaci și cai|pești|elefanți|Radu este fericit.|Ei merg la mare.',
    'Albina zboară din floare în floare. Ea adună nectar. Din nectar face miere dulce.|Ce adună albina?|nectar|apă|frunze|Ce face albina din nectar?|miere|lapte|pâine|Albina zboară la flori.|Albina face lapte.'],
  es: ['Rex es un perro pequeño. Juega con una pelota roja.|¿Quién es Rex?|un perro|un gato|un niño|¿De qué color es la pelota?|roja|azul|verde|Rex juega con una pelota.|Rex es un gato.',
    'Ana tiene un libro nuevo. Lee todas las noches.|¿Qué tiene Ana?|un libro|una muñeca|una bicicleta|¿Cuándo lee Ana?|por la noche|por la mañana|al mediodía|Ana lee por la noche.|Ana tiene una pelota nueva.',
    'Un pájaro está en el árbol. Tiene un nido con tres huevos.|¿Dónde está el pájaro?|en el árbol|en la casa|en el agua|¿Cuántos huevos hay en el nido?|tres|dos|cinco|El pájaro tiene un nido.|En el nido hay cinco huevos.',
    'Dani tiene una bicicleta azul. Va con ella al parque.|¿De qué color es la bicicleta?|azul|roja|amarilla|¿A dónde va Dani?|al parque|a la escuela|a la playa|Dani va al parque.|La bicicleta es roja.',
    'Hoy llueve. Mara coge su paraguas amarillo.|¿Qué tiempo hace?|llueve|nieva|hace sol|¿Qué coge Mara?|el paraguas|el sombrero|la pelota|El paraguas es amarillo.|Hoy nieva.',
    'El pez vive en el mar. Nada muy rápido.|¿Dónde vive el pez?|en el mar|en un árbol|en una casa|¿Cómo nada el pez?|rápido|despacio|nunca|El pez nada.|El pez vive en un árbol.',
    'Al oso Martín le encanta la miel. Por la mañana busca miel en el bosque. Por la noche duerme en su cueva.|¿Qué le encanta al oso?|la miel|el pescado|las manzanas|¿Dónde duerme el oso?|en su cueva|en un árbol|en una casa|El oso busca miel en el bosque.|El oso duerme por la mañana.',
    'La abuela hace un pastel de manzana. Ema la ayuda en la cocina. Al final se lo comen juntas.|¿De qué es el pastel?|de manzana|de cereza|de plátano|¿Quién ayuda a la abuela?|Ema|papá|el gato|Ema y la abuela comen juntas.|El pastel es de plátano.',
    'El conejo Tup vive en el jardín. Le gustan las zanahorias dulces. Cada día come dos zanahorias.|¿Dónde vive el conejo?|en el jardín|en el bosque|en la escuela|¿Cuántas zanahorias come al día?|dos|tres|diez|Al conejo le gustan las zanahorias.|El conejo vive en el bosque.',
    'En invierno nieva mucho. Los niños hacen un muñeco de nieve. Le ponen una zanahoria de nariz.|¿Qué hacen los niños?|un muñeco de nieve|una casa|una tarta|¿Qué tiene el muñeco de nariz?|una zanahoria|una manzana|una piedra|En invierno nieva.|Los niños hacen un castillo.',
    'Papá y Raúl van en tren a la montaña. Por el camino ven vacas y caballos. Raúl está muy contento.|¿En qué van a la montaña?|en tren|en coche|en avión|¿Qué ven por el camino?|vacas y caballos|peces|elefantes|Raúl está contento.|Van a la playa.',
    'La abeja vuela de flor en flor. Recoge néctar. Con el néctar hace miel dulce.|¿Qué recoge la abeja?|néctar|agua|hojas|¿Qué hace la abeja con el néctar?|miel|leche|pan|La abeja vuela a las flores.|La abeja hace leche.'],
  en: ['Rex is a small dog. He plays with a red ball.|Who is Rex?|a dog|a cat|a boy|What colour is the ball?|red|blue|green|Rex plays with a ball.|Rex is a cat.',
    'Anna has a new book. She reads every evening.|What does Anna have?|a book|a doll|a bike|When does Anna read?|in the evening|in the morning|at noon|Anna reads in the evening.|Anna has a new ball.',
    'A bird sits in the tree. It has a nest with three eggs.|Where is the bird?|in the tree|on the house|in the water|How many eggs are in the nest?|three|two|five|The bird has a nest.|There are five eggs in the nest.',
    'Dan has a blue bike. He rides it to the park.|What colour is the bike?|blue|red|yellow|Where does Dan go?|to the park|to school|to the beach|Dan goes to the park.|The bike is red.',
    'It is raining today. Mara takes her yellow umbrella.|What is the weather like?|it rains|it snows|it is sunny|What does Mara take?|her umbrella|her hat|her ball|The umbrella is yellow.|It is snowing today.',
    'The fish lives in the sea. It swims very fast.|Where does the fish live?|in the sea|in a tree|in a house|How does the fish swim?|fast|slowly|never|The fish swims.|The fish lives in a tree.',
    'Martin the bear loves honey. In the morning he looks for honey in the forest. At night he sleeps in his cave.|What does the bear love?|honey|fish|apples|Where does the bear sleep?|in his cave|in a tree|in a house|The bear looks for honey in the forest.|The bear sleeps in the morning.',
    'Grandma makes an apple cake. Emma helps her in the kitchen. In the end they eat it together.|What kind of cake is it?|an apple cake|a cherry cake|a banana cake|Who helps Grandma?|Emma|Dad|the cat|Emma and Grandma eat together.|It is a banana cake.',
    'Hop the rabbit lives in the garden. He likes sweet carrots. Every day he eats two carrots.|Where does the rabbit live?|in the garden|in the forest|at school|How many carrots does he eat a day?|two|three|ten|The rabbit likes carrots.|The rabbit lives in the forest.',
    'In winter it snows a lot. The children make a snowman. They give him a carrot for a nose.|What do the children make?|a snowman|a house|a cake|What is the nose of the snowman?|a carrot|an apple|a stone|It snows in winter.|The children make a castle.',
    'Dad and Sam go to the mountains by train. On the way they see cows and horses. Sam is very happy.|How do they go to the mountains?|by train|by car|by plane|What do they see on the way?|cows and horses|fish|elephants|Sam is happy.|They go to the beach.',
    'The bee flies from flower to flower. It collects nectar. It makes sweet honey from the nectar.|What does the bee collect?|nectar|water|leaves|What does the bee make from nectar?|honey|milk|bread|The bee flies to the flowers.|The bee makes milk.'],
};
const EN2 = ['at', 'in', 'on', 'up', 'it', 'an', 'us', 'if', 'am', 'is', 'go', 'no', 'so', 'me', 'we', 'he'];
const rCut = s => { const m = s.match(/^([^\p{L}]+)(.+)$/u); return { e: m[1], p: m[2].split('-'), w: m[2].replace(/-/g, '') }; };
const RLD = {}, RWD = {}, RSD = {}, RTD = {};
for (const k of LANGS) {
  RLD[k] = RL[k].map(g => g.split(' ').map(s => { const c = rCut(s.slice(1)); return { l: s[0], e: c.e, w: c.w }; }));
  RWD[k] = RW[k].map(g => g.split(' ').map(rCut));
  RSD[k] = RS[k].map(s => { const a = s.split('|'); return { t: a[0], q: a[1], a: a[2], x: a.slice(3) }; });
  RTD[k] = RT[k].map(s => { const a = s.split('|'); return { t: a[0], qs: [{ q: a[1], a: a[2], x: a.slice(3, 5) }, { q: a[5], a: a[6], x: a.slice(7, 9) }], yes: a[9], no: a[10] }; });
}
const rChoice = (txt, q, stim, ok, others, cls, sy, col) => { const o = shuffle([ok, ...others]); return { mode: 'choice', txt, q, stim, o: { opts: o, ans: o.indexOf(ok) }, cls, sy: sy || [], col }; };
const rMatch = (txt, pairs) => ({ mode: 'match', txt, q: T('sc_match'), pairs, order: shuffle(pairs.map((_, k) => k)), left: pairs.length, sel: null, sy: [] });
const rTF = (txt, q, stim, yes) => ({ mode: 'choice', txt, q, stim, o: { opts: ['👍', '👎'], ans: yes ? 0 : 1 }, cls: 'em', sy: [] });
const wordH = w => `<span class="word">${w}</span>`;
const sentH = s => `<span class="sent">${s}</span>`;
// spec = [[group, from, to], ...]: the letters this lesson teaches; wrong answers come from every letter met so far
function rLetter(spec, ph, n) {
  const D = RLD[S.lang], pool = spec.flatMap(([g, a, b]) => D[g].slice(a, b)), x = pick(pool), lc = s => s.toLocaleLowerCase('es');
  const known = D.slice(0, Math.max(...spec.map(s => s[0])) + 1).flat().filter(y => y.l !== x.l), oth = sample(known, 3), others = oth.map(y => y.l);
  if (ph === 0) return rChoice('l0' + x.l, T('rd_letter', x.l), `${big(x.e)}<span class="word"><b class="hl">${up(x.w[0])}</b>${up(x.w.slice(1))}</span>`, x.l, others, 'ltr', [x.l, x.w]);
  const kind = ph === 1 ? (n === 4 ? 'match' : ['same', 'small'][n % 2]) : n === 9 ? 'match' : ['first', 'small', 'pic', 'same'][n % 4];
  if (kind === 'match') { const three = [x, ...oth.slice(0, 2)]; return rMatch('lm' + three.map(y => y.l).join(''), three.map(y => [y.l, lc(y.l)])); }
  if (kind === 'same') return rChoice('l1' + x.l, T('rd_same'), `<span class="word lc">${lc(x.l)}</span>`, x.l, others, 'ltr', [x.l]);
  if (kind === 'small') return rChoice('l3' + x.l, T('rd_small'), `<span class="word">${x.l}</span>`, lc(x.l), others.map(lc), 'ltr low', [x.l]);
  if (kind === 'pic') return rChoice('l4' + x.l, T('rd_startsPic', x.l), `<span class="word">${x.l}</span>`, x.e, oth.map(y => y.e), 'em', [x.l]);
  return rChoice('l2' + x.l, T('q_first'), big(x.e), x.l, others, 'ltr', [x.w]);
}
// cons = the consonants of this lesson; part = which third of the English two-letter words (3 = all)
function rSyl(ph, n, cons, part) {
  const C = [...cons], V5 = [...'aeiou'], en = S.lang === 'en', E2 = part > 2 ? EN2 : EN2.slice(part * 5, part * 5 + 6);
  const kind = ph === 0 ? 'build' : ph === 1 ? 'same' : ['pic', 'same', 'hear'][n % 3];
  if (kind === 'pic') { // a picture: which two letters does its word start with?
    const all = RWD[S.lang][0].concat(RWD[S.lang][1]).filter(x => /^[^aeiouăâîhq][aeiou]/.test(x.w)), mine = all.filter(x => C.includes(x.w[0]));
    const w = pick(mine.length > 3 ? mine : all), c = w.w[0], v = w.w[1];
    return rChoice('s2' + w.w, T('rd_starts'), big(w.e), up(c + v), [...sample(V5.filter(x => x !== v), 2).map(x => up(c + x)), up(pick([...'mnlrstpdbvf'].filter(x => x !== c)) + v)], 'ltr', [w.w]);
  }
  const s = en ? pick(E2) : pick(C) + pick(V5);
  if (kind === 'build' || kind === 'hear') return { mode: 'build', txt: 's' + kind + s, q: T('rd_makeSyl', up(s)), qs: T('rd_makeSyl', s), pic: '', parts: [...s].map(up),
    extra: sample([...'mnlrstpdbvf', ...V5].filter(x => !s.includes(x)), kind === 'hear' ? 2 : 1).map(up), model: kind === 'build' ? up(s) : '', sy: [s] };
  const others = en ? sample(EN2.filter(x => x !== s), 3) : [s[0] + pick(V5.filter(x => x !== s[1])), pick([...'mnlrstpdbvf'].filter(x => x !== s[0])) + s[1], s[1] + s[0]];
  return rChoice('s1' + s, T('rd_same'), `<span class="word lc">${s}</span>`, up(s), others.map(up), 'ltr', [s]);
}
// half = 0 or 1: the first or the second half of the words of this level
function rWord(lv, ph, n, half) {
  const all = RWD[S.lang][lv], mid = Math.ceil(all.length / 2), ws = half === 0 ? all.slice(0, mid) : half === 1 ? all.slice(mid) : all;
  const w = pick(ws), oth = k => sample(all.filter(x => x !== w), k);
  const kind = ph === 0 ? 'build' : ph === 1 ? (n === 4 ? 'match' : ['w2p', 'p2w'][n % 2]) : n === 9 ? 'match' : ['p2w', 'buildx', 'w2p', 'tf'][n % 4];
  if (kind === 'match') { const three = [w, ...oth(2)]; return rMatch('wm' + three.map(y => y.w).join(''), three.map(y => [up(y.w), y.e])); }
  if (kind === 'build' || kind === 'buildx') {
    const parts = (w.p.length > 1 ? w.p : [...w.w]).map(up);
    return { mode: 'build', txt: kind + w.w, q: T('rd_makeWord'), pic: big(w.e), parts, extra: [], model: kind === 'build' ? parts.join('·') : '', sy: [w.w] };
  }
  if (kind === 'w2p') return rChoice('w2p' + w.w, T('rd_readPick'), wordH(up(w.w)), w.e, oth(3).map(x => x.e), 'em');
  if (kind === 'p2w') return rChoice('p2w' + w.w, T('q_picWord'), big(w.e), up(w.w), oth(3).map(x => up(x.w)), 'txt');
  const yes = rnd(2);
  return rTF('tf' + w.w, T('rd_match'), big(w.e) + '<span class="brk"></span>' + wordH(up((yes ? w : oth(1)[0]).w)), yes);
}
// which: 0 = read a sentence, 1 = put its words in order, 2 = answer a question about it; set = which dozen of sentences
function rSent(which, ph, n, set) {
  const ss = RSD[S.lang], i = set * 12 + rnd(12), s = ss[i], e = SPIC[i], rest = () => Array.from({ length: 12 }, (_, k) => set * 12 + k).filter(k => k !== i);
  const build = model => ({ mode: 'build', txt: 'sb' + i, q: T('rd_order'), pic: `<span class="mid">${e}</span>`, parts: s.t.replace(/[.!?¿¡]/g, '').split(' '), extra: [], model: model ? s.t : '', sy: [s.t], wide: true });
  const s2p = () => rChoice('s2p' + i, T('rd_readPick'), sentH(s.t), e, sample(rest(), 3).map(k => SPIC[k]), 'em duo');
  // the question about a sentence: in the first step the cat reads the sentence out and a picture helps
  if (which === 2) return rChoice('sq' + i, s.q, (ph === 0 ? `<span class="mid">${e}</span><span class="brk"></span>` : '') + sentH(s.t), s.a, s.x, 'txt', ph === 0 ? [s.t] : [], true);
  if (which === 1) return build(ph === 0);
  if (ph === 0) return build(true);
  if (ph === 1 || n % 2 === 0) return s2p();
  const yes = rnd(2), j = yes ? i : pick(rest());
  return rTF('stf' + i, T('rd_match'), `<span class="mid">${SPIC[j]}</span><span class="brk"></span>` + sentH(s.t), yes);
}
// a short text of two or three sentences, then a question about it (tf = a sentence to judge as true or false)
function rText(tf, ph, n, from, to) {
  const i = from + rnd(to - from), t = RTD[S.lang][i], pic = ph === 0 ? `<span class="mid">${TPIC[i]}</span><span class="brk"></span>` : '', text = `<span class="sent text">${t.t}</span>`;
  if (tf) { const yes = rnd(2); return { ...rTF('tt' + i + yes, T('rd_true'), `${pic}${text}<span class="brk"></span><span class="claim">${yes ? t.yes : t.no}</span>`, yes), sy: ph === 0 ? [t.t] : [] }; }
  const k = rnd(2), q = t.qs[k];
  return rChoice('tq' + i + k, q.q, pic + text, q.a, q.x, 'txt', ph === 0 ? [t.t] : [], true);
}
// the name of a letter lesson is made from the letters themselves, which differ from one language to the next
const lName = (pre, spec) => LANGS.map((k, i) => {
  const ls = spec.flatMap(([g, a, b]) => RLD[k][g].slice(a, b)).map(x => x.l);
  return pre[i] + ' ' + (ls.length === 2 ? ls.join([' și ', ' y ', ' and '][i]) : ls.join(', '));
});
const LET = ['Literele', 'Las letras', 'The letters'], VOW = ['Vocalele', 'Las vocales', 'The vowels'], REV = ['Repetăm:', 'Repasamos:', 'Again:'];
const rL = (pre, spec, ch) => ({ ch, spec, n: lName(pre, spec), g: (p, n) => rLetter(spec, p, n) });
const num = (name, k) => name.map(s => s + ' ' + k);
const W0 = ['Cuvinte scurte', 'Palabras cortas', 'Short words'], W1 = ['Cuvinte din două silabe', 'Palabras de dos sílabas', 'Four-letter words'], W2 = ['Cuvinte lungi', 'Palabras largas', 'Long words'],
  W3 = ['Grupuri de litere', 'Letras dobles', 'Letter pairs'], S0 = ['Citim propoziții', 'Leemos frases', 'Reading sentences'], S1 = ['Cuvintele în ordine', 'Las palabras en orden', 'Words in order'],
  S2 = ['Înțeleg propoziția', 'Entiendo la frase', 'I understand the sentence'];
const RLESSONS = [
  rL(VOW, [[0, 0, 3]], ['Literele', 'Las letras', 'The letters']), rL(VOW, [[0, 3, 5]]),
  { spec: [[0, 0, 5]], n: ['Toate vocalele', 'Todas las vocales', 'All the vowels'], g: (p, n) => rLetter([[0, 0, 5]], p, n) },
  rL(LET, [[1, 0, 2]]), rL(LET, [[1, 2, 4]]), rL(LET, [[1, 4, 6]]), rL(REV, [[1, 0, 6]]),
  rL(LET, [[2, 0, 2]]), rL(LET, [[2, 2, 4]]), rL(LET, [[2, 4, 6]]), rL(REV, [[2, 0, 6]]),
  rL(LET, [[3, 0, 2]]), rL(LET, [[3, 2, 4]]), rL(LET, [[3, 4, 6]]),
  { spec: [[0, 0, 5], [1, 0, 6], [2, 0, 6], [3, 0, 6]], n: ['Toate literele', 'Todas las letras', 'All the letters'], g: (p, n) => rLetter([[0, 0, 5], [1, 0, 6], [2, 0, 6], [3, 0, 6]], p, n) },

  { ch: ['Silabele', 'Las sílabas', 'Two letters together'],
    n: ['Silabe cu M, N, L', 'Sílabas con M, N, L', 'Two-letter words 1'], g: (p, n) => rSyl(p, n, 'mnl', 0) },
  { n: ['Silabe cu R, S, T', 'Sílabas con R, S, T', 'Two-letter words 2'], g: (p, n) => rSyl(p, n, 'rst', 1) },
  { n: ['Silabe cu P, D, B, V, F', 'Sílabas con P, D, B, V, F', 'Two-letter words 3'], g: (p, n) => rSyl(p, n, 'pdbvf', 2) },
  { n: ['Toate silabele', 'Todas las sílabas', 'All the two-letter words'], g: (p, n) => rSyl(p, n, 'mnlrstpdbvf', 3) },

  { ch: ['Cuvintele', 'Las palabras', 'Words'], n: num(W0, 1), g: (p, n) => rWord(0, p, n, 0) }, { n: num(W0, 2), g: (p, n) => rWord(0, p, n, 1) },
  { n: num(W1, 1), g: (p, n) => rWord(1, p, n, 0) }, { n: num(W1, 2), g: (p, n) => rWord(1, p, n, 1) },
  { n: num(W2, 1), g: (p, n) => rWord(2, p, n, 0) }, { n: num(W2, 2), g: (p, n) => rWord(2, p, n, 1) },
  { n: num(W3, 1), g: (p, n) => rWord(3, p, n, 0) }, { n: num(W3, 2), g: (p, n) => rWord(3, p, n, 1) },

  { ch: ['Propozițiile', 'Las frases', 'Sentences'], n: num(S0, 1), g: (p, n) => rSent(0, p, n, 0) },
  { n: num(S1, 1), g: (p, n) => rSent(1, p, n, 0) }, { n: num(S2, 1), g: (p, n) => rSent(2, p, n, 0) },
  { n: num(S0, 2), g: (p, n) => rSent(0, p, n, 1) }, { n: num(S1, 2), g: (p, n) => rSent(1, p, n, 1) }, { n: num(S2, 2), g: (p, n) => rSent(2, p, n, 1) },

  { ch: ['Textele', 'Los textos', 'Short texts'],
    n: ['Două propoziții', 'Dos frases', 'Two sentences'], g: (p, n) => rText(0, p, n, 0, 6) },
  { n: ['Un text scurt', 'Un texto corto', 'A short text'], g: (p, n) => rText(0, p, n, 6, 12) },
  { n: ['Adevărat sau fals?', '¿Verdadero o falso?', 'True or false?'], g: (p, n) => rText(1, p, n, 0, 12) },
];

/* ---- the cat explains: each lesson opens with one or two worked examples, shown a step at a time ---- */
const F = (h, key, ...a) => ({ h, t: T(key, ...a) });
const lcl = s => s.toLocaleLowerCase('es');
const lPool = spec => spec.flatMap(([g, a, b]) => RLD[S.lang][g].slice(a, b));
function dLetter(spec, n) {
  const p = lPool(spec), x = p[n % p.length];
  return [F(`<div class="d-big"><i>${x.l}</i><i class="lo">${lcl(x.l)}</i></div>`, 'rd_dm_l1', x.l),
    F(`${big(x.e)}<span class="word"><b class="hl">${up(x.w[0])}</b>${up(x.w.slice(1))}</span>`, 'rd_dm_l2', x.l, x.w)];
}
function dSyl(part, n) {
  const cons = ['mnl', 'rst', 'pdbvf', 'mnlrstpdbvf'][part], E2 = part > 2 ? EN2 : EN2.slice(part * 5, part * 5 + 6);
  const s = S.lang === 'en' ? E2[n % E2.length] : cons[n % cons.length] + 'aeiou'[(n * 2 + part) % 5];
  return [F(`<div class="d-big"><i>${up(s[0])}</i><em>+</em><i>${up(s[1])}</i></div>`, 'rd_dm_s1', up(s[0]), up(s[1])),
    { ...F(`<div class="d-big join">${up(s)}</div>`, 'rd_dm_s2', up(s)), s: [T('rd_dm_s2', s)] }];
}
function dWord(lv, half, n) {
  const all = RWD[S.lang][lv], mid = Math.ceil(all.length / 2), ws = half ? all.slice(mid) : all.slice(0, mid), w = ws[n % ws.length], parts = w.p.length > 1 ? w.p : [...w.w];
  return [{ ...F(`${big(w.e)}<div class="d-big parts">${parts.map(up).join('<em>·</em>')}</div>`, 'rd_dm_w1', parts.map(up).join(' · ')), s: [T('rd_dm_w1', parts.join(', '))] },
    { ...F(`${big(w.e)}<div class="d-big join">${up(w.w)}</div>`, 'rd_dm_w2', up(w.w)), s: [T('rd_dm_w2', w.w)] }];
}
function dSent(set, n) {
  const i = set * 12 + n % 12, t = RSD[S.lang][i].t, pic = `<span class="mid">${SPIC[i]}</span>`;
  return [{ ...F(`${pic}<div class="d-sent">${t.split(' ').map((w, k) => `<i style="animation-delay:${(k * 0.45).toFixed(2)}s">${w}</i>`).join(' ')}</div>`, 'rd_dm_p1'), s: [T('rd_dm_p1'), t] },
    F(`${pic}<div class="d-sent"><b class="hl">${t[0]}</b>${t.slice(1, -1)}<b class="hl">${t.slice(-1)}</b></div>`, 'rd_dm_p2')];
}
function dText(from, to, n) {
  const i = from + n % (to - from), t = RTD[S.lang][i].t, h = `<span class="mid">${TPIC[i]}</span><span class="sent text">${t}</span>`;
  return [{ ...F(h, 'rd_dm_t1'), s: [T('rd_dm_t1'), t] }, F(h, 'rd_dm_t2')];
}
RLESSONS.forEach((L, i) => {
  if (L.spec) {
    const size = L.spec.reduce((s, [, a, b]) => s + b - a, 0);
    L.d = n => dLetter(L.spec, n); L.dn = Math.min(3, size);
    if (size <= 3) L.w = () => lPool(L.spec).flatMap(x => [x.l, lcl(x.l)]); // big and small, one after the other
  } else if (i < 19) L.d = n => dSyl(i - 15, n);
  else if (i < 27) L.d = n => dWord((i - 19) >> 1, (i - 19) & 1, n);
  else if (i < 33) L.d = n => dSent(i < 30 ? 0 : 1, n);
  else L.d = n => dText(i === 34 ? 6 : 0, i === 33 ? 6 : 12, n);
});
// the two paths: sums and reading; base = the lesson each age group starts on (everything before it is open too)
const TRACKS = { m: { list: LESSONS, base: [0, 20, 43] }, r: { list: RLESSONS, base: [0, 19, 27] } };
// progress saved on the earlier, shorter paths: an old lesson that was done counts for the new ones that cover it
if (S.school.v !== 2) {
  const move = (old, map) => { let top = -1, st = 1; (old || []).forEach((v, i) => { if (v && map[i] != null) { top = Math.max(top, map[i]); st = Math.max(st, v); } }); return Array.from({ length: top + 1 }, () => st); };
  S.school.m = move(S.school.m, [3, 7, 9, 12, 14, 19, 22, 24, 26, 25, 28, 33, 36, 39, 37, 42, 43, 47, 46, 50, 53, 55]);
  S.school.r = move(S.school.r, [2, 6, 10, 14, 18, 20, 22, 24, 26, 27, 28, 29]);
  S.school.v = 2; save();
}
const tabKey = () => (S.school.tab === 'r' ? 'r' : 'm');
const schoolDone = () => S.school.m.filter(Boolean).length + S.school.r.filter(Boolean).length;
const schoolAll = () => LESSONS.length + RLESSONS.length;

function vSchool() {
  const k = tabKey(), tr = TRACKS[k], st = S.school[k], base = tr.base[S.age];
  let last = -1; st.forEach((v, i) => { if (v) last = i; });
  const nextI = Math.max(base, last + 1);
  let chN = -1;
  const rows = tr.list.map((L, i) => {
    const open = i <= base || st[i - 1] || st[i];
    const head = L.ch ? `<h3 class="l-ch" style="background-image:linear-gradient(90deg, rgba(29, 43, 83, .78), rgba(29, 43, 83, .1)), url(assets/ch_${k}${++chN}.webp)">${L.ch[li()]}</h3>` : '';
    return head + (open ? `<button class="lesson${i === nextI ? ' next' : ''}" data-act="lesson" data-i="${i}"><b>${i + 1}</b><span>${L.n[li()]}</span>${starsStr(st[i] || 0)}</button>`
      : `<button class="lesson" disabled><b>🔒</b><span>${L.n[li()]}</span></button>`);
  }).join('');
  app.innerHTML = `<div class="page"><header class="topbar"><button class="icon-btn" data-act="go" data-v="map" aria-label="${T('toMap')}">←</button><h2 class="grow">${T('school')}</h2><span class="pill">${schoolDone()} / ${schoolAll()}</span></header>
    <div class="body"><div class="seg tabs2">${[['m', '🧮', 'sc_math'], ['r', '📖', 'sc_read']].map(([v, ic, s]) => `<button data-act="stab" data-k="${v}" aria-pressed="${k === v}">${ic} ${T(s)}</button>`).join('')}</div>
      <p class="note">${T('schoolNote')}</p><div class="lessons">${rows}</div></div></div>`;
  const nx = app.querySelector('.lesson.next'); if (nx) nx.scrollIntoView({ block: 'center' });
}

// the cells of a still abacus picture: a = first number, b = second number, x = taken away, . = empty
function beadCells(it) {
  if (it.kind === 'mul' || it.kind === 'div') {
    const rows = it.kind === 'mul' ? it.a : it.b, per = it.kind === 'mul' ? it.b : it.ans;
    return Array.from({ length: rows }, (_, r) => (r % 2 ? 'b' : 'a').repeat(per).padEnd(10, '.'));
  }
  const s = (it.kind === 'sub' ? 'a'.repeat(it.a - it.b) + 'x'.repeat(it.b) : 'a'.repeat(it.a) + 'b'.repeat(it.b)).padEnd(Math.max(1, Math.ceil((it.a + (it.kind === 'sub' ? 0 : it.b)) / 10)) * 10, '.');
  return s.match(/.{10}/g);
}
// skin = two emoji drawn instead of the red and blue beads, so the same sum is also seen as apples or fish
const SKINS = [['🍎', '🍏'], ['🐟', '🐠'], ['⭐', '🌙'], ['🐭', '🐹'], ['🍓', '🍒']];
const beadPic = (it, skin) => {
  const rows = beadCells(it);
  return `<div class="abacus r${rows.length > 2 ? 10 : rows.length}${skin ? ' em' : ''}">${rows.map(r => `<div class="rod">${[...r].map(c => `<i class="bead ${c === '.' ? 'off' : c}">${skin && c !== '.' ? skin[c === 'b' ? 1 : 0] : ''}</i>`).join('')}</div>`).join('')}</div>`;
};
function paintBeads() {
  const it = cur.it, box = $('.abacus'); if (!box) return;
  const grp = it.kind === 'mul' || it.kind === 'div';
  box.innerHTML = cur.c.map((n, r) => `<div class="rod">${Array.from({ length: 10 }, (_, i) => `<button class="bead ${i < n ? (grp ? (r % 2 ? 'b' : 'a') : r * 10 + i < it.start ? 'a' : 'b') : 'off'}" data-act="bead" data-r="${r}" data-i="${i}" aria-label="${i + 1}"></button>`).join('')}</div>`).join('');
  $('#tot').textContent = cur.c.reduce((a, b) => a + b, 0);
}
function sOpts(c) {
  const o = shuffle([c, ...sample([c - 1, c + 1, c - 2, c + 2, c + 10, c - 10].filter(v => v >= 0), 3)]);
  return { opts: o.map(String), ans: o.indexOf(c) };
}
// the steps of a lesson: [name, picture, how many questions, which difficulty its questions are made for]
const STG = { ex: ['ph_ex', '🐱', 2, 0], d: ['ph_0', '🔍', 4, 0], u: ['ph_1', '💡', 5, 1], w: ['ph_w', '✏️', 3, 1], p: ['ph_2', '⚡', 10, 2] };
const stageId = () => cur.stages[cur.si];
const stageN = () => cur.left || (stageId() === 'ex' ? cur.L.dn || 2 : stageId() === 'w' ? Math.min(6, cur.L.w().length) : STG[stageId()][2]);

// a little story around a sum: who has how many of what
const SOBJ = [['🍎', ['măr', 'mere', 'Câte'], ['manzana', 'manzanas', 'Cuántas'], ['apple', 'apples']], ['🎈', ['balon', 'baloane', 'Câte'], ['globo', 'globos', 'Cuántos'], ['balloon', 'balloons']],
  ['🐟', ['pește', 'pești', 'Câți'], ['pez', 'peces', 'Cuántos'], ['fish', 'fish']], ['🌸', ['floare', 'flori', 'Câte'], ['flor', 'flores', 'Cuántas'], ['flower', 'flowers']],
  ['⭐', ['stea', 'stele', 'Câte'], ['estrella', 'estrellas', 'Cuántas'], ['star', 'stars']], ['⚽', ['minge', 'mingi', 'Câte'], ['pelota', 'pelotas', 'Cuántas'], ['ball', 'balls']]];
const SNAME = [['Ana', 'Ana', 'Anna'], ['Dan', 'Dani', 'Dan'], ['Ema', 'Ema', 'Emma'], ['Radu', 'Raúl', 'Sam']];
function story(it) {
  const o = pick(SOBJ), l = li(), nm = pick(SNAME)[l], w = o[l + 1], add = it.kind === 'add';
  // Romanian puts "de" after numbers that end in 20 or more: 34 de mere
  const cnt = n => n + (l === 0 && n > 19 && (n % 100 === 0 || n % 100 > 19) ? ' de ' : ' ') + (n === 1 ? w[0] : w[1]);
  const t = l === 0 ? (add ? `${nm} are ${cnt(it.a)}. Mai primește ${it.b}. ${w[2]} ${w[1]} are acum?` : `${nm} are ${cnt(it.a)}. Dă ${it.b} unui prieten. ${w[2]} ${w[1]} îi rămân?`)
    : l === 1 ? (add ? `${nm} tiene ${cnt(it.a)}. Le dan ${it.b} más. ¿${w[2]} ${w[1]} tiene ahora?` : `${nm} tiene ${cnt(it.a)}. Regala ${it.b}. ¿${w[2]} ${w[1]} le quedan?`)
      : add ? `${nm} has ${cnt(it.a)}. ${nm} gets ${it.b} more. How many ${w[1]} does ${nm} have now?` : `${nm} has ${cnt(it.a)}. ${nm} gives ${it.b} away. How many ${w[1]} are left?`;
  return { e: o[0], t };
}
const dotz = n => `<span class="dotz">${'●'.repeat(n)}</span>`;
// three sums of the same kind to pair with their answers (numbers are paired with groups of dots)
function mathMatch(it, L) {
  const items = [it], show = it.kind === 'show';
  for (let k = 0; k < 60 && items.length < 3; k++) { const x = L.g(cur.ph, k); if (!x.mode && x.kind === it.kind && !items.some(y => y.ans === x.ans || y.txt === x.txt)) items.push(x); }
  if (items.length < 3 || (show && items.some(x => x.ans > 10))) return false;
  Object.assign(it, rMatch('m' + items.map(x => x.txt).join('|'), items.map(x => [show ? dotz(x.ans) : x.txt, String(x.ans)])));
  return true;
}
// a sum takes a different shape from one question to the next: beads to move, things to tap and count, numbers to pick,
// a keypad to type on, a little story, true or false, balloons to pop, pairs to match
function mathFmt(it, L) {
  const show = it.kind === 'show', bond = it.kind === 'bond', sum = it.kind === 'add' || it.kind === 'sub';
  it.sy = [];
  if (cur.ph === 0) {
    if (cur.n % 2 && (show || it.kind === 'add') && it.target <= 10) { it.mode = 'count'; it.q = T('sc_tapCount'); return; }
    it.mode = 'beads';
    it.q = T('sc_i_' + it.kind, bond ? it.target : it.kind === 'div' || it.kind === 'mul' || show ? it.a : it.b, it.b);
    return;
  }
  const kinds = sum ? ['choice', 'pad', 'story', 'tf', 'pop'] : ['choice', 'pad', 'tf', 'pop'];
  let f = cur.ph === 1 ? (cur.n === 4 ? 'match' : 'choice') : cur.n === 9 ? 'match' : kinds[cur.n % kinds.length];
  if (f === 'match') { if (mathMatch(it, L)) return; f = 'choice'; }
  it.q = f === 'pad' ? T(show ? 'q_count' : 'sc_type') : f === 'tf' ? T('sc_true') : f === 'pop' ? T('sc_pop') : f === 'story' ? T('sc_story') : show ? T('q_count') : bond ? T('q_missNum') : T('q_solve');
  it.stim = show ? '' : expr(it.txt);
  it.help = beadPic(it, cur.ph === 1 && cur.n % 2 ? SKINS[cur.i % SKINS.length] : null);
  it.helpOn = cur.ph === 1 || show;
  if (f === 'pad') { it.mode = 'pad'; return; }
  it.mode = 'choice';
  if (f === 'story') {
    const st = story(it);
    it.stim = `<span class="mid">${st.e}</span><span class="brk"></span><span class="sent text">${st.t}</span>`; it.sy = [st.t]; it.helpOn = false;
    it.o = sOpts(it.ans); it.cls = 'num';
  } else if (f === 'tf') {
    const yes = rnd(2), v = yes ? it.ans : Math.abs(it.ans + pick([-1, 1, 2, it.ans > 2 ? -2 : 3]));
    it.stim = expr(show ? String(v) : bond ? `${it.a} + ${v} = ${it.target}` : `${it.txt} = ${v}`);
    it.o = { opts: ['👍', '👎'], ans: yes ? 0 : 1 }; it.cls = 'em';
  } else { it.o = sOpts(it.ans); it.cls = 'num'; it.pop = f === 'pop'; }
}
// the worked example for a sum, drawn with a few things when the numbers are small and with the beads when they are not
function mathDemo(it) {
  const e = SKINS[cur.i % SKINS.length], k = it.kind, a = it.a, b = it.b;
  const ob = (n, c, num, from, cls) => Array.from({ length: n }, (_, i) => `<span class="dob ${cls || ''}" style="animation-delay:${(i * 0.16).toFixed(2)}s">${c}${num ? `<b>${(from || 0) + i + 1}</b>` : ''}</span>`).join('');
  const box = (h, small) => `<div class="dobs${small ? ' sm' : ''}">${h}</div>`, ex = s => `<div class="d-expr">${expr(s)}</div>`, digit = n => `<div class="d-big"><i>${n}</i></div>`;
  if (k === 'seq') {
    const s = [a, a + 1, a + 2, a + 3], line = hl => `<div class="d-line">${s.map((v, i) => `<i class="${i === hl ? 'hl' : ''}" style="animation-delay:${(i * 0.3).toFixed(1)}s">${v}</i>`).join('')}</div>`;
    return [F(line(-1), 'dm_seq1', s.join(', ')), F(line(1), 'dm_seq2', s[1], s[2], s[0])];
  }
  if (k === 'cmp') {
    const hi = Math.max(a, b), lo = Math.min(a, b);
    const h = hi <= 10 ? `<div class="dgrp">${ob(a, e[0])}</div><div class="dgrp">${ob(b, e[1])}</div>` : `<div class="d-big"><i>${a}</i><i>${b}</i></div>`;
    return [F(h, hi <= 10 ? 'dm_cmp1' : 'dm_cmpB', a, b), F(h + ex(`${hi} > ${lo}`), 'dm_cmp2', hi, lo)];
  }
  if (k === 'show') {
    const n = it.target;
    if (n <= 12) return [F(box(ob(n, e[0], true)), 'dm_show1', Array.from({ length: n }, (_, i) => i + 1).join(', ')), F(digit(n) + box(ob(n, e[0], false, 0, 'still')), 'dm_show2', n)];
    return [F(beadPic(sShow(10, 1)), 'dm_ten'), F(beadPic(it), 'dm_tens', Math.floor(n / 10), n % 10, n), F(digit(n) + beadPic(it), 'dm_show2', n)];
  }
  if (k === 'bond') return [F(box(ob(a, e[0]) + ob(b, '', false, 0, 'slot')), 'dm_bond1', a, it.target), F(box(ob(a, e[0], false, 0, 'still') + ob(b, e[1])), 'dm_bond2', b),
    F(box(ob(a, e[0], false, 0, 'still') + ob(b, e[1], false, 0, 'still')) + ex(`${a} + ${b} = ${it.target}`), 'dm_plus', a, b, it.target)];
  if (k === 'add') {
    if (it.target <= 12) return [F(box(ob(a, e[0])), 'dm_have', a), F(box(ob(a, e[0], false, 0, 'still') + ob(b, e[1])), 'dm_more', b),
      F(box(ob(a, e[0], true, 0, 'still') + ob(b, e[1], true, a, 'still')), 'dm_all', it.ans), F(box(ob(a, e[0], false, 0, 'still') + ob(b, e[1], false, 0, 'still')) + ex(`${it.txt} = ${it.ans}`), 'dm_plus', a, b, it.ans)];
    const cross = a % 10 + b % 10 > 9 && b < 10;
    return [F(beadPic(sShow(a, it.rows)), 'dm_have', a), F(beadPic(it), cross ? 'dm_cross' : 'dm_more', b), F(beadPic(it) + ex(`${it.txt} = ${it.ans}`), 'dm_plus', a, b, it.ans)];
  }
  if (k === 'sub') {
    if (a <= 12) return [F(box(ob(a, e[0])), 'dm_have', a), F(box(ob(a - b, e[0], false, 0, 'still') + ob(b, e[0], false, 0, 'gone')), 'dm_take', b),
      F(box(ob(a - b, e[0], true, 0, 'still')), 'dm_left', it.ans), F(box(ob(a - b, e[0], false, 0, 'still') + ob(b, e[0], false, 0, 'gone')) + ex(`${it.txt} = ${it.ans}`), 'dm_minus', a, b, it.ans)];
    return [F(beadPic(sShow(a, it.rows)), 'dm_have', a), F(beadPic(it), 'dm_take', b), F(beadPic(it) + ex(`${it.txt} = ${it.ans}`), 'dm_minus', a, b, it.ans)];
  }
  // equal groups: a rows of b (multiplying) or b rows of the answer (dividing)
  const rows = k === 'mul' ? a : b, per = k === 'mul' ? b : it.ans, tot = rows * per, small = tot <= 36;
  const grp = (r, cls) => small ? Array.from({ length: r }, (_, i) => `<div class="dgrp sm">${ob(per, e[i % 2], false, 0, cls)}</div>`).join('') : beadPic(it);
  if (k === 'mul') return [F(small ? grp(1) : beadPic(sShow(per, 1)), 'dm_grp1', per), F(grp(rows), 'dm_grp2', rows, per), F(grp(rows, 'still') + ex(`${it.txt} = ${it.ans}`), 'dm_times', rows, per, tot)];
  return [F(small ? box(ob(tot, e[0]), true) : beadPic(sShow(tot, 10)), 'dm_have', tot), F(grp(rows), 'dm_div1', tot, rows), F(grp(rows, 'still') + ex(`${it.txt} = ${it.ans}`), 'dm_div2', per, tot, rows)];
}

function startLesson(i) {
  hush();
  const tr = tabKey(), L = TRACKS[tr].list[i];
  cur = { school: true, tr, i, L, stages: ['ex', 'd', 'u', ...(L.w ? ['w'] : []), 'p'], si: 0, ph: 0, n: 0, ok: 0, tries: 0, left: 0, seen: new Set(), it: null, wrong: 0, lock: false, streak: 0, lastQ: '' };
  view = 'lesson';
  lessonStep();
}
function lessonFrame(inner) {
  app.innerHTML = `<div class="page lesson-pg"><header class="topbar"><button class="icon-btn" data-act="go" data-v="school" aria-label="←">←</button><h2 class="grow l-name">${cur.L.n[li()]}</h2><button class="cat mini helpcat" data-act="chelp" aria-label="ElGatoLoco">${cat('sit')}<i>?</i></button></header>
    <div class="phases">${cur.stages.map((s, k) => `<span class="ph${k === cur.si ? ' on' : k < cur.si ? ' was' : ''}">${STG[s][1]}${k === cur.si ? ' ' + T(STG[s][0]) : ''}</span>`).join('')}</div>
    <div class="dots">${Array.from({ length: stageN() }, (_, k) => `<i class="${k < cur.n ? 'on' : ''}"></i>`).join('')}</div>
    <div class="panel show" id="panel">${inner}</div></div>`;
}
function demoStep() {
  const L = cur.L;
  cur.it = { mode: 'demo', txt: 'demo', at: 0, frames: L.d ? L.d(cur.n) : mathDemo(L.g(0, cur.n)), sy: [] }; cur.wrong = 0; cur.lock = false;
  demoPaint();
}
function demoPaint() {
  const it = cur.it, f = it.frames[it.at], last = it.at === it.frames.length - 1;
  lessonFrame(`<div class="demo"><div class="d-stage">${f.h}</div><div class="d-talk"><span class="d-cat">${cat('wave')}</span><p class="d-cap" data-act="say" data-lang="${S.lang}" data-text="${f.t.replace(/"/g, '')}">${f.t}</p></div>
      <div class="d-steps">${it.frames.map((_, k) => `<i class="${k <= it.at ? 'on' : ''}"></i>`).join('')}</div></div>
    <button class="btn" data-act="dnext">${T(last ? 'sc_gotit' : 'sc_more')} ▶</button>`);
  (f.s || [f.t]).forEach((t, k) => say(t, S.lang, k > 0));
}
// writing with a finger: the digit or letter is drawn pale and the child goes over it
function traceStep() {
  const list = cur.L.w(), g = list[cur.n % list.length], q = T('sc_trace', g);
  cur.it = { mode: 'trace', txt: 'w' + g, g, sy: [] }; cur.wrong = 0; cur.lock = false;
  lessonFrame(`<p class="q" data-act="say" data-lang="${S.lang}" data-text="${q}">${q}</p><div class="tracebox"><canvas class="trace"></canvas></div><p class="hintline" id="shint"></p>
    <button class="btn alt small" data-act="tclear">↺ ${T('sc_clear')}</button>`);
  say(q, S.lang);
  traceSetup($('.trace'), g);
}
function traceSetup(cv, g) {
  const box = cv.parentNode, W = Math.max(160, Math.min(box.clientWidth, box.clientHeight || 300, 320)), dpr = Math.min(2, window.devicePixelRatio || 1), tok = cur, it = cur.it;
  cv.style.width = cv.style.height = W + 'px'; cv.width = cv.height = W * dpr;
  const ctx = cv.getContext('2d'), m = document.createElement('canvas'); m.width = m.height = W;
  const mx = m.getContext('2d', { willReadFrequently: true });
  // the shape fills most of the square, whatever the letter: tall, wide or with a tail below the line
  let fs = W * 0.8; mx.font = `800 ${fs}px ${GFONT}`;
  const m0 = mx.measureText(g), gw = (m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight) || m0.width, gh = (m0.actualBoundingBoxAscent + m0.actualBoundingBoxDescent) || fs;
  fs *= Math.min(W * 0.8 / gh, W * 0.82 / gw, 1.6);
  const font = `800 ${fs}px ${GFONT}`;
  mx.font = font; mx.textAlign = 'center'; mx.textBaseline = 'alphabetic';
  const mt = mx.measureText(g), by = (W + mt.actualBoundingBoxAscent - mt.actualBoundingBoxDescent) / 2;
  mx.fillText(g, W / 2, by);
  const A = mx.getImageData(0, 0, W, W).data, inside = (x, y) => x >= 0 && y >= 0 && x < W && y < W && A[((y | 0) * W + (x | 0)) * 4 + 3] > 90;
  const cells = []; for (let y = 5; y < W; y += 9) for (let x = 5; x < W; x += 9) if (inside(x, y)) cells.push({ x, y, hit: false });
  let strokes = [], pts = 0, out = 0, down = false, last = null;
  const paint = ok => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, W);
    ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = ok ? '#bff0d2' : '#e7e3fb'; ctx.fillText(g, W / 2, by);
    ctx.setLineDash([7, 6]); ctx.lineWidth = 2.5; ctx.strokeStyle = ok ? '#2fbf71' : '#7c5cff'; ctx.strokeText(g, W / 2, by); ctx.setLineDash([]);
    ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(16, W * 0.075); ctx.strokeStyle = ok ? '#2fbf71' : '#ff6b6b';
    strokes.forEach(s => { ctx.beginPath(); s.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (s.length === 1) ctx.lineTo(s[0][0] + 0.1, s[0][1]); ctx.stroke(); });
  };
  const mark = (x, y) => {
    pts++; if (!(inside(x, y) || inside(x - 9, y) || inside(x + 9, y) || inside(x, y - 9) || inside(x, y + 9))) out++;
    const r = W * 0.075; cells.forEach(c => { if (!c.hit && Math.abs(c.x - x) < r && Math.abs(c.y - y) < r) c.hit = true; });
  };
  const reset = () => { strokes = []; pts = out = 0; cells.forEach(c => { c.hit = false; }); paint(); };
  const done = () => { if (cur !== tok || cur.lock) return; paint(true); say(g, S.lang); lessonGood(1100); };
  const check = () => {
    if (cells.filter(c => c.hit).length / Math.max(1, cells.length) < 0.8) return;
    if (out / pts > 0.4) { lessonBad(); reset(); $('#shint').textContent = T('sc_traceIn'); return; } // scribbled all over instead of following the shape
    done();
  };
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => {
    if (cur !== tok || cur.lock) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    down = true; last = pos(e); strokes.push([last]); mark(last[0], last[1]); paint();
  });
  cv.addEventListener('pointermove', e => {
    if (!down || cur !== tok || cur.lock) return;
    const p = pos(e), d = Math.hypot(p[0] - last[0], p[1] - last[1]); if (d < 3) return;
    const n = Math.ceil(d / 6); for (let k = 1; k <= n; k++) mark(last[0] + (p[0] - last[0]) * k / n, last[1] + (p[1] - last[1]) * k / n);
    strokes[strokes.length - 1].push(p); last = p; paint();
  });
  const lift = () => { if (!down) return; down = false; if (cur === tok && !cur.lock) check(); };
  cv.addEventListener('pointerup', lift); cv.addEventListener('pointercancel', lift);
  it.clear = reset; it.finish = done;
  paint();
}
function lessonStep() {
  const sid = stageId();
  if (sid === 'ex') return demoStep();
  if (sid === 'w') return traceStep();
  const list = TRACKS[cur.tr].list;
  let L = cur.L;
  // practice mixes in two questions from the last few lessons so that old skills stay fresh
  if (cur.ph === 2 && cur.i > 0 && (cur.n === 3 || cur.n === 7)) L = list[Math.max(0, cur.i - 5) + rnd(Math.min(5, cur.i))];
  let it; for (let k = 0; k < 40; k++) { it = L.g(cur.ph, cur.n); if (!cur.seen.has(it.txt)) break; }
  cur.seen.add(it.txt); cur.it = it; cur.wrong = 0; cur.lock = false;
  if (!it.mode) mathFmt(it, L);
  const q = it.q, top = it.stim || '';
  let body;
  if (it.mode === 'beads') {
    cur.c = Array.from({ length: it.rows }, (_, r) => Math.max(0, Math.min(10, it.start - r * 10)));
    body = `<div class="stim s-top">${it.kind === 'show' ? '' : expr(it.txt)}<span class="count">🧮 <b id="tot">0</b></span></div>
      <div class="abacus live r${it.rows > 2 ? 10 : it.rows}"></div><p class="hintline" id="shint"></p>
      <button class="btn" data-act="scheck">✔ ${T('sc_ready')}</button>`;
  } else if (it.mode === 'count') {
    const e = SKINS[cur.i % SKINS.length], cells = it.kind === 'add' ? [...Array(it.a).fill(e[0]), ...Array(it.b).fill(e[1])] : Array(it.target).fill(e[0]);
    it.at = 0; it.need = cells.length;
    body = `<div class="stim s-top">${it.kind === 'add' ? expr(it.txt) : ''}<span class="count big"><b id="tot">0</b></span></div>
      <div class="cbox">${cells.map(c => `<button class="cobj" data-act="ctap">${c}</button>`).join('')}</div>`;
  } else if (it.mode === 'match') {
    const btn = (k, s) => `<button class="mbtn" data-act="mpair" data-s="${s}" data-k="${k}">${it.pairs[k][s === 'l' ? 0 : 1]}</button>`;
    body = `<div class="match"><div class="mcol">${it.pairs.map((_, k) => btn(k, 'l')).join('')}</div><div class="mcol">${it.order.map(k => btn(k, 'r')).join('')}</div></div><p class="hintline" id="shint"></p>`;
  } else if (it.mode === 'build') {
    it.at = 0;
    body = `<div class="stim s-top grow">${it.pic}${it.sy.length ? sayBtn(it.sy[0], S.lang) : ''}${it.model ? `<span class="brk"></span><span class="model">${it.model}</span>` : ''}</div>
      <div class="built${it.wide ? ' wide' : ''}">${it.parts.map((_, k) => `<span class="${k ? '' : 'cur'}"></span>`).join('')}</div>
      <div class="tiles rt${it.wide ? ' wide' : ''}">${shuffle([...it.parts, ...it.extra]).map(t => `<button class="tile" data-act="rtile" data-t="${t}">${t}</button>`).join('')}</div>`;
  } else if (it.mode === 'pad') {
    body = `<div class="stim s-top">${top}<span class="pval" id="pval"></span></div><div class="help"${it.helpOn ? '' : ' hidden'}>${it.help}</div><p class="hintline" id="shint"></p>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<button data-act="pkey" data-k="${d}">${d}</button>`).join('')}<button class="del" data-act="pkey" data-k="del" aria-label="⌫">⌫</button><button class="go" data-act="pkey" data-k="ok">✔ ${T('sc_ready')}</button></div>`;
  } else {
    body = `<div class="stim s-top${it.help ? '' : ' grow'}">${top}</div>${it.help ? `<div class="help"${it.helpOn ? '' : ' hidden'}>${it.help}</div>` : ''}
      <div class="opts${it.col ? ' col' : ''}${it.pop ? ' pops' : ''}${it.o.opts.length === 2 ? ' two' : ''}">${it.o.opts.map((o, k) => `<button class="opt ${it.cls || ''}" data-act="sopt" data-i="${k}">${o}</button>`).join('')}</div>`;
  }
  const spoken = it.qs || q;
  lessonFrame(`<p class="q" data-act="say" data-lang="${S.lang}" data-text="${spoken.replace(/"/g, '')}">${q}</p>${body}`);
  if (it.mode === 'beads') paintBeads();
  // the question is read out when it changes; the word, letter or sentence to work on is always read out
  (q !== cur.lastQ || it.mode === 'beads' ? [spoken] : []).concat(it.sy).forEach((t, k) => say(t, S.lang, k > 0));
  cur.lastQ = q;
}
// a right answer: the little cat at the top hops, and a run of right answers gets a cheer
function lessonGood(wait) {
  cur.lock = true; sfx('good'); buzz(25);
  if (!cur.wrong) { cur.streak++; if (cur.ph === 2) cur.ok++; } else cur.streak = 0;
  const c = $('.lesson-pg .cat.mini');
  if (c) { hop(c); floatEm(c, cur.streak >= 3 ? '🔥' : pick(['💗', '⭐', '✨']), c.clientWidth / 2 - 12, 30); }
  if (cur.streak === 3 || cur.streak === 6) later(250, () => sfx('meow'));
  later(wait, lessonNext);
}
// the cat steps in after two slips (or when it is tapped at the top of a lesson): sums are acted out again, and the right answer blinks
function catHelp() {
  const it = cur && cur.school && cur.it;
  if (!it || cur.lock || $('.helpov') || ['demo', 'trace', 'count', 'beads'].includes(it.mode)) return;
  if (!cur.wrong) cur.wrong = 1; // asked for help: no longer a first-try answer
  it.hf = it.kind ? mathDemo(it) : [F('', 'sc_catLook')]; it.ha = 0;
  const p = $('#panel'); p.insertAdjacentHTML('beforeend', '<div class="helpov"></div>');
  sfx('meow'); say(T('sc_catHelp'), S.lang);
  helpPaint();
}
function helpPaint() {
  const it = cur.it, f = it.hf[it.ha], last = it.ha === it.hf.length - 1;
  $('.helpov').innerHTML = `<b class="h-title">${T('sc_catHelp')}</b><div class="d-stage">${f.h}</div>
    <div class="d-talk"><span class="d-cat">${cat('wave')}</span><p class="d-cap">${f.t}</p></div><button class="btn" data-act="hnext">${T(last ? 'sc_gotit' : 'sc_more')} ▶</button>`;
  say(f.t, S.lang, true);
}
function helpEnd() {
  const it = cur.it, ov = $('.helpov'); if (ov) ov.remove();
  if (it.mode === 'choice') $('.opts').children[it.o.ans].classList.add('hint');
  else if (it.mode === 'pad') $('#shint').textContent = '= ' + it.ans;
  else if (it.mode === 'build') { const t = [...$('.tiles').children].find(x => !x.classList.contains('used') && x.dataset.t === it.parts[it.at]); if (t) t.classList.add('hint'); }
  else if (it.mode === 'match') { const l = app.querySelector('.mbtn[data-s=l]:not(.ok)'); if (l) { l.classList.add('hint'); app.querySelector(`.mbtn[data-s=r][data-k="${l.dataset.k}"]`).classList.add('hint'); } }
}
function lessonBad() { sfx('bad'); buzz([70, 50, 70]); cur.wrong++; cur.streak = 0; if (cur.wrong === 2) later(600, catHelp); }
function lessonNext() {
  cur.n++;
  if (cur.n < stageN()) return lessonStep();
  const sid = stageId();
  if (sid !== 'p') { // a step is over: on to the next one, with a short break with the cat after discovering and before practising
    cur.si++;
    if (cur.tries && stageId() === 'w') cur.si++; // a second try at practice does not repeat the writing
    const nx = stageId();
    cur.ph = STG[nx][3]; cur.n = 0; cur.ok = 0; cur.left = 0; cur.seen = new Set(); cur.lastQ = '';
    const b = sid === 'd' ? pick(['pet', 'tickle']) : nx === 'p' ? pick(['feed', 'bubbles', 'hide', 'chase']) : '';
    if (!b) return lessonStep();
    sfx('clap'); lessonFrame('');
    return (BREAK_FN[b] || petBreak)(b);
  }
  if (cur.ok >= PASS) return lessonDone();
  // not there yet: look at the pictures twice more, then practise again
  const tok = cur; cur.tries++;
  app.innerHTML = `<div class="done"><button class="cat" data-act="pet" aria-label="ElGatoLoco">${cat('wave')}</button><h2>${cur.ok} / ${STG.p[2]}</h2><p class="label">${T('sc_retry')}</p>
    <div class="row"><button class="btn" data-act="sretry">${T('again')} ▶</button><button class="btn alt" data-act="go" data-v="school">${T('school')}</button></div></div>`;
  cur = tok;
}
function lessonDone() {
  const i = cur.i, tr = cur.tr, m = S.school[tr], list = TRACKS[tr].list, stars = cur.tries === 0 ? 3 : cur.tries === 1 ? 2 : 1;
  // the last lesson of a chapter, finished for the first time: the film of the stars going home, then the usual screen
  if (!m[i] && !cur.filmed && (i + 1 === list.length || list[i + 1].ch)) { const keep = cur; keep.filmed = true; return cine([[pick(WINS), 'cine_ch']], () => { cur = keep; lessonDone(); }); }
  m[i] = Math.max(m[i] || 0, stars);
  for (let k = 0; k < m.length; k++) m[k] = m[k] || 0;
  S.school.tab = tr; save(); sfx('win'); confetti(); setTimeout(() => sfx('meow'), 950);
  cur = null; view = 'done';
  app.innerHTML = `<div class="done"><button class="cat" data-act="pet" aria-label="ElGatoLoco">${cat('cheer')}</button><h2>${T('sc_pass')}</h2>
    <div class="stars3">${[1, 2, 3].map(k => `<span class="${k <= stars ? 'on' : ''}">★</span>`).join('')}</div><p class="label">${list[i].n[li()]}</p>
    <div class="row">${i + 1 < list.length ? `<button class="btn" data-act="lesson" data-i="${i + 1}">${T('sc_next')} ▶</button>` : ''}
      <button class="btn alt" data-act="go" data-v="school">${T('school')}</button><button class="btn alt" data-act="go" data-v="map">${T('toMap')}</button></div></div>`;
}
const SCHOOL_ACT = {
  stab(d) { sfx('tap'); S.school.tab = d.k; save(); vSchool(); },
  lesson(d) { sfx('tap'); startLesson(+d.i); },
  sretry() { if (!cur || !cur.school) return; sfx('tap'); cur.si = cur.stages.indexOf('u'); cur.ph = 1; cur.n = 0; cur.ok = 0; cur.left = 2; cur.seen = new Set(); cur.lastQ = ''; lessonStep(); },
  // the cat's explanation: one step further
  dnext() {
    const it = cur && cur.school && cur.it; if (!it || it.mode !== 'demo' || cur.lock) return;
    sfx('tap');
    if (it.at < it.frames.length - 1) { it.at++; return demoPaint(); }
    cur.lock = true; lessonNext();
  },
  chelp() { catHelp(); },
  hnext() { const it = cur && cur.school && cur.it; if (!it || !it.hf) return; sfx('tap'); if (it.ha < it.hf.length - 1) { it.ha++; return helpPaint(); } helpEnd(); },
  tclear() { const it = cur && cur.school && cur.it; if (it && it.mode === 'trace' && !cur.lock) { sfx('tap'); it.clear(); } },
  // counting by touch: each thing gets its number as it is tapped
  ctap(d, b) {
    const it = cur && cur.school && cur.it; if (!it || it.mode !== 'count' || cur.lock || b.classList.contains('on')) return;
    it.at++; b.classList.add('on'); b.insertAdjacentHTML('beforeend', `<i>${it.at}</i>`); $('#tot').textContent = it.at;
    sfx('tap'); say(String(it.at), S.lang);
    if (it.at < it.need) return;
    if (it.kind === 'add') $('.s-top').innerHTML = `<span class="expr good">${it.txt} = ${it.ans}</span>`;
    lessonGood(1400);
  },
  // pairs: pick one on the left, then its partner on the right
  mpair(d, b) {
    const it = cur && cur.school && cur.it; if (!it || it.mode !== 'match' || cur.lock || b.classList.contains('ok')) return;
    if (d.s === 'l') { app.querySelectorAll('.mbtn.sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); it.sel = +d.k; return sfx('tap'); }
    if (it.sel == null) { $('#shint').textContent = T('sc_matchHint'); return; }
    if (+d.k !== it.sel) { lessonBad(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); return; }
    const l = app.querySelector('.mbtn.sel'); l.classList.remove('sel'); l.classList.add('ok'); b.classList.add('ok'); it.sel = null; it.left--;
    if (it.left) return sfx('tap');
    lessonGood(900);
  },
  bead(d) {
    if (!cur || !cur.school || cur.lock || cur.it.mode !== 'beads') return;
    const r = +d.r, i = +d.i;
    cur.c[r] = i < cur.c[r] ? i : i + 1;
    sfx('tap'); paintBeads();
  },
  scheck() {
    if (!cur || !cur.school || cur.lock || cur.it.mode !== 'beads') return;
    const it = cur.it, rows = cur.c.filter(n => n > 0), sum = cur.c.reduce((a, b) => a + b, 0), even = rows.every(n => n === rows[0]);
    const ok = it.kind === 'mul' ? sum === it.target && even && (rows.length === it.a || rows.length === it.b)
      : it.kind === 'div' ? even && rows.length === it.b && rows[0] === it.ans : sum === it.target;
    if (ok) {
      const ex = $('.s-top'); ex.innerHTML = `<span class="expr good">${it.kind === 'show' ? it.txt : it.kind === 'bond' ? `${it.a} + ${it.b} = ${it.target}` : `${it.txt} = ${it.ans}`}</span>`;
      lessonGood(1300);
    } else {
      lessonBad();
      const box = $('.abacus'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
      if (cur.wrong >= 2) $('#shint').textContent = T(it.kind === 'mul' || it.kind === 'div' ? 'sc_hintRows' : 'sc_hint', it.kind === 'div' ? it.b : it.kind === 'mul' ? it.a : it.target, it.kind === 'div' ? it.ans : it.b);
    }
  },
  sopt(d, b) {
    const it = cur && cur.school && cur.it; if (!it || it.mode !== 'choice' || cur.lock || b.classList.contains('no')) return;
    if (+d.i === it.o.ans) { b.classList.add('ok'); lessonGood(cur.wrong ? 1400 : 700); }
    else {
      b.classList.add('no'); lessonBad();
      const h = $('.help'); if (h) h.hidden = false; // a slip in practice brings the beads back
      if (cur.wrong >= 2) $('.opts').children[it.o.ans].classList.add('hint');
    }
  },
  // keypad: type the answer, then confirm
  pkey(d) {
    const it = cur && cur.school && cur.it; if (!it || it.mode !== 'pad' || cur.lock) return;
    const el = $('#pval'), v = el.textContent;
    if (d.k === 'del') { el.textContent = v.slice(0, -1); return sfx('tap'); }
    if (d.k !== 'ok') { if (v.length < 3) el.textContent = v + d.k; return sfx('tap'); }
    if (!v) return;
    if (+v === it.ans) { el.classList.add('good'); return lessonGood(cur.wrong ? 1300 : 700); }
    lessonBad(); el.textContent = '';
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    $('.help').hidden = false;
    if (cur.wrong >= 2) $('#shint').textContent = '= ' + it.ans;
  },
  // building a syllable, a word or a sentence: tap the pieces in order
  rtile(d, b) {
    const it = cur && cur.school && cur.it; if (!it || it.mode !== 'build' || cur.lock || b.classList.contains('used')) return;
    if (d.t !== it.parts[it.at]) {
      lessonBad(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400);
      if (cur.wrong >= 2) { const t = [...$('.tiles').children].find(x => !x.classList.contains('used') && x.dataset.t === it.parts[it.at]); if (t) t.classList.add('hint'); }
      return;
    }
    const sl = $('.built').children;
    b.classList.add('used'); b.classList.remove('hint'); sl[it.at].textContent = d.t; sl[it.at].className = 'in'; it.at++;
    if (it.at < it.parts.length) { sl[it.at].className = 'cur'; return sfx('tap'); }
    $('.built').classList.add('good'); say(it.sy[0], S.lang);
    lessonGood(1600);
  },
};

/* ---------- balloons: pop the ones that match what is shown at the top (a number, a sum, a letter) ---------- */
function vPop() {
  const g = shell('pop', '🎈', T('popHint')), t = S.age, COL = ['#ff6b6b', '#ffb020', '#19a999', '#7c5cff', '#4aa8ff', '#ff7ac6'];
  let left = 50, tg = null, hits = 0, round = 0, wait = 0.3;
  g.cv.hidden = true;
  g.dom.innerHTML = '<div class="pp-sky"></div><div class="pp-target"></div>';
  const sky = g.dom.querySelector('.pp-sky'), top = g.dom.querySelector('.pp-target');
  const target = () => {
    const A = RLD[S.lang].flat();
    if (round % 3 === 2) { const x = pick(A); tg = { show: x.l, ok: lcl(x.l), pool: A.map(y => lcl(y.l)) }; } // a capital letter: pop its small one
    else if (t === 0) { const v = ri(1, 10); tg = { show: dotz(v), say: String(v), ok: String(v), pool: Array.from({ length: 10 }, (_, i) => String(i + 1)) }; }
    else if (t === 1) { const a = ri(2, 9), b = ri(1, 9); tg = { show: `${a} + ${b}`, ok: String(a + b), pool: Array.from({ length: 17 }, (_, i) => String(i + 2)) }; }
    else { const a = ri(2, 9), b = ri(2, 9); tg = { show: `${a} × ${b}`, ok: String(a * b), pool: [...new Set(Array.from({ length: 12 }, () => ri(2, 9) * ri(2, 9)))].map(String) }; }
    round++; hits = 0;
    sky.querySelectorAll('.pp-b').forEach(b => b.classList.add('gone'));
    top.innerHTML = `<b>${tg.show}</b>`; top.classList.remove('in'); void top.offsetWidth; top.classList.add('in');
    say(tg.say || tg.show, S.lang);
  };
  const spawn = () => {
    const b = document.createElement('button'), v = Math.random() < 0.42 ? tg.ok : pick(tg.pool.filter(x => x !== tg.ok));
    b.className = 'pp-b'; b.dataset.act = 'dom'; b.dataset.v = v; b.textContent = v;
    b.style.cssText = `left:${4 + Math.random() * 74}%;--c:${pick(COL)};animation-duration:${(t === 0 ? 6.2 : 5.2) - Math.min(1.6, g.t / 30)}s`;
    b.addEventListener('animationend', e => { if (e.animationName === 'pprise' || e.animationName === 'ppgone') b.remove(); });
    sky.appendChild(b);
  };
  domHit = (d, b) => {
    if (g.over || b.classList.contains('gone')) return;
    if (d.v === tg.ok) {
      g.add(1); hits++; b.classList.add('gone'); sfx('tap'); buzz(20); floatEm(sky, '+1', b.offsetLeft + 20, b.getBoundingClientRect().top - sky.getBoundingClientRect().top);
      if (hits >= 3) { sfx('good'); target(); }
    } else { left = Math.max(0, left - 3); sfx('bad'); buzz([70, 50, 70]); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); }
  };
  g.state = () => ({ tg, left });
  target();
  g.loop(dt => {
    left -= dt; wait -= dt; g.info('⏱ ' + Math.max(0, Math.ceil(left)));
    if (wait <= 0 && dt) { spawn(); wait = 0.62 - Math.min(0.22, g.t / 150); }
    if (left <= 0) g.end(() => { left = 14; });
  });
}

/* ---------- join the dots: tap the numbers in order around a hidden picture, then hear its name ---------- */
function vDots() {
  const g = shell('dots', '⭐', T('dotsHint')), t = S.age, N = [10, 16, 24][t], pool = V.filter(x => EMK.has(emKey(x[0])));
  let left = 80, pts = [], at = 0, im = null, w = null, lang = 'es', shown = 0, flash = 0;
  const size = () => Math.min(g.W, g.H - 70) * 0.84, px = p => (g.W - size()) / 2 + p[0] * size(), py = p => (g.H - 60 - size()) / 2 + p[1] * size();
  const build = () => {
    if (!g.live() || pts.length || !im.naturalWidth) return;
    const R = 140, c = document.createElement('canvas'); c.width = c.height = R;
    const x = c.getContext('2d'), k = (R - 30) / Math.max(im.naturalWidth, im.naturalHeight), iw = im.naturalWidth * k, ih = im.naturalHeight * k;
    x.drawImage(im, (R - iw) / 2, (R - ih) / 2, iw, ih);
    let A = null; try { A = x.getImageData(0, 0, R, R).data; } catch (e) {}
    // a pixel counts as part of the picture if anything is drawn close to it, so thin gaps and strings do not break the outline
    const raw = (a, b) => a >= 0 && b >= 0 && a < R && b < R && A[(b * R + a) * 4 + 3] > 100;
    const solid = (a, b) => raw(a, b) || raw(a - 3, b) || raw(a + 3, b) || raw(a, b - 3) || raw(a, b + 3);
    let line = [];
    if (A) { // walk once round the outside edge of the picture, clockwise from its top
      const D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      let sx = -1, sy = -1; for (let b = 0; b < R && sx < 0; b++) for (let a = 0; a < R; a++) if (solid(a, b)) { sx = a; sy = b; break; }
      if (sx >= 0) {
        let cx = sx, cy = sy, d = 0;
        for (let step = 0; step < 6000; step++) {
          line.push([cx, cy]);
          let moved = false;
          for (let q = 0; q < 8; q++) { const nd = (d + 5 + q) % 8; if (solid(cx + D[nd][0], cy + D[nd][1])) { cx += D[nd][0]; cy += D[nd][1]; d = nd; moved = true; break; } }
          if (!moved || (cx === sx && cy === sy)) break;
        }
      }
    }
    if (line.length < N * 2) line = Array.from({ length: N * 4 }, (_, i) => [R / 2 + Math.cos(-Math.PI / 2 + i * Math.PI / (N * 2)) * R * 0.36, R / 2 + Math.sin(-Math.PI / 2 + i * Math.PI / (N * 2)) * R * 0.36]);
    for (let i = 0; i < N; i++) { const q = line[Math.floor(i * line.length / N)]; pts.push([q[0] / R, q[1] / R]); }
  };
  const next = () => { w = pick(pool.filter(x => x !== w)); lang = learnLang(); at = 0; shown = 0; pts = []; im = emImg(w[0], build); build(); };
  g.cv.addEventListener('pointerdown', e => {
    e.preventDefault(); if (g.over || at >= N || !pts.length) return;
    const r = g.cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let best = -1, bd = 46; pts.forEach((p, i) => { const d = Math.hypot(px(p) - x, py(p) - y); if (i >= at && d < bd) { bd = d; best = i; } });
    if (best < 0) return;
    if (best !== at) { left = Math.max(0, left - 2); flash = 0.3; sfx('bad'); buzz([70, 50, 70]); return; }
    at++; sfx('tap'); buzz(15);
    if (at === N) { g.add(1); left += 5; sfx('good'); say(wd(w, lang), lang); setTimeout(() => { if (g.live() && !g.over) next(); }, 2300); }
  });
  g.state = () => ({ pts: pts.map(p => [px(p), py(p)]), at, N });
  next();
  g.loop(dt => {
    const ctx = g.ctx; left -= at === N ? 0 : dt; flash = Math.max(0, flash - dt); if (at === N) shown = Math.min(1, shown + dt * 1.6);
    g.info('⏱ ' + Math.max(0, Math.ceil(left)));
    const gr = ctx.createLinearGradient(0, 0, 0, g.H); gr.addColorStop(0, flash ? '#ffd9d9' : '#fff8e6'); gr.addColorStop(1, '#ffe9c2'); ctx.fillStyle = gr; ctx.fillRect(0, 0, g.W, g.H);
    if (pts.length) {
      if (shown && im.naturalWidth) { const s = size() * 110 / 140 * shown, k = s / Math.max(im.naturalWidth, im.naturalHeight); ctx.globalAlpha = shown; ctx.drawImage(im, g.W / 2 - im.naturalWidth * k / 2, (g.H - 60) / 2 - im.naturalHeight * k / 2, im.naturalWidth * k, im.naturalHeight * k); ctx.globalAlpha = 1; }
      ctx.lineWidth = 6; ctx.lineJoin = ctx.lineCap = 'round'; ctx.strokeStyle = '#7c5cff'; ctx.globalAlpha = 1 - shown * 0.75; ctx.beginPath();
      for (let i = 0; i < at; i++) (i ? ctx.lineTo(px(pts[i]), py(pts[i])) : ctx.moveTo(px(pts[i]), py(pts[i])));
      if (at === N) ctx.closePath(); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      pts.forEach((p, i) => {
        const done = i < at, nx = i === at, r = nx && t === 0 ? 17 + Math.sin(g.t * 6) * 2.5 : done ? 8 : 15;
        ctx.beginPath(); ctx.arc(px(p), py(p), r, 0, 7); ctx.fillStyle = done ? '#2fbf71' : nx && t === 0 ? '#ffc93c' : '#fff'; ctx.fill();
        if (!done) { ctx.lineWidth = 3; ctx.strokeStyle = '#1d2b53'; ctx.stroke(); ctx.fillStyle = '#1d2b53'; ctx.font = `800 ${r > 14 ? 16 : 13}px ${GFONT}`; ctx.fillText(String(i + 1), px(p), py(p) + 1); }
      });
      ctx.globalAlpha = 1;
      if (at === N) { ctx.font = `800 34px ${GFONT}`; ctx.fillStyle = '#5a3fd6'; ctx.globalAlpha = shown; ctx.fillText(up(wd(w, lang)), g.W / 2, g.H - 38); ctx.globalAlpha = 1; }
    }
    if (left <= 0) g.end(() => { left = 20; });
  });
}

/* ---------- input ---------- */
const ACT = {
  set(d) {
    if (d.k === 'age' && +d.v !== S.age) { // each age group keeps its own stars and stickers
      S.byAge[S.age] = { stars: S.stars, stickers: S.stickers };
      const p = S.byAge[+d.v] || {}; S.stars = p.stars || {}; S.stickers = p.stickers || [];
    }
    S[d.k] = d.k === 'age' ? +d.v : d.k === 'sound' || d.k === 'vibe' || d.k === 'music' ? d.v === 'true' : d.v;
    if (d.k === 'vibe' && S.vibe) buzz(60);
    if (d.k === 'lang' && !S.setup) S.learn = S.lang === 'es' ? 'en' : S.lang === 'en' ? 'es' : 'both';
    save(); sfx('tap'); show(view);
  },
  start() { S.setup = true; save(); sfx('good'); cine(INTRO, () => show('map')); },
  cskip() { sfx('tap'); cineNext(); },
  story() { sfx('tap'); cine(INTRO, () => show('settings')); },
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
    S.stars = {}; S.stickers = []; S.byAge = {}; S.best = {}; S.stat = null; S.daily = null; S.school = { m: [], r: [], v: 2 }; S.setup = false; save(); show('title');
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
Object.assign(ACT, SCHOOL_ACT);
app.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b && !b.disabled) ACT[b.dataset.act](b.dataset, b);
});

window.__chispa = { MUS, EMK, state: S, cur: () => cur, G, plan, walk: () => walk(), LESSONS, RLESSONS, TRACKS };
show(S.setup ? 'splash' : 'title');
})();
