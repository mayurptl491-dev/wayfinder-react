<<<<<<< HEAD
# Wayfinder (React + Vite)

World-map travel planner. Pick a destination, log in or sign up, then see popular places, how to get there from your city, and an estimated cost.

## Run
Requires Node.js 18 or newer.

    npm install
    npm run dev

Open the address it prints (usually http://localhost:5173).
Build for hosting with `npm run build` (output in `dist/`).

## Flow
1. Home: map and list. Click a pin or a list row.
2. Signed out: you are sent to the log in page (sign up is one click away). After logging in you land on the place you chose.
3. Destination page: route on the map, transport options and prices, trip budget slider, popular places.

## Structure
    src/
      main.jsx, App.jsx            entry and routes
      context/AuthContext.jsx      signup, login, logout
      context/TripContext.jsx      start city, currency, price formatting
      pages/                       Home, Destination, Login, Signup
      components/                  Navbar, Layout, ProtectedRoute, AuthForm, WorldMap,
                                   DestinationBrowser, DestinationDetail,
                                   TransportOptions, TripBudget, PlacesList
      data/destinations.js         destinations, start cities, regions
      data/geo.js                  simplified world map outlines
      utils/cost.js                distance and fare estimator
      styles/index.css

## What each main file does (simple guide)

- `App.jsx`: connects the pages using React Router.
- `components/Navbar.jsx`: shows the logo, navigation links, starting city, currency and login/logout buttons.
- `components/Layout.jsx`: displays the navbar and the current page.
- `pages/Home.jsx`: shows the world map and destination list.
- `pages/Destination.jsx`: shows the selected destination.
- `components/DestinationBrowser.jsx`: searches, filters and sorts destinations.
- `components/DestinationDetail.jsx`: displays the selected destination information.
- `components/TransportOptions.jsx`: displays travel methods and estimated fares.
- `components/TripBudget.jsx`: calculates an approximate trip budget.
- `components/PlacesList.jsx`: displays popular places to visit.
- `context/AuthContext.jsx`: handles demo signup, login and logout.
- `context/TripContext.jsx`: stores the starting city and currency.
- `data/`: contains destination and map information.
- `utils/`: contains cost calculations and transport icons.
- `styles/index.css`: contains the application design and responsive navbar styles.

## Notes
- Login is a demo. Accounts and passwords (hashed) are stored in this browser's localStorage. Replace `login` and `signup` in `AuthContext.jsx` with calls to a real backend before going live.
- Costs are estimates from distance and typical fares, not live prices.
- To add a destination, add an object to `D` in `data/destinations.js`.

## New updates

- Added more Indian destinations: Udaipur, Jodhpur, Rishikesh, Manali, Shimla, Amritsar, Darjeeling, Shillong, Andaman Islands, Hampi, Mysuru, Ooty, Puducherry and Khajuraho.
- Use the **Dark mode / Light mode** button in the navbar to change the appearance.
- Your selected theme is saved in the browser, so it stays selected when you reopen the app.

=======
# wayfinder-react
>>>>>>> f5e20fc4ad0ed6237cb7e5e847a909c21fcb75a6
