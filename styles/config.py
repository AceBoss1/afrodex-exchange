# Old (Neon Database Example - REMOVE)
# NEON_DB_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@endpoint.neon.tech/dbname')

# New (Supabase Connection - USE THIS)
# Retrieve this string from your Supabase Project Settings -> Database
SUPABASE_DB_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:m$X3Q5q-.mSzKEJ@db.rrqdkozbnqxaneuvuvxq.supabase.co:5432/postgres')

# Ensure your application uses the new variable name
NEXT_PUBLIC_SUPABASE_URL=https://rrqdkozbnqxaneuvuvxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycWRrb3pibnF4YW5ldXZ1dnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDM4ODksImV4cCI6MjA3NzMxOTg4OX0.mezKNLW_g2384NpwCFxjcK1qEXgIKEPre7V8tsS4Ks8

# Other critical variables (RPC nodes, etc., remain the same)
# ...
