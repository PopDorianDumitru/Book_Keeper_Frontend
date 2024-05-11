import { useState } from "react";
import InputTemplate from "./inputTemplate";
import '../css/BookForm.css'
import useBookStore from "../store/bookStore";
import useAxiosStore from "../store/axiosStore";
const uuid = require('uuid');


function BookForm(){
    
    const {addBook, addDirtyBook} = useBookStore(state=>state);
    const {getAxiosInstance} = useAxiosStore(state=>state);
    // const [ID, setID] = useState("");
    let ID ="";
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [language, setLanguage] = useState("");
    const [year, setYear] = useState(NaN);
    const [visibleNotification, setVisibleNotification] = useState(false);
    const [visibleWarning, setVisibleWarning] = useState("");
    const tryAddBook = ()=>{

       
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

       
     
        ID = uuid.v4();
        getAxiosInstance()
        .post(`${process.env.REACT_APP_BASIC_URL}/books`, {ID, title, author, language, year})
        .then((response)=>{
            console.log("For the post "+ response);
            if(response !== undefined)
                addBook(
                    {
                        ID: response.data.ID, title, author, language, year
                    }
                );
            setVisibleNotification(true);
            setTimeout(()=>{
                setVisibleNotification(false);
            }, 3000);
        })
        .catch((error)=>{
            if(error.response.status === 401)
                return;
            if(error.code !== "ERR_NETWORK"){
                setVisibleWarning(error.response.data);
                setTimeout(()=>{
                    setVisibleWarning("");
                }, 5000);
            }
            else
            if(error.code === "ERR_NETWORK")
            {
                addDirtyBook(
                    {
                        ID: uuid.v4(), title, author, language, year, existed: false, deleted: false
                    }
                );
                setVisibleNotification(true);
            setTimeout(()=>{
                setVisibleNotification(false);
            }, 3000);

            }
        });
        
        ID = "";
        setTitle("");
        setAuthor("");
        setLanguage("");
        setYear(NaN);
        const fields = document.getElementsByClassName("book-input-field") as HTMLCollection;
        for(let i = 0 ; i < fields.length; i++)
        {
            (fields[i] as HTMLInputElement).value = "";
        }
    }

    return (
        <div className="form-template">
            {/* <InputTemplate id="ID" placeHolderText="" type="text" label="ID " change={(value: string) => { setID(value) } }/> */}
            <InputTemplate id="title" placeHolderText="Enter title" type="text" label="Title " change={(value:string)=>{setTitle(value)}} />                
            <InputTemplate id="author" placeHolderText="Enter author" type="text" label="Author " change={(value:string)=>{setAuthor(value)}} />
            <InputTemplate id="language" placeHolderText="Enter language" type="text" label="Language " change={(value:string)=>{setLanguage(value)}}/>
            <InputTemplate id="year" placeHolderText="Leave empty if unknown" type="number" label="Year published " change={(value:string)=>{setYear(Number.parseInt(value))}}/>  

            <button onClick={tryAddBook}>Add</button>
            {
            visibleNotification &&
            <div className="notificationMessage">
                <p>Book successfully added!</p>
            </div>}
            {visibleWarning !== "" &&
            <div className="error-message">
                <p>{visibleWarning}</p>    
            </div>}
        </div>
    )
}

export default BookForm