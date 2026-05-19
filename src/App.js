// import './App.css';

// import React, { createContext, useState } from "react";
// import { Grid, Paper } from "@mui/material";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import TopBar from "./components/TopBar";
// import UserDetail from "./components/UserDetail";
// import UserList from "./components/UserList";
// import UserPhotos from "./components/UserPhotos";

// export const AdvancedFeaturesContext = createContext({
//   advanced: false,
//   setAdvanced: () => { },
// });

// const App = () => {
//   const [advanced, setAdvanced] = useState(false);

//   return (
//     <AdvancedFeaturesContext.Provider value={{ advanced, setAdvanced }}>
//       <Router>
//         <div>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TopBar />
//             </Grid>
//             <div className="main-topbar-buffer" />
//             <Grid item sm={3}>
//               <Paper className="main-grid-item">
//                 <UserList />
//               </Paper>
//             </Grid>
//             <Grid item sm={9}>
//               <Paper className="main-grid-item">
//                 <Routes>
//                   <Route path="/users/:userId" element={<UserDetail />} />
//                   <Route path="/photos/:userId/:photoIndex" element={<UserPhotos />} />
//                   <Route path="/photos/:userId" element={<UserPhotos />} />
//                   <Route path="/users" element={<UserList />} />
//                 </Routes>
//               </Paper>
//             </Grid>
//           </Grid>
//         </div>
//       </Router>
//     </AdvancedFeaturesContext.Provider>
//   );
// };

// export default App;
import './App.css';

import React, {
  createContext,
  useState
} from "react";

import {
  Grid,
  Paper
} from "@mui/material";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

export const AdvancedFeaturesContext = createContext({
  advanced: false,
  setAdvanced: () => { },
});

const App = () => {

  const [advanced, setAdvanced] = useState(false);

  // user dang login
  const [currentUser, setCurrentUser] = useState(null);

  // counter to force UserPhotos refresh after upload
  const [photoVersion, setPhotoVersion] = useState(0);
  const handlePhotoUpload = () => setPhotoVersion((v) => v + 1);

  // neu chua login -> hien login page
  if (!currentUser) {
    return (
      <AdvancedFeaturesContext.Provider
        value={{ advanced, setAdvanced }}
      >
        <Router>
          <div>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TopBar
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  onPhotoUpload={handlePhotoUpload}
                />
              </Grid>

              <div className="main-topbar-buffer" />

              <Grid item xs={12}>
                <Paper className="main-grid-item">

                  <LoginRegister
                    setCurrentUser={setCurrentUser}
                  />

                </Paper>
              </Grid>

            </Grid>
          </div>
        </Router>
      </AdvancedFeaturesContext.Provider>
    );
  }

  return (
    <AdvancedFeaturesContext.Provider
      value={{ advanced, setAdvanced }}
    >

      <Router>
        <div>

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TopBar
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onPhotoUpload={handlePhotoUpload}
              />
            </Grid>

            <div className="main-topbar-buffer" />

            <Grid item sm={3}>
              <Paper className="main-grid-item">

                <UserList />

              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper className="main-grid-item">

                <Routes>

                  <Route
                    path="/users/:userId"
                    element={<UserDetail />}
                  />

                  <Route
                    path="/photos/:userId/:photoIndex"
                    element={<UserPhotos key={photoVersion} />}
                  />

                  <Route
                    path="/photos/:userId"
                    element={<UserPhotos key={photoVersion} />}
                  />

                  <Route
                    path="/users"
                    element={<UserList />}
                  />

                  {/* route mac dinh */}
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={`/users/${currentUser._id}`}
                      />
                    }
                  />

                </Routes>

              </Paper>
            </Grid>

          </Grid>

        </div>
      </Router>

    </AdvancedFeaturesContext.Provider>
  );
};

export default App;