The XYZ Node [process](https://nodejs.org/api/process.html).[env](https://nodejs.org/api/process.html#processenv) can be configured with variables. Environment variables must be string type only.

**The process.env contains sensitive information and must be kept secret at all times.**

### TITLE
The TITLE variable is passed by the [View API](https://github.com/GEOLYTIX/xyz/wiki/XYZ#view) as title param to the view template. The TITLE is also used by the [Cookie API](https://github.com/GEOLYTIX/xyz/wiki/XYZ#cookie) as name for cookies set as response header. TITLE defaults to 'GEOLYTIX | XYZ'.

### DIR
DIR is the path which extends the domain for all requests. Run locally with a DIR value '/latest' the XYZ API would be accessible on **localhost:3000/latest/api/***. The DIR default is an empty string.

### PORT
The PORT can be set for instances which use express. The default PORT is 3000.

### WORKSPACE
A resource locator for the [Workspace API](https://github.com/GEOLYTIX/xyz/wiki/XYZ#workspace-1).

```
WORKSPACE: "https://geolytix.github.io/xyz/public/workspaces/dev.json"
```

Any http(s) url which resolves to a JSON document without the need for authentication is valid.

```
WORKSPACE: "file:../xyz_resources/myWorkspace.json"
```

The `file:` prefix allos the Workspace API to the [File API](https://github.com/GEOLYTIX/xyz/wiki/XYZ#file).

```
WORKSPACE: "cloudfront:dev.geolytix.io/mapp/workspace.json"
```

The `cloudfront:` prefix will request the workspace document through the [Cloudfront provider module](https://github.com/GEOLYTIX/xyz/wiki/XYZ#cloudfront).

```
"WORKSPACE": "mongodb:{\"db\":\"workspace\",\"collection\":\"dev\",\"query\":{\"locales\":{\"$exists\":true}}}"
```

The `mongodb:` prefix will request the workspace document from the [mongodb provider](https://github.com/GEOLYTIX/xyz/wiki/XYZ#mongodb).

### WORKSPACE_AGE
The time in milliseconds before the workspace cache will be retired from the [Workspace API cache](https://github.com/GEOLYTIX/xyz/wiki/XYZ#cache).

```
WORKSPACE_AGE: 60000
```

### SRC_*
SRC_* wildcards are matched to request parameter or SRC_* parameter in the workspace for substitution.

SRC_DIR: "/latest" will replace any occurance of ${DIR} in the workspace.

```js
"plugins": [
 // Parameter and brackets will substituted with '/latest'
 "${DIR}/js/plugins/cluster_panel.js"
]
```

### PUBLIC | PRIVATE
The `PUBLIC` or `PRIVATE` value is a DBS connection string for the [Access Control List (ACL)](https://github.com/GEOLYTIX/xyz/wiki/Security#acl).

### SECRET
A `SECRET` must provided in combination with an Access Control List (ACL). The `SECRET` is used to sign and verify user cookies.

### APPROVAL_EXPIRY
The time in days before a newly registered account will automatically expire. The expiry date can be reset or removed in the user admin console.

### USER_DOMAINS
Comma seperated list of valid email domains for user registration.

### PASSWORD_REGEXP
Overwrites the default Regular Expression used to validate password complexity in the user/register endpoint. Defaults to `(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])^.{10,}$` if not specified.

### TRANSPORT
New user accounts must be verified. This requires the XYZ Host to sent a link with the verification token to the user email. The same transport connection will be used to notify administrator that a new verified user must be approved.

An smtps connection string which includes the email address seprated with a colon from the password @host. The @ in the email address must be escaped. The transport must be defined to allow the XYZ host sending emails for account verification and approval.

```json
"TRANSPORT": "smtps:xyz%40geolytix.co.uk:***@smtp.gmail.com"
```

The transport components can also be defined individually.

```json
"TRANSPORT_EMAIL": "xyz@geolytix.co.uk",
"TRANSPORT_HOST": "smtp-relay.gmail.com",
"TRANSPORT_PASSWORD": "***",
```

### DBS_*
A collection of Postgres database connections can be defined as DBS_* environment variables. The `DBS_` prefix will be ommited from the name of the connection. A Postgres connection string must be provided as value an DBS_* env.

`?sslmode=require` must be add to a connection string which requires a secure connection.

```json
"DBS_GLX": "postgres://dbauszus-glx:***@123.456.789.000:5432/mapp",
"DBS_NEON": "postgresql://dbauszus-glx:***@ep-curly-base-242741.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

### KEY_CLOUDFRONT
A key is required to created signed requests for a private Cloudfront CDN. A *.pem key file must be placed in the repository root. The name of the key file must match the `KEY_CLOUDFRONT` value.

### LOGS
A comma seperated string of log keys. Every log point provides a key with the message to be logged. Only if the key is found in the split LOGS env will the message be logged.

```json
"LOGS": "req,req_url,query_params,query,view-req-url,mvt,saml_response,mailer,templates,workspace"
```

* **req**: Logs the request object from the API module.
* **req-url**: Logs the req.url from the API module.
* **query_params**: Logs the req.params object from the query module.
* **query**: Logs the query object from the query module.
* **view-req-url**: Logs the req.url from the view module.
* **mvt**: Logs the z/x/y of the requested tile from the MVT module.
* **saml_response**: Logs the saml_response from the service provider assertion in the SAML module.
* **mailer**: Logs the transporter result from the mailer module.
* **templates**: Logs an array of loaded template keys and whether the load has been resolved or rejected from workspace.templates module.
* **workspace**: Logs whether the workspace has been cached and how long the process took from the workspace module.

### LOGGER
By default logs are written to the stdout of the node process. Connection details can be provided in the LOGGER env to write the log messages to an external store.

#### Logflare
The `apikey` and `source` must be provided in order to send logs to Logflare.

```json
"LOGGER": "logflare:apikey=***&source=***-***-***-***-***"
```

#### Postgres
For logging to a PostgreSQL dbs a corresponding `DBS_*` env must be set.

The account for the dbs connection string must have write permission.

The table schema for logging in PostgreSQL must be like so:

```SQL
CREATE TABLE IF NOT EXISTS table_name
(
   process varchar,
   datetime bigint,
   key varchar,
   log text,
   message text
);
```

The `dbs` and `schema.table` must be provided as parameters in the LOGGER env.

```
"LOGGER": "postgresql:dbs=NEON&table=schema.table_name"
```

### CUSTOM_TEMPLATES
Any default template getting assigned when the workspace is being assembled can be overriden by assigning a custom template to the same key in the templates object. A JSON file with multiple templates mapped to their respective keys can be assigned as `CUSTOM_TEMPLATES` process env variable.

```JSON
"CUSTOM_TEMPLATES": "https://geolytix.github.io/mapp/views/custom_admin_view.json"
```
