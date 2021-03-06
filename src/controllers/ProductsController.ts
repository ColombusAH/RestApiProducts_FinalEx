import productService from '../services/Products.Service';
import categeoryService from '../services/Categories.Service';
import { OK, CREATED, NO_CONTENT } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors';
import Category from '../models/categoriesModel';

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await productService.getProducts();
    res.status(OK).send(products);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = (await categeoryService.getCategories()) as Category[];
    const category = categories.find(
      c => c.id.localeCompare(req.body.categoryId) == 0
    );
    if (!category) {
      throw new NotFoundError('Category not exist for the given product');
    }
    const addedProduct = await productService.addProduct(req.body);
    res.status(CREATED).send(addedProduct);
  } catch (error) {
    next(error);
  }
}

async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.findProductById(req.params.id);
    if (product) {
      res.status(OK).send(product);
    } else {
      throw new NotFoundError('no such Product');
    }
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const product = await productService.updateProduct(id, req.body);
    if (!product) {
      throw new NotFoundError('product not found');
    } else {
      res.status(OK).send(product);
    }
  } catch (error) {
    next(error);
  }
}
async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const removed = await productService.removeProduct(req.params.id);
    if (removed == true) {
      res.status(NO_CONTENT).send('product removed');
    } else {
      throw new NotFoundError('product not found');
    }
  } catch (error) {
    next(error);
  }
}
const productController = {
  findAll,
  create,
  findById,
  update,
  remove
};
export default productController;
