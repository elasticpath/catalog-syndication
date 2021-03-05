<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Catalog Syndication Utilities

[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/catalog-syndication)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/catalog-syndication/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀
The `sync-catalog-to-algolia` modules perform catalog syndication via a webhook. When products are created/updated/deleted the webhook is triggered and the catalog is synced to Algolia.
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
