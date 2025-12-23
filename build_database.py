import os

def build_db():
    output_file = "assets/database.js"
    content = "window.techPosts = [];\n"
    
    # Duyệt qua các thư mục trong Pages
    pages_dir = "Pages"
    for root, dirs, files in os.walk(pages_dir):
        for file in files:
            if file.endswith(".js") and file.startswith("data"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    # Đọc nội dung file và bỏ qua dòng khởi tạo mảng nếu có
                    file_content = f.read()
                    content += file_content + "\n"
    
    # Tạo thư mục assets nếu chưa có
    if not os.path.exists("assets"):
        os.makedirs("assets")
        
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("Đã cập nhật database.js thành công!")

if __name__ == "__main__":
    build_db()