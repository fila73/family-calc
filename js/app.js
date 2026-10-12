/**
 * Rodinná kalkulačka - Hlavní aplikační kontrolér
 */

import { resolveKinship, invertChain, TOKENS, getTokenGender } from './engine/kinship-engine.js';
import { parseGedcom, getStepDirection } from './engine/gedcom-parser.js';
import { getDictionary, languagesRegistry, languageCategories, getLanguageMeta } from './i18n/index.js';

class FamilyCalcApp {
  constructor() {
    this.chain = [];
    this.egoGender = localStorage.getItem('ego_gender') || 'm';
    this.currentLang = localStorage.getItem('lang_code') || 'cs';
    this.isMutualView = false;
    this.modifier = null; // null | 'step' | 'god'
    this.history = this.loadHistory();
    this.recentLangs = this.loadRecentLangs();
    this.quizState = { score: 0, total: 0, streak: 0, currentQuestion: null };
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.soundEnabled = localStorage.getItem('family_calc_sound') !== 'false';
    this.audioCtx = null;
    this.activeGedcom = null;
    this.gedcomKinshipResult = null;
    this.gedcomPathMeta = null;

    this.initElements();
    this.initEventListeners();
    this.updateLanguageTrigger();
    this.updateLanguage();
    this.updateSoundUI();
    this.render();
  }

  initElements() {
    this.appTitle = document.getElementById('appTitle');
    this.appSubtitle = document.getElementById('appSubtitle');
    this.genderBtnMale = document.getElementById('genderBtnMale');
    this.genderBtnFemale = document.getElementById('genderBtnFemale');
    this.probandLabelText = document.getElementById('probandLabelText');

    // Sound button in header
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');

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

    // Action buttons (TTS, Share, Tree)
    this.ttsBtn = document.getElementById('ttsBtn');
    this.shareBtn = document.getElementById('shareBtn');
    this.openTreeBtn = document.getElementById('openTreeBtn');

    // Hamburger Menu elements
    this.openMenuBtn = document.getElementById('openMenuBtn');
    this.closeMenuModalBtn = document.getElementById('closeMenuModalBtn');
    this.menuModal = document.getElementById('menuModal');
    this.menuDictBtn = document.getElementById('menuDictBtn');
    this.menuQuizBtn = document.getElementById('menuQuizBtn');
    this.menuHistoryBtn = document.getElementById('menuHistoryBtn');
    this.menuDownloadCardBtn = document.getElementById('menuDownloadCardBtn');
    this.menuInheritanceBtn = document.getElementById('menuInheritanceBtn');
    this.menuImpedimentBtn = document.getElementById('menuImpedimentBtn');
    this.menuVoiceBtn = document.getElementById('menuVoiceBtn');
    this.menuCompareBtn = document.getElementById('menuCompareBtn');
    this.menuGedcomBtn = document.getElementById('menuGedcomBtn');
    this.menuShortcutsBtn = document.getElementById('menuShortcutsBtn');
    this.menuDonateBtn = document.getElementById('menuDonateBtn');

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

    // Visual Tree Modal
    this.treeModal = document.getElementById('treeModal');
    this.closeTreeModalBtn = document.getElementById('closeTreeModalBtn');
    this.treeCanvasContainer = document.getElementById('treeCanvasContainer');

    // Quiz Modal
    this.quizModal = document.getElementById('quizModal');
    this.closeQuizModalBtn = document.getElementById('closeQuizModalBtn');
    this.quizScoreBadge = document.getElementById('quizScoreBadge');
    this.quizStreakBadge = document.getElementById('quizStreakBadge');
    this.quizBadge = document.getElementById('quizBadge');
    this.quizQuestion = document.getElementById('quizQuestion');
    this.quizOptionsGrid = document.getElementById('quizOptionsGrid');
    this.quizFeedback = document.getElementById('quizFeedback');
    this.quizNextBtn = document.getElementById('quizNextBtn');

    // History Modal
    this.historyModal = document.getElementById('historyModal');
    this.closeHistoryModalBtn = document.getElementById('closeHistoryModalBtn');
    this.historyCount = document.getElementById('historyCount');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
    this.historyList = document.getElementById('historyList');

    // Inheritance Modal
    this.inheritanceModal = document.getElementById('inheritanceModal');
    this.closeInheritanceModalBtn = document.getElementById('closeInheritanceModalBtn');
    this.inheritanceModalBody = document.getElementById('inheritanceModalBody');

    // Marriage Impediment Modal
    this.impedimentModal = document.getElementById('impedimentModal');
    this.closeImpedimentModalBtn = document.getElementById('closeImpedimentModalBtn');
    this.impedimentModalBody = document.getElementById('impedimentModalBody');

    // Voice Input Modal
    this.voiceModal = document.getElementById('voiceModal');
    this.closeVoiceModalBtn = document.getElementById('closeVoiceModalBtn');
    this.voiceMicCircle = document.getElementById('voiceMicCircle');
    this.voiceStatusText = document.getElementById('voiceStatusText');
    this.voiceTranscriptBox = document.getElementById('voiceTranscriptBox');

    // Compare Modal
    this.compareModal = document.getElementById('compareModal');
    this.closeCompareModalBtn = document.getElementById('closeCompareModalBtn');
    this.comparePersonA = document.getElementById('comparePersonA');
    this.comparePersonB = document.getElementById('comparePersonB');
    this.executeCompareBtn = document.getElementById('executeCompareBtn');
    this.compareResultCard = document.getElementById('compareResultCard');
    this.compareResultTitle = document.getElementById('compareResultTitle');
    this.compareResultDesc = document.getElementById('compareResultDesc');

    // GEDCOM Modal elements
    this.gedcomModal = document.getElementById('gedcomModal');
    this.closeGedcomModalBtn = document.getElementById('closeGedcomModalBtn');
    this.gedcomFileInput = document.getElementById('gedcomFileInput');
    this.uploadGedcomBtn = document.getElementById('uploadGedcomBtn');
    this.sampleGedcomBtn = document.getElementById('sampleGedcomBtn');
    this.gedcomStatusBox = document.getElementById('gedcomStatusBox');
    this.gedcomSelectSection = document.getElementById('gedcomSelectSection');
    this.gedcomPersonA = document.getElementById('gedcomPersonA');
    this.gedcomPersonB = document.getElementById('gedcomPersonB');
    this.executeGedcomBtn = document.getElementById('executeGedcomBtn');
    this.gedcomResultCard = document.getElementById('gedcomResultCard');
    this.gedcomResultTitle = document.getElementById('gedcomResultTitle');
    this.gedcomResultDesc = document.getElementById('gedcomResultDesc');
    this.transferGedcomBtn = document.getElementById('transferGedcomBtn');
    this.viewGedcomTreeBtn = document.getElementById('viewGedcomTreeBtn');

    // Keyboard Shortcuts Modal elements
    this.shortcutsModal = document.getElementById('shortcutsModal');
    this.closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');

    // Donate / Support Modal elements
    this.donateModal = document.getElementById('donateModal');
    this.closeDonateModalBtn = document.getElementById('closeDonateModalBtn');
    this.copyAccBtn = document.getElementById('copyAccBtn');
    this.donateAccNumber = document.getElementById('donateAccNumber');
    this.openPlayReviewBtn = document.getElementById('openPlayReviewBtn');
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

    // Hamburger Menu handlers
    if (this.openMenuBtn) {
      this.openMenuBtn.addEventListener('click', () => this.openMenu());
    }
    if (this.closeMenuModalBtn) {
      this.closeMenuModalBtn.addEventListener('click', () => this.closeMenu());
    }
    if (this.menuModal) {
      this.menuModal.addEventListener('click', (e) => {
        if (e.target === this.menuModal) this.closeMenu();
      });
    }
    if (this.menuDictBtn) {
      this.menuDictBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openDictionary();
      });
    }
    if (this.menuQuizBtn) {
      this.menuQuizBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openQuizModal();
      });
    }
    if (this.menuHistoryBtn) {
      this.menuHistoryBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openHistoryModal();
      });
    }
    if (this.menuDownloadCardBtn) {
      this.menuDownloadCardBtn.addEventListener('click', () => {
        this.closeMenu();
        this.downloadCardAsPNG();
      });
    }
    if (this.menuInheritanceBtn) {
      this.menuInheritanceBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openInheritanceModal();
      });
    }
    if (this.menuImpedimentBtn) {
      this.menuImpedimentBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openImpedimentModal();
      });
    }
    if (this.menuVoiceBtn) {
      this.menuVoiceBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openVoiceModal();
      });
    }
    if (this.menuCompareBtn) {
      this.menuCompareBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openCompareModal();
      });
    }
    if (this.menuGedcomBtn) {
      this.menuGedcomBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openGedcomModal();
      });
    }
    if (this.menuShortcutsBtn) {
      this.menuShortcutsBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openShortcutsModal();
      });
    }
    if (this.menuDonateBtn) {
      this.menuDonateBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openDonateModal();
      });
    }
    if (this.closeDonateModalBtn) {
      this.closeDonateModalBtn.addEventListener('click', () => this.closeDonateModal());
    }
    if (this.donateModal) {
      this.donateModal.addEventListener('click', (e) => {
        if (e.target === this.donateModal) this.closeDonateModal();
      });
    }
    if (this.copyAccBtn && this.donateAccNumber) {
      this.copyAccBtn.addEventListener('click', () => {
        this.triggerHaptic();
        const accText = this.donateAccNumber.textContent.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(accText).then(() => {
            this.showToast('Číslo účtu zkopírováno do schránky 📋');
          }).catch(() => {
            this.showToast(accText);
          });
        } else {
          this.showToast(accText);
        }
      });
    }
    if (this.openPlayReviewBtn) {
      this.openPlayReviewBtn.addEventListener('click', () => {
        this.triggerHaptic();
        window.open('https://play.google.com/store/apps/details?id=cz.fila73.familycalc', '_blank');
        this.showToast('Děkujeme za recenzi a podporu! ⭐');
      });
    }

    // Sound toggle in header
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    }

    // Action buttons (TTS, Share, Tree)
    if (this.ttsBtn) {
      this.ttsBtn.addEventListener('click', () => this.speakResult());
    }
    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', () => this.shareResult());
    }
    if (this.openTreeBtn) {
      this.openTreeBtn.addEventListener('click', () => this.openTreeModal());
    }

    // Tree Modal close
    if (this.closeTreeModalBtn) {
      this.closeTreeModalBtn.addEventListener('click', () => this.closeTreeModal());
    }
    if (this.treeModal) {
      this.treeModal.addEventListener('click', (e) => {
        if (e.target === this.treeModal) this.closeTreeModal();
      });
    }

    // Quiz Modal close
    if (this.closeQuizModalBtn) {
      this.closeQuizModalBtn.addEventListener('click', () => this.closeQuizModal());
    }
    if (this.quizModal) {
      this.quizModal.addEventListener('click', (e) => {
        if (e.target === this.quizModal) this.closeQuizModal();
      });
    }
    if (this.quizNextBtn) {
      this.quizNextBtn.addEventListener('click', () => this.nextQuizQuestion());
    }

    // History Modal close
    if (this.closeHistoryModalBtn) {
      this.closeHistoryModalBtn.addEventListener('click', () => this.closeHistoryModal());
    }
    if (this.historyModal) {
      this.historyModal.addEventListener('click', (e) => {
        if (e.target === this.historyModal) this.closeHistoryModal();
      });
    }
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    // Inheritance Modal close
    if (this.closeInheritanceModalBtn) {
      this.closeInheritanceModalBtn.addEventListener('click', () => this.closeInheritanceModal());
    }
    if (this.inheritanceModal) {
      this.inheritanceModal.addEventListener('click', (e) => {
        if (e.target === this.inheritanceModal) this.closeInheritanceModal();
      });
    }

    // Impediment Modal close
    if (this.closeImpedimentModalBtn) {
      this.closeImpedimentModalBtn.addEventListener('click', () => this.closeImpedimentModal());
    }
    if (this.impedimentModal) {
      this.impedimentModal.addEventListener('click', (e) => {
        if (e.target === this.impedimentModal) this.closeImpedimentModal();
      });
    }

    // Voice Modal close
    if (this.closeVoiceModalBtn) {
      this.closeVoiceModalBtn.addEventListener('click', () => this.closeVoiceModal());
    }
    if (this.voiceModal) {
      this.voiceModal.addEventListener('click', (e) => {
        if (e.target === this.voiceModal) this.closeVoiceModal();
      });
    }

    // Compare Modal close & execute
    if (this.closeCompareModalBtn) {
      this.closeCompareModalBtn.addEventListener('click', () => this.closeCompareModal());
    }
    if (this.compareModal) {
      this.compareModal.addEventListener('click', (e) => {
        if (e.target === this.compareModal) this.closeCompareModal();
      });
    }
    if (this.executeCompareBtn) {
      this.executeCompareBtn.addEventListener('click', () => this.executeCompare());
    }

    // GEDCOM Modal listeners
    if (this.closeGedcomModalBtn) {
      this.closeGedcomModalBtn.addEventListener('click', () => this.closeGedcomModal());
    }
    if (this.gedcomModal) {
      this.gedcomModal.addEventListener('click', (e) => {
        if (e.target === this.gedcomModal) this.closeGedcomModal();
      });
    }
    if (this.uploadGedcomBtn) {
      this.uploadGedcomBtn.addEventListener('click', () => {
        if (this.gedcomFileInput) this.gedcomFileInput.click();
      });
    }
    if (this.gedcomFileInput) {
      this.gedcomFileInput.addEventListener('change', (e) => this.handleGedcomFileUpload(e));
    }
    if (this.sampleGedcomBtn) {
      this.sampleGedcomBtn.addEventListener('click', () => this.loadSampleGedcom());
    }
    if (this.executeGedcomBtn) {
      this.executeGedcomBtn.addEventListener('click', () => this.executeGedcomKinship());
    }
    if (this.transferGedcomBtn) {
      this.transferGedcomBtn.addEventListener('click', () => this.transferGedcomToCalculator());
    }
    if (this.viewGedcomTreeBtn) {
      this.viewGedcomTreeBtn.addEventListener('click', () => {
        this.transferGedcomToCalculator();
        this.openTreeModal();
      });
    }

    // Shortcuts Modal listeners
    if (this.closeShortcutsModalBtn) {
      this.closeShortcutsModalBtn.addEventListener('click', () => this.closeShortcutsModal());
    }
    if (this.shortcutsModal) {
      this.shortcutsModal.addEventListener('click', (e) => {
        if (e.target === this.shortcutsModal) this.closeShortcutsModal();
      });
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
    if (this.closeDictBtn) {
      this.closeDictBtn.addEventListener('click', () => this.closeDictionary());
    }
    if (this.dictModal) {
      this.dictModal.addEventListener('click', (e) => {
        if (e.target === this.dictModal) this.closeDictionary();
      });
    }
    if (this.dictSearchInput) {
      this.dictSearchInput.addEventListener('input', () => this.filterDictionary());
    }

    // Click on reciprocal link in details box to swap perspective
    this.detailReciprocal.addEventListener('click', () => this.toggleMutual());

    // Comprehensive Keyboard Shortcuts for Desktop
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      const anyModalOpen = [
        this.dictModal,
        this.langModal,
        this.treeModal,
        this.quizModal,
        this.historyModal,
        this.menuModal,
        this.inheritanceModal,
        this.impedimentModal,
        this.voiceModal,
        this.compareModal,
        this.gedcomModal,
        this.shortcutsModal,
        this.donateModal
      ].some((m) => m && m.classList.contains('open'));

      if (e.key === 'Escape') {
        if (isInputFocused) {
          activeEl.blur();
        }
        if (anyModalOpen) {
          if (this.dictModal && this.dictModal.classList.contains('open')) this.closeDictionary();
          if (this.langModal && this.langModal.classList.contains('open')) this.closeLanguageModal();
          if (this.treeModal && this.treeModal.classList.contains('open')) this.closeTreeModal();
          if (this.quizModal && this.quizModal.classList.contains('open')) this.closeQuizModal();
          if (this.historyModal && this.historyModal.classList.contains('open')) this.closeHistoryModal();
          if (this.menuModal && this.menuModal.classList.contains('open')) this.closeMenu();
          if (this.inheritanceModal && this.inheritanceModal.classList.contains('open')) this.closeInheritanceModal();
          if (this.impedimentModal && this.impedimentModal.classList.contains('open')) this.closeImpedimentModal();
          if (this.voiceModal && this.voiceModal.classList.contains('open')) this.closeVoiceModal();
          if (this.compareModal && this.compareModal.classList.contains('open')) this.closeCompareModal();
          if (this.gedcomModal && this.gedcomModal.classList.contains('open')) this.closeGedcomModal();
          if (this.shortcutsModal && this.shortcutsModal.classList.contains('open')) this.closeShortcutsModal();
          if (this.donateModal && this.donateModal.classList.contains('open')) this.closeDonateModal();
        } else {
          this.clearAll();
        }
        return;
      }

      // If user is typing in an input field or a modal is open, do not intercept normal typing
      if (isInputFocused || anyModalOpen) {
        return;
      }

      // Hotkeys for kinship calculator
      const key = e.key;
      if (key === 'f' || key === 'F') {
        this.addToken(TOKENS.FATHER);
      } else if (key === 'm' || key === 'M') {
        this.addToken(TOKENS.MOTHER);
      } else if (key === 's' || key === 'S') {
        this.addToken(TOKENS.SON);
      } else if (key === 'd' || key === 'D') {
        this.addToken(TOKENS.DAUGHTER);
      } else if (key === 'b') {
        this.addToken(TOKENS.OLDER_BROTHER);
      } else if (key === 'B') {
        this.addToken(TOKENS.YOUNGER_BROTHER);
      } else if (key === 'x') {
        this.addToken(TOKENS.OLDER_SISTER);
      } else if (key === 'X') {
        this.addToken(TOKENS.YOUNGER_SISTER);
      } else if (key === 'h' || key === 'H') {
        this.addToken(TOKENS.HUSBAND);
      } else if (key === 'w' || key === 'W') {
        this.addToken(TOKENS.WIFE);
      } else if (key === 'c' || key === 'C') {
        this.clearAll();
      } else if (key === 'Backspace' || key === 'Delete') {
        this.popToken();
      } else if (key === 'Enter' || key === '=') {
        this.onEquals();
      } else if (key === 'r' || key === 'R' || key === 'i' || key === 'I') {
        this.toggleMutual();
      } else if (key === 'Tab') {
        e.preventDefault();
        this.toggleModifier('step');
      } else if (key === 'g' || key === 'G' || key === ' ') {
        if (key === ' ') e.preventDefault();
        this.toggleModifier('god');
      } else if (key === '?' || key === 'F1') {
        e.preventDefault();
        this.openShortcutsModal();
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
    this.playClickSound();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Ignored
      }
    }
  }

  playClickSound() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.025);
    } catch (e) {}
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('family_calc_sound', this.soundEnabled ? 'true' : 'false');
    this.updateSoundUI();
    if (this.soundEnabled) {
      this.playClickSound();
      this.showToast('Zvukové efekty: Zapnuto 🔊');
    } else {
      this.showToast('Zvukové efekty: Vypnuto 🔇');
    }
  }

  updateSoundUI() {
    if (this.soundIcon) {
      this.soundIcon.textContent = this.soundEnabled ? '🔊' : '🔇';
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
    this.gedcomPathMeta = null;
    this.render();
  }

  popToken() {
    this.triggerHaptic();
    this.isMutualView = false;
    this.gedcomPathMeta = null;
    if (this.chain.length > 0) {
      this.chain.pop();
      this.render();
    }
  }

  clearAll() {
    this.triggerHaptic();
    this.chain = [];
    this.isMutualView = false;
    this.gedcomPathMeta = null;
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

    // Update active class on mutual key
    if (this.keyMutual) {
      this.keyMutual.classList.toggle('active-mutual', this.isMutualView && this.chain.length > 0);
      this.keyMutual.setAttribute('aria-pressed', (this.isMutualView && this.chain.length > 0) ? 'true' : 'false');
    }

    if (this.chain.length === 0) {
      this.isMutualView = false;
      if (this.keyMutual) {
        this.keyMutual.classList.remove('active-mutual');
        this.keyMutual.setAttribute('aria-pressed', 'false');
      }
      const selfResolved = resolveKinship([], this.egoGender, dict);
      this.renderChainBreadcrumbs(dict);
      this.resultMain.textContent = selfResolved.name;
      this.metaBadges.innerHTML = '<span class="meta-badge badge-line">📍 Výchozí osoba</span>';
      if (this.explanationLabel) this.explanationLabel.textContent = 'Vysvětlení:';
      this.detailExplanation.textContent = 'Výchozí bod rodokmenu. Vyberte příbuzného stiskem kláves níže.';
      if (this.reciprocalLabel) this.reciprocalLabel.textContent = 'Vzájemně:';
      this.detailReciprocal.textContent = '—';
      this.detailReciprocal.classList.remove('reciprocal-clickable');
      return;
    }

    const lastToken = this.chain[this.chain.length - 1];
    const targetGender = getTokenGender(lastToken) || 'm';

    // 1. Direct relationship from Ego -> Target
    const directResolved = resolveKinship(this.chain, this.egoGender, dict);

    // 2. Mutual / Reciprocal relationship from Target -> Ego
    const invertedChain = invertChain(this.chain, this.egoGender);
    const mutualResolved = resolveKinship(invertedChain, targetGender, dict);

    // Active displayed item based on mutual mode
    const displayedResolved = this.isMutualView ? mutualResolved : directResolved;

    // 1. Render Chain Breadcrumbs
    this.renderChainBreadcrumbs(dict, directResolved.name);

    // 2. Render Main Result
    this.resultMain.textContent = displayedResolved.name;

    // 3. Render Badges
    this.metaBadges.innerHTML = '';

    if (this.isMutualView) {
      const bMutual = document.createElement('span');
      bMutual.className = 'meta-badge badge-mutual-mode';
      bMutual.innerHTML = `⇄ Vzájemný vztah: <strong>${directResolved.name}</strong> ➔ říká mně`;
      this.metaBadges.appendChild(bMutual);
    }

    if (displayedResolved.archaic) {
      const bArch = document.createElement('span');
      bArch.className = 'meta-badge badge-archaic';
      bArch.innerHTML = `📜 ${displayedResolved.archaic}`;
      this.metaBadges.appendChild(bArch);
    }

    if (displayedResolved.generation !== undefined && displayedResolved.generation !== 0) {
      const bGen = document.createElement('span');
      bGen.className = 'meta-badge badge-generation';
      const sign = displayedResolved.generation > 0 ? '+' : '';
      bGen.textContent = `${dict.labels.generationLabel}: ${sign}${displayedResolved.generation}`;
      this.metaBadges.appendChild(bGen);
    }

    if (displayedResolved.lineType && dict.labels.lineTypes[displayedResolved.lineType]) {
      const bLine = document.createElement('span');
      bLine.className = 'meta-badge badge-line';
      bLine.textContent = dict.labels.lineTypes[displayedResolved.lineType];
      this.metaBadges.appendChild(bLine);
    }

    if (displayedResolved.consanguinity && displayedResolved.consanguinity.badge) {
      const bDna = document.createElement('span');
      bDna.className = 'meta-badge badge-consanguinity';
      bDna.textContent = displayedResolved.consanguinity.badge;
      this.metaBadges.appendChild(bDna);
    }

    if (displayedResolved.inheritance && displayedResolved.inheritance.badge) {
      const bInh = document.createElement('span');
      bInh.className = 'meta-badge badge-inheritance';
      bInh.textContent = displayedResolved.inheritance.badge;
      this.metaBadges.appendChild(bInh);
    }

    if (displayedResolved.marriageImpediment && displayedResolved.marriageImpediment.badge) {
      const bImp = document.createElement('span');
      bImp.className = `meta-badge ${displayedResolved.marriageImpediment.allowed ? 'badge-impediment-allowed' : 'badge-impediment-blocked'}`;
      bImp.textContent = displayedResolved.marriageImpediment.badge;
      this.metaBadges.appendChild(bImp);
    }

    // 4. Render Details Box
    if (this.isMutualView) {
      if (this.explanationLabel) this.explanationLabel.textContent = 'Vysvětlení:';
      this.detailExplanation.textContent = `Z pohledu ${directResolved.name}: Jste pro něj „${mutualResolved.name}“. ${mutualResolved.description || ''}`;
      if (this.reciprocalLabel) this.reciprocalLabel.textContent = 'Základní vztah:';
      this.detailReciprocal.textContent = `${directResolved.name} (kliknutím zpět)`;
      this.detailReciprocal.title = 'Kliknutím přepneš zpět na základní pohled';
    } else {
      if (this.explanationLabel) this.explanationLabel.textContent = 'Vysvětlení:';
      this.detailExplanation.textContent = displayedResolved.description;
      if (this.reciprocalLabel) this.reciprocalLabel.textContent = 'Vzájemně:';
      this.detailReciprocal.textContent = mutualResolved.name;
      this.detailReciprocal.title = 'Kliknutím přepneš na vzájemný vztah (jak mi říká on)';
    }
    this.detailReciprocal.classList.add('reciprocal-clickable');

    // Auto-save to calculation history
    this.saveHistoryItem(this.chain, displayedResolved.name);
  }

  renderChainBreadcrumbs(dict, directName = '') {
    this.chainContainer.innerHTML = '';

    // "Self" starting node
    const selfItem = document.createElement('span');
    selfItem.className = 'chain-item chain-self';
    selfItem.textContent = dict.labels.self || 'JÁ';
    selfItem.title = 'Výchozí osoba (proband)';
    selfItem.addEventListener('click', () => this.clearAll());
    this.chainContainer.appendChild(selfItem);

    if (this.chain.length === 0) return;

    this.chain.forEach((token, index) => {
      // Směrová šipka podle generačního posunu
      const dir = getStepDirection(token);
      const arrow = document.createElement('span');
      const arrowClass = dir.arrow === '↗' ? 'arrow-up' : dir.arrow === '↘' ? 'arrow-down' : dir.arrow === '↔' ? 'arrow-partner' : 'arrow-level';
      arrow.className = `chain-arrow ${arrowClass}`;
      arrow.textContent = dir.arrow;
      arrow.title = dir.arrow === '↗' ? 'Předek (+1 generace)' : dir.arrow === '↘' ? 'Potomek (-1 generace)' : dir.arrow === '↔' ? 'Manželský partner' : 'Sourozenec';
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
    return tokens.map((t) => dict.labels.tokens[t] || t).join(' ➔ ');
  }

  // === 1. Text-to-Speech (Předčítání výsledku) ===
  speakResult() {
    this.triggerHaptic();

    const dict = getDictionary(this.currentLang);
    const activeChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(activeChain, this.egoGender, dict);
    const textToSpeak = `${resolved.name}. ${resolved.description || ''}`;

    const langMap = {
      cs: 'cs-CZ', sk: 'sk-SK', en: 'en-US', de: 'de-DE', pl: 'pl-PL',
      fr: 'fr-FR', it: 'it-IT', es: 'es-ES', ru: 'ru-RU', zh: 'zh-CN',
      ja: 'ja-JP', ko: 'ko-KR', vi: 'vi-VN', uk: 'uk-UA', pt: 'pt-PT',
      nl: 'nl-NL', hu: 'hu-HU', tr: 'tr-TR', el: 'el-GR', sv: 'sv-SE',
      hi: 'hi-IN', id: 'id-ID', ar: 'ar-SA', hr: 'hr-HR', ro: 'ro-RO'
    };
    const targetLang = langMap[this.currentLang] || 'cs-CZ';

    // 1. Native Android TTS bridge (funguje v nativní aplikaci na telefonu offline)
    if (typeof window.AndroidTTS !== 'undefined' && window.AndroidTTS.speak) {
      try {
        window.AndroidTTS.speak(textToSpeak, targetLang);
        if (this.ttsBtn) {
          this.ttsBtn.classList.add('speaking');
          setTimeout(() => {
            if (this.ttsBtn) this.ttsBtn.classList.remove('speaking');
          }, 3500);
        }
        this.showToast(`🔊 Čtu: ${resolved.name}`);
        return;
      } catch (e) {
        console.warn('Native Android TTS error, fallback to Web Speech:', e);
      }
    }

    // 2. Web Speech API (pro standardní prohlížeče)
    const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : this.synth;
    if (!synth) {
      this.showToast('Hlasová syntéza není tímto prohlížečem podporována');
      return;
    }

    try {
      synth.cancel(); // Zastavení předchozího předčítání
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLang;
      utterance.rate = 0.95;

      if (this.ttsBtn) {
        this.ttsBtn.classList.add('speaking');
        utterance.onend = () => this.ttsBtn && this.ttsBtn.classList.remove('speaking');
        utterance.onerror = () => this.ttsBtn && this.ttsBtn.classList.remove('speaking');
      }

      synth.speak(utterance);
      this.showToast(`🔊 Čtu: ${resolved.name}`);
    } catch (e) {
      console.error('SpeechSynthesis error:', e);
      this.showToast('Hlasová syntéza se nezdařila');
    }
  }

  // === 2. Share Result (Sdílení kartičky) ===
  async shareResult() {
    this.triggerHaptic();
    const dict = getDictionary(this.currentLang);
    const activeChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(activeChain, this.egoGender, dict);

    const pathText = this.chain.length > 0
      ? this.formatKeyPath(this.chain.join(','), dict)
      : (dict.labels.self || 'Já');

    const text = [
      '👨‍👩‍👧‍👦 Rodinná kalkulačka (Terms of Kinship)',
      '━━━━━━━━━━━━━━━━━━━',
      `🔹 Vztah: Já ➔ ${pathText}`,
      `🏷️ Výsledek: ${resolved.name}${resolved.archaic ? ` (stč. ${resolved.archaic})` : ''}`,
      `📖 Popis: ${resolved.description || '—'}`,
      resolved.consanguinity && resolved.consanguinity.badge ? `🧬 ${resolved.consanguinity.badge}` : null,
      '━━━━━━━━━━━━━━━━━━━',
      'Vypočteno na Rodinné kalkulačce'
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rodinná kalkulačka: ${resolved.name}`,
          text
        });
        this.showToast('✅ Sdíleno');
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        this.showToast('📋 Výsledek zkopírován do schránky!');
      } catch (e) {
        this.showToast('Chyba při kopírování do schránky');
      }
    } else {
      this.showToast(resolved.name);
    }
  }

  // === 3. Visual Family Tree Modal (Vizuální minirodokmen) ===
  openTreeModal() {
    this.triggerHaptic();
    this.renderTree();
    if (this.treeModal) this.treeModal.classList.add('open');
  }

  closeTreeModal() {
    if (this.treeModal) this.treeModal.classList.remove('open');
  }

  renderTree() {
    if (!this.treeCanvasContainer) return;
    this.treeCanvasContainer.innerHTML = '';

    const dict = getDictionary(this.currentLang);
    const effectiveChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(effectiveChain, this.egoGender, dict);

    // Ověříme, zda aktuální kalkulace odpovídá přenesené cestě z GEDCOMu
    const hasGedcomMatch = Boolean(
      this.gedcomPathMeta &&
      Array.isArray(this.gedcomPathMeta.personsInPath) &&
      this.gedcomPathMeta.personsInPath.length === (this.chain.length + 1) &&
      this.gedcomPathMeta.originalChain &&
      this.gedcomPathMeta.originalChain.join(',') === this.chain.join(',')
    );

    // Pomocná funkce pro formátování genealogických let a dat
    const formatPersonDates = (p) => {
      if (!p) return '';
      if (p.birthYear && p.deathYear) return `*${p.birthYear} – †${p.deathYear}`;
      if (p.birthYear) return `*${p.birthYear}`;
      if (p.deathYear) return `†${p.deathYear}`;
      if (p.birthDate && p.deathDate) return `*${p.birthDate} – †${p.deathDate}`;
      if (p.birthDate) return `*${p.birthDate}`;
      if (p.deathDate) return `†${p.deathDate}`;
      return '';
    };

    // Pomocná funkce pro personální avatar
    const getPersonAvatar = (person, token, isSelf) => {
      if (person && person.sex) {
        if (person.sex === 'F') return '👩';
        if (person.sex === 'M') return '👨';
      }
      if (isSelf) return this.egoGender === 'm' ? '👨' : '👩';
      if (!token) return '🧑';
      if (token.includes('f') || token === 'step_f' || token === 'god_f') return '👨';
      if (token.includes('m') || token === 'step_m' || token === 'god_m') return '👩';
      if (token === 's' || token === 'step_s' || token === 'god_s') return '👦';
      if (token === 'd' || token === 'step_d' || token === 'god_d') return '👧';
      if (token === 'h') return '👨';
      if (token === 'w') return '👩';
      if (token.includes('b')) return '👦';
      if (token.includes('z')) return '👧';
      return '🧑';
    };

    // Pokud je aktivní přenesená cesta z GEDCOMu, zobrazíme záhlavní banner
    if (hasGedcomMatch) {
      const startP = this.isMutualView ? this.gedcomPathMeta.personB : this.gedcomPathMeta.personA;
      const endP = this.isMutualView ? this.gedcomPathMeta.personA : this.gedcomPathMeta.personB;
      const stepCount = effectiveChain.length;
      const stepWord = stepCount === 1 ? 'krok' : stepCount < 5 ? 'kroky' : 'kroků';

      const banner = document.createElement('div');
      banner.className = 'tree-source-banner';
      banner.innerHTML = `
        <div class="tree-source-icon">📜</div>
        <div class="tree-source-text">
          <div class="tree-source-title">Příbuzenská cesta z rodokmenu GEDCOM</div>
          <div class="tree-source-sub">${startP ? startP.name : 'Osoba A'} ➔ ${endP ? endP.name : 'Osoba B'} (${stepCount} ${stepWord})</div>
        </div>
      `;
      this.treeCanvasContainer.appendChild(banner);
    }

    const personsList = hasGedcomMatch
      ? (this.isMutualView ? [...this.gedcomPathMeta.personsInPath].reverse() : this.gedcomPathMeta.personsInPath)
      : null;

    // Node 0: EGO (nebo počáteční osoba z GEDCOMu)
    const egoCard = document.createElement('div');
    egoCard.className = 'tree-node-card self-node';
    const person0 = personsList ? personsList[0] : null;
    const egoAvatar = getPersonAvatar(person0, null, !this.isMutualView);

    let egoTitle = dict.labels.self || 'Já (proband)';
    let egoSub = 'Výchozí bod výzkumu (Gen 0)';

    if (person0) {
      egoTitle = person0.name || egoTitle;
      const dates = formatPersonDates(person0);
      const role = this.isMutualView ? 'Tázající se osoba (původní cíl)' : 'Výchozí proband (JÁ)';
      egoSub = dates ? `<span class="tree-node-dates">${dates}</span> · ${role}` : role;
    }

    egoCard.innerHTML = `
      <div class="tree-avatar">${egoAvatar}</div>
      <div class="tree-node-info">
        <div class="tree-node-title">${egoTitle}</div>
        <div class="tree-node-sub">${egoSub}</div>
      </div>
    `;
    this.treeCanvasContainer.appendChild(egoCard);

    if (effectiveChain.length === 0) return;

    // Procházíme kroky v řetězci
    effectiveChain.forEach((token, idx) => {
      const isLast = idx === effectiveChain.length - 1;
      const stepName = dict.labels.tokens[token] || token;
      const stepDir = getStepDirection(token);
      const arrowClass = stepDir.genShift > 0
        ? 'arrow-up'
        : stepDir.genShift < 0
        ? 'arrow-down'
        : (token === 'h' || token === 'w' ? 'arrow-partner' : 'arrow-same');

      // Connector se směrovou generační šipkou
      const connector = document.createElement('div');
      connector.className = 'tree-step-connector';
      connector.innerHTML = `
        <div class="tree-step-line"></div>
        <div class="tree-step-badge ${arrowClass}">${stepDir.arrow} ${stepName}</div>
        <div class="tree-step-line"></div>
      `;
      this.treeCanvasContainer.appendChild(connector);

      // Uzel (Mezilehlý nebo Cílový)
      const personNode = personsList ? personsList[idx + 1] : null;
      const avatar = getPersonAvatar(personNode, token, isLast && this.isMutualView);

      const nodeCard = document.createElement('div');
      nodeCard.className = `tree-node-card ${isLast ? 'target-node' : ''}`;

      let title = isLast ? resolved.name : stepName;
      let subtitle = isLast ? (resolved.description || '') : `Krok ${idx + 1} v řetězci`;

      if (personNode) {
        title = personNode.name || title;
        const dates = formatPersonDates(personNode);
        if (isLast) {
          const relationDesc = resolved.name + (resolved.description ? ` (${resolved.description})` : '');
          subtitle = dates ? `<span class="tree-node-dates">${dates}</span> · ${relationDesc}` : relationDesc;
        } else {
          subtitle = dates ? `<span class="tree-node-dates">${dates}</span> · Krok ${idx + 1}: ${stepName}` : `Krok ${idx + 1}: ${stepName}`;
        }
      }

      const targetTag = isLast
        ? `<span class="tree-target-tag">🌟 ${this.isMutualView ? 'Říká mně' : 'Cíl výpočtu'}: ${resolved.name}</span>`
        : '';

      nodeCard.innerHTML = `
        <div class="tree-avatar">${avatar}</div>
        <div class="tree-node-info">
          <div class="tree-node-title">${title}</div>
          <div class="tree-node-sub">${subtitle}</div>
          ${targetTag}
        </div>
      `;

      this.treeCanvasContainer.appendChild(nodeCard);
    });
  }

  // === 4. Kinship Quiz Game (Kvíz rodinných vztahů) ===
  openQuizModal() {
    this.triggerHaptic();
    this.generateQuizQuestion();
    if (this.quizModal) this.quizModal.classList.add('open');
  }

  closeQuizModal() {
    if (this.quizModal) this.quizModal.classList.remove('open');
  }

  generateQuizQuestion() {
    const dict = getDictionary(this.currentLang);
    const entries = Object.entries(dict.relations);
    if (entries.length < 4) return;

    // Pick 1 random correct relation
    const correctIdx = Math.floor(Math.random() * entries.length);
    const [correctKey, correctItem] = entries[correctIdx];

    // Pick 3 random wrong distractors
    const distractors = [];
    const usedIndices = new Set([correctIdx]);
    while (distractors.length < 3 && usedIndices.size < entries.length) {
      const idx = Math.floor(Math.random() * entries.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        distractors.push(entries[idx][1]);
      }
    }

    const questionTypes = ['whatIs', 'whoIs'];
    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let questionText = '';
    let options = [];

    if (qType === 'whatIs' && correctItem.description) {
      questionText = `Jak se nazývá: "${correctItem.description}"?`;
      options = [
        { text: correctItem.name, correct: true },
        ...distractors.map((d) => ({ text: d.name, correct: false }))
      ];
    } else {
      questionText = `Kdo je to "${correctItem.name}"?`;
      options = [
        { text: correctItem.description || correctItem.name, correct: true },
        ...distractors.map((d) => ({ text: d.description || d.name, correct: false }))
      ];
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    this.quizState.currentQuestion = {
      correctItem,
      answered: false
    };

    if (this.quizBadge) this.quizBadge.textContent = correctItem.archaic ? '📜 Historický výraz' : 'Otázka';
    if (this.quizQuestion) this.quizQuestion.textContent = questionText;
    if (this.quizFeedback) {
      this.quizFeedback.classList.remove('show');
      this.quizFeedback.textContent = '';
    }
    if (this.quizNextBtn) this.quizNextBtn.classList.remove('show');

    if (this.quizOptionsGrid) {
      this.quizOptionsGrid.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opt-btn';
        btn.innerHTML = `<span class="quiz-opt-letter">${letters[idx]}</span><span class="quiz-opt-text">${opt.text}</span>`;
        btn.addEventListener('click', () => this.handleQuizAnswer(btn, opt.correct, correctItem));
        this.quizOptionsGrid.appendChild(btn);
      });
    }

    this.updateQuizScoreUI();
  }

  handleQuizAnswer(btnEl, isCorrect, correctItem) {
    if (this.quizState.currentQuestion.answered) return;
    this.quizState.currentQuestion.answered = true;
    this.triggerHaptic();

    this.quizState.total++;
    if (isCorrect) {
      this.quizState.score++;
      this.quizState.streak++;
      btnEl.classList.add('correct');
      if (this.quizFeedback) {
        this.quizFeedback.textContent = `🎉 Správně! ${correctItem.name} — ${correctItem.description || ''}`;
        this.quizFeedback.classList.add('show');
      }
    } else {
      this.quizState.streak = 0;
      btnEl.classList.add('wrong');
      // Highlight the correct one
      const allBtns = this.quizOptionsGrid.querySelectorAll('.quiz-opt-btn');
      allBtns.forEach((b) => {
        if (b.textContent.includes(correctItem.name) || b.textContent.includes(correctItem.description)) {
          b.classList.add('correct');
        }
      });
      if (this.quizFeedback) {
        this.quizFeedback.textContent = `❌ Chyba. Správná odpověď: ${correctItem.name} (${correctItem.description || ''})`;
        this.quizFeedback.classList.add('show');
      }
    }

    // Disable all options
    const allBtns = this.quizOptionsGrid.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach((b) => {
      b.disabled = true;
    });

    if (this.quizNextBtn) this.quizNextBtn.classList.add('show');
    this.updateQuizScoreUI();
  }

  nextQuizQuestion() {
    this.triggerHaptic();
    this.generateQuizQuestion();
  }

  updateQuizScoreUI() {
    if (this.quizScoreBadge) {
      this.quizScoreBadge.textContent = `Skóre: ${this.quizState.score} / ${this.quizState.total}`;
    }
    if (this.quizStreakBadge) {
      this.quizStreakBadge.textContent = `🔥 Série: ${this.quizState.streak}`;
    }
  }

  // === 5. History Modal (Historie výpočtů) ===
  loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem('family_calc_history'));
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    return [];
  }

  saveHistoryItem(chain, resultName) {
    if (!chain || chain.length === 0) return;
    const chainKey = chain.join(',');

    // Don't duplicate consecutive identical items
    if (this.history.length > 0 && this.history[0].chainKey === chainKey) return;

    const item = {
      chainKey,
      chain: [...chain],
      resultName,
      time: Date.now()
    };

    this.history.unshift(item);
    if (this.history.length > 30) this.history = this.history.slice(0, 30);

    try {
      localStorage.setItem('family_calc_history', JSON.stringify(this.history));
    } catch (e) {}
  }

  openHistoryModal() {
    this.triggerHaptic();
    this.renderHistory();
    if (this.historyModal) this.historyModal.classList.add('open');
  }

  closeHistoryModal() {
    if (this.historyModal) this.historyModal.classList.remove('open');
  }

  renderHistory() {
    if (!this.historyList) return;
    this.historyList.innerHTML = '';
    const dict = getDictionary(this.currentLang);

    if (this.historyCount) {
      this.historyCount.textContent = `${this.history.length} výpočtů`;
    }

    if (this.history.length === 0) {
      const empty = document.createElement('div');
      empty.style.padding = '24px';
      empty.style.textAlign = 'center';
      empty.style.color = '#71717a';
      empty.textContent = 'Historie výpočtů je zatím prázdná.';
      this.historyList.appendChild(empty);
      return;
    }

    this.history.forEach((h) => {
      const card = document.createElement('div');
      card.className = 'history-item';

      const pathText = this.formatKeyPath(h.chainKey, dict);
      const timeStr = new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      card.innerHTML = `
        <div class="history-item-top">
          <span class="history-item-result">${h.resultName}</span>
          <span class="history-item-time">${timeStr}</span>
        </div>
        <div class="history-item-chain">Já ➔ ${pathText}</div>
      `;

      card.addEventListener('click', () => {
        this.triggerHaptic();
        this.chain = [...h.chain];
        this.isMutualView = false;
        this.render();
        this.closeHistoryModal();
        this.showToast(`Obnoveno: ${h.resultName}`);
      });

      this.historyList.appendChild(card);
    });
  }

  clearHistory() {
    this.triggerHaptic();
    this.history = [];
    try {
      localStorage.removeItem('family_calc_history');
    } catch (e) {}
    this.renderHistory();
    this.showToast('Historie vymazána');
  }

  // === Sandwich Menu Methods ===
  openMenu() {
    this.triggerHaptic();
    if (this.menuModal) this.menuModal.classList.add('open');
  }

  closeMenu() {
    if (this.menuModal) this.menuModal.classList.remove('open');
  }

  // === Download Card As PNG (HTML5 Canvas) ===
  downloadCardAsPNG() {
    this.triggerHaptic();
    const dict = getDictionary(this.currentLang);
    const activeChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(activeChain, this.egoGender, dict);

    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 480;
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    // 1. Dark Gradient Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#09090b');
    bgGradient.addColorStop(0.5, '#121218');
    bgGradient.addColorStop(1, '#09090b');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle radial glow at top
    const glow = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 300);
    glow.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Rounded Border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Inner subtle card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(24, 24, width - 48, height - 48);

    // 2. Header
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('👨‍👩‍👧‍👦 RODINNÁ KALKULAČKA', 44, 58);

    ctx.fillStyle = '#71717a';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('TERMS OF KINSHIP · VÝPOČET RODINNÝCH VZTAHŮ', 44, 76);

    // Divider
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(44, 92);
    ctx.lineTo(width - 44, 92);
    ctx.stroke();

    // 3. Chain Path
    const pathText = this.chain.length > 0
      ? `Já ➔ ${this.formatKeyPath(this.chain.join(','), dict)}`
      : 'Já (výchozí bod)';
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Vztah: ${pathText}`, 44, 126);

    // 4. Main Result
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(resolved.name, 44, 184);

    // Archaic badge / term
    let currentY = 220;
    if (resolved.archaic) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'italic 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`📜 Staročesky: ${resolved.archaic}`, 44, currentY);
      currentY += 32;
    }

    // Description
    if (resolved.description) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(resolved.description, 44, currentY);
      currentY += 38;
    }

    // 5. Badges
    const badges = [];
    if (resolved.consanguinity && resolved.consanguinity.badge) {
      badges.push({ text: `🧬 ${resolved.consanguinity.badge}`, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' });
    }
    if (resolved.inheritance && resolved.inheritance.badge) {
      badges.push({ text: `⚖️ ${resolved.inheritance.badge}`, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' });
    }
    if (resolved.marriageImpediment && resolved.marriageImpediment.badge) {
      badges.push({
        text: `💍 ${resolved.marriageImpediment.badge}`,
        color: resolved.marriageImpediment.allowed ? '#4ade80' : '#f87171',
        bg: resolved.marriageImpediment.allowed ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)'
      });
    }

    let badgeX = 44;
    badges.forEach((b) => {
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textWidth = ctx.measureText(b.text).width;
      const bW = textWidth + 24;
      const bH = 30;

      // pill background
      ctx.fillStyle = b.bg;
      ctx.beginPath();
      ctx.roundRect(badgeX, currentY, bW, bH, 15);
      ctx.fill();

      // pill border
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 1;
      ctx.stroke();

      // pill text
      ctx.fillStyle = b.color;
      ctx.fillText(b.text, badgeX + 12, currentY + 20);

      badgeX += bW + 12;
    });

    // 6. Footer
    ctx.fillStyle = '#52525b';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Vypočteno rodinnou kalkulačkou dle NOZ ČR (zákon č. 89/2012 Sb.)', 44, height - 36);

    // Trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (resolved.name || 'vztah').replace(/\s+/g, '_').toLowerCase();
      link.download = `rodina-${safeName}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      this.showToast('🖼️ Kartička stažena jako PNG!');
    }, 'image/png');
  }

  // === Inheritance Modal (Dědické třídy dle NOZ) ===
  openInheritanceModal() {
    this.triggerHaptic();
    const dict = getDictionary(this.currentLang);
    const activeChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(activeChain, this.egoGender, dict);
    const inh = resolved.inheritance || { class: null, title: 'Mimo zákonnou posloupnost', description: 'Není v 1.–6. dědické třídě.', badge: 'Mimo dědické třídy' };

    const classesInfo = [
      { num: 1, title: '1. dědická třída (§ 1635 NOZ)', who: 'Děti zůstavitele a manžel/partner', share: 'Každý rovným dílem. Nedědí-li dítě, podíl připadá jeho dětem (vnukům).' },
      { num: 2, title: '2. dědická třída (§ 1636 NOZ)', who: 'Manžel/partner, rodiče a spolužijící osoby', share: 'Manžel vždy nejméně polovinu pozůstalosti.' },
      { num: 3, title: '3. dědická třída (§ 1637 NOZ)', who: 'Sourozenci zůstavitele a spolužijící osoby', share: 'Rovným dílem. Nedědí-li sourozenec, nastupují jeho děti (synovci/neteře).' },
      { num: 4, title: '4. dědická třída (§ 1638 NOZ)', who: 'Prarodiče zůstavitele', share: 'Každý dědí rovným dílem.' },
      { num: 5, title: '5. dědická třída (§ 1639 NOZ)', who: 'Prarodiče rodičů zůstavitele (praprarodiče)', share: 'Polovina připadá prarodičům otce, polovina prarodičům matky.' },
      { num: 6, title: '6. dědická třída (§ 1640 NOZ)', who: 'Děti dětí sourozenců (prasynovci/prasneteře) a děti prarodičů (strýcové a tety)', share: 'Pokud strýc/teta nedědí, jejich děti (bratranci/sestřenice).' }
    ];

    let html = `
      <div class="legal-summary-card">
        <div class="legal-summary-badge ${inh.class ? 'highlight' : ''}">${inh.badge}</div>
        <div class="legal-summary-title">Aktuální vztah: <strong>${resolved.name}</strong></div>
        <div class="legal-summary-desc">${inh.description}</div>
      </div>
      <h3 style="margin: 16px 0 8px; font-size: 15px; color: var(--text-secondary);">Zákonná posloupnost podle občanského zákoníku:</h3>
      <div class="inheritance-classes-list">
    `;

    classesInfo.forEach((c) => {
      const isCurrent = inh.class === c.num;
      html += `
        <div class="inheritance-class-card ${isCurrent ? 'active-class' : ''}">
          <div class="class-card-header">
            <span class="class-num">${c.num}.</span>
            <strong>${c.title}</strong>
            ${isCurrent ? '<span class="class-match-tag">🌟 Váš výpočet</span>' : ''}
          </div>
          <div class="class-card-who"><strong>Kdo dědí:</strong> ${c.who}</div>
          <div class="class-card-share"><strong>Pravidlo:</strong> ${c.share}</div>
        </div>
      `;
    });

    html += `</div>`;
    this.inheritanceModalBody.innerHTML = html;
    this.inheritanceModal.classList.add('open');
  }

  closeInheritanceModal() {
    this.inheritanceModal.classList.remove('open');
  }

  // === Marriage Impediment Modal (§ 675 NOZ) ===
  openImpedimentModal() {
    this.triggerHaptic();
    const dict = getDictionary(this.currentLang);
    const activeChain = this.isMutualView ? invertChain(this.chain, this.egoGender) : this.chain;
    const resolved = resolveKinship(activeChain, this.egoGender, dict);
    const imp = resolved.marriageImpediment || { allowed: true, reason: 'Příbuzenský vztah nebrání uzavření manželství.', badge: 'Sňatek možný' };

    let html = `
      <div class="legal-summary-card ${imp.allowed ? 'allowed' : 'blocked'}">
        <div class="legal-summary-badge ${imp.allowed ? 'badge-impediment-allowed' : 'badge-impediment-blocked'}">${imp.badge}</div>
        <div class="legal-summary-title">Vztah: <strong>${resolved.name}</strong></div>
        <div class="legal-summary-desc">${imp.reason}</div>
      </div>

      <div class="law-article-box" style="margin-top: 16px; padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; font-size: 13px; line-height: 1.6; color: var(--text-secondary);">
        <strong style="color: var(--text-primary); display: block; margin-bottom: 6px;">📜 § 675 Občanského zákoníku (zákon č. 89/2012 Sb.):</strong>
        <em>„Manželství nemůže být uzavřeno mezi předky a potomky, ani mezi sourozenci; totéž platí o osobách, jejichž příbuzenství vzniklo osvojením.“</em>
        <div style="margin-top: 10px; color: #a1a1aa;">
          💡 <strong>Zajímavost z české genealogie a práva:</strong> Mezi bratrancem a sestřenicí (4. stupeň pobočné linie), stejně jako mezi strýcem a neteří (3. stupeň pobočné linie) <u>není sňatek zákonem zakázán</u>, jelikož se nejedná o linii přímou ani sourozence.
        </div>
      </div>
    `;

    this.impedimentModalBody.innerHTML = html;
    this.impedimentModal.classList.add('open');
  }

  closeImpedimentModal() {
    this.impedimentModal.classList.remove('open');
  }

  // === Voice Recognition (Web Speech API) ===
  openVoiceModal() {
    this.triggerHaptic();
    this.voiceModal.classList.add('open');
    this.startVoiceRecognition();
  }

  closeVoiceModal() {
    this.stopVoiceRecognition();
    this.voiceModal.classList.remove('open');
  }

  startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.voiceStatusText.textContent = 'Váš prohlížeč nepodporuje Web Speech API.';
      return;
    }

    if (this.recognition) {
      try { this.recognition.abort(); } catch (e) {}
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'cs-CZ';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.voiceMicCircle.classList.add('listening');
    this.voiceStatusText.textContent = 'Poslouchám... Mluvte (např. otec sestra syn)';

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ')
        .toLowerCase();

      this.voiceTranscriptBox.textContent = `„${transcript}“`;

      if (event.results[0].isFinal) {
        this.processVoiceTranscript(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      this.voiceMicCircle.classList.remove('listening');
      this.voiceStatusText.textContent = `Chyba rozpoznávání: ${event.error}`;
    };

    this.recognition.onend = () => {
      this.voiceMicCircle.classList.remove('listening');
      if (this.voiceStatusText.textContent.includes('Poslouchám')) {
        this.voiceStatusText.textContent = 'Zadávání dokončeno. Klepněte na mikrofon pro nový poslech.';
      }
    };

    try {
      this.recognition.start();
    } catch (e) {}
  }

  stopVoiceRecognition() {
    if (this.recognition) {
      try { this.recognition.abort(); } catch (e) {}
    }
    if (this.voiceMicCircle) this.voiceMicCircle.classList.remove('listening');
  }

  processVoiceTranscript(transcript) {
    const wordMap = {
      'otec': TOKENS.FATHER, 'táta': TOKENS.FATHER, 'taťka': TOKENS.FATHER, 'father': TOKENS.FATHER,
      'matka': TOKENS.MOTHER, 'máma': TOKENS.MOTHER, 'mamka': TOKENS.MOTHER, 'mother': TOKENS.MOTHER,
      'syn': TOKENS.SON, 'son': TOKENS.SON,
      'dcera': TOKENS.DAUGHTER, 'daughter': TOKENS.DAUGHTER,
      'bratr': TOKENS.BROTHER, 'brácha': TOKENS.BROTHER, 'brother': TOKENS.BROTHER,
      'sestra': TOKENS.SISTER, 'ségra': TOKENS.SISTER, 'sister': TOKENS.SISTER,
      'manžel': TOKENS.HUSBAND, 'husband': TOKENS.HUSBAND,
      'manželka': TOKENS.WIFE, 'žena': TOKENS.WIFE, 'wife': TOKENS.WIFE,
      'macecha': TOKENS.STEP_MOTHER, 'otčím': TOKENS.STEP_FATHER,
      'nevlastní bratr': TOKENS.STEP_BROTHER, 'nevlastní sestra': TOKENS.STEP_SISTER,
      'kmotr': TOKENS.GOD_FATHER, 'kmotra': TOKENS.GOD_MOTHER,
      'děda': [TOKENS.FATHER, TOKENS.FATHER], 'babička': [TOKENS.FATHER, TOKENS.MOTHER],
      'strýc': [TOKENS.FATHER, TOKENS.BROTHER], 'teta': [TOKENS.FATHER, TOKENS.SISTER],
      'bratranec': [TOKENS.FATHER, TOKENS.BROTHER, TOKENS.SON], 'sestřenice': [TOKENS.FATHER, TOKENS.BROTHER, TOKENS.DAUGHTER]
    };

    const words = transcript.split(/\s+/);
    const addedTokens = [];

    for (let i = 0; i < words.length; i++) {
      const w2 = i < words.length - 1 ? `${words[i]} ${words[i + 1]}` : null;
      if (w2 && wordMap[w2]) {
        const val = wordMap[w2];
        if (Array.isArray(val)) addedTokens.push(...val);
        else addedTokens.push(val);
        i++;
        continue;
      }
      const w1 = words[i];
      if (wordMap[w1]) {
        const val = wordMap[w1];
        if (Array.isArray(val)) addedTokens.push(...val);
        else addedTokens.push(val);
      }
    }

    if (addedTokens.length > 0) {
      this.chain.push(...addedTokens);
      this.render();
      this.showToast(`Hlasem přidáno: ${addedTokens.length} vztahů`);
      setTimeout(() => this.closeVoiceModal(), 1200);
    } else {
      this.voiceStatusText.textContent = 'Nerozpoznán žádný známý rodinný výraz. Zkuste to znovu.';
    }
  }

  // === Compare Two Persons Modal ===
  openCompareModal() {
    this.triggerHaptic();

    const commonRel = [
      { label: 'Otec', chain: [TOKENS.FATHER] },
      { label: 'Matka', chain: [TOKENS.MOTHER] },
      { label: 'Bratr', chain: [TOKENS.BROTHER] },
      { label: 'Sestra', chain: [TOKENS.SISTER] },
      { label: 'Syn', chain: [TOKENS.SON] },
      { label: 'Dcera', chain: [TOKENS.DAUGHTER] },
      { label: 'Dědeček (otec otce)', chain: [TOKENS.FATHER, TOKENS.FATHER] },
      { label: 'Babička (matka otce)', chain: [TOKENS.FATHER, TOKENS.MOTHER] },
      { label: 'Strýc (bratr otce)', chain: [TOKENS.FATHER, TOKENS.BROTHER] },
      { label: 'Teta (sestra matky)', chain: [TOKENS.MOTHER, TOKENS.SISTER] },
      { label: 'Bratranec (syn strýce)', chain: [TOKENS.FATHER, TOKENS.BROTHER, TOKENS.SON] },
      { label: 'Sestřenice (dcera tety)', chain: [TOKENS.MOTHER, TOKENS.SISTER, TOKENS.DAUGHTER] },
      { label: 'Vnuk (syn syna)', chain: [TOKENS.SON, TOKENS.SON] },
      { label: 'Vnučka (dcera dcery)', chain: [TOKENS.DAUGHTER, TOKENS.DAUGHTER] },
      { label: 'Aktuální kalkulačka', chain: this.chain.length > 0 ? [...this.chain] : null }
    ].filter((r) => r.chain !== null);

    const renderOptions = (selectEl, defaultIdx) => {
      selectEl.innerHTML = '';
      commonRel.forEach((rel, idx) => {
        const opt = document.createElement('option');
        opt.value = rel.chain.join(',');
        opt.textContent = rel.label;
        if (idx === defaultIdx) opt.selected = true;
        selectEl.appendChild(opt);
      });
    };

    renderOptions(this.comparePersonA, 0);
    renderOptions(this.comparePersonB, Math.min(10, commonRel.length - 1));

    this.compareResultCard.style.display = 'none';
    this.compareModal.classList.add('open');
  }

  closeCompareModal() {
    this.compareModal.classList.remove('open');
  }

  executeCompare() {
    this.triggerHaptic();
    const chainA = this.comparePersonA.value.split(',').filter(Boolean);
    const chainB = this.comparePersonB.value.split(',').filter(Boolean);
    const dict = getDictionary(this.currentLang);

    const egoGender = this.egoGender;
    const invA = invertChain(chainA, egoGender);
    const combinedChain = [...invA, ...chainB];

    const resolved = resolveKinship(combinedChain, 'm', dict);

    const nameA = this.comparePersonA.options[this.comparePersonA.selectedIndex].text;
    const nameB = this.comparePersonB.options[this.comparePersonB.selectedIndex].text;

    this.compareResultTitle.textContent = `${nameB} je pro ${nameA}:`;
    this.compareResultDesc.innerHTML = `
      <div style="font-size: 24px; font-weight: 700; color: #fff; margin: 8px 0;">${resolved.name}</div>
      <div style="font-size: 14px; color: var(--text-secondary);">${resolved.description || ''}</div>
      <div style="margin-top: 8px; font-size: 13px; color: #a78bfa;">🔗 Propojení přes rodokmen: ${invA.map((t) => dict.labels.tokens[t] || t).join(' ➔ ')} ➔ ${chainB.map((t) => dict.labels.tokens[t] || t).join(' ➔ ')}</div>
    `;
    this.compareResultCard.style.display = 'block';
  }

  // === Support / Donate Modal ===
  openDonateModal() {
    this.triggerHaptic();
    if (this.donateModal) this.donateModal.classList.add('open');
  }

  closeDonateModal() {
    if (this.donateModal) this.donateModal.classList.remove('open');
  }

  // === Shortcuts Modal ===
  openShortcutsModal() {
    this.triggerHaptic();
    if (this.shortcutsModal) this.shortcutsModal.classList.add('open');
  }

  closeShortcutsModal() {
    if (this.shortcutsModal) this.shortcutsModal.classList.remove('open');
  }

  // === GEDCOM Import & Analysis ===
  openGedcomModal() {
    this.triggerHaptic();
    if (this.gedcomModal) this.gedcomModal.classList.add('open');
  }

  closeGedcomModal() {
    if (this.gedcomModal) this.gedcomModal.classList.remove('open');
  }

  handleGedcomFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      this.loadGedcomText(text, file.name);
    };
    reader.readAsText(file, 'utf-8');
  }

  loadSampleGedcom() {
    this.triggerHaptic();
    const SAMPLE_GEDCOM = `
0 HEAD
1 SOUR FamilyCalc
0 @I1@ INDI
1 NAME Jan /Novák/
1 SEX M
1 BIRT
2 DATE 1918
1 FAMS @F1@
0 @I2@ INDI
1 NAME Marie /Nováková/
1 SEX F
1 BIRT
2 DATE 1922
1 FAMS @F1@
0 @I3@ INDI
1 NAME Josef /Novák/
1 SEX M
1 BIRT
2 DATE 1945
1 FAMC @F1@
1 FAMS @F2@
0 @I4@ INDI
1 NAME Václav /Novák/
1 SEX M
1 BIRT
2 DATE 1948
1 FAMC @F1@
1 FAMS @F3@
0 @I5@ INDI
1 NAME Eva /Svobodová/
1 SEX F
1 BIRT
2 DATE 1952
1 FAMC @F1@
0 @I6@ INDI
1 NAME Hana /Nováková/
1 SEX F
1 BIRT
2 DATE 1947
1 FAMS @F2@
0 @I7@ INDI
1 NAME Tomáš /Novák/
1 SEX M
1 BIRT
2 DATE 1974
1 FAMC @F2@
1 FAMS @F4@
0 @I8@ INDI
1 NAME Kateřina /Dvořáková/
1 SEX F
1 BIRT
2 DATE 1978
1 FAMC @F2@
0 @I9@ INDI
1 NAME Martin /Novák/
1 SEX M
1 BIRT
2 DATE 1976
1 FAMC @F3@
0 @I10@ INDI
1 NAME Lenka /Nováková/
1 SEX F
1 BIRT
2 DATE 1977
1 FAMS @F4@
0 @I11@ INDI
1 NAME Jakub /Novák/
1 SEX M
1 BIRT
2 DATE 2004
1 FAMC @F4@
0 @I12@ INDI
1 NAME Tereza /Nováková/
1 SEX F
1 BIRT
2 DATE 2007
1 FAMC @F4@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
1 CHIL @I4@
1 CHIL @I5@
0 @F2@ FAM
1 HUSB @I3@
1 WIFE @I6@
1 CHIL @I7@
1 CHIL @I8@
0 @F3@ FAM
1 HUSB @I4@
1 CHIL @I9@
0 @F4@ FAM
1 HUSB @I7@
1 WIFE @I10@
1 CHIL @I11@
1 CHIL @I12@
0 TRLR
`;
    this.loadGedcomText(SAMPLE_GEDCOM, 'Ukázkový rodokmen Novákovi (4 generace)');
  }

  loadGedcomText(text, sourceName) {
    try {
      const parsed = parseGedcom(text);
      if (parsed.individuals.size === 0) {
        this.gedcomStatusBox.textContent = `V souboru ${sourceName} nebyly nalezeny žádné osoby.`;
        return;
      }
      this.activeGedcom = parsed;
      const list = parsed.getIndividualList();

      this.gedcomStatusBox.innerHTML = `
        <strong style="color: #10b981;">✓ Úspěšně načteno:</strong> ${sourceName}<br>
        Celkem <strong>${parsed.individuals.size}</strong> osob v <strong>${parsed.families.size}</strong> rodinách.
      `;

      const fillSelect = (selectEl, defaultId) => {
        selectEl.innerHTML = '';
        list.forEach((item) => {
          const opt = document.createElement('option');
          opt.value = item.id;
          opt.textContent = item.label;
          if (item.id === defaultId) opt.selected = true;
          selectEl.appendChild(opt);
        });
      };

      const defaultA = list[0] ? list[0].id : '';
      const defaultB = list[list.length - 1] ? list[list.length - 1].id : defaultA;

      fillSelect(this.gedcomPersonA, defaultA);
      fillSelect(this.gedcomPersonB, defaultB);

      this.gedcomSelectSection.style.display = 'flex';
      this.gedcomResultCard.style.display = 'none';
      this.showToast(`Rodokmen načten: ${parsed.individuals.size} osob`);
    } catch (err) {
      this.gedcomStatusBox.textContent = `Chyba při čtení souboru: ${err.message}`;
    }
  }

  executeGedcomKinship() {
    this.triggerHaptic();
    if (!this.activeGedcom) return;

    const idA = this.gedcomPersonA.value;
    const idB = this.gedcomPersonB.value;
    const personA = this.activeGedcom.individuals.get(idA);
    const personB = this.activeGedcom.individuals.get(idB);

    if (!personA || !personB) return;

    const pathResult = this.activeGedcom.findKinshipChain(idA, idB);

    if (pathResult.error || !pathResult.chain) {
      this.gedcomResultTitle.textContent = `${personB.name} a ${personA.name}`;
      this.gedcomResultDesc.innerHTML = `<span style="color: #ef4444;">${pathResult.error || 'Nepropojeno'}</span>`;
      this.transferGedcomBtn.style.display = 'none';
      if (this.viewGedcomTreeBtn) this.viewGedcomTreeBtn.style.display = 'none';
      this.gedcomResultCard.style.display = 'block';
      return;
    }

    const dict = getDictionary(this.currentLang);
    const resolved = resolveKinship(pathResult.chain, personA.sex === 'F' ? 'f' : 'm', dict);
    const personsInPath = pathResult.pathPersons.map((pId) => this.activeGedcom.individuals.get(pId));
    this.gedcomKinshipResult = { chain: pathResult.chain, resolved, personA, personB, pathPersons: pathResult.pathPersons, personsInPath };

    // Zjistíme duplicitní jména v cestě pro rozlišení (např. Ladislav Červinka ml. vs st.)
    const nameCounts = {};
    personsInPath.forEach((p) => {
      if (p && p.name) {
        nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
      }
    });

    const pathHtmlParts = [];
    for (let i = 0; i < pathResult.pathPersons.length; i++) {
      const p = personsInPath[i];
      let years = '';
      if (p) {
        if (p.birthYear && p.deathYear) {
          years = ` (${p.birthYear}–${p.deathYear})`;
        } else if (p.birthYear) {
          years = ` (*${p.birthYear})`;
        } else if (p.deathYear) {
          years = ` (†${p.deathYear})`;
        }
      }

      let disambig = '';
      if (p && nameCounts[p.name] > 1 && !years) {
        disambig = i === 1 ? ' (starší)' : ' (mladší)';
      }

      const pDisplayName = p ? `${p.name}${years}${disambig}` : pathResult.pathPersons[i];
      const isStart = i === 0;
      const isTarget = i === pathResult.pathPersons.length - 1;
      const nodeClass = isStart ? 'node-start' : isTarget ? 'node-target' : '';

      pathHtmlParts.push(`<span class="gedcom-path-node ${nodeClass}">${pDisplayName}</span>`);

      if (i < pathResult.chain.length) {
        const token = pathResult.chain[i];
        const step = getStepDirection(token);
        const tokenLabel = (dict.labels && dict.labels.tokens && dict.labels.tokens[token]) || token;
        const arrowClass = step.genShift > 0 ? 'gedcom-arrow-up' : step.genShift < 0 ? 'gedcom-arrow-down' : 'gedcom-arrow-same';

        pathHtmlParts.push(
          `<span class="gedcom-path-edge" title="${tokenLabel}">` +
          `<span class="${arrowClass}">${step.arrow}</span> ` +
          `<span class="gedcom-edge-label">${tokenLabel}</span>` +
          `</span>`
        );
      }
    }

    const stepWord = pathResult.chain.length === 1 ? 'krok' : pathResult.chain.length < 5 ? 'kroky' : 'kroků';
    this.gedcomResultTitle.textContent = `${personB.name} je pro ${personA.name}:`;
    this.gedcomResultDesc.innerHTML = `
      <div style="font-size: 24px; font-weight: 700; color: #fff; margin: 8px 0;">${resolved.name}</div>
      <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">${resolved.description || ''}</div>
      <div style="font-size: 12px; color: #a78bfa; font-weight: 600; margin-bottom: 4px;">🔗 Genealogická cesta (${pathResult.chain.length} ${stepWord}):</div>
      <div class="gedcom-path-flow">${pathHtmlParts.join('')}</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        ${resolved.consanguinity && resolved.consanguinity.badge ? `<span class="meta-badge badge-consanguinity">${resolved.consanguinity.badge}</span>` : ''}
        ${resolved.inheritance && resolved.inheritance.badge ? `<span class="meta-badge badge-inheritance">${resolved.inheritance.badge}</span>` : ''}
        ${resolved.marriageImpediment && resolved.marriageImpediment.badge ? `<span class="meta-badge ${resolved.marriageImpediment.allowed ? 'badge-impediment-allowed' : 'badge-impediment-blocked'}">${resolved.marriageImpediment.badge}</span>` : ''}
      </div>
    `;
    this.transferGedcomBtn.style.display = 'block';
    if (this.viewGedcomTreeBtn) this.viewGedcomTreeBtn.style.display = 'block';
    this.gedcomResultCard.style.display = 'block';
  }

  transferGedcomToCalculator() {
    this.triggerHaptic();
    if (!this.gedcomKinshipResult || !this.gedcomKinshipResult.chain) return;

    this.chain = [...this.gedcomKinshipResult.chain];
    this.isMutualView = false;
    this.egoGender = this.gedcomKinshipResult.personA.sex === 'F' ? 'f' : 'm';

    // Metadata přeneseného rodokmenu pro vizuální minirodokmen (#treeModal)
    this.gedcomPathMeta = {
      personA: this.gedcomKinshipResult.personA,
      personB: this.gedcomKinshipResult.personB,
      personsInPath: this.gedcomKinshipResult.personsInPath ? [...this.gedcomKinshipResult.personsInPath] : [],
      originalChain: [...this.gedcomKinshipResult.chain]
    };

    this.updateGenderUI();
    this.closeGedcomModal();
    this.render();
    this.showToast(`Přenoseno do kalkulačky: ${this.gedcomKinshipResult.resolved.name}`);
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Mobile / Fullscreen / Native App detection
  const isCapacitor = Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  if (isCapacitor || isStandalone || isMobile) {
    document.body.classList.add('is-mobile-fullscreen');
    document.body.classList.add('is-mobile-device');
  }

  // Attempt JS screen orientation lock to portrait
  try {
    if (screen.orientation && typeof screen.orientation.lock === 'function') {
      screen.orientation.lock('portrait').catch(() => {});
    }
  } catch (e) {}

  window.app = new FamilyCalcApp();

  // Register service worker if available
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
