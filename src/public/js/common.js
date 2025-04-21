// 公共方法：带认证的fetch
window.fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // 自动添加Authorization头
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  return fetch(url, { ...options, headers });
};

// 获取当前用户
window.getCurrentUser = async () => {
  try {
    const res = await fetchWithAuth('/api/auth/me');
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('获取用户失败:', error);
    return null;
  }
};

// 初始化用户状态
async function initAuthState() {
  const token = localStorage.getItem('token');
  const userProfile = document.getElementById('userProfile');
  const userStatus= document.getElementById('userStatus');

  if (token) {
    try {
      const user = await getCurrentUser();
      if (user) {
        showUserProfile(user);
        userStatus.style.display = 'none';
        userProfile.style.display = 'flex';
      }

    } catch (error) {
      console.error('自动登录失败:', error);
      logout();
    }
  }
}

// 显示用户信息
function showUserProfile(user) {
  document.getElementById('username').textContent = user.username;
  // 可以扩展显示头像等其他信息
  // document.getElementById('avatar').src = user.avatar_url || 'default-avatar.jpg';
}


// 页面加载时初始化
window.addEventListener('DOMContentLoaded', initAuthState);

// 使用refresh token自动续期
async function refreshToken() {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include'
  });
  const { token } = await res.json();
  localStorage.setItem('token', token);
}

//if (token && isTokenExpired(token)) {
//  try {
//    const newToken = await refreshToken();
//    localStorage.setItem('token', newToken);
//  } catch {
//    logout();
//  }
//}

//用户退出
window.logout = () => {
  localStorage.removeItem('token');
  
  // 清除可能的缓存数据
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
    });
  });

  // 立即跳转并刷新
  window.location.href = '/login.html?logout=1';
};