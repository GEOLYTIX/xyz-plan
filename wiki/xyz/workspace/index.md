# Workspace

The workspace is a JSON document which defines locales, layers, and locations available to the MAPP library through the XYZ host.

This page provides an overview of the different configuration blocks contained within the workspace.

# .dbs

A default `workspace.dbs` is the fallback database connection for any query which does not have an implicit `dbs` parameter. The dbs key-value must have a corresponding [DBS\_\* environment variable](https://github.com/GEOLYTIX/xyz/wiki/Process-Environment#dbs_).

# .templates{}

The JSON `workspace.templates{}` holds template objects which can be referenced by their unique key.

# .locale{}

The `workspace.locale{}` is the master template for all locales in a workspace.

# .locales{}

Each object referenced by its key in the `workspace.locales{}` object represents a locale available to the XYZ API. An array of available locales dependending on user role restrictions can be requested from the Workspace API. It is recommended to use simple [locale] keys for ease of programmatic use.

A template matching the locale key will be assigned to the locale JSON.

Available locales are listed for access in a dropdown in the default MAPP view. Without specifying a `locale` URL parameter.
