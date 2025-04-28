Vercel (formerly Zeit) is a cloud platform as a service company.

The XYZ host can be deployed as a [serverless function](https://vercel.com/docs/concepts/functions/serverless-functions) with the [Vercel CLI](https://vercel.com/docs/cli) from the local repository root.

A [project config](https://vercel.com/docs/project-configuration) `vercel.json` is required in the root.

The config json defines [security] headers, rewrites for [XYZ endpoints](https://github.com/GEOLYTIX/xyz/wiki/XYZ---API), and [process environment variables](https://github.com/GEOLYTIX/xyz/wiki/XYZ#environment-process).

```json
{
  "version": 2,
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "api/api.js": {
      "includeFiles": "public/**"
    }
  },
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; base-uri 'self'; object-src 'self'; connect-src 'self' geolytix.github.io *.maptiler.com *.mapbox.com www.google-analytics.com api.github.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' www.google.com www.gstatic.com; form-action 'self'; style-src 'self' 'unsafe-inline' geolytix.github.io unpkg.com cdn.jsdelivr.net fonts.googleapis.com; font-src 'self' geolytix.github.io unpkg.com cdn.jsdelivr.net fonts.gstatic.com; script-src 'self' 'unsafe-inline' unpkg.com cdn.skypack.dev api.mapbox.com www.google.com www.gstatic.com cdn.jsdelivr.net www.google-analytics.com www.googletagmanager.com blob:; img-src 'self' geolytix.github.io api.ordnancesurvey.co.uk *.tile.openstreetmap.org api.mapbox.com res.cloudinary.com *.global.ssl.fastly.net raw.githubusercontent.com cdn.jsdelivr.net gitcdn.xyz data:; media-src 'self' res.cloudinary.com;"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/public/(.*)",
      "destination": "/$1"
    },
    {
      "source": "/api/query/:_template?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/module/:module?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/location/:method?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/user/:method?/:key?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/workspace/:key?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/layer/:format?/:z?/:x?/:y?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/provider/:provider?",
      "destination": "/api/api.js"
    },
    {
      "source": "/api/(.*)",
      "destination": "/api/api.js"
    },
    {
      "source": "/view/:_template?",
      "destination": "/api/api.js"
    },
    {
      "source": "/",
      "destination": "/api/api.js"
    }
  ],
  "env": {
    "TITLE": "XYZ | MAPP"
  }
}
```

## Headers

### Content Security Policy

[The HTTP Content-Security-Policy response header allows web site administrators to control resources the user agent is allowed to load for a given page.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)

The sample vercel.json provides some common CSP directives used to access common services and resources for GEOLYTIX hosted production deployments to Vercel. The browser development console will prompt an exception if a CSP policy is missing.

## Public resources

All folders and files in the /public folder are made available to api [serverless] function through the `includeFiles` config.

A rewrite can be added to access these files through the host.

## Rewrites

Source paths for XYZ endpoints can be amended with a directory string in order to access the XYZ api on a path from the application domain assigned by vercel.

### DIR

The `DIR` environment variable must be set with the URL path used to prefix source rewrites.

### SAML

A rewrite for the SAML endpoint must be added if [SAML is made available for the instance](https://github.com/GEOLYTIX/xyz/wiki/Security#saml-sso).

```json
{
  "source": "/saml/(.*)",
  "destination": "/api/api.js"
},
```

## .vercel

A successful deployment to Vercel will create a `.vercel` project folder in the root directory. Subsequent production deployments `vercel --force --prod` will automatically overwrite the existing deployment. The `.vercel` folder must be deleted in order to create a new or update a different deployment hosted through the Vercel platform.

