import { Book } from "../interfaces/BooksInterface";
import '../css/BookList.css'
import { Link } from "react-router-dom";
import SimpleBookDisplay from "./SimpleBookDisplay"; 
import useBookStore from "../store/bookStore";
import axios from "axios";
function BookListDisplay(){

    const {books, deleteCheckmarkedBooks, checkmarkedBooks} = useBookStore(state=>state);

    function exportToJSON(){
        const blob = new Blob([JSON.stringify(books)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'books.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    const removeCheckmarkedBooks = ()=>{
        if(window.confirm("Are you sure you want to delete all selected books?")){
            try{
                checkmarkedBooks.forEach((ID:string)=>{
                    axios.delete(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books/${ID}`).catch((error)=>{
                        window.alert("Error in deleting books:" + error.message);
                    })
                    ;
                });
                window.alert("Deleted all boks");
                deleteCheckmarkedBooks();
            }catch(error){
                window.alert("Error in deleting books:" + error);
            }
        }
    }

    return(
        <div className="book-list-page">
            <div className="book-list-form">
                {
                    books.length !== 0?  books.map(book => <SimpleBookDisplay key={book["ID"]} ID={book["ID"]} title={book["title"]} author={book["author"]} language={book["language"]} year={book["year"]} />)
                                        :  <h2>No books added</h2>
                }
            </div>
            <button onClick={exportToJSON}>Save to JSON</button>
            <button onClick={removeCheckmarkedBooks}>Delete all selected books</button>    
            <Link to={"/add"} className="page-link">Add books</Link>
            
        </div>
    )    
}

export default BookListDisplay