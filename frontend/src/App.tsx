import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicNav from "./layouts/PublicNav";
import Home from "./public-pages/Home";
import LogIn from "./public-pages/LogIn";
import SignUp from "public-pages/SignUp";
import BookMeeting from "public-pages/BookMeeting";
import PrivateNav from "layouts/PrivateNav";
import Meetings from "private-pages/Meetings";
import Create from "private-pages/Create";
import Manage from "private-pages/Manage";
import Request from "private-pages/Request";
import Profile from "private-pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicNav />}>
          <Route index element={<Home />} />
          <Route path="book/:id" element={<BookMeeting />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/:id" element={<PrivateNav />}>
          <Route index element={<Meetings />} />
          <Route path="/user/:id/create" element={<Create />} />
          <Route path="/user/:id/manage" element={<Manage />} />
          <Route path="/user/:id/request" element={<Request />} />
          <Route path="/user/:id/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
