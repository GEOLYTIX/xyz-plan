# .infoj[entry]

The infoj is the term used to describe the information we provide in the left-hand panel of the map window when you click on a geometry. This is an array of objects that make up what the user wishes to see.

## .field

## .fieldfx

Fieldfx allows you to alter the value displayed in the infoj. This is particularly useful if you wish to apply formatting to a number, convert values or change the field `"ROUND(numeric_value,2)"`. This can be provided as an SQL query, but must all be provided on a single line. If you wish to provide an SQL query, you must ensure the `WHERE` clause includes `WHERE id= $1`.

```SQL
SELECT ROUND(numeric_value2,2) FROM table_2 LEFT JOIN table_1 ON t1.id = t2.id WHERE id=$1
```

It is possible to query a json field key through the fieldfx using the json arrow notatrion. The following fieldfx will return the 'age' value from the json_field column.

```json
"fieldfx": "json_field -> 'age'",
```

## .jsonb_field / .jsonb_key

Using a combination of jsonb_field and jsonb_key allows to update individual key values in a json type column.

The following example uses the json arrow notation to extract the age value from the json_field. The `field` value must be unique in order to assign the value from the get location request to the correct entry.

```json
{
  "field": "json_field_age",
  "fieldfx": "json_field -> 'age'",
  "jsonb_field": "json_field",
  "jsonb_key": "age",
  "edit": true
}
```

## .json_field / .json_key

The combination of of json_field and json_key may be used to create editable entries for a single json key/value.

A type:json entry must be added to the infoj array. The `json_field` value will be used as lookup to identify the entry with the matching field value.

The location.update method will update the key/value in the json entry before updating the object in the location data at rest.

```json
{
  "field": "json_field",
  "type": "json",
  "skipEntry: true
},
{
  "json_field": "json_field",
  "json_key": "age",
  "edit": true
}
```

## .query

The query template to use for a query which will populate the `entry.value`

### .queryparams{}

The queryparams are used to create the url params for a request to the Query API. The `layer.queryparams{}`, and `locale.queryparams{}` will be assigned to the `entry.queryparams{}`.

The following queryparams flags are reserved.

```js
"queryparams": {
  "locale": true, // locale key.
  "layer": true, // layer key.
  "table": true, // layer table.
  "filter": true, // layer current filter.
  "z": true, // mapview current z.
  "viewport": true, // mapview [west,south,east,north] bounds.
  "center": true, // mapview lat/lng center.
  "email": true, // user email.
}
```

### .run / .queryCheck

A query will be run by the infoj process and the response will be assigned as `entry.value` before the `entry.type` method is called.

## .value

The `entry.value` will be populated from the field or fieldfx value in location get response, or from a `entry.query` response.

## .title

The value to be rendered into the title element which is appended to the entry.node.

## .css_title

The `entry.css_title` value will be applied as inline style to the title element inside the entry.node.

## .css_val

The `entry.css_val` value will be applied as inline style to the value element inside the entry.node.

## .tooltip

The value to show as a tooltip when hovering over the title.<br>This will also append an SVG of a question mark to the end of the title so the user is aware that it has a tooltip.

## .inline

The value element will be displayed in a separate row below the title element. If `entry.inline: true` the title and value will be rendered in the same row in the location view entry.node.

## .prefix

Prefix allows you to add a prefix to the start of the field value in the infoj. This is useful if you are displaying currencies.
`prefix: '£' `

## .suffix

Suffix allows you to add a suffix to the end of the field value in the infoj. This is useful if you are displaying percentages.
`suffix: '%' `

## .group

You can put infoj objects into a group to help break up the information. You must provide a group name to do this, which will be displayed above the first infoj object with that group associated to it.

### .groupClassList

The group drawer will be expanded if any of the entries which are added to a location view group have the `.groupClassList: "expanded"` flag set.
(Note: `.expanded: true` is deprecated)

## .objectMergeFromEntry

The `.objectMergeFromEntry` value can be used to look up an entry with matching type. The lookup entry will be merged into the entry.

```json
{
  "title": "Merge into this entry",
  "objectMergeFromEntry": "mergeEntry"
},
{
  "type": "mergeEntry"
  "title": "This title will overwrite the original entry title."
}
```

## .class

The `entry.class` value will be concatenated as class[List] property for the creation of the `entry.node` element. Assigning the `display-none` class prevent the entry.node from being displayed.

## .nullValue

If configured `null` will be replaced as `entry.value` with the `entry.nullValue`.

## .skipEntry

The entry will not be processed by the infoj method if flagged as true.

## .skipNullValue

The entry will not be processed by the infoj method if the entry value is null (`entry.value === null`).

## .skipFalsyValue

The entry will not be processed by the infoj method if the entry.value is falsy, e.g. undefined, null ,NaN ,0 ,"" (`!entry.value`).

## .skipUndefinedValue

The entry will not be processed by the infoj method if the entry.value is undefined (`typeof entry.value === 'undefined'`).

## .filter

If a filter is taking a long time to load on the MAPP instance and it is a numeric or integer field - apply the max and min settings and make sure to apply an index to that field on the table on the database.

### Numeric

Creates a slider bar and manual input box to filter numeric values that are greater than and less than the provided values.

- For numeric filters specifying the min and max makes the filter query faster as it saves two calculations on the data.
- Although min and max are not a requirement for `field` definitions there are mandatory for `fieldfx` definitions.
- Uses the numeric formatting of the `infoj` entry that the filter is applied to.

```json
{
  "filter": {
    "type": "numeric",
    "min": 123.45678,
    "max": 123456.78
  }
}
```

### Integer

Creates a slider bar and manual input box to filter integer values that are greater than and less than the provided values.

- For numeric filters specifying the min and max makes the filter query faster as it saves two calculations on the data.
- Although min and max are not a requirement for `field` definitions there are mandatory for `fieldfx` definitions.
- Uses the numeric formatting of the `infoj` entry that the filter is applied to.

```json
{
  "filter": {
    "type": "integer",
    "min": 123,
    "max": 123456
  }
}
```

### Match

Creates a free text box that will filter on exactly what is provided in the text box with the database field value.
<br>By default this will search for your search term only `search_term`.
<br> To search for the search term and anything before it, add `leading_wildcard: true`. This will search for `%search_term`.

```json
{
  "filter": {
    "type": "match"
  }
}
```

### Like

Creates a free text box that will filter the database field value where the value contains the data provided in the free text box.
<br>By default this will search for your search term and a wildcard for anything following it `search_term%`.
<br> To search for the search term anywhere in the field, add `leading_wildcard: true`. This will search for `%search_term%`.

```json
{
  "filter": {
    "type": "like"
  }
}
```

### in [array]

An `in[]` of filter values can be configured. A distinct values query will be used without an array of filter values.
A `entry.field` is required for layer filter.
Returns a list of checkboxes by default to toggle the individual in [array] values.
Can be defined as `dropdown` or `searchbox` UI filter elements.

```json
{
  "field": "table_column",
  "filter": {
    "type": "in",
    "in": ["A", 1, "Foo"],
    "dropdown": true
  }
}
```

### ni [not in]

An `ni[]` of filter values can be configured. A distinct values query will be used without an array of filter values.
A `entry.field` is required for layer filter.
Returns a list of checkboxes by default to toggle the individual in [array] values.
Can be defined as `dropdown` or `searchbox` UI filter elements.

```json
{
  "field": "table_column",
  "filter": {
    "type": "ni",
    "ni": ["A", 1, "Foo"],
    "searchbox": true
  }
}
```

### Datetime

Provides a filter using a calendar which includes both the date calendar and date time.

```json
{
  "filter": {
    "type": "datetime"
  }
}
```

## .objectAssignFromField

This allows you to use a query to build a json_object that can then be passed into an object in the `infoj`.

This is particularly useful if you wish to define the title using values that may change (ie you wish to display the year from a year field that can be updated).

Here, you first create an `infoj` object to define the title, and set it to display-none (so the user cannot see). This `infoj` object will have a fieldfx to create the json object.

Then, you create a second `infoj` object for the field value (perhaps a count for a year), and assign the objectAssignFromField to this.

This will then assign your title object to the `infoj` object.

If you wish to use the field from this within a filter you will need to provide a label for the filter within the filter block.

```json
{
  "infoj": [
    {
      "field": "pass_yr_minus_1_title",
      "fieldfx": "json_build_object('title',  concat(('April ',(current_year - 2)))",
      "type": "json",
      "class": "display-none"
    },
    {
      "field": "pass_yr_minus_1",
      "objectAssignFromField": "pass_yr_minus_1_title",
      "type": "integer",
      "inline": true,
      "filter": {
        "title": "Passengers (past year)",
        "type": "numeric"
      }
    }
  ]
}
```

## .type:"[custom]"{} location entry plugin

A plugin may add a custom entry method to `mapp.ui.locations.entries{}`. These entry methods behave the same as any entry method and will receive the entry itself as only argument. The location, layer, and mapview can all be inferred from the entry object.

## key

The `type: key` entry will be displayed by the layer name in the location view.

```json
{
  "type": "key"
}
```

## pin

The `type: pin` entry will create a labelled and coloured pin for the location. The value must resolve to a coordinate array matching the entry srid. The layer.srid is assumed as the default.

```json
{
  "infoj": [
    {
      "type": "pin", // [!code focus]
      "field": "pin",
      "fieldfx": "ARRAY[ST_X(geom_p_4326), ST_Y(geom_p_4326)]"
    }
  ]
}
```

## text

The `type:text` is the default entry type which will be assigned if not implicit. The edit config supports a placeholder for the input element and to define the maxlength for the input.

```json
{
  "infoj": [
    {
      "type": "text", // [!code focus]
      "edit": {
        "placeholder": "Input placeholder text",
        "maxlength": 7
      }
    }
  ]
}
```

## textarea

The `type:textarea` will provid a multiline textarea input for editing. The edit config supports a placeholder for the input element and to define the maxlength for the input.

```json
{
  "infoj": [
    {
      "type": "textarea", // [!code focus]
      "edit": {
        "placeholder": "Input placeholder text",
        "maxlength": 7
      }
    }
  ]
}
```

## integer

The `type: integer` entry will parse the value as an integer.

```json
{
  "infoj": [
    {
      "field": "field_name",
      "type": "integer" // [!code focus]
    }
  ]
}
```

## numeric

The `type: numeric` will parse the value as a float. A `formatterParams` object can be provided to configure a `toLocaleString` conversion of the value for display.

Typically this will just want to be `maximumFractiondigits` which is the number of decimal places.

Further options can be found [Here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString), by default the locale is set to `en-GB`

```json
{
  "infoj": [
    {
      "field": "field_name",
      "type": "numeric", // [!code focus:7]
      "formatterParams": {
        "options": {
          "maximumFractionDigits": 5
        },
        "locale": "en-GB"
      }
    }
  ]
}
```

`rounnd:int` can be used as a shorthand for `formatterParams.options.maximumFractionDigits`

```json
{
  "infoj": [
    {
      "field": "field_name",
      "type": "numeric",
      "round": 1 //[!code focus]
    }
  ]
}
```

## date

`type: date` Adds a date `infoj` entry.

Database field must be of type bigint.

By default this will show as dd/mm/yyyy, hh:mm:ss.<br> To return just the date in format dd/mm/yyyy add the `locale` and `options` object.

```json
{
  "field": "date",
  "type": "date",
  "locale": "en-UK",
  "options": {
    "year": "numeric",
    "month": "2-digit",
    "day": "2-digit"
  }
}
```

#### datetime

`type: datetime` Adds a datetime `infoj` entry.

Database field must be of type bigint.

By default this will show as dd/mm/yyyy, hh:mm:ss.<br>You can control this with the `locale` and `options` object.

```json
{
  "field": "date",
  "type": "datetime",
  "locale": "en-UK",
  "options": {
    "year": "numeric",
    "month": "2-digit",
    "day": "2-digit"
  }
}
```

#### time

`type: time` Adds a time`infoj` entry.

Database field must be of type numeric or varchar.

```json
{
  "title": "Time",
  "field": "time_field",
  "type": "time"
}
```

#### link

The `type:link` entry will create a node containing an icon and anchor tag (link). The default icon class is `mask-icon open-in-new`. The default label for the link is "Link". An URL path must be defined as `entry.url`. The URL parameter are constructed from the params object.
The icon style can be set as inline style provided as `icon_style` string value.

```json
{
  "type": "link",
  "icon_class": "mask-icon open-in-new",
  "label": "Link",
  "url": "https://geolytix.com",
  "params": {
    "param": "value"
  }
}
```

#### query_button

Creates a button element in the location view which run a parameterised query. The `host`, `query`[template] and `queryparams` can be configured in the entry.

An array of dependents [fields] can be defined. The matching entry values will be synched after the query has been resolved.

```json
{
  "label": "Snap to Postal Sector",
  "type": "query_button",
  "query": "catchment_statistics_snap_to_postal_sector",
  "queryparams": {
    "id": true
  },
  "alert": "Query has executed!",
  "reload": true,
  "dependents": ["geom_3857", "perimeter", "area"]
}
```

#### report [legacy]

The `type:report` entry is a legacy configuration that will resolve without warning to a `type:link`.

#### html

`type: html` This will allow you to output HTML directly into the infoj field. <br>This is useful as we can use this to control colouring, and text-formatting of information in the infoj for that field.

```json
{
  "field": "field_name",
  "type": "html",
  "fieldfx": "CONCAT('<a href=',field,'>Hyperlink</a></span>')"
}
```

#### title

`type: title` This will allow you to just define a title as that infoj entry.<br>There is an optional `css_title` key that can be used to control the styling of the title.

```json
{
  "type": "title",
  "title": "This is a title",
  "css_title": "font-weight:400"
}
```

#### json

The `type:json` entry value is a json object. The SQL field must be type json to support a json entry. The edit interface will attempt to parse a json object before allowing to store a new value in the location data at rest. `.json_field` with `.json_key` entries can be used to update individual key/values in the json field.

```json
{
  "field": "json_field",
  "type": "json",
  "edit: true
}
```

#### pills

The `type:pills` entry value requires an array value. The array values will be displayed as pills.

```json
{
  "field": "arr_field",
  "type": "pills"
}
```

#### image

The `type:image` entry will show a thumbnail of an image from a cloudinary url stored as the entry.field value. If editable it is possible to delete the image or upload an image if the value is null.

A `cloudinary_folder` must be provided to determine the location where the images are stored.

```json
{
  "field": "field_name",
  "type": "image",
  "cloudinary_folder": "folder_name",
  "edit": true
}
```

A valid `CLOUDINARY_URL` must be in the process env in order to upload or remove images.

#### images

The `type:images` entry will be displayed as a gallery of thumbnails in the location view. The thumbnails can be previewed by clicking. An interface to upload or delete images is available with the `entry.edit:true` flag.

A `cloudinary_folder` must be provided to determine the location where the images are stored.

```json
{
  "field": "field_name",
  "type": "images",
  "cloudinary_folder": "folder_name",
  "edit": true
}
```

The field to store references for cloudinary resources must be defined as a text array in the layer table.

```sql
images text[] DEFAULT '{}'::text[]
```

A valid `CLOUDINARY_URL` must be in the process env in order to upload or remove images.

#### dataview

The `type: dataview` allow output to a chart or table to the infoj, tabview or a HTML location within a custom view (report).

##### Table Infoj Dataview

A Table Dataview returns a table. This uses the [Tabulator Package](http://tabulator.info/docs/5.4/format) to do so, please refer to the documentation for table formatting options.<br> Further Dataview Functionality may be present in the [Dataview Section](https://github.com/GEOLYTIX/xyz/wiki/Configuration#layer-dataview).

```json
{
  "label": "Table Infoj Dataview",
  "type": "dataview",
  "target": "location",
  "query": "query_name",
  "queryparams": {
    "id": true,
    "table": true,
    "filter": true
  },
  "table": {
    "layout": "fitColumns",
    "columns": [
      {
        "title": "Field",
        "field": "field"
      },
      {
        "title": "Value",
        "field": "value",
        "formatter": "toLocaleString"
      }
    ]
  }
}
```

Here we can provide:

- `label`(optional) - This generates a checkbox with the name in the infoj, without the label the dataview cannot be toggled on/off.
- `target` - This can be tabview (the tab at the bottom of the MAPP), location (the infoj), or a HTML location ('html-dataview'). <br> The HTML location is used when we wish to draw a chart directly into a report.
- `SkipEntry: true`(optional) - This is used when we wish to skip the drawing of the chart, this is used when we want to draw a dataview to a HTML location within a report.
- `queryCheck: true`(optional) - This will check whether the query for the dataview returns data, and if not will disable the checkbox if one is provided, or hide the dataview from display.
- `display: true`(optional) - This will set the dataview to automatically display, the default is false.
- `queryparams` - This provides the parameters you wish to pass to a query.
  <br> This is typically `id: true` to select just information for a particular location.
  <br> You can also provide `table: true` which will provide the table defined on the layer. This is especially useful when using a template but defining the table for each locale within the layer.json. <br> This requires the SQL query to contain `FROM ${table}` to ensure it only returns information from the relevant table location.
  <br> You can provide `filter: true` which will pass the filters selected on the layer to the query. This requires `WHERE true ${filter}` to be added to the query.
- `formatter: toLocaleString`- This will add thousand separators to the number (1000 becomes 1,000).

##### Chart Infoj Dataview

A Chart Dataview returns a chart. This uses the [ChartJS Package](https://www.chartjs.org/docs/latest/) to do so, please refer to the documentation for chart formatting options.<br> Further Dataview Functionality may be present in the [Dataview Section](https://github.com/GEOLYTIX/xyz/wiki/Configuration#layer-dataview).

```json
{
  "label": "Chart Infoj Dataview",
  "type": "dataview",
  "display": false,
  "target": "location",
  "query": "query_name",
  "queryparams": {
    "id": true,
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
```

Here we can provide:

- `label`(optional) - This generates a checkbox with the name in the infoj, without the label the dataview cannot be toggled on/off.
- `target` - This can be tabview (the tab at the bottom of the MAPP), location (the infoj), or a HTML location ('html-dataview'). <br> The HTML location is used when we wish to draw a chart directly into a report.
- `SkipEntry: true`(optional) - This is used when we wish to skip the drawing of the chart, this is used when we want to draw a dataview to a HTML location within a report.
- `queryCheck: true`(optional) - This will check whether the query for the dataview returns data, and if not will disable the checkbox if one is provided, or hide the dataview from display.
- `display: true`(optional) - This will set the dataview to automatically display, the default is false.
- `queryparams` - This provides the parameters you wish to pass to a query.
  <br> This is typically `id: true` to select just information for a particular location.
  <br> You can also provide `table: true` which will provide the table defined on the layer. This is especially useful when using a template but defining the table for each locale within the layer.json. <br> This requires the SQL query to contain `FROM ${table}` to ensure it only returns information from the relevant table location.
  <br> You can provide `filter: true` which will pass the filters selected on the layer to the query. This requires `WHERE true ${filter}` to be added to the query.

#### geometry

The type `type:geometry` field value must be geojson. The geometry will be added to the mapview with the provided style. The location style will be assigned to the entry.style. The `location.layer.srid` will be assumed as projection if not implicit as `entry.srid`. A fieldfx function can be used to generate the required format in the location.get() request.

A draw config block can be defined in the entry root or within the edit block. Drawing will always be available if defined on the root or can be toggled with editing if defined in the edit block.

The entry will be skipped with the `hideNoEdit` flag set and editing disabled.

```json
{
  "label": "Label",
  "field": "field_name",
  "srid": "4326",
  "fieldfx": "ST_asGeoJson(geom_4326)",
  "type": "geometry",
  "style": {
    "strokeColor": "#e65100",
    "fillColor": "#e65100",
    "strokeWidth": 2,
    "fillOpacity": 0.2
  },
  "dependents": ["pin"],
  "hideNoEdit": true,
  "edit": {
    "modify_label": "Move Site",
    "delete_label": "Delete Geometry"
    },
    "draw": {
      "polygon": true,
    }
  }
}
```

#### MVT Clone

`type: mvt_clone` allows you to create an infoj object from a different `format: mvt` layer.
<br>To use this, you must have a `layer.json` in the `workspace.json` that you wish to copy the thematic from.
<br>This infoj object will then create a tickbox and the thematic from the other `layer.json` when you select the location.

- `zIndex` (optional) - This allows control of the order of drawing. If the `zIndex` for the `type: mvt_clone` is higher than for the geometries on the location, then the `type:mvt_clone` thematic will be drawn on top.
- `display` (optional) - When set to `true` the thematic will load automatically when you click on a location.
- `layer` - This is the layer that you wish to clone the thematic from.
- `label` - This is the label associated with the checkbox in the infoj.
- `query` - This is a query to select only the relevant geometries from the same table as is used in the layer to clone. <br> For instance if you click on a polygon and want to clone the thematic for hexagons that have a polygon_id associated to them, the query would be `SELECT hexagons FROM table WHERE polygon_id=%{id}`.
- `queryparams` - This is the parameters for the query.
- `style` - If left off will default to the style from the layer you are cloning from, otherwise will use the style provided.

```json
{
  "type": "mvt_clone",
  "zIndex": 99,
  "display": true,
  "layer": "footfall_2021",
  "label": "Footfall Count",
  "query": "footfall_rp",
  "queryparams": {
    "id": true
  },
  "style": {
    "theme": {
      "type": "graduated",
      "field": "glx_ff_21",
      "cat_arr": [
        {
          "value": "0",
          "label": "0 - 5,000",
          "style": {
            "fillColor": "#8BB9E4"
          }
        },
        {
          "value": "5000",
          "label": "5,000 - 25,000",
          "style": {
            "fillColor": "#a1ccbd"
          }
        }
      ]
    }
  }
}
```

#### Vector Layer

`type: vector_layer` allows you to create an infoj object from a query (this is the equivalent of `mvt_clone` but for point data).
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
