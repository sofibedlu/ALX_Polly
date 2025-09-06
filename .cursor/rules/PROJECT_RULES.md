# Polling App – Project Rules

This file defines the conventions and expectations for the Polling App project.  
Cursor (and contributors) should follow these rules when generating or refactoring code.

---

## 1. Project Structure
- Use **Next.js App Router** (`/app` directory).
- Poll-related pages live under `/app/polls/[slug]/`.
- API endpoints live under `/app/api/{resource}/route.ts`.
- Shared UI components go in `/components/`.
- Utilities and Supabase clients go in `/lib/`.

✅ Example:  
- `app/polls/new/page.tsx` → Create a new poll form page.  
- `app/api/votes/route.ts` → API route to cast a vote.  

---

## 2. UI & Forms
- Use **shadcn/ui** components styled with **TailwindCSS**.  
- For forms, always use **react-hook-form** with **zod** validation.  
- Keep form components modular and reusable.  

✅ Example:  
- `PollForm.tsx` should use `<Form>` and `<Input>` from shadcn/ui.  
- Validation schema defined in `/lib/validators.ts`.  

---

## 3. Supabase Integration
- Use **Supabase** for authentication, database, and realtime updates.  
- **Server components / API routes** → Use server client (`/lib/supabase/server.ts`).  
- **Client components** → Use browser client (`/lib/supabase/client.ts`).  
- Never expose **service role keys** to the client.  

✅ Example:  
- Fetch poll results in `page.tsx` with `createServerClient()`.  
- Use `createBrowserClient()` inside `LiveResults.tsx` for realtime updates.  

---

## 4. Authentication & Sessions
- Auth is handled by Supabase (email/password, optional OAuth).  
- Sessions are stored in cookies.  
- Protect routes with **middleware** or server actions.  
- Enforce access control with **Row Level Security (RLS)** in Supabase.  

✅ Example:  
- Redirect unauthenticated users from `/app/dashboard` to `/app/auth/login`.  
- Use RLS: `auth.uid() = owner_id` for polls.  

---

## 5. QR Codes
- Polls can be shared via QR codes.  
- Generate QR codes in API routes using the **qrcode** library.  
- Place these routes under `/app/api/qrcode/[slug]/route.ts`.  

✅ Example:  
- `/api/qrcode/{slug}` → Returns an SVG or PNG of the poll link QR code.  

---

## 6. Development Practices
- Favor **Server Components** for data fetching.  
- Use **Route Handlers** for side-effectful actions (create poll, vote).  
- Keep business logic centralized in Supabase (functions, triggers, RLS).  
- Test with **Playwright** (E2E) and **Vitest** (unit).  
