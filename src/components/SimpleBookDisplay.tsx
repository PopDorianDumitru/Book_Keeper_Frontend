import {Book} from "../interfaces/BooksInterface";
import '../css/BookListDisplay.css'
import { Link } from "react-router-dom";
import { ForwardedRef,  forwardRef, useState } from "react";
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
function SimpleBookDisplay({ID, title, author, language,year,updateAvailableBooks, loadMoreBooks, ref}:Book&{updateAvailableBooks:()=>void, loadMoreBooks:()=>void, ref:React.ForwardedRef<unknown>}){
    


    const {addCheckmarkedBook, setDirtyBookById, removeCheckmarkedBook, removeBook, getBookById, getDirtyBookById, addDirtyBook} = useBookStore((state)=>state);
    const [warningMessage, setVisibleWarning] = useState("");
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const deleteBook = (ID:string) =>{
        if(window.confirm("Are you sure you want to delete the book with the following ID: " + ID + "?")){
            getAxiosInstance().delete(`${process.env.REACT_APP_BASIC_URL}/books/${ID}`)
            .then((response)=>{
                removeBook(ID);
                updateAvailableBooks();
                window.alert("Book has been deleted");
            })
            .catch((error)=>{
                if(error.code !== "ERR_NETWORK"){
                    setVisibleWarning("Umnable to delete book. Error: " + error.message);
                    setTimeout(()=>{
                        setVisibleWarning("");
                    }, 5000);
                }
                else{
                    //Either the book is dirty or not dirty
                    const goodBook = getBookById(ID);
                    if(goodBook !== undefined)
                    {
                        removeBook(ID);
                        addDirtyBook({...goodBook, existed: true, deleted: true});
                    }
                    else{
                        const dirtyBook = getDirtyBookById(ID);
                        console.log(dirtyBook);
                        if(dirtyBook !== undefined)
                        {
                            setDirtyBookById(dirtyBook.ID,{...dirtyBook, deleted: true});
                            console.log("Dirty book added to dirty books with deleted set to true");
                        }
                        
                    }
                    updateAvailableBooks();
                }
            });
        }
    }

    

    return (
        <div ref={ref as ForwardedRef<HTMLDivElement>}  className="book-display book-display-list">
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

const SimpleBookDisplayComponent = forwardRef(({ID, title, author, language,year,updateAvailableBooks, loadMoreBooks}:Book&{updateAvailableBooks:()=>void, loadMoreBooks:()=>void}, ref)=>{
    return SimpleBookDisplay({ID, title, author, language, year, updateAvailableBooks,loadMoreBooks, ref});
})

export default SimpleBookDisplayComponent