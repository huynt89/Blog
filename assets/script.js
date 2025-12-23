// Khởi tạo nếu file database.js chưa tồn tại hoặc trống
if (!window.techPosts) {
    window.techPosts = [];
}

function renderPosts(filter = 'All') {
    const container = document.getElementById('post-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = filter === 'All' 
        ? window.techPosts 
        : window.techPosts.filter(p => p.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Chưa có bài viết nào.</p>';
        return;
    }

    // Đảo ngược để bài mới nhất lên đầu
    [...filtered].reverse().forEach(post => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/400x225?text=TechNews'">
            <div class="card-body">
                <span class="category-tag">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 120)}...</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                    <small style="color:#999">${post.date}</small>
                    <a href="#" style="color:#007bff; text-decoration:none; font-weight:bold; font-size:14px;">Xem thêm</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat) {
    renderPosts(cat);
}

window.onload = () => renderPosts('All');