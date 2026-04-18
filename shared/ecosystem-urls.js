/**
 * Centralni Ekosistem URL-ovi — Kompanija SPAJA
 *
 * Jedan izvor istine za sve URL-ove u ekosistemu.
 * Ako se URL promeni, menja se SAMO ovde i automatski se primenjuje svuda.
 */
const EKOSISTEM_URLS = {
  'IO-OPENUI-AO': 'https://io-openui-ao.vercel.app/',
  'Ai Iq World Bank': 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/index.html',
  'Ai Iq Menjacnica': 'https://ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app/index.html',
  'Kompanija SPAJA': 'https://www.kompanija-spaja.com',
  'AI-IQ Super Platforma': 'https://ai-iq-super-platforma-fb43rn7r0-nikolas-projects-b8a8458f.vercel.app/platforme',
};

const EKOSISTEM_IKONE = {
  'IO-OPENUI-AO': '🖥️',
  'Ai Iq World Bank': '🏦',
  'Ai Iq Menjacnica': '💱',
  'Kompanija SPAJA': '🏢',
  'AI-IQ Super Platforma': '🧠',
};

const EKOSISTEM_OPISI = {
  'IO-OPENUI-AO': 'SpajaPro Engine + Laboratorija + Gaming Platforma',
  'Ai Iq World Bank': 'Digitalna banka sa globalnim dometom i 40% kamatom',
  'Ai Iq Menjacnica': 'Svetska menjacnica sa BTC, SPAJA BTC i 150+ kripto valuta',
  'Kompanija SPAJA': 'Korporativna platforma — spajamo sve timove i procese',
  'AI-IQ Super Platforma': 'Centralna platforma za upravljanje celim ekosistemom',
};

/**
 * Renderuje ekosistem sekciju sa linkovima ka drugim platformama.
 * @param {string} currentPlatform — naziv trenutne platforme (da se ne prikazuje link ka sebi)
 * @param {string} containerId — ID elementa u koji se renderuje
 */
function renderEkosistem(currentPlatform, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var html = '';
  var keys = Object.keys(EKOSISTEM_URLS);
  for (var i = 0; i < keys.length; i++) {
    var naziv = keys[i];
    if (naziv === currentPlatform) continue;
    var url = EKOSISTEM_URLS[naziv];
    var ikona = EKOSISTEM_IKONE[naziv] || '🔗';
    var opis = EKOSISTEM_OPISI[naziv] || '';
    html += '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="ecosystem-card">';
    html += '<span class="ecosystem-icon">' + ikona + '</span>';
    html += '<div class="ecosystem-info">';
    html += '<h4>' + naziv + '</h4>';
    html += '<p>' + opis + '</p>';
    html += '</div>';
    html += '<span class="ecosystem-arrow">&rarr;</span>';
    html += '</a>';
  }

  container.innerHTML = html;
}

// Export for CommonJS/ES module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EKOSISTEM_URLS, EKOSISTEM_IKONE, EKOSISTEM_OPISI, renderEkosistem };
}
