You are helping build a full-stack academic web platform called Bcai Notes using Laravel 12 + Inertia.js + React 19 + Tailwind CSS 4. This is a structured learning platform for BCA students to browse syllabi and question papers semester-wise.

✅ AI features are planned but not in scope yet. Focus only on:

Laravel backend

React frontend (Inertia.js)

File upload via Laravel Storage

Semester-based academic content

🧱 System Summary (what's already done):
Laravel + Inertia.js scaffold is set up.

Auth is working (login, registration).

App layout, header, footer, sidebar all functional.

Navigation UI built for semester and year dropdowns.

Project uses modern tooling (Pint, Pest, Vite, Radix UI, Tailwind).

Logo, favicon, and branding elements are ready.

🧩 What to Generate / Help With Next:
Migrations, Models, Seeders:

Semester: ID, name

Syllabus: ID, semester_id (FK), course, units (longText or JSON)

QuestionPaper: ID, semester_id (FK), course, year, file_path

Controllers (Laravel):

SemesterController: index()

SyllabusController: show(Semester $semester)

QuestionPaperController: show(Semester $semester)

Routes:

/semesters → list all semesters

/syllabus/{semester} → syllabus for that semester

/papers/{semester} → past papers for that semester

React Pages (resources/js/pages):

SemesterListPage.tsx: display clickable semester cards

SyllabusPage.tsx: show course and units for semester

QuestionPaperPage.tsx: list downloadable question papers

Frontend Features:

Use Lucide icons for documents/downloads

Use Tailwind + Radix UI for clean responsive layout

Display PDF download links from /storage folder

Laravel File Upload (Admin-Only):

Create form (React) for uploading question paper (year + course + semester + PDF)

Store using Laravel's Storage::putFile() to public/

Run php artisan storage:link to expose the file

Constraints & Quality:
Keep everything modular (React components + Laravel controllers).

Use Inertia for routing and server-side data transfer.

Use Laravel validation rules for forms.

Code should be clean, documented, and scalable.

Assume SQLite or MySQL, use migrations.

✅ Continue development from this state.
🔄 Suggest and generate any missing files, folders, or logic.
