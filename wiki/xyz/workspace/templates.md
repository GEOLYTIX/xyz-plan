# Templates

Templates are JSON objects in the workspace.templates{} which can be accessed through their key property.

Templates are only available to the XYZ API. The Workspace API can use templates to compose JSON layer and locale objects for the MAPP API.

A layer which is accessible from multiple locales should be stored as a template once to reduce duplicate JSON. The same template [key] can be referenced from multiple JSON locale or layer.

A query template can be referenced with a key property inside a layer or plugin configuration. The template will be added to the workspace.templates once the Workspace API parses the parent object.

A template with a roles{} object can be referenced by multiple locale or layer sharing the same access restrictions.

## template .src and file caching

The src [string] property of a template object defines the location from which the Workspace API will fetch a template when required.

The src property will be removed if a resource is fetched from outside the [local] file system. This will effectively cache the template in the workspace.templates{}. Fetching multiple resources to compose a layer object for every query in which the layer is referenced would be a significant overhead to the Workspace API. Access to the file system is assumed to be immediate, hence a template can always be fetched from a `file:` src when required.

- **file:** The template is loaded from the file system. Files in the `/public/*` folder can be referenced from the application root. Files in folders outside the application root can be referenced by stepping out of root directory `file:../templates/template.json`
- **https:** The template is loaded from a public URL.
- **cloudflront:** The template will be loaded from a [secure] Cloudfront CDN.

The Workspace API will return an error if unable to fetch a template from its src property.

### SRC\_\* variable substitution

The src [string] property may contain a substitute variable. Before a template is fetched from the src location the string variable will be substituted with the value from a `SRC_*` environment variable which matches the string variable.

## Locale/Layer .template [string] property

A locale or layer which references a workspace.templates{} key in template [string] property will be merged into a clone of the template.

In this example the `name` property of the `OSM` object will overwrite a name property in the `OSM_tile_layer` template.

```json
{
  "OSM": {
    "name": "OSM",
    "template": "OSM_tile_layer"
  }
}
```

### Locale/Layer .template{} property

The template property can be an object with a src [string] property. In this example the Workspace API will fetch the template from its src when the `OSM` object is requested as a layer. The template will be cached in the workspace.templates{} with the src property as key if the object has no explicit key property.

```json
{
  "OSM": {
    "name": "OSM",
    "template": {
      "src": "${RESOURCES}/templates/osm_layer.json"
    }
  }
}
```

## Locale/Layer .templates[] array property

Locale and layer objects can be composed from multiple templates referenced in the templates[] array property.

The templates referenced in the templates[] array are merged left to right into the locale or layer object.

In this example the `OSM` layer object is first merged into the `osm_layer` template overwriting the template `name` property. Thereafter the `osm_attribution` and the `osm_bw_style`[fetched from its src] will be merged into `OSM` object.

```json
{
  "OSM": {
    "name": "OSM",
    "template": {
      "src": "${RESOURCES}/templates/osm_layer.json"
    },
    "templates": [
      "osm_attribution",
      {
        "src": "${RESOURCES}/templates/osm_bw_style.json"
      }
    ]
  }
}
```

## locale.layer{} default for locale.layers{}

The locale.layer{} object is the default object for every layer object defined in the locale.layers{}. Each layer object from the locale.layers{} will be merged into a clone of the locale.layer{} object.

In this example the `repo` attribution property entry will be added to the attribution of each layer referenced in the locale.

```json
{
  "locale": {
    "layer": {
      "attribution": {
        "repo": "https://github.com/GEOLYTIX/xyz"
      }
    }
  }
}
```

## workspace.locale{} default for workspace.locales{}

The workspace.locale{} object is the default object for every locale object defined in the workspace.locales{}. Each locale object from the workspace.locales{} will be merged into a clone of the workspace.locale{} object.

## Deep merging of workspace object

Workspace objects are merged deeply with the XYZ API merge utility. String properties will overwrite the property in the object. Array items will be added to an existing array property only if the arrays are different.

## Query templates

A query template is referenced in parameterised request to prevent SQL injection. The XYZ API will never directly accept SQL as a paramater. A SQL query template must be referenced in a query request with parameters for the query template string interpolation being validated by the XYZ API or substituted in the database.

```json
{
  "table_parameter_query": {
    "template": "SELECT * from ${table}"
  },
  "nnearest_locations": {
    "src": "file:/public/js/queries/nnearest_locations.sql",
    "dbs": "DEV"
  },
  "module_query": {
    "src": "file:/public/js/queries/infotip.js",
    "module": true,
    "dbs": "DEV"
  }
}
```

### Query .template object

A query template can be defined as template[string] property inside a template{} object property. This template will be added to the workspace.templates as soon as the containing layer object is parsed by the Workspace API.

The template{} object must have a key[string] property in order to be referenced in a query[string] property.

In this example a location [infoj] entry requires the `count_rows` query [template]. The template[string] is defined in the template{} object. The template will be added as `count_rows{}` to the workspace.templates{} the first time the containing layer is referenced in any query.

```json
{
  "query": "count_rows",
  "template": {
    "key": "count_rows",
    "template": "SELECT count(*) $ FROM ${table}",
    "dbs": "DEV"
  }
}
```

Instead of a template[string] the template{} object may also contain a src[string] property. The template will be fetched from the src when required by the Query API.

### Query module .render() method

The default export of a javascript module [ESM] will be assigned as render() method to the workspace template after the module script has been fetched from a src property. Query modules are not cached but will only be fetched when referenced in a query.

## View templates

Application views are html templates available to the View API.

```json
{
  "embedded": {
    "src": "file:public/views/embedded.html"
  }
}
```

## Template \_type

The `_type="template"` property will be assigned to any workspace.templates{} object which is added from another template object.

Templates defined in the workspace have the `_type="workspace"` property, and default templates assigned to every workspace have the `_type="core"` property.

