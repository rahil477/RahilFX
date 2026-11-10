(function (root) {
  'use strict';
  window.RFXBridge = {
    available: function () { return !!(window.__adobe_cep__ && window.__adobe_cep__.evalScript); },
    call: function (expression) {
      return new Promise(function (resolve, reject) {
        if (!window.__adobe_cep__ || !window.__adobe_cep__.evalScript) {
          reject(new Error('Adobe CEP host bridge is unavailable. Open this panel inside Premiere Pro or After Effects.'));
          return;
        }
        window.__adobe_cep__.evalScript(expression, function (result) {
          if (!result || result === 'EvalScript error.') { reject(new Error('The Adobe host did not return a result.')); return; }
          try { resolve(JSON.parse(result)); } catch (error) { reject(new Error('Invalid response from host: ' + result)); }
        });
      });
    },
    getProjectInfo: function () { return this.call('RFX.getProjectInfo()'); },
    applySpeed: function (percent) { return this.call('RFX.applySpeed(' + JSON.stringify(Number(percent)) + ')'); },
    addText: function (value) { return this.call('RFX.addTextLayer(' + JSON.stringify(String(value)) + ')'); },
    addSolid: function (name) { return this.call('RFX.addSolid(' + JSON.stringify(String(name)) + ',0.12,0.12,0.16)'); },
    fadeIn: function (duration) { return this.call('RFX.fadeSelectedLayers(' + JSON.stringify(Number(duration)) + ')'); }
  };
}());
