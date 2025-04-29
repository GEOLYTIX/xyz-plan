# Locale

A locale defines the functional and geographical extent of a mapview. A locale JSON object can be retrieved from the Workspace API and must be passed to the _MAPP.Mapview_ decorator with the params argument. The default script will check whether any of the locale keys match MAPP.plugins and provide the mapview as well as the key argument to the plugin method.

## .name

A locale is referenced by it's `key`. A `name` can be defined for display in the locales dropdown. The locale key is assigned as name if undefined.

## .extent{}

The locale `extent` defines the geopgraphic limits of the mapview. It is not possible to pan the viewport outside the defined extent. The extent will also limit the min zoom. It is not possible to zoom out to a level where the viewport would exceeed the extent. The mapview beyond the extent will covered with a shade if the `mask` flag is set in the extent configuration.

```json
{
  "extent": {
    "north": 91,
    "east": 91,
    "south": 91,
    "west": 91,
    "mask": true
  }
}
```

## .view{}

The centre of the mapview view[port] will be set to the fit the locale extent. The `view` can be set to an implicit `lat`, `lng`, and `z`.

```json
{
  "view": {
    "lat": 91,
    "lng": 91,
    "z": 15
  }
}
```

## .minZoom

The `.minZoom` integer value will limit the mapview's minimum zoom level. The relevant mapview zoom control will be disabled if the MinZoom level is matched by the current viewport.

## .maxZoom

The `.maxZoom` integer value will limit the mapview's maximum zoom level. The relevant mapview zoom control will be disabled if the MinZoom level is matched by the current viewport.

## [.ScaleLine](https://openlayers.org/en/latest/examples/scale-line.html)

The `.ScaleLine` property in the mapview configuration allows you to specify the unit for the scale bar, enhancing the localization of the scale representation on the map.

#### Configuration Options

- **`ScaleLine`** (string, optional): Specifies the unit for the scale bar. Acceptable values are 'metric' or 'imperial'. If not specified, the default value is 'metric'.

## .gazetteer{}

A gazetteer can be configured for a locale to provide a query tool for locations referenced by a location property matching a search term. The mapp.ui library provides an input interface to display the gazetteer query response in a dropdown for selection.

### .layer

A `layer` must be referenced by its `mapview.layers` key in order to query and get a location from the layer. Any current [layer] filter as well as role restrictions will apply.

### .qterm

The `qterm` defines the field which will be queried for the search term.

```json
"gazetteer": {
  "layer": "retailpoints",
  "qterm": "store_name"
}
```

Optional configuration keys are:

### .table

Query this `table` instead of the layer table.

### .placeholder

Set the gazetteer input placeholder. Can not be set within `.datasets[]`.

### .label

The field which will be returned in the results. By default this is the `qterm`, however it is possible to query one field but display a different field as label in the gazetteer results.

### .title

The title is shown next to the records in the gazetteer results. The title tag will default to `layer.name`, or `provider` is not implicit.

### .leading_wildcard

Whether the SQL search term should be prefixed with a wildcard [%].

### .limit

Limits the maximum number of results per search/dataset. Defaults to 10.

### .no_result

The result string to be shown for a gazetteer/dataset query which doesn't return any results. No result entry will be shown for `no_result:null`.

### .maxZoom

Limits the zoom level when setting the mapview viewport for a location from a gazetteer search.

### .provider [plugin]

It is possible to enable external gazetteer services through plugins. These services may require API keys and are documented in their respective plugin documentation.

Plugins for access to [Google [Places]](https://github.com/GEOLYTIX/mapp/blob/main/plugins/googleMaps.md) and [Mapbox [Forward-Geocoding]](https://github.com/GEOLYTIX/mapp/blob/main/plugins/gazetteer_mapbox.md) are available in the MAPP repository.

A new location is being created from the external gazetteer response. The `gazetteer.layer` and `qterm` will be ignored for provider queries.

### .datasets[]

Additional queries are made for each dataset defined in the datasets array. A `placeholder` or `provider` can not be defined in a dataset. The `layer` and `limit` parameter will be taken from the gazetteer configuration if not implicit in the dataset configuration.

```json
"gazetteer": {
  "layer": "retailpoints",
  "qterm": "store_name",
  "leading_wildcard": true,
  "limit": 5,
  "datasets": [{
    "title": "Postcode"
    "qterm": "postcode"
  }]
}
```

## .roles{}

The `locale.roles{}` defines which user roles have access to a locale. A role is referenced by its key in the roles{} object. A role key prefixed with an exlamation mark indicates a negated role. The role expression applies to all users which do not have the negated role.

## .queryparams{}

The `locale.queryparams{}` will be assigned to the `layer.queryparams{}` and location `entry.queryparams{}`.

## .locator

The `.locator:true` flag can be set to add a locator button to the MAPP default view button column.

## .plugins[]

Plugins are javascript modules which are loaded and executed from src strings in the `locale.plugins[]` array.

```json
"plugins": ["path/script.js"]
```

### .syncPlugins[]

An array of plugin method keys can be defined to be executed synchronously prior to any other plugins being executed asynchronously. By default the array of plugin methods defines the order of the buttons for the default view as zoomBtn, admin, and login.

```js
syncPlugins: ["zoomBtn", "admin", "login"];
```

## .[custom]{} mapview plugin

The MAPP default view script checks any locale keys against the `mapp.plugins{}` after a locale is used to initialise the mapview, but _before_ layers are added to the mapview. The [custom] locale key-value is provided as first argument to the plugin method, and the mapview itself is provided as second argument.

## .svg_templates{}

SVG templates defined in the `locale.svg_templates{}` are cached as string values available for parameter substitution through the svgSymbols utility.

```json
"svg_templates": {
  "template_pin": "https://geolytix.github.io/MapIcons/pins/pink_master_pin.svg"
}
```

## .listview_records[]

An array for the symbol and colour being assigned to `mapview.locations{}` when the location [view] is added to a `locations.listview`. This defaults to a list A to J with a non repetitive rainbow spectrum for the colours.

```json
"listview_records": [
  {
    "symbol": "1",
    "colour": "#000000"
  },
  {
    "symbol": "2",
    "colour": "#DD0000"
  },
  {
    "symbol": "3",
    "colour": "#FFCE00"
  }
],
```

## .layer{}

The layer JSON will be merged with the `locale.layer{}` when a layer is added to a mapview. The `locale.layer{}` acts as a master template for all layers in a locale. This allows to assign the same filter or draw defaults to every layer in a locale.

```json
"layer": {
  "filter": {
    "current": {
      "country_code": {
        "match": "GBR"
      }
    }
  },
  "draw": {
    "defaults": {
      "country_code": "GBR"
    }
  }
}
```

## .layers{}

Only layers within the `locale.layers{}` object are available within the context of a locale being used to initialise a mapview.

A layer is referenced by its key in locale.layers{}. A JSON locale requested from the Workspace API will contain an array of layer [keys] available to the user requesting the locale for a mapview.

A [layer] template whose key is matching a key in the `.layers{}` object will be assigned to the layer object when the JSON layer is requested from the Workspace API.
