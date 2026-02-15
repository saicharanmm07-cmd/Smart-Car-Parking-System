🚗 Smart Car Parking Management System
Full-stack web application built with Spring Boot 3.3.5, MySQL, and modern frontend (HTML/CSS/JS). Allows users to book parking slots, view bookings, leave reviews with ratings, and earn rewards.

✨ Features
User Authentication: Secure login/signup with JWT

Real-time Booking: Search and reserve parking slots

Review System: Rate parking experiences (1-5 stars)

Rewards Dashboard: Track loyalty points

Responsive UI: Works on desktop/mobile

🛠 Tech Stack
text
Backend: Spring Boot + JPA + MySQL
Frontend: HTML5/CSS3/JavaScript
Security: Spring Security
Tools: Maven, IntelliJ IDEA
🚀 Quick Start
bash
# Clone & Build
git clone <your-repo-url>
cd parking-system
mvn clean install
mvn spring-boot:run

# Access
http://localhost:8080
📱 Pages
Home: Dashboard overview

Booking: Find/reserve slots

Reviews: Rate past bookings

Rewards: Loyalty points

Auth: Login/Signup

📂 Project Structure
text
src/main/java/com/carparking/parking_system/
├── controller/    # REST APIs
├── entity/        # JPA Models (User, Booking, Review)
├── service/       # Business Logic
└── repository/    # Data Access
🏗 Database Setup
text
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/parking_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
🤝 Contributing
Fork the repo

Create feature branch (git checkout -b feature/parking-search)

Commit changes (git commit -m 'Add parking search')

Push & PR

📄 License
MIT License - feel free to use/modify!

⭐ Star if helpful! Built for learning Spring Boot full-stack development.

actually i had added admin also to my project so based on it give a perfect readme section
🚗 Smart Car Parking Management System
Full-stack web application with Admin Dashboard built using Spring Boot 3.3.5, MySQL, and modern frontend. Users book parking slots, leave reviews, earn rewards while admins manage the system.

✨ Features
👥 User Features
Secure login/signup with JWT

Real-time parking slot booking

Review & rating system (1-5 stars)

Rewards & loyalty points dashboard

Responsive mobile-friendly UI

👨‍💼 Admin Features
Dashboard with analytics overview

View/manage all user bookings

Approve/reject parking requests

Monitor reviews and ratings

System configuration panel

🛠 Tech Stack
text
Backend: Spring Boot + JPA + MySQL + Spring Security
Frontend: HTML5/CSS3/JavaScript
Tools: Maven, IntelliJ IDEA
🚀 Quick Start
bash
git clone <your-repo-url>
cd parking-system
mvn clean install
mvn spring-boot:run

# User: http://localhost:8080
# Admin: http://localhost:8080/admin (admin@parking.com / admin123)
📱 Pages
User Pages:

Home/Dashboard

Booking System

My Bookings

Reviews

Rewards

Admin Pages:

Admin Dashboard

All Bookings Management

User Management

Reviews Moderation

System Settings

📂 Project Structure
text
src/main/java/com/carparking/parking_system/
├── controller/     # User + Admin APIs
├── entity/         # User, Booking, Review, Admin
├── service/        # Business + Admin Logic
├── repository/     # Data Access Layer
└── security/       # Role-based Access
🏗 Database Setup
text
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/parking_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
🎯 Role-based Access
text
ROLE_USER:  Booking, Reviews, Rewards
ROLE_ADMIN: All features + Management
🤝 Contributing
Fork → Clone → Create feature branch

mvn clean test

Commit → Push → PR

Test both User & Admin flows

📄 License
MIT License

⭐ Star the repo! Production-ready parking system with complete admin panel.

