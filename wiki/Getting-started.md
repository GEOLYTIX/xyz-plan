# Getting started

Git and Node.js must be installed on your locale to get started.

## Clone the repository

You will only require the main branch unless you want to dig into the XYZ development legacy.

```console
git clone https://github.com/GEOLYTIX/xyz --branch main --single-branch xyz-main
```

## Install node modules

Step into the repository root and run the npm install command to install all node module dependencies.

```console
npm install
```

## Build the library

The mapp and ui library must be build. Esbuild will be installed from npm in the previous step. The build script is defined as \_build in the package.json and can be executed with npm.

```console
npm run _build
```

## Build documentation

The XYZ/Mapp API [documentation](https://github.com/GEOLYTIX/xyz/blob/main/DOCUMENTATION.md) can be build from the JSDoc definitions in the script.

```console
npm run generate-docs
```

## No accessible layers in locale!

[Express.js](https://expressjs.com/) will be installed by npm as a development dependency. You can now run a zero config instance by loading the express.js script in your node runtime.

```console
node express.js
```

The default port is 3000. You can access the mapp interface in your browser on `localhost:3000`. However there will not be any locale or layer to display yet.

![image](https://github.com/user-attachments/assets/3911742f-797b-4689-9221-f944704c5712)

The API documentation will be hosted from `/xyz` path.

![image](https://github.com/user-attachments/assets/93f34910-ccc0-4440-8faf-c81a6f0933f2)

## VSCODE

You can open the cloned repository folder in [VSCODE](https://code.visualstudio.com/).

### Creating a workspace

Lets create the `workspace.json` file with a locale that has an OSM tile layer.

```JS
{
  "locale": {
    "layers": {
      "OSM": {
        "display": true,
        "format": "tiles",
        "URI": "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "attribution": {
          "© OpenStreetMap": "http://www.openstreetmap.org/copyright"
        }
      }
    }
  }
}
```

![image](https://github.com/user-attachments/assets/1ae229ed-d944-4146-bdb4-4e181d699fa9)

### Creating a launch.json

The VSCode `Run and Debug` panel provides the option to create a new node.js environment.

Set `express.js` as the program to launch.

Configure a process environment [`env{}`] for your launch configuration and change the name to 'Hello OSM!'.

In the process env configure the workspace we created in the public folder, and set a title for the instance.

The workspace is a JSON object which can be stored as a file in the public directory. Create a workspace.json file in the public directory and reference this file in `WORKSPACE` environment variable.

```
"TITLE": "Hello OSM!",
"WORKSPACE": "file:/public/workspace.json"
```

![image](https://github.com/user-attachments/assets/13d52f89-e144-4e44-a5ca-b8e74614df76)

Once launched the mapp default view will request the locale with the OSM layer from the XYZ [local]host on port 3000.

![image](https://github.com/user-attachments/assets/5d3da5eb-cf76-4eb0-8242-13898b262789)

## Create a PostGIS table

We recommend [neon.tech] as a cloud hosted Postgres service. Neon offers a free tier to get started quickly and has an accessible browser interface.

Open the SQL Editor and create the postgis extension if the database has not already been extended.

```SQL
CREATE EXTENSION postgis;
```

We are now able to create a spatial table with an indexed geometry field.

```SQL
create table scratch (
  id serial not null primary key,
  geom geometry,
  notes text
);

CREATE INDEX workshop_scratch_geom
  ON scratch
  USING GIST (geom);
```

![image](https://github.com/user-attachments/assets/dbc38b38-0f85-497d-80c2-71145158824c)

In order to connect the XYZ host instance we copy the connection string from the dashboard into the process.env.

![image](https://github.com/user-attachments/assets/59f60c35-dab4-4a7d-961d-29fa0f6ee6f6)

We use `DBS_NEON` as key for this database connection.

![image](https://github.com/user-attachments/assets/37566578-c40e-4ab6-8b19-0f6b36f48ffe)

We need to add the scratch layer configuration to the locale.layers:

```json
"scratch": {
  "dbs": "NEON",
  "display": true,
  "format": "geojson",
  "table": "scratch",
  "geom": "geom",
  "srid": "4326",
  "qID": "id",
  "draw": {
    "polygon": true,
    "circle_2pt": true,
    "rectangle": true,
    "line": true,
    "point": true
  },
  "deleteLocation": true,
  "infoj": [
    {
      "type": "geometry",
      "display": true,
      "field": "geom",
      "fieldfx": "ST_asGeoJSON(geom)",
      "dependents": [
        "pin"
      ],
      "edit": {
        "geometry": true,
        "snap": true
      }
    },
    {
      "type": "pin",
      "label": "ST_PointOnSurface",
      "field": "pin",
      "fieldfx": "ARRAY[ST_X(ST_PointOnSurface(geom)),ST_Y(ST_PointOnSurface(geom))]"
    },
    {
      "title": "ID",
      "field": "id",
      "inline": true
    },
    {
      "title": "Notes",
      "field": "notes",
      "type": "textarea",
      "edit": true
    }
  ]
}
```

The layer should now be available after restarting the instance. You will be able to create new locations by drawing geometries and edit the notes textarea.

![image](https://github.com/user-attachments/assets/965b2de6-75d6-4426-916a-e28f3f544f5f)
