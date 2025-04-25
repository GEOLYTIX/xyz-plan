Plugins can be used to extend the functionality of the mapp and mapp.ui libraries.

Plugins are esm modules which can be dynamically loaded with the [mapp.utils.loadPlugins()](https://geolytix.github.io/xyz/mapp/module-_utils_loadPlugins.html) method.

Plugins in turn may import after esm modules to expand the functionality of either Mapp or Openlayers.

A selection of useful sample plugins is available in the [GEOLYTIX/mapp](https://github.com/GEOLYTIX/mapp/tree/main/plugins) repository.

# Loading plugins

An array of plugins can be configured in the locale. Any plugins in this array will be loaded by the mapview decorator method in the default view.

```js
"plugins": [
  "https://geolytix.github.io/mapp/plugins/coordinates.js",
  "https://geolytix.github.io/mapp/plugins/measure_distance.js"
]
```

## Layer plugins

The [mapp.layer.decorate](https://github.com/GEOLYTIX/xyz/wiki/MAPP#decoratelayer) method will check whether any keys on the layer matches a mapp.plugins method and will call that method with the JSON layer as only argument. Configuration for these plugins should be as an object assigned to the key. For example a plugin which assigns a custom style method to a layer could have a resource locator for a svg as configuration.

```js
"custom_style": {
 svg: "https://geolytix.github.io/MapIcons/pins/red.svg"
}
```

The layer view does not exist when a layer is decorated. Layer views are created by the mapp.ui library. A layer view plugin should be assigned to mapp.ui.layers.panels. The layer view creation method will call the panels method with the JSON layer as only argument.

## Locale plugin

Locale plugins are executed if property keys of the locale match a plugin in the mapview decorator method. The plugin method will executed with the property object and the mapview object provided as arguments to the plugin method.

## Location plugins

Location plugins should be assigned to mapp.ui.locations.entries. The entry which has a location and associated layer as argument will be passed with any custom configuration to the entries plugin method.
