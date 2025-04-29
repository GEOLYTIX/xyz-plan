# Layer

A JSON layer is a configuration object which can be added to a mapview. The MAPP library will decorate the JSON layer when it is added to the mapview to create a functional layer object which can be accessed through the mapview.layers list object.

## .template

The layer object will be merged into a template which matches the layer key. Alternatively a template can be referenced by the template property.

## .templates[]

Multiple templates can be assigned to the JSON layer. The Workspace API will merge these templates in order into the layer object.

**Please note the reversed order: The layer is merged into a template. But templates are merged into the layer.**

## .name

If not set the JSON layer key will be assigned as the layer's name. The name is assigned to the header of a layer view.

## .meta

The meta property value will be parsed as innerHTML for an element in the `layer.view` node.

## .group

Layer views will be grouped in a layer listview group drawer. The key-value of the `layer.group` property will be assigned as the group element header.

## .groupmeta

The `layer.groupmeta` property value will be parsed as innerHTML for an element in the `layer.group` node which contains the `layer.view` node.

## .display

The `layer.display` will determine whether the layer is displayed as default when added to a mapview without a layers URL parameter overriding which set of layers should be displayed.

## .hidden

The `layer.hidden` flag controls whether a layer view is created and shown in the layers listview. A layer without a view element is still accessible programatically through the `mapview.layers{}` object.

## .toggleLocationViewEdits

By default all location [infoj] entries with an edit key are editable. Setting the `layer.toggleLocationViewEdits` will prefix all edit entries with an underscore character. A spanner icon will be added to the `location.view` header to toggle the edit entries.

## .qID

Requests to the Location API require the field name for a unique location identifier.

## .table

The table name for the layer data at rest.

## .tables{}

Instead of the `layer.table` a `layer.tables{}` configuration object can be assigned to the JSON layer. The keys in the tables object representing an integer zoom level. The key-value is the table name for the keyed zoom level. A `null` value as the smallest or largest zoom key-value will make the layer unavailable at or beyond that zoom level. Without a null value the last defined table name in the tables object will be used.

```json
{
  "7": null,
  "8": "schema.table_1",
  "9": "schema.table_2",
  "10": "schema.table_3",
  "11": null
}
```

## .geom

The field name which stores the feature geometries in the layer table.

## .geoms{}

Instead of the `layer.geom` a `layer.geoms{}` configuration object can be assigned to the JSON layer. The keys in the geoms object representing an integer zoom level. The key-value being is the feature geometry field name for the keyed zoom level. The smallest or largest zoom level key-value will be assigned as geometry field in requests which are outside the specified zoom level range.

```json
{
  "8": "geom_50m",
  "9": "geom_10m",
  "10": "geom"
}
```

## .z_field [filter]

Features will be filtered if the `.z_field` integer value is below the current zoom level.

```json
{
  "z_field": "field"
}
```

## .srid

The SRID/EPSG projection code for the layer geometry field.

## .[custom]{} layer plugin

Any layer keys are checked against the `mapp.plugins{}` and `mapp.layer{}` methods when a layer is decorated. The decorated layer object which must have a mapview property is provided as only argument to the plugin/layer method.

## .deleteLocation

The `deleteLocation: true` flag indicates whether a location can be deleted from the layer's dataset.

## .queryparams{}

The `layer.queryparams` will be used assigned to layer queries and to location `entry.queryparams{}`. The `locale.queryparams{}` will be assigned to the `layer.queryparams{}`.

## .panelOrder[]

The order of layer panel in the layer view can be controlled with the `.panelOrder[]` array.

The default order is:

```js
.panelOrder: [
  'draw-drawer',
  'dataviews-drawer',
  'filter-drawer',
  'style-drawer',
  'meta'
]
```

## Vector Layer

`type: vector_layer` allows you to create an infoj object from a query.
<br>This infoj object will then create a tickbox and when checked will draw the points to the mapview.
<br>You can apply thematic styling to this layer and use labels as you can with other layer formats.

- `zIndex` (optional) - This allows control of the order of drawing.
- `display` (optional) - When set to `true` the points will load automatically when you click on a location.
- `label` - This is the label associated with the checkbox in the `infoj`.
- `query` - This is a query to select only the relevant geometries.
  <br>This requires a particular format as it cannot be a `src` but must be a `template`
  <br>NOTE - You need to return the geometry in the correct format for that layer type. e.g. `wkt` requires `ST_AsText(geom)`.

```json
"query_vector": {
     "template": "SELECT ST_AsText(geom_p_4326), thematic_field, thematic_label FROM table WHERE site_id=%{id}"
}
```

- `queryparams` - This is the parameters for the query.
  <br>You MUST pass `reduce:true` to the queryparameters.
- `style` - The style for the points.
  <br>Note, to use `label` and `theme/themes` you must pass `params.fields` array containing the `fields` used.

```json
{
  "label": "Label",
  "type": "vector_layer",
  "format": "wkt",
  "srid": "4326",
  "display": true,
  "query": "query_vector",
  "queryparams": {
    "id": true,
    "reduce": true
  },
  "params": {
    "fields": ["thematic_field", "thematic_label"]
  },
  "style": {
    "default": {
      "icon": {
        "type": "dot",
        "fillColor": "#f2fc"
      }
    },
    "label": {
      "field": "thematic_label",
      "title": "Label"
    },
    "theme": {
      "title": "Thematic",
      "type": "graduated",
      "field": "thematic_field",
      "cat_arr": [
        {
          "value": 0,
          "label": "0 to 500",
          "style": {
            "fillColor": "#f7fcf5",
            "fillOpacity": 0.5
          }
        },
        {
          "value": 500,
          "label": "500 to 750",
          "style": {
            "fillColor": "#e5f5e0",
            "fillOpacity": 0.5
          }
        }
      ]
    }
  }
}
```

### .edit{}

Editing is possible on locations, so the user could for instance alter a field name, add a comment or move a geometry and this would be stored to the database.

Adding `toggleLocationViewEdits: true` will add a spanner to the location entry that can be toggled for editing.

This is particularly useful if any of your fields use formatting or `fieldfx`.

This should be used as the default as it is much neater for the user.

It is also possible to edit field values within a location, and save these to the database.

```json
{
  "edit": true
}
```

#### .placeholder

If configured a placeholder will be set on the edit input element where available (eg. text, textarea, options)

```json
{
  "edit": {
    "placeholder": "Select from list",
    "options": ["A", "B"]
  }
}
```

#### Options

Three options here:

1. Provide defined options

```json
{
  "edit": {
    "options": ["A", "B"]
  }
}
```

2. Provide empty options array
   <br>This will then use the `distinct_values` template to get all values from the field on the table as provide them.

```json
{
  "edit": {
    "options": []
  }
}
```

3. Provide query
   <br>This will then run the provided query to get the values for the options.<br>This query must in the `workspace.templates` object.

```json
{
  "edit": {
    "query": "edit_options",
    "options": []
  }
}
```

#### Modifying Geometry

If you wish to edit geometry, then we must specify this in the `edit` object.

```json
{
  "infoj": [
    {
      "type": "geometry",
      "display": true,
      "field": "geom_p_4326",
      "fieldfx": "ST_asGeoJSON(geom_p_4326)",
      "edit": {
        "geometry": true
      }
    }
  ]
}
```

##### delete_label

- Providing an `edit.delete_label` will provide a custom label to the 'Delete Geometry' button.

```json
{
  "edit": {
    "geometry": true,
    "delete_label": "Delete Site Geometry"
  }
}
```

##### modify_label

- Providing an `edit.modify_label` will provide a custom label to the 'Modify Geometry' button.

```json
{
  "edit": {
    "geometry": true,
    "modify_label": "Move Site"
  }
}
```

### .dependents

Dependents allow us to set certain fields to be updated when another is edited.
<br>For instance, if the user can edit `type: geometry` we may wish to set the `type: pin` as a dependent, so that the pin is always shown in the correct location.
<br> We also set `dependents` on a field that is not editable by the user, but will be edited via a trigger on the database side.
<br>Here you can provide an array of `field` values that you wish to reload upon changes to the field in question.

```json
{
  "type": "geometry",
  "display": true,
  "field": "geom_p_4326",
  "fieldfx": "ST_asGeoJSON(geom_p_4326)",
  "dependents": ["pin", "field_1", "field_2"],
  "edit": {
    "geometry": true
  }
}
```

# Dataviews

A Layer Dataview (chart or table) is linked to a particular layer. Here the query used to create the dataview would likely select all rows from the table associated with the layer.

These Layer Dataviews are created within the `dataviews` object in the `layer.json` file.

## Table [dataview]

A Table Dataview returns a table to the `tabview`. This uses the [Tabulator Package](http://tabulator.info/docs/5.4/format) to do so, please refer to the documentation for table formatting options.

```json
{
  "dataview_key": {
    "target": "tabview",
    "display": true,
    "query": "query_name",
    "placeholder": "No Data Available",
    "queryparams": {
      "table": true,
      "filter": true
    },
    "viewport": true,
    "mapChange": true,
    "events": {
      "rowClick": {
        "util": "select",
        "layer": "uk_health",
        "zoomToLocation": true
      },
      "rowDblClick": {
        "util": "select",
        "zoomToLocation": true
      }
    },
    "table": {
      "selectable": true,
      "layout": "fitColumns",
      "columns": [
        {
          "title": "Field",
          "field": "field",
          "headerSort": false
        },
        {
          "title": "Count",
          "field": "value",
          "headerSort": false,
          "formatter": "toLocaleString"
        }
      ]
    }
  }
}
```

Here we can provide:

- `Dataview Name` - This generates a checkbox with the name provided in the Dataviews pane of the layer.
- `target: tabview` - This generates the dataview in the bar on the bottom of the MAPP window.
- `display: true`(optional) - This generates the dataview and but hides it from display. By default this is `false`.
- `placeholder`(optional) - This will display the text string to the user when no data is returned.
- `selectable: true`(optional) - This will allow the rows to be highlighted on hover <br> This must be provided inside the `tables` object, and the query used must return an id column.
- `selectable: true` must also be paired with the `events` object.
- `events` - This allows you to provide any Tabulator event and a function to run when that event occurs.
  <br> Typically we would want to provide `rowClick: select` which would perform a function on a single click.
  <br> If we wish to return a location from a different layer (cross-layer selection), then within the event we need to provide the key of that layer (uk_health in the example above), otherwise it will just return the location within the current layer.
  <br> We can also provide on double click to select and also zoom to that location.
- `viewport: true`(optional) - This will only return locations within the viewport (the map window) display. <br> The query must contain `WHERE true ${viewport}' for this to work.
- `mapChange: true`(optional) - This will refresh the dataview each time you stop zooming or panning in the map display display.
- `queryparams` - This provides the parameters you wish to pass to a query.
  <br> You can provide `table: true` which will provide the table defined on the layer. This is especially useful when using a template but defining the table for each locale within the layer.json. <br> This requires the SQL query to contain `FROM ${table}` to ensure it only returns information from the relevant table location.
  <br> You can provide `filter: true` which will pass the filters selected on the layer to the query. This requires `WHERE true ${filter}` to be added to the query.
  <br>But can provide whatever we want, perhaps a `table` or `filter: true` to ensure all filters are applied to the dataview.
- `formatter: toLocaleString`- This will add thousand separators to the number (1000 becomes 1,000).

### HeaderFilters

headerFilters are provided to allow the user to filter the information in the Tabulator tables.
<br> We have 3 headerFilters:

- `set`
- `numeric`
- `like`
- `date`

#### Set

This returns a dropdown with multiple options of which any number can be selected.

```json
{
  "title": "Field",
  "field": "field",
  "headerFilter": "set",
  "headerFilterParams": {
    "placeholder": "Select to Remove",
    "distinct": true,
    "layerFilter": true,
    "type": "ni"
  }
}
```

The headerFilterParams allow you to provide:

- A placeholder that is used on the dropdown on initial load.
- `distinct: true` which will return all values in that field on the database.
- You may also provide `options: ["A", "B"]` instead of `distinct:true`.
- `layerFilter: true` which will update the map with the filters applied within the table.
- `type: ni` which will remove from the table those values selected. The default is `type: in`.

#### Numeric

This returns two input boxes Min and Max for numeric filtering.

```json
{
  "title": "Field",
  "field": "numeric_field",
  "headerFilter": "numeric"
}
```

#### Like

This returns a free text box for filtering.

```json
{
  "title": "Field",
  "field": "field",
  "headerFilter": "like"
}
```

#### Date

The field to use this on must be of type `bigint`.
This returns two input boxes Min and Max for date filtering.
A full list of formatterParams for dates can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

```json
{
  "title": "Field",
  "field": "date_field",
  "headerFilter": "date",
  "formatter": "date",
  "formatterParams": {
    "options": {
      "year": "numeric",
      "month": "numeric",
      "day": "numeric"
    }
  }
}
```

### .toolbar{}

#### .clear_table_filters

Adds a toolbar button which will clear all current headerFilter.

```json
"toolbar": {
  "clear_table_filters": true
}
```

#### .download_csv{}

##### Tabulator Download

- The `.download_csv` can be set to a value of `true` which will just download the data using the built in Tabulator formatter on any Tabulator `dataview`.

```json
{
  "dataviews": {
    "table": {
      "display": true,
      "target": "tabview",
      "query": "query_dv",
      "toolbar": {
        "download_csv": true
      },
      "table": {
        "autoColumns": true,
        "columns": []
      }
    }
  }
}
```

##### MAPP.Utils.csvDownload

- You can also specify a custom object for the download the data which will specify: the fields, the titles and the formats of these fields.

###### Optional Params

- `string: true` - Add this to a field to escape any value (this is required to prevent the download incorrectly breaking lines at commas if they exist in a field value).
- Header - To specify that the title of each field is used as the header column, pass a value of `true`, by default this is `false`.
- Separator - To specify the separator, by default this is a comma.
- Type - To specify the download type, by default this is UTF-8 CSV.
- Join - To specify the join, by default this is '\r\n'.
- Title - To specify the title, by default this is `file`.

```json
{
  "download_csv": {
    "title": "DOWNLOAD_TITLE",
    "header": true,
    "fields": [
      {
        "field": "field_1",
        "title": "Field 1",
        "string": true
      },
      {
        "field": "field_2",
        "title": "Field 2"
      }
    ]
  }
}
```

## Chart [dataview]

A Chart Dataview returns a table to the `tabview`. This uses the [ChartJS Package](https://www.chartjs.org/docs/latest/) to do so, please refer to the documentation for chart formatting options.

```json
{
  "Dataview Name": {
    "target": "tabview",
    "display": true,
    "query": "query_name",
    "queryparams": {
      "table": true,
      "filter": true
    },
    "chart": {
      "options": {
        "aspectRatio": 1.4,
        "indexAxis": "x"
      }
    }
  }
}
```

Here we can provide:

- `Dataview Name` - This generates a checkbox with the name provided in the Dataviews pane of the layer.
- `target: tabview` - This generates the dataview in the bar on the bottom of the MAPP window.
- `display: true`(optional) - This generates the dataview and but hides it from display. By default this is `false`.
- `queryparams` - This provides the parameters you wish to pass to a query.
  <br> You can provide `table: true` which will provide the table defined on the layer. This is especially useful when using a template but defining the table for each locale within the layer.json. <br> This requires the SQL query to contain `FROM ${table}` to ensure it only returns information from the relevant table location.
  <br> You can provide `filter: true` which will pass the filters selected on the layer to the query. This requires `WHERE true ${filter}` to be added to the query.
