(function () {
  'use strict';
  var strings = {
    en: { navHome:'Home',navEdit:'Edit',navCaptions:'Captions',navLibrary:'Roadmap',projectInfo:'Project information',refresh:'Refresh',status:'Status',connecting:'Connecting…',quickStart:'Quick start',quickStartText:'Select clips or layers in the host timeline, then use Edit. Subtitle tools work with text you provide.',safetyNote:'Save a project copy before applying changes. Use the host application\'s Undo if needed.',speedControl:'Speed control',speedDescription:'Apply a constant speed change to selected clips (Premiere) or selected layer stretch (After Effects).',apply:'Apply',aeTools:'After Effects tools',textLayer:'Text layer',addText:'Add text',solidLayer:'Solid layer',addSolid:'Add solid',fadeIn:'Fade selected layers in (seconds)',aeNote:'These operations apply only to an active After Effects composition and are grouped in Undo.',featureStatus:'Feature status',featureStatusText:'Host-specific tools are under active development; feel free to test speed and layer helpers on a duplicate project before shipping work.',subtitleTool:'Manual subtitle helper',subtitleDescription:'Paste a transcript. It will be split into short caption cues and exported as an SRT file. No automatic transcription or translation is performed.',transcript:'Transcript',wordsPerCaption:'Words per caption',secondsPerCaption:'Seconds per caption',downloadSrt:'Generate and download SRT',captionNote:'Review timing and text before importing the SRT into your editing project.',library:'Feature roadmap',ready:'Ready',error:'Error',project:'Project',host:'Host',sequence:'Sequence',composition:'Composition',resolution:'Resolution',duration:'Duration',fps:'Frame rate',noProject:'No active project or sequence/composition.',speedApplied:'Speed operation completed.',srtDownloaded:'SRT downloaded. Check caption timing.',emptyTranscript:'Enter transcript text first.',noCep:'Open the panel inside an Adobe CEP host.',roadmapImplemented:'Implemented foundation',roadmapPlanned:'Planned',roadmapResearch:'Research'},
    az: { navHome:'Ana səhifə',navEdit:'Montaj',navCaptions:'Altyazı',navLibrary:'Yol xəritəsi',projectInfo:'Layihə məlumatı',refresh:'Yenilə',status:'Vəziyyət',connecting:'Qoşulur…',quickStart:'Başlanğıc',quickStartText:'Host timeline-da klip və ya layer seçin, sonra Montaj bölməsindən istifadə edin. Altyazı aləti daxil etdiyiniz mətnlə işləyir.',safetyNote:'Dəyişiklik etməzdən əvvəl layihənin surətini saxlayın. Lazım gələrsə host tətbiqində Undo edin.',speedControl:'Sürət idarəsi',speedDescription:'Seçilmiş Premiere kliplərinə və ya After Effects layer-lərinə sabit dəyişiklik tətbiq edir.',apply:'Tətbiq et',aeTools:'After Effects alətləri',textLayer:'Mətn layer-i',addText:'Mətn əlavə et',solidLayer:'Solid layer',addSolid:'Solid əlavə et',fadeIn:'Seçilmiş layer-lərə fade-in (saniyə)',aeNote:'Bu əməliyyatlar yalnız aktiv After Effects kompozisiyasında işləyir və Undo qrupu yaradır.',featureStatus:'Funksiyaların vəziyyəti',featureStatusText:'Host-a məxsus alətlər hazırlanır; işə başlamazdan əvvəl köhnə layihənin surətini saxlayın və dəqiq test edin.',subtitleTool:'Əl ilə altyazı köməkçisi',subtitleDescription:'Transkripti yapışdırın. Mətn qısa altyazı hissələrinə bölünərək SRT faylı kimi endiriləcək. Avtomatik transkripsiya və tərcümə etmir.',transcript:'Transkript',wordsPerCaption:'Altyazıda söz sayı',secondsPerCaption:'Altyazı müddəti (saniyə)',downloadSrt:'SRT yarat və endir',captionNote:'SRT faylını layihəyə əlavə etməzdən əvvəl mətn və vaxtları yoxlayın.',library:'Funksiyaların yol xəritəsi',ready:'Hazırdır',error:'Xəta',project:'Layihə',host:'Host',sequence:'Sekans',composition:'Kompozisiya',resolution:'Ölçü',duration:'Müddət',fps:'Kadr tezliyi',noProject:'Aktiv layihə və ya sekans/kompozisiya yoxdur.',speedApplied:'Sürət əməliyyatı tamamlandı.',srtDownloaded:'SRT endirildi. Altyazı vaxtlarını yoxlayın.',emptyTranscript:'Əvvəlcə transkript mətnini daxil edin.',noCep:'Paneli Adobe CEP host tətbiqində açın.',roadmapImplemented:'İlkin əsas hazırdır',roadmapPlanned:'Planlaşdırılıb',roadmapResearch:'Araşdırılır'}
  };
  var features = [
    ['Project information','implemented','Layihə məlumatları'],['Premiere clip speed and After Effects layer stretch','implemented','Premiere klip sürəti və After Effects layer stretch'],['Add After Effects text and solid layers','implemented','After Effects mətn və solid layer-ləri'],['Fade selected After Effects layers in','implemented','After Effects layer-lərinə fade-in'],['Manual SRT export','implemented','Əl ilə SRT ixracı'],['Premiere clip speed-ramp presets','planned','Premiere speed-ramp presetləri'],['Scene detection and cuts','research','Səhnə aşkarlanması və kəsmə'],['Beat detection and montage','research','Beat aşkarlanması və montaj'],['Silence/filler-word removal','research','Sükut/doldurucu sözlərin silinməsi'],['Automatic speech recognition and translation','research','Nitqin tanınması və tərcümə'],['Original motion graphics templates','planned','Orijinal motion graphics şablonları'],['Audio/SFX library','planned','Audio/SFX kitabxanası'],['LUTs and safe-zone guides','planned','LUT və təhlükəsiz zona bələdçiləri'],['Preset manager and rollback','planned','Preset idarəsi və geri qaytarma']
  ];
  function t(key) { var lang = strings[document.getElementById('language').value] || strings.en; return lang[key] || strings.en[key] || key; }
  function message(value, isError) { var el = document.getElementById('message'); el.textContent = value; el.classList.toggle('error', !!isError); }
  function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    try { localStorage.setItem('rahilfx.language', lang); } catch (_) {}
    renderFeatures();
  }
  function renderFeatures() {
    var statusText = { implemented:t('roadmapImplemented'), planned:t('roadmapPlanned'), research:t('roadmapResearch') };
    document.getElementById('feature-list').innerHTML = features.map(function (row) {
      var label = document.getElementById('language').value === 'az' ? row[2] : row[0];
      return '<div class="feature-row"><span>' + RFXCore.escapeHtml(label) + '</span><span class="badge ' + row[1] + '">' + RFXCore.escapeHtml(statusText[row[1]]) + '</span></div>';
    }).join('');
  }
  function showView(name) {
    document.querySelectorAll('.tab').forEach(function (tab) { tab.classList.toggle('active', tab.dataset.view === name); });
    document.querySelectorAll('.view').forEach(function (view) { view.classList.toggle('active', view.id === 'view-' + name); });
  }
  function renderInfo(response) {
    var target = document.getElementById('project-info');
    if (!response || !response.ok) { target.innerHTML = '<div><dt>' + RFXCore.escapeHtml(t('status')) + '</dt><dd>' + RFXCore.escapeHtml(response && response.error || t('noProject')) + '</dd></div>'; return; }
    var data = response.data || {}; document.getElementById('host-label').textContent = data.host || 'Adobe';
    var labels = { project:t('project'),host:t('host'),sequence:t('sequence'),composition:t('composition'),resolution:t('resolution'),duration:t('duration'),fps:t('fps') };
    target.innerHTML = Object.keys(labels).filter(function (key) { return data[key] !== undefined && data[key] !== ''; }).map(function (key) { return '<div><dt>' + RFXCore.escapeHtml(labels[key]) + '</dt><dd>' + RFXCore.escapeHtml(data[key]) + '</dd></div>'; }).join('') || '<div><dt>' + RFXCore.escapeHtml(t('status')) + '</dt><dd>' + RFXCore.escapeHtml(t('noProject')) + '</dd></div>';
  }
  function refreshInfo() {
    if (!RFXBridge.available()) { document.getElementById('host-label').textContent = 'Browser preview'; message(t('noCep'), true); return; }
    RFXBridge.getProjectInfo().then(renderInfo).catch(function (error) { message(error.message, true); });
  }
  function hostAction(promise) {
    promise.then(function (result) {
      if (result && result.ok) {
        var text = result.data && result.data.host ? result.data.host + ': ' : '';
        message(text + t('speedApplied'));
      } else {
        message(result && result.error || t('error'), true);
      }
      refreshInfo();
    }).catch(function (error) { message(error.message, true); });
  }
  document.querySelectorAll('.tab').forEach(function (tab) { tab.addEventListener('click', function () { showView(tab.dataset.view); }); });
  document.getElementById('language').addEventListener('change', function (event) { setLanguage(event.target.value); });
  document.getElementById('theme-toggle').addEventListener('click', function () { document.body.classList.toggle('light'); try { localStorage.setItem('rahilfx.theme', document.body.classList.contains('light') ? 'light' : 'dark'); } catch (_) {} });
  document.getElementById('refresh-info').addEventListener('click', refreshInfo);
  document.querySelectorAll('[data-speed]').forEach(function (button) { button.addEventListener('click', function () { document.getElementById('speed').value = button.dataset.speed; }); });
  document.getElementById('apply-speed').addEventListener('click', function () {
    var speed = Number(document.getElementById('speed').value);
    if (!Number.isFinite(speed) || speed < 1 || speed > 1000) { message('Speed must be between 1 and 1000%.', true); return; }
    if (!RFXBridge.available()) { message(t('noCep'), true); return; }
    hostAction(RFXBridge.applySpeed(speed));
  });
  document.getElementById('add-text').addEventListener('click', function () { if (!RFXBridge.available()) { message(t('noCep'), true); return; } hostAction(RFXBridge.addText(document.getElementById('text-layer').value)); });
  document.getElementById('add-solid').addEventListener('click', function () { if (!RFXBridge.available()) { message(t('noCep'), true); return; } hostAction(RFXBridge.addSolid(document.getElementById('solid-name').value)); });
  document.getElementById('apply-fade').addEventListener('click', function () { if (!RFXBridge.available()) { message(t('noCep'), true); return; } hostAction(RFXBridge.fadeIn(document.getElementById('fade-duration').value)); });
  document.getElementById('download-srt').addEventListener('click', function () {
    var srt = RFXCore.transcriptToSrt(document.getElementById('transcript').value, document.getElementById('words-per-caption').value, document.getElementById('seconds-per-caption').value);
    if (!srt) { message(t('emptyTranscript'), true); return; }
    var link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([srt], { type:'text/plain;charset=utf-8' })); link.download = 'rahilfx-captions.srt'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href); message(t('srtDownloaded'));
  });
  try { var language = localStorage.getItem('rahilfx.language'); if (language && strings[language]) document.getElementById('language').value = language; if (localStorage.getItem('rahilfx.theme') === 'light') document.body.classList.add('light'); } catch (_) {}
  setLanguage(document.getElementById('language').value); refreshInfo();
}());
