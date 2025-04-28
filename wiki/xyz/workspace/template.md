# Template

A template can be a view, layer, or query [module].

Templates are only available to the XYZ API and are used to assemble a JSON locale and layers for the MAPP client.

### .template

The `.template` key-value is a string representation of a SQL [query] or html [view] template. If not implicit in the template definition a template string can be loaded from an external source.

### .src

The workspace is assembled and cached upon initialisation of an XYZ process. The template `src` is a reference for XYZ API to load the template from an external source. The source formats are supported:

- `https:` The template is loaded from a public URL.
- `file:` The template is loaded from the local file system. The root being the application root, only files from the `/public/*` directory can be loaded as templates when deployed. On the localhost it is possible to prefix the file path with a double dot to step out of the XYZ repository and load templates from other folders like so: `file:../resources_repository/templates/etc`
- `cloudflront:` The template will be loaded from the Cloudfront CDN. A [KEY_CLOUDFRONT environment variable](https://github.com/GEOLYTIX/xyz/wiki/Process-Environment#key_cloudfront) is required to provide signed access to secured Cloudfront ressources.

#### SRC\_\*

The Workspace API which assembles and caches the workspace will interpolate src strings prior to loading templates. A variable defined within a interpolation expression (`${variable}`) will be substituted with the corresponding [SRC\_\* environment variable](https://github.com/GEOLYTIX/xyz/wiki/Process-Environment#src_).

## Query [template]

A query template is referenced in parameterised request to prevent SQL injection. The XYZ API will never directly accept SQL as a paramater. A SQL query template must be referenced in a query request with parameters for the query template string interpolation being validated by the XYZ API or substituted in the database.

```js
"table_parameter_query": {
 "template": "SELECT * from ${table}",
},
"nnearest_locations": {
  "src": "file:/public/js/queries/nnearest_locations.sql",
  "dbs": "DEV"
},
"module_query": {
  "src": "file:/public/js/queries/infotip.js",
  "module": true,
  "dbs": "DEV"
},
```

### .module

A template flagged as a module (`.module = true`) must be loaded from an external source. The Workspace API will compile a JS module directly from the [file] source.

### .render()

A template render method cannot be assigned as a string value in the JSON workspace. The Workspace API will the `Module.exports` as the template .render() method when compiling a module from its source.

## View [template]

Application views are html templates available to the [View API](https://github.com/GEOLYTIX/xyz/wiki/XYZ---API#viewtemplate)

e.g. https://geolytix.dev/latest/view/embedded

```js
"embedded": {
 "src": "file:public/views/embedded.html"
}
```

## Layer [template]

Layer templates allow for the same layer to be used in multiple locales without the need to duplicate the layer JSON. The XYZ host will assign the layer JSON template to the layer JSON if referenced as layer.template key-value. Partials can be defined in the layer.templates[] array. Partials will be merged with the layer JSON instead of using Object.assign().


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