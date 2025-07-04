import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat, lng];
}
