async function fetchPosts() {
    const container = document.getElementById('post-container');
    try {
        // Load file danh mục được tạo bởi Github Action
        const response = await fetch('database.json');
        const data = await response.json();
        
        // Sắp xếp bài mới nhất lên đầu
        const posts = data.posts.reverse();

        for (const path of posts) {
            // Nhúng script của từng bài viết
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = path;
                script.onload = () => {
                    const post = window.lastLoadedPost;
                    container.innerHTML += `
                        <article class="post-card">
                            <img src="${post.image}" alt="thumb">
                            <h3>${post.title}</h3>
                            <p>${post.summary.substring(0, 100)}...</p>
                        </article>
                    `;
                    resolve();
                };
                document.body.appendChild(script);
            });
        }
    } catch (e) {
        console.log("Chưa có dữ liệu bài viết.");
    }
}
fetchPosts();