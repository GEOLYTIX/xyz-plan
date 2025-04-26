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
