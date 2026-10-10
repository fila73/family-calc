/**
 * Rodinná kalkulačka - Hlavní aplikační kontrolér
 */

import { resolveKinship, invertChain, TOKENS } from './engine/kinship-engine.js';
import { getDictionary, availableLanguages } from './i18n/index.js';

class FamilyCalcApp {
  constructor() {
    this.chain = [];
    this.egoGender = localStorage.getItem('ego_gender') || 'm';
    this.currentLang = localStorage.getItem('lang_code') || 'cs';
    this.isMutualView = false;
    this.history = [];

    this.initElements();
    this.initEventListeners();
    this.populateLanguageSelector();
    this.updateLanguage();
    this.render();
  }

  initElements() {
    this.appTitle = document.getElementById('appTitle');
    this.appSubtitle = document.getElementById('appSubtitle');
    this.langSelect = document.getElementById('langSelect');
    this.genderBtnMale = document.getElementById('genderBtnMale');
    this.genderBtnFemale = document.getElementById('genderBtnFemale');
    this.probandLabelText = document.getElementById('probandLabelText');

    this.chainContainer = document.getElementById('chainContainer');
    this.resultMain = document.getElementById('resultMain');
    this.metaBadges = document.getElementById('metaBadges');
    this.resultDetailsBox = document.getElementById('resultDetailsBox');
    this.detailExplanation = document.getElementById('detailExplanation');
    this.detailReciprocal = document.getElementById('detailReciprocal');
    this.explanationLabel = document.getElementById('explanationLabel');
    this.reciprocalLabel = document.getElementById('reciprocalLabel');

    // Keypad keys
    this.keypad = document.getElementById('keypad');
    this.keyHusband = document.getElementById('keyHusband');
    this.keyWife = document.getElementById('keyWife');
    this.keyClear = document.getElementById('keyClear');
    this.keyBackspace = document.getElementById('keyBackspace');
    this.keyFather = document.getElementById('keyFather');
    this.keyMother = document.getElementById('keyMother');
    this.keySon = document.getElementById('keySon');
    this.keyDaughter = document.getElementById('keyDaughter');
    this.keyBrotherOld = document.getElementById('keyBrotherOld');
    this.keyBrotherYoung = document.getElementById('keyBrotherYoung');
    this.keySisterOld = document.getElementById('keySisterOld');
    this.keySisterYoung = document.getElementById('keySisterYoung');
    this.keyMutual = document.getElementById('keyMutual');
    this.keyEquals = document.getElementById('keyEquals');

    // Modals & Extras
    this.dictModal = document.getElementById('dictModal');
    this.openDictBtn = document.getElementById('openDictBtn');
    this.closeDictBtn = document.getElementById('closeDictBtn');
    this.dictSearchInput = document.getElementById('dictSearchInput');
    this.dictList = document.getElementById('dictList');
    this.dictModalTitle = document.getElementById('dictModalTitle');
    this.toast = document.getElementById('toast');
    this.resetBtn = document.getElementById('resetBtn');
  }

  initEventListeners() {
    // Gender toggle
    this.genderBtnMale.addEventListener('click', () => this.setGender('m'));
    this.genderBtnFemale.addEventListener('click', () => this.setGender('f'));

    // Language selector
    this.langSelect.addEventListener('change', (e) => {
      this.currentLang = e.target.value;
      localStorage.setItem('lang_code', this.currentLang);
      this.updateLanguage();
      this.render();
    });

    // Reset button
    this.resetBtn.addEventListener('click', () => {
      this.triggerHaptic();
      this.clearAll();
    });

    // Keypad key clicks
    this.keyHusband.addEventListener('click', () => this.addToken(TOKENS.HUSBAND));
    this.keyWife.addEventListener('click', () => this.addToken(TOKENS.WIFE));
    this.keyClear.addEventListener('click', () => this.clearAll());
    this.keyBackspace.addEventListener('click', () => this.popToken());

    this.keyFather.addEventListener('click', () => this.addToken(TOKENS.FATHER));
    this.keyMother.addEventListener('click', () => this.addToken(TOKENS.MOTHER));
    this.keySon.addEventListener('click', () => this.addToken(TOKENS.SON));
    this.keyDaughter.addEventListener('click', () => this.addToken(TOKENS.DAUGHTER));

    this.keyBrotherOld.addEventListener('click', () => this.addToken(TOKENS.OLDER_BROTHER));
    this.keyBrotherYoung.addEventListener('click', () => this.addToken(TOKENS.YOUNGER_BROTHER));
    this.keySisterOld.addEventListener('click', () => this.addToken(TOKENS.OLDER_SISTER));
    this.keySisterYoung.addEventListener('click', () => this.addToken(TOKENS.YOUNGER_SISTER));

    this.keyMutual.addEventListener('click', () => this.toggleMutual());
    this.keyEquals.addEventListener('click', () => this.onEquals());

    // Dictionary modal
    this.openDictBtn.addEventListener('click', () => this.openDictionary());
    this.closeDictBtn.addEventListener('click', () => this.closeDictionary());
    this.dictModal.addEventListener('click', (e) => {
      if (e.target === this.dictModal) this.closeDictionary();
    });
    this.dictSearchInput.addEventListener('input', () => this.filterDictionary());

    // Click on reciprocal link in details box to swap perspective
    this.detailReciprocal.addEventListener('click', () => this.toggleMutual());

    // Keyboard shortcuts for convenience
    window.addEventListener('keydown', (e) => {
      if (this.dictModal.classList.contains('open')) return;
      if (e.key === 'Backspace') {
        this.popToken();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        this.clearAll();
      } else if (e.key === 'Enter' || e.key === '=') {
        this.onEquals();
      }
    });
  }

  triggerHaptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Ignored
      }
    }
  }

  setGender(gender) {
    this.triggerHaptic();
    this.egoGender = gender;
    localStorage.setItem('ego_gender', gender);
    this.updateGenderUI();
    this.render();
  }

  updateGenderUI() {
    if (this.egoGender === 'm') {
      this.genderBtnMale.classList.add('active');
      this.genderBtnFemale.classList.remove('active');
    } else {
      this.genderBtnFemale.classList.add('active');
      this.genderBtnMale.classList.remove('active');
    }
  }

  populateLanguageSelector() {
    this.langSelect.innerHTML = '';
    availableLanguages.forEach((lang) => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.label;
      if (lang.code === this.currentLang) opt.selected = true;
      this.langSelect.appendChild(opt);
    });
  }

  updateLanguage() {
    const dict = getDictionary(this.currentLang);
    this.appTitle.textContent = dict.labels.appTitle;
    this.appSubtitle.textContent = dict.labels.subtitle;
    this.probandLabelText.textContent = dict.labels.egoGender;
    this.genderBtnMale.textContent = dict.labels.male;
    this.genderBtnFemale.textContent = dict.labels.female;

    this.explanationLabel.textContent = dict.labels.explanationLabel + ':';
    this.reciprocalLabel.textContent = dict.labels.reciprocal + ':';

    // Key labels
    const t = dict.labels.tokens;
    this.setKeyContent(this.keyHusband, t.h, '');
    this.setKeyContent(this.keyWife, t.w, '');
    this.setKeyContent(this.keyFather, t.f, '');
    this.setKeyContent(this.keyMother, t.m, '');
    this.setKeyContent(this.keySon, t.s, '');
    this.setKeyContent(this.keyDaughter, t.d, '');

    // Siblings
    if (this.currentLang === 'zh') {
      this.setKeyContent(this.keyBrotherOld, '兄', '长');
      this.setKeyContent(this.keyBrotherYoung, '弟', '幼');
      this.setKeyContent(this.keySisterOld, '姐', '长');
      this.setKeyContent(this.keySisterYoung, '妹', '幼');
    } else if (this.currentLang === 'cs') {
      this.setKeyContent(this.keyBrotherOld, 'Bratr', 'starší');
      this.setKeyContent(this.keyBrotherYoung, 'Bratr', 'mladší');
      this.setKeyContent(this.keySisterOld, 'Sestra', 'starší');
      this.setKeyContent(this.keySisterYoung, 'Sestra', 'mladší');
    } else if (this.currentLang === 'sk') {
      this.setKeyContent(this.keyBrotherOld, 'Brat', 'starší');
      this.setKeyContent(this.keyBrotherYoung, 'Brat', 'mladší');
      this.setKeyContent(this.keySisterOld, 'Sestra', 'staršia');
      this.setKeyContent(this.keySisterYoung, 'Sestra', 'mladšia');
    } else {
      this.setKeyContent(this.keyBrotherOld, 'Bro', 'elder');
      this.setKeyContent(this.keyBrotherYoung, 'Bro', 'younger');
      this.setKeyContent(this.keySisterOld, 'Sis', 'elder');
      this.setKeyContent(this.keySisterYoung, 'Sis', 'younger');
    }

    this.keyMutual.textContent = dict.labels.mutual;
    this.updateGenderUI();
  }

  setKeyContent(keyEl, mainText, subText) {
    if (!subText) {
      keyEl.textContent = mainText;
    } else {
      keyEl.innerHTML = `${mainText}<span class="key-subtext">${subText}</span>`;
    }
  }

  addToken(token) {
    this.triggerHaptic();
    this.isMutualView = false;
    this.chain.push(token);
    this.render();
  }

  popToken() {
    this.triggerHaptic();
    this.isMutualView = false;
    if (this.chain.length > 0) {
      this.chain.pop();
      this.render();
    }
  }

  clearAll() {
    this.triggerHaptic();
    this.chain = [];
    this.isMutualView = false;
    this.render();
  }

  toggleMutual() {
    this.triggerHaptic();
    if (this.chain.length === 0) return;
    this.isMutualView = !this.isMutualView;
    this.render();
    this.showToast(this.isMutualView ? 'Přepnuto na: Kdo jsem já pro něj (互查)' : 'Základní pohled kalkulačky');
  }

  onEquals() {
    this.triggerHaptic();
    // Flash animation on result
    this.resultMain.style.animation = 'none';
    requestAnimationFrame(() => {
      this.resultMain.style.animation = 'fadeInResult 0.3s ease-out';
    });
    const dict = getDictionary(this.currentLang);
    const activeChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(activeChain, this.egoGender, dict);
    this.showToast(`${resolved.name}`);
  }

  render() {
    const dict = getDictionary(this.currentLang);
    const effectiveChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(effectiveChain, this.egoGender, dict);

    // 1. Render Chain Breadcrumbs
    this.renderChainBreadcrumbs(dict);

    // 2. Render Main Result
    this.resultMain.textContent = resolved.name;

    // 3. Render Badges
    this.metaBadges.innerHTML = '';

    if (resolved.archaic) {
      const bArch = document.createElement('span');
      bArch.className = 'meta-badge badge-archaic';
      bArch.innerHTML = `📜 ${resolved.archaic}`;
      this.metaBadges.appendChild(bArch);
    }

    if (resolved.generation !== undefined && resolved.generation !== 0) {
      const bGen = document.createElement('span');
      bGen.className = 'meta-badge badge-generation';
      const sign = resolved.generation > 0 ? '+' : '';
      bGen.textContent = `${dict.labels.generationLabel}: ${sign}${resolved.generation}`;
      this.metaBadges.appendChild(bGen);
    }

    if (resolved.lineType && dict.labels.lineTypes[resolved.lineType]) {
      const bLine = document.createElement('span');
      bLine.className = 'meta-badge badge-line';
      bLine.textContent = dict.labels.lineTypes[resolved.lineType];
      this.metaBadges.appendChild(bLine);
    }

    // 4. Render Details Box
    if (this.chain.length === 0) {
      this.detailExplanation.textContent = resolved.description;
      this.detailReciprocal.textContent = '—';
      this.detailReciprocal.classList.remove('reciprocal-clickable');
    } else {
      this.detailExplanation.textContent = resolved.description;

      // Calculate reciprocal perspective
      const invertedChain = invertChain(effectiveChain, this.egoGender);
      const reciprocalResolved = resolveKinship(invertedChain, this.egoGender, dict);
      this.detailReciprocal.textContent = `${reciprocalResolved.name} (klikni pro přepnutí)`;
      this.detailReciprocal.classList.add('reciprocal-clickable');
    }
  }

  renderChainBreadcrumbs(dict) {
    this.chainContainer.innerHTML = '';

    // "Self" starting node
    const selfItem = document.createElement('span');
    selfItem.className = 'chain-item chain-self';
    selfItem.textContent = dict.labels.self;
    selfItem.addEventListener('click', () => this.clearAll());
    this.chainContainer.appendChild(selfItem);

    if (this.chain.length === 0) return;

    this.chain.forEach((token, index) => {
      // Arrow
      const arrow = document.createElement('span');
      arrow.className = 'chain-arrow';
      arrow.textContent = '➔';
      this.chainContainer.appendChild(arrow);

      // Token Item
      const item = document.createElement('span');
      item.className = 'chain-item';
      item.textContent = dict.labels.tokens[token] || token;
      item.title = 'Kliknutím zkrátíš výpočet sem';
      item.addEventListener('click', () => {
        this.triggerHaptic();
        this.chain = this.chain.slice(0, index + 1);
        this.isMutualView = false;
        this.render();
      });
      this.chainContainer.appendChild(item);
    });

    // Auto-scroll to end
    this.chainContainer.scrollLeft = this.chainContainer.scrollWidth;
  }

  showToast(msg) {
    this.toast.textContent = msg;
    this.toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2200);
  }

  // === Dictionary Modal (Search & Explore terms) ===
  openDictionary() {
    this.triggerHaptic();
    const dict = getDictionary(this.currentLang);
    this.dictModalTitle.textContent = `Slovník rodinných vztahů (${dict.name})`;
    this.dictSearchInput.value = '';
    this.filterDictionary();
    this.dictModal.classList.add('open');
  }

  closeDictionary() {
    this.dictModal.classList.remove('open');
  }

  filterDictionary() {
    const dict = getDictionary(this.currentLang);
    const query = this.dictSearchInput.value.toLowerCase().trim();
    this.dictList.innerHTML = '';

    const entries = Object.entries(dict.relations);
    let count = 0;

    for (const [key, item] of entries) {
      const matchName = item.name.toLowerCase().includes(query);
      const matchArchaic = item.archaic && item.archaic.toLowerCase().includes(query);
      const matchDesc = item.description && item.description.toLowerCase().includes(query);

      if (!query || matchName || matchArchaic || matchDesc) {
        count++;
        const card = document.createElement('div');
        card.className = 'dictionary-item';
        card.innerHTML = `
          <div class="dict-title-row">
            <span class="dict-name">${item.name}</span>
            ${item.archaic ? `<span class="dict-archaic">📜 ${item.archaic}</span>` : ''}
          </div>
          <div class="dict-desc">${item.description}</div>
          <div class="dict-path">Vzorec na kalkulačce: ${this.formatKeyPath(key, dict)}</div>
        `;

        card.addEventListener('click', () => {
          this.triggerHaptic();
          this.chain = key.split(',').filter(Boolean);
          this.isMutualView = false;
          this.closeDictionary();
          this.render();
          this.showToast(`Načteno: ${item.name}`);
        });

        this.dictList.appendChild(card);
      }
    }

    if (count === 0) {
      const empty = document.createElement('div');
      empty.style.padding = '24px';
      empty.style.textAlign = 'center';
      empty.style.color = '#71717a';
      empty.textContent = 'Nenalezen žádný odpovídající výraz.';
      this.dictList.appendChild(empty);
    }
  }

  formatKeyPath(key, dict) {
    const tokens = key.split(',').filter(Boolean);
    return tokens.map(t => dict.labels.tokens[t] || t).join(' ➔ ');
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FamilyCalcApp();

  // Register service worker if available
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
