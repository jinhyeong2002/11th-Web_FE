import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

export const movieListQueryOptions = (page: number) =>
  queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

export const movieSearchQueryOptions = (query: string, page: number) =>
  queryOptions({
    queryKey: ["movies", "search", { query, page }],
    queryFn: () => searchMovies({ query, page }),
    enabled: query.length > 0,
  });

export const movieDetailQueryOptions = (movieId: number) =>
  queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isInteger(movieId) && movieId > 0,
    staleTime: 30 * 1000,
  });
