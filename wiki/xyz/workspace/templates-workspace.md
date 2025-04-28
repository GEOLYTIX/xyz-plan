The Workspace Templates is an object with object properties. Each workspace.templates{} property identified by a unique key is considered a template. Templates can be accessed by the Workspace API to compose complex locale and layer objects.

A template object in the workspace.templates can have a src property. The src string supports variable substitution. The `${RESOURCES}` parameter in the this example will be substituted with the `SRC_RESOURCES` environmental variable value.

```json
  "templates": {
    "OSM_tile_layer": {
      "format": "tiles",
      "URI": "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    "OSM_tile_layer_src": {
      "src": "${RESOURCES}/templates/osm_layer.json"
    },
    "osm_attribution": {
      "attribution": {
        "© OpenStreetMap": "http://www.openstreetmap.org/copyright"
      }
    },
    "osm_bw_style": {
      "style": {
        "contextFilter": "grayscale(100%)"
      }
    }
  }
```

A template defined with a src property will be imported and merged into the workspace.templates{} by the getTemplate module.

```json
{
  "note": "This object is imported from the osm_layer.json file.",
  "name": "This property will be overwritten by the name defined in a layer object."
  "format": "tiles",
  "URI": "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}
```

The getTemplate module will assign the cached flag to a template object merged from a JSON src. A cached template will be returned from the workspace.templates the src will not be fetched again.

The getTemplate module will return an error if unable to fetch a src.

## Locale/Layer template

Locale and layer objects can be composed from templates by the Workspace API. A locale/layer object with a workspace.templates key matching a locale/layer template string property will be merged deep into a clone of the template object before being returned. In this example the `name` property will overwrite the name property in the `OSM_tile_layer` template.

```json
"OSM": {
  "name": "OSM",
  "template": "OSM_tile_layer",
  "display": "true"
}
```

### Locale/Layer template{}

The template can be defined as an object in the locale/layer object. A template object requires a key property and will be merged into the workspace.templates{} before the locale/layer object is merged deep with the template object.

```json
"OSM": {
  "name": "OpenStreetmap",
  "template": {
    "key": "osm_layer"
    "src": "${RESOURCES}/templates/osm_layer.json"
  }
}
```

The `_type="template"` property will be assigned to the locale/layer template{} object in the workspace.templates{}. Templates defined in the workspace have the `_type="workspace"` property, and default templates assigned to every workspace have the `_type="core"` property.

## Locale/Layer templates[]

Multiple workspace.templates{} referenced by their key in the locale/layer object templates[string] property will be merged deep into the locale/layer object. The merged is processed left to right and properties in each template object will overwrite existing locale/layer properties. The `osm_attribution` and `osm_bw_style` templates will be merged into the `OSM` layer object after the object has been merged into the `osm_layer` template fetched from its src.

```json
"OSM": {
  "name": "OpenStreetmap",
  "template": {
    "key": "osm_layer"
    "src": "${RESOURCES}/templates/osm_layer.json"
  },
  "templates": ["osm_attribution", "osm_bw_style"]
}
```

## locale.layer{} default for locale.layers{}

The locale.layer{} object is the default object for every layer object defined in the locale.layers{}. Each layer object from the locale.layers{} will be merged into a clone of the locale.layer{} object. The `repo` attribution property entry will be added to the attribution of each layer referenced in the locale.

```json
  "locale": {
    "layer": {
      "attribution": {
        "repo": "https://github.com/GEOLYTIX/xyz"
      }
    }
  }
```

## workspace.locale{} default for workspace.locales{}

The workspace.locale{} object is the default object for every locale object defined in the workspace.locales{}. Each locale object from the workspace.locales{} will be merged into a clone of the workspace.locale{} object.

## Deep merging of workspace object

Workspace objects which are merged deeply with the XYZ merge utility module. String properties will overwrite the property in the object. Array items will be added to an existing array property only if the arrays are different.
