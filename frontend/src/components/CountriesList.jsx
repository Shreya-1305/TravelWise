import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountriesList.module.css";
import { useCities } from "../contexts/CitiesContext";

function CountriesList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities || cities.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countriesMap = new Map();

  for (const city of cities) {
    if (city.country && !countriesMap.has(city.country)) {
      countriesMap.set(city.country, {
        country: city.country,
        emoji: city.emoji,
      });
    }
  }

  const countries = Array.from(countriesMap.values());

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountriesList;
