import { useCallback, useEffect, useRef, useState } from "react";
import { Book } from "../interfaces/BooksInterface";
import { Link } from "react-router-dom";
import useAxiosStore from "../store/axiosStore";
import "../css/SearchingBooksList.css";
import useUserStore from "../store/userStore";
import useNotificationStore from "../store/notificationStore";
const uuid = require('uuid');

const UserStoryPage = () => {
    const {getUser} = useUserStore(state=>state);
    const {setWarning, removeWarning} = useNotificationStore(state=>state);
    const [story, setStory] = useState<string>("");
    const [books, setBooks] = useState<Book[]>([]);
    const {getAxiosInstance} = useAxiosStore(state => state);
    const pageRef = useRef(0);
    const [author, setAuthor] = useState<string>(getUser()?.username || "");
    const parentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(author !== "" && pageRef.current === 0){
            console.log("this fired");
            searchByAuthor({} as React.MouseEvent); 
            pageRef.current++;
        }
    }, []);
    function searchByAuthor(event:React.MouseEvent): void {
        pageRef.current=0;
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/author?author=${author}&page=${pageRef.current}`)
        .then((res) => {
            const newBooks = res.data;
            setBooks(() => newBooks);
        })
        .catch((err) => {
        })
    }

    const loadMoreBooks = async () => {
        getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/author?author=${author}&page=${pageRef.current}`)
        .then((res) => {
            const newBooks = res.data;
            console.log(newBooks)
            console.log(pageRef.current)
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



    function createNewStory(event: React.MouseEvent): void {
        if(story === "") {
            setWarning({message: "Story title must not be blank"});
            setTimeout(() => removeWarning(), 5000);
            return;
        }
        let ID = uuid.v4();
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/user-stories`, {ID, title: story, author: getUser()?.username, language: "English", year: new Date().getFullYear()})
        .then((response)=>{
            console.log("GOT IT!");
            window.location.reload();
        })
        .catch((error)=>{
            setWarning({message: "Error creating story"});
            setTimeout(() => removeWarning(), 5000);
        });
    }

    return (
        <div className="search-page">
            <div className="search-container">
                <input value={story} onChange={(e) => setStory(e.currentTarget.value)} type="text" placeholder="story title" />
                <button onClick={createNewStory}>Create new story</button>
            </div>
            <div className="books-list" ref={parentRef}>
                {
                    books.length !== 0 ?
                    books.map((book, index) => {
                        if(books.length === index + 1)
                            return (
                                <div ref={lastBookElementRef} key={book.ID} className="book-display-search">
                                    <p>Title: {book.title}</p>
                                    <p>Author: {book.author}</p>
                                    <Link to={"/book/details/" + book.ID} className="page-link">View details</Link>
                                    <Link to={"/user-stories/" + book.ID} className="page-link">Write Story</Link>
                                </div>
                            )
                        return (
                            <div key={book.ID} className="book-display-search">
                                <p>Title: {book.title}</p>
                                <p>Author: {book.author}</p>
                                <Link to={"/book/details/" + book.ID} className="page-link">View details</Link>
                                <Link to={"/user-stories/" + book.ID} className="page-link">Write Story</Link>
                            </div>
                        );
                    })
                    : <p>You have no stories</p>
                }
            </div>
        </div>
    )
}



export default UserStoryPage;