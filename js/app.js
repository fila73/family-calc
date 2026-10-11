/**
 * Rodinná kalkulačka - Hlavní aplikační kontrolér
 */

import { resolveKinship, invertChain, TOKENS } from './engine/kinship-engine.js';
import { getDictionary, languagesRegistry, languageCategories, getLanguageMeta } from './i18n/index.js';

class FamilyCalcApp {
  constructor() {
    this.chain = [];
    this.egoGender = localStorage.getItem('ego_gender') || 'm';
    this.currentLang = localStorage.getItem('lang_code') || 'cs';
    this.isMutualView = false;
    this.modifier = null; // null | 'step' | 'god'
    this.history = [];
    this.recentLangs = this.loadRecentLangs();

    this.initElements();
    this.initEventListeners();
    this.updateLanguageTrigger();
    this.updateLanguage();
    this.render();
  }

  initElements() {
    this.appTitle = document.getElementById('appTitle');
    this.appSubtitle = document.getElementById('appSubtitle');
    this.genderBtnMale = document.getElementById('genderBtnMale');
    this.genderBtnFemale = document.getElementById('genderBtnFemale');
    this.probandLabelText = document.getElementById('probandLabelText');

    // Language modal elements
    this.openLangModalBtn = document.getElementById('openLangModalBtn');
    this.closeLangModalBtn = document.getElementById('closeLangModalBtn');
    this.langModal = document.getElementById('langModal');
    this.langSearchInput = document.getElementById('langSearchInput');
    this.recentLangsSection = document.getElementById('recentLangsSection');
    this.recentLangsRow = document.getElementById('recentLangsRow');
    this.langGroupsList = document.getElementById('langGroupsList');
    this.langTriggerFlag = document.getElementById('langTriggerFlag');
    this.langTriggerCode = document.getElementById('langTriggerCode');

    // Modifiers
    this.btnModStep = document.getElementById('btnModStep');
    this.btnModGod = document.getElementById('btnModGod');
    this.labelModStep = document.getElementById('labelModStep');
    this.labelModGod = document.getElementById('labelModGod');

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

    // Language modal open/close & search
    if (this.openLangModalBtn) {
      this.openLangModalBtn.addEventListener('click', () => this.openLanguageModal());
    }
    if (this.closeLangModalBtn) {
      this.closeLangModalBtn.addEventListener('click', () => this.closeLanguageModal());
    }
    if (this.langModal) {
      this.langModal.addEventListener('click', (e) => {
        if (e.target === this.langModal) this.closeLanguageModal();
      });
    }
    if (this.langSearchInput) {
      this.langSearchInput.addEventListener('input', () => this.filterLanguages());
    }

    // Reset button
    this.resetBtn.addEventListener('click', () => {
      this.triggerHaptic();
      this.clearAll();
    });

    // Modifiers
    this.btnModStep.addEventListener('click', () => this.toggleModifier('step'));
    this.btnModGod.addEventListener('click', () => this.toggleModifier('god'));

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
      if (this.dictModal.classList.contains('open') || (this.langModal && this.langModal.classList.contains('open'))) {
        if (e.key === 'Escape') {
          if (this.dictModal.classList.contains('open')) this.closeDictionary();
          if (this.langModal && this.langModal.classList.contains('open')) this.closeLanguageModal();
        }
        return;
      }
      if (e.key === 'Shift') {
        this.toggleModifier('step');
      } else if (e.key === 'Backspace') {
        this.popToken();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        this.clearAll();
      } else if (e.key === 'Enter' || e.key === '=') {
        this.onEquals();
      }
    });
  }

  toggleModifier(modType) {
    this.triggerHaptic();
    this.modifier = (this.modifier === modType) ? null : modType;
    this.updateModifierUI();
    this.updateLanguage();
  }

  updateModifierUI() {
    this.btnModStep.classList.toggle('active-step', this.modifier === 'step');
    this.btnModGod.classList.toggle('active-god', this.modifier === 'god');
    this.keypad.classList.toggle('shift-step-active', this.modifier === 'step');
    this.keypad.classList.toggle('shift-god-active', this.modifier === 'god');
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

  loadRecentLangs() {
    try {
      const saved = JSON.parse(localStorage.getItem('family_calc_recent_langs'));
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return ['cs', 'sk', 'en', 'de'];
  }

  saveRecentLang(code) {
    let recents = this.recentLangs.filter((c) => c !== code);
    recents.unshift(code);
    if (recents.length > 5) recents = recents.slice(0, 5);
    this.recentLangs = recents;
    try {
      localStorage.setItem('family_calc_recent_langs', JSON.stringify(recents));
    } catch (e) {}
  }

  updateLanguageTrigger() {
    const meta = getLanguageMeta(this.currentLang);
    if (this.langTriggerFlag) this.langTriggerFlag.textContent = meta.flag;
    if (this.langTriggerCode) this.langTriggerCode.textContent = meta.code.toUpperCase();
  }

  openLanguageModal() {
    this.triggerHaptic();
    if (this.langSearchInput) this.langSearchInput.value = '';
    this.renderRecentLangs();
    this.filterLanguages();
    if (this.langModal) this.langModal.classList.add('open');
    setTimeout(() => {
      if (this.langSearchInput) this.langSearchInput.focus();
    }, 120);
  }

  closeLanguageModal() {
    if (this.langModal) this.langModal.classList.remove('open');
  }

  renderRecentLangs() {
    if (!this.recentLangsRow) return;
    this.recentLangsRow.innerHTML = '';

    const codes = [...new Set([this.currentLang, ...this.recentLangs])].slice(0, 5);

    codes.forEach((code) => {
      const meta = getLanguageMeta(code);
      if (!meta) return;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `recent-chip ${code === this.currentLang ? 'active' : ''}`;
      chip.innerHTML = `<span class="chip-flag">${meta.flag}</span><span class="chip-label">${meta.localName}</span>`;
      chip.addEventListener('click', () => {
        this.selectLanguage(code);
      });
      this.recentLangsRow.appendChild(chip);
    });
  }

  filterLanguages() {
    if (!this.langGroupsList) return;
    const query = this.langSearchInput ? this.langSearchInput.value.toLowerCase().trim() : '';
    this.langGroupsList.innerHTML = '';

    if (this.recentLangsSection) {
      this.recentLangsSection.style.display = query ? 'none' : 'block';
    }

    const groupMap = {};
    Object.keys(languageCategories).forEach((catKey) => {
      groupMap[catKey] = [];
    });

    let totalMatches = 0;

    languagesRegistry.forEach((lang) => {
      const matchCode = lang.code.toLowerCase().includes(query);
      const matchCzech = lang.czechName && lang.czechName.toLowerCase().includes(query);
      const matchEnglish = lang.englishName && lang.englishName.toLowerCase().includes(query);
      const matchLocal = lang.localName && lang.localName.toLowerCase().includes(query);
      const matchLabel = lang.label && lang.label.toLowerCase().includes(query);

      if (!query || matchCode || matchCzech || matchEnglish || matchLocal || matchLabel) {
        if (!groupMap[lang.group]) groupMap[lang.group] = [];
        groupMap[lang.group].push(lang);
        totalMatches++;
      }
    });

    if (totalMatches === 0) {
      const empty = document.createElement('div');
      empty.className = 'lang-empty-msg';
      empty.style.padding = '24px';
      empty.style.textAlign = 'center';
      empty.style.color = '#71717a';
      empty.textContent = 'Nenalezen žádný odpovídající jazyk / No matching language found.';
      this.langGroupsList.appendChild(empty);
      return;
    }

    Object.entries(groupMap).forEach(([groupId, langs]) => {
      if (langs.length === 0) return;
      const cat = languageCategories[groupId] || { label: groupId, icon: '🌐' };

      const groupDiv = document.createElement('div');
      groupDiv.className = 'lang-group';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'lang-group-header';
      headerDiv.textContent = `${cat.icon} ${cat.label}`;
      groupDiv.appendChild(headerDiv);

      langs.forEach((lang) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `lang-item-btn ${lang.code === this.currentLang ? 'active' : ''}`;

        btn.innerHTML = `
          <span class="lang-flag">${lang.flag}</span>
          <div class="lang-info">
            <span class="lang-local">${lang.localName}</span>
            <span class="lang-sub">${lang.czechName} · ${lang.englishName} (${lang.code.toUpperCase()})</span>
          </div>
          ${lang.code === this.currentLang ? `
            <span class="lang-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          ` : ''}
        `;

        btn.addEventListener('click', () => {
          this.selectLanguage(lang.code);
        });

        groupDiv.appendChild(btn);
      });

      this.langGroupsList.appendChild(groupDiv);
    });
  }

  selectLanguage(code) {
    this.triggerHaptic();
    this.currentLang = code;
    localStorage.setItem('lang_code', code);
    this.saveRecentLang(code);
    this.updateLanguageTrigger();
    this.updateLanguage();
    this.render();
    this.closeLanguageModal();
    const meta = getLanguageMeta(code);
    this.showToast(`${meta.flag} ${meta.localName}`);
  }

  updateLanguage() {
    const dict = getDictionary(this.currentLang);
    this.appTitle.textContent = dict.labels.appTitle;
    this.appSubtitle.textContent = dict.labels.subtitle;
    this.probandLabelText.textContent = dict.labels.egoGender;
    this.genderBtnMale.textContent = dict.labels.male;
    this.genderBtnFemale.textContent = dict.labels.female;

    this.labelModStep.textContent = dict.labels.modStep || 'Nevlastní';
    this.labelModGod.textContent = dict.labels.modGod || 'Křestní';

    this.explanationLabel.textContent = dict.labels.explanationLabel + ':';
    this.reciprocalLabel.textContent = dict.labels.reciprocal + ':';

    const t = dict.labels.tokens;
    const cap = (str) => (!str ? '' : str.charAt(0).toUpperCase() + str.slice(1));

    // Base sibling labels per language
    let broOldMain = 'Bratr', broOldSub = 'starší';
    let broYoungMain = 'Bratr', broYoungSub = 'mladší';
    let sisOldMain = 'Sestra', sisOldSub = 'starší';
    let sisYoungMain = 'Sestra', sisYoungSub = 'mladší';

    if (this.currentLang === 'zh') {
      broOldMain = '兄'; broOldSub = '长';
      broYoungMain = '弟'; broYoungSub = '幼';
      sisOldMain = '姐'; sisOldSub = '长';
      sisYoungMain = '妹'; sisYoungSub = '幼';
    } else if (this.currentLang === 'ko') {
      broOldMain = '형/오빠'; broOldSub = '연상';
      broYoungMain = '남동생'; broYoungSub = '연하';
      sisOldMain = '누나/언니'; sisOldSub = '연상';
      sisYoungMain = '여동생'; sisYoungSub = '연하';
    } else if (this.currentLang === 'ru') {
      broOldMain = 'Брат'; broOldSub = 'старший';
      broYoungMain = 'Брат'; broYoungSub = 'младший';
      sisOldMain = 'Сестра'; sisOldSub = 'старшая';
      sisYoungMain = 'Сестра'; sisYoungSub = 'младшая';
    } else if (this.currentLang === 'pl') {
      broOldMain = 'Brat'; broOldSub = 'starszy';
      broYoungMain = 'Brat'; broYoungSub = 'młodszy';
      sisOldMain = 'Siostra'; sisOldSub = 'starsza';
      sisYoungMain = 'Siostra'; sisYoungSub = 'młodsza';
    } else if (this.currentLang === 'de') {
      broOldMain = 'Bruder'; broOldSub = 'älterer';
      broYoungMain = 'Bruder'; broYoungSub = 'jüngerer';
      sisOldMain = 'Schwester'; sisOldSub = 'ältere';
      sisYoungMain = 'Schwester'; sisYoungSub = 'jüngere';
    } else if (this.currentLang === 'fr') {
      broOldMain = 'Frère'; broOldSub = 'aîné';
      broYoungMain = 'Frère'; broYoungSub = 'cadet';
      sisOldMain = 'Sœur'; sisOldSub = 'aînée';
      sisYoungMain = 'Sœur'; sisYoungSub = 'cadette';
    } else if (this.currentLang === 'it') {
      broOldMain = 'Fratello'; broOldSub = 'maggiore';
      broYoungMain = 'Fratello'; broYoungSub = 'minore';
      sisOldMain = 'Sorella'; sisOldSub = 'maggiore';
      sisYoungMain = 'Sorella'; sisYoungSub = 'minore';
    } else if (this.currentLang === 'es') {
      broOldMain = 'Hermano'; broOldSub = 'mayor';
      broYoungMain = 'Hermano'; broYoungSub = 'menor';
      sisOldMain = 'Hermana'; sisOldSub = 'mayor';
      sisYoungMain = 'Hermana'; sisYoungSub = 'menor';
    } else if (this.currentLang === 'ja') {
      broOldMain = '兄'; broOldSub = '年上';
      broYoungMain = '弟'; broYoungSub = '年下';
      sisOldMain = '姉'; sisOldSub = '年上';
      sisYoungMain = '妹'; sisYoungSub = '年下';
    } else if (this.currentLang === 'vi') {
      broOldMain = 'Anh'; broOldSub = 'trai';
      broYoungMain = 'Em'; broYoungSub = 'trai';
      sisOldMain = 'Chị'; sisOldSub = 'gái';
      sisYoungMain = 'Em'; sisYoungSub = 'gái';
    } else if (this.currentLang === 'sk') {
      broOldMain = 'Brat'; broOldSub = 'starší';
      broYoungMain = 'Brat'; broYoungSub = 'mladší';
      sisOldMain = 'Sestra'; sisOldSub = 'staršia';
      sisYoungMain = 'Sestra'; sisYoungSub = 'mladšia';
    } else if (this.currentLang === 'cs') {
      broOldMain = 'Bratr'; broOldSub = 'starší';
      broYoungMain = 'Bratr'; broYoungSub = 'mladší';
      sisOldMain = 'Sestra'; sisOldSub = 'starší';
      sisYoungMain = 'Sestra'; sisYoungSub = 'mladší';
    } else {
      broOldMain = 'Bro'; broOldSub = 'elder';
      broYoungMain = 'Bro'; broYoungSub = 'younger';
      sisOldMain = 'Sis'; sisOldSub = 'elder';
      sisYoungMain = 'Sis'; sisYoungSub = 'younger';
    }

    if (this.modifier === 'step') {
      // Shifted / Step labels:
      // Main text: modified term (Macecha, Otčím, Pastorek...)
      // Sub text: original base label (Matka, Otec, Syn...)
      this.setKeyContent(this.keyFather, cap(t.step_f || 'Otčím'), t.f, true);
      this.setKeyContent(this.keyMother, cap(t.step_m || 'Macecha'), t.m, true);
      this.setKeyContent(this.keySon, cap(t.step_s || 'Pastorek'), t.s, true);
      this.setKeyContent(this.keyDaughter, cap(t.step_d || 'Pastorkyně'), t.d, true);
      this.setKeyContent(this.keyHusband, cap(t.step_h || 'Nový manžel'), t.h, true);
      this.setKeyContent(this.keyWife, cap(t.step_w || 'Nová manželka'), t.w, true);
      this.setKeyContent(this.keyBrotherOld, cap(t.step_b || 'Nevlastní bratr'), broOldMain, true);
      this.setKeyContent(this.keyBrotherYoung, cap(t.step_b || 'Nevlastní bratr'), broYoungMain, true);
      this.setKeyContent(this.keySisterOld, cap(t.step_z || 'Nevlastní sestra'), sisOldMain, true);
      this.setKeyContent(this.keySisterYoung, cap(t.step_z || 'Nevlastní sestra'), sisYoungMain, true);
    } else if (this.modifier === 'god') {
      // Godparent labels: only parents & children are meaningful.
      // Invalid relations (křestní manžel, křestní bratr...) are disabled.
      this.setKeyContent(this.keyFather, cap(t.god_f || 'Kmotr'), t.f, true);
      this.setKeyContent(this.keyMother, cap(t.god_m || 'Kmotra'), t.m, true);
      this.setKeyContent(this.keySon, cap(t.god_s || 'Kmotřenec'), t.s, true);
      this.setKeyContent(this.keyDaughter, cap(t.god_d || 'Kmotřenka'), t.d, true);

      this.setKeyContent(this.keyHusband, t.h, '', false);
      this.setKeyContent(this.keyWife, t.w, '', false);
      this.setKeyContent(this.keyBrotherOld, broOldMain, '', false);
      this.setKeyContent(this.keyBrotherYoung, broYoungMain, '', false);
      this.setKeyContent(this.keySisterOld, sisOldMain, '', false);
      this.setKeyContent(this.keySisterYoung, sisYoungMain, '', false);
    } else {
      // Standard key labels (all enabled)
      this.setKeyContent(this.keyHusband, t.h, '', true);
      this.setKeyContent(this.keyWife, t.w, '', true);
      this.setKeyContent(this.keyFather, t.f, '', true);
      this.setKeyContent(this.keyMother, t.m, '', true);
      this.setKeyContent(this.keySon, t.s, '', true);
      this.setKeyContent(this.keyDaughter, t.d, '', true);

      this.setKeyContent(this.keyBrotherOld, broOldMain, broOldSub, true);
      this.setKeyContent(this.keyBrotherYoung, broYoungMain, broYoungSub, true);
      this.setKeyContent(this.keySisterOld, sisOldMain, sisOldSub, true);
      this.setKeyContent(this.keySisterYoung, sisYoungMain, sisYoungSub, true);
    }

    this.keyMutual.textContent = dict.labels.mutual;
    this.updateGenderUI();
    this.updateModifierUI();
  }

  setKeyContent(keyEl, mainText, subText, enabled = true) {
    keyEl.disabled = !enabled;
    if (!subText) {
      keyEl.textContent = mainText;
    } else {
      keyEl.innerHTML = `${mainText}<span class="key-subtext">${subText}</span>`;
    }
  }

  addToken(token) {
    this.triggerHaptic();
    this.isMutualView = false;
    let finalToken = token;

    if (this.modifier === 'step') {
      if (token === TOKENS.FATHER) finalToken = TOKENS.STEP_FATHER;
      else if (token === TOKENS.MOTHER) finalToken = TOKENS.STEP_MOTHER;
      else if (token === TOKENS.SON) finalToken = TOKENS.STEP_SON;
      else if (token === TOKENS.DAUGHTER) finalToken = TOKENS.STEP_DAUGHTER;
      else if (token === TOKENS.OLDER_BROTHER || token === TOKENS.YOUNGER_BROTHER || token === TOKENS.BROTHER) finalToken = TOKENS.STEP_BROTHER;
      else if (token === TOKENS.OLDER_SISTER || token === TOKENS.YOUNGER_SISTER || token === TOKENS.SISTER) finalToken = TOKENS.STEP_SISTER;
      else if (token === TOKENS.HUSBAND) finalToken = TOKENS.STEP_HUSBAND;
      else if (token === TOKENS.WIFE) finalToken = TOKENS.STEP_WIFE;
      this.modifier = null;
      this.updateModifierUI();
      this.updateLanguage();
    } else if (this.modifier === 'god') {
      // Only father, mother, son, daughter are permitted in godparent mode
      if (token === TOKENS.FATHER) finalToken = TOKENS.GOD_FATHER;
      else if (token === TOKENS.MOTHER) finalToken = TOKENS.GOD_MOTHER;
      else if (token === TOKENS.SON) finalToken = TOKENS.GOD_SON;
      else if (token === TOKENS.DAUGHTER) finalToken = TOKENS.GOD_DAUGHTER;
      else {
        return; // Ignore invalid relations in god mode
      }
      this.modifier = null;
      this.updateModifierUI();
      this.updateLanguage();
    }

    this.chain.push(finalToken);
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
    if (this.modifier) {
      this.modifier = null;
      this.updateModifierUI();
      this.updateLanguage();
    }
    this.render();
  }

  toggleMutual() {
    this.triggerHaptic();
    if (this.chain.length === 0) return;
    this.isMutualView = !this.isMutualView;
    this.render();
    const mutualMsg = this.currentLang === 'zh' ? '已切换至互查模式' :
                      this.currentLang === 'ko' ? '상호 호칭 모드로 전환됨' :
                      this.currentLang === 'ru' ? 'Переключено на взаимное обращение' :
                      this.currentLang === 'pl' ? 'Przełączono na relację wzajemną' :
                      this.currentLang === 'de' ? 'Auf gegenseitige Anrede umgeschaltet' :
                      this.currentLang === 'fr' ? 'Passé en mode réciproque' :
                      this.currentLang === 'it' ? 'Passato alla modalità reciproca' :
                      this.currentLang === 'es' ? 'Cambiado a modo recíproco' :
                      this.currentLang === 'ja' ? '相互呼称モードに切り替えました' :
                      this.currentLang === 'vi' ? 'Chuyển sang chế độ xưng hô ngược lại' :
                      this.currentLang === 'sk' ? 'Prepnuté na: Kto som ja pre neho' :
                      this.currentLang === 'en' ? 'Switched to reciprocal view' :
                      'Přepnuto na: Kdo jsem já pro něj';
    const baseMsg = this.currentLang === 'zh' ? '基础模式' :
                    this.currentLang === 'ko' ? '기본 모드' :
                    this.currentLang === 'ru' ? 'Основной режим' :
                    this.currentLang === 'pl' ? 'Tryb podstawowy' :
                    this.currentLang === 'de' ? 'Standardansicht' :
                    this.currentLang === 'fr' ? 'Mode standard' :
                    this.currentLang === 'it' ? 'Modalità standard' :
                    this.currentLang === 'es' ? 'Modo estándar' :
                    this.currentLang === 'ja' ? '通常モード' :
                    this.currentLang === 'vi' ? 'Chế độ tiêu chuẩn' :
                    this.currentLang === 'sk' ? 'Základný pohľad' :
                    this.currentLang === 'en' ? 'Standard view' :
                    'Základní pohled';
    this.showToast(this.isMutualView ? mutualMsg : baseMsg);
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
