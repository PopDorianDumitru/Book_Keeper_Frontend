import { BookReview } from "../interfaces/BookReviewInterface";
import '../css/ReviewDisplay.css'
import { ForwardedRef, forwardRef } from "react";
function ReviewDisplay({bookReview, ref}: {bookReview: BookReview, ref:React.ForwardedRef<unknown>})
{
    return (
        <div key={bookReview.ID} ref={ref as ForwardedRef<HTMLDivElement> | null} className="review-display">
            <h2>{bookReview.username}</h2>
            <h3> Rating: {bookReview.rating}</h3>
            <pre>{bookReview.content}</pre>
        </div>
    )
}

const ReviewDisplayComponent = forwardRef(({bookReview} : {bookReview: BookReview}, ref)=>{
    return ReviewDisplay({bookReview, ref});
})

export default ReviewDisplayComponent;