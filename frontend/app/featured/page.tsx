import MovieModal from '@/components/movie-modal';

export default async function Home() {
    // Get popular movies from the TMDB API
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + process.env.TMDB_AUTH
        }
    }
    let data = await fetch('https://api.themoviedb.org/3/movie/popular', options);
    let response = await data.json();
    let popularMovies = response.results;
    console.log(popularMovies);


    return (
        <main className="flex flex-col items-center justify-between px-8 py-8">
            <div className="flex flex-wrap gap-5 py-4 justify-items-center">
                {popularMovies.map((movie: any) => (
                    <MovieModal key={movie.id} movie={movie}/>
                ))}
            </div>
        </main>
    );
}