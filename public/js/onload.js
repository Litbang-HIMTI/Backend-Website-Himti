window.onload = () => {
	window.ui = SwaggerUIBundle({
		url: "./api.json",
		dom_id: "#swagger-ui",
		presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
		layout: "StandaloneLayout",
	});
};
