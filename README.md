# Weather App

A simple, responsive weather application built with Next.js, React, and Tailwind CSS. This app allows users to check current weather conditions and a 5-day forecast for any city.

Find the deployed project over here: [Weather Website](https://weather-app-alpha-indol-28.vercel.app/)

## Features

-   **Current Weather Display** - Get real-time weather conditions for any location.
-   **5-Day Weather Forecast** - View a detailed 5-day weather forecast.
-   **Search History** - Keeps track of searched locations using localStorage.
-   **Responsive Design** - Fully optimized for mobile and desktop devices.
-   **Dark Mode Support** - Automatically adapts to system settings.
-   **Real-Time Weather Data** - Powered by the OpenWeather API.

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Install the latest version of [Node.js and npm](https://nodejs.org/en/download/).
-   Get a free API key from [OpenWeather](https://openweathermap.org/api).

## Installation

Follow these steps to install and run the Weather App:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Fenilm1/weather-app.git
    cd weather-app
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Create an environment file (`.env.local`) and add your API key:**

    ```sh
    NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
    ```

4. **Start the development server:**

    ```sh
    npm run dev
    ```

5. Open your browser and go to `http://localhost:3000/`.

## Usage

1. Enter a city name in the search bar.
2. View the current weather details and 5-day forecast.
3. Check search history for previously searched locations.
4. Toggle dark mode using the theme switcher.
