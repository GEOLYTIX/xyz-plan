# MAPP.UI

The MAPP.UI library expands the MAPP library to build engaging [**Application Views**](https://github.com/GEOLYTIX/xyz/wiki/Application-Views).

The MAPP.UI library and associated style sheets must be loaded after the MAPP library.

```html
<script src="https://cdn.jsdelivr.net/npm/ol@v10.2.1/dist/ol.js" defer></script>
<link rel="stylesheet" href="{{dir}}/public/css/mapp.css" />
<script type="module" src="{{dir}}/public/js/lib/mapp.js" defer></script>
<link rel="stylesheet" href="{{dir}}/public/css/ui.css" />
<script type="module" src="{{dir}}/public/js/lib/ui.js" defer></script>
```

Detailed [documentation](https://github.com/GEOLYTIX/xyz/blob/main/DOCUMENTATION.md) of the MAPP.UI API modules is provided as JS-DOC pages built directly from the /lib/ui source directory.

The JS-DOC pages are hosted as GitHub Pages from the XYZ repository:

https://geolytix.github.io/xyz/mapp

## MAPP.UI Module

The [MAPP UI Library module](https://geolytix.github.io/xyz/mapp/module-ui.html) assigns itself to the mapp object.
