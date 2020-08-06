<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Catalog Syndication Utilities

[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/catalog-syndication)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/catalog-syndication/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀

The Elastic Path Commerce Cloud Catalog Syndication Utilities are a flexible set of scripts built on Elastic Path’s RESTful e-commerce API that assist with pushing products, collections, categories and brands to external services from Elastic Path Commerce Cloud. The utilities use the e-commerce capabilities provided by Elastic Path Commerce Cloud and transacts data in a RESTful manner.

## Documentation 📖

### Prerequisites

Before you begin, ensure that you have the following accounts set up:

- [Elastic Path Commerce Cloud account](https://dashboard.elasticpath.com/login)
- [Algolia account](https://www.algolia.com/) - Algolia is supported for syndicating products, collections, categories and brands to.

#### Configure Catalog
1. Create at least 1 Product (Catalogue -> Products). Ensure you have an image uploaded for the product, and the status of the product is set to Live.
2. Create at least 1 Brand (Catalogue -> Brands)
3. Create at least 1 Category (Catalogue -> Categories)
4. Create at least 1 Collection (Catalogue -> Collections)
5. Link your Product(s) to the appropriate category, brand and collection(s). All categories, brands and collections created MUST be linked to at least 1 product.
s
### Development tools

An Elastic Path Commerce Cloud Catalog Syndication Utilities development environment requires the following software:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/en/)
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

# Go into the cloned directory
cd catalog-syndication

# Install all the dependencies for all sub-project and create necessary symlinks in-between them
yarn

# Configure the .env file.
# For more information, see Configuration Parameter Descriptions.

# Executes the script to perform the syndication:
yarn build

# Cleans the project if any errors encountered, prior to re-building:
yarn clean
```

## Configuration Parameter Descriptions ⚙️

Parameters that require configuration are in the `.env` file:

|  Parameter| Importance|Type|Description|
|--|--|--|--|
|`ELASTICPATH_CLIENT_ID`| Required| String| The Client ID of your store.|
|`ALGOLIA_INDEX_NAME`| Required| String| Name of Algolia index used for search functions.|
|`ALGOLIA_APP_ID`| Required| String| Algolia application identifier.|
|`ALGOLIA_ADMIN_KEY`| Required| String| Algolia administrative API key used to modify records.|
|`ALGOLIA_API_KEY`| Required| String| Algolia API key used to read records.|

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Yilin-W"><img src="https://avatars1.githubusercontent.com/u/64274391?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Yilin-W
</b></sub></a><br /><a href="https://github.com/elasticpath/catalog-syndication/commits?author=Yilin-W" title="Code">💻</a></td>
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
