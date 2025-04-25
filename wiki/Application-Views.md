MAPP application views are web pages consisting of markup, script, the Openlayers, and MAPP libraries. Application view may be designed as reports or dashboards.

Application views may be stored as templates allowing access through the [View API](https://github.com/GEOLYTIX/xyz/wiki/XYZ---API#viewtemplate).

## Markup
The XYZ API uses minimalist markup templating. Parameter in double braces will be substituted if matched or removed before the HTML response is sent.

```html
<!DOCTYPE html>
<html lang="{{language}}">
```

### Head
[data-* attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) can be assigned to the document `<head>`. The data-user attribute value can be accessed from script like so: `document.head.dataset.user`

The `{{title}}` parameter will be substituted with the value from the title environment variable used to initialise the XYZ node process.

The `{{dir}}` parameter will be substituted with the value from the dir environment variable which defines the URL root path for the XYZ API.

The Openlayers library is not bundled with, and must be referenced prior to loading the MAPP library and script.

Both the MAPP and MAPP.UI libraries have their own stylesheets which must be referenced in the document head.

Additional styles can defined in a style block in the document head. Because [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself); These should only be styles which are used in a specific application view context and are not required by other HTML templates.

```html
<head
  data-dir="{{dir}}" 
  data-user="{{user}}" 
  data-login="{{login}}" 
  data-locale="{{locale}}">

  <title>{{title}}</title>

  <link rel="icon" type="image/x-icon" href="{{dir}}/icons/favicon.ico" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.12.0/build/ol.js" defer></script>

  <!-- Load XYZ / MAPP stylesheet and library. -->
  <link rel="stylesheet" href="{{dir}}/css/mapp.css" />
  <link rel="stylesheet" href="{{dir}}/css/ui.css" />

  <script type="module" src="{{dir}}/js/lib/mapp.js" defer></script>
  <script type="module" src="{{dir}}/js/lib/ui.js" defer></script>

  <script src="{{dir}}/views/_default.js" defer></script>
  <style>

    html {
      height: 100%;
    }

  </style>
</head>
```

### Body
Most elements can and will be generated with [µhtml](https://github.com/WebReflection/uhtml) methods which are bundled as MAPP.utils. The `.map-container` element is the target for a [Mapview](https://github.com/GEOLYTIX/xyz/wiki/MAPP#mapviewmapview) with an Openlayers Map. We believe in giving proper attribution to all data and code and put an `.attribution-links` div inside the mapview to display attribution for code libraries used, and data sources displayed.

```html
<body>

  <div id="Map" class="map-container">
    <div class="attribution-links"></div>
  </div>

</body>
```

## Script
MAPP script may be referenced as a script file in the document head or in a script block after the document body. The script should be executed once the document window has loaded. The MAPP library requires an ES6+ Javascript environment and makes use of promises throughout. Personal preferance is for an async/await script structure as it improves the readability of the code.

We recommend to assign the application host path as a data attribute to the document head if indeed a an URL path is used to extent the application domain. It is also valid to hardcode the host domain and path. The host is relative and only the `dir` value is required if the view is accessed through the View API.

### URL Hooks/Params
Any URL parameter are stored as key/values in the _mapp.hooks.current_ object once the Mapp library is assigned to the document window. This allows us to define the map viewport, which layers to load from which locale, and which locations to select in the application view script.

### Locale
A locale must be loaded prior to initiating the mapview object.

A list of locales can be requested from the [Workspace API /locales](https://github.com/GEOLYTIX/xyz/wiki/XYZ---API#locales).
e.g. [https://geolytix.dev/latest/api/workspace/locales](https://geolytix.dev/latest/api/workspace/locales)

The locale JSON can be requested from the [Workspace API /locale](https://github.com/GEOLYTIX/xyz/wiki/XYZ---API#locale).
e.g. [https://geolytix.dev/latest/api/workspace/locale?locale=UK](https://geolytix.dev/latest/api/workspace/locale?locale=UK)

### Mapview
The [mapp.Mapview](https://github.com/GEOLYTIX/xyz/wiki/MAPP#mapviewmapview) decorator will create an Openlayers Map object in the defined target element.

```js
const mapview = mapp.Mapview({
 host: host,
 target: 'Map',
 locale: locale,
 attribution: {
  target: document.querySelector('#Map > .attribution-links'),
  links: {
   [`XYZ v${mapp.version}`]: "https://geolytix.github.io/xyz",
   Openlayers: "https://openlayers.org",
  },
 }
})
```

The view of a mapview.Map may already be set in the locale used to decorate the mapview object. After initialisation it is possible to set the view directly by either defining the view's zoom or centre. The centre must be defined as coordinates in the mapview's projection which is 3857 by default. It may be necessary to transform geographic coordinates to cartographic with [_ol.proj.transform_](https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.transform). A mapview.map view can also be fitted to an extent from a vector source.

```js
// Set zoom...
mapview.Map.getView().setZoom(12)

// and centre.
mapview.Map.getView().setCenter(ol.proj.transform([51.5263,-0.1802],'EPSG:4326','EPSG:3857'))

// Set view from extent.
mapview.fitView(vectorSource.getExtent())
```

### Layers
The locale JSON contains an array of layer keys. The layer JSON for an individual layer can be requested from the [Workspace API /layer](https://github.com/GEOLYTIX/xyz/wiki/XYZ---API#layer)
e.g. [https://geolytix.dev/latest/api/workspace/layer?locale=UK&layer=scratch](https://geolytix.dev/latest/api/workspace/layer?locale=UK&layer=scratch)

The [xhr](https://github.com/GEOLYTIX/xyz/wiki/MAPP#xhr) util maybe used to request the layer JSON from the Workspace API.

The [promiseAll](https://github.com/GEOLYTIX/xyz/wiki/MAPP#promiseall) util maybe used to resolve an array of xhr requests for layer JSON.

A single (or an array of) JSON layer maybe passed to the [mapview.addLayer()](https://github.com/GEOLYTIX/xyz/wiki/MAPP#addlayerlayers) method which will decorate the layer objects and assign the layer to the [mapview.layers](https://github.com/GEOLYTIX/xyz/wiki/MAPP#layers) object.

```js
const layers = await mapp
 .utils.promiseAll(locale.layers.map(layer => mapp
  .utils.xhr(`${host}/api/workspace/layer?locale=${locale.key}&layer=${layer}`)))

await mapview.addLayer(layers)
```

### Locations
The _mapp.location.get_ requires a decorated layer object and a location id to retrieve the associated data from the Location API and decorate the location object. The decorated location is assigned to the _mapview.locations_ object of the location layer's mapview.

```js
const location = await mapp.location.get({
 layer: locationMap.layers['sites'],
 id: mapp.hooks.current.id
})
```

It is possible to get a location for each hook in current.locations. A location hook is constructed from the layer key and the location id seperated by an exclamation mark.

```js
mapp.hooks.current.locations.forEach((_hook) => {
 const hook = _hook.split("!")

 mapp.location.get({
  layer: mapview.layers[decodeURIComponent(hook[0])],
  id: hook[1],
 })
})
```

A grid view of a location's infoj entries may be created with the _locations.info_ UI utility.

```js
let locationview = mapp.ui.locations.infoj(location)
```

### Dataviews
tbc

### Tabviews
tbc

### Plugins
The loadPlugins utility tool may be used to load plugins from an array of ressource links. The default script will load all plugins which are defined in the current locale.

```js
await mapp.utils.loadPlugins(locale.plugins);
```

## _default
tbc


## Reports
This section will outline how we go about creating custom views (reports) using the XYZ Framework. 

### Initial Set Up 
#### Create HTML File
* The first stage of the set-up is to create a `html` file that we will populate 
``` js 
<!DOCTYPE html>
<html lang="{{language}}">

<head data-dir="{{dir}}" data-user="{{user}}" data-login="{{login}}" data-locale="{{locale}}">
  <title>Site Assessment Report</title>

  <link rel="icon" type="image/x-icon" href="{{dir}}/public/icons/favicon.ico" />

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- The OL library is required for any map and should not be imported dynamically. -->
  <script src="https://cdn.jsdelivr.net/npm/ol@v7.3.0/dist/ol.js" defer></script>

  <!-- The MAPP library is required for the map control. -->
  <link rel="stylesheet" href="{{dir}}/public/css/MAPP.css" />
  <script type="module" src="{{dir}}/public/js/lib/MAPP.js" defer></script>

  <!-- This report will use charts;
    Dynamic import will be skipped if the chart library is already assigned to the window. -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- The MAPP.ui library is required from interface elements such as data and location views. -->
  <link rel="stylesheet" href="{{dir}}/public/css/ui.css" />
  <script type="module" src="{{dir}}/public/js/lib/ui.js" defer></script>

  <!-- Custom CSS will be added here to design the Report Layout -->
  <style></style>
  <!-- Custom HTML will be added here to set up the Report Layout -->

<body>
</body>
<!-- Custom JS will be added here to add elements into the divs defined in the body -->
<script>
  window.onload = async () => { };
</script>
</head>
</html>
```
#### Add HTML file link to Workspace
* Add this to the `workspace.json` in the `templates` section. 
``` json 
"site_report": {
      "src": "${TEMPLATES}/folder/report.html"
    }
```
#### Add type:report to layer
* Then call it in the `infoj` of the `layer.json` file. 
``` json 
  {
      "type": "report",
      "report": {
        "label": "Report",
        "template": "site_report"
      }
    },
```
### Commonly Used CSS / HTML

#### Map Class

#### CSS Code

```css
.map {
      height: 100%; /* Needs a height to display */
      min-height: 25vh; /* Ensures a minimum height */
      width: 100%; /* Needs a width to display */
      position: relative; /* Ensures elements can use it for absolute positioning */
    }

```

#### Creating a header with SVG's on either side of a Title with a date beneath.

#### CSS Code

```css
.header {
    height: 40px; /* Sets the height of the header element to 40 pixels */
    display: flex; /* Displays the elements within the header as a flex container */
    align-items: center; /* Vertically aligns the elements within the header */
    justify-content: space-between; /* Distributes the elements evenly along the horizontal axis */
    padding: 0 10px; /* Adds 0 pixels of padding on the top and bottom, and 10 pixels of padding on the left and right */
}

.page {
      width: 210mm; /* Sets dimensions for a4 page */
      height: 297mm; /* Sets dimensions for a4 page */
      margin: 5mm auto; /* Sets dimensions for a4 page */
      padding: 5mm; /* Sets dimensions for a4 page */
      page-break-after: auto; /* Sets dimensions for a4 page */
      box-shadow: 1px 1px 5px #999; /* Gives a shadow effect for the page */
      display: flex; /* Displays the elements within the title-container as a flex container */
      flex-direction: column; /* Arranges the elements vertically within the title-container */
      gap: 3mm; /* Sets dimensions for a4 page */
    }

.title-container {
    display: flex; /* Displays the elements within the title-container as a flex container */
    justify-content: center; /* Horizontally centers the elements within the title-container */
    align-items: flex-start; /* Aligns the elements to the top within the title-container */
    flex-direction: column; /* Arranges the elements vertically within the title-container */
    margin-bottom: 5px; /* Adds 5 pixels of margin at the bottom of the title-container */
}

    .container {
      display: flex; /* Displays the elements within the title-container as a flex container */
      justify-content: center; /* Horizontally centers the elements within the title-container */
      align-items: flex-start; /* Aligns the elements to the top within the title-container */
      gap: 10px; /* Applies a gap around the container */
    }

    .container>* {
      width: 50%; /* Items inside the container side by side take up half the page */
    }

    .container1-3 {
      width: 40%; /* Change the width of the item to 40% */
    }

    .container2-3 {
      width: 60%; /* Change the width of the item to 60% */
    }

h1 {
    font-size: 2em; /* Sets the font size of h1 to 2em (equivalent to 32 pixels) */
    font-weight: 600; /* Sets the font weight of h1 to 600 (bold) */
    align-self: center; /* Horizontally centers the h1 element within its container */
}

.svg1,
.svg2 {
    max-height: 40px; /* Sets the maximum height of svg1 and svg2 to 40 pixels */
    width: auto; /* Allows the width of the svg elements to adjust automatically */
}

.svg1 {
    margin-right: 10px; /* Adds 10 pixels of margin on the right side of svg1 */
}

.svg2 {
    margin-left: 10px; /* Adds 10 pixels of margin on the left side of svg2 */
}

@media print { /*Media queries for print to pdf */
      @page {
        size: A4 portrait;
        margin: 0;
      }

      .page {
        margin: 0;
        box-shadow: none;
        print-color-adjust: exact;
        webkit-print-color-adjust: exact;
      }

      #backspacer {
        display: none;
      }
    }

```

#### HTML Code

```html

<header>
    <img class="svg1" viewBox="0 0 40 40" src="brand1.svg"></img>
    <div class="title-container">
        <h1>TITLE</h1>
        <span class="date" style="align-self: center;"></span>
    </div>
    <img class="svg2" viewBox="0 0 40 40" src="brand2.svg"></img>
</header>

```

#### Creating a subheader with a background and box shadow

#### CSS Code

```css
        .subheader {
            padding: 10px;
            text-align: left;
            background: #000; /* Replace with hex code of choice */
            color: white;
            font-size: 15px;
            margin-bottom: 5px;
            box-shadow: 1px 1px 5px #999; /* Adds a slight shadow to the box */
        }

```

#### Overwriting Tabulator Colours

#### CSS Code

```css

/* Overrides the background color of the column groups in the Tabulator component */
.tabulator [role="columngroup"] {
    background-color: #000 !important; /* Replace with hex code of choice */
}

/* Overrides the background color of the column headers in the Tabulator component */
.tabulator [role="columnheader"] {
    background-color: #000 !important; /* Replace with hex code of choice */
}

/* Overrides the color of the column titles in the Tabulator component */
.tabulator-header .tabulator-col .tabulator-col-title {
    color: #fff; /* Replace with hex code of choice */
}

/* end tabulator overrides */


```



### Initial JavaScript Set Up
``` js 
 /////////////////////// INITIAL SET UP  ///////////////////////

      // The view endpoint will assign the url path as dir parameter.
      const host = document.head.dataset.dir;

      // Assign the current date to the page header.
      document.querySelectorAll(".date").forEach(
        (element) =>
          (element.textContent = new Date().toLocaleDateString("en-EN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }))
      );

      // Should be hardcoded if known which locale is used.
      const locale = await MAPP.utils.xhr(
        `${host}/api/workspace/locale?locale=UK`
      );
      // load locale from hook.
      //.xhr(`${host}/api/workspace/locale?locale=${MAPP.hook.current.locale}`);

      await MAPP.utils.loadPlugins([locale.plugins[0]]);

      // Execute plugins
      Object.keys(locale).forEach((key) => {
        MAPP.plugins[key] && MAPP.plugins[key](locale[key], null);
      });

      // Load selected layers. Use locale.layers to load all.
      const layers = await MAPP.utils.promiseAll(
        [
          "layer_name_one",
          "layer_name_two",
          "layer_name_three",
          "sites"
        ].map((layer) =>
          MAPP.utils.xhr(
            `${host}/api/workspace/layer?` +
              `locale=${locale.key}&layer=${layer}`
          )
        )
      );

      // Create the sites layer as a hidden layer
      hiddenLayersSites = new Set(["sites"]);
```

### Getting the Location and Create Mapviews
*  To create a new Map in a report, you need to define the `target` which is a named div element in the html file body.
* Then you need to add layers to this using `.addLayer` on the name of that map object, adding the name of all layers you wish to display on that map into the `new Set([])`. 
* By default, the `sites` layer (this should be the layer the report is generated from), is set to display false. 
* Then, we select the particular ID of the location (equivalent to clicking on it in the central MAPP window).
* Then, we assign the new map created to the location we have just selected.

``` js 
  // Create mapview.
      const locationMap = MAPP.Mapview({
        host: host,
        target: "location-map",
        locale: locale,
        scalebar: "metric",
        scrollWheelZoom: true,
      });

      // Filter layers array and add layers for display
      await locationMap.addLayer(
        layers
          .filter((layer) =>
            new Set(["mapbox_base", "mapbox_label", "sites"]).has(layer.key)
          )
          .map((layer) => {
            layer.display = !hiddenLayersSites.has(layer.key);
            return layer;
          })
      );

      // Get store location
      const location = await MAPP.location.get({
        layer: locationMap.layers["sites"],
        id: MAPP.hooks.current.id,
      });

      // Assign mapview and layer to location.
      location.layer = locationMap.layers["sites"];

```

#### Altering the zoom at which layers display for the report (Tables)

``` js 

        // Get the layer
        const exampleLayer = layers.find(
            (layer) => layer.key === "example_layer"
        );

        // Set the new layer zoom by providing a table for the query response
        exampleLayer.tables = {
            6: null,
            7: "schema_name.example_table"
        };

```

### Selecting Infoj Elements to Show
* This section will first remove editable ability from `infoj` elements, as the Report should be a summary and not editable. 
* Then, we create an array by filtering from the `infoj` all the entries we wish to display in the report using their field value to do so inside a `new Set([])`.
* (optional) - We can then remove the group from the `infoj` elements, which will remove the Group Dropdown from display.
* Then, we append this into a named div from the HTML file, in this case `location-info`. 
``` js 
  // Remove editable fields in report.
      location.infoj.forEach((entry) => delete entry.edit);

      // Create an array of filtered entries for the location view
      const locationInfoArray = location.infoj.filter((entry) =>
        new Set([
          "field_one",
          "field_two"
        ]).has(entry.field)
      );

      // Remove groups from filtered entries
      locationInfoArray.forEach((entry) => delete entry.group);

      // Create and append location info.
      document
        .getElementById("location-info")
        .append(MAPP.ui.locations.infoj(location, locationInfoArray));
```

### Enable Map Interactions
* By default, `mapview` interactions are turned off on custom views. 
* This means that hovering over locations on these mapviews will not do anything. 
* It is possible to turn this on, so the user can hover over points to see `hover` labels and highlights for example.
* You will need to change `Map` to the name of the `mapview` for each map you wish to enable interactions on.
``` js
// Enable hover interaction on the map
    Map.interactions.highlight();
```

### Zooming to the Location 
* It is possible to set the Zoom Level of the Report and centre on the location. 
* set the zoom to 10 using `setZoom()`; 
* Centre to the location pin, which needs to be in the projection `EPSG:3857`, so this example is transformed from `EPSG:4326`. 

``` js 
      // Set zoom...
      locationMap.Map.getView().setZoom(10);

      // and centre from location pin.
      locationMap.Map.getView().setCenter(
        ol.proj.transform(
          location.infoj.find((entry) => entry.field === "pin").value,
          "EPSG:4326",
          "EPSG:3857"
        )
      );
```

### Adding Geometries
* It is possible to add geometries from the `infoj` to the Maps on the Report. 
* First, select the geometries from the `infoj` using `new Set([])` and filtering on the field value in the `infoj`.
* Then, we draw them to the map. 
* Then, we use `flyTo()` to fly to the extent of the geometries. 

``` js 
 // Filter geometry entries from location.
      let locationGeometryEntries = location.infoj.filter((entry) =>
        new Set(["pin", "isoline_5min", "isoline_10min", "isoline_15min"]).has(
          entry.field
        )
 );

 // Draw geometries to map.
    MAPP.ui.locations.infoj(location, locationGeometryEntries );

 // Fly to extent of the draw location geometries.
    location.flyTo();
```

### Adding Geometries as Layers
* It is possible to add `infoj` geometry elements to the maps in a Report. 
* This is very useful as it allows the geometries to be shown in a legend, and also allows layer toggles to include geometries from that sites `infoj`.

``` js 
   // Grab the selected catchment from the location.
      const selectedCatchmentChoice = location.infoj.find(
        (entry) => entry.field === "comparison_isochrone"
      );

      // Lookup the selected catchment against the infoj field name
      selectedCatchmentLookup = {
        "Geom_1": {
          geom: "geom_1",
          type: "Geom_1",
        },
        "Geom_2": {
          geom: "geom_2",
          type: "Geom_1",
        },
      };

      // Create a layer to hold the Selected Catchment
      const selectedCatchment = {
        key: "selectedCatchment",
        name: "Report Isochrone",
        display: true,
        format: "geojson",
        srid: "4326",
        zIndex: 99,
        style: {
          theme: {
            type: "categorized",
            field: "type",
            cat: {
              "Geom 1": {
                style: {
                  strokeColor: "#000000",
                  strokeWidth: 1,
                  fillColor: "#F49D37",
                  fillOpacity: 0.2,
                },
              },
              "Geom 2": {
                style: {
                  strokeColor: "#000000",
                  strokeWidth: 1,
                  fillColor: "#F49D37",
                  fillOpacity: 0.2,
                },
              },
            },
          },
        },
      };

      // filter the infoj to get the selected catchment
      let catchmentGeom = location.infoj.find(
        (entry) =>
          entry.field === 
          selectedCatchmentLookup[selectedCatchmentChoice.value].geom
      ).value;

      catchmentGeom = JSON.parse(catchmentGeom)

      // Add feature to layer source.
      selectedCatchment.features = [{
        type: 'Feature',
        geometry: catchmentGeom,
        id: 1,
        properties: {
          type: selectedCatchmentLookup[selectedCatchmentChoice.value].type,
        }
      }]

      // Add the selected catchment to the map
      await locationMap.addLayer([selectedCatchment]);
```

Steps to produce this: 
* You will need to get the relevant value from the `infoj` of the `location`. This could be a field that holds the name of the geometry or just selecting a single geometry for use. 
* Then, create a new `geoJSON` layer.
* Then, create the layer config, giving the layer a `key`, `name`, `srid`, `format`, and `style` either using a default style if you don't have multiple options, or a `categoric` theme if you do.
* Then, Get the value of that particular geometry from the `infoj`, either using a lookup where you have multiple options, or simply by selecting using the `field` from the `infoj`.
* Then, parse the geometry to JSON to enable it to be drawn as a geometry on the map. 
* Then, we add the geometry to the `features` of the layer, giving it an arbitrary id of 1, and providing the value to style on in the `properties`. 
* Finally, we add the layer to the map (locationMap in this example) in question. 

### Adding Legends
* It is possible to add Legends to the maps in a Report. 
* First, create a legend objectselecting the layer from the `locationMap` (in this case "sites") and selecting the style theme. 
* Then, append this object to the `location-map` div element, with a class of "map legend box-shadow". 
``` js 
  // Create legend for map.
      const locationMap_legend = MAPP.ui.layers.legends[
        locationMap.layers["sites"].style.theme.type
      ](locationMap.layers["sites"]);

      // Add legend to retail map.
      document.getElementById("location-map").append(MAPP.utils.html.node`
        <div class="map legend box-shadow">${locationMap_legend }`);
```

#### Adding multiple layers to the same legend
* Its possible to add multiple layers to the same legend
* First, create a legend array of the layers. 
* Then, append this object to the `location-map` div element, with a class of "map legend box-shadow". 
``` js

    // Add the layers needed for the legend and push them on the legend array
    const poiLayers = new Set(["layer1", "layer2"])
    
    map_legend = [];
      poiLayers.forEach(
        entry => {
          map_legend .push(MAPP.ui.layers.legends[
            map.layers[entry].style.theme.type
          ](map.layers[entry]));
        }
      );

    // Add legend.
    document.getElementById("location-map").append(MAPP.utils.html.node`
    <div class="map legend poi box-shadow">${map_legend}`);
```

### Dataviews From Layer
* It is possible to get `infoj` dataview elements from the location and call directly into the Report. 
* As such, all queries used to create charts or tables should be added to the `layer.json` directly, tested and then add `skipEntry:true` to hide them from the `infoj` panel.
* Here, you simply need to write the name of the target for the `dataview` into either the Tables section or Charts section below, and then will be drawn into the div element in the report directly. 

``` js 
  //////////////// DATAVIEWS ////////////////
      // Create tables.
      location.infoj
        .filter((entry) =>
          new Set([
            "location-table",
          ]).has(entry.target)
        )
        .forEach((entry) =>
          MAPP.ui.Dataview(entry).then((table) => table.update())
        );

      // Create charts.
      location.infoj
        .filter((entry) =>
          new Set([
            "location-chart",
          ]).has(entry.target)
        )
        .forEach((entry) =>
          MAPP.ui.Dataview(entry).then((chart) => chart.update())
        );
```
* Should you choose to change the colors of a chart to suit a report you must call ChartJs.update() rather than just chart.update() since the colours come from the datasets and not the chart options.

``` js 
        // Find Chart from infoj
        const chartName = location.infoj.find((i) => i.target === "chart-target");

        // Load chart
        await MAPP.ui.Dataview(chartName);

        // Load Data
        await chartName.update();

        // Change colour after a slight delay
        chartName.ChartJS.config._config.data.datasets[0].borderColor = "#F2FC"; // Replace with chosen hex code
        chartName.ChartJS.config._config.data.datasets[0].backgroundColor = "#F2FC"; // Replace with chosen hex code
        chartName.ChartJS.update();
```

### Toggleable Layers
This code section allows you to select multiple layers to toggle their display on the map within the report. 

```js
const layer_dropdown = MAPP.ui.elements.dropdown({
      multi: true,

      // Create entries from mapview.layers object values.

      entries: Object.values(locationMap.layers).map(layer => ({
        title: layer.name,
        option: layer.key,
        selected: layer.display
      })),
      
      // Options are an array of selected layer keys.
      callback: (e, options) => {

        // Iterate through the mapview layer.
        Object.values(locationMap.layers).forEach(layer => {

          // Show layer if in set from options has layer.key
          // Otherwise hide layer.
          new Set(options).has(layer.key) ? layer.show() : layer.hide();
        })

      }
    }); 

// Output to report location
document.getElementById("dropdown-element").innerHTML = layer_dropdown;

```
* Update `locationMap` to the name of the `Mapview` you have created, and this will be defined.

* You will then need to output this dropdown element into a named `div` element.
