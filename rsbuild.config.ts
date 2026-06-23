import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginVue } from '@rsbuild/plugin-vue';
import { codeInspectorPlugin } from 'code-inspector-plugin';

export default defineConfig({
	source: {
		entry: {
			index: './src/main.ts',
		},
	},
	plugins: [
		pluginLess(),
		pluginVue({
			vueLoaderOptions: {
				isServerBuild: false,
			},
		}),
	],
	tools: {
		rspack: {
			plugins: [
				codeInspectorPlugin({
					dev: true,
					server: 'close',
					bundler: 'rspack',
					behavior: {
						locate: false,
						copy: true,
					},
				}),
			],
		},
	},
});
