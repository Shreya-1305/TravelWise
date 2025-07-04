import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities || cities.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const sortedCities = [...cities].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <ul className={styles.cityList}>
      {sortedCities.map((city) => (
        <CityItem city={city} key={city._id || city.id} />
      ))}
    </ul>
  );
}

export default CityList;
