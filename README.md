# Costotus

[![Deploy to GitHub Pages](https://github.com/donis3/react-costcalc/actions/workflows/deploy.yml/badge.svg)](https://github.com/donis3/react-costcalc/actions/workflows/deploy.yml)
![Version](https://img.shields.io/badge/version-0.2.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react)

**Live Demo:** [https://costotus.com](https://costotus.com)

**A free, open-source cost calculation application for small manufacturing businesses.**

Costotus helps you track expenses, manage materials, create recipes, and analyze your production costs—all in your browser with complete privacy.

---

## 🌟 Features

### 📊 **Cost Analysis & Tracking**
- Track materials, packaging, recipes, and end products
- Real-time cost calculations as you update data
- Visual cost breakdowns with interactive charts
- Historical expense tracking with trend analysis

### 🏭 **Manufacturing Management**
- **Materials**: Track raw materials with cost history and currency support
- **Recipes**: Create production recipes with ingredients and labor costs
- **Products**: Manage semi-finished products used in manufacturing
- **Packages**: Define packaging materials and costs
- **End Products**: Calculate final product costs including all components

### 💼 **Company & Expenses**
- Company profile management
- Employee management with labor cost tracking
- General expenses and overhead costs
- Production capacity and cost per unit calculations

### 🌍 **Multi-Language & Multi-Currency**
- Full internationalization support (English, Turkish)
- Multi-currency with exchange rate tracking
- Automatic exchange rate updates from external APIs
- Historical currency conversion rates with charts

### 🎨 **Modern UI/UX**
- Built with React and TailwindCSS
- DaisyUI components for consistent design
- Multiple theme support (Emerald, Cupcake, Bumblebee, Dark, Light)
- Responsive design for mobile and desktop
- Modern navbar with smooth animations

### 🔒 **Privacy & Security**
- **100% Local Storage**: All data stored in browser's local storage
- **No External Servers**: No data leaves your device
- **No Account Required**: Start using immediately
- **Export/Import**: Full backup and restore functionality

### 🎮 **Demo Mode**
- Try the app with pre-loaded sample data (Lemonade & Supplement businesses)
- Safe exploration without affecting real data
- Easy transition from demo to production mode

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/donis3/react-costcalc.git
cd react-costcalc
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `build/` directory.

---

## 📱 Usage

### First Time Setup

1. **Welcome Screen**: Choose to start fresh or load a demo
2. **Company Setup**: Enter your company information
3. **Currency Selection**: Set your base currency
4. **Start Adding Data**: Begin with materials, then recipes, then end products

### Main Modules

- **End Products**: Your final sellable products with complete cost breakdown
- **Materials**: Raw materials with purchase history
- **Packages**: Packaging materials and containers
- **Manufacturing**: 
  - Products: Semi-finished goods
  - Recipes: Production instructions with ingredients and labor
- **Company**:
  - Company Info: Business details and production capacity
  - Employees: Staff and labor costs
  - Expenses: General overhead and operating costs

### Tips

- Start by adding materials and their costs
- Create recipes that use those materials
- Build products from recipes
- Add packaging options
- Finally, create end products that combine everything

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 17.0.2
- **Routing**: React Router DOM 6
- **Styling**: TailwindCSS 3 + DaisyUI 2
- **State Management**: React Context API
- **Charts**: Chart.js 3 with react-chartjs-2
- **Forms & Validation**: Joi
- **Internationalization**: i18next + react-i18next
- **Date Handling**: date-fns
- **Icons**: React Icons
- **Notifications**: React Toastify
- **HTTP Client**: Axios

---

## 📂 Project Structure

```
react-costcalc/
├── public/
│   ├── locales/           # Translation files (en, tr)
│   └── img/               # Images and assets
├── src/
│   └── v2/
│       ├── components/    # Reusable UI components
│       ├── context/       # React Context providers
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Page components
│       ├── router/        # Application routing
│       ├── config/        # Configuration files
│       ├── data/          # Demo data
│       └── helpers/       # Utility functions
└── package.json
```

---

## 🌐 Localization

The app supports multiple languages through i18next. Translation files are located in `public/locales/`.

To add a new language:
1. Create a new folder in `public/locales/` (e.g., `de/` for German)
2. Copy translation files from `en/` or `tr/`
3. Translate the JSON content
4. Run the translation sync script:
```bash
npm run translation-sync
```

---

## 🔧 Configuration

### Theme Customization

Edit `src/v2/config/config.json` to customize:
- Available themes
- App name and branding
- Module icons and colors
- Exchange rate API settings

### Tailwind Configuration

Customize styling in `tailwind.config.js`:
- Color schemes
- Font families (default: Poppins)
- Custom animations
- DaisyUI theme settings

---

## 📊 Data Storage

All data is stored in **browser's localStorage** under the key pattern:
- `costotus_{module}`: Main data storage
- `costotus_settings`: App settings
- `costotus_company`: Company information

**Important**: 
- Data persists across sessions
- Clearing browser data will delete all information
- Regular exports/backups are recommended

---

## 🤝 Contributing

Contributions are welcome! This project was created as a learning experience, and there's always room for improvement.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

This is **experimental free software**. While care has been taken in development:
- Always verify calculations independently
- Do not rely solely on this app for critical business decisions
- No guarantees are provided regarding accuracy
- Use at your own risk

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Donis3**
- GitHub: [@donis3](https://github.com/donis3)

---

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Icons by React Icons
- UI components by DaisyUI
- Exchange rate data from various free APIs

---

## 📮 Support

If you encounter issues or have suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via pull requests

---

**Made with ❤️ for small businesses**
