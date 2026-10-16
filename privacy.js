/* Typing Speed Hub: optional Analytics consent. Not an advertising TCF CMP. */
(function () {
  'use strict';
  if (window.TSHPrivacy) return;
  const script = document.currentScript;
  const measurementId = script && script.dataset.analytics;
  const privacyUrl = new URL('../privacy-policy.html', script.src).href;
  const KEY = 'tsh_privacy_choice_v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  let state = readChoice();
  let loaded = false;
  let dialog, checkbox, status, launcher, focusBefore;

  function readChoice() {
    try {
      const item = JSON.parse(localStorage.getItem(KEY));
      if (item && item.version === 1 && typeof item.analytics === 'boolean' &&
          Number.isFinite(item.savedAt) && item.savedAt <= Date.now() &&
          Date.now() - item.savedAt < MAX_AGE) return item;
    } catch (_) { /* No persistence: optional services remain denied. */ }
    return null;
  }
  const granted = () => !!(state && state.analytics);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window['ga-disable-G-68ZVCW4FWK'] = !granted();
  window.gtag('consent', 'default', {
    analytics_storage: granted() ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });

  function eraseAnalyticsCookies() {
    const domains = [null];
    const parts = location.hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (entry) {
      const name = entry.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gac_)/.test(name)) return;
      const paths = new Set(['/']);
      const segments = location.pathname.split('/');
      for (let i = 1; i < segments.length; i++) paths.add(segments.slice(0, i).join('/') + '/');
      domains.forEach(function (domain) {
        paths.forEach(function (path) {
          document.cookie = name + '=; Max-Age=0; path=' + path +
            (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
        });
      });
    });
  }
  function loadAnalytics() {
    if (!granted() || loaded || !/^G-[A-Z0-9]+$/.test(measurementId || '')) return;
    loaded = true;
    window['ga-disable-' + measurementId] = false;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: MAX_AGE / 1000,
      cookie_update: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    tag.id = 'tsh-analytics-tag';
    document.head.appendChild(tag);
  }
  function saveChoice(value) {
    const wasGranted = granted();
    state = {version: 1, analytics: !!value, savedAt: Date.now()};
    let persistent = true;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { persistent = false; }
    window['ga-disable-G-68ZVCW4FWK'] = !granted();
    window.gtag('consent', 'update', {
      analytics_storage: granted() ? 'granted' : 'denied',
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
    });
    if (!granted()) eraseAnalyticsCookies();
    if (granted()) loadAnalytics();
    closeSettings();
    status.textContent = persistent ? text.saved : text.temporary;
    // End an already loaded Analytics script after withdrawal.
    if (wasGranted && !granted() && loaded) location.reload();
  }
  const language = new URL(location.href).searchParams.get('lang') || document.documentElement.lang;
  const translations = {
    en: {title:'Privacy choices', intro:'Your typing tools work without optional analytics. Choose whether to allow Google Analytics to measure visits on pages that use it. Advertising is not loaded by this version of the site.', necessary:'Site functions', necessaryText:'Your browser keeps practice results and lesson progress for the tools you use. We also remember this privacy choice for up to 180 days. These are separate from optional analytics.', analytics:'Allow Google Analytics', analyticsText:'Optional visit statistics sent to Google. Analytics is not loaded before you opt in. Your typed practice text and saved scores are not deliberately sent as Analytics events.', reject:'Reject analytics', accept:'Accept analytics', save:'Save choice', close:'Close', settings:'Privacy settings', policy:'Read the Privacy Policy', saved:'Privacy choice saved.', temporary:'Choice applied for this page. Browser storage is unavailable; you may be asked again.'},
    hu: {title:'Adatvédelmi beállítások', intro:'A gépelési eszközök opcionális analitika nélkül is működnek. Eldöntheted, engedélyezed-e a Google Analytics látogatottságmérését az azt használó oldalakon. Ez a verzió nem tölt be hirdetéseket.', necessary:'Az oldal funkciói', necessaryText:'A böngésződ tárolja a használt gyakorlók eredményeit és a leckék állapotát. Ezt az adatvédelmi választást legfeljebb 180 napig jegyezzük meg. Ezek elkülönülnek az opcionális analitikától.', analytics:'Google Analytics engedélyezése', analyticsText:'Opcionális látogatottsági adatok küldése a Google részére. Az analitika csak elfogadás után töltődik be. A begépelt gyakorlószöveget és a mentett pontszámokat nem küldjük külön Analytics-eseményként.', reject:'Analitika elutasítása', accept:'Analitika elfogadása', save:'Választás mentése', close:'Bezárás', settings:'Adatvédelem', policy:'Adatvédelmi tájékoztató', saved:'Adatvédelmi választás mentve.', temporary:'A választás erre az oldalra érvényes. A böngészős tárolás nem elérhető, ezért újra kérdezhetjük.'},
    de: {title:'Datenschutzeinstellungen', intro:'Die Tippwerkzeuge funktionieren ohne optionale Analyse. Entscheiden Sie, ob Google Analytics auf Seiten, die es verwenden, Besuche messen darf. Diese Version lädt keine Werbung.', necessary:'Website-Funktionen', necessaryText:'Ihr Browser speichert Übungsergebnisse und den Lektionsfortschritt für die verwendeten Werkzeuge. Diese Datenschutzauswahl wird bis zu 180 Tage gespeichert, getrennt von optionaler Analyse.', analytics:'Google Analytics erlauben', analyticsText:'Optionale Besuchsstatistiken werden an Google gesendet. Analytics wird erst nach Zustimmung geladen. Übungstexte und gespeicherte Ergebnisse werden nicht gezielt als Analytics-Ereignisse gesendet.', reject:'Analyse ablehnen', accept:'Analyse akzeptieren', save:'Auswahl speichern', close:'Schließen', settings:'Datenschutz', policy:'Datenschutzerklärung lesen', saved:'Auswahl gespeichert.', temporary:'Auswahl für diese Seite angewendet. Browserspeicherung ist nicht verfügbar; wir fragen eventuell erneut.'}
  };
  const text = translations[language] || translations.en;
  function openSettings() {
    focusBefore = document.activeElement;
    checkbox.checked = granted();
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('[data-reject]').focus();
  }
  function closeSettings() {
    if (dialog && dialog.open) dialog.close();
  }
  function init() {
    const style = document.createElement('style');
    style.textContent = '#tsh-privacy-dialog{box-sizing:border-box;width:min(94vw,620px);max-height:88vh;overflow:auto;border:1px solid #66ff99;border-radius:14px;padding:24px;background:#151b17;color:#effff4;font:16px/1.55 Arial,sans-serif;text-align:left;box-shadow:0 8px 50px #0009}#tsh-privacy-dialog::backdrop{background:#0009}#tsh-privacy-dialog h2{color:#a8ffca;font-size:1.45rem;margin:0 0 12px}#tsh-privacy-dialog h3{color:#a8ffca;font-size:1.05rem;margin:16px 0 5px}#tsh-privacy-dialog p{font-size:1rem;margin:8px 0}#tsh-privacy-dialog label{display:flex;gap:10px;align-items:center;color:#effff4;font-weight:bold;margin:16px 0 6px}#tsh-privacy-dialog input{width:20px;height:20px;flex:none;accent-color:#66ff99}#tsh-privacy-dialog .tsh-actions{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 10px}#tsh-privacy-dialog button,#tsh-privacy-launcher{box-sizing:border-box;min-width:0;width:auto;font:600 15px/1.35 Arial,sans-serif;border:1px solid #a8ffca;border-radius:8px;background:#1d3325;color:#effff4;padding:11px 14px;cursor:pointer;margin:0;box-shadow:none}#tsh-privacy-dialog button:hover,#tsh-privacy-launcher:hover{background:#2d4d39;color:#fff}#tsh-privacy-dialog button:focus-visible,#tsh-privacy-launcher:focus-visible{outline:3px solid #fff;outline-offset:3px}#tsh-privacy-dialog a{color:#a8ffca}#tsh-privacy-launcher{position:fixed;bottom:12px;left:12px;z-index:10000;font-size:13px;padding:8px 11px}#tsh-privacy-status{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%)}';
    document.head.appendChild(style);
    launcher = document.createElement('button');
    launcher.id = 'tsh-privacy-launcher'; launcher.type = 'button'; launcher.textContent = text.settings;
    launcher.setAttribute('aria-haspopup', 'dialog'); launcher.addEventListener('click', openSettings);
    document.body.appendChild(launcher);
    status = document.createElement('span'); status.id = 'tsh-privacy-status'; status.setAttribute('role', 'status'); document.body.appendChild(status);
    dialog = document.createElement('dialog'); dialog.id = 'tsh-privacy-dialog'; dialog.setAttribute('aria-labelledby', 'tsh-privacy-title');
    dialog.innerHTML = '<h2 id="tsh-privacy-title"></h2><p data-intro></p><h3 data-necessary></h3><p data-necessary-text></p><label><input type="checkbox" id="tsh-analytics-choice"><span data-label></span></label><p data-analytics-text></p><div class="tsh-actions"><button type="button" data-reject></button><button type="button" data-accept></button><button type="button" data-save></button></div><p><a data-policy></a> · <button type="button" data-close></button></p>';
    const fill = (selector, value) => { dialog.querySelector(selector).textContent = value; };
    fill('h2',text.title);fill('[data-intro]',text.intro);fill('[data-necessary]',text.necessary);fill('[data-necessary-text]',text.necessaryText);fill('[data-label]',text.analytics);fill('[data-analytics-text]',text.analyticsText);fill('[data-reject]',text.reject);fill('[data-accept]',text.accept);fill('[data-save]',text.save);fill('[data-close]',text.close);fill('[data-policy]',text.policy);
    dialog.querySelector('[data-policy]').href = privacyUrl;
    checkbox = dialog.querySelector('input');
    dialog.querySelector('[data-reject]').addEventListener('click',() => saveChoice(false));
    dialog.querySelector('[data-accept]').addEventListener('click',() => saveChoice(true));
    dialog.querySelector('[data-save]').addEventListener('click',() => saveChoice(checkbox.checked));
    dialog.querySelector('[data-close]').addEventListener('click',closeSettings);
    dialog.addEventListener('close',() => { if (focusBefore && focusBefore.isConnected) focusBefore.focus(); else launcher.focus(); });
    document.body.appendChild(dialog);
    if (!granted()) eraseAnalyticsCookies();
    loadAnalytics();
    if (!state) openSettings();
  }
  window.TSHPrivacy = Object.freeze({open: openSettings});
  window.addEventListener('storage',function (event) { if (event.key === KEY || event.key === null) location.reload(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
