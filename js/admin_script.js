// Mẹo bảo mật: Đọc token từ URL (ví dụ: admin.html?key=ghp_xxx)
// Như vậy bạn chỉ cần lưu link này vào Bookmark điện thoại, không bao giờ phải nhập lại.
const urlParams = new URLSearchParams(window.location.search);
const secretKey = urlParams.get('key');

document.getElementById('admin-form').onsubmit = async (e) => {
    e.preventDefault();
    if (!secretKey) return alert("Thiếu khóa truy cập!");

    const btn = document.getElementById('btn-submit');
    const msg = document.getElementById('msg');
    btn.disabled = true;
    msg.innerText = "Đang gửi dữ liệu tới GitHub Actions...";

    const file = document.getElementById('image').files[0];
    const reader = new FileReader();
    
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        const postId = Date.now();
        const imageName = `${postId}_${file.name}`;

        const payload = {
            event_type: "create_post",
            client_payload: {
                post_id: postId,
                image_name: imageName,
                image_base64: base64Image,
                post_data: {
                    title: document.getElementById('title').value,
                    category: document.getElementById('category').value,
                    content: document.getElementById('content').value,
                    image: `img/${imageName}`,
                    date: new Date().toISOString()
                }
            }
        };

        // Gửi tín hiệu kích hoạt GitHub Action
        try {
            const res = await fetch(`https://api.github.com/repos/huynt89/Blog/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                msg.innerText = "Lệnh đã gửi! Chờ Action xử lý trong 30s...";
                document.getElementById('admin-form').reset();
            } else {
                msg.innerText = "Lỗi xác thực hoặc API.";
            }
        } catch (err) {
            msg.innerText = "Lỗi kết nối.";
        } finally {
            btn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
};