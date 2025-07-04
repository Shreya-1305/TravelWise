import { useState } from "react";

export function useGeolocation(defaultPosition = null) {
  const [isLoading, setIsloading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setIsError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setIsError("your browser does not support geolocation");

    setIsloading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsloading(false);
      },
      (error) => {
        setIsError(error.message);
        setIsloading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
