import { ProductModel } from "../../data";
import {  CreateProductDto, CustomError, PaginationDto } from "../../domain";



export class ProductService
{
    // DI
    constructor(){}

    async createProduct(createProductDto: CreateProductDto)
    {
        const productExist = await ProductModel.findOne({name: createProductDto.name});
        if(productExist) throw CustomError.badRequest('Product Already Exists');
        try {            
            const product = new ProductModel(createProductDto);
            await product.save();
            return product;
        } catch (error) {
          throw CustomError.internalServer(`${error}`);   
        }
    }

    async getProducts(paginationDto: PaginationDto)
    {
        const {page, limit} = paginationDto;
        try {
            
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip( (page - 1 ) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
                    // .populate('user','name email')
            ]);

            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            // .skip( (page - 1 ) * limit)
            // .limit(limit)

            return {
                page:page,
                limit: limit,
                total: total,
                next: `/api/products?page=${(page+1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/products?page=${(page-1)}&limit=${limit}`: null,
                products: products
            };

        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }

    }
}