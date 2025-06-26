---
layout: doc
outline: [2, 4]
---

# API

## Overview

The XYZ API provides a comprehensive geospatial data management and visualization platform. All endpoints support both development and production environments with flexible authentication options.

## Authentication

The API supports multiple authentication methods:

- **Bearer Token**: JWT tokens in the Authorization header
- **Cookie Authentication**: Session cookies (name set by environment variable)
- **API Keys**: Provided as query parameters

## API Endpoints

### Provider API

**Endpoint**: `/api/provider`

Handles requests to third-party service providers including CloudFront, file systems, and S3 storage.

**Supported Providers**:

- `cloudfront` - Amazon CloudFront CDN
- `file` - Local file system access
- `s3` - Amazon S3 storage

**Use Cases**:

- Fetching resources from external services
- Proxying requests through configured providers
- Content delivery optimization

### Sign API

**Endpoint**: `/api/sign`

Provides request signing for external services to ensure secure access to third-party resources.

**Supported Signers**:

- `cloudfront` - Sign CloudFront URLs
- `cloudinary` - Sign Cloudinary transformations
- `s3` - Sign S3 requests

**Use Cases**:

- Generating signed URLs for secure resource access
- Time-limited access to external resources
- Authentication with third-party services

### Query API

**Endpoint**: `/api/query`

The Query API module uses templates to secure interfacing with data sources.

**Key Features**:

- **Template-based queries**: All SQL queries use predefined templates for security
- **Layer integration**: Queries can reference workspace layers
- **Spatial operations**: Support for viewport filtering and geometric operations
- **Role-based access**: Query execution based on user permissions

**Available Templates**:

- `cluster` / `cluster_hex` - Spatial clustering operations
- `geojson` / `mvt` - Geographic data formats
- `location_*` - Location-based CRUD operations
- `field_stats` - Statistical analysis
- `wkt` - Well-Known Text geometry handling

**Query Parameters**:

- `template` - Required query template name
- `locale` / `layer` - Workspace context
- `filter` - JSON filter conditions
- `viewport` - Spatial bounds for filtering

### User API

**Endpoint**: `/api/user/{method}`

Comprehensive user management and authentication system with built-in rate limiting.

**Available Methods**:

- `login` / `register` - Authentication and account creation
- `admin` - Administrative user operations
- `add` / `delete` / `update` - User CRUD operations
- `list` - User enumeration (admin only)
- `cookie` - Session management
- `token` / `key` - API key management
- `verify` - Account verification
- `log` - Access logging

**Security Features**:

- Rate limiting (5-second debounce per IP)
- Account blocking and approval workflows
- Session management with configurable TTL
- Admin role separation

### View API

**Endpoint**: `/`

Serves HTML views and the main application interface with template-based rendering.

**Features**:

- **Template system**: Dynamic HTML generation with variable substitution
- **Multi-language support**: Localized content based on user preferences
- **Authentication flows**: Login, registration, and logout handling
- **Message system**: User feedback and error messaging

**Parameters**:

- `template` - View template selection
- `language` - Language preference (ISO 639-1)
- `msg` - Message display
- `login` / `logout` / `register` - Authentication flow control

## Workspace

The workspace handles any custom configuration of the XYZ host.

The workspace may assembled from remote resources.

The workspace will be cached in a process for faster access.

Information in the workspace is not sensitive but immutable.

### Workspace API

**Endpoint**: `/api/workspace/{key}`

The Workspace API handles the assembly and caching of the workspace object.

A Mapp client requesting a locale and layers as JSON will require the Workspace
API to load and cache any templates defined within the locale and layer objects.

**Available Keys**:

- `locale` - Single locale configuration
- `locales` - List of available locales
- `layer` - Individual layer configuration
- `roles` - Role-based access control definitions
- `test` - Workspace validation and testing

**Features**:

- **Template loading**: Remote resource assembly
- **Caching**: Performance optimization with configurable cache age
- **Role filtering**: Access control based on user permissions
- **Nested locales**: Hierarchical locale organization

Resources may be loaded from remote files.

Caching the resource in the workspace object increases the performance of
subsequent requests to the same template.

The **WORKSPACE_AGE** process.env can be defined to limit how long the
workspace cache is retained.

In a cloud deployment it is impossible to control
the individual [lambda] cloud functions spawned to support a process.

A timestamp stored within each process [workspace/cache] module in combination
with the **WORKSPACE_AGE** is only way to control the interval when a workspace
cache is flushed.

Limiting the workspace's cache age to an hour will ensure
that changes to the workspace at rest are propagated to any spawned processes
within an hour.

#### Templates

The client may see a template in the workspace but can not alter the templates role restrictions or database connection.

### SAML API

**Endpoints**: `/saml/*`

SAML-based Single Sign-On (SSO) authentication integration.

**Available Endpoints**:

- `/saml/metadata` - Service Provider metadata
- `/saml/login` - Initiate SSO authentication
- `/saml/acs` - Assertion Consumer Service
- `/saml/logout` - Single logout initiation
- `/saml/logout/callback` - Logout response handling

**Features**:

- **Standards compliance**: Full SAML 2.0 protocol support
- **Configurable certificates**: Custom SP and IdP certificate handling
- **Session management**: Integrated with XYZ user sessions
- **Security options**: Configurable signing and encryption

## Error Handling

All endpoints return standardized error responses:

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not available)
- `405` - Method Not Allowed (service not configured)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error (server-side issues)

## Rate Limiting

User operations are rate-limited to prevent abuse:

- 5-second debounce per IP address
- Admin users exempt from rate limiting
- Temporary IP blocking for repeated violations
