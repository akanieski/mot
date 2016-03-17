define({ "api": [
  {
    "type": "get",
    "url": "/api/thrones/{latitude}/{longitude}",
    "title": "",
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
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "longitude",
            "description": ""
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
  }
] });
