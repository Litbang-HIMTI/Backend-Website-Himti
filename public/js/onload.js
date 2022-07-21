window.onload = () => {
	window.ui = SwaggerUIBundle({
		url: "/v1.yaml",
		dom_id: "#swagger-ui",
		presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
		layout: "BaseLayout",
	});
};
