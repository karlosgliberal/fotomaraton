(function (window, undefined) {
"use strict";

window.Seriously = window.Seriously ||
	{ plugin: function (name, opt) { this[name] = opt; } };

Seriously.plugin('emboss', {
	shader: function(inputs, shaderSource, utilities) {
		shaderSource.fragment = '#ifdef GL_ES\n\n' +
			'precision mediump float;\n\n' +
			'#endif\n\n' +
			'\n' +
			'varying vec2 vTexCoord;\n' +
			'varying vec4 vPosition;\n' +
			'\n' +
			'uniform sampler2D source;\n' +
			'uniform float amount;\n' +
			'\n' +
			'uniform vec2 dim;\n' +
			'\n' +
			//'const vec4 weight = vec4(2.0, 2.0, 2.0, 0.5);\n' +
			'const vec3 average = vec3(1.0 / 3.0);\n' +
			'\n' +
			'void main (void)  {\n' +
			'	vec2 offset = 1.0 / dim;\n' +
			'	vec4 pixel = vec4(0.5, 0.5, 0.5, 1.0);\n' +
			'	pixel -= texture2D(source, vTexCoord - offset) * amount;\n' +
			'	pixel += texture2D(source, vTexCoord + offset) * amount;\n' +
			'	float val = dot(pixel.rgb, average);\n' +
			'	pixel.rgb = vec3(val);\n' +
			'	gl_FragColor = pixel;\n' +
			'\n' +
			'} \n';
		return shaderSource;
	},
	draw: function (shader, model, uniforms, frameBuffer, parent) {
		if (!uniforms.dim) {
			uniforms.dim = [];
		}
		uniforms.dim[0] = this.width;
		uniforms.dim[1] = this.height;
		parent(shader, model, uniforms, frameBuffer);
	},
	inPlace: true,
	inputs: {
		source: {
			type: 'image',
			uniform: 'source'
		},
		amount: {
			type: 'number',
			uniform: 'amount',
			defaultValue: 1
		}
	},
	title: 'Emboss',
	categories: [],
	description: 'Emboss'
});

}(window));
