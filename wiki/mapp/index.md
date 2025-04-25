# MAPP

MAPP is a library for web mapping applications based build around the Openlayers map component.

The MAPP [Client] API is an interface for the XYZ [Host] API. The built JS module library must be loaded together with it's associated CSS file in the document head of an [**Application View**](https://github.com/GEOLYTIX/xyz/wiki/Application-Views).

It is recommended to defer load the OpenLayers library distribution from a CDN [eg. jsdelivr] prior to loading the MAPP library.

```html
<script src="https://cdn.jsdelivr.net/npm/ol@v10.2.1/dist/ol.js" defer></script>
<link rel="stylesheet" href="{{dir}}/public/css/mapp.css" />
<script type="module" src="{{dir}}/public/js/lib/mapp.js" defer></script>
```

Detailed [documentation](https://github.com/GEOLYTIX/xyz/blob/main/DOCUMENTATION.md) of the MAPP API modules is provided as JS-DOC pages built directly from the /lib source directory.

The JS-DOC pages are hosted as GitHub Pages from the XYZ repository:

https://geolytix.github.io/xyz/mapp

The MAPP module is written as vanilla javascript and does not support type script classes. Types are defined as globals with JS-DOC.

## MAPP Module

The [MAPP Library module](https://geolytix.github.io/xyz/mapp/module-mapp.html) assigns the mapp object to self [the global document window]. The module will check whether the OpenLayers library has already been assigned to the window. Otherwise the module append a script tag element for the OL library to the document head.

## Decorator pattern

The MAPP API uses a decorator pattern where an object argument provided to a decorator method is returned from the method.

```js
// The JSON layer object provided to the decorate method will be decorated as a mapp-layer type.
await await mapp.layer.decorate(layer);

// Log all the mapp-layer property names.
console.log(console.log(Object.getOwnPropertyNames(layer)));
// ['display', 'format', 'URI', 'attribution', 'key', 'dbs', 'name', 'zIndex', 'mapview', 'source', 'projection', 'paramString', 'L', 'show', 'showCallbacks', 'hide', 'hideCallbacks', 'tableCurrent', 'geomCurrent', 'zoomToExtent', 'draw', 'filter']

// Provide object literal as location argument to be returned as a decorated mapp-location type.
const location = mapp.location.decorate({
  id:"488",
  locale:"locale",
  table:"public.scratch",
  layer
})

// Log all the mapp-location property names.
console.log(console.log(Object.getOwnPropertyNames(location)));
// ['layer', 'id', 'hook', 'locale', 'getTemplate', 'table', 'infoj', 'flyTo', 'Layers', 'remove', 'removeCallbacks', 'removeEdits', 'restoreEdits', 'trash', 'update', 'syncFields', 'updateCallbacks']
```

## Mapview

### JSON Locale

A JSON Locale including JSON Layer can be requested from the [XYZ Workspace API](https://geolytix.github.io/xyz/module-_workspace.html).

### Query Templates.

The locale and layer configuration may be changed locally but the workspace cached in the XYZ API secures data access through templates which can not be altered in the client.

Parameter may be provided to a stored [layer] query template to define which fields should be loaded from a table.

## Layer

### OL Layer

## Location

### Infoj
