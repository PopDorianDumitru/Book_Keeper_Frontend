import { useCallback, useEffect, useRef, useState } from "react";
import { Book } from "../interfaces/BooksInterface";
import { Link } from "react-router-dom";
import useAxiosStore from "../store/axiosStore";
import "../css/SearchingBooksList.css";
const SearchingBooksList = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const {getAxiosInstance} = useAxiosStore(state => state);
    const pageRef = useRef(0);
    const [author, setAuthor] = useState<string>(localStorage.getItem("author") || "");
    const authorRef = useRef(author);
    const parentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(author !== ""){
            console.log("this fired");
            searchByAuthor({} as React.MouseEvent); 
        }
    }, []);
    function searchByAuthor(event:React.MouseEvent): void {
        pageRef.current=0;
        localStorage.setItem("author", author);
        localStorage.setItem("page-searched", JSON.stringify(0));
        localStorage.setItem("searched-books", JSON.stringify([]));
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/author?author=${author}&page=${pageRef.current}`)
        .then((res) => {
            const newBooks = res.data;
            if(newBooks.length !== 0)
                pageRef.current++;
            setBooks(() => newBooks);
            localStorage.setItem("searched-books", JSON.stringify(newBooks));
        })
        .catch((err) => {

        })
    }

    const loadMoreBooks = async () => {
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/author?author=${authorRef.current}&page=${pageRef.current}`)
        .then((res) => {
            const newBooks = res.data;
            if(newBooks.length === 0)
                return;
            pageRef.current++;
            console.log(books);
            setBooks((curr) => [...curr, ...newBooks]);
        })
        .catch((err) => {

        })
    }

    const observer = useRef<IntersectionObserver | null>(null);
    const lastBookElementRef = useCallback((node: HTMLDivElement) => {
        if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    loadMoreBooks();
                }
            });
        if (node) observer.current.observe(node);
    }, []);



    return (
        <div className="search-page">
            <div className="search-container">
                <input type="text" value={author} onChange={(e) => {setAuthor(e.currentTarget.value); authorRef.current=e.currentTarget.value}} placeholder="search for author" />
                <button onClick={searchByAuthor}>Search</button>
            </div>
            <div className="books-list" ref={parentRef}>
                {
                    books.map((book, index) => {
                        if(books.length === index + 1)
                            return (
                                <div ref={lastBookElementRef} key={book.ID} className="book-display-search">
                                    <p>Title: {book.title}</p>
                                    <p>Author: {book.author}</p>
                                    <Link to={"/book/details/" + book.ID} className="page-link">View details</Link>
                                </div>
                            )
                        return (
                            <div key={book.ID} className="book-display-search">
                                <p>Title: {book.title}</p>
                                <p>Author: {book.author}</p>
                                <Link to={"/book/details/" + book.ID} className="page-link">View details</Link>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}



export default SearchingBooksList;