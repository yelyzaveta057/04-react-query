import axios from 'axios';
import type { Movie } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesHttpResponse {
  results: Movie[];
}

export const fetchMovies = async (
  query: string
): Promise<Movie[]> => {
    console.log("API_KEY:", API_KEY);

  const response = await axios.get<MoviesHttpResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: { query, language: 'en-US', include_adult: false },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
    }
  );

  return response.data.results;
};
