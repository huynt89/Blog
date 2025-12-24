async function submitPost() {
    const status = document.getElementById('status');
    const token = document.getElementById('token').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const summary = document.getElementById('summary').value;
    const imageFile = document.getElementById('image').files[0];

    if (!token || !title || !imageFile) return alert("Vui lòng điền đủ thông tin!");

    status.innerText = "Đang xử lý ảnh...";
    
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        
        // Tạo cấu trúc JSON để Action xử lý
        const payload = {
            title: title,
            category: category,
            summary: summary,
            image_data: base64Image,
            timestamp: Date.now()
        };

        const fileName = `request_${Date.now()}.json`;
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

        status.innerText = "Đang tải lên GitHub...";

        const url = `https://api.github.com/repos/huynt89/Blog/contents/requests/${fileName}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `New post request: ${title}`,
                content: content
            })
        });

        if (response.ok) {
            status.innerText = "Thành công! Chờ 1 phút để hệ thống xử lý...";
            status.style.color = "green";
        } else {
            status.innerText = "Lỗi: Kiểm tra lại Token hoặc tên Repo.";
            status.style.color = "red";
        }
    };
}