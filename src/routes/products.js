import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// 获取推荐商品
router.get('/recommended', productController.getRecommended);

// 商品详情路由
router.get('/:id', productController.getProductDetail);
    
//   const products = results.map(product => ({
//     ...product,
//     price: Number(product.price),
//     main_image: product.main_image || '/images/default-product.png'
//    }));






export default router;