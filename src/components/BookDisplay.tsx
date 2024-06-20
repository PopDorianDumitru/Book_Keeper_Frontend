import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import useAxiosStore from "../store/axiosStore";
import { BookReview } from "../interfaces/BookReviewInterface";
import ReviewDisplay from "./ReviewDisplay";
import useBookReviewStore from "../store/bookReviewStore";
import ChatGptChat from "./ChatGptChat";
import useNotificationStore from "../store/notificationStore";
import { AxiosError } from "axios";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { get } from "lodash";
function BookDisplay({ID, title, author, language,year}:Book){

    const [rating, setRating] = useState<string | number>("calculating...");
    const parentRef = useRef<HTMLDivElement>(null);
    const [picture, setPicture] = useState<string>("");
    const {getPage,increasePage,bookReviews,setBookReviews,resetPage} = useBookReviewStore.getState();
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const [displayReviews, setDisplayReviews] = useState(false);
    const {setSuccess, removeSuccess, setWarning, removeWarning} = useNotificationStore(state=>state);
    useEffect(()=>{
        resetPage();
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/photo/${ID}`)
        .then((response) => {setPicture(response.data)})
        .catch((error) => console.log(error));
        console.log("Use effect in book display")
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}/rating`)
        .then(response=>{
            console.log("Entered rating");
            console.log(response.data.rating)
            setRating(response.data.rating);
        
        })
        .catch(error=>{
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            console.log("Error in getting rating");
            setRating("unknown");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    const observer = useRef<IntersectionObserver | null>(null);
    const lastReviewElementRef = useCallback((node:Element)=>{
        console.log(bookReviews);
        if(observer.current) observer.current.disconnect();
        increasePage();
        observer.current = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting){
                getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}?page=${getPage()}`)
                .then((response)=>{
                    console.log("Trying to get more reviews");
                    const newReviews = response.data.filter(
                        (review: any) => !bookReviews.some((existingReview: any) => existingReview.id === review.id)
                      );
                    console.log(newReviews);  
                    console.log(response.data)
                    setBookReviews([...bookReviews, ...newReviews]);
                })
                .catch((error)=>{
                    if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                        return;
                    console.log("Error: " + error);
                })
            }})
            if(node) observer.current?.observe(node);

    }, []);

    const getInitialReviews = ()=>{

        if(displayReviews)
        {
            setDisplayReviews(false);
            return;
        }
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/reviews/book/${ID}?page=${getPage()}`)
        .then((response)=>{
            setBookReviews(response.data);
            setDisplayReviews(true);
        })
        .catch((error)=>{
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            console.log("Error: " + error);
        })

        
    }

    function openPDF(): void {
        try{
            getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/pdfs/${ID}`, {responseType: "arraybuffer", headers: {Accept: 'application/pdf'}})
            .then((response)=>{
                const blob = new Blob([response.data], {type: 'application/pdf'});
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch((error: AxiosError)=>{
                if(error.code !== "ERR_NETWORK" && error.response?.status === 401)
                    return;
                setWarning({message: "PDF of that book is currently not available."});
                setTimeout(()=>{
                    removeWarning();
                }, 4000);
            });
        }
        catch(error : any){
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            setWarning({message: "PDF of that book is currently not available."});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        }
    }

    return (     
        <div className="book-display">
            <div className="book-information">
                <img alt="Not available :(" src={picture} className="book-picture" />
                <div>
                    <p>Title: {title}</p>
                    <p>Author: {author}</p>
                    <p>Language: {language}</p>
                    <p>Year published: {isNaN(year)? "unknown" : year}</p>
                    <p>Average Rating: {rating}</p>
                </div>
                
            </div>
            
            {/* <button onClick={()=>{deleteBook(ID)}}>Remove Book</button> */}
            <ChatGptChat bookTitle={title} />
            <button onClick={() => openPDF()}>Open PDF</button>
            <Link to={"/book/" + ID} className="page-link">Edit book</Link>
            <Link to={"/review/" + ID} className="page-link">Review book</Link>
            <div className="sharing-container">
                <WhatsappShareButton url={`Check out this book: ${window.location.href}`}>
                    <WhatsappIcon />
                </WhatsappShareButton>
            </div>
            <Link to={"/"} className="page-link">Back to books</Link>
            <button onClick={()=>{
                    getInitialReviews();
                }
            }> 
            {displayReviews? "Hide reviews": "Show reviews"}</button>
            <div ref={parentRef} className="review-box">
            {
                displayReviews &&
                bookReviews.map((review:BookReview, index)=>{
                    console.log(review)
                    if(bookReviews.length === index+1)
                        {
                            console.log("Last review");
                            return <ReviewDisplay ref={lastReviewElementRef} key={review.ID} bookReview={review} />
                            // return <ReviewDisplay  key={review.ID} bookReview={review} />


                        }
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