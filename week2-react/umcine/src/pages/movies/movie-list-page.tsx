import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { movieListQueryOptions } from "../../api/movies/movie-query-options";
import { MovieGrid } from "../../components/movies/movie-grid";
import { MovieSortControl } from "../../components/movies/movie-sort-control";
import { Pagination } from "../../components/movies/pagination";
import { useMoviePreferenceStore } from "../../stores/movie-preference-store";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const sortOrder = useMoviePreferenceStore((state) => state.sortOrder);

  const moviesQuery = useQuery(movieListQueryOptions(page));
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  const handlePageChange = (nextPage: number) => {
    navigate({ search: { page: nextPage } });
  };

  const visibleMovies =
    sortOrder === "title"
      ? [...movies].sort((first, second) =>
          first.title.localeCompare(second.title, "ko"),
        )
      : movies;

  return (
    <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1440px] px-5 py-9 sm:min-h-[calc(100vh-72px)] sm:px-7 sm:py-12 lg:px-12 xl:px-20">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-extrabold tracking-[0.14em] text-[#4f83ff]">
          UMCINE COLLECTION
        </p>
        <h1 className="text-[28px] leading-10 font-extrabold tracking-[-0.04em] text-white sm:text-[34px] lg:text-[40px] lg:leading-12">
          영화 목록
        </h1>
      </div>
      {moviesQuery.isPending ? (
        <p className="my-12 text-center text-[#969da8]" role="status">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <div className="my-12 grid justify-items-center gap-4 text-[#969da8]" role="alert">
          <p>영화 목록을 불러오지 못했어요.</p>
          <button
            className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-white hover:border-blue-500"
            type="button"
            onClick={() => moviesQuery.refetch()}
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          {movies.length > 0 && <MovieSortControl />}
          <MovieGrid movies={visibleMovies} />
          {movies.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}
