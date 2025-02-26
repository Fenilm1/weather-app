"use client";

import { useState, useEffect } from "react";
import {
	Search,
	Cloud,
	CloudRain,
	Sun,
	CloudLightning,
	CloudSnow,
	CloudFog,
	X,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface WeatherData {
	name: string;
	main: {
		temp: number;
		feels_like: number;
		humidity: number;
		pressure: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	wind: {
		speed: number;
	};
	sys: {
		country: string;
	};
}

interface ForecastData {
	list: {
		dt: number;
		main: {
			temp: number;
		};
		weather: {
			id: number;
			main: string;
			description: string;
		}[];
	}[];
}

export default function WeatherApp() {
	const [city, setCity] = useState("");
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [forecast, setForecast] = useState<ForecastData | null>(null);
	const [loading, setLoading] = useState(false);
	const [searchHistory, setSearchHistory] = useState<string[]>([]);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		const savedHistory = localStorage.getItem("searchHistory");
		if (savedHistory) {
			setSearchHistory(JSON.parse(savedHistory));
		}
		const lastSearched = localStorage.getItem("lastSearched");
		if (lastSearched) {
			setCity(lastSearched);
			fetchWeather(lastSearched);
		}
	}, []);

	const fetchWeather = async (cityName: string) => {
		if (!cityName.trim()) {
			toast.error("Please enter a city name");
			return;
		}

		setLoading(true);
		try {
			const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
			const weatherResponse = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
			);
			const forecastResponse = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
			);

			if (!weatherResponse.ok || !forecastResponse.ok) {
				throw new Error("City not found");
			}

			const weatherData = await weatherResponse.json();
			const forecastData = await forecastResponse.json();
			setWeather(weatherData);
			setForecast(forecastData);
			toast.success(`Weather data fetched for ${weatherData.name}`);

			updateSearchHistory(cityName);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to fetch weather data"
			);
			setCity("");
		} finally {
			setLoading(false);
		}
	};

	const updateSearchHistory = (cityName: string) => {
		const updatedHistory = [
			cityName,
			...searchHistory.filter(
				(c) => c.toLowerCase() !== cityName.toLowerCase()
			),
		].slice(0, 5);
		setSearchHistory(updatedHistory);
		localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
		localStorage.setItem("lastSearched", cityName);
	};

	const removeFromHistory = (cityToRemove: string) => {
		const updatedHistory = searchHistory.filter(
			(c) => c.toLowerCase() !== cityToRemove.toLowerCase()
		);
		setSearchHistory(updatedHistory);
		localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
		if (
			cityToRemove.toLowerCase() ===
			localStorage.getItem("lastSearched")?.toLowerCase()
		) {
			localStorage.removeItem("lastSearched");
		}
	};

	const getWeatherIcon = (weatherId: number) => {
		if (weatherId >= 200 && weatherId < 300) {
			return <CloudLightning className="h-24 w-24 text-yellow-400" />;
		} else if (weatherId >= 300 && weatherId < 600) {
			return <CloudRain className="h-24 w-24 text-blue-400" />;
		} else if (weatherId >= 600 && weatherId < 700) {
			return <CloudSnow className="h-24 w-24 text-slate-200" />;
		} else if (weatherId >= 700 && weatherId < 800) {
			return <CloudFog className="h-24 w-24 text-slate-400" />;
		} else if (weatherId === 800) {
			return <Sun className="h-24 w-24 text-yellow-500" />;
		} else {
			return <Cloud className="h-24 w-24 text-slate-400" />;
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
			<Card className="w-full max-w-4xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl text-center">
						Weather App
					</CardTitle>
					<CardDescription className="text-center">
						Enter a city name to get the current weather
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-2 mb-4">
						<Input
							placeholder="Enter city name..."
							value={city}
							onChange={(e) => setCity(e.target.value)}
							onKeyDown={(e) =>
								e.key === "Enter" && fetchWeather(city)
							}
							className="flex-1"
						/>
						<Button
							onClick={() => fetchWeather(city)}
							disabled={loading}
						>
							{loading ? (
								<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
							) : (
								<Search className="h-4 w-4" />
							)}
						</Button>
					</div>

					{/* Search History */}
					{searchHistory.length > 0 && (
						<div className="mb-4">
							<h3 className="text-sm font-semibold mb-2">
								Recent Searches:
							</h3>
							<div className="flex flex-wrap gap-2">
								{searchHistory.map((historyCity) => (
									<div
										key={historyCity}
										className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1"
									>
										<button
											onClick={() =>
												fetchWeather(historyCity)
											}
											className="text-sm mr-2"
										>
											{historyCity}
										</button>
										<button
											onClick={() =>
												removeFromHistory(historyCity)
											}
											className="text-red-500"
										>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{loading && (
						<p className="text-center">Loading weather data...</p>
					)}

					{weather && forecast && !loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Current Weather */}
							<div className="flex flex-col items-center">
								<div className="flex items-center justify-center">
									{getWeatherIcon(weather.weather[0].id)}
								</div>
								<h2 className="mt-4 text-3xl font-bold">
									{weather.name}, {weather.sys.country}
								</h2>
								<p className="text-5xl font-bold mt-2">
									{Math.round(weather.main.temp)}°C
								</p>
								<p className="text-lg capitalize mt-1">
									{weather.weather[0].description}
								</p>

								<div className="grid grid-cols-2 gap-4 w-full mt-6">
									<div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
										<span className="text-sm text-muted-foreground">
											Feels Like
										</span>
										<span className="font-medium">
											{Math.round(
												weather.main.feels_like
											)}
											°C
										</span>
									</div>
									<div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
										<span className="text-sm text-muted-foreground">
											Humidity
										</span>
										<span className="font-medium">
											{weather.main.humidity}%
										</span>
									</div>
									<div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
										<span className="text-sm text-muted-foreground">
											Wind
										</span>
										<span className="font-medium">
											{weather.wind.speed} m/s
										</span>
									</div>
									<div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
										<span className="text-sm text-muted-foreground">
											Pressure
										</span>
										<span className="font-medium">
											{weather.main.pressure} hPa
										</span>
									</div>
								</div>
							</div>

							{/* 5-day forecast */}
							<div>
								<h3 className="text-lg font-semibold mb-2">
									5-Day Forecast
								</h3>
								<div className="space-y-2">
									{forecast.list
										.filter((_, index) => index % 8 === 0)
										.slice(0, 5)
										.map((day) => (
											<div
												key={day.dt}
												className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-lg"
											>
												<span>
													{new Date(
														day.dt * 1000
													).toLocaleDateString(
														"en-US",
														{ weekday: "short" }
													)}
												</span>
												<span>
													{Math.round(day.main.temp)}
													°C
												</span>
												<span>
													{day.weather[0].main}
												</span>
											</div>
										))}
								</div>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-between items-center">
					<span className="text-sm text-muted-foreground">
						Data by OpenWeather API
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setTheme(theme === "dark" ? "light" : "dark")
						}
					>
						Toggle {theme === "dark" ? "Light" : "Dark"} Mode
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
