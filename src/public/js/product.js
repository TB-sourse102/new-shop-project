// 获取URL中的商品ID
const getProductId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

// 加载商品数据
const loadProduct = async () => {
  try {
    const productId = getProductId();
    if (!productId) throw new Error('商品ID无效');

    const res = await fetch(`/api/products/${productId}`);
    const { data } = await res.json();

    if (!res.ok) throw new Error(data.message || '加载失败');

    // 填充数据
    document.getElementById('productName').textContent = data.name;
    document.getElementById('productPrice').textContent = `¥${data.price}`;
    document.getElementById('productStock').textContent = 
      data.stock > 0 ? `库存：${data.stock}件` : '暂时缺货';
    document.getElementById('productDescription').innerHTML = data.description;
    document.getElementById('productImage').src = data.main_image;

    // 加载推荐商品
    loadRecommendations(data.category_id);
  } catch (error) {
    alert(error.message);
    window.location.href = '/';
  }
};

// 加载推荐商品
const loadRecommendations = async (categoryId) => {
  try {
    const res = await fetch(`/api/products?category=${categoryId}&limit=4`);
    const { data } = await res.json();
    
    const container = document.getElementById('recommendedGrid');
    container.innerHTML = data.map(product => `
      <div class="product-card">
        <a href="/product.html?id=${product.id}">
          <img src="${product.main_image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">¥${product.price.toFixed(2)}</p>
        </a>
      </div>
    `).join('');
  } catch (error) {
    console.error('推荐商品加载失败:', error);
  }
};

// 加入购物车
const addToCart = async () => {
  const quantity = parseInt(document.getElementById('quantity').value);
  try {
    await fetchWithAuth('/api/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: getProductId(),
        quantity
      })
    });
    alert('已加入购物车');
  } catch (error) {
    alert(error.message);
  }
};

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  checkFavoriteStatus();
});