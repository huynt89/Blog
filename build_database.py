import os

def build_db():
    output_file = "assets/database.js"
    content = "window.techPosts = window.techPosts || [];\n"
    
    if not os.path.exists("Pages"):
        return

    for root, dirs, files in os.walk("Pages"):
        for file in files:
            if file.endswith(".js") and file.startswith("data"):
                with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                    file_content = f.read().replace("window.techPosts = [];", "")
                    content += file_content + "\n"
    
    os.makedirs("assets", exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    build_db()