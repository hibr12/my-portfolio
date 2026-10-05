I need you to fully debug and fix the current React + Vite portfolio project.

IMPORTANT:
Do NOT recreate the project.
Do NOT remove existing functionality.
Do NOT redesign the UI.
Do NOT replace real API functionality with fake data.
Do NOT make random changes just to hide console errors.

First inspect the existing project structure and trace the errors through the actual codebase. Fix the ROOT CAUSES, not just the symptoms.

The project is located at:

C:\Users\G O\Desktop\portfoloi

==================================================
CURRENT ERROR 1 — useInView IS NOT DEFINED
==========================================

The browser console shows:

Projects.jsx:8 Uncaught ReferenceError: useInView is not defined

The error occurs here:

Projects.jsx:8

The previous fix added:

import { useData } from '../context/DataContext.jsx';

That fixed the previous:

useData is not defined

But now the next missing dependency is:

useInView

DO THE FOLLOWING:

1. Open:

src/pages/Projects.jsx

2. Inspect the complete file.

3. Find exactly how `useInView()` is being used.

4. Search the ENTIRE project for:

useInView

5. Determine where `useInView` is supposed to come from.

It may be:

* a custom hook in the project
* an existing utility
* a library such as react-intersection-observer
* another existing hook

6. DO NOT assume the source.

Verify the project dependencies and existing implementation first.

7. If the project already has a custom `useInView` hook, import it correctly.

8. If the project is intended to use `react-intersection-observer`, verify whether the package is installed and whether the existing project architecture expects:

import { useInView } from 'react-intersection-observer';

If it is missing and this library is clearly intended by the existing code, install the required dependency and use it correctly.

9. If `useInView` is supposed to be a local custom hook but the hook is missing, inspect similar components and implement it consistently with the existing project architecture.

10. Do NOT simply delete the `useInView()` call unless it is genuinely unused and can safely be removed without changing the intended functionality.

11. Make sure the resulting implementation preserves the existing scroll/animation/lazy-loading behavior of the Projects page.

==================================================
CURRENT ERROR 2 — BACKEND API 500 ERRORS
========================================

The browser console shows:

/api/analytics → 500 Internal Server Error
/api/projects → 500 Internal Server Error
/api/certificates → 500 Internal Server Error
/api/skills → 500 Internal Server Error

The frontend also reports:

DataContext.jsx:87 Failed to load projects: Error: Internal server error

DataContext.jsx:94 Failed to load skills: Error: Internal server error

DataContext.jsx:101 Failed to load certificates: Error: Internal server error

This means the frontend is reaching the API route, but the server handling those requests is returning HTTP 500.

IMPORTANT:

Do NOT solve this by simply increasing the frontend timeout.

A 500 error is primarily a SERVER-SIDE problem.

Trace the complete request path.

==================================================
STEP 1 — INSPECT FRONTEND API SERVICE
=====================================

Inspect:

src/services/api.js

Determine:

* Base URL
* API URL
* Request method
* Request timeout
* Error handling
* Headers
* Authentication headers if any
* How `/api/projects`
* `/api/skills`
* `/api/certificates`
* `/api/analytics`

are requested.

Make sure the frontend is calling the correct API.

==================================================
STEP 2 — FIND THE BACKEND/API IMPLEMENTATION
============================================

Search the entire project for these routes:

/api/projects
/api/skills
/api/certificates
/api/analytics

Determine where these API endpoints are actually implemented.

Check whether the project uses:

* Express
* Node.js
* Vite server middleware
* serverless functions
* API routes
* another backend framework

Do NOT assume the architecture.

Inspect the actual files.

==================================================
STEP 3 — FIND THE ROOT CAUSE OF THE 500 ERRORS
==============================================

For EACH endpoint:

/api/projects
/api/skills
/api/certificates
/api/analytics

trace:

Frontend request
→ api.js
→ API route
→ controller/handler
→ service
→ database
→ response

Find exactly where the request fails.

Check for:

* Database connection errors
* Missing environment variables
* Incorrect database URL
* Incorrect database credentials
* Missing tables
* Missing collections
* SQL errors
* MongoDB errors
* Prisma errors
* Sequelize errors
* Mongoose errors
* Undefined variables
* Missing imports
* Incorrect route definitions
* Incorrect response handling
* Authentication problems
* CORS problems
* Server startup problems
* Invalid query syntax
* Missing seed data

Fix the actual cause.

==================================================
CURRENT ERROR 3 — REQUEST TIMEOUT
=================================

The console also shows:

DataContext.jsx:94 Failed to load skills: Error: Request timeout

DataContext.jsx:101 Failed to load certificates: Error: Request timeout

The timeout may be a secondary effect of the backend/API problems.

DO NOT simply increase the timeout.

First fix the 500 errors and verify that the backend responds correctly.

Only adjust timeout configuration if there is a legitimate reason after the API is working.

==================================================
CURRENT ERROR 4 — DATA CONTEXT
==============================

Inspect:

src/context/DataContext.jsx

The project currently uses:

DataProvider

and:

useData()

Make sure the DataContext architecture is correct.

Verify:

* `useData` is properly exported
* `DataProvider` is properly exported
* Projects.jsx imports `useData` correctly
* DataContext does not contain circular dependencies
* API requests are handled correctly
* Promise.allSettled is used appropriately
* failed API requests do not crash unrelated pages
* loading states are correct
* error states are correct
* fallback behavior does not hide genuine backend problems

Do not remove Promise.allSettled if it is intentionally being used for graceful degradation.

==================================================
CURRENT ERROR 5 — IMAGE PRELOAD WARNINGS
========================================

The console also shows:

The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event.

Inspect:

index.html

and identify EVERY `rel="preload"` resource.

For each preload determine:

1. Is the resource actually required immediately during page load?
2. Is the correct `as` attribute being used?
3. Is it dynamically loaded later?
4. Is the preload actually improving performance?

Do not blindly keep unnecessary preloads.

For images that are dynamically rendered by a carousel or later component, determine whether preload is actually appropriate.

If a preload is unnecessary, remove it.

If it is necessary, configure it correctly.

Do not change the website's visual appearance.

==================================================
IMPORTANT — DO NOT HIDE ERRORS
==============================

Do NOT do things like:

* Comment out failing API calls
* Delete Projects page
* Delete useInView functionality
* Replace API calls with hardcoded fake data
* Increase timeout to an unreasonable value
* Catch every error and ignore it
* Disable ErrorBoundary
* Remove console errors without fixing their cause
* Remove DataContext
* Remove backend functionality
* Disable API requests
* Change the UI just to make the error disappear

The goal is a genuinely working application.

==================================================
FULL PROJECT SEARCH
===================

Search the entire project for:

useData
useInView
DataProvider
DataContext
/api/projects
/api/skills
/api/certificates
/api/analytics
ApiService
baseURL
VITE_
DATABASE_URL
MONGODB
MYSQL
POSTGRES
Prisma
Mongoose
Sequelize
Express

Use the results to understand the architecture before modifying anything.

==================================================
VERIFICATION
============

After making the fixes:

1. Stop the current development server.

2. Start the project again:

npm run dev

3. Verify the frontend loads.

4. Open the Projects page.

5. Verify there is no:

ReferenceError: useInView is not defined

6. Verify there is no:

ReferenceError: useData is not defined

7. Open the browser Network tab.

8. Check these requests:

/api/projects
/api/skills
/api/certificates
/api/analytics

They should return successful HTTP responses when the backend/database is correctly available.

9. If any endpoint still returns 500, inspect the SERVER TERMINAL output and fix the actual server-side error.

10. Verify that the DataContext receives the returned data.

11. Verify the Projects page actually displays the project data.

12. Verify skills and certificates load correctly.

13. Verify analytics loads correctly.

14. Verify that a temporary backend failure does not crash the entire React application.

15. Check the browser console again.

The final console should contain no application-level:

* ReferenceError
* TypeError
* Uncaught errors
* failed API requests caused by our code
* broken imports
* broken exports

Development-only informational messages such as the React DevTools recommendation can remain.

==================================================
VERY IMPORTANT FINAL REPORT
===========================

After fixing everything, give me a concise report with:

1. Root cause of `useInView` error
2. How `useInView` was fixed
3. Root cause of `/api/projects` 500
4. Root cause of `/api/skills` 500
5. Root cause of `/api/certificates` 500
6. Root cause of `/api/analytics` 500
7. Whether the database/backend was involved
8. Which files were modified
9. Whether any package was installed
10. Whether any environment variable needs to be configured
11. Whether the image preload warnings were fixed
12. Final verification result

MOST IMPORTANT:

Do not tell me "fixed" merely because the code compiles.

Actually trace and verify the errors.

If the backend cannot be fixed because it requires an external service, database, environment variable, or server that is not available, clearly tell me exactly what is missing and give me the exact command/configuration I need to run it.

Do not invent a backend response or claim an API is working without verifying it.
