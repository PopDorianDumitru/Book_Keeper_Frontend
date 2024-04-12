import { Book } from "../interfaces/BooksInterface";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../css/IndividualBook.css'
import '../css/BookForm.css'
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
function IndividualBook(){

    const {books, updateBook} = useBookStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {id} = useParams();
    let book = books.find(b=>b.ID === id) as Book;
    if(typeof book == "undefined")
        book = {ID: "", title:"", author:"", language:"", year:-2} as Book;
    let oldBook = book;
    let ID = book.ID;
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [language, setLanguage] = useState(book.language);
    const [year, setYear] = useState(book.year);
    const [notMessageVisible, setNotMessageVisible] = useState(false);
    const [warningMessage, setVisibleWarning] = useState("");
    const saveChanges = () =>{
        
        if(Number.parseInt((document.getElementById("year") as HTMLInputElement).value) < 0)
        {
            setVisibleWarning("Year must be a positive number or empty");
            setTimeout(()=>{
                setVisibleWarning("");
            }, 5000);
            return;
        }
        getAxiosInstance()
        .patch(`${process.env.REACT_APP_BASIC_URL}/books/${ID}`, {ID , title, author, language, year})
        .then((response)=>{

            console.log("Got here")
            updateBook(ID, {ID , title, author, language, year});
            setNotMessageVisible(true);
            setTimeout(()=>{
                setNotMessageVisible(false);
            }, 3000);
        }).catch((error)=>{
            if(error.code !== "ERR_NETWORK"){
                setVisibleWarning("Umnable to update book. Error: " + error.message);
                setTimeout(()=>{
                    setVisibleWarning("");
                }, 5000);
            }
        });
        
    }
    const revertChanges = () => {
        oldBook = oldBook as Book;
        setTitle(oldBook.title);
        setAuthor(oldBook.author);
        setLanguage(oldBook.language);
        setYear(oldBook.year);
        
    }


    return (
        <div className="individual-book-wrapper">
            <div className="individual-book">
                <div className="input-template">
                    <label>Title</label><input id="title" type="text" value={title} onChange={(ev)=>setTitle(ev.target.value)}></input>
                </div>
                <div className="input-template">
                    <label>Author</label><input id="author" type="text" value={author} onChange={(ev)=>setAuthor(ev.target.value)}></input>
                </div>
                <div className="input-template">
                    <label>Language</label><input id="language" type="text" value={language} onChange={(ev)=>setLanguage(ev.target.value)}></input>
                </div>
                <div className="input-template">
                    <label>Year published</label><input id="year" type="number" value={year === -1? "unknown" : year} onChange={(ev)=>setYear( Number.parseInt(ev.target.value) )}></input>
                </div>
                <div className="twin-buttons">
                    <button onClick={revertChanges}>Revert changes</button>
                    <button onClick={saveChanges}>Save changes</button>
                </div>
                {notMessageVisible?  <div className="notificationMessage"><p>Book has been updated!</p></div>: <></>}
                {warningMessage !== "" && 
                <div className="error-message">
                    <p>{warningMessage}</p>
                </div>
                }
            </div>
            <Link to="/" className="page-link">Back to list</Link>
        </div>
    )

}

export default IndividualBook;