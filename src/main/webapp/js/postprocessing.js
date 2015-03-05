define([
  'settings',
  'THREE',
  'EffectComposer',
  'FilmPass',
  'RenderPass',
  'CopyShader',
  'VignetteShader'
], 
function(settings) {

  return {
    create: function(renderer, scene, camera) {
      var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };
      var effectComposer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( settings.WIDTH, settings.HEIGHT, rtParameters ) );
      effectComposer.setSize( settings.WIDTH, settings.HEIGHT );
      var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
      renderPass = new THREE.RenderPass( scene, camera );
      effectComposer.addPass(renderPass);
      effectComposer.addPass(effectFilm);
      var effectVignette = new THREE.ShaderPass(THREE.VignetteShader);
      effectVignette.uniforms[ "offset" ].value = 1.5;
      effectVignette.uniforms[ "darkness" ].value = 1.1;
      effectComposer.addPass(effectVignette);
      var copyPass = new THREE.ShaderPass( THREE.CopyShader);
      effectComposer.addPass(copyPass);
      copyPass.renderToScreen = true;

      return effectComposer;
    }
  };

});