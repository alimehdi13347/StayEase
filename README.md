

# 🏡 StayEase – Smart Property Listing Platform

StayEase is a full-stack listing app built with the MERN stack, designed to simplify property discovery with real-time features, weather insights, and interactive maps. Whether you're showcasing rentals, travel stays, or local listings, StayEase delivers a clean, responsive experience with powerful backend logic.

## 🚀 Live Demo  
**Coming soon** – deploy via Render or Railway for instant access.

## 🧰 Tech Stack

| Layer       | Tools Used                          |
|-------------|-------------------------------------|
| Frontend    | EJS, CSS, JavaScript                |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB                             |
| Real-Time   | Socket.IO                           |
| APIs        | OpenWeatherMap, Leaflet.js          |
| Auth        | Custom middleware, session handling |

## ✨ Features

- 🗺️ **Interactive Map** – View listings with dynamic markers using Leaflet.js  
- 🌤️ **Live Weather** – Get real-time weather data for each location via OpenWeatherMap  
- 💬 **Real-Time Chat** – Users can message instantly using Socket.IO  
- 🔍 **Search & Filter** – Find listings by location, type, and other parameters  
- 📱 **Mobile Responsive** – Clean UI across devices  
- 🔐 **Authentication** – Secure login and session management

---

## 📸 Screenshots

### 🏠 Home Page
A clean landing page showcasing listings with responsive layout.

![Home Page](./public/assets/screenshots/home.png)

---

### 📍 Single Listing View
Displays listing details, owner info, and action buttons.

![Listing Page](./public/assets/screenshots/listing.png)

---

### 🌦️ Features: Reviews, Map & Weather
Includes dynamic map (Leaflet), live weather (OpenWeatherMap), and user reviews.

![Features](./public/assets/screenshots/features.png)

---


## 🏗️ Project Structure

```bash
StayEase/
├── controllers/
├── models/
├── routes/
├── views/          # EJS templates
├── public/         # Static assets
├── utils/          # API integrations, helpers
├── middleware.js   # Auth & error handling
└── server.js       # Entry point
```

## 🛠️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/alimehdi13347/StayEase

# Install dependencies
cd StayEase
npm install

# Add your environment variables
touch .env
# Include MONGO_URI, WEATHER_API_KEY, etc.

# Run the server
npm start
```

## 🧪 Future Enhancements

- ✅ Add user profiles and saved listings  
- ✅ Integrate image uploads via Cloudinary  
- ✅ Add automated tests with Playwright or Selenium  
- ✅ Deploy with CI/CD pipeline

## 👨‍💻 Author

**Ali Mehdi** – MERN stack developer passionate about clean UI, real-time features, and practical business logic.  
📬 [LinkedIn](https://www.linkedin.com/in/alimehdi13347) | 🧠 [Portfolio](#)

---

