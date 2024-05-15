import {  useState } from "react";
import InputTemplate from "./inputTemplate";
import useAxiosStore from "../store/axiosStore";
import useBookReviewStore from "../store/bookReviewStore";
import { Link, useParams } from "react-router-dom";
import useBookStore from "../store/bookStore";
import MultiLineInputTemplate from "./MultiLineInputTemplate";
import useUserStore from "../store/userStore";
const uuid = require('uuid');



function BookReviewForm(){

    const {bookId} = useParams();
    
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {addBookReview, addDirtyBookReview} = useBookReviewStore(state=>state);
    const {books} = useBookStore(state=>state);
    const [foundBook] = useState(books.find(b=>b.ID === bookId));
    const {getUser} = useUserStore(state=>state);


    const [rating, setRating] = useState(NaN);
    const [content, setContent] = useState("");
    const [visibleNotification, setVisibleNotification] = useState(false);
    const [visibleWarning, setVisibleWarning] = useState("");
    const tryAddReview = () => {
        if(content.length === 0)
        {
            setVisibleWarning("Content must not be blank");
            setTimeout(()=>{
                setVisibleWarning("");
            }, 5000);
            return;
        }
        if(isNaN(rating))
        {
            setVisibleWarning("Rating must be a number");
            setTimeout(()=>{
                setVisibleWarning("");
            }, 5000);
            return;
        }
        getAxiosInstance()
        .post(`${process.env.REACT_APP_BASIC_URL}/reviews`, {rating, content, username: getUser()?.username, bookId: foundBook?.ID, userId: "fkdslfjsdkflsd"})   
        .then((response)=>{
            
            if(response !== undefined)
            {
                addBookReview(response.data);
                setVisibleNotification(true);
                setTimeout(()=>{
                    setVisibleNotification(false);
                }, 3000);

                setRating(NaN);
                setContent("");
                const fields = document.getElementsByClassName("book-input-field") as HTMLCollection;
                for(let i = 0 ; i < fields.length; i++)
                {
                    (fields[i] as HTMLInputElement).value = "";
                }

            }
        })
        .catch((error)=>{
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            if(error.code !== "ERR_NETWORK"){
                setVisibleWarning(error.response.data);
                setTimeout(()=>{
                    setVisibleWarning("");
                }, 5000);
            }
            else
            {
                addDirtyBookReview({ID: uuid.v4(),rating, content, username: getUser()?.username as string, bookId: foundBook!.ID, userId: "fkdslfjsdkflsd"});
                setRating(NaN);
                setContent("");
                setVisibleNotification(true);
                setTimeout(()=>{
                    setVisibleNotification(false);
                }, 3000);

                const fields = document.getElementsByClassName("book-input-field") as HTMLCollection;
                for(let i = 0 ; i < fields.length; i++)
                {
                    (fields[i] as HTMLInputElement).value = "";
                }
            }
        })
    }


    return (
        <div>
            {
                foundBook ?
                <div className="form-template">
                    <InputTemplate id="rating" placeHolderText="Enter rating" type="number" label="Rating " change={(value:string)=>{setRating(Number.parseInt(value))}} />
                    <MultiLineInputTemplate id="content" placeHolderText="Enter content" label="Content " change={(value:string)=>{setContent(value)}} />

                    <button onClick={tryAddReview}>Add</button>
                    {
                        visibleNotification && 
                        <div className="notificationMessage">
                            <p>Book review successfully added</p>
                        </div>
                    }
                    {
                        visibleWarning !== "" &&
                        <div className="error-message">
                            <p>{visibleWarning}</p>
                        </div>
                    }
                    <Link to={`/book/details/${bookId}`} className="page-link">Back to book</Link>
                </div>
                :
                <div>
                    <p>Book with the ID {bookId} was not found</p>
                    <Link to="/" className="page-link">Back to list</Link>
                </div>
                
            }
        </div>
    )
}

export default BookReviewForm;