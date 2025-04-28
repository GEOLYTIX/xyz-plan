import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'XYZ',
  description: 'A project application to show our progress',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/geolytix.svg',
      dark: '/geolytix_dark.svg',
    },
    editLink: {
      pattern: 'https://github.com/GEOLYTIX/xyz-plan/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Wiki',
        items: [
          {
            text: 'Home',
            link: '/wiki/index',
          },
          {
            text: 'XYZ',
            link: '/wiki/xyz/',
          },
          {
            text: 'MAPP',
            link: '/wiki/mapp/',
          },
        ],
      },
      {
        text: 'Docs',
        items: [
          { text: 'XYZ', link: 'https://geolytix.github.io/xyz' },
          { text: 'MAPP', link: 'https://geolytix.github.io/xyz/mapp' },
        ],
      },
      {
        text: 'v4.14.0',
        items: [
          { text: 'v4.14.0', link: '/release/v4.14.0' },
          { text: 'v4.13.2', link: '/release/v4.13.2' },
          { text: 'v4.13.1', link: '/release/v4.13.1' },
          { text: 'v4.13.0', link: '/release/v4.13.0' },
        ],
      },
    ],

    sidebar: {
      '/wiki/xyz': [
        {
          items: [
            {
              text: 'Workspace',
              link: '/wiki/xyz/workspace',
              items: [
                {
                  text: 'Template',
                  link: '/wiki/xyz/workspace/template',
                },
                {
                  text: 'Locale',
                  link: '/wiki/xyz/workspace/locale',
                },
                {
                  text: 'Layer',
                  link: '/wiki/xyz/workspace/layer/',
                  collapsed: true,
                  items: [
                    {
                      text: 'Roles',
                      link: '/wiki/xyz/workspace/layer/roles',
                    },
                    {
                      text: 'Filter',
                      link: '/wiki/xyz/workspace/layer/filter',
                    },
                    {
                      text: 'Draw',
                      link: '/wiki/xyz/workspace/layer/draw',
                    },
                    {
                      text: 'Format',
                      link: '/wiki/xyz/workspace/layer/format',
                    },
                    {
                      text: 'Style',
                      link: '/wiki/xyz/workspace/layer/style',
                    },
                    {
                      text: 'Location',
                      link: '/wiki/xyz/workspace/layer/location/',
                      items: [
                        {
                          text: 'infoj',
                          link: '/wiki/xyz/workspace/layer/location/infoj/',
                          items: [
                            {
                              text: 'entry',
                              link: '/wiki/xyz/workspace/layer/location/infoj/entry',
                            },
                            {
                              text: 'filter',
                              link: '/wiki/xyz/workspace/layer/location/infoj/filter',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      '/wiki/mapp': [
        {
          items: [
            {
              text: 'MAPP',
              link: '/wiki/mapp',
              items: [
                {
                  text: 'UI',
                  link: '/wiki/mapp/ui',
                },
              ],
            },
          ],
        },
      ],
      '/sitrep/': [
        {
          text: 'Sitrep',
          items: [
            {
              text: 'April 22nd - May 6th',
              link: '/sitrep/sitrep-2',
            },
            { text: 'March 24th - April 17th', link: '/sitrep/sitrep-1' },
          ],
        },
      ],
      '/release/': [
        {
          text: 'Releases',
          items: [
            { text: 'v4.14.0', link: '/release/v4.14.0' },
            { text: 'v4.13.2', link: '/release/v4.13.2' },
            { text: 'v4.13.1', link: '/release/v4.13.1' },
            { text: 'v4.13.0', link: '/release/v4.13.0' },
          ],
        },
      ],
      '/wiki/': [
        {
          items: [
            {
              text: 'Getting started',
              link: '/wiki/getting-started',
            },
            {
              text: 'Clean Code Guidelines',
              link: '/wiki/clean-code',
            },
            {
              text: 'Terminology',
              link: '/wiki/terminology',
            },
            {
              text: 'Vercel',
              link: '/wiki/vercel',
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/GEOLYTIX/xyz' }],
  },
});
