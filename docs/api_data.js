define({ "api": [
  {
    "type": "post",
    "url": "/api/auth/basic",
    "title": "Basic Authentication",
    "version": "0.1.0",
    "name": "BasicAuthentication",
    "group": "Auth",
    "description": "<p>Creates authentication token when provided valid basic auth credentials</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "Email",
            "description": "<p>Email to be used when creating user profile. (Either Username or Password is required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "Username",
            "description": "<p>Username to be used when creating user profile (Either Username or Password is required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "Password",
            "description": "<p>Password to be used when creating user profile</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "POST http://localhost/api/auth/basic\n{\n  \"username\": \"Smeagle\",\n  \"password\": \"MyPrecious\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Javascript web token to be used for future requests</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Whether or not query was successful</p>"
          }
        ]
      }
    },
    "filename": "app/controllers/users.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/api/thrones/{Id}",
    "title": "Get Throne Details",
    "version": "0.1.0",
    "name": "GetThrone",
    "group": "Thrones",
    "description": "<p>Get single throne's details</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "Id",
            "description": "<p>Throne Id</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/thrones/1",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Requested throne data</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Whether or not query was successful</p>"
          }
        ]
      }
    },
    "filename": "app/controllers/thrones.js",
    "groupTitle": "Thrones"
  },
  {
    "type": "get",
    "url": "/api/thrones/{latitude}/{longitude}",
    "title": "Get Thrones by Viscinity",
    "version": "0.1.0",
    "name": "GetThrones",
    "group": "Thrones",
    "description": "<p>List thrones by geographic location</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "latitude",
            "description": "<p>*Required</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "longitude",
            "description": "<p>*Required</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/thrones/47.1326132/-75.66623416",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>List of Thrones (Array of Objects).</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Whether or not query was successful</p>"
          }
        ]
      }
    },
    "filename": "app/controllers/thrones.js",
    "groupTitle": "Thrones"
  },
  {
    "type": "post",
    "url": "/api/user",
    "title": "Create User",
    "version": "0.1.0",
    "name": "CreateUser",
    "group": "Users",
    "description": "<p>Create new user profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "Email",
            "description": "<p>Email to be used when creating user profile [Unique]</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "Username",
            "description": "<p>Username to be used when creating user profile [Unique]</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "Password",
            "description": "<p>Password to be used when creating user profile</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "POST http://localhost/api/user\n{\n  \"username\": \"Smeagle\",\n  \"password\": \"MyPrecious\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Javascript web token to be used for future requests</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Whether or not query was successful</p>"
          }
        ]
      }
    },
    "filename": "app/controllers/users.js",
    "groupTitle": "Users"
  }
] });
