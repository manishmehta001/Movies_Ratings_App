import { useState, useEffect } from "react";
const KEY = "9d221ad4";

export const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something went wrong to fetching movies");
        }

        const data = await res.json();
        if (data.Response == "False") {
          throw new Error("Movie not found!");
        }
        setMovies(data.Search);
        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // handleCloseMovie();
    fetchApi();

    return () => {
      controller.abort();
    };
  }, [query]);
  return {
    movies,
    isLoading,
    error,
  };
};
