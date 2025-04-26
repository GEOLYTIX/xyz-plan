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
