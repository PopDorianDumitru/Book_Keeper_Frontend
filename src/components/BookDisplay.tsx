import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import useAxiosStore from "../store/axiosStore";
import { BookReview } from "../interfaces/BookReviewInterface";
import ReviewDisplay from "./ReviewDisplay";
import useBookReviewStore from "../store/bookReviewStore";
function BookDisplay({ID, title, author, language,year}:Book){

    console.log("Entered BookDisplay");
    const [update, setUpdate] = useState(0); // add this line
    const [rating, setRating] = useState<string | number>("calculating...");
    const parentRef = useRef<HTMLDivElement>(null);
    const {getPage,increasePage,bookReviews,addBookReview,setBookReviews,resetPage} = useBookReviewStore.getState();
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const [displayReviews, setDisplayReviews] = useState(false);
    useEffect(()=>{
        resetPage();
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}?page=${getPage()}`)
        .then((response)=>{
            console.log("Entered initial reviews")
            increasePage();
            setBookReviews([...response.data]);
        })
        .catch((error)=>{
            console.log("Error: " + error);
        })

        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}/rating`)
        .then(response=>{
            console.log("Entered rating");
            console.log(response.data)
            setRating(response.data);
        
        })
        .catch(error=>{
            console.log("Error in getting rating");
            setRating("unknown");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    const observer = useRef<IntersectionObserver | null>(null);
    const lastReviewElementRef = useCallback((node:Element)=>{
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting){
                getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}?page=${getPage()}`)
                .then((response)=>{
                    console.log("Tryinh to get more reviews");
                    increasePage();
                    console.log(response.data)
                    setBookReviews([...bookReviews, ...response.data]);
                    setUpdate(update=>update+1)
                })
                .catch((error)=>{
                    console.log("Error: " + error);
                })
            }})
            if(node) observer.current?.observe(node);

    }, []);

    return (
        <div className="book-display">
            <p>Title: {title}</p>
            <p>Author: {author}</p>
            <p>Language: {language}</p>
            <p>Year published: {isNaN(year)? "unknown" : year}</p>
            <p>Average Rating: {rating}</p>
            {/* <button onClick={()=>{deleteBook(ID)}}>Remove Book</button> */}
            <Link to={"/book/" + ID} className="page-link">Edit book</Link>
            <Link to={"/review/" + ID} className="page-link">Review book</Link>
            <Link to={"/"} className="page-link">Back to books</Link>
            <button onClick={()=>{setDisplayReviews(!displayReviews)}}>
            {displayReviews? "Hide reviews": "Show reviews"}</button>
            <div ref={parentRef} className="review-box">
            {
                displayReviews &&
                bookReviews.map((review:BookReview, index)=>{
                    if(bookReviews.length === index+1)
                        return <ReviewDisplay ref={lastReviewElementRef} key={review.ID} bookReview={review} />
                    else
                        return <ReviewDisplay key={review.ID} bookReview={review} />
                        
                    }
                )
            }
            </div>
        </div>
    )
}


export default BookDisplay