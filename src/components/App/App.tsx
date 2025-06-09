import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

export default function App() {

  const [search, setSearch] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const [page, setPage] = useState<number>(1);

  function isActive(): void {
    setIsOpen((prev) => !prev);
    if (isOpen == true && movie != null) setMovie(null);
  }

  function onSelect(params: Movie): void {
    setMovie(params);
    isActive();
  }


  const handleSearch = (search: string) => {
    setPage(1);
    setSearch(search);
  };


  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", search, page],
    queryFn: () => fetchMovies(search, page),
    enabled: search !== "",
    placeholderData: keepPreviousData,
  });



  useEffect(() => {
    if (isSuccess && (!data || data?.results.length === 0)) {
      toast.error("No movies found.");
    }
    return;
  }, [data, isSuccess]);



  console.log(isLoading);

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={styles.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data?.results.length > 0 && (
        <MovieGrid movies={data?.results} onSelect={onSelect} />
      )}
      {isOpen && movie && <MovieModal onClose={isActive} movie={movie} />}
    </div>
  );
}