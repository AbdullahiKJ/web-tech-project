import Sidebar from "@/components/sidebar";

export default async function Home() {
    // Get a list of the user's reviews
    let data = await fetch('http://localhost:8080/users/1/reviews');
    let response = await data.json();
    let reviews = response.reviews;

    return (
        <Sidebar>
            <p>Reviews</p>
        </Sidebar>
    );
}