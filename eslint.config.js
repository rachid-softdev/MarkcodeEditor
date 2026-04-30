import eslintPluginJs from "@eslint/js";

export default [
	eslintPluginJs.configs.recommended,
	{
		ignores: [
			"node_modules",
			"dist",
			"coverage"
		],
	},
];
