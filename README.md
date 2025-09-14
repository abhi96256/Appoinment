# 🏥 Appointment Booking System (Vite + React)

A modern and beautiful appointment booking system built with Vite and React. This system provides customers with the ability to book services and admins with management capabilities.

## ✨ Key Features

### 🎯 Customer Features
- **Service Browsing**: View and filter all available services
- **Real-time Availability**: Check live time slots
- **Easy Booking**: Book appointments with a simple form
- **Booking Confirmation**: Email and SMS confirmation
- **Booking History**: View all your bookings
- **Reviews & Ratings**: Give reviews for services
- **Dark/Light Mode**: Theme switching
- **Multi-language Support**: Hindi/English support
- **Responsive Design**: Works on both mobile and desktop

### 🔧 Admin Features
- **Dashboard**: Complete analytics and statistics
- **Booking Management**: Manage all bookings
- **Service Management**: Add, edit, delete services
- **Calendar View**: Visual calendar interface
- **Customer Management**: View customer details
- **Review Management**: Approve/disapprove reviews
- **Analytics**: Revenue and booking statistics
- **Real-time Notifications**: Live updates

### 🚀 Technical Features
- **Modern Stack**: Vite + React + Node.js + Express
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT-based admin auth
- **Email Integration**: Nodemailer for emails
- **SMS Integration**: Twilio for SMS
- **Real-time Updates**: Socket.io
- **PWA Support**: Progressive Web App
- **AI Chatbot**: Customer support chatbot

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Project
   ```bash
git clone <your-repo-url>
   cd appoint
   ```

### 2. Install Dependencies
   ```bash
# For both Frontend and Backend
npm run install:all

# Or separately
npm install                    # Frontend
cd backend && npm install      # Backend
```

### 3. Setup Environment Variables
   ```bash
# For Backend
cp backend/env.example backend/.env

# For Frontend (optional)
   cp env.example .env
```

### 4. Setup Database
   ```bash
# Run database migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 5. Start the Project
   ```bash
# Start both servers in development mode
   npm run dev

# Or separately
npm run backend    # Backend server (port 3001)
npm run dev        # Frontend server (port 5173)
```

## 📱 How to Use

### For Customers:

#### 1. Browse Services
- Go to the home page
- View available services
- Click for service details
- See price, duration, description

#### 2. Make a Booking
- Select a service
- Pick a date
- View available time slots
- Fill in personal details (Name, Email, Phone)
- Click "Book Now" button
- Receive confirmation code

#### 3. View Booking History
- Go to customer dashboard
- Enter email address
- View all your bookings
- Check booking status

#### 4. Give Reviews
- After completed booking
- Go to service page
- Click "Write Review" button
- Give rating and comment
- Submit

### For Admins:

#### 1. Login
- Go to admin login page
- Default credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

#### 2. Use Dashboard
- View overview statistics
- Check today's bookings
- View revenue analytics
- Identify popular services

#### 3. Booking Management
- View all bookings list
- Filter by status or date
- Search customers
- Cancel bookings
- Edit booking details

#### 4. Service Management
- Add new services
- Edit existing services
- Deactivate services
- Update service pricing

#### 5. Review Management
- View pending reviews
- Approve/disapprove reviews
- Delete inappropriate reviews

## 🔧 API Endpoints

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Specific service details
- `POST /api/services` - Create new service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Bookings
- `POST /api/book` - Create new booking
- `GET /api/bookings` - All bookings (Admin)
- `GET /api/bookings/customer/:email` - Customer bookings
- `GET /api/bookings/:id` - Specific booking
- `POST /api/bookings/:id/cancel` - Cancel booking (Admin)

### Availability
- `GET /api/avail?service_id=1&date=2024-01-15` - Available slots

### Reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews/service/:serviceId` - Service reviews
- `GET /api/reviews` - All reviews (Admin)
- `PUT /api/reviews/:id/approve` - Approve review (Admin)
- `DELETE /api/reviews/:id` - Delete review (Admin)

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

## 🎨 UI Components

### Main Pages
- **HomePage**: Service listing and search
- **ServiceDetailPage**: Service details and booking form
- **BookingPage**: Booking process
- **ConfirmationPage**: Booking confirmation
- **CustomerDashboard**: Customer bookings history
- **AdminDashboard**: Admin management interface
- **AdminCalendar**: Calendar view for bookings

### Reusable Components
- **SearchBar**: Service search functionality
- **FloatingActionButton**: Quick actions
- **AnimatedBackground**: Visual effects
- **DarkModeToggle**: Theme switching
- **LanguageToggle**: Language switching
- **NotificationCenter**: Real-time notifications
- **ReviewModal**: Review submission
- **PaymentModal**: Payment processing
- **AIChatbot**: Customer support

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_here_12345
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Database
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
```

## 📊 Database Schema

### Services Table
- `id` (Primary Key)
- `name` (Service name)
- `duration` (Duration in minutes)
- `price` (Service price)
- `description` (Service description)
- `isActive` (Active status)

### Bookings Table
- `id` (Primary Key)
- `serviceId` (Foreign Key)
- `customerName` (Customer name)
- `customerEmail` (Customer email)
- `customerPhone` (Customer phone)
- `bookingDate` (Booking date)
- `startTime` (Start time)
- `endTime` (End time)
- `status` (confirmed/cancelled/completed)
- `confirmationCode` (Unique code)
- `notes` (Additional notes)

### Reviews Table
- `id` (Primary Key)
- `serviceId` (Foreign Key)
- `bookingId` (Foreign Key)
- `customerName` (Customer name)
- `customerEmail` (Customer email)
- `rating` (1-5 stars)
- `comment` (Review text)
- `isApproved` (Admin approval)
- `isVerified` (Booking verification)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build files
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Configure database URL
# Deploy
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Use different port
   PORT=3002 npm run backend
   ```

2. **Database Connection Error**
   ```bash
   # Check database file
   ls -la backend/database.sqlite
   ```

3. **Email Not Sending**
   - Check Gmail app password
   - Verify SMTP settings

4. **SMS Not Working**
   - Check Twilio credentials
   - Verify phone number format

## 📝 Scripts

```bash
# Development
npm run dev              # Frontend development server
npm run backend          # Backend development server
npm run backend:start    # Backend production server

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed demo data

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Setup
npm run setup            # Initial project setup
npm run install:all      # Install all dependencies
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any problems:
- Report on GitHub Issues
- Check documentation
- Review code comments

---

**Made with ❤️ using Vite + React + Node.js + Express**