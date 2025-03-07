"default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.svg"
      }


 "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["contentlogic.js", "content.js"]
    }
  ],

    "action": {
    "default_title": "Run Live Code"
    
  },