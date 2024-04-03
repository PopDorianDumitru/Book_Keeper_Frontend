import BookForm from './formTemplate';
import { Book } from '../interfaces/BooksInterface';
import { Link } from 'react-router-dom';
import '../css/MainPage.css'

function MainPage(){
    return(
        <div className='main-page'>
            <BookForm></BookForm>
            <Link to={'/'} className='page-link'>Display Books</Link>
        </div>
    )
}

export default MainPage

