(function (root) {
  'use strict';
  var RFX = {};
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
    for (var key in value) if (value.hasOwnProperty(key)) pairs.push(quote(key) + ':' + encode(value[key]));
    return '{' + pairs.join(',') + '}';
  }
  function respond(data) { return encode({ ok:true, data:data }); }
  function fail(error) { return encode({ ok:false, error:String(error && error.message || error || 'Host operation failed.') }); }
  function text(value) { return value == null ? '' : String(value); }
  function activeComp() {
    return typeof CompItem !== 'undefined' && app.project.activeItem && app.project.activeItem instanceof CompItem ? app.project.activeItem : null;
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
          var settings = seq.getSettings && seq.getSettings();
          var width = settings && settings.videoFrameWidth || seq.frameSizeHorizontal;
          var height = settings && settings.videoFrameHeight || seq.frameSizeVertical;
          if (width && height) info.resolution = width + ' × ' + height;
          var fps = settings && settings.videoFrameRate && settings.videoFrameRate.seconds;
          if (fps) info.fps = (1 / Number(fps)).toFixed(3);
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
          if (layers[i].locked) continue;
          layers[i].stretch = 10000 / speed;
          changed++;
        }
        if (!changed) return fail('No editable selected layers were found.');
        return respond({ host:'After Effects', changed:changed, speedPercent:speed });
      });
      if (app.project.activeSequence) return fail('Premiere Pro constant-speed editing is not yet implemented through the supported public scripting API. No clips were changed.');
      return fail('Activate a Premiere sequence or After Effects composition first.');
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
          var layer = layers[i]; if (layer.locked) continue;
          var opacity = layer.property('ADBE Transform Group').property('ADBE Opacity');
          var start = Math.max(layer.inPoint, comp.time), end = Math.min(start + seconds, layer.outPoint);
          if (end <= start) continue;
          opacity.setValueAtTime(start, 0); opacity.setValueAtTime(end, 100); changed++;
        }
        if (!changed) return fail('No editable selected layers could be faded.');
        return respond({ host:'After Effects', changed:changed, duration:seconds });
      });
    } catch (error) { return fail(error); }
  }
  RFX.getProjectInfo = getProjectInfo;
  RFX.applySpeed = applySpeed;
  RFX.addTextLayer = addTextLayer;
  RFX.addSolid = addSolid;
  RFX.fadeSelectedLayers = fadeSelectedLayers;
  root.RFX = RFX;
}(this));
