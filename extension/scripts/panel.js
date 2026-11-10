(function () {
  'use strict';
  var strings = {
    en: { navHome:'Home',navEdit:'Edit',navCaptions:'Captions',navLibrary:'Library',projectInfo:'Project information',refresh:'Refresh',status:'Status',connecting:'Connecting…',quickStart:'Quick start',quickStartText:'Select clips or layers in the host timeline, then use Edit. Subtitle tools work with text you provide.',safetyNote:'Save a project copy before applying changes. Use the host application\'s Undo if needed.',speedControl:'Speed control',speedDescription:'Apply a constant speed to selected timeline clips (Premiere) or selected layers (After Effects).',apply:'Apply',featureStatus:'Feature status',featureStatusText:'This starter includes the speed operation and project inspection. Other tools are listed in the repository roadmap as planned or under research.',subtitleTool:'Manual subtitle helper',subtitleDescription:'Paste a transcript. It will be split into short caption cues and exported as an SRT file. No automatic transcription or translation is performed.',transcript:'Transcript',wordsPerCaption:'Words per caption',secondsPerCaption:'Seconds per caption',downloadSrt:'Generate and download SRT',captionNote:'Review timing and text before importing the SRT into your editing project.',library:'Feature roadmap',ready:'Ready',error:'Error',project:'Project',host:'Host',sequence:'Sequence',composition:'Composition',resolution:'Resolution',duration:'Duration',fps:'Frame rate',noProject:'No active project or sequence/composition.',speedApplied:'Speed operation completed.',srtDownloaded:'SRT downloaded. Check caption timing.',emptyTranscript:'Enter transcript text first.',noCep:'Open the panel inside an Adobe CEP host.',roadmapImplemented:'Implemented foundation',roadmapPlanned:'Planned',roadmapResearch:'Research'},
    az: { navHome:'Ana səhifə',navEdit:'Montaj',navCaptions:'Altyazı',navLibrary:'Yol xəritəsi',projectInfo:'Layihə məlumatı',refresh:'Yenilə',status:'Vəziyyət',connecting:'Qoşulur…',quickStart:'Başlanğıc',quickStartText:'Host timeline-da klip və ya layer seçin, sonra Montaj bölməsindən istifadə edin. Altyazı aləti daxil etdiyiniz mətnlə işləyir.',safetyNote:'Dəyişiklik etməzdən əvvəl layihənin surətini saxlayın. Lazım gələrsə host tətbiqində Undo edin.',speedControl:'Sürət idarəsi',speedDescription:'Seçilmiş Premiere kliplərinə və ya After Effects layer-lərinə sabit sürət tətbiq edir.',apply:'Tətbiq et',featureStatus:'Funksiyaların vəziyyəti',featureStatusText:'Bu ilkin versiyada sürət əməliyyatı və layihə məlumatları var. Digər alətlər yol xəritəsində planlaşdırılıb və ya araşdırılır.',subtitleTool:'Əl ilə altyazı köməkçisi',subtitleDescription:'Transkripti yapışdırın. Mətn qısa altyazı hissələrinə bölünərək SRT faylı kimi endiriləcək. Avtomatik transkripsiya və tərcümə etmir.',transcript:'Transkript',wordsPerCaption:'Altyazıda söz sayı',secondsPerCaption:'Altyazı müddəti (saniyə)',downloadSrt:'SRT yarat və endir',captionNote:'SRT faylını layihəyə əlavə etməzdən əvvəl mətn və vaxtları yoxlayın.',library:'Funksiyaların yol xəritəsi',ready:'Hazırdır',error:'Xəta',project:'Layihə',host:'Host',sequence:'Sekans',composition:'Kompozisiya',resolution:'Ölçü',duration:'Müddət',fps:'Kadr tezliyi',noProject:'Aktiv layihə və ya sekans/kompozisiya yoxdur.',speedApplied:'Sürət əməliyyatı tamamlandı.',srtDownloaded:'SRT endirildi. Altyazı vaxtlarını yoxlayın.',emptyTranscript:'Əvvəlcə transkript mətnini daxil edin.',noCep:'Paneli Adobe CEP host tətbiqində açın.',roadmapImplemented:'İlkin əsas hazırdır',roadmapPlanned:'Planlaşdırılıb',roadmapResearch:'Araşdırılır'}
  };
  var features = [
    ['Project information','implemented','Layihə məlumatları'],['Constant speed control','implemented','Sabit sürət idarəsi'],['Manual SRT helper','implemented','Əl ilə SRT köməkçisi'],['Speed-ramp curves','planned','Speed-ramp əyriləri'],['Scene detection and cuts','research','Səhnə aşkarlanması və kəsmə'],['Beat detection and montage','research','Beat aşkarlanması və montaj'],['Silence/filler-word removal','research','Sükut/doldurucu sözlərin silinməsi'],['Automatic speech recognition and translation','research','Nitqin tanınması və tərcümə'],['Motion graphics and original templates','planned','Motion graphics və orijinal şablonlar'],['Audio/SFX library','planned','Audio/SFX kitabxanası'],['LUTs and safe-zone guides','planned','LUT və təhlükəsiz zona bələdçiləri'],['Preset manager and rollback','planned','Preset idarəsi və geri qaytarma']
  ];
  function t(key) { var lang = strings[document.getElementById('language').value] || strings.en; return lang[key] || strings.en[key] || key; }
  function message(text, isError) { var el = document.getElementById('message'); el.textContent = text; el.classList.toggle('error', !!isError); }
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
    var data = response.data || {};
    document.getElementById('host-label').textContent = data.host || 'Adobe';
    var labels = { project:t('project'),host:t('host'),sequence:t('sequence'),composition:t('composition'),resolution:t('resolution'),duration:t('duration'),fps:t('fps') };
    target.innerHTML = Object.keys(labels).filter(function (key) { return data[key] !== undefined && data[key] !== ''; }).map(function (key) {
      return '<div><dt>' + RFXCore.escapeHtml(labels[key]) + '</dt><dd>' + RFXCore.escapeHtml(data[key]) + '</dd></div>';
    }).join('') || '<div><dt>' + RFXCore.escapeHtml(t('status')) + '</dt><dd>' + RFXCore.escapeHtml(t('noProject')) + '</dd></div>';
  }
  function refreshInfo() {
    if (!RFXBridge.available()) { document.getElementById('host-label').textContent = 'Browser preview'; message(t('noCep'), true); return; }
    RFXBridge.getProjectInfo().then(renderInfo).catch(function (error) { message(error.message, true); });
  }
  document.querySelectorAll('.tab').forEach(function (tab) { tab.addEventListener('click', function () { showView(tab.dataset.view); }); });
  document.getElementById('language').addEventListener('change', function (event) { setLanguage(event.target.value); });
  document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('light');
    try { localStorage.setItem('rahilfx.theme', document.body.classList.contains('light') ? 'light' : 'dark'); } catch (_) {}
  });
  document.getElementById('refresh-info').addEventListener('click', refreshInfo);
  document.querySelectorAll('[data-speed]').forEach(function (button) { button.addEventListener('click', function () { document.getElementById('speed').value = button.dataset.speed; }); });
  document.getElementById('apply-speed').addEventListener('click', function () {
    var speed = Number(document.getElementById('speed').value);
    if (!Number.isFinite(speed) || speed < 1 || speed > 1000) { message('Speed must be between 1 and 1000%.', true); return; }
    if (!RFXBridge.available()) { message(t('noCep'), true); return; }
    RFXBridge.applySpeed(speed).then(function (result) { message(result && result.ok ? t('speedApplied') : (result && result.error || t('error')), !(result && result.ok)); refreshInfo(); }).catch(function (error) { message(error.message, true); });
  });
  document.getElementById('download-srt').addEventListener('click', function () {
    var text = document.getElementById('transcript').value;
    var srt = RFXCore.transcriptToSrt(text, document.getElementById('words-per-caption').value, document.getElementById('seconds-per-caption').value);
    if (!srt) { message(t('emptyTranscript'), true); return; }
    var link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([srt], { type:'text/plain;charset=utf-8' })); link.download = 'rahilfx-captions.srt'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href); message(t('srtDownloaded'));
  });
  try {
    var language = localStorage.getItem('rahilfx.language');
    if (language && strings[language]) document.getElementById('language').value = language;
    if (localStorage.getItem('rahilfx.theme') === 'light') document.body.classList.add('light');
  } catch (_) {}
  setLanguage(document.getElementById('language').value);
  refreshInfo();
}());
