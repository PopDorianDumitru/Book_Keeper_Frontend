import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
import { useState } from "react";
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
function SimpleBookDisplay({ID, title, author, language,year}:Book){

    const {addCheckmarkedBook, removeCheckmarkedBook, removeBook} = useBookStore((state)=>state);
    const [warningMessage, setVisibleWarning] = useState("");
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const deleteBook = (ID:string) =>{
        if(window.confirm("Are you sure you want to delete the book with the following ID: " + ID + "?")){
            getAxiosInstance().delete(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books/${ID}`)
            .then((response)=>{
                removeBook(ID);
                window.alert("Book has been deleted");
            })
            .catch((error)=>{
                if(error.code !== "ERR_NETWORK"){
                    setVisibleWarning("Umnable to delete book. Error: " + error.message);
                    setTimeout(()=>{
                        setVisibleWarning("");
                    }, 5000);
                }
            });
        }
    }


    return (
        <div className="book-display">
            <p>Title: {title}</p>
            <p>Author: {author}</p>
            <button onClick={()=>{deleteBook(ID)}}>Remove Book</button>
            <input type="checkbox" onChange={(e)=>{e.target.checked ? addCheckmarkedBook(ID) : removeCheckmarkedBook(ID)}}></input>

            
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