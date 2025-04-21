import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export default {
  // 获取推荐商品
  getRecommended: async (req, res) => {
    try {
      const products = await Product.getRecommended();
      successResponse(res, products);
    } catch (error) {
      errorResponse(res, 500, '获取推荐商品失败');
    }
  },

  // 获取商品详情
  getProductDetail: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      product ? 
        successResponse(res, product) :
        errorResponse(res, 404, '商品不存在');
    } catch (error) {
      errorResponse(res, 500, '获取商品详情失败');
    }
  }
}