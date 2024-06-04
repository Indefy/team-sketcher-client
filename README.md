
Deployed example on the following URL

 Sample : https://team-sketcher-client.onrender.com

# Team Sketcher Client

Team Sketcher is an online collaborative whiteboard application. This repository contains the client-side code built using React.js.

## Features
- Real-time collaborative drawing
- User authentication (login/register)
- Dynamic theme switching
- Undo/Redo functionality
- Save canvas as PNG image
- Export canvas as PDF

## Technologies Used
- React.js
- Socket.io-client
- jsPDF
- Context API
- React Router
- Material-UI

## Setup
1. **Clone the repository:**
   
   ```bash```
   
  " git clone https://github.com/yourusername/team-sketcher-client.git "
  " cd team-sketcher-client "

   Install dependencies:
  " npm install "
  
  Create a .env file and add inside the following line:
" REACT_APP_SERVER_URL=http://localhost:3001 "

  Running the Application
Start the development server:
  " npm start "

  Open your browser and navigate to:
  " http://localhost:3000 "

  Project Structure :
  
src/
---components/
  ---CustomToolbar.jsx
  ---Login.jsx
  ---Register.jsx
  ---ThemeProvider.jsx
  ---ThemeSelector.jsx
  --Toolbar.jsx
  ---UserList.jsx
  ---UserToolbar.jsx
  ---Whiteboard.jsx
---context/
  ---AuthContext.jsx
  ---ThemeContext.jsx
  ---WhiteboardContext.jsx
---styles/
  ---App.css
  ---index.css
  ---global.scss
  ---neumorphism.scss
  ---themes.scss
--App.jsx
--index.jsx
--setupTests.js
--.env
--.gitignore
--package.json
--README.md

  Context Controllers
 The application utilizes React's Context API for state management across different components.

AuthContext
 Handles user authentication (login, registration, logout).

ThemeContext
 Manages the application's theme (light/dark).

WhiteboardContext
 Manages the whiteboard state, including brush settings, canvas history, and connected users.

Saving Canvas as Image and PDF
 Save Image
  The handleSavePage function creates a temporary canvas, copies the main canvas content, and triggers a download of the image in PNG format.

Export to PDF
 The handleExport function uses jsPDF to create a PDF document, embeds the canvas image, and triggers a download of the PDF file.
 
Axios for API Requests
 Axios is used to handle HTTP requests to the backend server for authentication and other API interactions.

Usage in AuthContext
The AuthContext utilizes Axios for user login and registration.
## Want to contribute? Amazing! follow these steps bellow
 Contributing:
  Fork the repository.
  Create a new branch (git checkout -b feature-branch).
  Make your changes.
  Commit your changes (git commit -m 'Add some feature').
  Push to the branch (git push origin feature-branch).
  Open a pull request.

License
 This project is licensed under the MIT License - see the LICENSE file for details.
 
Deployed example on the following URL

 Sample : https://team-sketcher-client.onrender.com
