import { Book } from "../interfaces/BooksInterface";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../css/IndividualBook.css'
import '../css/BookForm.css'
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
import useNotificationStore from "../store/notificationStore";
function IndividualBook(){

    const {books, getBookById, getDirtyBookById, setDirtyBookById, addDirtyBook, removeBook, updateBook} = useBookStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const {id} = useParams();
    const {setWarning, removeWarning, setSuccess, removeSuccess} = useNotificationStore(state=>state);
    const [book, setBook] = useState(books.find(b=>b.ID === id) as Book);

    const loadBook = async () => {
        if(book === undefined || book === null)
        {
            try{
                const response = await getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/books/${id}`);
                const newBook = response.data;
                setBook(newBook);
                setTitle(newBook.title);
                setAuthor(newBook.author);
                setLanguage(newBook.language || "English");
                setYear(newBook.year);

                ID = newBook.ID;
            }
            catch(error){
                console.log(error);
            }
        }
    }

    useEffect( () => {
        loadBook();

    }, [])
    let oldBook = book;
    let ID = "";
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [language, setLanguage] = useState("");
    const [year, setYear] = useState(0);
    const [notMessageVisible, setNotMessageVisible] = useState(false);
    const [warningMessage, setVisibleWarning] = useState("");
    const saveChanges = () =>{
        
        if(title.length === 0)
        {
            setVisibleWarning("Title must not be blank");
            setTimeout(()=>{
                setVisibleWarning("");
            }, 5000);
            return;
        }
        if(language.length===0)
        {
            setVisibleWarning("Language must not be blank");
            setTimeout(()=>{
                setVisibleWarning("");

            }, 5000);
            return;
        }
            
        if(Number.parseInt((document.getElementById("year") as HTMLInputElement).value) < 0)
        {
            setVisibleWarning("Year must be a positive number or empty");
            setTimeout(()=>{
                setVisibleWarning("");
            }, 5000);
            return;
        }
    
        getAxiosInstance()
        .patch(`${process.env.REACT_APP_BASIC_URL}/books/${ID}`, {title, author, language, year})
        .then((response)=>{

            console.log("Got here")
            updateBook(ID, {ID, title, author, language, year});
            setNotMessageVisible(true);
            setTimeout(()=>{
                setNotMessageVisible(false);
            }, 3000);
        }).catch((error)=>{
            if(error.code !== "ERR_NETWORK" &&error.response.status === 401)
                return;
            if(error.code !== "ERR_NETWORK"){
                setVisibleWarning("Unable to update book. Error: " + error.response.data);
                setTimeout(()=>{
                    setVisibleWarning("");
                }, 5000);
            }
            else{
                const goodBook = getBookById(ID);
                if(goodBook !== undefined)
                {
                    removeBook(ID);
                    addDirtyBook({...goodBook,title, author, language, year, existed: true, deleted: false});
                    setNotMessageVisible(true);
                    setTimeout(()=>{
                        setNotMessageVisible(false);
                    }, 3000);
                }
                else
                {
                    const dirtyBook = getDirtyBookById(ID);
                    if(dirtyBook !== undefined)
                    {
                        setDirtyBookById(ID, {...dirtyBook, title, author, language, year});
                        setNotMessageVisible(true);
                        setTimeout(()=>{
                            setNotMessageVisible(false);
                        }, 3000);
                    }
                }
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


    function addPDF(event: React.MouseEvent): void {
        event.preventDefault();
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf";
        fileInput.onchange = (ev: Event) => {
            const file = (ev.target as HTMLInputElement).files?.item(0);
            if(file === undefined || file === null)
                return;
            const formData = new FormData();
            formData.append("file", file);
            getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/upload?id=`+id?.toString(), formData, {headers: {'Content-Type': "multipart/form-data"}} )
            .then((response)=>{
                setSuccess({message: "PDF has been uploaded"});
                setTimeout(()=>{
                    removeSuccess();
                }, 4000);
            })
            .catch((error)=>{
                setWarning({message: "Unable to upload PDF. Error: " + error.response.data});
                setTimeout(()=>{
                    removeWarning();
                }, 5000);
            })
        }
        fileInput.click();
    }

    if(book === undefined)
        return <div className="individual-book-wrapper"><p>Book not found</p></div>

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
                <button onClick={(e) => addPDF(e)}>Add PDF</button>
            </div>
            
            <Link to="/" className="page-link">Back to list</Link>
        </div>
    )

}

export default IndividualBook;