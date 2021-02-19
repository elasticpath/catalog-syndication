<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Catalog Syndication Utilities

[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/catalog-syndication)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/catalog-syndication/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀
The `push-catalog-to-algolia` module performs catalog syndication once and need to be run whenever you want to push the catalog to the Algolia. This is useful for pushing up large catalogs where the catalog has already been created on Elastic Path Commerce Cloud, but the catalog has not previously been synced. 

## Configure Catalog
On Elastic Path Commerce Cloud complete the following/check that your current catalog satsifies this configuration:
1. Create at least 1 Product (Catalogue -> Products). Ensure you have an image uploaded for the product, and the status of the product is set to Live.
2. Create at least 1 Brand (Catalogue -> Brands)
3. Create at least 1 Category (Catalogue -> Categories)
4. Create at least 1 Collection (Catalogue -> Collections)
5. Link your Product(s) to the appropriate category, brand and collection(s). All categories, brands and collections created MUST be linked to at least 1 product.

## Run the Script
```bash
# Executes the script to perform the syndication:
yarn build

# Cleans the project if any errors encountered, prior to re-building:
yarn clean
```
