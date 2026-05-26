# 🍔 Swiggy Clone - Live Food App!

Hey there! Welcome to this awesome **Swiggy Clone** web app. It looks, feels, and acts just like the real Swiggy app, fetching live restaurants and menus directly from Swiggy's actual live API!

---

## 🌟 What This App Can Do!

*   **Live Geolocation API Integration**: Requests location access on mount to automatically find and display active restaurants, top chains, curated collections, and menus specific to *your actual current coordinates*! (Falls back cleanly to Bangalore if blocked.)
*   **What's on your mind? Carousel**: Smooth category sliding scroll! Click on pizza, biryani, or burger, and it will load a brand-new page with restaurants matching that specific category.
*   **Search & Filtering**:
    *   Find your favorite spots by typing in the search box.
    *   Quick-filter buttons for *Ratings 4.4+*, *Fast Delivery*, *Pure Veg*, *Offers*, and *Under ₹300*.
    *   Sort everything by rating, cost, or delivery time in a snap!
*   **Detailed Restaurant Menus**: Click any restaurant to open their menu page, browse dishes sorted under expand/collapse category groups, and check prices/ratings.
*   **Fully Functional Shopping Cart**:
    *   Add tasty items to your cart directly from the menu.
    *   A floating bar pops up to remind you of your cart total.
    *   Slide-out drawer cart showing item quantities, prices, delivery fee, taxes, and final pay amount.
    *   If you add items from a *different* restaurant, the app safely asks if you'd like to start fresh.
*   **Order Success Animation**: Hit "Proceed to Pay" to confirm your order and see a cool animated delivery partner bike ride across the screen!

---

## 📂 Splitting Up The Code

We have completely modularized this app by splitting the huge `App.js` into clean, simple components. Here is how they are organized:

*   `App.js`: The main boss of the app. It holds the states, coordinates page switching, and passes functions down.
*   `utils/constants.js`: Holds all the image URLs, CDN links, and Swiggy API URLs.
*   `utils/helpers.js`: Contains helper code like the proxy bypass mechanism to dodge CORS errors.
*   `components/`:
    *   `Header.js`: The header navigation bar with the Swiggy logo and dynamic shopping cart count badge.
    *   `Shimmer.js`: The loading state display so users don't see a blank white page.
    *   `MindCarousel.js`: The horizontal category selector (What's on your mind?).
    *   `TopChains.js`: The horizontal scroll displaying top brand restaurant chains.
    *   `RestaurantCard.js`: The individual restaurant card showing offers, delivery time, cuisines, and average rating.
    *   `FilterBar.js`: Search input and filter button group.
    *   `RestaurantCollection.js`: Curated category listing page.
    *   `RestaurantMenu.js`: Complete restaurant menu page with expand/collapse food accordions.
    *   `CartDrawer.js`: Slide-out shopping cart sidebar with bill calculation.
    *   `OrderSuccess.js`: Checkout success pop-up with a cute scooter driving animation.

---

## 🚀 How to Run it Locally

It is extremely easy to get this app up and running on your machine:

1.  **Start the Proxy Server** (so we don't get blocked by CORS errors):
    ```bash
    node server.js
    ```
2.  **Start the React Development Server** (compiles components and serves the page):
    ```bash
    npm run start
    ```
    *or*
    ```bash
    npx parcel index.html --port 1234
    ```
3.  Open `http://localhost:1234` in your browser and start ordering food! 🍕🍟🥤
