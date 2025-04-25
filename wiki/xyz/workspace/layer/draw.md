# .draw{}

Entries in the `.draw{}` configuration define which types of geometry are created by the mapview draw interaction.

A `.label` value can be assigned to each drawing method. The label will be displayed as button text which toggles the drawing interaction.

```json
"draw": {
  "polygon": {
    "label":"Add New Polygon"
  }
}
```

## .defaults{}

The field values defined as `.defaults{}` will set for the fields for a newly created location.
The `.defaults{}` can be set directly in the `.draw{}` config or within the individual drawing method configurations.

```json
"edit": {
  "point": true,
  "delete": true,
  "defaults": {
    "field": "default_value"
  }
}
```

## .point

Creates a single point geometry.
There are no additional configuration keys for the point geometry draw interaction.

## .line

Creates a single linestring geometry.

## .polygon

Creates a single polygon geometry.

## .rectangle

Creates a single rectangular polygon by defining two opposing corner points.

## .circle_2pt

Creates a single circular polygon by defining the centre and a point on the circle edge.

## .circle

- Creates a single circular polygon from a centre point and parameters that describe the extent of the circle.
- Default params for the circle configuration panel can be overwritten.
- Providing `hidePanel:true` will hide the radius and units panel from the user, instead allowing them only to draw a circle using the defined defaults, or specified configuration.
  e.g.

```json
"circle": {
  "hidePanel": true,
  "label": "1km Catchment",
  "radius": 1000,
  "units": "meter"
}
```

## .locator

Creates a single point geometry on the current locator position.
There are no additional configuration keys for the rectangle geometry draw interaction.

## snap

If defined within the drawing type, the `snap:true` flag will configure the drawing interaction snapping to geometries from the draw layer. A layer key for another layer added to the same mapview can be provided instead.

```js
"draw": {
  "polygon": {
    "snap": {
      "layer": "layer_key"
    }
  }
}
```

## .[custom]{} layer.draw plugin

A custom draw method can be created by assigning the method to `mapp.ui.elements.drawing{}`.
