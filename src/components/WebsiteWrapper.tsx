
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import BookListDisplay from "./BookList";
import IndividualBook from "./IndividualBook";
import BookDisplayWrapper from "./BookDisplayWrapper";
import axios from "axios";
import useBookStore from "../store/bookStore";

/*
Creating this component above the router in order to keep track of the elements added between the switching of pages
This component is necessary if I don't store the elements in a database or a file
*/

function WebsiteWrapper(){
    console.log(process.env.REACT_APP_SERVER_PORT);
    // const [books, setBooks] = useState<Book[]>([]);
    // const [checkmarkedBooks, setCheckmarkedBooks] = useState<string[]>([]);
    const {books, setBooks} = useBookStore();
    const [fromStart, setFromStart] = useState<Boolean>(true);
    // const addBook = (book : Book)=>{
    //     console.log("Adding a book");
    //     console.log(process.env.REACT_APP_SERVER_PORT);
    //     axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books`, book).then((response)=>{
    //         console.log(response.data);
    //         setBooks([...books, response.data]);
    //     }).catch((error)=>{
    //         console.log("Error in adding book to the server");
    //     });
    //     //setBooks([...books, book]);
    // }

    
    useEffect(()=>{
        axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books`).then((response)=>{
            setBooks(response.data);
        }).catch((error)=>{
            console.log("Error in fetching books from the server");
        });
        // if(booksInStorage != null)
        // {
        //     setBooks(JSON.parse(booksInStorage));
        // }
        console.log("Entered already existing books");
    }, []);

    

   

    // const removeBook = (id : string) => {
    //     if(window.confirm("Are you sure you want to delete the book with the following ID: " + id + "?"))
    //     {
    //         console.log("Trying to remove books");
    //         // let tempBooks = books.map(b=>b);
    //         // tempBooks = tempBooks.filter(b => b.ID !== id);
    //         // setBooks(tempBooks);
    //         axios.delete(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books/${id}`).then((response)=>{
    //             console.log(response.data);
    //             setBooks(books.filter(b=>b.ID !== id));
    //         }).catch((error)=>{
    //             console.log("Error in deleting book from the server");
    //         });
    //     }
    // }

    // const updateBook = (id: string, updatedBook : Book)=>{
    //     // let tempBooks =  [...books];
    //     // console.log(updatedBook)
    //     // tempBooks = tempBooks.map(book=>{
    //     //     if(book["ID"] !== id)
    //     //         return book;
    //     //     return updatedBook;
    //     // });
    //     // setBooks(tempBooks);
    //     axios.patch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books/${id}`, updatedBook).then((response)=>{
    //         console.log(response.data);
    //         setBooks(books.map(book=>{
    //             if(book["ID"] !== id)
    //                 return book;
    //             return updatedBook;
    //         }));
    //     }).catch((error)=>{
    //         console.log("Error in updating book in the server");
    //     });
    // }


    // const addCheckmarkedBook = (bookId : string)=>{
    //     setCheckmarkedBooks([...checkmarkedBooks, bookId]);
    // }

    // const removeCheckmarkedBook = (bookId : string)=>{
    //     let copyCheckmarkedBooks = [...checkmarkedBooks];
    //     copyCheckmarkedBooks = copyCheckmarkedBooks.filter(b=>b !== bookId);
    //     setCheckmarkedBooks(copyCheckmarkedBooks);
    // }

    // const deleteCheckmarkedBooks = ()=>{
    //     if(window.confirm("Are you sure you want to delete all selected books?"))
    //     {
    //         //let copyBooks = [...books];
    //         // copyBooks = copyBooks.filter(book => checkmarkedBooks.findIndex((b)=>b === book.ID) === -1)
    //         // setBooks(copyBooks);
    //         checkmarkedBooks.forEach((bookId)=>{
    //             axios.delete(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/books/${bookId}`).then((response)=>{
    //                 console.log(response.data);
    //             }).catch((error)=>{
    //                 console.log("Error in deleting book from the server");
    //             });
    //         })
    //         setBooks(books.filter(book => checkmarkedBooks.findIndex((b)=>b === book.ID) === -1));
    //         setCheckmarkedBooks([]);
    //     }
    // }

    useEffect(()=>{
        if(books.length !== 0 || !fromStart){
            console.log("Trying to update books in local storage ");
            localStorage.setItem("book-list", JSON.stringify(books));
            setFromStart(false);
        }
    }, [books, fromStart])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/add" element={<MainPage></MainPage>}></Route>        
                <Route path="/" element={<BookListDisplay></BookListDisplay>}></Route>
                <Route path="/book/:id" element={<IndividualBook ></IndividualBook> }></Route>
                <Route path="/book/details/:id" element={<BookDisplayWrapper></BookDisplayWrapper>}></Route>
            </Routes>
        </BrowserRouter>
    )

}

export default WebsiteWrapper