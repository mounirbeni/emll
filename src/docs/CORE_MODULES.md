# Core Modules & Responsibilities

## Auth Module (`src/auth.ts`, `src/app/api/auth`)

- **Responsibility**: Manages user authentication and session handling.
- **Key Components**:
  - `auth.ts`: Configuration for NextAuth.js, including providers and callbacks.
  - `middleware.ts`: robust route protection based on auth status.
- **Exports**: `auth`, `signIn`, `signOut`, `handlers`.

## Services Layer (`src/services/`)

Encapsulates business logic, separating it from the UI and database layers.

- **`booking.service.ts`**:
  - Handles booking creation, validation (availability, double-booking prevention).
  - Manages lifecycle (Pending -> Confirmed -> Completed).
  - Triggers notifications (email/system).
- **`service.service.ts`**:
  - Manage "Service" entities (Activities, Tours).
  - Search and filtering logic.
  - Review aggregation.
- **`notification.service.ts`**:
  - Abstraction for sending user notifications.

## Repository Layer (`src/repositories/`)

Direct interface with the database using Prisma. Ensures data consistency and reusable query patterns.

- **`base.repository.ts`**: Generic repository providing generic CRUD operations (`create`, `findById`, `findMany`, etc.).
- **`booking.repository.ts`**: specialized queries for bookings (e.g., finding conflicting bookings).
- **`user.repository.ts`**: User management queries.

## API Routes (`src/app/api/`)

RESTful endpoints for client-side fetching and external integrations.

- **`/api/services`**: Search and filter services.
- **`/api/bookings`**: Create and manage bookings types.
- **`/api/admin/*`**: Secured endpoints for dashboard metrics and data management.

## Components (`src/components/`)

- **`ui/`**: Low-level, reusable design system components (Buttons, Inputs, Cards).
- **`bookings/`**: Complex booking wizard and management UI.
- **`admin/`**: Dashboard widgets and management tables.
