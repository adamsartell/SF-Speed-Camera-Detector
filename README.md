# SF Speed Camera Detector

### Real-time Speed Camera Alerts for San Francisco Drivers

![SF Speed Camera Detector app](https://github.com/adamsartell/SF-Speed-Camera-Detector/blob/main/public/images/sf-speed-camera-detector.png?raw=true)

## Table of Contents

* [About The Project](#about-the-project)

* [Features](#features)

* [Technologies Used](#technologies-used)

* [Installation & Setup](#installation--setup)

  * [Prerequisites](#prerequisites)

  * [Cloning the Repository](#cloning-the-repository)

  * [Installing Dependencies](#installing-dependencies)

  * [Google Maps API Key](#google-maps-api-key)

  * [Running the Application](#running-the-application)

* [Usage](#usage)


## About The Project

The SF Speed Camera Detector is a web-based application designed to provide real-time alerts to drivers in San Francisco about nearby speed cameras. Leveraging geolocation data, it tracks the user's position, speed, and heading, integrating with the San Francisco Open Data API for speed camera locations. The application aims to enhance driver awareness and promote safer driving habits by providing timely audio and visual warnings when approaching a monitored zone.

This project demonstrates modern React development practices, including the use of custom hooks for modularizing complex logic (geolocation, data fetching, alert management, and audio settings), ensuring a clean and maintainable codebase.

## Features

* **Real-time Geolocation Tracking:** Continuously monitors the user's latitude, longitude, speed, and calculated heading.

* **Dynamic Map Display:** Utilizes Google Maps to visualize the user's current position and nearby speed camera locations. The map auto-centers and adjusts zoom based on movement.

* **Intelligent Auto-Tracking:** Automatically follows the user's position on the map when moving, but allows for manual panning and a "recenter" button.

* **Proximity Alerts:** Triggers visual and optional audio warnings when a speed camera is within a configurable warning distance.

* **Configurable Audio Alerts:** Users can toggle audio warnings on or off, with preferences saved using cookies.

* **Simulate Warning Feature:** A debugging/demonstration button to manually trigger a speed camera warning.

* **San Francisco Data Integration:** Fetches up-to-date speed camera locations from the SF Open Data API.

* **Responsive UI:** Designed to provide a good experience across different device sizes.

## Technologies Used

* **React**

* **TypeScript**

* **Tailwind CSS**

* **`@react-google-maps/api`:** React components for Google Maps.

* **`js-cookie`:** For simple cookie manipulation (saving audio settings).

* **`react-icons` (e.g., `react-icons/tb`):** For scalable vector icons.

* **SF Open Data API:** Source for speed camera location data.

## Installation & Setup

To get a local copy of this project up and running, follow these steps.

### Prerequisites

* Node.js (LTS version recommended)

* npm (comes with Node.js) or Yarn

### Cloning the Repository

```
git clone https://github.com/adamsartell/SF-Speed-Camera-Detector.git
```
```
cd SF-Speed-Camera-Detector
```

### Installing Dependencies

```
npm install
```
or
```
yarn install
```

### Google Maps API Key

This application requires a Google Maps API Key to display the map.

1. **Obtain a Google Maps API Key:**

   * Go to the [Google Cloud Console](https://console.cloud.google.com/).

   * Create a new project or select an existing one.

   * Enable the following APIs:

     * `Maps JavaScript API`

     * `Geolocation API` (if you intend to use Google's geolocation services for more accurate location, though the app uses `navigator.geolocation` directly for primary location).

   * Go to "APIs & Services" > "Credentials".

   * Create a new API Key (restrict it appropriately for security, e.g., to your domain or `localhost`).

2. **Set up Environment Variable:**

   * Create a file named `.env` in the root of your project (same level as `package.json`).

   * Add your Google Maps API Key to this file. **It must be prefixed with `VITE_` for Vite to expose it to the client-side.**

     ```
     VITE_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"
     
     ```

   * Replace `"YOUR_GOOGLE_MAPS_API_KEY_HERE"` with the actual API key you obtained.

### Running the Application

Once dependencies are installed and your API key is set, you can run the application:

```
npm run dev
```
or
```
yarn dev
```

This will start the development server, usually at `http://localhost:5173` (or another available port). The application will open in your default web browser.

## Usage

1. **Grant Location Permissions:** Upon loading the application, your browser will likely prompt you to grant location access. **You must allow this** for the app to function correctly and detect your position.

2. **View Map:** The map will center on your current location (or San Francisco by default if location is unavailable/denied).

3. **Observe Alerts:** As you move and approach a speed camera within the warning distance, visual alerts will appear on the screen. If audio alerts are enabled, you will hear a warning message.

4. **Recenter Map:** If you manually pan the map, a "Recenter Map" button will appear on the bottom right. Click it to snap the map back to your current location and resume auto-tracking.

5. **Alert Settings:**

   * **Simulate Warning Alert:** Click this button (usually in the bottom right) to test the warning alert system manually.

   * **Toggle Warning Alert Volume:** Use this button (usually in the bottom right) to turn the audio warnings on or off. Your preference will be saved for future sessions.
