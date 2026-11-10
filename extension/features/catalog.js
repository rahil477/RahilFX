(function (root) {
  'use strict';
  root.RFX_FEATURES = [
    { id:'project-info', label:'Project information', status:'implemented', hosts:['PPRO','AEFT'] },
    { id:'ae-speed', label:'After Effects layer stretch', status:'implemented', hosts:['AEFT'] },
    { id:'ae-create-layers', label:'Add After Effects text and solid layers', status:'implemented', hosts:['AEFT'] },
    { id:'ae-fade-in', label:'Fade selected After Effects layers in', status:'implemented', hosts:['AEFT'] },
    { id:'manual-srt', label:'Manual transcript to SRT', status:'implemented', hosts:['PPRO','AEFT'] },
    { id:'premiere-speed', label:'Premiere clip speed editing', status:'research', hosts:['PPRO'] },
    { id:'speed-ramp', label:'Speed-ramp curves and custom presets', status:'planned', hosts:['PPRO','AEFT'] },
    { id:'scene-analysis', label:'Scene detection, cuts, and markers', status:'research', hosts:['PPRO'] },
    { id:'audio-analysis', label:'Beat, silence, and filler-word analysis', status:'research', hosts:['PPRO'] },
    { id:'asr', label:'Automatic transcription and translation', status:'research', hosts:['PPRO'] },
    { id:'graphics', label:'Original titles, graphics, and motion presets', status:'planned', hosts:['PPRO','AEFT'] },
    { id:'audio-assets', label:'Original/licensed SFX and audio presets', status:'planned', hosts:['PPRO'] },
    { id:'color-guides', label:'LUT management and social safe zones', status:'planned', hosts:['PPRO','AEFT'] },
    { id:'backup-presets', label:'User presets, backup, and rollback', status:'planned', hosts:['PPRO','AEFT'] }
  ];
}(typeof window !== 'undefined' ? window : globalThis));
