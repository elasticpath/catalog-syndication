<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Catalog Syndication Utilities

[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/catalog-syndication)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/catalog-syndication/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀

The Elastic Path Commerce Cloud Catalog Syndication Utilities are a flexible set of scripts built on Elastic Path’s RESTful e-commerce API that assist with pushing products, collections, categories and brands to external services from Elastic Path Commerce Cloud. The utilities use the e-commerce capabilities provided by Elastic Path Commerce Cloud and transacts data in a RESTful manner.

The Catalog Syndication Utilities currently support pushing/syncing to:
- Algolia
- Coveo

## Documentation 📖

### Prerequisites

Before you begin, ensure that you have the following accounts set up:

- [Elastic Path Commerce Cloud account](https://dashboard.elasticpath.com/login)
- The search provider you will be utilizing:
  - [Algolia account](https://www.algolia.com/) - Algolia is supported for syndicating products, collections, categories and brands to.
  - [Coveo account](https://www.coveo.com/en) - Coveo is supported for syndicating products only.

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
cd catalog-syndication/<module>

# Install all the dependencies for all sub-project and create necessary symlinks in-between them
yarn

# In the root directory, create an .env file and add the required variables with your account information.
# For more information, see Configuration Parameter Descriptions.
```

### Modules
Refer to specific module `README.md` for specific usage instructions of each module:
- [push-catalog-to-algolia](./push-catalog-to-algolia/README.md)
- [sync-catalog-to-algolia](./sync-catalog-to-algolia/README.md)
- [sync-catalog-to-coveo](./sync-catalog-to-coveo/README.md)

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