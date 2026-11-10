(function (root) {
  'use strict';
  var RFX = {};
  function stringify(value) { return JSON.stringify(value); }
  function respond(data) { return stringify({ ok:true, data:data }); }
  function fail(error) { return stringify({ ok:false, error:String(error && error.message || error || 'Host operation failed.') }); }
  function text(value) { return value == null ? '' : String(value); }
  function getProjectInfo() {
    try {
      if (typeof app === 'undefined' || !app.project) return fail('No active project.');
      var info = { project:text(app.project.file && app.project.file.name || app.project.name || 'Untitled') };
      if (app.project.activeSequence) {
        var seq = app.project.activeSequence;
        info.host = 'Premiere Pro'; info.sequence = text(seq.name || 'Active sequence');
        var width = seq.frameSizeHorizontal, height = seq.frameSizeVertical;
        if (width && height) info.resolution = width + ' × ' + height;
        try { if (seq.timebase) info.fps = (1 / Number(seq.timebase)).toFixed(3); } catch (_) {}
        try { if (seq.end && seq.end.seconds !== undefined) info.duration = Number(seq.end.seconds).toFixed(2) + ' s'; } catch (_) {}
        return respond(info);
      }
      if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
        var comp = app.project.activeItem;
        info.host = 'After Effects'; info.composition = text(comp.name); info.resolution = comp.width + ' × ' + comp.height;
        info.duration = Number(comp.duration).toFixed(2) + ' s'; info.fps = Number(comp.frameRate).toFixed(3);
        return respond(info);
      }
      info.host = 'Adobe host';
      return respond(info);
    } catch (error) { return fail(error); }
  }
  function isSelected(item) {
    try { if (typeof item.isSelected === 'function') return item.isSelected(); } catch (_) {}
    try { return item.selected === true; } catch (_) { return false; }
  }
  function applySpeed(percent) {
    try {
      var speed = Number(percent);
      if (!isFinite(speed) || speed < 1 || speed > 1000) return fail('Speed must be between 1 and 1000 percent.');
      if (typeof app === 'undefined' || !app.project) return fail('No active project.');
      if (app.project.activeSequence) {
        var seq = app.project.activeSequence, changed = 0, unsupported = 0;
        for (var t = 0; t < seq.videoTracks.numTracks; t++) {
          var track = seq.videoTracks[t];
          for (var c = 0; c < track.clips.numItems; c++) {
            var clip = track.clips[c];
            if (isSelected(clip)) {
              if (typeof clip.setSpeed === 'function') { clip.setSpeed(speed / 100, false); changed++; }
              else unsupported++;
            }
          }
        }
        if (!changed) return fail(unsupported ? 'Selected clips were found, but this Premiere version does not expose setSpeed().' : 'Select one or more timeline clips first.');
        return respond({ host:'Premiere Pro', changed:changed, speedPercent:speed });
      }
      if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
        var layers = app.project.activeItem.selectedLayers, aeChanged = 0;
        if (!layers || !layers.length) return fail('Select one or more composition layers first.');
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].locked) continue;
          layers[i].stretch = 10000 / speed;
          aeChanged++;
        }
        if (!aeChanged) return fail('No editable selected layers were found.');
        return respond({ host:'After Effects', changed:aeChanged, speedPercent:speed });
      }
      return fail('Activate a Premiere sequence or After Effects composition first.');
    } catch (error) { return fail(error); }
  }
  RFX.getProjectInfo = getProjectInfo;
  RFX.applySpeed = applySpeed;
  root.RFX = RFX;
}(this));
