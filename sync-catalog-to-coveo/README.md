<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Catalog Syndication Utilities

[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/catalog-syndication)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/catalog-syndication/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀
The `sync-catalog-to-coveo` modules perform catalog syndication via a webhook. When products are created/updated/deleted the webhook is triggered and the catalog is synced to Coveo.
## Starting the Development Server
```bash
# Start the server for the function, the server will typically start on PORT `3000`, if not, make a note for the next step.
yarn dev

# Start ngrok, This will expose PORT `3000` to the outside world. Make a note of the `http` URL ngrok provides.
ngrok http 3000
```

## Create the Elastic Path Commerce Cloud Webhook

You must now tell Elastic Path Commerce Cloud the ngrok URL above. Head to the [Elastic Path Commerce Cloud Dashboard](https://dashboard.moltin.com/app/settings/integrations).

1. login and go to `Settings > Integrations` and click `Create`.
2. Enter a name and description for your Integration.
3. Enter the ngrok http URL in the `URL` field.
4. Enter the `ELASTICPATH_WEBHOOK_SECRET` from the `.env` file(this can be any random string) in the `Secret Key` field.
5. Check `created`/`updated`/`deleted` observables for Product.
6. Click `Save`.

## Create the Coveo Resources
Login to the [Coveo Administration Console](https://platform.cloud.coveo.com/admin).

### Create fields
1. Navigate to `Content > Fields`.
2. Click `Add field`.
3. Fill in the details referencing the following JSON
4. Repeat for all of the following fields:
```
[
  {
    "name": "productid",
    "description": "",
    "type": "STRING",
    "facet": true
  },
  {
    "name": "objecttype",
    "description": "",
    "type": "STRING",
    "facet": true
  },
  {
    "name": "name",
    "description": "",
    "type": "STRING",
    "facet": true
  },
  {
    "name": "sku",
    "description": "",
    "type": "STRING"
  },
  {
    "name": "description",
    "description": "",
    "type": "STRING",
    "facet": true
  },
  {
    "name": "body",
    "description": "",
    "type": "STRING"
  },
  {
    "name": "objectid",
    "description": "The EPCC ID of the object",
    "type": "STRING"
  },
  {
    "name": "price",
    "description": "Display price of the product",
    "type": "STRING"
  },
  {
    "name": "amount",
    "description": "Display price of the product",
    "type": "LONG",
    "facet": true
  },
  {
    "name": "slug",
    "description": "Display price of the product",
    "type": "STRING"
  },
  {
    "name": "brands",
    "description": "Display price of the product",
    "type": "STRING",
    "multiValueFacet": true,
    "multiValueFacetTokenizers": ";"
  },
  {
    "name": "categories",
    "description": "Display price of the product",
    "type": "STRING",
    "multiValueFacet": true,
    "multiValueFacetTokenizers": ";"
  },
  {
    "name": "collections",
    "description": "Display price of the product",
    "type": "STRING",
    "multiValueFacet": true,
    "multiValueFacetTokenizers": ";"
  },
  {
    "name": "imgurl",
    "description": "Display price of the product",
    "type": "STRING",
    "facet": true
  }
]
```
### Create a Source
1. Navigate to `Content > Sources`.
2. Click `Add source`.
3. Choose `Push`.
4. Enter a name for the source.
5. Click `Add source`.

### Create Source Mappings
1. Click on the source you just created, then click `More > Manage Mappings` on the top utility bar.
2. Click the JSON tab and paste in the following:
```
{
    "common": {
        "rules": [
            { "field": "title", "content": [ "%[name]" ] },
            { "field": "productid", "content": [ "%[id]" ] },
            { "field": "body", "content": [ "<html><body>%[description]</body></html>" ] }
    	]
    },
    "types": []
}
```
3. Click `Save and rebuild source`.

### Create a Catalog
1. Navigate to `Commerce > Catalogs`.
2. Click `Add catalog`.
3. Enter a name.
4. Select the source you created for `Associated Sources`.
5. Select `Multiple channels` for  `Define your channel`.
6. Click `Add catalog`.

### Create an API Key
1. Navigate to `Organization > API Keys`.
2. Click `Add key`.
3. Enter a name for the key.
4. Under the `Privileges` tab, select `Full access` for the `Preset` dropdown.
5. Click `Add key`.
6. Copy and save the key, you won't be able to retrieve it from the console later.