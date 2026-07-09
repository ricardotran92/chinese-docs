Updated todo list

Dưới đây là cách làm cụ thể để bạn thấy prompt user/password hoạt động đúng.

1. Chấp nhận một điểm quan trọng: URL [https://ricardotran92.github.io/chinese-docs/](https://ricardotran92.github.io/chinese-docs/) sẽ không hiện prompt. Đây là origin GitHub Pages trực tiếp, còn lớp Basic Auth tôi thêm ở cloudflare/basic-auth/src/worker.js chỉ chạy khi request đi qua Cloudflare/custom domain.

2. Tạo hoặc dùng một custom domain trong Cloudflare. Ví dụ `docs.yourdomain.com`. Nếu bạn chưa có domain riêng và DNS trên Cloudflare thì bước này là bắt buộc, vì Worker chỉ chặn được ở edge.

3. Trong Cloudflare, tạo route cho Worker:
   - Vào Workers and Pages.
   - Chọn Worker vừa tạo.
   - Gắn route kiểu `docs.yourdomain.com/*`.
   - Đảm bảo route này trỏ đúng vào Worker Basic Auth.

4. Khai báo secrets cho Worker:
   - `BASIC_AUTH_USER = admin`
   - `BASIC_AUTH_PASSWORD = admin`
   - `ORIGIN_BASE_URL = https://ricardotran92.github.io/chinese-docs`
   
   Phần cấu hình mẫu nằm ở cloudflare/basic-auth/wrangler.toml, còn ghi chú setup ở cloudflare/basic-auth/README.md.

5. Deploy Worker lên Cloudflare bằng Wrangler.
   - Nếu bạn dùng CLI, deploy thư mục cloudflare/basic-auth thay vì repo MkDocs.
   - Mục tiêu là Worker phải chạy trước khi request tới origin GitHub Pages.

6. Mở site bằng custom domain, không mở bằng `github.io`.
   - Ví dụ: `https://docs.yourdomain.com/`
   - Lần đầu truy cập phải hiện hộp nhập user/password.
   - Nhập `admin / admin` thì mới vào được.

7. Test nhanh để biết mọi thứ đúng:
   - Private window, mở custom domain, phải thấy prompt.
   - Nhập sai password, phải bị chặn.
   - Nhập đúng password, site phải load bình thường.
   - Mở lại URL `github.io`, nó vẫn không hỏi mật khẩu vì đó là origin gốc, không phải cổng bảo vệ.

8. Nếu bạn muốn site public chỉ còn một entry point bảo vệ, thì sau khi custom domain chạy ổn, bạn nên dùng domain đó làm URL chính và coi `github.io` là origin kỹ thuật phía sau. Nếu cần, tôi có thể hướng dẫn bạn chỉnh mkdocs.yml để `site_url` khớp với domain mới.

Nếu muốn, tôi có thể tiếp tục theo kiểu “cầm tay chỉ việc” và viết cho bạn đúng từng thao tác trong Cloudflare dashboard, từng dòng cần điền vào Worker secrets, rồi cách test trong trình duyệt.