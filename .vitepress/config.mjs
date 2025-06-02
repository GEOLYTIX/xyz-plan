import { defineConfig } from 'vitepress';

import { useSidebar } from 'vitepress-openapi';

import spec from '../src/openapi.json' with { type: 'json' };

const sidebar = useSidebar({
  spec,
  // Optionally, you can specify a link prefix for all generated sidebar items.
  linkPrefix: '/wiki/xyz/api/',
});

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
    search: {
      provider: 'local',
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
        text: 'v4.14.2',
        items: [
          { text: 'v4.14.2', link: '/release/v4.14.2' },
          { text: 'v4.14.1', link: '/release/v4.14.1' },
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
                  text: 'Templates',
                  link: '/wiki/xyz/workspace/templates',
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
            //{
            //  text: 'API',
            //  link: '/wiki/xyz/api/',
            //  items: [
            //    ...sidebar.generateSidebarGroups().map((group) => ({
            //      ...group,
            //      collapsed: true,
            //    })),
            //  ],
            //},
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
            { text: 'May 22nd - June 13th', link: '/sitrep/sitrep-3' },
            { text: 'April 22nd - May 21st', link: '/sitrep/sitrep-2' },
            { text: 'March 24th - April 17th', link: '/sitrep/sitrep-1' },
          ],
        },
      ],
      '/release/': [
        {
          text: 'Releases',
          items: [
            { text: 'v4.14.1', link: '/release/v4.14.1' },
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
              text: 'Process Environment',
              link: '/wiki/process-environment',
            },
            {
              text: 'Terminology',
              link: '/wiki/terminology',
            },
            {
              text: 'Vercel',
              link: '/wiki/vercel',
            },
            {
              text: 'Security',
              link: '/wiki/security',
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/GEOLYTIX/xyz' }],
  },
});
