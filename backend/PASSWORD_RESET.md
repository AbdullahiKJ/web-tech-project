# Password recovery setup

Create the table once in the Supabase SQL Editor. Skip this step if you already created it. No migration command is needed for password recovery.

```sql
CREATE TABLE public.password_resets (
    token_hash VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    expires_at INTEGER NOT NULL
);

CREATE INDEX password_resets_expires_at
    ON public.password_resets (expires_at);

ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
```

The backend's database connection must have permission to read and write this table. Reset records should not be exposed through public API policies. Automated tests create their own table in an isolated test database.

Add the following settings to your backend `.env`, using your actual mail provider credentials:

```ini
PASSWORD_RESET_URL = 'http://localhost:3000/reset-password'
email.protocol = smtp
email.fromEmail = 'no-reply@example.com'
email.fromName = 'Movie Reviews'
email.SMTPHost = 'smtp.example.com'
email.SMTPUser = 'your-smtp-user'
email.SMTPPass = 'your-smtp-password'
email.SMTPPort = 587
email.SMTPCrypto = tls
```

Use your HTTPS frontend URL in production. Keep `NEXT_PUBLIC_API_URL` in the frontend pointing to the backend as for sign-in. Configure a persistent shared cache for CodeIgniter's throttler when running multiple backend instances; do not use the dummy cache handler.

- `POST /auth/forgot-password`: JSON `{ "email": "user@example.com" }`. Returns the same success message for registered and unregistered addresses. Per-IP and per-email throttling limit requests. Delivery failures are logged without revealing account existence.
- `POST /auth/reset-password`: JSON `{ "token": "<email token>", "password": "NewPassword1!", "confirmPassword": "NewPassword1!" }`.

Links expire after 30 minutes. Only SHA-256 token hashes are stored. Tokens are consumed transactionally and bound to the current password hash, so a password change invalidates existing links. Resetting does not automatically sign in the user. Existing signed-in sessions are not revoked by the current session system.

Verify with a test account and mail inbox: request a link, reset its password, sign in with the new password, then check that reusing the link and submitting an expired link fail. The existing forgot-password link on the sign-in page opens the new page.
