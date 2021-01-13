<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Catalog Syndication Utilities

[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/catalog-syndication)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/catalog-syndication/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀

The Elastic Path Commerce Cloud Catalog Syndication Utilities are a flexible set of scripts built on Elastic Path’s RESTful e-commerce API that assist with pushing products, collections, categories and brands to external services from Elastic Path Commerce Cloud. The utilities use the e-commerce capabilities provided by Elastic Path Commerce Cloud and transacts data in a RESTful manner.

The Catalog Syndication Utilities currently support pushing to:
- Algolia
- Coveo

## Documentation 📖

### Prerequisites

Before you begin, ensure that you have the following accounts set up:

- [Elastic Path Commerce Cloud account](https://dashboard.elasticpath.com/login)
- [Algolia account](https://www.algolia.com/) - Algolia is supported for syndicating products, collections, categories and brands to.
- [Coveo account](https://www.coveo.com/en) - Coveo is supported for syndicating products only.

#### Configure Catalog
1. Create at least 1 Product (Catalogue -> Products). Ensure you have an image uploaded for the product, and the status of the product is set to Live.
2. Create at least 1 Brand (Catalogue -> Brands)
3. Create at least 1 Category (Catalogue -> Categories)
4. Create at least 1 Collection (Catalogue -> Collections)
5. Link your Product(s) to the appropriate category, brand and collection(s). All categories, brands and collections created MUST be linked to at least 1 product.

### Development tools

An Elastic Path Commerce Cloud Catalog Syndication Utilities development environment requires the following software:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/en/)
- [ngrok](https://ngrok.com/)
- [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
    - [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
    - [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- **Windows Only:** [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about)

### Knowledge Requirements

To customize and extend the utilities, you need knowledge in the following technologies:

- [JavaScript](https://www.javascript.com/)

### Start Running the Utilities

**Note**: If you are running a Windows environment, launch the Windows Subsystem for Linux application and perform the following steps from the console window.

```bash
# Clone the Git repository
git clone https://github.com/elasticpath/catalog-syndication.git

# Go into the cloned directory, and the utility subdirectory
cd catalog-syndication/push-catalog-to-<service>

# Install all the dependencies for all sub-project and create necessary symlinks in-between them
yarn

# In the root directory, create an .env file and add the required variables with your account information.
# For more information, see Configuration Parameter Descriptions.
```
#### For Algolia
```bash
# Executes the script to perform the syndication:
yarn build

# Cleans the project if any errors encountered, prior to re-building:
yarn clean
```
#### For Coveo
```bash
# Start the server for the function, the server will typically start on PORT `3000`, if not, make a note for the next step.
yarn dev

# Start ngrok, This will expose PORT `3000` to the outside world. Make a note of the `http` URL ngrok provides.
ngrok http 3000
```

### Create the Elastic Path Webhook

You must now tell Elastic Path Commerce Cloud the ngrok URL above. Head to the [Elastic Path Commerce Cloud Dashboard](https://dashboard.moltin.com/app/settings/integrations).

1. login and go to `Settings > Integrations` and click `Create`.
2. Enter a name and description for your Integration.
3. Enter the ngrok http URL in the `URL` field.
4. Enter the `ELASTICPATH_WEBHOOK_SECRET` from the `.env` file(this can be any random string) in the `Secret Key` field.
5. Check `created`/`updated`/`deleted` observables for Product.
6. Click `Save`.

### Create the Coveo Resources
Login to the [Coveo Administration Console](https://platform.cloud.coveo.com/admin).

#### Create fields
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
#### Create a Source
1. Navigate to `Content > Sources`.
2. Click `Add source`.
3. Choose `Push`.
4. Enter a name for the source.
5. Click `Add source`.

#### Create Source Mappings
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

#### Create a Catalog
1. Navigate to `Commerce > Catalogs`.
2. Click `Add catalog`.
3. Enter a name.
4. Select the source you created for `Associated Sources`.
5. Select `Multiple channels` for  `Define your channel`.
6. Click `Add catalog`.

#### Create an API Key
1. Navigate to `Organization > API Keys`.
2. Click `Add key`.
3. Enter a name for the key.
4. Under the `Privileges` tab, select `Full access` for the `Preset` dropdown.
5. Click `Add key`.
6. Copy and save the key, you won't be able to retrieve it from the console later.

## Configuration Parameter Descriptions ⚙️

Parameters that require configuration must be added to the `/catalog-syndication/.env` file:

|Service|  Parameter| Importance|Type|Description|
|--|--|--|--|--|
|Algolia/Coveo|`ELASTICPATH_CLIENT_ID`| Required| String| The Client ID of your store.|
|Algolia|`ALGOLIA_INDEX_NAME`| Required| String| Name of Algolia index used for search functions.|
|  |`ALGOLIA_APP_ID`| Required| String| Algolia application identifier.|
|  |`ALGOLIA_ADMIN_KEY`| Required| String| Algolia administrative API key used to modify records.|
|Coveo|`ELASTICPATH_CLIENT_SECRET`| Required| String| The Client secret of your store.|
|  |`ELASTICPATH_STORE_ID`| Required| String| The store ID.|
|  |`ELASTICPATH_WEBHOOK_SECRET`| Required| String| A random string for authenticating between Elastic Path and the function.|
|  |`COVEO_ORG_ID`| Required| String| Coveo organization ID.|
|  |`COVEO_SOURCE_ID`| Required| String| ID of the source you created in Coveo.|
|  |`COVEO_API_KEY`| Required| String| The API key you created, used to connect to Coveo.|

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Yilin-W"><img src="https://avatars1.githubusercontent.com/u/64274391?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Yilin-W
</b></sub></a><br /><a href="https://github.com/elasticpath/catalog-syndication/commits?author=Yilin-W" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mwan-ep"><img src="https://avatars3.githubusercontent.com/u/54115904?v=4" width="100px;" alt=""/><br /><sub><b>Michelle Wan</b></sub></a><br /><a href="https://github.com/elasticpath/catalog-syndication/commits?author=mwan-ep" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/shaunmaharaj"><img src="https://avatars3.githubusercontent.com/u/39800563?v=4" width="100px;" alt=""/><br /><sub><b>Shaun Maharaj</b></sub></a><br /><a href="https://github.com/elasticpath/catalog-syndication/commits?author=shaunmaharaj" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Terms And Conditions

- Any changes to this project must be reviewed and approved by the repository owner. For more information about contributing, see the [Contribution Guide](https://github.com/elasticpath/catalog-syndication/blob/master/.github/CONTRIBUTING.md).
- For more information about the license, see [GPLv3 License](https://github.com/elasticpath/catalog-syndication/blob/master/LICENSE).
