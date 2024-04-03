import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
import { useState } from "react";
import useBookStore from "../store/bookStore";
import axios from "axios";
function SimpleBookDisplay({ID, title, author, language,year}:Book){

   const {addCheckmarkedBook, removeCheckmarkedBook, removeBook} = useBookStore((state)=>state);
   const [notMessageVisible, setNotMessageVisible] = useState(false);
   const [warningMessage, setVisibleWarning] = useState("");

    const deleteBook = (ID:string) =>{
        if(window.confirm("Are you sure you want to delete the book with the following ID: " + ID + "?")){
            axios.delete(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books/${ID}`)
            .then((response)=>{
                removeBook(ID);
                window.alert("Book has been deleted");
            })
            .catch((error)=>{
                setVisibleWarning(error.response.data);
                setTimeout(()=>{
                    setVisibleWarning("");
                }, 5000);
            });
        }
    }


    return (
        <div className="book-display">
            <p>Title: {title}</p>
            <p>Author: {author}</p>
            <button onClick={()=>{deleteBook(ID)}}>Remove Book</button>
            <input type="checkbox" onChange={(e)=>{e.target.checked ? addCheckmarkedBook(ID) : removeCheckmarkedBook(ID)}}></input>

            {notMessageVisible?  <div className="notificationMessage"><p>Book has been updated!</p></div>: <></>}
                {warningMessage !== "" && 
                <div className="error-message">
                    <p>{warningMessage}</p>
                </div>
                }

            <Link to={"/book/" + ID} className="page-link">Edit book</Link>
            <Link to={"/book/details/" + ID} className="page-link">View details</Link>

        </div>
    )
}


export default SimpleBookDisplay