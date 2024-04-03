import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
function BookDisplay({ID, title, author, language,year}:Book){


    return (
        <div className="book-display">
            <p>ID: {ID}</p>
            <p>Title: {title}</p>
            <p>Author: {author}</p>
            <p>Language: {language}</p>
            <p>Year published: {isNaN(year)? "unknown" : year}</p>
            {/* <button onClick={()=>{deleteBook(ID)}}>Remove Book</button> */}
            <Link to={"/book/" + ID} className="page-link">Edit book</Link>
            <Link to={"/"} className="page-link">Back to books</Link>
        </div>
    )
}


export default BookDisplay