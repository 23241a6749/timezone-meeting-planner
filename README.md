# 🕒 Time Zone Meeting Planner
A simple, web-based tool that helps users from different time zones find overlapping 1-hour time slots for virtual meetings. Just enter two or more cities or countries, and the app shows shared time windows between 9:00 AM and 8:00 PM in each participant’s **local time**.

## 🌍 Live Demo
➡️ [Click here to try it live](https://23241a6749.github.io/timezone-meeting-planner/)

## 🛠️ Features
- Enter any number of cities or countries.
- Automatically resolves time zones via OpenCage API.
- Converts local 9 AM – 8 PM availability to UTC.
- Finds **common 1-hour meeting slots** across all participants.
- Displays meeting time in both **UTC** and **each local time zone**.

## 🖼️ Screenshots
![image](https://github.com/user-attachments/assets/7f9efcf2-9952-4bb4-bc7b-84ea0a6989b1)

## 🚀 Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/23241a6749/timezone-meeting-planner.git
cd timezone-meeting-planner
```

### 2. Open in Browser
Open `index.html` in your browser.

## 🔑 API Key (Required)
This app uses the [OpenCage Geocoding API](https://opencagedata.com/api) to resolve timezones from city names.

1. Sign up at [OpenCage](https://opencagedata.com/)
2. Replace the API key in `script.js`:
```js
const OPENCAGE_API_KEY = "YOUR_API_KEY_HERE";
```

## 💡 Example
If you enter:
- New York
- London
- Tokyo

The app will show:
- UTC windows:  
  - NY: 13:00 – 00:00  
  - London: 08:00 – 19:00  
  - Tokyo: 00:00 – 11:00  
- Common slot: ❌ None

Try:
- New York
- Berlin
- London → ✅ Overlap between 14:00–17:00 UTC

## ⚙️ Technologies Used
- HTML, CSS, JavaScript
- [Luxon](https://moment.github.io/luxon/) for timezone handling
- [OpenCage Geocoder API](https://opencagedata.com/) for city → timezone mapping

## 📦 Folder Structure
```
timezone-meeting-planner/
├── index.html
├── style.css
├── script.js
└── screenshots/
```

## ✍️ Author
Made with ❤️ by [23241a6749](https://github.com/23241a6749)

## 📄 License
This project is licensed under the [MIT License](LICENSE).
