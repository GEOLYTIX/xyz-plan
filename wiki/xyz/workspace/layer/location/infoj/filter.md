# .filter

If a filter is taking a long time to load on the MAPP instance and it is a numeric or integer field - apply the max and min settings and make sure to apply an index to that field on the table on the database.

## Numeric

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

## Integer

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

## Match

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

## Like

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

## in [array]

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

## ni [not in]

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

## Datetime

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
