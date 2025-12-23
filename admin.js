document.getElementById('uploadBtn').addEventListener('click', async () => {
    const token = document.getElementById('token').value;
    const repo = document.getElementById('repo').value; // Định dạng: username/repo-name
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value;
    const summary = document.getElementById('summary').value;
    const date = new Date().toISOString().split('T')[0];
    const status = document.getElementById('status');

    if(!token || !repo || !title) return alert("Vui lòng điền đủ thông tin!");

    status.innerText = "Đang xử lý...";

    // 1. Tạo tên file và nội dung file bài viết
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const fileName = `data${category}_${slug}_${date}.js`;
    const filePath = `Pages/${category}/${fileName}`;
    const fileContent = `renderPost({
        title: "${title}",
        category: "${category}",
        image: "${image}",
        summary: "${summary.replace(/\n/g, ' ')}",
        date: "${date}"
    });`;

    try {
        // HÀM 1: TẠO FILE BÀI VIẾT MỚI
        await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Thêm bài viết: ${title}`,
                content: btoa(unescape(encodeURIComponent(fileContent)))
            })
        });

        // HÀM 2: CẬP NHẬT DATABASE.JS
        // Lấy file database.js hiện tại để lấy mã SHA (bắt buộc của GitHub)
        const dbRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.js`);
        const dbData = await dbRes.json();
        const currentContent = decodeURIComponent(escape(atob(dbData.content)));
        
        // Thêm đường dẫn mới vào mảng
        const newDbContent = currentContent.replace('];', `    "${filePath}",\n];`);

        await fetch(`https://api.github.com/repos/${repo}/contents/database.js`, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Update database cho bài: ${title}`,
                content: btoa(unescape(encodeURIComponent(newDbContent))),
                sha: dbData.sha
            })
        });

        status.innerText = "Thành công! Web sẽ cập nhật sau 1-2 phút.";
        status.style.color = "green";
    } catch (err) {
        status.innerText = "Lỗi: " + err.message;
        status.style.color = "red";
    }
});