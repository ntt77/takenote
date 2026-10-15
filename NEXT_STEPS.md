# Kế hoạch tiếp tục dự án TakeNote (Next Steps)

> **Ngày cập nhật:** 15/10/2026  
> **Trạng thái hiện tại:** Dự án build sạch sẽ (`npm run build` thành công ~470ms trên React 19 & Vite), không có lỗi TypeScript hay Lint.

---

## 1. Những việc ĐÃ HOÀN THÀNH hôm nay

### A. Dọn dẹp & Tối giản hoá kiến trúc
- [x] **Xoá hoàn toàn module GitHub Auth:**
  - Xoá `src/store/authStore.ts`.
  - Làm sạch `src/store/index.ts`, `src/types/index.ts`.
  - Gỡ bỏ các fake loading effect và UI liên quan ở `App.tsx` và `SettingsModal.tsx`.
- [x] **Xoá sạch các UI component tự chế cũ trong `src/components/ui/`:**
  - Xoá `Switch.tsx`, `Select.tsx`, `Tabs/` (`Tab.tsx`, `TabPanel.tsx`, `Tabs.tsx`).
  - Gỡ bỏ package thừa `@radix-ui/react-dialog` khỏi `package.json`.

### B. Chuyển đổi sang `@radix-ui/themes`
- [x] **Settings Modal:**
  - Dùng `<Dialog.Root>`, `<Dialog.Content>` thay thế modal cũ.
  - Dùng `<Tabs.Root orientation="vertical">`, `<Tabs.List>`, `<Tabs.Trigger>`, `<Tabs.Content>` cho sidebar cài đặt dọc.
- [x] **Settings Controls:**
  - `Option.tsx`: Chuyển sang `<Switch />`.
  - `SelectOptions.tsx`: Chuyển sang `<Select.Root>`.
  - `Shortcut.tsx`: Chuyển `<kbd>` sang `<Kbd size="2">`.
  - `IconButton.tsx` & `IconButtonUploader.tsx`: Dùng `<Button variant="soft">`.
- [x] **Note Search & Select Category:**
  - `SearchBar.tsx`: Dùng `<TextField.Root>` + `<TextField.Slot>` kèm icon Search.
  - `SelectCategory.tsx`: Dùng `<Select.Root>` thay thế thẻ `<select>` thô cũ.
- [x] **Tooltips & Micro-interactions:**
  - Bọc `<Tooltip>` cho toàn bộ 11 nút định dạng trong `EditorToolbar.tsx`.
  - Bọc `<Tooltip>` cho các nút chức năng trong `NoteMenuBar.tsx`.
  - Bọc `<Tooltip>` cho `ActionButton.tsx`, `AddCategoryButton.tsx`, `NoteListButton.tsx`.
  - `EmptyEditor.tsx`: Dùng `<Kbd>` cho phím tắt `Ctrl + Alt + N`.

### C. Dọn dẹp CSS trong `src/styles/index.css`
- [x] Đã xoá gần 300 dòng CSS rác / mồ côi:
  - Bỏ `.switch`, `.slider`, `.slider:before` cũ.
  - Bỏ `.dimmer` và biến `--dimmer-background`.
  - Bỏ toàn bộ module CSS của GitHub Auth (`.github-button`, `.profile`, `.profile-picture`, `.subtitle`, `.last-synced`, `.uuid-menu-bar`).
  - Bỏ bộ CSS spinner 3rd-party cũ `.la-ball-beat` (~80 dòng), `.rotating-svg`, `.loading`.
  - Cấu hình style chuẩn cho Vertical Tabs sidebar trong Settings.

---

## 2. Kế hoạch công việc CHO NGÀY MAI

### Task 1: Thay thế icon sang `@radix-ui/react-icons`
- Gỡ bỏ `@boxicons/react`.
- Cài đặt `@radix-ui/react-icons`.
- Cập nhật lại file tập trung `src/icons/index.tsx` để xuất các icon chuẩn 15x15 pixel-perfect của Radix (gọn nhẹ, không cần wrapper `createIcon` cồng kềnh nữa).

### Task 2: Hiện đại hoá ContextMenu & DropdownMenu
- Thay thế `src/features/notes/ContextMenu.tsx` (hiện đang tính toán toạ độ chuột `x, y` và portal thủ công) bằng:
  - `<ContextMenu>` của Radix Themes cho thao tác chuột phải trên Note và Category.
  - `<DropdownMenu>` của Radix Themes cho nút 3 chấm (`MoreHorizontal`).

### Task 3: Tối giản hoá CSS layout (`index.css`) theo phong cách Radix Themes
- Chuyển `AppSidebar`, `NoteList`, `NoteMenuBar`, `EditorToolbar` sang dùng các layout component chuẩn của Radix:
  - `<Flex>`, `<Box>`, `<ScrollArea>`, `<Separator>`, `<IconButton>`.
- Cắt giảm `src/styles/index.css` từ ~1.800 dòng xuống mức tối thiểu (chỉ giữ lại phần hiển thị nội dung `react-markdown` và CodeMirror editor).

### Task 4: Dark Mode
- Tạm gác lại theo yêu cầu. Khi hoàn thành toàn bộ khung sườn Radix Themes, sẽ bật lại và đồng bộ màu Dark mode giữa Radix Theme và CodeMirror editor.

---

## 3. Lệnh chạy kiểm tra nhanh
```bash
# Chạy môi trường dev
npm run dev

# Kiểm tra build
npm run build

# Format code
npm run format
```
