<<<<<<< HEAD
# role basee admin
=======
# HRidoy
>>>>>>> cc003dd8 (update)

A modern Laravel + React + Inertia.js application with comprehensive admin panel features, including user management, role-based access control, typography settings, and site configuration.

## Features

### Core Features
- **User Management**: Complete CRUD operations for users with role-based access control
- **Role-Based Access Control**: Spatie Laravel Permission integration for managing roles and permissions
- **Authentication**: Laravel Fortify for secure authentication (login, registration, password reset)
- **Admin Panel**: Comprehensive admin dashboard with settings management

### Settings Management
- **General Settings**: Manage application-wide settings with search and pagination
- **Logo & Favicon**: Upload and manage brand assets (logo, favicon, favicon SVG, apple touch icon)
- **Typography Settings**: Language-specific font management for Bangla and English
  - Font family selection (5 Bangla fonts, 6 English fonts)
  - Font size, weight, color, line height, letter spacing
  - Live preview with dark/light mode support
  - Google Fonts integration

### UI/UX Features
- **Dark Mode**: Full dark mode support with automatic theme detection
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern Components**: Radix UI components for consistent UI patterns
- **Toast Notifications**: Sonner for beautiful toast notifications
- **Drag & Drop**: File upload with drag-and-drop support

## Tech Stack

### Backend
- **Framework**: Laravel 13.7
- **PHP**: 8.3+
- **Authentication**: Laravel Fortify 1.37.2
- **Permissions**: Spatie Laravel Permission 8.1
- **Database**: SQLite (default), supports MySQL/PostgreSQL
- **Queue**: Database queue driver
- **Cache**: Database cache driver

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.7.2
- **Build Tool**: Vite 8.0.0
- **Routing**: Inertia.js 3.4.0
- **Styling**: Tailwind CSS 4.0.0
- **Components**: Radix UI (Avatar, Checkbox, Dialog, Dropdown, etc.)
- **Icons**: Lucide React, React Icons
- **Notifications**: Sonner 2.0.0
- **Forms**: React Hook Form patterns with Inertia.js

### Development Tools
- **Testing**: Pest PHP 4.7
- **Linting**: Laravel Pint, ESLint, Prettier
- **Type Checking**: PHPStan, TypeScript
- **Package Manager**: Composer, npm/pnpm

## Installation

### Prerequisites
- PHP 8.3 or higher
- Composer
- Node.js 18+ and npm/pnpm
- SQLite (or MySQL/PostgreSQL)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd inertia-roll-base
```

2. **Install dependencies**
```bash
composer install
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database setup**
```bash
php artisan migrate
php artisan db:seed
```

5. **Build assets**
```bash
npm run build
```

6. **Start development server**
```bash
composer run dev
```

Or run individually:
```bash
php artisan serve
npm run dev
```

## Configuration

### Environment Variables

Key environment variables in `.env`:

```env
APP_NAME=HRidoy
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

### Database Configuration

Default uses SQLite. For MySQL/PostgreSQL, update:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Usage

### Admin Panel Access

1. Navigate to `/admin` (or configured admin route)
2. Login with admin credentials
3. Access various settings from the sidebar:
   - **Dashboard**: Overview of system status
   - **Users**: Manage users, roles, and permissions
   - **Roles**: Configure user roles
   - **Permissions**: Manage system permissions
   - **Colors**: Configure theme colors
   - **Site Settings**:
     - General Settings
     - Logo & Favicon
     - Typography

### Typography Settings

1. Go to **Site Settings** → **Typography**
2. Select language (Bangla/English)
3. Configure font properties:
   - Font family
   - Font size (12px - 32px)
   - Font weight (Light to Bold)
   - Font color
   - Line height
   - Letter spacing
4. Preview changes in real-time
5. Save settings

### User Management

1. Go to **Users** section
2. View all users with their roles and status
3. Change user status (Active/Inactive/Suspended) via dropdown
4. Edit or delete users
5. Assign roles and permissions

## Project Structure

```
├── app/
│   ├── Actions/
│   │   └── Fortify/          # Fortify authentication actions
│   ├── Concerns/             # Shared concerns (validation rules)
│   ├── Console/
│   │   └── Commands/         # Artisan commands
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Admin/        # Admin controllers
│   │   ├── Middleware/       # HTTP middleware
│   │   └── Requests/         # Form requests
│   ├── Models/               # Eloquent models
│   └── Providers/            # Service providers
├── database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── resources/
│   ├── css/
│   │   └── app.css           # Global styles
│   ├── js/
│   │   ├── actions/          # Server actions
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Inertia pages
│   │   │   └── admin/        # Admin pages
│   │   │       ├── settings/ # Settings pages
│   │   │       └── user/     # User management
│   │   └── app.tsx           # React entry point
│   └── views/
│       └── app.blade.php     # Blade template
├── routes/
│   ├── console.php           # Console routes
│   ├── settings.php          # Settings routes
│   └── web.php               # Web routes
├── tests/                    # Test files
├── public/                   # Public assets
├── storage/                  # Storage files
└── vendor/                   # Composer dependencies
```

## Available Commands

### Composer Commands

```bash
# Setup project (install, migrate, build)
composer run setup

# Development (server, queue, vite)
composer run dev

# Linting
composer run lint              # Fix code style
composer run lint:check        # Check code style
composer run types:check       # Type checking with PHPStan

# Testing
composer run test              # Run all tests
composer run ci:check          # Full CI check
```

### NPM Commands

```bash
# Development
npm run dev                   # Start Vite dev server
npm run build                 # Build for production
npm run build:ssr             # Build with SSR

# Code quality
npm run lint                  # Fix ESLint issues
npm run lint:check            # Check ESLint
npm run format                # Format with Prettier
npm run format:check          # Check Prettier
npm run types:check           # TypeScript type checking
```

### Artisan Commands

```bash
php artisan migrate           # Run migrations
php artisan db:seed           # Seed database
php artisan serve             # Start development server
php artisan queue:work        # Process queue jobs
php artisan cache:clear       # Clear cache
php artisan config:clear      # Clear config cache
```

## Features in Detail

### Typography Management

The typography system allows language-specific font configuration:

**Bangla Fonts:**
- Hind Siliguri
- Noto Sans Bengali
- Baloo Da 2
- Galada
- Tiro Bangla

**English Fonts:**
- Inter
- Roboto
- Open Sans
- Poppins
- Lato
- Montserrat

**Custom Hook:**
- `useTypography.ts`: React hook for applying typography styles dynamically
- Automatic language detection (Bengali character detection)
- CSS variable application for global styles

### Settings System

Settings are stored in the database with JSON support for complex configurations:

- **General Settings**: Key-value pairs with type support (text, number, boolean, JSON, etc.)
- **Logo & Favicon**: File uploads with drag-and-drop support
- **Typography**: JSON structure for language-specific font settings

### User Management

- User CRUD operations
- Role assignment (Admin, User, etc.)
- Status management (Active, Inactive, Suspended)
- Permission-based access control
- Bulk operations support

## Development

### Adding New Settings

1. Create migration for settings table (if needed)
2. Add controller method in `SiteSettingsController.php`
3. Add route in `routes/web.php`
4. Create React page in `resources/js/pages/admin/settings/`
5. Add navigation link in `app-sidebar.tsx`

### Adding New Fonts

1. Add Google Fonts link in `resources/views/app.blade.php`
2. Update font arrays in typography page:
   - `BANGLA_FONTS` for Bangla fonts
   - `ENGLISH_FONTS` for English fonts

### Testing

```bash
# Run all tests
composer run test

# Run specific test
php artisan test --filter UserTest

# Run Pest tests
./vendor/bin/pest
```

## Troubleshooting

### Common Issues

**Vite not loading assets:**
```bash
npm run build
php artisan view:clear
```

**Database connection issues:**
```bash
php artisan config:clear
php artisan migrate:refresh
```

**Permission issues:**
```bash
php artisan permission:cache-reset
php artisan db:seed --class=PermissionSeeder
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open-sourced software licensed under the MIT license.

## Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Laravel, React, and Inertia.js**
