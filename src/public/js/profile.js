// 初始化加载用户数据
async function initProfile() {
  try {
    const res = await fetchWithAuth('/api/users/me', {
    //确保前端在请求时添加 Authorization 头
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    });
    if (!res.ok) throw new Error('获取用户信息失败profile');
    
    const { data } = await res.json();
    
    // 填充表单数据
    document.forms.profileForm.username.value = data.username;
    document.forms.profileForm.email.value = data.email;
    document.forms.profileForm.phone.value = data.phone || '';
    document.getElementById('avatarPreview').src = data.avatar_url;

  } catch (error) {
    alert(error.message);
    window.location.href = '/login.html';
  }
}

// 更新个人信息
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    username: e.target.username.value,
    email: e.target.email.value,
    phone: e.target.phone.value
  };

  try {
    const res = await fetchWithAuth('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || '更新失败');
    }

    alert('信息更新成功');
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
});

// 修改密码处理
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    oldPassword: e.target.oldPassword.value,
    newPassword: e.target.newPassword.value
  };

  try {
    const res = await fetchWithAuth('/api/users/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    alert('密码修改成功，请重新登录');
    logout();
  } catch (error) {
    alert(error.message);
  }
});

// 头像上传功能
async function uploadAvatar() {
  const fileInput = document.getElementById('avatarUpload');
  const file = fileInput.files[0];
  
  if (!file) return alert('请选择图片文件');
  
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res = await fetchWithAuth('/api/users/avatar', {
      method: 'POST',
      body: formData
    });

    const { data } = await res.json();
    document.getElementById('avatarPreview').src = data.avatar_url;
    alert('头像更新成功');
  } catch (error) {
    alert('头像上传失败');
  }
}

// 初始化页面
window.addEventListener('DOMContentLoaded', initProfile);