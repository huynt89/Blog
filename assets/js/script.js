/**
 * Tech Blog Engine - Client Side
 * Xử lý đọc danh mục bài viết và render giao diện dynamic
 */

async function initBlog() {
    const postContainer = document.getElementById('post-container');
    
    try {
        // 1. Tải danh sách các tệp tin bài viết từ file database.json (do Action tạo ra)
        const response = await fetch('database.json');
        
        if (!response.ok) {
            postContainer.innerHTML = "<p>Chào mừng! Hiện chưa có bài viết nào được xuất bản.</p>";
            return;
        }

        const data = await response.json();
        const postPaths = data.posts || [];

        // 2. Duyệt qua từng đường dẫn bài viết
        for (const path of postPaths) {
            await renderSinglePost(path, postContainer);
        }

    } catch (error) {
        console.error("Lỗi khởi tạo blog:", error);
        postContainer.innerHTML = "<p>Hệ thống đang bảo trì, vui lòng quay lại sau.</p>";
    }
}

/**
 * Hàm load dynamic script của từng bài viết và render HTML
 */
function renderSinglePost(path, container) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        // Thêm tham số query để tránh trình duyệt cache file cũ khi bạn cập nhật bài viết
        script.src = `${path}?v=${Date.now()}`;
        
        script.onload = () => {
            // Lấy dữ liệu từ biến toàn cục window.lastLoadedPost trong file .js của bài viết
            const post = window.lastLoadedPost;
            
            if (post) {
                const postHTML = `
                    <article class="post-card">
                        <div class="post-thumb">
                            <img src="${post.image}" alt="${post.title}" loading="lazy" 
                                 onerror="this.src='https://via.placeholder.com/300x160?text=No+Image'">
                        </div>
                        <div class="post-body">
                            <span class="post-category-tag">${post.category}</span>
                            <h3>${post.title}</h3>
                            <p>${post.summary.substring(0, 120)}...</p>
                            <div class="post-footer">
                                <span class="post-date">${formatDate(post.date)}</span>
                                <a href="#" class="read-more">Xem thêm</a>
                            </div>
                        </div>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', postHTML);
            }
            
            // Xóa biến tạm sau khi render để tránh xung đột bài tiếp theo
            window.lastLoadedPost = null;
            // Xóa script tag sau khi load xong để giữ DOM sạch sẽ
            script.remove();
            resolve();
        };

        script.onerror = () => {
            console.warn(`Không thể tải bài viết tại: ${path}`);
            resolve(); // Vẫn resolve để tiếp tục load các bài khác
        };

        document.body.appendChild(script);
    });
}

/**
 * Hàm định dạng ngày tháng kiểu Việt Nam
 */
function formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('vi-VN', options);
}

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initBlog);