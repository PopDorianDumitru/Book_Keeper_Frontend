
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import BookListDisplay from "./BookList";
import IndividualBook from "./IndividualBook";
import BookDisplayWrapper from "./BookDisplayWrapper";
import useBookStore from "../store/bookStore";
import useNotificationStore from "../store/notificationStore";
import BookReviewForm from "./BookReviewForm";
import LeftNavBar from "./LeftNavBar";
import RegistrationForm from "./RegistrationForm";
import LogInForm from "./LoginForm";
import NotificationDisplay from "./NotificationDisplay";
import WarningDisplay from "./WarningDisplay";
import SuccessDisplay from "./SuccessDisplay";
import ProfileOverview from "./ProfileOverview";
import useUserStore from "../store/userStore";
import LogOutConfirmation from "./LogOutConfirmation";
import VerifyingPage from "./VerifyingPage";
import ModeratorAdditionForm from "./ModeratorAdditionForm";

/*
Creating this component above the router in order to keep track of the elements added between the switching of pages
This component is necessary if I don't store the elements in a database or a file
*/

function WebsiteWrapper(){
    const socketInstance = useRef<WebSocket>();
    const {visibleSuccess, visibleWarning, visible} = useNotificationStore(state=>state);
    // const [books, setBooks] = useState<Book[]>([]);
    // const [checkmarkedBooks, setCheckmarkedBooks] = useState<string[]>([]);
    const {addBookReview} = useBookStore(state=>state);
    const [fromStart, setFromStart] = useState<Boolean>(true);
    const {visibleLogOutForm} = useUserStore(state=>state);
    const {setNotification, removeNotification} = useNotificationStore(state=>state);
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
        if(fromStart){
            if(!socketInstance.current){
            
                const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}`);
                socketInstance.current = ws;
                socketInstance.current.onmessage = (ev)=>{
                    const data = JSON.parse(ev.data);
                    const notification = {user: data.user, message: data.review};
                    addBookReview(data);
                    setNotification(notification);
                    console.log(notification)
                    setTimeout(()=>{
                        removeNotification();
                    }, 3000);
                };
            }  
            // getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/books`).then((response)=>{
            //     setBooks(response.data);
            // }).catch((error)=>{
            //     console.log(error);
            //     console.log("Error in fetching books from the server");
            // });
            
            console.log("Entered already existing books");
            setFromStart(false);
           

        }
        // if(booksInStorage != null)
        // {
        //     setBooks(JSON.parse(booksInStorage));
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // useEffect(()=>{
    //     if(books.length !== 0){
    //         console.log("Trying to update books in local storage ");
    //         localStorage.setItem("book-list", JSON.stringify(books));
    //     }
    // }, [books])

    return (
        <BrowserRouter>
            <LeftNavBar></LeftNavBar>
            <Routes>
                <Route path="/profile" element={<ProfileOverview></ProfileOverview>}></Route>
                <Route path="/add" element={<MainPage></MainPage>}></Route>        
                <Route path="/" element={<BookListDisplay></BookListDisplay>}></Route>
                <Route path="/book/:id" element={<IndividualBook ></IndividualBook> }></Route>
                <Route path="/book/details/:id" element={<BookDisplayWrapper></BookDisplayWrapper>}></Route>
                <Route path="/review/:bookId" element={<BookReviewForm></BookReviewForm>}></Route>
                <Route path="/registration" element={<RegistrationForm></RegistrationForm>}></Route>
                <Route path="/login" element={<LogInForm></LogInForm>}></Route>
                <Route path="/verify" element={<VerifyingPage></VerifyingPage>}></Route>
                <Route path="/moderator_registration" element={<ModeratorAdditionForm></ModeratorAdditionForm>} />
            </Routes>
            {
                visible &&
                <NotificationDisplay></NotificationDisplay>
            }
            {
                visibleWarning &&
                <WarningDisplay></WarningDisplay>
            }
            {
                visibleSuccess &&
                <SuccessDisplay></SuccessDisplay>
            }
            {
                visibleLogOutForm &&
                <LogOutConfirmation></LogOutConfirmation>
            }
        </BrowserRouter>
    )

}

export default WebsiteWrapper