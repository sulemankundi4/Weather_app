import axios from "axios";
import { useCombobox } from "downshift";
import { useEffect, useState } from "react";
import { FaEdit, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import { FaTemperatureArrowUp } from "react-icons/fa6";

const WeatherDetails = () => {
  const apiUrl = import.meta.env.VITE_GEOCODING_API_URL;
  const apiKey = import.meta.env.VITE_MAP_BOX_TOKEN;
  const weatherApiKey = import.meta.env.VITE_API_KEY;
  const iconAPi = import.meta.env.VITE_ICON_API;
  const fiveDaysForecast = import.meta.env.VITE_FIVE_DAYS_FORECAST_API;

  // /forecast?lat=44.34&lon=10.99&appid={API key}

  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityCoordinates, setCityCoordinates] = useState({
    lng: 0,
    lat: 0,
  });
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [weatherData, setWeatherData] = useState({
    cityName: "",
    temperature: 0,
    weather: "",
    wind: 0,
    humidity: 0,
    icon: "",
    flag: "",
    tempMin: 0,
    tempMax: 0,
  });

  const searchCity = async (cityName) => {
    try {
      const res = await axios.get(`${apiUrl}/forward?q=${cityName}&proximity=ip&access_token=${apiKey}`);
      setCities(res.data.features);
    } catch (e) {
      console.error("Error fetching city data:", e);
    }
  };

  const fetchCurrentWeather = async (lat, lng) => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}`);
      console.log(res.data);
      setWeatherData({
        cityName: res.data.name,
        temperature: res.data.main.temp,
        weather: res.data.weather[0].main,
        wind: res.data.wind.speed,
        humidity: res.data.main.humidity,
        icon: res.data.weather[0].icon,
        flag: res.data.sys.country.toLowerCase(),
        tempMin: res.data.main.temp_min,
        tempMax: res.data.main.temp_max,
      });
    } catch (e) {
      console.error("Error fetching weather data:", e);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (cityName) {
        searchCity(cityName);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [cityName]);

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem } = useCombobox({
    items: cities,
    onInputValueChange: ({ inputValue }) => {
      setCityName(inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setIsInputDisabled(true);
        setCityCoordinates({
          lng: selectedItem.geometry.coordinates[0],
          lat: selectedItem.geometry.coordinates[1],
        });

        fetchCurrentWeather(selectedItem.geometry.coordinates[1], selectedItem.geometry.coordinates[0]);
      }
    },
    itemToString: (item) => (item ? item.properties.full_address : ""),
  });

  return (

  <>

    <section className="pt-24 w-[94%] mx-auto">
      <div>
        <div className="text-center">
          <h2 className="font-semibold text-4xl leading-tight tracking-wide text-white mb-4">Today Weather Details</h2>
          <p className="font-normal text-lg leading-relaxed tracking-wide text-gray-400 mb-12">The 'Recent Search Weather' section displays the latest weather information for the cities you have recently searched. Stay up-to-date with the weather conditions of your preferred cities with this section.</p>
        </div>
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              {...getInputProps({
                placeholder: "Search for a city...",
                className: "w-full p-4 pl-10 rounded-lg bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
                disabled: isInputDisabled,
              })}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l-4-4m0 0l4-4m-4 4h12" />
            </svg>
            {isInputDisabled && (
              <button onClick={() => setIsInputDisabled(false)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEdit />
              </button>
            )}
            <ul {...getMenuProps()} className={`absolute z-10 w-full bg-[#1F2937] text-white mt-1 rounded-lg shadow-lg ${!(isOpen && cities.length) && "hidden"}`}>
              {isOpen &&
                cities.map((item, index) => (
                  <li key={item.id} {...getItemProps({ item, index })} className={`p-3 cursor-pointer text-lg text-white ${highlightedIndex === index ? "bg-gray-700" : ""} ${selectedItem === item ? "font-bold" : ""}`}>
                    {item.properties.full_address}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-8">
            <div className="detail bg-gray-800 p-4 text-center shadow-lg rounded-lg shadow-[#434343]">
              <div className="flex items-center justify-around mb-8">
                <div className="flex items-center">
                  <img src={`https://flagcdn.com/16x12/${weatherData.flag}.png`} srcSet={`https://flagcdn.com/32x24/${weatherData.flag}.png 2x, https://flagcdn.com/48x36/${weatherData.flag}.png 3x`} width="36" height="44" className="mr-2 mt-2" />
                  <h4 className="font-semibold text-4xl text-white m-0">{weatherData.cityName}</h4>
                </div>
                <img src={`${iconAPi}/${weatherData.icon}@2x.png`} className="w-[130px] h-[110px]" alt="Weather Icon" />
              </div>
              <h5 className="font-medium text-lg text-gray-400 mb-4">Today, {new Date().toLocaleDateString()}</h5>
              <h2 className="font-semibold text-6xl leading-tight text-white m-0 mb-4">
                {Math.round(weatherData.temperature - 273.15)} <b>°C</b>
              </h2>
              <p className="font-semibold text-lg text-gray-300 mb-8">{weatherData.weather}</p>
              <div className="flex items-center justify-center mb-6">
                <span className="text-white flex items-center">
                  <FaWind className="w-8 h-6 mr-2" />
                  {weatherData.wind} km/h
                </span>
                <span className="text-white ml-4 flex items-center">
                  <WiHumidity className="w-8 h-8" />
                  Humidity: {weatherData.humidity}%
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 h-full px-4">
            <div className="h-48 bg-gray-800 p-4 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <FaWind className="w-[100px] mx-auto h-[80px] text-white text-center" />

              <div className="flex items-center justify-center mt-8">
                <p className="font-medium text-xl text-white m-0">Wind</p>
                <p className="font-semibold text-2xl text-white ml-3 m-0">{weatherData.wind} km/h</p>
              </div>
            </div>
            <div className="h-44 bg-gray-800 p-4 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <WiHumidity className="w-[100px] mx-auto h-[80px] text-white text-center" />
              <div className="flex items-center justify-center mt-4">
                <p className="font-medium text-xl text-white m-0">Humidity</p>
                <p className="font-semibold text-2xl text-white ml-3 m-0">{weatherData.humidity}%</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 h-full px-4">
            <div className="h-48 bg-gray-800 p-4 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <FaTemperatureArrowDown className="w-[100px] mx-auto h-[80px] text-white text-center" />
              <div className="flex items-center justify-center mt-8">
                <p className="font-medium text-xl text-white m-0">Minimum Temperature</p>
                <p className="font-semibold text-2xl text-white ml-3 m-0">{Math.round(weatherData.tempMin - 273.15)} °C</p>
              </div>
            </div>
            <div className="h-44 bg-gray-800 p-4 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <FaTemperatureArrowUp className="w-[80px] mx-auto h-[80px] text-white text-center" />
              <div className="flex items-center justify-center mt-4">
                <p className="font-medium text-xl text-white">Maximum Temperature</p>
                <p className="font-semibold text-2xl text-white ml-3 m-0">{Math.round(weatherData.tempMax - 273.15)} °C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default WeatherDetails;
