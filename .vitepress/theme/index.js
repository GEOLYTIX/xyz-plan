import DefaultTheme from 'vitepress/theme';
import './custom.css';

import { theme, useOpenapi } from 'vitepress-openapi/client';
import 'vitepress-openapi/dist/style.css';

import spec from '../../src/openapi.json' with { type: 'json' };

export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    const openapi = useOpenapi({
      spec,
      config: {},
    });
    theme.enhanceApp({ app, openapi });
  },
};
