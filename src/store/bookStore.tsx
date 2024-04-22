import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Book, DirtyBook} from '../interfaces/BooksInterface'
import useAxiosStore from './axiosStore';

interface BookReview{
    user: string,
    review: string,
}

interface BookState{
    books: Book[];
    dirtyBooks: DirtyBook[];
    bookReviews: BookReview[];
    checkmarkedBooks: string[];
    sortingFields: string[];
    setBooks: (books: Book[])=>void;
    addDirtyBook: (book: DirtyBook)=>void;
    saveDirtyBooks: ()=>void;
    addBook: (book: Book)=>void;
    removeBook: (id: string)=>void;
    addCheckmarkedBook: (id: string)=>void;
    removeCheckmarkedBook: (id: string)=>void;
    deleteCheckmarkedBooks: ()=>void;
    updateBook: (id: string, updatedBook: Book)=>void;
    addBookReview: (review: BookReview)=>void;
    addSortingField: (field: string)=>void;
    removeSortingField: (field: string)=>void;
    resetDirtyBooks: ()=>void;
    syncBooks: ()=>void;
    getBookById: (id: string)=>Book|undefined;
    getDirtyBookById: (id: string)=>DirtyBook|undefined;
    getBooks: ()=>Book[];
    getDirtyBooks: ()=>DirtyBook[];
    setDirtyBookById: (ID: string,dirtyBooks: DirtyBook)=>void;
}   

const useBookStore = create<BookState>()(
    persist(
        (set,get)=>({
            books: [],
            bookReviews: [],
            sortingFields:[],
            dirtyBooks: [],
            getBooks: ()=> get().books,
            getDirtyBooks: ()=> get().dirtyBooks,
            addSortingField: (field)=> set({sortingFields: [...get().sortingFields, field]}),
            removeSortingField: (field)=> set({sortingFields: get().sortingFields.filter(f=>f !== field)}),
            getBookById: (id: string)=> get().books.find(b=>b.ID === id),
            getDirtyBookById: (id: string)=> get().dirtyBooks.find(b=>b.ID === id),
            syncBooks: ()=>{
                const {getAxiosInstance} = useAxiosStore.getState();
                getAxiosInstance().get("/books").then((response)=>{
                    set({books: response.data});
                })
                .catch((error)=>{
                    console.log("Error in getting books from the server");
                })
            },

            resetDirtyBooks: ()=> set({dirtyBooks: []}),
            setDirtyBookById: (ID, dirtyBook)=> set({dirtyBooks: get().dirtyBooks.map((book)=>{
                if(book.ID !== ID)
                    return book;
                return dirtyBook;
            })}),
            addDirtyBook: (book)=> set({dirtyBooks: [...get().dirtyBooks, book]}),
            saveDirtyBooks: ()=> {
                const {getAxiosInstance} = useAxiosStore.getState();
                get().dirtyBooks.forEach((dbook)=>{
                    if(!dbook.existed && !dbook.deleted)
                    {
                        getAxiosInstance().post("/books", dbook).then((response)=>{
                        })
                        .catch((error)=>{
                            console.log("Error in saving dirty book");
                        })
                    }
                    if(dbook.existed && dbook.deleted)
                    {
                        getAxiosInstance().delete(`/books/${dbook.ID}`).then((response)=>{
                            console.log("Deleted dirty book");
                        })
                        .catch((error)=>{
                            console.log("Error in deleting dirty book");
                        })
                    }
                    if(dbook.existed && !dbook.deleted)
                    {
                        const book:Partial<Book> = {
                            title: dbook.title,
                            language: dbook.language,
                            author: dbook.author,
                            year: dbook.year
                        };
                        getAxiosInstance().patch(`/books/${dbook.ID}`, book).then((response)=>{
                            console.log("Updated dirty book");
                        })
                        .catch((error)=>{
                            console.log(error);
                        })
                    }
                })
                get().resetDirtyBooks();
                get().syncBooks();
            },
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