import {create} from 'zustand'
import {persist,  createJSONStorage} from 'zustand/middleware'
import { BookReview } from '../interfaces/BookReviewInterface'
import useAxiosStore from './axiosStore';


interface BookReviewState{
    bookReviews: BookReview[];
    page: number;
    dirtyBookReviews: BookReview[];
    addBookReview: (review: BookReview)=>void;
    addDirtyBookReview: (review: BookReview)=>void;
    removeBookReview: (id: string)=>void;
    updateBookReview: (id: string, updatedReview: BookReview)=>void;
    resetDirtyBookReviews: ()=>void;   
    saveDirtyBookReviews: ()=>void;
    getPage: ()=>number;
    increasePage: ()=>void;
    decreasePage: ()=>void;
    resetPage: ()=>void;
    setBookReviews: (reviews: BookReview[])=>void;
}

const useBookReviewStore = create<BookReviewState>()(
    persist(
        (set,get)=>(
            {
                bookReviews: [],
                dirtyBookReviews: [],
                page: 0,
                setBookReviews: (reviews)=>set({bookReviews: reviews}),
                resetPage: ()=>set({page: 0}),
                getPage: ()=>get().page,
                increasePage: ()=>set({page: get().page + 1}),
                decreasePage: ()=>set({page: get().page - 1}),
                addBookReview: (review)=> set({bookReviews: [...get().bookReviews, review]}),
                addDirtyBookReview: (review)=> set({dirtyBookReviews: [...get().dirtyBookReviews, review]}),

                saveDirtyBookReviews: ()=> {
                    const {getAxiosInstance} = useAxiosStore.getState();
                    get().dirtyBookReviews.forEach(review=>{
                        getAxiosInstance().post("/reviews", review).then(()=>{
                            console.log("Dirty book review saved");
                        })
                        .catch(()=>{
                            console.log("Error in saving dirty book reviews");
                        })
                    })
                    get().resetDirtyBookReviews();
                },
                
                resetDirtyBookReviews: ()=> set({dirtyBookReviews: []}),
                
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