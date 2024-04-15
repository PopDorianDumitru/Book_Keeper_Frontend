import {create} from 'zustand'
import {persist,  createJSONStorage} from 'zustand/middleware'
import { BookReview } from '../interfaces/BookReviewInterface'


interface BookReviewState{
    bookReviews: BookReview[];
    addBookReview: (review: BookReview)=>void;
    removeBookReview: (id: string)=>void;
    updateBookReview: (id: string, updatedReview: BookReview)=>void;
}

const useBookReviewStore = create<BookReviewState>()(
    persist(
        (set,get)=>(
            {
                bookReviews: [],
                addBookReview: (review)=> set({bookReviews: [...get().bookReviews, review]}),
                removeBookReview: (id) => set({bookReviews: get().bookReviews.filter(b=>b.ID !== id)}),
                updateBookReview: (id, updatedReview) => set({bookReviews: get().bookReviews.map(review=>{
                    if(review["ID"] !== id)
                        return review;
                    return updatedReview;
                })})
            }
        ),
        {
            name: 'book-review-storage',
            storage: createJSONStorage(()=>localStorage)
        }
    )
)

export default useBookReviewStore