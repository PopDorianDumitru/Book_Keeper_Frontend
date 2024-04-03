import '../css/InputTemplate.css'

function InputTemplate({id, label, type, placeHolderText, change} : {id: string, label: string, type: string, placeHolderText: string, change: (value:string)=>void}){
    return(
        <div className="input-template">
            <label htmlFor={id}>{label}</label>
            <input className="book-input-field" id={id} type={type} placeholder={placeHolderText} onChange={(v)=>{change(v.target.value);}}></input>
        </div>
    )
}

export default InputTemplate