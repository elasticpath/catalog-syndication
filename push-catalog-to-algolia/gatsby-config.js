require('dotenv').config()

module.exports = {
  plugins: [
    {
      resolve: '@moltin/gatsby-source-moltin',
      options: {
        client_id: process.env.ELASTICPATH_CLIENT_ID
      }
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: [
          {
            query: `
            {
              allMoltinProduct {
                nodes {
                  objectID: id
                  name
                  slug
                  imgUrl: mainImageHref
                  meta {
                    display_price {
                      with_tax {
                        formatted
                      }
                    }
                  }
                  price {
                    amount
                  }
                  categories {
                    name
                  }
                  brands {
                    name
                  }
                  collections {
                    name
                  }
                }
              }
            }
          `,
            transformer: ({
              data: {
                allMoltinProduct: { nodes }
              }
            }) =>
              nodes.map(
                ({ meta, categories, brands, collections, price, ...rest }) => ({
                  ...rest,
                  price: meta.display_price.with_tax.formatted,
                  categories: categories
                    ? categories.map(({ name }) => name)
                    : [],
                  brands: brands ? brands.map(({ name }) => name) : [],
                  collections: collections
                    ? collections.map(({ name }) => name)
                    : [],
                  amount: price
                  ? price[0].amount
                  : null,
                })
              ),
            indexName: process.env.ALGOLIA_INDEX_NAME
          }
        ]
      }
    }
  ]
}
