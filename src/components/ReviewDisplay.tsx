import { BookReview } from "../interfaces/BookReviewInterface";
import '../css/ReviewDisplay.css'
function ReviewDisplay({bookReview}: {bookReview: BookReview})
{

    return (
        <div className="review-display">
            <h2>{bookReview.username}</h2>
            <h3> Rating: {bookReview.rating}</h3>
            <pre>{bookReview.content}</pre>
        </div>
    )
}

export default ReviewDisplay;