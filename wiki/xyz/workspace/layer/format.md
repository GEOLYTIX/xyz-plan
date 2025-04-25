# .format

The `layer.format` defines the nature of a layer when being added to a mapview and decorated.

## MVT (Mapbox Vector Tile)

The layer data is provided as tiles in the Mapbox Vector Tile format. Requests to the XYZ Layer API must reference the tile using /zoom/x/y slippy tile name. Tiles maybe cached in the `.mvt_cache` table. Cached tiles may not be used with layer filter and dynamic feature properties.

MVT features can have any geometry type.

MVT feature geometry must be `SRID:3857`.

```json
"format": "mvt",
"mvt_cache": "table_name",
```

## Vector (WKT, Geojson, Cluster)

The Vector format should be used for `wkt`, `geojson` and `cluster` formats.
As of v4.7.2 the methods have been combined into `vector.mjs` for ease of maintainability.

```json
"type": "vector",
"cluster":{
  "resolution":0.2,
  "distance": 10,
  "label": "field",
  "hexgrid": true
},
"fade": true
```

Parameters:
`layer.cluster` - Object containing: <br>

1. `resolution` (optional) - Required for cluster format layers. This is a fraction of the average tile length at a given zoom level [z param].<br>
2. `distance` (optional) - Required for WKT format layers.<br>
   NOTE - `resolution` and `distance` are mutually exclusive, you CANNOT use them together. <br>
3. `label` (optional) - The label field to use when clicking on a cluster, defaults to the `layer.qID`. <br>

- `layer.hexgrid` - A flag that if set to `true`, A hex grid aggregation will be applied.<br>
- `layer.fade` - A flag that if set to `true`, will fade the layer while requesting new data.

## MapLibre

The maplibre library will be dynamically loaded if not found as global. An `.accessToken` must be provided to access private datasets and styles hosted by mapbox.

```json
"mapbox_light": {
  "format": "maplibre",
  "accessToken": "XXXXX",
  "preserveDrawingBuffer": true,
  "style": {
    "zIndex": 98,
    "URL": "mapbox://styles/XXX/XXX"
  }
}
```
