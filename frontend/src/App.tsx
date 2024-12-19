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
import RequestsPage from "private-pages/RequestsPage";
import Profile from "private-pages/Profile";
import Edit from "private-pages/Edit";
import AdminNav from "layouts/AdminNav";
import Members from "admin-pages/Members";
import MeetingPoll from "private-pages/MeetingPoll";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicNav />}>
          <Route index element={<Home />} />
          <Route path="book/:id" element={<BookMeeting />} />
          <Route path="poll/:id" element={<MeetingPoll />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/:id" element={<PrivateNav />}>
          <Route index element={<Meetings />} />
          <Route path="/user/:id/create" element={<Create />} />
          <Route path="/user/:id/manage" element={<Manage />} />
          <Route path="/user/:id/manage/:meetingid/edit" element={<Edit />} />
          <Route path="/user/:id/request" element={<RequestsPage />} />
          <Route path="/user/:id/profile" element={<Profile />} />
        </Route>
        <Route path="/admin/members" element={<AdminNav />}>
          <Route index element={<Members />} />
          <Route path="/admin/members/:id" element={<Meetings />} />
          <Route path="/admin/members/:id/create" element={<Create />} />
          <Route path="/admin/members/:id/manage" element={<Manage />} />
          <Route
            path="/admin/members/:id/manage/:meetingid/edit"
            element={<Edit />}
          />
          <Route path="/admin/members/:id/request" element={<RequestsPage />} />
          <Route path="/admin/members/:id/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
