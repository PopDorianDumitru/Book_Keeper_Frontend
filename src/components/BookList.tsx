import '../css/BookList.css'
import { Link} from "react-router-dom";
import SimpleBookDisplay from "./SimpleBookDisplay"; 
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
import useNotificationStore from '../store/notificationStore';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Book } from '../interfaces/BooksInterface';
function BookListDisplay(){
    const {setNotification, removeNotification} = useNotificationStore(state=>state);
    const {getPage, increasePage, getListSortingFields, toggleSortingFields, resetSortingFields, resetPage, decreasePage} = useBookStore(state=>state);
    const [sortingFields, setSortingFields] = useState<{field: string, order: string}[]>(getListSortingFields());
    const [sortingLabel, setSortingLabel] = useState(getListSortingFields().length === 0 ? "None" : sortingFields.reduce((acc, obj)=>acc + obj.field + " " + obj.order + ", ", "").slice(0, -2));
    const parentRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        let params = "";
        sortingFields.forEach((obj)=>{
            params += `${obj.field}=${obj.order}&`;
        });
        console.log(params);
        resetPage();
        getAxiosInstance()
        .get(`${process.env.REACT_APP_BASIC_URL}/books?page=${getPage()}&${params}`)
        .then((response)=>{
            console.log(response.data);
            if(getPage() === 0)
                setBooks(response.data);
            else{
                    const newBooks = response.data.filter(
                        (newBook:Book) => !getBooks().some((existingBook) => existingBook.ID === newBook.ID)
                    );
                    setBooks([...getBooks(), ...newBooks]);
            }
            const dirty:Book[] = getDirtyBooks().filter(bk=>!bk.deleted).map(bk=>({
                ID: bk.ID,
                title: bk.title,
                author: bk.author,
                language: bk.language,
                year: bk.year
            }))
            setAvailableBooks([...getBooks(), ...dirty]);
        })
        .catch((err)=>{
            if(err.code !== "ERR_NETWORK" && err.response.status === 401)
                return;
            if(err.code === "ERR_NETWORK")
            {
                const dirty:Book[] = getDirtyBooks().filter(bk=>!bk.deleted).map(bk=>({
                    ID: bk.ID,
                    title: bk.title,
                    author: bk.author,
                    language: bk.language,
                    year: bk.year
                }))
                console.log(dirty);
                setAvailableBooks([...getBooks(), ...dirty]);
            }
            
        })
        setSortingLabel(sortingFields.length === 0 ? "None" : sortingFields.reduce((acc, obj)=>acc + obj.field + " " + obj.order + ", ", "").slice(0, -2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortingFields])
    
    const updateAvailableBooks = ()=>{
        setAvailableBooks([...getBooks(), ...getDirtyBooks().filter(bk=>!bk.deleted).map(bk=>({
            ID: bk.ID,
            title: bk.title,
            language: bk.language,
            author: bk.author,
            year: bk.year
        }))
        ])
    }

    const loadMoreBooks = ()=>{
        console.log("Was called to load more books!");
        increasePage();
        console.log(getPage())
        let params = "";
        getListSortingFields().forEach((obj)=>{
            params += `${obj.field}=${obj.order}&`;
        });
        getAxiosInstance()
        .get(`${process.env.REACT_APP_BASIC_URL}/books?page=${getPage()}&${params}`)
        .then((response)=>{
            console.log(response.data);
            if(response.data.length === 0)
                decreasePage();
            const newBooks = response.data.filter(
                (newBook:Book) => !getBooks().some((existingBook) => existingBook.ID === newBook.ID)
            );
            setBooks([...getBooks(), ...newBooks]);
            const dirty:Book[] = getDirtyBooks().filter(bk=>!bk.deleted).map(bk=>({
                ID: bk.ID,
                title: bk.title,
                author: bk.author,
                language: bk.language,
                year: bk.year
            }))
            setAvailableBooks([...getBooks(), ...dirty]);
        })
        .catch((error)=>{
            if(error.code !== "ERR_NETWORK" && error.response.status === 401)
                return;
            setNotification({message:"Can't load more books, backend is down", user:"System"});
            setTimeout(()=>removeNotification(), 3000)
        })
    }

    const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
    const {getDirtyBooks, getBooks,setBooks, deleteCheckmarkedBooks, checkmarkedBooks} = useBookStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    function exportToJSON(){
        const blob = new Blob([JSON.stringify(availableBooks)], {type: 'application/json'});
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
            toggleSortingFields(field, order);
        }
        else
        {
            toggleSortingFields(field, order);
            setSortingFields([...sortingFields, {field, order}])
        }
    }

    const removeCheckmarkedBooks = async ()=>{
        if(window.confirm("Are you sure you want to delete all selected books?")){
            try{
                let deletedBooks = 0;
                await Promise.all(checkmarkedBooks.map(async (ID:string)=>{
                    await getAxiosInstance().delete(`${process.env.REACT_APP_BASIC_URL}/books/${ID}`).then(()=>deletedBooks+=1).catch((error)=>{
                        if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                            return;
                        window.alert("Error in deleting books:" + error.message);
                    })
                    
                }));
                if(deletedBooks === checkmarkedBooks.length){
                    window.alert("Deleted all books");
                    setAvailableBooks([...(availableBooks.filter((book)=>{
                        return checkmarkedBooks.findIndex((b)=>b === book.ID) === -1;
                    }))]);
                    deleteCheckmarkedBooks();
                }
                
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
        resetSortingFields();
        console.log("I am here");
    }


    const observer = useRef<IntersectionObserver | null>(null);
    const lastBookElementRef = useCallback((node: Element) => {
        if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    loadMoreBooks();
                }
            });
        if (node) observer.current.observe(node);
    }, []);



    return(
        <div className="book-list-page">
            <div className='book-list'>
                <div ref={parentRef} className="book-list-form">
                    {
                        availableBooks.length !== 0?  availableBooks.map((book, index) => {
                            if(availableBooks.length === index + 1)
                                return <SimpleBookDisplay ref={lastBookElementRef} loadMoreBooks={loadMoreBooks} key={book["ID"]} ID={book["ID"]} title={book["title"]} author={book["author"]} language={book["language"]} year={book["year"]} updateAvailableBooks={updateAvailableBooks} />
                            else
                                return <SimpleBookDisplay loadMoreBooks={loadMoreBooks} key={book["ID"]} ID={book["ID"]} title={book["title"]} author={book["author"]} language={book["language"]} year={book["year"]} updateAvailableBooks={updateAvailableBooks} />
                        })
                                            :  <h2>No books added</h2>
                    }
                </div>
                <div className='searching-form'>
                    <button onClick={resetSorting}>Reset Sorting</button>
                    <label htmlFor='sortByTitle'>Sort by title</label>
                    <div id="sortByTitle">
                        <label htmlFor='title-asc'>Ascending</label>
                        <input checked={sortingFields.find(f => f.field === 'title')?.order === 'ASC'} onChange={(ev)=>{resetPage();sortByFields(ev);}} name='title-sort' type='radio' id="title-ASC"></input>
                        <label htmlFor='title-desc'>Descending</label>
                        <input checked={sortingFields.find(f => f.field === 'title')?.order === 'DESC'} onChange={(ev)=>{resetPage();sortByFields(ev);}} name='title-sort' type='radio' id="title-DESC"></input>
                    </div>
                    <label htmlFor='sortByAuthor'>Sort by author</label>
                    <div id='sortByAuthor'>
                        <label htmlFor='author-asc'>Ascending</label>
                        <input checked={sortingFields.find(f => f.field === 'author')?.order === 'ASC'} onChange={(ev)=>{resetPage();sortByFields(ev);}} name='author-sort' type='radio' id="author-ASC"></input>
                        <label htmlFor='author-desc'>Descending</label>
                        <input checked={sortingFields.find(f => f.field === 'author')?.order === 'DESC'} onChange={(ev)=>{resetPage();sortByFields(ev);}} name='author-sort' type='radio' id="author-DESC"></input>
                    </div>
                    <p>Elements currently sorted in the following way: {sortingLabel}</p>
                    <button onClick={exportToJSON}>Save to JSON</button>
                    <button onClick={removeCheckmarkedBooks}>Delete all selected books</button>    
                    <Link to={"/add"} className="page-link">Add books</Link>
                    
                </div>
            </div>
        </div>
    )    
}

export default BookListDisplay