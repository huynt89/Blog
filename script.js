document.addEventListener('DOMContentLoaded', () => {
    // Duyệt qua database để load từng file bài viết
    if (typeof postDatabase !== 'undefined') {
        postDatabase.forEach(filePath => {
            const script = document.createElement('script');
            script.src = filePath;
            document.body.appendChild(script);
        });
    }
});

// Hàm này sẽ được gọi tự động khi các file data_xxx.js được tải xong
function renderPost(data) {
    const grid = document.getElementById(`grid-${data.category}`);
    if (!grid) return;

    const postHtml = `
        <div class="post-card">
            <img src="Pages/${data.category}/img/${data.image}" alt="${data.title}">
            <div class="post-card-content">
                <h3>${data.title}</h3>
                <p>${data.content}</p>
                <span class="post-meta">Ngày: ${data.date} | Mục: ${data.category}</span>
            </div>
        </div>
    `;
    grid.innerHTML += postHtml;
}