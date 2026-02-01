# Key Flows

## 1. Authentication Flow

1. **Sign Up**: User provides Name, Email, Password. `auth.ts` validates and creates User record.
2. **Login**: User enters credentials. NextAuth verifies via `authorize` callback.
3. **Session**: JWT token issued. Middleware validates token on protected routes.
4. **Role Check**: Role (`USER`, `ADMIN`, `SUPPLIER`) stored in session for detailed access control.

## 2. Booking Flow

1. **Discovery**: User searches for services (filtered by category, price, date).
2. **Selection**: User views Service Detail page.
3. **Availability**: User selects date/guests. System checks availability (call to `/api/bookings/availability`).
4. **Reservation**:
    - User completes Booking Wizard.
    - `booking.service.ts` verifies availability again (double-check).
    - Booking created with status `PENDING`.
5. **Confirmation**:
    - Email sent to User (Receipt).
    - Notification sent to Admin.
    - (Future) Payment processing updates status to `CONFIRMED`.

## 3. Admin Management Flow

1. **Access**: Route `/admin` protected by Middleware (requires `ADMIN` role).
2. **Dashboard**: Aggregated stats (Revenue, Bookings, Users) fetched via Server Actions.
3. **Service Management**:
    - Admin creates/edits services.
    - Image upload via Cloudinary API.
4. **Booking Management**:
    - Admin views all bookings.
    - Can approve/reject/cancel bookings.
    - Status updates trigger user emails.
