import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "XYZ",
	description: "A project application to show our progress",
	head: [["link", { rel: "icon", href: "/favicon.ico" }]],
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: {
			light: "/geolytix.svg",
			dark: "/geolytix_dark.svg",
		},
		nav: [
			{ text: "Home", link: "/" },
			{
				text: "Docs",
				items: [
					{ text: "XYZ", link: "https://geolytix.github.io/xyz" },
					{ text: "MAPP", link: "https://geolytix.github.io/xyz/mapp" },
				],
			},
			{
				text: "v4.13.1",
				items: [
					{ text: "v4.13.1", link: "/release/v4.13.1" },
					{ text: "v4.13.0", link: "/release/v4.13.0" },
				],
			},
		],

		sidebar: [
			{
				text: "Sitrep",
				items: [{ text: "March 24th - April 17th", link: "/sitrep/sitrep-1" }],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/GEOLYTIX/xyz" }],
	},
});
