import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Cart from "./Cart";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

let allProducts = [];
const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setIsLoading(false);
      return response.data;

      // console.log(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      // console.error(error);
      return [];
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  // const debounceSearch = (event, debounceTimeout) => {
  //   const timerId = setTimeout(async () => {
  //     const searchedProducts = await performSearch(event);
  //     console.log(searchedProducts);
  //     setProducts(searchedProducts);
  //   }, debounceTimeout);
  //   setTimerId(timerId);
  // };
  const debounceSearch = (event, debounceTimeout) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const newTimerId = setTimeout(async () => {
      const searchedProducts = await performSearch(event.target.value);
      setProducts(searchedProducts);
    }, debounceTimeout);
    setTimerId(newTimerId);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await performAPICall();
      if (products) {
        allProducts = products;
        setProducts(products);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const itemsInCart = items.filter((item) => item.productId === productId);
    return itemsInCart.length > 0;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart");
      return;
    }

    try {
      let postCartItems;
      if (options.preventDuplicate) {
        const filteredItem = items.filter(
          (item) => item.productId === productId
        );
        // console.log({ filteredItem });
        postCartItems = { ...filteredItem[0], qty: filteredItem[0].qty + qty };
      } else {
        postCartItems = { productId, qty };
      }

      // console.log({ postCartItems });
      const APIoptions = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(
        `${config.endpoint}/cart`,
        postCartItems,
        APIoptions
      );
      // console.log(response.data);
      return response.data;
    } catch (e) {
      // if (e.response && e.response.status === 400) {
      //   enqueueSnackbar(e.response.data.message, { variant: "error" });
      // } else {
      //   enqueueSnackbar(
      //     "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
      //     {
      //       variant: "error",
      //     }
      //   );
      // }
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const fetchedCartItems = await fetchCart(token);
      setCartItems(fetchedCartItems);
    })();
  }, []);

  const handleAddToCart = async (productId) => {
    if (isItemInCart(cartItems, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item."
      );
      return;
    }
    const updatedCartItems = await addToCart(
      token,
      cartItems,
      products,
      productId,
      1,
      {
        preventDuplicate: false,
      }
    );
    // console.log({ updatedCartItems });
    setCartItems(updatedCartItems);
  };

  const handleQuantity = async (productId, qty) => {
    const updatedCartItems = await addToCart(
      token,
      cartItems,
      products,
      productId,
      qty,
      {
        preventDuplicate: true,
      }
    );
    // console.log({ updatedCartItems });
    setCartItems(updatedCartItems);
  };

  // console.log(allProducts);
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <div className="search-desktop-container">
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            // value={searchValue}
            onChange={(e) => debounceSearch(e, 500)}
          />
        </div>
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        // value={searchValue}
        onChange={(e) => debounceSearch(e, 500)}
      />
      <div className="content-container">
        <div className={`${token ? "grid-container" : null}`}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          {isLoading ? (
            <p>Loading Products</p>
          ) : (
            <>
              {products.length === 0 && <p>No products found</p>}
              {products.length > 0 && (
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
                  {products?.map((product) => (
                    <Grid item xs={6} sm={4} md={3} key={product._id}>
                      <ProductCard
                        product={product}
                        handleAddToCart={handleAddToCart}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </div>
        {token && (
          <div className="cart-container">
            <Cart
              items={cartItems}
              products={allProducts}
              handleQuantity={handleQuantity}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;
