# Location

A location is associated with the features that make up a layer. It is possible to get a location from the XYZ Location API by sending a request providing the `locale`, `layer`, and a location's unique ID.

## .infoj_skip[]

The infoj_skip array allows you to define a list of keys, fields, or queries to be skipped from the infoj of that layer.

```json
"infoj_skip": [
  "field_to_skip",
  "key_to_skip",
  "query_to_skip"
]
```

## .infoj_order[]

The infoj_order array can be defined as a list of lookup keys and entry objects.

```json
"infoj_order": [
  {
    "type": "dataview",
    "dataview": "tabulator",
    "target": "tabview",
    "query": "query_template",
    "table": {
      "layout": "fitColumns",
      "columns": [],
      "autoColumns": true
    }
  },
  "entry_key",
  "char_field",
  "textarea"
]
```

Key strings will be used to lookup entries in the location layer infoj array for matching key, field, or query key values. This allows for the sorting and filtering of infoj entries.

Entry objects in the infoj_order will be spliced and decorated with the location object in place.

### .edit{}

Editing is possible on locations, so the user could for instance alter a field name, add a comment or move a geometry and this would be stored to the database.

Adding `toggleLocationViewEdits: true` will add a spanner to the location entry that can be toggled for editing.

This is particularly useful if any of your fields use formatting or `fieldfx`.

This should be used as the default as it is much neater for the user.

It is also possible to edit field values within a location, and save these to the database.

```json
"edit": true
```

#### .placeholder

If configured a placeholder will be set on the edit input element where available (eg. text, textarea, options)

```json
"edit": {
  "placeholder": "Select from list",
  "options": ["A", "B"]
}
```

#### Options

Three options here:

1. Provide defined options

```json
"edit": {
 "options": ["A", "B"]
}
```

2. Provide empty options array
   <br>This will then use the `distinct_values` template to get all values from the field on the table as provide them.

```json
"edit": {
 "options": []
}
```

3. Provide query
   <br>This will then run the provided query to get the values for the options.<br>This query must in the `workspace.templates` object.

```json
"edit": {
 "query": "edit_options",
 "options": []
}
```

#### Modifying Geometry

If you wish to edit geometry, then we must specify this in the `edit` object.

```json
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
```

##### delete_label

- Providing an `edit.delete_label` will provide a custom label to the 'Delete Geometry' button.

```json
"edit": {
    "geometry": true,
    "delete_label": "Delete Site Geometry"
}
```

##### modify_label

- Providing an `edit.modify_label` will provide a custom label to the 'Modify Geometry' button.

```json
"edit": {
    "geometry": true,
    "modify_label": "Move Site"
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
      "dependents": ["pin","field_1","field_2"],
      "edit": {
        "geometry": true
      }
    },
```
