# Megha, with love

A small Flask website with a private, shared photo/video scrapbook. Album media is stored in a private Supabase Storage bucket, not in browser-local storage.

## Configure Supabase

The scrapbook keeps its existing Supabase Auth, browser client, `album_members` and `album_memories` tables, `couple-album` private Storage bucket, RLS policies, and realtime subscription. Flask loads the Supabase URL and publishable/anon key from environment variables, initializes the Python Supabase client, and serves those public client settings to the scrapbook. The browser client continues to handle user sign-in, RLS-protected album operations, and realtime updates. A publishable/anon key is designed to be visible in a browser; the app rejects secret and service-role keys and never sends them to the frontend.

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

5. Create a local `.env` file from `.env.example` if you don't already have one, then set `SUPABASE_URL` to the Supabase **Project URL** and `SUPABASE_KEY` to the **publishable/anon key**. `SUPABASE_PUBLISHABLE_KEY` is also accepted and takes priority. Never put a `service_role` or secret key in either variable. `.env` is ignored by Git.
6. Run locally using the commands below, open `/memories`, and sign in with both accounts to test. Upload up to 10 JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV files per batch (maximum 25 MB each). Both invited members can view and delete shared memories.
7. For Vercel, set `SUPABASE_URL` and `SUPABASE_KEY` in **Project Settings → Environment Variables** using the Project URL and publishable/anon key, then import/deploy this repository. Do not add a service-role or secret key. `vercel.json` continues to route requests through the existing Flask app. Set the live site URL as Supabase's **Site URL**, and add it plus `http://localhost:8000/**` under **Authentication → URL Configuration → Redirect URLs**.

Every album table and storage operation is protected by the two-user `album_members` allow-list. Media is in a private bucket; the browser displays temporary signed URLs. The original scrapbook images in `static/photos/` are part of the website and are public website assets.

## Run and test locally

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
# Edit .env with your Supabase Project URL and publishable/anon key.
python app.py
```

If `.env` already exists, don't overwrite it with `Copy-Item`; just verify its two values. In another PowerShell window, confirm all existing pages and static assets still respond, and check the safe config endpoint without printing the key:

```powershell
$pages = @("/", "/love", "/question", "/memories", "/reasons", "/surprise", "/quiz", "/rate", "/game", "/promise", "/static/album.js")
$pages | ForEach-Object {
  $response = Invoke-WebRequest "http://127.0.0.1:8000$_" -UseBasicParsing
  "{0} {1}" -f $response.StatusCode, $_
}
$config = Invoke-RestMethod "http://127.0.0.1:8000/api/config"
$config | Select-Object configured, supabaseUrl
```
