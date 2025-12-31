# Personal Documentation

Chào mừng đến với tài liệu cá nhân của tôi. Tài liệu này bao gồm các chủ đề về kiến trúc phần mềm và cơ sở dữ liệu.

## 📚 Nội dung

### IELTS

- [IELTS Writing] (ielts/writing-test2-templates.md)

### Github

- [Github Overview](github/github.md)

### Micro-monolith

Tìm hiểu về kiến trúc Micro-monolith - một cách tiếp cận cân bằng giữa monolith và microservices.

- [Architecture Overview](micro-monolith/architecture.md)

### Database

Hướng dẫn và best practices về cơ sở dữ liệu.

- [PostgreSQL Updates](database/update-postgresql.md)

### Productivity

- [Productivity](productivity/document-summary.md)

### Visual Studio Code

- [Visual Studio Code](vscode/vscode-setup.md)

## 🚀 Quick Links

- [GitHub Repository](https://github.com/ricardotran92/docs)

---

*Tài liệu này được xây dựng bằng [MkDocs](https://www.mkdocs.org/) và [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).*


## Syntax
```
$ python -m mkdocs serve --dev-addr=0.0.0.0:8888
```

## Edit system file

Đúng vậy, quy trình chuẩn khi làm việc với MkDocs là như sau (để đảm bảo thay đổi được áp dụng đúng cách và không bị mất khi build lại):

### 1. **Edit source files (không edit built files)**
   - Bạn nên edit file nguồn trong thư mục docs (ví dụ: custom.js), **không phải** file đã build trong site (như custom.js).
   - Lý do: File trong site là output của MkDocs (được generate từ source), nên nếu bạn edit trực tiếp custom.js, thay đổi sẽ bị ghi đè khi bạn chạy `mkdocs build` hoặc khi server tự động rebuild.

### 2. **Rebuild site sau khi edit**
   - Sau khi edit source (ví dụ: thêm/chỉnh sửa hàm `docTiengTrung` trong custom.js), bạn cần rebuild để MkDocs copy và process file đó vào site.
   - Lệnh: `mkdocs build` (như bạn đã làm).

### 3. **Sử dụng `mkdocs serve` cho development**
   - Trong môi trường development, bạn có thể chạy `mkdocs serve` (như bạn đang làm trên terminal "mkdocs").
   - MkDocs thường tự động detect thay đổi trong source files và rebuild/reload page. Tuy nhiên:
     - Đối với JavaScript/CSS (extra_javascript/extra_css), đôi khi cần manual `mkdocs build` hoặc restart server để chắc chắn.
     - Nếu page không reload tự động, bạn có thể refresh browser hoặc chạy lại `mkdocs build` trong terminal khác.

### Quy trình cụ thể cho trường hợp này:
- **Bước 1:** Edit custom.js (thêm hàm `docTiengTrung` như tôi đã làm).
- **Bước 2:** Chạy `mkdocs build` để update custom.js.
- **Bước 3:** Nếu `mkdocs serve` đang chạy, page sẽ tự động reload. Nếu không, refresh browser tại `localhost:8001`.

Nếu bạn edit custom.js trực tiếp (như hiện tại), thay đổi sẽ hoạt động tạm thời, nhưng sẽ bị mất khi build lại. Để tránh, hãy chuyển sang edit source file nhé! Nếu cần thêm gì khác, tôi có thể giúp. 😊