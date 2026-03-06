# EdTech Platform API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

### `POST /auth/register`
Creates a new student account.
- **Body**: `{ name, email, password }`
- **Returns**: `{ user, accessToken }`

### `POST /auth/login`
Authenticates a user.
- **Body**: `{ email, password }`
- **Returns**: `{ user, accessToken }`

---

## Users Users

### `GET /users/me`
*Requires Auth*
Returns current user profile.

### `GET /users/me/stats`
*Requires Auth (STUDENT)*
Returns aggregated stats for student dashboard.
- **Returns**: `{ totalAttempts, completedAttempts, averageScore }`

---

## Subjects

### `GET /subjects`
Returns list of subjects.

### `GET /subjects/:id`
Returns subject details including child lessons and exams.

### `POST /subjects`
*Requires Auth (ADMIN)*
Creates a subject.
- **Body**: `{ name, description, imageUrl }`

### `PUT /subjects/:id`
*Requires Auth (ADMIN)*
Updates a subject.

### `DELETE /subjects/:id`
*Requires Auth (ADMIN)*
Deletes a subject.

---

## Lessons

### `GET /lessons/:id`
Returns lesson details and all nested blocks.

### `POST /lessons`
*Requires Auth (ADMIN)*
Creates a new lesson and its blocks.
- **Body**: `{ title, subjectId, blocks: [{ type, content, order }] }`

### `PUT /lessons/:id`
*Requires Auth (ADMIN)*
Updates lesson title and completely replaces existing blocks.
- **Body**: `{ title, blocks: [...] }`

### `DELETE /lessons/:id`
*Requires Auth (ADMIN)*
Deletes a lesson.

---

## Exams & Questions

### `GET /exams`
*Requires Auth (ADMIN)*
Returns all exams.

### `GET /exams/:id`
*Requires Auth (ADMIN)*
Returns admin-level exam details (includes correct answers).

### `GET /exams/:id/student`
*Requires Auth*
Returns student-safe exam details (strips `correctAnswer` from questions).

### `POST /exams`
*Requires Auth (ADMIN)*
Creates an exam and its questions.
- **Body**: `{ title, subjectId, duration, questions: [{ type, text, points, options, correctAnswer, order }] }`

### `PUT /exams/:id`
*Requires Auth (ADMIN)*
Updates exam and replaces questions.

### `DELETE /exams/:id`
*Requires Auth (ADMIN)*
Deletes an exam.

---

## Attempts & AI Grading

### `GET /attempts/all/admin`
*Requires Auth (ADMIN)*
Returns all attempts across the platform with user and exam relations.

### `GET /attempts/:id`
*Requires Auth*
Returns attempt details including answers, scores, and AI feedback.

### `POST /attempts/start/:examId`
*Requires Auth*
Starts a new attempt or resumes an incomplete one.
- **Returns**: `Attempt` object

### `POST /attempts/:id/submit`
*Requires Auth*
Submits an exam attempt for grading. Auto-grades MCQ/TF and queues ESSAY questions for Hugging Face AI review.
- **Body**: `{ answers: [{ questionId, response }] }`
- **Returns**: Final updated `Attempt` with score.
