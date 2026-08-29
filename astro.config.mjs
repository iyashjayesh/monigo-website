// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://iyashjayesh.github.io',
	base: '/monigo-website',
	// The migration page was renamed: it described a "v1 → v2" upgrade for a v2
	// that was never published. The old URL is live on GitHub Pages and may be
	// linked from elsewhere, so it redirects rather than 404s.
	redirects: {
		'/reference/migration-v1-to-v2': '/monigo-website/reference/upgrading/',
	},
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
						{ label: 'Exporters', slug: 'guides/exporters' },
						{ label: 'Security', slug: 'guides/security' },
						{ label: 'Examples', slug: 'guides/examples' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Benchmarks', slug: 'reference/benchmarks' },
						{ label: 'API Reference', slug: 'reference/api-reference' },
						{ label: 'Upgrading', slug: 'reference/upgrading' },
						{ label: 'Changelog', slug: 'reference/changelog' },
						{ label: 'Community', slug: 'reference/community' },
					],
				},
			],
		}),
	],
});
