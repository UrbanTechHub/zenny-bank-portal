

## Plan: Banking App Improvements

### 1. Separate Admin and User Login

**Problem:** Admin login uses the same Supabase auth as user login — an admin can currently log into the user dashboard.

**Fix:**
- In `Login.tsx`: After successful login, check if user has admin role. If yes, sign them out and show error "Please use the admin login page."
- In `AdminLogin.tsx`: Remove the signup tab entirely (admin accounts should only be created by existing admins or via database). Keep login only.

### 2. Fix Admin Dashboard Functions

**Problem:** Admin approve, credit/debit operations may fail due to RLS — admin updates to `profiles` and `accounts` require admin role, but the RLS policies use `has_role()` which should work. The credit/debit form is missing a date field.

**Fix:**
- Add a `date` input field to the credit/debit form in `AdminDashboard.tsx`
- Add an RLS policy allowing admins to update profiles (currently only users can update their own)
- Add an RLS policy allowing admins to insert transactions (currently only users with `sender_id = auth.uid()` can insert)
- Verify the credit/debit and approve flows work with proper RLS

**Database migration needed:**
```sql
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert transactions" ON public.transactions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

### 3. Dark Theme for User Dashboard

Convert `Dashboard.tsx` from light theme (`bg-gray-50`, white cards) to dark theme matching the admin dashboard style (`bg-gray-900`, `bg-gray-800` cards, white/gray text).

### 4. Expanded Transfer Forms (Domestic / International / Wire)

Replace the simple transfer form with a tabbed interface offering three transfer types:
- **Domestic Transfer**: Recipient name, account number, bank name, branch, amount (VND), description, transfer method (same bank/interbank NAPAS), transfer date
- **International Transfer**: Recipient name, address, account/IBAN, bank name, bank address, SWIFT/BIC, intermediary bank, currency, amount, transfer purpose, fee option (OUR/SHA/BEN)
- **Wire Transfer (TT)**: Sender info, recipient name/account/bank/address, SWIFT/BIC, amount, currency, purpose, charges option, execution type (normal/urgent), transfer date

All three types still submit to the `transactions` table with appropriate metadata stored in the `description` field.

### 5. Replace PIN Quick Action with QR Code Payment

- In the overview dashboard, replace the "PIN" quick action button with "QR Payment"
- Add "QR Payment" to the sidebar menu, replacing "PIN Setup"
- Keep PIN setup accessible only from within the transfer flow or profile settings
- Create a `renderQRPayment` section that generates a QR code containing the user's account number for receiving payments
- When a sidebar menu item is clicked, auto-close the mobile sidebar

### Technical Details

**Files to modify:**
- `src/pages/Login.tsx` — block admin users from logging in
- `src/pages/AdminLogin.tsx` — remove signup tab
- `src/pages/Dashboard.tsx` — dark theme, expanded transfer forms, QR payment, sidebar auto-close
- `src/pages/AdminDashboard.tsx` — add date field to credit/debit, fix any RLS issues

**Database migration:**
- Add admin UPDATE policy on profiles
- Add admin INSERT policy on transactions

**New dependency:** `qrcode.react` for QR code generation

