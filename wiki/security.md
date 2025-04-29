# Access

Access to the XYZ Host is controlled through `process.env` variables. By default access is public. Making access implicitly `PUBLIC` by providing an Access Control List (ACL) allows user to register and login to the application with their account. This allows for elevated access privileges defined as user roles. Setting access to `PRIVATE` will require an authenticated user to access the workspace.

## Registration

The `/api/user/register` endpoint provides a default view with a registration form. An email address and password must be provided to register a new user account.

The registration endpoint stores the requesting client address. A new registration request from the same address can only be attempted after 30 seconds.

### Verification

A valid email address is required in order to verify a user account. Upon registration an email with a verification token is sent to the regsitered user email. Following the link to `/api/user/verify/{token}` will look up the token in the ACL and flag the user record as verified.

Failed logins will be reset when an account is verified.

An administrator may verify an account through the admin panel this will not reset failed login attempts. Administrator verification is required in the case of using an invalid email address for an user account.

### Approval

User accounts must be approved by an administrator. An email is sent to all administrator in the ACL when an account with approval is verified.

## Password Reset

Password resets are done through the registration endpoint. Registering an existing user will store the new password in the ACL and send a verification token to the user email. Following the verification link will reset failed login attempts and make the new password the active password.

No administrator or DBA has access to any encrypted passwords. Passwords can only ever be registered or reset by the user and can not be retrieved.

## Login

The login route will retrieve a user record from the ACL and check the encrypted password from the request body against the stored password. A user cookie will be set on the response header. The cookie contains a JWT with the user email and roles. The max-age of the token can be configured the process environment. Logout will destroy the token.
Refreshing the cookie will update the user details stored in the token.

## Failed Logins

Only a mismatch of stored and provided password is considered a failed login. A failed login counter in the ACL will increase if this occurs. The user is notified via email when a failed login attempt is made. The email contains information in regards to the client address from where the attempt originates. A user account is **locked** after three failed login attempts. This will require the user to reset the password in order to receive a verification token to complete the password reset and reset the failed logins counter.

## Blocked accounts

Administrator may block a user account. A blocked user may not login, reset [or register] with the same email address.

## User expiration

An `APPROVAL_EXPIRY` in days can be set in the process environment. The login module will check the number of days since an account was approved by an administrator. The approval flag will be removed from the user record if the days exceed the `APPROVAL_EXPIRY` value.

# ACL

The Access Control List (ACL) is a table of user account records. The password is never stored as clear text.

```sql
CREATE TABLE acl_schema.acl_table (
  "_id" serial not null,
  email text not null,
  password text,
  verified boolean default false,
  approved boolean default false,
  verificationtoken text,
  approvaltoken text,
  failedattempts integer default 0,
  password_reset text,
  api text,
  approved_by text,
  access_log text[] default '{}'::text[],
  blocked boolean default false,
  roles text[] default '{}'::text[],
  admin boolean default false,
  language text default 'en',
  expires_on bigint,
  session text
);
```

# Roles

Roles determine access to the workspace ressources such as templates and locales.

# API Keys

A user record which has API keys enabled may request a new API key on the `/api/user/key` endpoint. The returned key is stored in the ACL. Only one current key is valid for the user. The API key stores roles but can not be used for administrative access. API keys are validated on every request.

# Sessions

A session token is stored in the user token if enabled as `NANO_SESSION` in the process environment.

# Authentication strategy

Any request requiring authentication is channeled through the `user/auth` module.

The auth module will check for request authorization header and will try to retrieve a user object associated with user name/password from the authorization header.

A token can be provided as parameter [eg. the API key] or will be extarcted from a relevant request cookie.

A token signature must be verified.

The session key will be checked against the ACL user record to validate current use.

Revoking or overwriting the session key by logging into a different device will invalidate the session key.

API token will always be checked against the user ACL record. Removing/revoking a token in the record will immediately invalidate the use of the token.

Token in a cookie without session key cannot be revoked. They remain valid until the token expires.

# NULL password

A user may not reset a password which is stored as NULL in the ACL. This allows to restrict user to alternative authentication methods such as SAML.

# SAML SSO

Single Sign On (SSO) is possible via [SAML 2.0](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language).

Rewrites to the SAML endpoints must be provided.

The [SAML2-JS](https://www.npmjs.com/package/saml2-js) library must be installed.

The SAML Service Provider (SP) requires a unique entity ID defined as environment variable `SAML_ENTITY_ID`.

The SP provider requires a certificate and matching private key. The _pem_ and matching _crt_ files must be located in the repository root. The file name (without the file extension) must be provided as environment variable `SAML_SP_CRT`.

The SAML Assertion Consumer Service (ACS) endpoint is **/saml/acs**, e.g. [https://geolytix.dev/mapp/saml/acs](https://geolytix.dev/mapp/saml/acs). The ACS address must be defined as environment variable `SAML_ACS`.

These above settings enable the SAML metadata endpoint \*\*/saml/metadata`, e.g. [https://geolytix.dev/mapp/saml/metadata](https://geolytix.dev/mapp/saml/metadata).

The SAML metadata provides necessary information to configure the SAML Identity Provider (IdP).

The IdP must provide a certificate to enable decryption of token. The _crt_ file must be located in the repository root. The file name (without the crt extension) must be provided as environment variable `SAML_IDP_CRT`.

The SSO login url for the IdP must be provided as environment variable `SAML_SSO`.

The SAML login can be logged (not recommended in production) with the `auth_token` and `saml_response` logger keys.

The SAML email must match a user record in the ACL to provide user roles. A SAML login will not have administrative rights. A SAML user record does not require a password in the ACL. An administrator can create a user record in the ACL without password through the **/api/user/add endpoint**, e.g. [https://geolytix.dev/mapp/api/user/add?email=dennis.bauszus@geolytix.co.uk](https://geolytix.dev/mapp/api/user/add?email=dennis.bauszus@geolytix.co.uk)

ACL lookup for SAML SSO is enabled with the `SAML_ACL` environment variable flag.

SAML SSO is initiated through the **/saml/login** endpint, e.g. [https://geolytix.dev/mapp/saml/login](https://geolytix.dev/mapp/saml/login)
