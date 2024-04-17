import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Book} from '../interfaces/BooksInterface'

interface BookReview{
    user: string,
    review: string,
}

interface BookState{
    books: Book[];
    bookReviews: BookReview[];
    checkmarkedBooks: string[];
    sortingFields: string[];
    setBooks: (books: Book[])=>void;
    addBook: (book: Book)=>void;
    removeBook: (id: string)=>void;
    addCheckmarkedBook: (id: string)=>void;
    removeCheckmarkedBook: (id: string)=>void;
    deleteCheckmarkedBooks: ()=>void;
    updateBook: (id: string, updatedBook: Book)=>void;
    addBookReview: (review: BookReview)=>void;
    addSortingField: (field: string)=>void;
    removeSortingField: (field: string)=>void;
    
}

const useBookStore = create<BookState>()(
    persist(
        (set,get)=>({
            books: [],
            bookReviews: [],
            sortingFields:[],
            addSortingField: (field)=> set({sortingFields: [...get().sortingFields, field]}),
            removeSortingField: (field)=> set({sortingFields: get().sortingFields.filter(f=>f !== field)}),

            checkmarkedBooks: [],
            addBookReview: (review)=> set({bookReviews: [...get().bookReviews, review]}),
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