import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Spinner, Card, Modal, Button } from 'react-bootstrap';
import { FiArrowUpRight, FiSearch, FiBarChart2, FiDollarSign, FiHeart } from 'react-icons/fi';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../HomePage.css';

// API Keys and Constants 
const WEATHER_API_KEY = 'e6a0f3bb7cf34efda16164737250303'; // (First) Replace with your Weather API key 
//const WEATHER_API_KEY = 'e6a0f3bb7cf34efda16164737250303'; // (Second) 
//const GNEWS_API_TOKEN = '3809434254c049a5715029361eba512d'; // (First) Replace with your GNews API token 
const GNEWS_API_TOKEN = 'e4638f91b41023e34c94790ddd7f067c'; // (Second) Replace with your GNews API token
// Base URLs for APIs
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';
const WEATHER_API = 'https://api.weatherapi.com/v1';
const GNEWS_API = 'https://gnews.io/api/v4';

const HomePage = () => {
  // State Declarations (unchanged)
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(10);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [countryDetails, setCountryDetails] = useState(null);
  const [recommendedCountry, setRecommendedCountry] = useState(null);
  const [recommendedCountryDetails, setRecommendedCountryDetails] = useState(null);
  const [currency, setCurrency] = useState('');
  const [recommendationType, setRecommendationType] = useState('cost_livingindex');
  const [recommendationLogic, setRecommendationLogic] = useState('highest');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [forecastData, setForecastData] = useState(null);

  const [indianCities, setIndianCities] = useState([]);
  const [indianSearchTerm, setIndianSearchTerm] = useState('');
  const [indianLoading, setIndianLoading] = useState(true);
  const [indianError, setIndianError] = useState(null);
  const [indianCurrentPage, setIndianCurrentPage] = useState(1);
  const [indianCitiesPerPage] = useState(10);
  const [selectedIndianCity, setSelectedIndianCity] = useState(null);
  const [favoriteIndianCities, setFavoriteIndianCities] = useState([]);
  const [indianCityDetails, setIndianCityDetails] = useState(null);
  const [recommendedIndianCity, setRecommendedIndianCity] = useState(null);
  const [recommendedIndianCityDetails, setRecommendedIndianCityDetails] = useState(null);
  const [indianCurrency, setIndianCurrency] = useState('');
  const [indianRecommendationType, setIndianRecommendationType] = useState('cost_livingindex');
  const [indianRecommendationLogic, setIndianRecommendationLogic] = useState('highest');
  const [indianWeatherData, setIndianWeatherData] = useState(null);
  const [indianWeatherLoading, setIndianWeatherLoading] = useState(false);
  const [indianWeatherError, setIndianWeatherError] = useState(null);
  const [showIndianWeatherModal, setShowIndianWeatherModal] = useState(false);
  const [indianForecastData, setIndianForecastData] = useState(null);

  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [globalNewsCategory, setGlobalNewsCategory] = useState(null);

  const [indianNewsData, setIndianNewsData] = useState([]);
  const [indianNewsLoading, setIndianNewsLoading] = useState(false);
  const [indianNewsError, setIndianNewsError] = useState(null);
  const [indianNewsCategory, setIndianNewsCategory] = useState(null);

  const [chatbotReady, setChatbotReady] = useState(false);

  // Fetch Global Data (unchanged, assumes static JSON files are served correctly)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/country_db.json');
        setCountries(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error('Error fetching global data:', err);
        setError('Failed to load country data.');
        toast.error('Failed to load country data.', { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Indian Data (unchanged, assumes static JSON files are served correctly)
  useEffect(() => {
    const fetchIndianData = async () => {
      try {
        const response = await axios.get('/india_db.json');
        setIndianCities(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error('Error fetching Indian data:', err);
        setIndianError('Failed to load Indian city data.');
        toast.error('Failed to load Indian city data.', { position: 'top-right' });
      } finally {
        setIndianLoading(false);
      }
    };
    fetchIndianData();
  }, []);

  // Fetch News for Recommended Country (Global) - Updated with full URL
  useEffect(() => {
    const fetchNews = async () => {
      if (recommendedCountryDetails) {
        setNewsLoading(true);
        setNewsError(null);
        setNewsData([]);
        try {
          const response = await axios.get(
            `${GNEWS_API}/search?q=${recommendedCountryDetails.name.common}${globalNewsCategory ? `+${globalNewsCategory}` : ''}&token=${GNEWS_API_TOKEN}&lang=en&max=6`
          );
          setNewsData(response.data.articles || []);
        } catch (err) {
          console.error('Error fetching global news data:', err);
          setNewsError('Failed to fetch news data.');
          toast.error('Failed to fetch global news data.', { position: 'top-right' });
        } finally {
          setNewsLoading(false);
        }
      } else {
        setNewsData([]);
      }
    };
    fetchNews();
  }, [recommendedCountryDetails, globalNewsCategory]);

  // Fetch News for Recommended Indian City - Updated with full URL
  useEffect(() => {
    const fetchIndianNews = async () => {
      if (recommendedIndianCityDetails?.citySpecific?.city) {
        setIndianNewsLoading(true);
        setIndianNewsError(null);
        setIndianNewsData([]);
        try {
          const response = await axios.get(
            `${GNEWS_API}/search?q=${recommendedIndianCityDetails.citySpecific.city}${indianNewsCategory ? `+${indianNewsCategory}` : ''}&token=${GNEWS_API_TOKEN}&lang=en&max=6`
          );
          setIndianNewsData(response.data.articles || []);
        } catch (err) {
          console.error('Error fetching Indian news data:', err);
          setIndianNewsError('Failed to fetch Indian news data.');
          toast.error('Failed to fetch Indian news data.', { position: 'top-right' });
        } finally {
          setIndianNewsLoading(false);
        }
      } else {
        setIndianNewsData([]);
      }
    };
    fetchIndianNews();
  }, [recommendedIndianCityDetails, indianNewsCategory]);

  // Chatbot Integration (unchanged)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;

    script.onload = () => {
      window.AgentInitializer.init({
        agentRenderURL: "https://agent.jotform.com/01952297d04970b08f7e429ca560a750385e",
        rootId: "chatbot-container",
        formID: "01952297d04970b08f7e429ca560a750385e",
        queryParams: ["skipWelcome=1", "maximizable=1"],
        domain: "https://www.jotform.com",
        isDraggable: false,
        background: "linear-gradient(180deg, #C8CEED 0%, #C8CEED 100%)",
        buttonBackgroundColor: "#007bff",
        buttonIconColor: "#fff",
        variant: false,
        customizations: {
          greeting: "Yes",
          greetingMessage: `Hi! How can I assist you today? 👋🏻`,
          openByDefault: "No",
          pulse: "Yes",
          position: "right",
          autoOpenChatIn: "0"
        },
        isVoice: undefined
      });
      setChatbotReady(true);
    };

    script.onerror = () => {
      console.error('Failed to load chatbot script');
      toast.error('Chatbot failed to load.', { position: 'top-right' });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      setChatbotReady(false);
    };
  }, [selectedCountry]);

  // Filter and Pagination Logic (unchanged)
  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const filteredIndianCities = useMemo(() => {
    return indianCities.filter(city =>
      city.city?.toLowerCase().includes(indianSearchTerm.toLowerCase())
    );
  }, [indianCities, indianSearchTerm]);

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  const indexOfLastIndianCity = indianCurrentPage * indianCitiesPerPage;
  const indexOfFirstIndianCity = indexOfLastIndianCity - indianCitiesPerPage;
  const currentIndianCities = filteredIndianCities.slice(indexOfFirstIndianCity, indexOfLastIndianCity);
  const totalIndianPages = Math.ceil(filteredIndianCities.length / indianCitiesPerPage);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);
  const paginateIndian = useCallback((pageNumber) => setIndianCurrentPage(pageNumber), []);

  // Handle Clicks and Favorites - Updated with full URLs
  const handleCountryClick = useCallback(async (country) => {
    setSelectedCountry(country);
    try {
      const response = await axios.get(
        `${REST_COUNTRIES_API}/name/${country.country}?fullText=true`
      );
      setCountryDetails(response.data[0]);
    } catch (err) {
      console.error('Error fetching country details:', err);
      setCountryDetails(null);
      toast.error('Failed to fetch country details.', { position: 'top-right' });
    }
  }, []);

  const handleIndianCityClick = useCallback(async (city) => {
    setSelectedIndianCity(city);
    try {
      const response = await axios.get(
        `${REST_COUNTRIES_API}/name/India?fullText=true`
      );
      setIndianCityDetails({ ...response.data[0], citySpecific: city });
    } catch (err) {
      console.error('Error fetching Indian city details:', err);
      setIndianCityDetails(null);
      toast.error('Failed to fetch Indian city details.', { position: 'top-right' });
    }
  }, []);

  const handleCloseModal = () => {
    setSelectedCountry(null);
    setCountryDetails(null);
    setSelectedIndianCity(null);
    setIndianCityDetails(null);
  };

  const toggleFavorite = useCallback((country) => {
    setFavoriteCountries(prev => {
      if (prev.find(item => item.id === country.id)) {
        return prev.filter(item => item.id !== country.id);
      }
      return [...prev, country];
    });
  }, []);

  const isFavorite = useCallback((country) => !!favoriteCountries.find(item => item.id === country.id), [favoriteCountries]);

  const toggleIndianFavorite = useCallback((city) => {
    setFavoriteIndianCities(prev => {
      if (prev.find(item => item.id === city.id)) {
        return prev.filter(item => item.id !== city.id);
      }
      return [...prev, city];
    });
  }, []);

  const isIndianFavorite = useCallback((city) => !!favoriteIndianCities.find(item => item.id === city.id), [favoriteIndianCities]);

  // Chart Data (unchanged)
  const chartData = useMemo(() => ({
    labels: ['Cost of Living', 'Rent', 'Groceries', 'Restaurant Prices', 'Purchasing Power'],
    datasets: [
      {
        label: 'Index',
        data: [
          selectedCountry?.cost_livingindex || 0,
          selectedCountry?.rent_index || 0,
          selectedCountry?.groceries_Index || 0,
          selectedCountry?.restaurant_price_index || 0,
          selectedCountry?.local_purchasing_power_Index || 0,
        ],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }), [selectedCountry]);

  const indianChartData = useMemo(() => ({
    labels: ['Cost of Living', 'Rent', 'Groceries', 'Restaurant Prices', 'Purchasing Power'],
    datasets: [
      {
        label: 'Index',
        data: [
          selectedIndianCity?.cost_livingindex || 0,
          selectedIndianCity?.rent_index || 0,
          selectedIndianCity?.groceries_Index || 0,
          selectedIndianCity?.restaurant_price_index || 0,
          selectedIndianCity?.local_purchasing_power_Index || 0,
        ],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }), [selectedIndianCity]);

  // Recommendation Logic - Updated with full URLs
  useEffect(() => {
    const recommendCountry = async () => {
      if (favoriteCountries.length > 0 && favoriteCountries.length <= 3) {
        let recommended;
        const validRecommendationType = ['cost_livingindex', 'rent_index', 'groceries_Index', 'restaurant_price_index', 'local_purchasing_power_Index'].includes(recommendationType) ? recommendationType : 'cost_livingindex';

        if (recommendationLogic === 'highest') {
          recommended = [...favoriteCountries].sort((a, b) => (b[validRecommendationType] || 0) - (a[validRecommendationType] || 0))[0];
        } else if (recommendationLogic === 'lowest') {
          recommended = [...favoriteCountries].sort((a, b) => (a[validRecommendationType] || 0) - (b[validRecommendationType] || 0))[0];
        } else {
          recommended = [...favoriteCountries].sort((a, b) => (b[validRecommendationType] || 0) - (a[validRecommendationType] || 0))[0];
        }

        if (recommended) {
          setRecommendedCountry(recommended);
          try {
            const response = await axios.get(
              `${REST_COUNTRIES_API}/name/${recommended.country}?fullText=true`
            );
            const countryDetails = response.data[0];
            setRecommendedCountryDetails(countryDetails);
            if (countryDetails.currencies) {
              const currencyCode = Object.keys(countryDetails.currencies)[0];
              setCurrency(countryDetails.currencies[currencyCode].name);
            } else {
              setCurrency('N/A');
            }
          } catch (err) {
            console.error('Error fetching recommended country details:', err);
            setRecommendedCountryDetails(null);
            setCurrency('N/A');
            toast.error('Failed to fetch recommended country details.', { position: 'top-right' });
          }
        }
      } else {
        setRecommendedCountry(null);
        setRecommendedCountryDetails(null);
        setCurrency('');
      }
    };
    recommendCountry();
  }, [favoriteCountries, recommendationType, recommendationLogic]);

  useEffect(() => {
    const recommendIndianCity = async () => {
      if (favoriteIndianCities.length > 0 && favoriteIndianCities.length <= 3) {
        let recommended;
        const validRecommendationType = ['cost_livingindex', 'rent_index', 'groceries_Index', 'restaurant_price_index', 'local_purchasing_power_Index'].includes(indianRecommendationType) ? indianRecommendationType : 'cost_livingindex';

        if (indianRecommendationLogic === 'highest') {
          recommended = [...favoriteIndianCities].sort((a, b) => (b[validRecommendationType] || 0) - (a[validRecommendationType] || 0))[0];
        } else if (indianRecommendationLogic === 'lowest') {
          recommended = [...favoriteIndianCities].sort((a, b) => (a[validRecommendationType] || 0) - (b[validRecommendationType] || 0))[0];
        } else {
          recommended = [...favoriteIndianCities].sort((a, b) => (b[validRecommendationType] || 0) - (a[validRecommendationType] || 0))[0];
        }

        if (recommended) {
          setRecommendedIndianCity(recommended);
          try {
            const response = await axios.get(
              `${REST_COUNTRIES_API}/name/India?fullText=true`
            );
            const indiaDetails = response.data[0];
            setRecommendedIndianCityDetails({ ...indiaDetails, citySpecific: recommended });
            setIndianCurrency('Indian Rupee');
          } catch (err) {
            console.error('Error fetching recommended Indian city details:', err);
            setRecommendedIndianCityDetails(null);
            setIndianCurrency('N/A');
            toast.error('Failed to fetch recommended Indian city details.', { position: 'top-right' });
          }
        }
      } else {
        setRecommendedIndianCity(null);
        setRecommendedIndianCityDetails(null);
        setIndianCurrency('');
      }
    };
    recommendIndianCity();
  }, [favoriteIndianCities, indianRecommendationType, indianRecommendationLogic]);

  // Recommendation Chart Data (unchanged)
  const recommendationChartData = useMemo(() => {
    const datasets = favoriteCountries.slice(0, 3).map((country, index) => {
      const color = ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)'][index % 3];
      return {
        label: country.country,
        data: [
          country?.cost_livingindex || 0,
          country?.rent_index || 0,
          country?.groceries_Index || 0,
          country?.restaurant_price_index || 0,
          country?.local_purchasing_power_Index || 0,
        ],
        fill: false,
        borderColor: color,
        tension: 0.1,
      };
    });
    return {
      labels: ['Cost of Living', 'Rent', 'Groceries', 'Restaurant Prices', 'Purchasing Power'],
      datasets,
    };
  }, [favoriteCountries]);

  const indianRecommendationChartData = useMemo(() => {
    const datasets = favoriteIndianCities.slice(0, 3).map((city, index) => {
      const color = ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)'][index % 3];
      return {
        label: city.city,
        data: [
          city?.cost_livingindex || 0,
          city?.rent_index || 0,
          city?.groceries_Index || 0,
          city?.restaurant_price_index || 0,
          city?.local_purchasing_power_Index || 0,
        ],
        fill: false,
        borderColor: color,
        tension: 0.1,
      };
    });
    return {
      labels: ['Cost of Living', 'Rent', 'Groceries', 'Restaurant Prices', 'Purchasing Power'],
      datasets,
    };
  }, [favoriteIndianCities]);

  // Weather Fetching - Updated with full URLs
  useEffect(() => {
    const fetchWeather = async () => {
      if (recommendedCountryDetails) {
        setWeatherLoading(true);
        setWeatherError(null);
        setWeatherData(null);
        setForecastData(null);
        try {
          const response = await axios.get(
            `${WEATHER_API}/forecast.json?key=${WEATHER_API_KEY}&q=${recommendedCountryDetails.name.common}&days=3`
          );
          setWeatherData(response.data.current);
          setForecastData(response.data.forecast.forecastday);
        } catch (err) {
          console.error('Error fetching weather data:', err);
          setWeatherError('Failed to fetch weather data.');
          toast.error('Failed to fetch weather data.', { position: 'top-right' });
        } finally {
          setWeatherLoading(false);
        }
      } else {
        setWeatherData(null);
        setForecastData(null);
      }
    };
    fetchWeather();
  }, [recommendedCountryDetails]);

  useEffect(() => {
    const fetchIndianWeather = async () => {
      if (recommendedIndianCityDetails?.citySpecific?.city) {
        setIndianWeatherLoading(true);
        setIndianWeatherError(null);
        setIndianWeatherData(null);
        setIndianForecastData(null);
        try {
          const response = await axios.get(
            `${WEATHER_API}/forecast.json?key=${WEATHER_API_KEY}&q=${recommendedIndianCityDetails.citySpecific.city}&days=3`
          );
          setIndianWeatherData(response.data.current);
          setIndianForecastData(response.data.forecast.forecastday);
        } catch (err) {
          console.error('Error fetching Indian weather data:', err);
          setIndianWeatherError('Failed to fetch weather data.');
          toast.error('Failed to fetch weather data.', { position: 'top-right' });
        } finally {
          setIndianWeatherLoading(false);
        }
      } else {
        setIndianWeatherData(null);
        setIndianForecastData(null);
      }
    };
    fetchIndianWeather();
  }, [recommendedIndianCityDetails]);

  // Component Definitions and Handlers (unchanged)
  const StatCard = ({ icon: Icon, title, value, trend }) => (
    <div className="stat-card">
      <div className="stat-header">
        <Icon className="stat-icon" />
        <h3>{title}</h3>
      </div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend}% <FiArrowUpRight />
        </span>
      </div>
    </div>
  );

  const NewsCard = ({ title, description, imageUrl, channel, published }) => (
    <Card className="card news-card">
      <Card.Img className="card-img" variant="top" src={imageUrl || 'https://via.placeholder.com/150'} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="card-description">{description || 'No description available'}</Card.Text>
        <div className="news-details">
          <p><b>Source:</b> {channel}</p>
          <p><b>Published:</b> {new Date(published).toLocaleDateString()}</p>
        </div>
      </Card.Body>
    </Card>
  );

  const openWeatherModal = () => setShowWeatherModal(true);
  const closeWeatherModal = () => setShowWeatherModal(false);
  const openIndianWeatherModal = () => setShowIndianWeatherModal(true);
  const closeIndianWeatherModal = () => setShowIndianWeatherModal(false);

  const handleRecommendationLogicChange = useCallback((logic) => setRecommendationLogic(logic), []);
  const handleIndianRecommendationLogicChange = useCallback((logic) => setIndianRecommendationLogic(logic), []);

  const handleGlobalNewsCategorySelect = (category) => setGlobalNewsCategory(category);
  const handleIndianNewsCategorySelect = (category) => setIndianNewsCategory(category);

  // JSX Return (unchanged)
  return (
    <div className="home-page">
      <ToastContainer />
      <section className="hero-section">
        <div className="hero-gradient" />
        <Container>
          <div className="hero-content">
            <h1>Global & Indian Cost Intelligence</h1>
            <p>Comparative analytics for 150+ countries and Indian cities.</p>
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="stats-section">
        <Container>
          <Row>
            <Col xs={12} md={6} lg={3}>
              <StatCard icon={FiDollarSign} title="Avg. Cost Index" value="72.4" trend={2.1} />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <StatCard icon={FiBarChart2} title="City Rankings" value="500+" trend={5.7} />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <StatCard icon={FiDollarSign} title="Rent Index" value="45.8" trend={-1.2} />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <StatCard icon={FiBarChart2} title="Groceries Index" value="68.9" trend={3.4} />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="country-grid">
        <Container>
          <h2 className="section-title">Global Cost Analysis</h2>
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="country-grid__container">
                {currentCountries.map((country) => (
                  <Card
                    key={country.id}
                    className="country-card"
                    onClick={() => handleCountryClick(country)}
                  >
                    <div className="country-card__header">
                      <h3 className="country-card__title">{country.country}</h3>
                      <span className="country-card__rank">#{country.rank}</span>
                      <FiHeart
                        className={`country-card__heart ${isFavorite(country) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(country);
                        }}
                      />
                    </div>
                    <div className="country-card__body">
                      <div className="country-card__metric">
                        <span>Cost of Living Index</span>
                        <div className="country-card__progress-bar">
                          <div
                            className="country-card__progress-fill"
                            style={{ width: `${country.cost_livingindex}%` }}
                          />
                        </div>
                        <span className="country-card__metric-value">{country.cost_livingindex}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`page-number ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <section className="country-grid">
        <Container>
          <h2 className="section-title">Indian Cost Analysis</h2>
          <div className="indian-search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Indian city..."
              value={indianSearchTerm}
              onChange={(e) => {
                setIndianSearchTerm(e.target.value);
                setIndianCurrentPage(1);
              }}
            />
          </div>
          {indianLoading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : indianError ? (
            <div className="error-message">{indianError}</div>
          ) : (
            <>
              <div className="country-grid__container">
                {currentIndianCities.map((city) => (
                  <Card
                    key={city.id}
                    className="country-card"
                    onClick={() => handleIndianCityClick(city)}
                  >
                    <div className="country-card__header">
                      <h3 className="country-card__title">{city.city}</h3>
                      <span className="country-card__rank">#{city.rank}</span>
                      <FiHeart
                        className={`country-card__heart ${isIndianFavorite(city) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIndianFavorite(city);
                        }}
                      />
                    </div>
                    <div className="country-card__body">
                      <div className="country-card__metric">
                        <span>Cost of Living Index</span>
                        <div className="country-card__progress-bar">
                          <div
                            className="country-card__progress-fill"
                            style={{ width: `${city.cost_livingindex}%` }}
                          />
                        </div>
                        <span className="country-card__metric-value">{city.cost_livingindex}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="pagination">
                {Array.from({ length: totalIndianPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginateIndian(number)}
                    className={`page-number ${indianCurrentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <section className="recommendation-section">
        <Container>
          <h2 className="section-title">Recommended Country</h2>
          <div className="recommendation-type-buttons">
            <Button
              variant={recommendationType === 'cost_livingindex' ? 'primary' : 'outline-primary'}
              onClick={() => setRecommendationType('cost_livingindex')}
            >
              Cost of Living
            </Button>
            <Button
              variant={recommendationType === 'rent_index' ? 'primary' : 'outline-primary'}
              onClick={() => setRecommendationType('rent_index')}
            >
              Rent
            </Button>
            <Button
              variant={recommendationType === 'groceries_Index' ? 'primary' : 'outline-primary'}
              onClick={() => setRecommendationType('groceries_Index')}
            >
              Groceries
            </Button>
            <Button
              variant={recommendationType === 'restaurant_price_index' ? 'primary' : 'outline-primary'}
              onClick={() => setRecommendationType('restaurant_price_index')}
            >
              Restaurant Prices
            </Button>
            <Button
              variant={recommendationType === 'local_purchasing_power_Index' ? 'primary' : 'outline-primary'}
              onClick={() => setRecommendationType('local_purchasing_power_Index')}
            >
              Purchasing Power
            </Button>
          </div>
          <div className="recommendation-logic-buttons">
            <Button
              variant={recommendationLogic === 'highest' ? 'primary' : 'outline-primary'}
              onClick={() => handleRecommendationLogicChange('highest')}
            >
              Highest
            </Button>
            <Button
              variant={recommendationLogic === 'lowest' ? 'primary' : 'outline-primary'}
              onClick={() => handleRecommendationLogicChange('lowest')}
            >
              Lowest
            </Button>
          </div>
          {recommendedCountry && recommendedCountryDetails && favoriteCountries.length <= 3 ? (
            <div className="recommendation-card">
              <Row>
                <Col md={6}>
                  <div className="recommendation-card__header">
                    <img src={recommendedCountryDetails.flags?.svg} alt="Flag" className="recommendation-card__flag" />
                    <h3>{recommendedCountry.country}</h3>
                  </div>
                  <p><b>Capital:</b> {recommendedCountryDetails.capital?.[0] || 'N/A'}</p>
                  <p><b>Languages:</b> {recommendedCountryDetails.languages ? Object.values(recommendedCountryDetails.languages).join(', ') : 'N/A'}</p>
                  <p><b>Population:</b> {recommendedCountryDetails.population || 'N/A'}</p>
                  <p><b>Currency:</b> {currency || 'N/A'}</p>
                  <p><b>Region:</b> {recommendedCountryDetails.region || 'N/A'}</p>
                  <p><b>Subregion:</b> {recommendedCountryDetails.subregion || 'N/A'}</p>
                  <p><b>Area:</b> {recommendedCountryDetails.area ? `${recommendedCountryDetails.area} km²` : 'N/A'}</p>
                  <p><b>Timezones:</b> {recommendedCountryDetails.timezones?.join(', ') || 'N/A'}</p>
                </Col>
                <Col md={6} className="d-flex flex-column">
                  {weatherLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : weatherError ? (
                    <p className="text-danger">{weatherError}</p>
                  ) : weatherData ? (
                    <div className="weather-container">
                      <button className="weather-info" onClick={openWeatherModal}>
                        <h4>Weather in {recommendedCountryDetails.capital?.[0] || recommendedCountry.country}</h4>
                        <img src={`https:${weatherData.condition?.icon}`} alt="Weather Icon" />
                        <p><b>Temperature:</b> {weatherData.temp_c}°C</p>
                        <p><b>Condition:</b> {weatherData.condition?.text}</p>
                      </button>
                    </div>
                  ) : null}
                  <div className="recommendation-card__chart mt-auto">
                    <Line data={recommendationChartData} />
                  </div>
                </Col>
              </Row>
            </div>
          ) : favoriteCountries.length <= 3 ? (
            <p>Add countries to favorites to get a recommendation.</p>
          ) : (
            <div className="recommendation-card">
              <Row>
                <Col md={12}>
                  <div className="recommendation-card__chart">
                    <Line data={recommendationChartData} />
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </section>

      {recommendedCountryDetails && (
        <section className="news-section">
          <Container>
            <h2 className="section-title">Latest News in {recommendedCountryDetails.name.common}</h2>
            <div className="category-buttons">
              <Button
                variant={globalNewsCategory === null ? 'primary' : 'outline-primary'}
                onClick={() => handleGlobalNewsCategorySelect(null)}
              >
                All
              </Button>
              <Button
                variant={globalNewsCategory === 'technology' ? 'primary' : 'outline-primary'}
                onClick={() => handleGlobalNewsCategorySelect('technology')}
              >
                Technology
              </Button>
              <Button
                variant={globalNewsCategory === 'economic' ? 'primary' : 'outline-primary'}
                onClick={() => handleGlobalNewsCategorySelect('economic')}
              >
                Economic
              </Button>
              <Button
                variant={globalNewsCategory === 'sports' ? 'primary' : 'outline-primary'}
                onClick={() => handleGlobalNewsCategorySelect('sports')}
              >
                Sports
              </Button>
              <Button
                variant={globalNewsCategory === 'business' ? 'primary' : 'outline-primary'}
                onClick={() => handleGlobalNewsCategorySelect('business')}
              >
                Business
              </Button>
            </div>
            {newsLoading ? (
              <div className="loading-container">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : newsError ? (
              <p className="text-danger">{newsError}</p>
            ) : newsData.length > 0 ? (
              <div className="news-grid">
                {newsData.slice(0, 6).map((article, index) => (
                  <NewsCard
                    key={index}
                    title={article.title}
                    description={article.description}
                    imageUrl={article.image}
                    channel={article.source.name}
                    published={article.publishedAt}
                  />
                ))}
              </div>
            ) : (
              <p>No news available for {recommendedCountryDetails.name.common}.</p>
            )}
          </Container>
        </section>
      )}

      <section className="recommendation-section">
        <Container>
          <h2 className="section-title">Recommended Indian City</h2>
          <div className="recommendation-type-buttons">
            <Button
              variant={indianRecommendationType === 'cost_livingindex' ? 'primary' : 'outline-primary'}
              onClick={() => setIndianRecommendationType('cost_livingindex')}
            >
              Cost of Living
            </Button>
            <Button
              variant={indianRecommendationType === 'rent_index' ? 'primary' : 'outline-primary'}
              onClick={() => setIndianRecommendationType('rent_index')}
            >
              Rent
            </Button>
            <Button
              variant={indianRecommendationType === 'groceries_Index' ? 'primary' : 'outline-primary'}
              onClick={() => setIndianRecommendationType('groceries_Index')}
            >
              Groceries
            </Button>
            <Button
              variant={indianRecommendationType === 'restaurant_price_index' ? 'primary' : 'outline-primary'}
              onClick={() => setIndianRecommendationType('restaurant_price_index')}
            >
              Restaurant Prices
            </Button>
            <Button
              variant={indianRecommendationType === 'local_purchasing_power_Index' ? 'primary' : 'outline-primary'}
              onClick={() => setIndianRecommendationType('local_purchasing_power_Index')}
            >
              Purchasing Power
            </Button>
          </div>
          <div className="recommendation-logic-buttons">
            <Button
              variant={indianRecommendationLogic === 'highest' ? 'primary' : 'outline-primary'}
              onClick={() => handleIndianRecommendationLogicChange('highest')}
            >
              Highest
            </Button>
            <Button
              variant={indianRecommendationLogic === 'lowest' ? 'primary' : 'outline-primary'}
              onClick={() => handleIndianRecommendationLogicChange('lowest')}
            >
              Lowest
            </Button>
          </div>
          {recommendedIndianCity && recommendedIndianCityDetails && favoriteIndianCities.length <= 3 ? (
            <div className="recommendation-card">
              <Row>
                <Col md={6}>
                  <div className="recommendation-card__header">
                    <img src={recommendedIndianCityDetails.flags?.svg} alt="Flag" className="recommendation-card__flag" />
                    <h3>{recommendedIndianCity.city}</h3>
                  </div>
                  <p><b>Country:</b> India</p>
                  <p><b>Languages:</b> {recommendedIndianCityDetails.languages ? Object.values(recommendedIndianCityDetails.languages).join(', ') : 'N/A'}</p>
                  <p><b>Population:</b> {recommendedIndianCityDetails.population || 'N/A'}</p>
                  <p><b>Currency:</b> {indianCurrency || 'N/A'}</p>
                  <p><b>Region:</b> {recommendedIndianCityDetails.region || 'N/A'}</p>
                  <p><b>Subregion:</b> {recommendedIndianCityDetails.subregion || 'N/A'}</p>
                  <p><b>Area:</b> {recommendedIndianCityDetails.area ? `${recommendedIndianCityDetails.area} km²` : 'N/A'}</p>
                  <p><b>Timezones:</b> {recommendedIndianCityDetails.timezones?.join(', ') || 'N/A'}</p>
                </Col>
                <Col md={6} className="d-flex flex-column">
                  {indianWeatherLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : indianWeatherError ? (
                    <p className="text-danger">{indianWeatherError}</p>
                  ) : indianWeatherData ? (
                    <div className="weather-container">
                      <button className="weather-info" onClick={openIndianWeatherModal}>
                        <h4>Weather in {recommendedIndianCity.city}</h4>
                        <img src={`https:${indianWeatherData.condition?.icon}`} alt="Weather Icon" />
                        <p><b>Temperature:</b> {indianWeatherData.temp_c}°C</p>
                        <p><b>Condition:</b> {indianWeatherData.condition?.text}</p>
                      </button>
                    </div>
                  ) : null}
                  <div className="recommendation-card__chart mt-auto">
                    <Line data={indianRecommendationChartData} />
                  </div>
                </Col>
              </Row>
            </div>
          ) : favoriteIndianCities.length <= 3 ? (
            <p>Add Indian cities to favorites to get a recommendation.</p>
          ) : (
            <div className="recommendation-card">
              <Row>
                <Col md={12}>
                  <div className="recommendation-card__chart">
                    <Line data={indianRecommendationChartData} />
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </section>

      {recommendedIndianCityDetails && (
        <section className="news-section">
          <Container>
            <h2 className="section-title">Latest News in {recommendedIndianCityDetails.citySpecific.city}</h2>
            <div className="category-buttons">
              <Button
                variant={indianNewsCategory === null ? 'primary' : 'outline-primary'}
                onClick={() => handleIndianNewsCategorySelect(null)}
              >
                All
              </Button>
              <Button
                variant={indianNewsCategory === 'technology' ? 'primary' : 'outline-primary'}
                onClick={() => handleIndianNewsCategorySelect('technology')}
              >
                Technology
              </Button>
              <Button
                variant={indianNewsCategory === 'economic' ? 'primary' : 'outline-primary'}
                onClick={() => handleIndianNewsCategorySelect('economic')}
              >
                Economic
              </Button>
              <Button
                variant={indianNewsCategory === 'sports' ? 'primary' : 'outline-primary'}
                onClick={() => handleIndianNewsCategorySelect('sports')}
              >
                Sports
              </Button>
              <Button
                variant={indianNewsCategory === 'business' ? 'primary' : 'outline-primary'}
                onClick={() => handleIndianNewsCategorySelect('business')}
              >
                Business
              </Button>
            </div>
            {indianNewsLoading ? (
              <div className="loading-container">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : indianNewsError ? (
              <p className="text-danger">{indianNewsError}</p>
            ) : indianNewsData.length > 0 ? (
              <div className="news-grid">
                {indianNewsData.slice(0, 6).map((article, index) => (
                  <NewsCard
                    key={index}
                    title={article.title}
                    description={article.description}
                    imageUrl={article.image}
                    channel={article.source.name}
                    published={article.publishedAt}
                  />
                ))}
              </div>
            ) : (
              <p>No news available for {recommendedIndianCityDetails.citySpecific.city}.</p>
            )}
          </Container>
        </section>
      )}

      <section className="comparison-section">
        <Container>
          <h2 className="section-title">Favorite Countries</h2>
          <div className="comparison-grid">
            {favoriteCountries.map((country) => (
              <div key={country.id} className="comparison-card">
                <h3>{country.country}</h3>
                <p>Cost of Living: {country.cost_livingindex}</p>
                <Button variant="danger" size="sm" onClick={() => toggleFavorite(country)}>
                  Remove
                </Button>
              </div>
            ))}
            {favoriteCountries.length === 0 && (
              <div className="comparison-placeholder">
                Add countries to favorites to compare them.
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="comparison-section">
        <Container>
          <h2 className="section-title">Favorite Indian Cities</h2>
          <div className="comparison-grid">
            {favoriteIndianCities.map((city) => (
              <div key={city.id} className="comparison-card">
                <h3>{city.city}</h3>
                <p>Cost of Living: {city.cost_livingindex}</p>
                <Button variant="danger" size="sm" onClick={() => toggleIndianFavorite(city)}>
                  Remove
                </Button>
              </div>
            ))}
            {favoriteIndianCities.length === 0 && (
              <div className="comparison-placeholder">
                Add Indian cities to favorites to compare them.
              </div>
            )}
          </div>
        </Container>
      </section>

      <Modal show={selectedCountry !== null} onHide={handleCloseModal} className="country-modal">
        <Modal.Header closeButton className="country-modal__header">
          <Modal.Title className="country-modal__title">{selectedCountry?.country}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="country-modal__body">
          {countryDetails ? (
            <div className="country-modal__details">
              <Row>
                <Col md={6}>
                  <img src={countryDetails.flags?.svg} alt="Flag" className="country-modal__flag" />
                  <p><b>Capital:</b> {countryDetails.capital?.[0] || 'N/A'}</p>
                  <p><b>Languages:</b> {countryDetails.languages ? Object.values(countryDetails.languages).join(', ') : 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><b>Cost of Living Index:</b> {selectedCountry?.cost_livingindex || 'N/A'}</p>
                  <p><b>Rent Index:</b> {selectedCountry?.rent_index || 'N/A'}</p>
                  <p><b>Groceries Index:</b> {selectedCountry?.groceries_Index || 'N/A'}</p>
                  <p><b>Restaurant Price Index:</b> {selectedCountry?.restaurant_price_index || 'N/A'}</p>
                  <p><b>Local Purchasing Power Index:</b> {selectedCountry?.local_purchasing_power_Index || 'N/A'}</p>
                </Col>
              </Row>
              <div className="country-modal__chart">
                <Line data={chartData} />
              </div>
            </div>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer className="country-modal__footer">
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={selectedIndianCity !== null} onHide={handleCloseModal} className="country-modal">
        <Modal.Header closeButton className="country-modal__header">
          <Modal.Title className="country-modal__title">{selectedIndianCity?.city}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="country-modal__body">
          {indianCityDetails ? (
            <div className="country-modal__details">
              <Row>
                <Col md={6}>
                  <img src={indianCityDetails.flags?.svg} alt="Flag" className="country-modal__flag" />
                  <p><b>Country:</b> India</p>
                  <p><b>Languages:</b> {indianCityDetails.languages ? Object.values(indianCityDetails.languages).join(', ') : 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><b>Cost of Living Index:</b> {selectedIndianCity?.cost_livingindex || 'N/A'}</p>
                  <p><b>Rent Index:</b> {selectedIndianCity?.rent_index || 'N/A'}</p>
                  <p><b>Groceries Index:</b> {selectedIndianCity?.groceries_Index || 'N/A'}</p>
                  <p><b>Restaurant Price Index:</b> {selectedIndianCity?.restaurant_price_index || 'N/A'}</p>
                  <p><b>Local Purchasing Power Index:</b> {selectedIndianCity?.local_purchasing_power_Index || 'N/A'}</p>
                </Col>
              </Row>
              <div className="country-modal__chart">
                <Line data={indianChartData} />
              </div>
            </div>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer className="country-modal__footer">
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWeatherModal} onHide={closeWeatherModal} className="weather-modal">
        <Modal.Header closeButton>
          <Modal.Title>3-Day Weather Forecast for {recommendedCountryDetails?.capital?.[0] || recommendedCountry?.country}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forecastData ? (
            forecastData.map((day, index) => (
              <div key={index} className="forecast-day">
                <h5>{new Date(day.date).toLocaleDateString()}</h5>
                <img src={`https:${day.day?.condition?.icon}`} alt="Weather Icon" />
                <p><b>Condition:</b> {day.day?.condition?.text || 'N/A'}</p>
                <p><b>Avg. Temperature:</b> {day.day?.avgtemp_c}°C</p>
                <p><b>Max. Temperature:</b> {day.day?.maxtemp_c}°C</p>
                <p><b>Min. Temperature:</b> {day.day?.mintemp_c}°C</p>
              </div>
            ))
          ) : (
            <p>Loading forecast data...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeWeatherModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showIndianWeatherModal} onHide={closeIndianWeatherModal} className="weather-modal">
        <Modal.Header closeButton>
          <Modal.Title>3-Day Weather Forecast for {recommendedIndianCity?.city}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {indianForecastData ? (
            indianForecastData.map((day, index) => (
              <div key={index} className="forecast-day">
                <h5>{new Date(day.date).toLocaleDateString()}</h5>
                <img src={`https:${day.day?.condition?.icon}`} alt="Weather Icon" />
                <p><b>Condition:</b> {day.day?.condition?.text || 'N/A'}</p>
                <p><b>Avg. Temperature:</b> {day.day?.avgtemp_c}°C</p>
                <p><b>Max. Temperature:</b> {day.day?.maxtemp_c}°C</p>
                <p><b>Min. Temperature:</b> {day.day?.mintemp_c}°C</p>
              </div>
            ))
          ) : (
            <p>Loading forecast data...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeIndianWeatherModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <div id="chatbot-container" className="chatbot-container"></div>
    </div>
  );
};

export default HomePage;
