// Lists every phrase the game speaks, as JSON [{lang, text}], by reading the tables in game.js.
// usage: node voice_texts.js > texts.json
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');
const grab = name => {
  const m = src.match(new RegExp('const ' + name + ' = ([\\[{][\\s\\S]*?\\n[\\]}]);'));
  if (!m) throw new Error('table not found: ' + name);
  return eval('(' + m[1] + ')');
};
const STR = grab('STR'), V = grab('V'), FACTS = grab('FACTS');
const LANGS = ['ro', 'es', 'en'], out = [], seen = new Set();
const add = (lang, text) => { const k = lang + '|' + text; if (text && !text.includes('{') && !seen.has(k)) { seen.add(k); out.push({ lang, text }); } };
LANGS.forEach((lang, i) => {
  for (const [k, v] of Object.entries(STR)) if (k.startsWith('q_') || ['hi5', 'tickle', 'pet'].includes(k)) add(lang, v[i]);
  for (const f of FACTS) add(lang, f[1][i]);
});
for (const w of V) { add('es', w[1]); add('en', w[2]); }
process.stdout.write(JSON.stringify(out));
