document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('blog-grid');
    const filters = document.querySelectorAll('#nav-filters li');
    
    // Kiểm tra xem data có tồn tại không (biến blogPosts từ file js/blog_data.js)
    if (typeof blogPosts === 'undefined' || !blogPosts) {
        grid.innerHTML = '<p class="loading">Chưa có bài viết nào. Hãy vào trang Admin để thêm.</p>';
        return;
    }

    // Sắp xếp bài viết mới nhất lên đầu
    const sortedPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    function renderPosts(category) {
        grid.innerHTML = '';
        
        const filtered = category === 'all' 
            ? sortedPosts 
            : sortedPosts.filter(post => post.category === category);

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center">Không có bài viết nào trong mục này.</p>';
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="card-body">
                    <span class="card-tag">${post.category}</span>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-desc">${post.content}</p>
                    <div class="card-date"><i class="far fa-clock"></i> ${new Date(post.date).toLocaleDateString('vi-VN')}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Init
    renderPosts('all');

    // Filter Logic
    filters.forEach(item => {
        item.addEventListener('click', () => {
            filters.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderPosts(item.getAttribute('data-filter'));
        });
    });
});