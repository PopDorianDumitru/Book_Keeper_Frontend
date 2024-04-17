import '../css/BookList.css'
import { Link} from "react-router-dom";
import SimpleBookDisplay from "./SimpleBookDisplay"; 
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
import NotificationDisplay from './NotificationDisplay';
import useNotificationStore from '../store/notificationStore';
import { ChangeEvent, useEffect, useState } from 'react';
function BookListDisplay(){
    const [sortingFields, setSortingFields] = useState<{field: string, order: string}[]>([]);
    const [sortingLabel, setSortingLabel] = useState("None");
    useEffect(()=>{
        let params = "";
        sortingFields.forEach((obj)=>{
            params += `${obj.field}=${obj.order}&`;
        });
        console.log(params);
        getAxiosInstance()
        .get(`${process.env.REACT_APP_BASIC_URL}/books?${params}`)
        .then((response)=>{
            console.log(response.data);
            setBooks(response.data);
        })
        .catch((err)=>{
            window.alert("Failed to sort: " + err.response.data)
        })
        setSortingLabel(sortingFields.length === 0 ? "None" : sortingFields.reduce((acc, obj)=>acc + obj.field + " " + obj.order + ", ", "").slice(0, -2));
    }, [sortingFields])
    
    const {visible}= useNotificationStore(state=>state);
    const {books, setBooks, deleteCheckmarkedBooks, checkmarkedBooks} = useBookStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    function exportToJSON(){
        const blob = new Blob([JSON.stringify(books)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'books.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    const sortByFields = (event : ChangeEvent)=>{
        const id = event.target.id;
        const parts = id.split("-");
        const field = parts[0];
        const order = parts[1];
        const index = sortingFields.findIndex((obj)=>obj.field === field);
        if(index !== -1){
            const newFields = [...sortingFields];
            newFields[index].order = order;
            setSortingFields(newFields);
        }
        else
        {
            setSortingFields([...sortingFields, {field, order}])
        }
    }

    const removeCheckmarkedBooks = ()=>{
        if(window.confirm("Are you sure you want to delete all selected books?")){
            try{
                checkmarkedBooks.forEach((ID:string)=>{
                    getAxiosInstance().delete(`${process.env.REACT_APP_BASIC_URL}/books/${ID}`).catch((error)=>{
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

    const resetSorting = ()=>{
        const inputs = document.getElementsByClassName("searching-form")[0].getElementsByTagName('input');
        for(let i = 0; i < inputs.length; i++){
            (inputs[i] as HTMLInputElement).checked = false;
        }
        setSortingFields([]);
        console.log("I am here");
    }

    return(
        <div className="book-list-page">
            <div className='book-list'>
                <div className="book-list-form">
                    {
                        books.length !== 0?  books.map(book => <SimpleBookDisplay key={book["ID"]} ID={book["ID"]} title={book["title"]} author={book["author"]} language={book["language"]} year={book["year"]} />)
                                            :  <h2>No books added</h2>
                    }
                </div>
                <div className='searching-form'>
                    <button onClick={resetSorting}>Reset Sorting</button>
                    <label htmlFor='sortByTitle'>Sort by title</label>
                    <div id="sortByTitle">
                        <label htmlFor='title-asc'>Ascending</label>
                        <input onChange={sortByFields} name='title-sort' type='radio' id="title-ASC"></input>
                        <label htmlFor='title-desc'>Descending</label>
                        <input onChange={sortByFields} name='title-sort' type='radio' id="title-DESC"></input>
                    </div>
                    <label htmlFor='sortByAuthor'>Sort by author</label>
                    <div id='sortByAuthor'>
                        <label htmlFor='author-asc'>Ascending</label>
                        <input onChange={sortByFields} name='author-sort' type='radio' id="author-ASC"></input>
                        <label htmlFor='author-desc'>Descending</label>
                        <input onChange={sortByFields} name='author-sort' type='radio' id="author-DESC"></input>
                    </div>
                    <p>Elements currently sorted in the following way: {sortingLabel}</p>
                </div>
            </div>
           
            <button onClick={exportToJSON}>Save to JSON</button>
            <button onClick={removeCheckmarkedBooks}>Delete all selected books</button>    
            <Link to={"/add"} className="page-link">Add books</Link>
            {visible && <NotificationDisplay /> }
        </div>
    )    
}

export default BookListDisplay