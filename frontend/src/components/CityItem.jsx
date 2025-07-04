import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, _id, position } = city;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    deleteCity(_id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          _id === currentCity?._id ? styles["cityItem--active"] : ""
        }`}
        to={
          position ? `${_id}?lat=${position.lat}&lng=${position.lng}` : `${_id}`
        }
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>
          {date ? formatDate(date) : "No date"}
        </time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
