

export class CreateCategoryDto
{

    private constructor(
        public name: string,
        public available: boolean,        
    ){}


    static create(object: {[key: string]: any}): [string?, CreateCategoryDto?] {

        const {name, available = false} = object;
        let availableBool = available;
        if(!name) return ['Missing name'];

        if(typeof available !== 'boolean'){
            availableBool = (available === 'true')            
        }
        return [undefined, new CreateCategoryDto(name, availableBool)];

    }

}