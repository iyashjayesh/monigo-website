// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://iyashjayesh.github.io',
	base: '/monigo-website',
	integrations: [
		starlight({
			title: 'MoniGo',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/iyashjayesh/monigo',
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'guides/introduction' },
						{ label: 'Installation & Quick Start', slug: 'guides/getting-started' },
					],
				},
				{
					label: 'Usage',
					items: [
						{ label: 'Configuration', slug: 'guides/configuration' },
						{ label: 'Function Tracing', slug: 'guides/function-tracing' },
						{ label: 'Router Integration', slug: 'guides/router-integration' },
						{ label: 'Security', slug: 'guides/security' },
						{ label: 'Examples', slug: 'guides/examples' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Benchmarks', slug: 'reference/benchmarks' },
						{ label: 'API Reference', slug: 'reference/api-reference' },
						{ label: 'Migration (v1 → v2)', slug: 'reference/migration-v1-to-v2' },
						{ label: 'Community', slug: 'reference/community' },
					],
				},
			],
		}),
	],
});
