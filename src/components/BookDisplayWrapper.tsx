import React, { useState } from "react";

import { useParams } from "react-router-dom";
import BookDisplay from "./BookDisplay";
import { useNavigate } from "react-router-dom";
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
import { isUndefined } from "lodash";
import { Book } from "../interfaces/BooksInterface";
function BookDisplayWrapper(){
    const {books} = useBookStore(state=>state);
    const {id} = useParams();
    const {getAxiosInstance} = useAxiosStore(state => state);
    const [book, setBook] = useState<Book | undefined>(books.find(b=>b.ID === id));
    const loadBook = async () =>{ 
        if(book === undefined || book === null)
        {
            try{
                const response = await getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/books/${id}`);
                const newBook = response.data;
                setBook(newBook);
            }
            catch(error){
                console.log(error);
            }
        }   
    }
    if(isUndefined(book))
    {
        loadBook();
        return(<div></div>);
    }
    return (
        <BookDisplay ID={book!.ID} title={book!.title} author={book!.author} language={book!.language} year={book!.year}></BookDisplay>
    )
}


export default BookDisplayWrapper;