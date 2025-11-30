# Timesheet App

A cross-platform mobile timesheet tracking application built with Ionic, Angular, and Capacitor. Track your work hours efficiently with support for start/end times, break time deductions, and monthly summaries.

## Features

- **User Authentication**

  - Secure login and signup
  - JWT-based authentication
  - User profile management with hourly rate settings

- **Timesheet Management**

  - Create, edit, and delete timesheet entries
  - Track work date, start time, and end time
  - Break time support (0, 15, 30, 45, or 60 minutes)
  - Automatic duration calculation (work hours minus break time)
  - Filter timesheets by month and year

- **Dashboard & Reports**

  - Overview tab with total hours and amount for the selected month
  - Timesheet list with swipe-to-edit/delete functionality
  - Monthly filtering using an intuitive date picker
  - Animated list items with alternating backgrounds

- **Mobile-Optimized**
  - Consistent Material Design across iOS and Android
  - Native mobile app experience with Capacitor
  - Responsive time and date pickers
  - Touch-friendly interface

## Tech Stack

- **Frontend Framework:** Angular 20
- **Mobile Framework:** Ionic 8
- **Native Layer:** Capacitor 7
- **Language:** TypeScript
- **Authentication:** JWT (jwt-decode)
- **State Management:** Angular Signals
- **Forms:** Reactive Forms

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Ionic CLI: `npm install -g @ionic/cli`
- For iOS development: macOS with Xcode
- For Android development: Android Studio

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd timesheet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API endpoint**

   Update the API target in `proxy.conf.json`:

   ```json
   {
     "/api": {
       "target": "https://timesheet-api.vercel.app",
       "secure": true,
       "changeOrigin": true,
       "logLevel": "debug"
     }
   }
   ```

## Development

### Run in Browser

```bash
ionic serve
```

This will start the development server at `http://localhost:8100`.

### Run on Android

1. Build the web assets:

   ```bash
   ionic build
   ```

2. Sync with Capacitor:

   ```bash
   npx cap sync android
   ```

3. Open in Android Studio:

   ```bash
   npx cap open android
   ```

4. Run the app from Android Studio on an emulator or device.

### Run on iOS

1. Build the web assets:

   ```bash
   ionic build
   ```

2. Sync with Capacitor:

   ```bash
   npx cap sync ios
   ```

3. Open in Xcode:

   ```bash
   npx cap open ios
   ```

4. Run the app from Xcode on a simulator or device.

## Project Structure

```
src/
├── app/
│   ├── dashboard/           # Main dashboard module
│   │   ├── overview/        # Overview component (summary)
│   │   ├── timesheet/       # Timesheet list component
│   │   └── entry-form/      # Timesheet entry form
│   ├── login/               # Login page and form
│   ├── signup/              # Signup page
│   ├── settings/            # User settings page
│   ├── services/            # API and auth services
│   ├── shared/              # Shared components (month filter, etc.)
│   └── model/               # TypeScript interfaces
├── global.scss              # Global styles
└── theme/                   # Ionic theme variables
```

## API Integration

The app connects to a backend API with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/timesheets` - List timesheets (with month/year query params)
- `POST /api/timesheets` - Create timesheet entry
- `PUT /api/timesheets/:id` - Update timesheet entry
- `DELETE /api/timesheets/:id` - Delete timesheet entry
- `GET /api/timesheets/total` - Get total hours for a month

## Key Features Explained

### Break Time Calculation

Break times are stored in minutes (0, 15, 30, 45, or 60) and automatically deducted from the total work duration:

```
Actual Work Hours = (End Time - Start Time) - Break Time
```

### Monthly Summaries

The overview displays:

- **Total Hours:** Sum of all work hours for the selected month
- **Total Amount:** Total hours × hourly rate (from user settings)

### Swipe Actions

On the timesheet list:

- **Swipe left:** Edit the entry
- **Swipe right:** Delete the entry (with confirmation)

## Building for Production

### Web Build

```bash
ionic build --prod
```

### Android APK/Bundle

```bash
ionic build --prod
npx cap sync android
# Open in Android Studio and build signed APK/Bundle
```

### iOS App

```bash
ionic build --prod
npx cap sync ios
# Open in Xcode and archive for App Store
```

## Configuration

### Capacitor Configuration

The app configuration is in `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.timesheet",
  appName: "Timesheet",
  webDir: "www",
  bundledWebRuntime: false,
};

export default config;
```

### Proxy Configuration

For local development, API calls are proxied through `proxy.conf.json` to avoid CORS issues.

## Troubleshooting

### iOS Date/Time Pickers Not Working

The app forces Material Design mode (`mode="md"`) on all date/time pickers for consistent behavior across platforms.

### Break Time Not Updating Duration

Ensure the `breakTimeSignal` is properly connected via the form's `valueChanges` subscription.

### Build Errors

Clear the build cache:

```bash
rm -rf www .angular node_modules
npm install
ionic build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

**Version:** 0.0.1  
**Last Updated:** November 2025
