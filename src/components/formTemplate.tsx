import { useState } from "react";
import InputTemplate from "./inputTemplate";
import { Book } from "../interfaces/BooksInterface";
import '../css/BookForm.css'
import useBookStore from "../store/bookStore";
import axios from "axios";
const uuid = require('uuid');


function BookForm(){
    
    const {addBook, books} = useBookStore(state=>state);

    // const [ID, setID] = useState("");
    let ID ="";
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [language, setLanguage] = useState("");
    const [year, setYear] = useState(NaN);
    const [visibleNotification, setVisibleNotification] = useState(false);
    const [visibleWarning, setVisibleWarning] = useState("");
    const tryAddBook = ()=>{

        // if(ID.length < 8)
        // {
        //     setVisibleWarning("Id must have a length of at least 8!");
        //     setTimeout(()=>{
        //         setVisibleWarning("");
        //     }, 5000);
        //     return;
        // }
        // if(title.length === 0)
        // {
        //     setVisibleWarning("Title must not be blank");
        //     setTimeout(()=>{
        //         setVisibleWarning("");
        //     }, 5000);
        //     return;
        // }
        // if(language.length===0)
        // {
        //     setVisibleWarning("Language must not be blank");
        //     setTimeout(()=>{
        //         setVisibleWarning("");

        //     }, 5000);
        //     return;
        // }
        
        // if(Number.parseInt((document.getElementById("year") as HTMLInputElement).value) < 0)
        // {
        //     setVisibleWarning("Year must be a positive number or empty");
        //     setTimeout(()=>{
        //         setVisibleWarning("");
        //     }, 5000);
        //     return;
        // }

        // if(books.findIndex(book => book.ID === ID) !== -1)
        // {
        //     setVisibleWarning("That ID is already in use");
        //     setTimeout(()=>{
        //         setVisibleWarning("");
        //     }, 5000);
        //     return;
        // }
     
        ID = uuid.v4();
        axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books`, {ID, title, author, language, year})
        .then((response)=>{
            console.log(response)
            addBook(
                {
                    ID: response.data.ID, title, author, language, year
                }
            );
            setVisibleNotification(true);
            setTimeout(()=>{
                setVisibleNotification(false);
            }, 3000);
        }).catch((error)=>{
            console.log(error);
            setVisibleWarning(error.response.data);
            setTimeout(()=>{
                setVisibleWarning("");
            }, 5000);
        });
        
        ID = "";
        setTitle("");
        setAuthor("");
        setLanguage("");
        setYear(NaN);
        const fields = document.getElementsByClassName("book-input-field") as HTMLCollection;
        for(let i = 0 ; i < fields.length; i++)
        {
            (fields[i] as HTMLInputElement).value = "";
        }
    }

    return (
        <div className="form-template">
            {/* <InputTemplate id="ID" placeHolderText="" type="text" label="ID " change={(value: string) => { setID(value) } }/> */}
            <InputTemplate id="title" placeHolderText="Enter title" type="text" label="Title " change={(value:string)=>{setTitle(value)}} />                
            <InputTemplate id="author" placeHolderText="Enter author" type="text" label="Author " change={(value:string)=>{setAuthor(value)}} />
            <InputTemplate id="language" placeHolderText="Enter language" type="text" label="Language " change={(value:string)=>{setLanguage(value)}}/>
            <InputTemplate id="year" placeHolderText="Leave empty if unknown" type="number" label="Year published " change={(value:string)=>{setYear(Number.parseInt(value))}}/>  

            <button onClick={tryAddBook}>Add</button>
            {
            visibleNotification &&
            <div className="notificationMessage">
                <p>Book successfully added!</p>
            </div>}
            {visibleWarning !== "" &&
            <div className="error-message">
                <p>{visibleWarning}</p>    
            </div>}
        </div>
    )
}

export default BookForm