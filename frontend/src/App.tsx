import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./layouts/NavBar";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "pages/SignUp";
import BookMeeting from "pages/BookMeeting";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="book/:id" element={<BookMeeting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
