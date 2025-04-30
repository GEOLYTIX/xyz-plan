# Locale

A locale defines the functional and geographical extent of a mapview. The Workspace API can compose a JSON locale from templates. The JSON locale is provided as a params argument property to the mapview decorator method.

## .locales[]
Locales can be nested with the locales array property. A locale template which is not listed in the workspace.locales{} can be referenced by key in the locales array. The Workspace API will return a JSON locale composed from the nested locale merged into the parent locale.

For example selecting the UK locale nested within the Europe will add layers defined in the UK locale template to the JSON locale layers returned from the Workspace API. The extent object defined in the Europe locale will be overwritten by the `extent{}` defined in the UK template. The `UK.locales[]` array property will overwrite `Europe.locales[]` property. This allows further nesting by selecting a locale template nested in the UK locales. Locales can be role restricted. The composed Europe.UK.Admin locale is only accessible to a user with the admin role.

```json
{
  "templates": {
    "UK": {
      "extent": {
        "north": 63,
        "east": 7,
        "south": 47,
        "west": -15,
        "mask": true
      },
      "layers": {
        "cities": {}
      },
      "locales": ["Retail", "Admin"]
    },
    "Retail": {},
    "Admin": {
      "roles": {
        "admin": true
      }
    }
  }
  "locales": {
    "Europe": {
      "extent": {},
      "layers": {
        "capitals": {}
      },
      "locales": ["UK", "France", "Germany", "Spain", "Italy"]
    }
  }
}
```

## .roles{}
The locale.roles{} defines which user roles have access to a locale. A role is referenced by its key in the roles{} object. A role key prefixed with an exlamation mark indicates a negated role. The role expression applies to all users which do not have the negated role. The role object itself will be merged into the composed JSON locale.

## .key
A locale is referenced by a unique key property. This key property is either from the workspace.locales{} or the workspace.templates{}. A locale composed from multiple nested locales will have an array key property which defines the nesting.

## .name
A locale can have an optional name property for display within the MAPP interface. The key will be used if the name property is not set.

## .extent{}
The extent defines the geopgraphic limits of a mapview decorated with a locale. It is not possible to pan the viewport outside its extent. The extent will also limit the min zoom. It is not possible to zoom out to a level where the viewport would exceeed the extent. The mapview area outside the extent can be covered with the `mask` property flag.

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
The centre of the mapview view[port] will be set to the fit the locale extent. The initial mapview view can be set to an explicit `lat`, `lng`, and `z`.

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

The `locale.minZoom` integer value will limit minimum zoom [out] level of the mapview. The relevant mapview zoom control will be disabled if the minZoom level is matched by the viewport.

## .maxZoom

The `locale.maxZoom` integer value will limit maximum zoom [in] level of the mapview. The relevant mapview zoom control will be disabled if the minZoom level is matched by the viewport.

## [.ScaleLine](https://openlayers.org/en/latest/examples/scale-line.html)

The `locale.ScaleLine` string property defines the display of an Openlayers scale element in the mapview. The string value configures the units used in the scale element text. The default value is "metric".

```
"scaleLine": "imperial"
```

## .syncPlugins[]
An array of plugin method keys can be defined to be executed synchronously prior to any other plugins being executed asynchronously. By default the array of plugin methods defines the order of the buttons for the default view as zoomBtn, admin, and login.

```js
syncPlugins: ["zoomBtn", "admin", "login"];
```

## .plugins[]
The locale.plugins[] array property is an array of src string for [ESM] modules to be dynamically imported.

```json
"plugins": ["path/script.js"]
```

### .[custom]{} plugin
The mapview decorator methods checks all locale keys. The locale property and the mapview object itself will be provided as arguments to mapp.plugins{} method property matching the locale key. The mapview decorator is executed before layers are added to a decorated mapview.

## .locator
The locator is a mapp plugin method which adds a button to the mapview controls.
```json
"locator":true
```

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

## .queryparams{}
The `locale.queryparams{}` will be assigned to the `layer.queryparams{}` and location [infoj] entry `.queryparams{}`. To create a parameter string for a query.

## .layer{}
The Workspace API will merge the `locale.layer{}` object into every JSON layer referenced in a locale.

This example will add a default filter for country_code field value to match the "GBR" string to every layer.

```json
"layer": {
  "filter": {
    "default": {
      "country_code": {
        "match": "GBR"
      }
    }
  }
}
```

## .layers{}
Only layers within the `locale.layers{}` object are available within the context of a locale being used to initialise a mapview.

A layer is referenced by its key in locale.layers{}. A JSON locale requested from the Workspace API will contain an array of layer [keys] available to the user requesting the locale for a mapview.

A [layer] template whose key is matching a key in the `.layers{}` object will be assigned to the layer object when the JSON layer is requested from the Workspace API.

## .gazetteer{}
A gazetteer can be configured for a locale to provide a query tool for locations referenced by a location property matching a search term. The mapp.ui library provides an input interface to display the gazetteer query response in a dropdown for selection.

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

### gazetteer.layer
A `layer` must be referenced by its `mapview.layers` key in order to query and get a location from the layer. Any current [layer] filter as well as role restrictions will apply.

### gazetteer.qterm
The `qterm` defines the field which will be queried for the search term.

### gazetteer.table
Query this `table` instead of the layer table.

### gazetteer.placeholder
Set the gazetteer input placeholder. Can not be set within `.datasets[]`.

### gazetteer.label
The field which will be returned in the results. By default this is the `qterm`, however it is possible to query one field but display a different field as label in the gazetteer results.

### gazetteer.title
The title is shown next to the records in the gazetteer results. The title tag will default to `layer.name`, or `provider` is not implicit.

### gazetteer.leading_wildcard
Whether the SQL search term should be prefixed with a wildcard [%].

### gazetteer.limit
Limits the maximum number of results per search/dataset. Defaults to 10.

### gazetteer.no_result
The result string to be shown for a gazetteer/dataset query which doesn't return any results. No result entry will be shown for `no_result:null`.

### gazetteer.maxZoom
Limits the zoom level when setting the mapview viewport for a location from a gazetteer search.

### gazetteer.provider
It is possible to enable external gazetteer services through plugins. These services may require API keys and are documented in their respective plugin documentation.

Plugins for access to [Google [Places]](https://github.com/GEOLYTIX/mapp/blob/main/plugins/googleMaps.md) and [Mapbox [Forward-Geocoding]](https://github.com/GEOLYTIX/mapp/blob/main/plugins/gazetteer_mapbox.md) are available in the MAPP repository.

A new location is being created from the external gazetteer response. The `gazetteer.layer` and `qterm` will be ignored for provider queries.

### .datasets[]
Additional queries are made for each dataset defined in the datasets array. A `placeholder` or `provider` can not be defined in a dataset. The `layer` and `limit` parameter will be taken from the gazetteer configuration if not implicit in the dataset configuration.
