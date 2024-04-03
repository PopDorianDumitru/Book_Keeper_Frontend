import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Book} from '../interfaces/BooksInterface'

interface BookState{
    books: Book[];
    checkmarkedBooks: string[];
    setBooks: (books: Book[])=>void;
    addBook: (book: Book)=>void;
    removeBook: (id: string)=>void;
    addCheckmarkedBook: (id: string)=>void;
    removeCheckmarkedBook: (id: string)=>void;
    deleteCheckmarkedBooks: ()=>void;
    updateBook: (id: string, updatedBook: Book)=>void;
    
}

const useBookStore = create<BookState>()(
    persist(
        (set,get)=>({
            books: [],
            checkmarkedBooks: [],
            addBook: (book)=> set({books: [...get().books, book]}),
            setBooks: (books) => set({books}),
            removeBook: (id) => set({books: get().books.filter(b=>b.ID !== id)}),
            addCheckmarkedBook: (id) => set({checkmarkedBooks: [...get().checkmarkedBooks, id]}),
            removeCheckmarkedBook: (id) => set({checkmarkedBooks: get().checkmarkedBooks.filter(b=>b !== id)}),
            deleteCheckmarkedBooks: () => set({
                books: get().books
                        .filter(book=>get().checkmarkedBooks.findIndex((b)=>b === book.ID) === -1), 
                checkmarkedBooks: []
            }),
            updateBook: (id, updatedBook) => set({books: get().books.map(book=>{
                if(book["ID"] !== id)
                    return book;
                return updatedBook;
            })
        })
        }),
        {
            name: 'book-storage',
            storage: createJSONStorage(()=>localStorage)
        }
    )
)

export default useBookStore