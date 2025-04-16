# Cookie Clicker CPS Checker

A web app to help Cookie Clicker players find their most efficient next purchase and analyze upgrade efficiency.

## Features

- **CPS Checker:** Enter your current building costs and CPS to see which building gives the best CPS per million cookies spent.
- **Upgrade Efficiency Checker:** Analyze which upgrades provide the best CPS gain for your current game state.
- **Dark/Light Mode:** Toggle between dark and light themes.
- **Persistent State:** Your data is saved in your browser's local storage.
- **Reset Options:** Easily reset all data and start fresh.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/cookie-cps-checker-working.git
   cd cookie-cps-checker-working
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

To start the development server:
```sh
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000).

To build for production:
```sh
npm run build
```

## Project Structure

- `src/App.js` — Main app logic and routing.
- `src/pages/UpgradeChecker.jsx` — Upgrade efficiency checker page.
- `src/data/upgrades.json` — Upgrade data.
- `public/images/icons.png` — Upgrade/building icons sprite.
- `tailwind.config.js` — Tailwind CSS configuration.

## Technologies Used

- React
- Tailwind CSS
- React Router
- Local Storage

## Credits

Built by Stuart Gibson Learning | [Portfolio](https://sglearning.netlify.app)

---

*This project is not affiliated with or endorsed by Orteil or DashNet.*