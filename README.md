# Megha, with love

A small Flask website with a private, shared photo/video scrapbook. Album media is stored in a private Supabase Storage bucket, not in browser-local storage.

## Set up the private shared album

1. Create a Supabase project at [supabase.com](https://supabase.com/) and keep its database password private.
2. In **SQL Editor**, run [`supabase-schema.sql`](./supabase-schema.sql). This creates the album tables, a private `couple-album` bucket, and row/storage access policies.
3. In **Authentication → Users**, invite or create exactly two accounts: one for you and one for Megha. Set strong, separate passwords and confirm the accounts. Public sign-up is not needed.
4. Copy each account UUID from **Authentication → Users**. In the SQL Editor, add both UUIDs to the album allow-list:

   ```sql
   insert into public.album_members (user_id, display_name) values
     ('YOUR_AUTH_USER_UUID', 'Delhi wala'),
     ('MEGHA_AUTH_USER_UUID', 'Megha');
   ```

5. Edit `static/supabase-config.js`. Set `supabaseUrl` to the Supabase **Project URL** and `supabaseAnonKey` to the **publishable/anon key**. This key is intended for browser apps; **never put a `service_role` or secret key in this file**. The publishable/anon key is safe to deploy because SQL policies restrict the album to the two invited account IDs.
6. Run locally with `.\.venv\Scripts\python.exe app.py`, open `/memories`, and sign in with both accounts to test. Upload up to 10 JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV files per batch (maximum 25 MB each). Both invited members can view and delete shared memories.
7. To share it between Delhi and Kolkata, commit the configured `static/supabase-config.js`, push the changes to GitHub, then import this repository into Vercel and deploy. `vercel.json` routes page requests to the Flask app; static assets remain served by Vercel. Set the live site URL as Supabase's **Site URL**, and add it plus `http://localhost:8000/**` under **Authentication → URL Configuration → Redirect URLs**.

Every album table and storage operation is protected by the two-user `album_members` allow-list. Media is in a private bucket; the browser displays temporary signed URLs. The original scrapbook images in `static/photos/` are part of the website and are public website assets.

## Run the website locally

```powershell
.\.venv\Scripts\python.exe app.py
```
