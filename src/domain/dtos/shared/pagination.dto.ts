


export class PaginationDto
{
    private constructor(
        public readonly page: number,
        public readonly limit: number
    ){}


    static create(page: number=1, limit: number = 10):[string?, PaginationDto?] 
    {

        if(isNaN(page) || isNaN(limit)) return ['Page And Limit Must Be Numbers'];

        if(page <= 0) return ['Page Must Be Greater Than 0'];
        if(limit <= 0) return ['Limit Must Be Greater Than 0'];

        return [undefined, new PaginationDto(page, limit)];

    }

}