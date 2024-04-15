import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosStore from "../store/axiosStore";
import { BookReview } from "../interfaces/BookReviewInterface";
import ReviewDisplay from "./ReviewDisplay";
function BookDisplay({ID, title, author, language,year}:Book){

    const {getAxiosInstance} = useAxiosStore(state=>state);
    const [bookReviews, setBookReviews] = useState([]);
    const [displayReviews, setDisplayReviews] = useState(false);
    useEffect(()=>{
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}`)
        .then((response)=>{
            setBookReviews(response.data);
        })
        .catch((error)=>{
            console.log("Error: " + error);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    return (
        <div className="book-display">
            <p>Title: {title}</p>
            <p>Author: {author}</p>
            <p>Language: {language}</p>
            <p>Year published: {isNaN(year)? "unknown" : year}</p>
            {/* <button onClick={()=>{deleteBook(ID)}}>Remove Book</button> */}
            <Link to={"/book/" + ID} className="page-link">Edit book</Link>
            <Link to={"/review/" + ID} className="page-link">Review book</Link>
            <Link to={"/"} className="page-link">Back to books</Link>
            <button onClick={()=>{setDisplayReviews(!displayReviews)}}>{displayReviews? "Hide reviews": "Show reviews"}</button>
            {
                displayReviews &&
                bookReviews.map((review:BookReview)=>{
                        return(
                            <ReviewDisplay key={review.ID} bookReview={review} />
                        )
                    }
                )
            }
        </div>
    )
}


export default BookDisplay