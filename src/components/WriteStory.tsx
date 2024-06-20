import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosStore from "../store/axiosStore";
import pdfToText from "react-pdftotext";
import "../css/WriteStory.css"
import {jsPDF} from 'jspdf'
import useNotificationStore from "../store/notificationStore";
import { set } from "lodash";
const WriteStory = () => {
    const [story, setStory] = useState<string>("");
    const [imageDescription, setImageDescription] = useState<string>("");    
    const {id} = useParams();
    const renderRef = useRef<boolean>(false);
    const nav = useNavigate();
    const {getAxiosInstance} = useAxiosStore(state => state);
    const {setSuccess, removeSuccess, setWarning, removeWarning} = useNotificationStore(state => state);
    useEffect(() => {   
        if(!renderRef.current)
        {
            renderRef.current = true;
            getAxiosInstance().get(`${process.env.REACT_APP_BASIC_URL}/pdfs/${id}`, {responseType: "blob"})
            .then((data) => {
                pdfToText(data.data).then((text) => {  
                    const textWIthNewLines = text.replace(/\\n/g, '\n')
                    setStory(textWIthNewLines );
                    console.log(text)
                })
                .catch((error) => {
                    console.log(error);
                    window.alert("Error reading pdf");
                    nav("/");
                });
            })
            .catch((error) => {
                console.log(error);
                window.alert("That story does not exist!");
                nav("/");
            })
        }
        
    }, []);
    function savePDF(event: React.MouseEvent): void {
        event.preventDefault();
        const doc = new jsPDF();

        const textareaLines = story.split('\n'); // Split the text into lines at each new line character
        let y = 10; // Initialize the y-coordinate

        for (let line of textareaLines) {
            const pdfLines = doc.splitTextToSize(line, 180); // Split the line into smaller lines if it's too long
            for (let pdfLine of pdfLines) {
                doc.text(pdfLine, 10, y); // Add the line to the PDF at position (10,y)
                y += 10; // Increase the y-coordinate for the next line
            }
        }


        const pdfBlob = new Blob([doc.output("blob")], {type: "application/pdf"});
        const formData = new FormData()
        formData.append("file", pdfBlob, `${id}.pdf`);
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

    function getSuggestion(event: React.MouseEvent): void {
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/suggestion`, {text: story})
        .then((response) => {
            setStory(story + " " + response.data);
        })
        .catch((error) => {
            setWarning({message: "Unable to get suggestion"});
            setTimeout(()=>{
                removeWarning();
            }, 5000);
        });
    }
    const [imageURL, setImageURL] = useState<string>("");

    function generateImage(event: React.MouseEvent): void {
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/generatePhoto`, {input: imageDescription})
        .then((response) => {
            setImageURL(response.data)
        })
        .catch((error)  => {
            console.log(error)
        })
    }

    return (
        <div>
            <div className="book-area">
                <div className="text-area">
                    <textarea value={story} onChange={(e) => setStory(e.currentTarget.value)} placeholder="Write your story here"></textarea>
                </div>
                {imageURL !== "" && <img src={`data:image/jpeg;base64,${imageURL}`} alt="Generated" />}
            </div>
            
            <div className="button-container">
                <button onClick={getSuggestion}>Generate AI Suggestion</button>
                <button onClick={savePDF}>Save PDF</button>
                <input value={imageDescription} onChange={(e) => setImageDescription(e.currentTarget.value)} type="text" placeholder="Describe image"></input>
                <button onClick={generateImage}>Generate an Image</button>
            </div>
        </div>
    )
}

export default WriteStory;