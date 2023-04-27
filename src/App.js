import "./App.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
function App() {
  const [response, setResponse] = useState({
    location: {
      name: "Gdynia",
    },
    current: {
      condition: {
        icon: "http://cdn.weatherapi.com/weather/64x64/night/116.png",
      },
      temp_c: "0",
      feelslike_c: "0",
      last_updated: "never",
    },
  });
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };
    getLocation();
  }, []);
  useEffect(() => {
    const setUserLocation = async () => {
      if (location) {
        await axios
          .get(apiUrl, {
            headers: {
              "content-type": "application/octet-stream",
              "X-RapidAPI-Key": "",
              "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
            },
            params: { q: `${location.latitude},${location.longitude}` },
          })
          .then((response) => {
            if (response) {
              setResponse(response.data);
            } else {
              console.log(response);
            }
          });
      }
    };

    setUserLocation();
  }, [location]);

  const ref = useRef();

  const apiUrl = "https://weatherapi-com.p.rapidapi.com/current.json";

  async function handleSubmit(e) {
    e.preventDefault();
    const phrase = ref.current.value;
    if (!phrase) {
      console.log("City name cannot be empty");
      return;
    }
    await axios
      .get(apiUrl, {
        headers: {
          "content-type": "application/octet-stream",
          "X-RapidAPI-Key": "",
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
        params: { q: phrase },
      })
      .then((response) => {
        if (response) {
          setResponse(response.data);
        } else {
          console.log(response);
        }
      });
  }
  return (
    <div className="App">
      <div className="weather-box">
        <form onSubmit={handleSubmit}>
          <div className="search">
            <input type="text" placeholder="Enter city name" ref={ref}></input>
          </div>
          {response !== false ? (
            <div className="weather-data">
              <div className="city">
                <h1>{response.location.name}</h1>
              </div>
              <div className="icon">
                <img src={response.current.condition.icon}></img>
              </div>
              <div className="temp">
                Temperatura : {response.current.temp_c}
              </div>
              <div className="feelslike-temp">
                Odczuwalna : {response.current.feelslike_c}
              </div>
              <div className="last-update">Ostatnia aktualizacja :</div>
              <div className="last-update-data">
                {response.current.last_updated}
              </div>
            </div>
          ) : null}

          <div className="search-btn">
            <button type="submit">Search</button>
          </div>
        </form>
      </div>{" "}
      {console.log(response)}
      {console.log(location)}
    </div>
  );
}

export default App;
