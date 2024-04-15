import React from "react";

import { useParams } from "react-router-dom";
import BookDisplay from "./BookDisplay";
import { useNavigate } from "react-router-dom";
import useBookStore from "../store/bookStore";
function BookDisplayWrapper(){
    const {books} = useBookStore(state=>state);
    const {id} = useParams();
    const book = books.find(b => b.ID === id);
    const navigate = useNavigate();
    if(typeof book === "undefined")
    {
        navigate("/")
        return(<div></div>);
    }
    return(
            <BookDisplay ID={book!.ID} title={book!.title} author={book!.author} language={book!.language} year={book!.year}></BookDisplay>
    )
}


export default BookDisplayWrapper;