

export interface Book{
    ID: string,
    title: string,
    author: string,
    language: string,
    year: number
}


export interface DirtyBook{
    ID: string,
    title: string,
    author: string,
    language: string,
    year: number,
    existed: boolean,
    deleted: boolean
}

