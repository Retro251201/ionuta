// Script iniettato PRIMA degli script della pagina per simulare un dispositivo senza WebGL
// (usato da tools/qa/run-qa.mjs e da tools/dev/shot.mjs --initfile per verificare il fallback SVG).
HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
  apply(target, self, args) { return /webgl/i.test(String(args[0])) ? null : Reflect.apply(target, self, args); }
});
