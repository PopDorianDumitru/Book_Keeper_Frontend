import '../css/InputTemplate.css'

function InputTemplate({id, label,  placeHolderText, change} : {id: string, label: string, placeHolderText: string, change: (value:string)=>void}){
    return(
        <div className="input-template">
            <label htmlFor={id}>{label}</label>
            <textarea className="book-input-field" id={id}  placeholder={placeHolderText} onChange={(v)=>{change(v.target.value);}}></textarea>
        </div>
    )
}

export default InputTemplate