# XYZ

## NODE.JS APP

### process.env

## ROUTING

## API

### WORKSPACE

The workspace handles any custom configuration of the XYZ host.

The workspace may assembled from remote resources.

The workspace will be cached in a process for faster access.

Information in the workspace is not sensitive but immutable.

### Workspace API

The Workspace API handles the assembly and caching of the workspace object. A Mapp client requesting a locale and layers as JSON will require the Workspace API to load and cache any templates defined within the locale and layer objects. Resources may be loaded from remote files. Caching the resource in the workspace object increases the performance of subsequent requests to the same template.

The **WORKSPACE_AGE** process.env can be defined to limit how long the workspace cache is retained. In a cloud deployment it is impossible to control the individual [lambda] cloud functions spawned to support a process. A timestamp stored within each process [workspace/cache] module in combination with the **WORKSPACE_AGE** is only way to control the interval when a workspace cache is flushed. Limiting the workspace's cache age to an hour will ensure that changes to the workspace at rest are propagated to any spawned processes within an hour.

#### Templates

The client may see a template in the workspace but can not alter the templates role restrictions or database connection.

### Query API

The Query API module uses templates to secure interfacing with data sources.

## MODULES
