import axios from "axios";
import { useCombobox } from "downshift";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";

const WeatherDetails = () => {
  const apiUrl = import.meta.env.VITE_GEOCODING_API_URL;
  const apiKey = import.meta.env.VITE_MAP_BOX_TOKEN;

  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState({
    lng: 0,
    lat: 0,
  });
  const [isInputDisabled, setIsInputDisabled] = useState(false);

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
      const res = await axios.get(``);
      console.log(res.data);
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

  console.log(cityCoordinates);

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
      }
    },
    itemToString: (item) => (item ? item.properties.full_address : ""),
  });

  return (
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
            <div className="detail bg-gray-800 p-8 text-center shadow-lg rounded-lg shadow-[#434343]">
              <div className="flex items-center justify-around mb-8">
                <h4 className="font-semibold text-2xl text-white m-0">London</h4>
                <IoIosSunny className="w-16 h-16 text-yellow-400" />
              </div>
              <h5 className="font-medium text-lg text-white">Today, 04 April</h5>
              <h2 className="font-semibold text-6xl leading-tight text-white m-0">
                24 <b>°</b>
              </h2>
              <p className="font-semibold text-lg text-white mb-8">Sunny</p>
              <div className="flex items-center justify-center mb-6">
                <span className="text-white">19 km/h</span>
                <span className="text-white ml-2">Wind</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white">Hum</span>
                <span className="text-white ml-2">22%</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 h-full px-4">
            <div className="h-48 bg-gray-800 p-8 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <img src="./assets/media/icon/windy-dark.png" className="w-12 h-12 mb-4 mx-auto" alt="Windy Icon" />
              <div className="flex items-center justify-center">
                <p className="font-medium text-lg text-white m-0">Wind</p>
                <p className="font-semibold text-lg text-white ml-3 m-0">19 km/h</p>
              </div>
            </div>
            <div className="h-44 bg-gray-800 p-8 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <img src="./assets/media/icon/windy-dark.png" className="w-12 h-12 mb-4 mx-auto" alt="Windy Icon" />
              <div className="flex items-center justify-center">
                <p className="font-medium text-lg text-white m-0">Wind</p>
                <p className="font-semibold text-lg text-white ml-3 m-0">19 km/h</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 h-full px-4">
            <div className="h-48 bg-gray-800 p-8 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <img src="./assets/media/icon/windy-dark.png" className="w-12 h-12 mb-4 mx-auto" alt="Windy Icon" />
              <div className="flex items-center justify-center">
                <p className="font-medium text-lg text-white m-0">Wind</p>
                <p className="font-semibold text-lg text-white ml-3 m-0">19 km/h</p>
              </div>
            </div>
            <div className="h-44 bg-gray-800 p-8 text-center shadow-lg rounded-lg mb-6 shadow-[#434343]">
              <img src="./assets/media/icon/windy-dark.png" className="w-12 h-12 mb-4 mx-auto" alt="Windy Icon" />
              <div className="flex items-center justify-center">
                <p className="font-medium text-lg text-white m-0">Wind</p>
                <p className="font-semibold text-lg text-white ml-3 m-0">19 km/h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherDetails;
