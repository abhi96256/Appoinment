# 🏥 Appointment Booking System (Vite + React)

एक आधुनिक और सुंदर appointment booking system जो Vite और React के साथ बनाया गया है। यह system customers को services book करने और admins को manage करने की सुविधा देता है।

## ✨ मुख्य Features (Key Features)

### 🎯 Customer Features
- **Service Browsing**: सभी available services को देखना और filter करना
- **Real-time Availability**: Live time slots check करना
- **Easy Booking**: Simple form के साथ booking करना
- **Booking Confirmation**: Email और SMS confirmation
- **Booking History**: अपनी सभी bookings देखना
- **Reviews & Ratings**: Services के लिए reviews देना
- **Dark/Light Mode**: Theme switching
- **Multi-language Support**: Hindi/English support
- **Responsive Design**: Mobile और desktop दोनों के लिए

### 🔧 Admin Features
- **Dashboard**: Complete analytics और statistics
- **Booking Management**: सभी bookings को manage करना
- **Service Management**: Services add, edit, delete करना
- **Calendar View**: Visual calendar interface
- **Customer Management**: Customer details देखना
- **Review Management**: Reviews approve/disapprove करना
- **Analytics**: Revenue और booking statistics
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
- Node.js (v16 या उससे ऊपर)
- npm या yarn

### 1. Project Clone करें
   ```bash
git clone <your-repo-url>
   cd appoint
   ```

### 2. Dependencies Install करें
   ```bash
# Frontend और Backend दोनों के लिए
npm run install:all

# या अलग-अलग
npm install                    # Frontend
cd backend && npm install      # Backend
```

### 3. Environment Variables Setup करें
   ```bash
# Backend के लिए
cp backend/env.example backend/.env

# Frontend के लिए (optional)
   cp env.example .env
```

### 4. Database Setup करें
   ```bash
# Database migrate करें
npm run db:migrate

# Demo data seed करें
npm run db:seed
```

### 5. Project Start करें
   ```bash
# Development mode में दोनों servers start करें
   npm run dev

# या अलग-अलग
npm run backend    # Backend server (port 3001)
npm run dev        # Frontend server (port 5173)
```

## 📱 How to Use (कैसे Use करें)

### Customer के लिए:

#### 1. Service Browse करना
- Home page पर जाएं
- Available services को देखें
- Service details के लिए click करें
- Price, duration, description देखें

#### 2. Booking करना
- Service select करें
- Date pick करें
- Available time slots देखें
- Personal details भरें (Name, Email, Phone)
- "Book Now" button click करें
- Confirmation code मिलेगा

#### 3. Booking History देखना
- Customer dashboard पर जाएं
- Email address enter करें
- अपनी सभी bookings देखें
- Booking status check करें

#### 4. Review देना
- Completed booking के बाद
- Service page पर जाएं
- "Write Review" button click करें
- Rating और comment दें
- Submit करें

### Admin के लिए:

#### 1. Login करना
- Admin login page पर जाएं
- Default credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

#### 2. Dashboard Use करना
- Overview statistics देखें
- Today's bookings check करें
- Revenue analytics देखें
- Popular services identify करें

#### 3. Booking Management
- All bookings list देखें
- Filter by status या date
- Search customers
- Booking cancel करें
- Booking details edit करें

#### 4. Service Management
- New service add करें
- Existing services edit करें
- Service deactivate करें
- Service pricing update करें

#### 5. Review Management
- Pending reviews देखें
- Reviews approve/disapprove करें
- Inappropriate reviews delete करें

## 🔧 API Endpoints

### Services
- `GET /api/services` - सभी services list करें
- `GET /api/services/:id` - Specific service details
- `POST /api/services` - New service create करें (Admin)
- `PUT /api/services/:id` - Service update करें (Admin)
- `DELETE /api/services/:id` - Service delete करें (Admin)

### Bookings
- `POST /api/book` - New booking create करें
- `GET /api/bookings` - All bookings (Admin)
- `GET /api/bookings/customer/:email` - Customer bookings
- `GET /api/bookings/:id` - Specific booking
- `POST /api/bookings/:id/cancel` - Booking cancel करें (Admin)

### Availability
- `GET /api/avail?service_id=1&date=2024-01-15` - Available slots

### Reviews
- `POST /api/reviews` - New review create करें
- `GET /api/reviews/service/:serviceId` - Service reviews
- `GET /api/reviews` - All reviews (Admin)
- `PUT /api/reviews/:id/approve` - Review approve करें (Admin)
- `DELETE /api/reviews/:id` - Review delete करें (Admin)

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Token verify करें

## 🎨 UI Components

### Main Pages
- **HomePage**: Service listing और search
- **ServiceDetailPage**: Service details और booking form
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
# Build files को deploy करें
```

### Backend (Railway/Heroku)
```bash
# Environment variables set करें
# Database URL configure करें
# Deploy करें
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Different port use करें
   PORT=3002 npm run backend
   ```

2. **Database Connection Error**
   ```bash
   # Database file check करें
   ls -la backend/database.sqlite
   ```

3. **Email Not Sending**
   - Gmail app password check करें
   - SMTP settings verify करें

4. **SMS Not Working**
   - Twilio credentials check करें
   - Phone number format verify करें

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

अगर कोई problem आए तो:
- GitHub Issues पर report करें
- Documentation check करें
- Code comments देखें

---

**Made with ❤️ using Vite + React + Node.js + Express**