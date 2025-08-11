# LQ Calculator - BED & EQD2 Calculator

A modern, responsive web application for calculating Biologically Effective Dose (BED) and Equivalent Dose in 2 Gy fractions (EQD2) using the Linear Quadratic (LQ) model in radiobiology.

## Features

### 🧮 Core Functionality
- **BED Calculation**: Calculate Biologically Effective Dose using the LQ model
- **EQD2 Calculation**: Convert to equivalent dose in 2 Gy fractions
- **Multiple Schedules**: Compare and combine up to 3 treatment schedules
- **Flexible α/β Ratios**: Preset values for common tissue types + custom input

### 📱 Cross-Platform Compatibility
- **Mobile Optimized**: Perfect for iPhone, iPad, and Android devices
- **Desktop Ready**: Full functionality on all desktop browsers
- **PWA Support**: Installable as a web app on mobile devices
- **Offline Capable**: Works without internet connection after first load

### 🎨 Modern UI/UX
- **Responsive Design**: Adapts to any screen size
- **Dark Mode Support**: Automatic dark/light theme switching
- **Touch Optimized**: Smooth touch interactions on mobile devices
- **Keyboard Shortcuts**: Quick access for power users

## Usage

### Basic Calculation
1. **Select α/β Ratio**: Choose from presets (Tumor: 10, Late Effects: 3, Spinal Cord: 1.5) or enter custom value
2. **Enter Treatment Data**: 
   - Total Dose (Gy)
   - Number of Fractions
   - Dose per Fraction (Gy) - auto-calculated from total dose/fractions
3. **Activate Schedules**: Use checkboxes to include/exclude schedules
4. **View Results**: See individual and combined BED/EQD2 values

### Advanced Features
- **Auto-calculation**: Results update automatically as you type
- **Schedule Comparison**: Compare up to 3 different treatment plans
- **Combined Results**: See total BED, EQD2, dose, and fractions
- **Real-time Updates**: All calculations happen instantly

## Technical Details

### LQ Model Equations
- **BED = D × (1 + d/(α/β))**
  - D = total dose
  - d = dose per fraction
  - α/β = alpha/beta ratio

- **EQD2 = BED / (1 + 2/α/β)**
  - Converts to equivalent dose in 2 Gy fractions

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### PWA Features
- Installable on mobile devices
- Offline functionality
- App-like experience
- Automatic updates

## Installation

### Local Development
1. Clone or download the files
2. Open `index.html` in any modern web browser
3. No server required - works offline!

### Web Deployment
1. Upload all files to any web server
2. Ensure HTTPS for PWA features
3. Access via URL

### Mobile Installation
1. Open the website on your mobile device
2. Tap "Add to Home Screen" (iOS) or "Install App" (Android)
3. Use like a native app

## File Structure
```
eqd2web/
├── index.html          # Main application
├── styles.css          # Responsive styling
├── script.js           # Calculator logic
├── sw.js              # Service worker (PWA)
├── manifest.json      # Web app manifest
└── README.md          # This file
```

## Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Calculate results
- `Ctrl/Cmd + 1/2/3`: Toggle schedule 1/2/3

## Contributing

This is a standalone application designed to replicate the functionality of the LQ calc Android app. The code is open for educational and medical use.

## Medical Disclaimer

This calculator is for educational and clinical reference purposes. Always verify calculations and consult with qualified medical professionals for clinical decisions.

## License

Free for medical and educational use.

---

**Based on the Linear Quadratic Model for Radiobiology**
*Compatible with the original LQ calc Android app functionality*
