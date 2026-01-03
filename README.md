# Step 3 Admin Panel
Run:
cp .env.example .env.local
npm install
npm run dev
Admin: /admin/login -> /admin/teams


## Added in Step 3.1
- Search + filter in Teams table
- Team Details page (/admin/teams/[teamNumber])
- QR Verify screen (/verify) + API (/api/verify)

## Step 4 (MongoDB + Signed QR)
- Persistent storage in MongoDB (Atlas)
- Signed QR token stored in ticket and used by /verify
- /api/verify validates token signature and fetches team from MongoDB
- Admin Teams/CSV/Ticket read from MongoDB

### Env
- MONGODB_URI
- NEXT_PUBLIC_APP_URL
- ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_AUTH_SECRET
- TICKET_SIGNING_SECRET

