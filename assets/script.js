// Khởi tạo mảng bài viết nếu chưa có
if (!window.techPosts) {
    window.techPosts = [];
}

function renderPosts(filter = 'All') {
    const container = document.getElementById('post-container');
    container.innerHTML = '';

    const filtered = filter === 'All' 
        ? window.techPosts 
        : window.techPosts.filter(p => p.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = '<p>Chưa có bài viết nào trong mục này.</p>';
        return;
    }

    filtered.forEach(post => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">
            <div class="card-body">
                <span class="category-tag">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>${post.date}</small>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat) {
    renderPosts(cat);
}

// Chạy khi trang web load xong
window.onload = () => renderPosts('All');