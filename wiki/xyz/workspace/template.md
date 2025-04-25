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
