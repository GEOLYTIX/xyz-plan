# .filter{}

The `layer.filter{}` object will be created if undefined when a layer is decorated.

`layer.filter.current{}` stores the currently applied filter to a layer. Current filter can be modified or removed through the `layer.view` filter panel.

The XYZ sqlFilter.js module will turn JSON filter into SQL [Postgres] filter expression.

### .default

The layer.filter.default will always be applied in addition to any role or current filter. The default filter is looked up directly from the layer JSON and can not be modified by a client request. The default filter can be defined as string or object.

```js
// default filter as string
"default": "(NOT retailer = ANY (ARRAY['Booths','Co-op']))"

// default filter as object
"default": {
  "retailer": {
    "ni": [
      "Booths",
      "Co-op"
    ]
  }
}
```

### gte (greater than or equal) filter

A gte filter will pass records where the filter field has a numeric value which is equal or greater than filter value. In a `gt` filter the value must be greater than.

```json
"field": {
  "gte": 10000
}
```

```SQL
WHERE "field" >= 1000
```

### lte (lesser than or equal) filter

A lte filter will pass records where the filter field has a numeric value which is equal or lesser than filter value. In a `lt` filter the value must be lesser than.

```json
"field": {
  "lte": 10000
}
```

```SQL
WHERE "field" <= 1000
```

### in [array] filter

Table records will be passed if the field value is in the filter array.

```json
"field": {
  "in": ["A", "B", "C"]
}
```

```SQL
WHERE "field" = ANY(['A', 'B', 'C'])
```

### ni (not in [array]) filter

Table records will be passed if the field value is not in the filter array.

```json
"field": {
  "ni": ["A", "B", "C"]
}
```

```SQL
WHERE NOT "field" = ANY(['A', 'B', 'C'])
```

### match filter

The match filter will pass if a string matches an ILIKE expression.

```json
"field": {
  "match": "st pauls"
}
```

```SQL
WHERE "field" ILIKE 'st pauls'
```

### like filter

Similar to the match filter, the like filter will add a wildcard character to the filter expression.

```json
"field": {
  "like": "st"
}
```

```SQL
WHERE "field" ILIKE 'st%'
```

### boolean filter

A record will pass the filter expression if the boolean field value matches the filter.

```json
"field": {
  "boolean": true
}
```

```SQL
WHERE "field" IS true
```

### null filter

A record will pass the filter expression if the field value is (or is not [false]) null.

```json
"field": {
  "null": true
}
```

```SQL
WHERE "field" IS NULL
```
