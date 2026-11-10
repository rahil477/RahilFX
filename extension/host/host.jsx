(function (root) {
  'use strict';
  var RFX = {};
  var rampPresets = {
    soft: { name: 'Soft', startPercent: 70, endPercent: 120, durationSeconds: 1.5 },
    cinematic: { name: 'Cinematic', startPercent: 55, endPercent: 140, durationSeconds: 2.0 },
    bold: { name: 'Bold', startPercent: 85, endPercent: 180, durationSeconds: 1.0 },
    elastic: { name: 'Elastic', startPercent: 60, endPercent: 160, durationSeconds: 2.5 }
  };

  function quote(value) { return '"' + String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '"'; }
  function encode(value) {
    if (value === null || typeof value === 'undefined') return 'null';
    if (typeof value === 'string') return quote(value);
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value instanceof Array) {
      var items = []; for (var i = 0; i < value.length; i++) items.push(encode(value[i]));
      return '[' + items.join(',') + ']';
    }
    var pairs = [];
    for (var key in value) if (Object.prototype.hasOwnProperty.call(value, key)) pairs.push(quote(key) + ':' + encode(value[key]));
    return '{' + pairs.join(',') + '}';
  }
  function respond(data, more) { return encode({ ok:true, data:data, kind:more || null }); }
  function fail(error) { return encode({ ok:false, error:String(error && error.message || error || 'Host operation failed.') }); }
  function text(value) { return value == null ? '' : String(value); }
  function activeComp() {
    return typeof CompItem !== 'undefined' && app.project && app.project.activeItem && app.project.activeItem instanceof CompItem ? app.project.activeItem : null;
  }
  function withUndo(label, action) {
    var started = false;
    try { if (typeof app.beginUndoGroup === 'function') { app.beginUndoGroup(label); started = true; } return action(); }
    finally { if (started && typeof app.endUndoGroup === 'function') app.endUndoGroup(); }
  }
  function getProjectInfo() {
    try {
      if (typeof app === 'undefined' || !app.project) return fail('No active project.');
      var info = { project:text(app.project.file && app.project.file.name || app.project.name || 'Untitled') };
      if (app.project.activeSequence) {
        var seq = app.project.activeSequence;
        info.host = 'Premiere Pro'; info.sequence = text(seq.name || 'Active sequence');
        try {
          var width = seq.frameSizeHorizontal,
              height = seq.frameSizeVertical,
              fpsValue = null;
          if (seq.getSettings && typeof seq.getSettings === 'function') {
            var settings = seq.getSettings();
            width = settings && settings.videoFrameWidth || width;
            height = settings && settings.videoFrameHeight || height;
            fpsValue = settings && settings.videoFrameRate;
          }
          if (width && height) info.resolution = width + ' × ' + height;
          if (fpsValue && fpsValue !== 0) info.fps = (1 / Number(fpsValue)).toFixed(3);
          else if (seq && seq.frameRate) info.fps = Number(seq.frameRate).toFixed(3);
        } catch (_) {}
        return respond(info);
      }
      var comp = activeComp();
      if (comp) {
        info.host = 'After Effects'; info.composition = text(comp.name); info.resolution = comp.width + ' × ' + comp.height;
        info.duration = Number(comp.duration).toFixed(2) + ' s'; info.fps = Number(comp.frameRate).toFixed(3);
        return respond(info);
      }
      info.host = text(app.name || 'Adobe host');
      return respond(info);
    } catch (error) { return fail(error); }
  }

  function applySpeed(percent) {
    try {
      var speed = Number(percent);
      if (!isFinite(speed) || speed < 1 || speed > 1000) return fail('Speed must be between 1 and 1000 percent.');
      if (typeof app === 'undefined' || !app.project) return fail('No active project.');
      var comp = activeComp();
      if (comp) return withUndo('RahilFX: Set layer stretch', function () {
        var layers = comp.selectedLayers, changed = 0;
        if (!layers || !layers.length) return fail('Select one or more composition layers first.');
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i];
          if (layer && !layer.locked) {
            layer.stretch = 10000 / speed;
            changed++;
          }
        }
        if (!changed) return fail('No editable selected layers were found.');
        return respond({ host:'After Effects', changed:changed, speedPercent:speed });
      });
      if (app.project.activeSequence) {
        var seq = app.project.activeSequence;
        var clips = [];
        for (var t = 0; t < seq.videoTracks.numTracks; t++) {
          var track = seq.videoTracks[t];
          if (!track || !track.clips || !track.clips.numItems) continue;
          for (var c = 0; c < track.clips.numItems; c++) {
            var clip = track.clips[c];
            if (clip && clip.isSelected && clip.isSelected()) clips.push(clip);
          }
        }
        if (!clips.length) return fail('Select one or more timeline clips first.');
        var changed = 0;
        for (var i = 0; i < clips.length; i++) {
          var currentClip = clips[i];
          if (currentClip && typeof currentClip.speed !== 'undefined') {
            currentClip.speed = speed;
            changed++;
          }
        }
        if (!changed) return fail('Selected clips were found, but this Premiere version does not expose a compatible speed property.');
        return respond({ host:'Premiere Pro', changed:changed, speedPercent:speed });
      }
      return fail('Activate a Premiere sequence or After Effects composition first.');
    } catch (error) { return fail(error); }
  }

  function applyRampPreset(name) {
    try {
      var key = String(name || 'soft').toLowerCase();
      var preset = rampPresets[key] || rampPresets.soft;
      if (typeof app === 'undefined' || !app.project) return fail('No active project.');
      if (app.project.activeSequence) {
        var seq = app.project.activeSequence;
        var clips = [];
        for (var t = 0; t < seq.videoTracks.numTracks; t++) {
          var track = seq.videoTracks[t];
          if (!track || !track.clips || !track.clips.numItems) continue;
          for (var c = 0; c < track.clips.numItems; c++) {
            var clip = track.clips[c];
            if (clip && clip.isSelected && clip.isSelected()) clips.push(clip);
          }
        }
        if (!clips.length) return fail('Select one or more timeline clips first.');
        var changed = 0;
        for (var i = 0; i < clips.length; i++) {
          var clip = clips[i];
          if (clip && typeof clip.speed !== 'undefined') {
            var currentSpeed = Number(clip.speed) || 100;
            clip.speed = Math.round((currentSpeed * (preset.startPercent / 100)) * 100) / 100;
            changed++;
          }
        }
        if (!changed) return fail('Selected clips were found, but this Premiere version does not expose a compatible speed property.');
        return respond({ host:'Premiere Pro', preset:preset.name, changed:changed, startPercent:preset.startPercent, endPercent:preset.endPercent }, 'ramp');
      }
      return fail('Activate a Premiere sequence to apply a speed-ramp preset.');
    } catch (error) { return fail(error); }
  }

  function createSceneMarkers() {
    try {
      if (typeof app === 'undefined' || !app.project || !app.project.activeSequence) return fail('Activate a Premiere sequence to create scene markers.');
      var seq = app.project.activeSequence;
      var clips = [];
      for (var t = 0; t < seq.videoTracks.numTracks; t++) {
        var track = seq.videoTracks[t];
        if (!track || !track.clips || !track.clips.numItems) continue;
        for (var c = 0; c < track.clips.numItems; c++) {
          var clip = track.clips[c];
          if (clip && clip.isSelected && clip.isSelected()) clips.push(clip);
        }
      }
      if (!clips.length) return fail('Select one or more timeline clips first.');
      var created = 0;
      if (seq.markers && typeof seq.markers.createMarker === 'function') {
        for (var i = 0; i < clips.length; i++) {
          var clip = clips[i];
          var marker = seq.markers.createMarker(clip.start);
          if (marker) {
            marker.name = 'Scene ' + (i + 1);
            created++;
          }
        }
      } else if (seq.markers && typeof seq.markers.createMarkerAtTime === 'function') {
        for (var j = 0; j < clips.length; j++) {
          var mClip = clips[j];
          var result = seq.markers.createMarkerAtTime(mClip.start, 'Scene ' + (j + 1));
          if (result) created++;
        }
      } else {
        return fail('This Premiere version does not expose marker creation for the selected clips.');
      }
      return respond({ host:'Premiere Pro', markersCreated:created }, 'scene');
    } catch (error) { return fail(error); }
  }

  function addTextLayer(value) {
    try {
      var comp = activeComp();
      if (!comp) return fail('Activate an After Effects composition to add a text layer.');
      var content = text(value).replace(/^\s+|\s+$/g, '');
      if (!content) return fail('Enter text first.');
      return withUndo('RahilFX: Add text layer', function () {
        var layer = comp.layers.addText(content);
        layer.name = content.substring(0, 40);
        return respond({ host:'After Effects', layer:layer.name });
      });
    } catch (error) { return fail(error); }
  }

  function addSolid(name, red, green, blue) {
    try {
      var comp = activeComp();
      if (!comp) return fail('Activate an After Effects composition to add a solid.');
      var color = [Number(red), Number(green), Number(blue)];
      for (var i = 0; i < color.length; i++) if (!isFinite(color[i]) || color[i] < 0 || color[i] > 1) return fail('Color channels must be between 0 and 1.');
      var solidName = text(name).replace(/^\s+|\s+$/g, '') || 'RahilFX Solid';
      return withUndo('RahilFX: Add solid', function () {
        var layer = comp.layers.addSolid(color, solidName, comp.width, comp.height, comp.pixelAspect, comp.duration);
        return respond({ host:'After Effects', layer:layer.name });
      });
    } catch (error) { return fail(error); }
  }

  function fadeSelectedLayers(duration) {
    try {
      var comp = activeComp();
      if (!comp) return fail('Activate an After Effects composition first.');
      var seconds = Number(duration);
      if (!isFinite(seconds) || seconds <= 0 || seconds > 10) return fail('Fade duration must be between 0 and 10 seconds.');
      var layers = comp.selectedLayers;
      if (!layers || !layers.length) return fail('Select one or more composition layers first.');
      return withUndo('RahilFX: Fade selected layers in', function () {
        var changed = 0;
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i];
          if (layer && !layer.locked) {
            var opacity = layer.property('ADBE Transform Group').property('ADBE Opacity');
            var start = layer.inPoint;
            var end = Math.min(layer.outPoint, start + seconds);
            if (end <= start) continue;
            opacity.setValueAtTime(start, 0);
            opacity.setValueAtTime(end, 100);
            changed++;
          }
        }
        if (!changed) return fail('No editable selected layers could be faded.');
        return respond({ host:'After Effects', changed:changed, duration:seconds });
      });
    } catch (error) { return fail(error); }
  }

  RFX.getProjectInfo = getProjectInfo;
  RFX.applySpeed = applySpeed;
  RFX.applyRampPreset = applyRampPreset;
  RFX.createSceneMarkers = createSceneMarkers;
  RFX.addTextLayer = addTextLayer;
  RFX.addSolid = addSolid;
  RFX.fadeSelectedLayers = fadeSelectedLayers;
  root.RFX = RFX;
}(this));
