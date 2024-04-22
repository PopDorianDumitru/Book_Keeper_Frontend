

export interface BookReview{
    ID: string,
    content: string, 
    bookId: string,
    rating: number,
    username: string,
    userId: string
}

export interface DirtyBookReview{
    ID: string,
    content: string, 
    bookId: string,
    rating: number,
    username: string,
    userId: string,
}
