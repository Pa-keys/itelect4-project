# Course Submission Tracker

A simple TypeScript project for tracking course repositories submitted by students.

## Core Entities

- `User`: a student, instructor, or administrator.
- `Course`: a course with its code, title, units, and semester.
- `Submission`: a student's repository submission, including its status and optional score.

## Advanced TypeScript Types

- `SubmissionStatus`: a string enum for pending, submitted, and graded work.
- `ApiResponse<T>`: a generic API response wrapper.
- `SubmissionUpdate`: `Partial<Submission>` for submission changes.
- `SubmissionPreview`: a `Pick` of a submission's ID, course code, and status.
- `getFirst<T>`: a generic function that returns the first item in an array.

## Installation And Run

```bash
npm install
npm start
```

## Type Checking

```bash
npm run typecheck
```
