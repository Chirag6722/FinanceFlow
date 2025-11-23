# FinanceFlow

**FinanceFlow** is a modern, comprehensive personal finance tracker designed to help you take control of your financial life. Manage your income, expenses, budgets, and investments all in one beautiful, responsive interface.

## ✨ Features

*   **📊 Dashboard Overview**: Get a quick snapshot of your financial health with real-time summaries and charts.
*   **💸 Transaction Management**: Easily add and categorize income and expenses.
*   **📅 Recurring Transactions**: Set up automated recurring entries for subscriptions and bills.
*   **💰 Budget Planning**: Create monthly budgets for different categories and track your spending limits.
*   **📈 Investment Portfolio**: Track your stocks, mutual funds, and other assets.
*   **📉 Analytics & Reports**: Visualize your spending habits with detailed charts and graphs using Recharts.
*   **📱 Responsive Design**: Fully optimized for desktop and mobile devices.

## 🛠️ Tech Stack

*   **Frontend**: [React](https://react.dev/) (powered by [Vite](https://vitejs.dev/))
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Hosting)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Date Handling**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Chirag6722/FinanceFlow.git
    cd FinanceFlow
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Firebase Configuration**
    *   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Authentication** (Email/Password, Google).
    *   Enable **Cloud Firestore**.
    *   Create a web app in Firebase settings and copy the configuration keys.
    *   Create a `.env` file in the root directory and add your Firebase config:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
