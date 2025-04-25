# .style{}

The style object defines how layer features are styled.

## .default{}

The default style will be applied to every feature in a dataset. Other style objects will be assigned to this default style before sending the style object to the feature render.

```json
"default": {
  "fillColor": "#d9d9d9",
  "fillOpacity": 0.5,
  "strokeWidth": 0.01,
  "strokeColor":"#d9d9d9"
}
```

## .highlight{}

A highlight styling can be provided which is used when you hover over a geometry. This is useful to let the client know which geometry they are selecting.

```json
 "highlight": {
  "fillColor": "#DBD56E",
  "strokeColor": "#000",
  "strokeWidth":1,
  "fillOpacity": 0.7,
  "scale": 1.3
}
```

## .cluster{}

The cluster style is applied to features which account for multiple locations in close proximity which form a location cluster.

If the default styling is an SVG and the cluster as a non-SVG, make sure to add `svg: null` to the cluster object to allow this. You can provide `clusterScale: null` if you wish for the cluster to be a single size, and not resize based on how many points are within it.

```json
"cluster": {
  "clusterScale": 0.8
}
```

## .label{}

Label can be used to display feature properties as text elements in the mapview.

### .title

The `label.title` will be displayed in the dropdown to switch the label or as title for the display toggle with a single label.

### .display

Whether the label is displayed by default.

### .field

The feature property to be displayed as label.

### .count

Whether the location count should be displayed on cluster features which do not have a single property value.

### .font

The size and font family to use. Defaults to `"12px sans-serif"`.

### .fillColor

The font colour.

### .strokeColor & .strokeWidth

The colour and width of a halo for the text.

### .minZoom & .maxZoom

Limits the zoom level range at which the label can be displayed.

### .offsetX & .offsetY

The offset of the text from the feature geometry [centre].

```json
"label": {
  "field": "name",
  "title": "Toggle Label Display",
  "display": true,
  "overflow": true,
  "count": true,
  "font": "12px sans-serif",
  "fillColor": "#ee4b2b",
  "strokeColor": "#fff",
  "strokeWidth": 3,
  "minZoom": 9,
  "maxZoom": 15,
  "offsetX": -10,
  "offsetY": 10
}
```

## .labels{}

A `label{}` config with the key matching a `style.label` string will be assigned as default, otherwise the first of multiple `style.labels{}` will be assigned as `style.label{}` when the layer is decorated.

## .hover{}

The `style.hover{}` config object defines a feature hover method. `mapp.layer.featureHover()` will be defined as `style.hover.method()` if not already defined.

### .method{}

The hover method receives the feature, and layer as arguments from the `mapview.highlight` interaction.

### .display

The display flag controls whether the query in the default `featureHover()` method will be executed.

### .field

The field will be provided as parameter for the default infotip query template.

### .query

The query template for the `featureHover()` method. Defaults to the 'infotip' template.

### .title

The title for the hover interface in the layer style panel.

### .legend{}

The `.layout` and alignment of the content for a theme legend can be configured in the `theme.legend{}` JSON.

```json
"legend": {
  "layout": "flex",
  "alignContents": "centered"
}
```

## .hovers{}

A `hover{}` config with the key matching a `style.hover` string will be assigned as default, otherwise the first of multiple `style.hovers{}` will be assigned as `style.hover{}` when the layer is decorated.

## .theme{}

A layer can be styled according to its features' property values. The `theme.type` defines the lookup method for a style to be assigned to the layers default style for a feature.

_A theme will be assigned from `style.themes{}` if the theme key matches a `style.theme` string value._

### .title

The theme title will displayed in theme legend or themes dropdown. The `style.themes{}` key will be assigned as name if not implicit. It is recommended to use simple keys for all themes in favour of assigning a theme name for display.

### .meta

The meta value will be rendered as innerHTML in legend element below the title.

### .field / template

The field which must be assigned as a feature property in the layer data. Depending on the theme type the feature style will be assigned from a lookup in the `theme.cat{}` or `theme.cat_array[]`. A query template will be used in the dataset query if the field matches a `workspace.templates{}` key.

### .setLabel

A label with the `setLabel` key value will be set as the `style.label{}` from the `style.labels{}` object.

### .setHover

A label with the `setHover` key value will be set as the `style.hover{}` from the `style.hovers{}` object.

### .type: "categorized"

A categorized theme can be used to assign a style object from a `cat{}` where the cat key matches a feature's [field] property value. The cat `.label` can be set for display in the theme legend.

```json
"type": "categorized",
"field": "colour",
"cat": {
  "red": {
    "label": "Red"
    "style": {
      "fillColor": "#f00"
    }
  },
  "green": {
    "label": "Green"
    "style": {
      "fillColor": "#0f0"
    }
  },
  "blue": {
    "label": "Blue"
    "style": {
      "fillColor": "#00f"
    }
  }
}
```

#### .distribution.count

A `distribution: count` key-value pair added to a categorized thematic will use the [simple-statistics](https://github.com/simple-statistics/simple-statistics) library to only show options in the legend that are present in the viewport. This will show the number of that option in the thematic too:
<br>Red [10]
<br>Green [8]
<br>The configuration developer will just provide the style for each category in the data, and then the count is generated using the data within the viewport.
<br><b>NOTE - to use this on an `mvt` format layer, you will need to pass `layer.wkt_properties:true`.</b>
<br><b>NOTE - to use this on an `wkt` or `geojson` format layer, you will need to pass `layer.params.viewport:true`.</b><br>If you do not pass this, you will get the counts for the whole dataset and it will not update as you zoom in and zoom out.

```json
"type": "categorized",
"field": "colour",
"distribution": "count",
"cat": {
  "red": {
    "label": "Red"
    "style": {
      "fillColor": "#f00"
    }
  },
  "green": {
    "label": "Green"
    "style": {
      "fillColor": "#0f0"
    }
  },
  "blue": {
    "label": "Blue"
    "style": {
      "fillColor": "#00f"
    }
  }
}
```

### .type: "graduated"

A graduated theme can be used to assign a style object from a `cat_array[]` entry where feature's [field] property value is below the entry `.value`.

- The `legend` object allows the legend to be styled differently. <br>`layout:flex` will turn the legend into a flexbox instead of grid.<br>`alignContents` will allow the contents to be aligned.<br>`horizontal: true` will turn the legend from vertical to horizontal.<br>`nowrap: true` will force all legend entries onto one line, rather than wrapping.

```json
{
  "type": "graduated",
  "legend": {
    "layout": "flex",
    "alignContents": "centered",
    "horizontal": true,
    "nowrap": true
  },
  "field": "rank",
  "cat_arr": [
    {
      "value": 0,
      "label": "Nought",
      "style": {
        "fillOpacity": 0.1
      }
    },
    {
      "value": 10,
      "label": "below 10",
      "style": {
        "fillOpacity": 0.3
      }
    },
    {
      "value": 100,
      "label": "10 to 100",
      "style": {
        "fillOpacity": 0.6
      }
    },
    {
      "value": 999999999,
      "label": "above 100",
      "style": {
        "fillOpacity": 1
      }
    }
  ]
}
```

#### .distribution.jenks

A `distribution: jenks` key-value pair added to a graduated thematic will use the [simple-statistics](https://github.com/simple-statistics/simple-statistics) library to generate the breaks using a jenks classification.
<br>The configuration developer will just provide the style for each break required in the data, and then the jenks breaks are generated using the data within the viewport.
<br><b>NOTE - to use this on an mvt format layer, you will need to pass layer.wkt_properties:true.
<br>NOTE - to use this on an wkt or geojson format layer, you will need to pass layer.params.viewport:true.</b>

```json
{
  "jenks": {
    "label": "Thematic",
    "type": "graduated",
    "distribution": "jenks",
    "field": "field_name",
    "cat_arr": [
      {
        "style": {
          "fillColor": "#f7fcfd"
        }
      },
      {
        "style": {
          "fillColor": "#e5f5f9"
        }
      },
      {
        "style": {
          "fillColor": "#ccece6"
        }
      },
      {
        "style": {
          "fillColor": "#99d8c9"
        }
      },
      {
        "style": {
          "fillColor": "#66c2a4"
        }
      },
      {
        "style": {
          "fillColor": "#41ae76"
        }
      },
      {
        "style": {
          "fillColor": "#238b45"
        }
      },
      {
        "style": {
          "fillColor": "#005824"
        }
      }
    ]
  }
}
```

### .type: "distributed"

A distributed theme will assign style objects from the `.cat_array[]` array in a manner the reduces the likelihood of the same style being applied to neighbouring features. The theme method will distribute each style equally among the layer features. A field can be assigned to distribute cat values. The same field value will be assigned the same cat style. This is optional by default the feature property `id` will be used to distribute cat styles.

```json
{
  "type": "distributed",
  "field": "id",
  "cat_arr": [
    {
      "fillColor": "#f00"
    },
    {
      "fillColor": "#0f0"
    },
    {
      "fillColor": "#00f"
    }
  ]
}
```

## .themes{}

Multiple `theme{}` configurations can be provided as `layer.style.themes{}`. With `layer.style.theme` defined as a string value a theme with matching key will be assigned as default when the layer is decorated. Otherwise the first entry will be assigned as the default theme. The theme can be changed with a dropdown input in the layer style panel.

## .skip{}

It is possible to skip themes by using the `skip:true` flag. This is useful when you wish to remove a theme from a template. <br>The example below would skip the `Fascia` theme.

```json
{
  "style": {
    "themes": {
      "Fascia": {
        "skip": true
      }
    }
  }
}
```

## .icon[]

The icon can be defined as an array where the first item in the array will be rendered first and subsequent items will be rendered on top. Default legend icons are rendered 24 by 24px. A legendScale must be applied to scale down the icons to fit into the default sized canvas.

```json
{
  "icon": [
    {
      "svg": "https://geolytix.github.io/MapIcons/pins/mint.svg",
      "scale": 2,
      "legendScale": 0.35,
      "anchor": [0.5, 1]
    },
    {
      "svg": "https://geolytix.github.io/mapp/icons/emblem.svg",
      "scale": 0.03,
      "anchor": [0.5, 1.6]
    }
  ]
}
```

## .icon{}

### .type

`type: "target"`

`type: "diamond"`

`type: "dot"`

`type: "svg"`

`type: "template"`
