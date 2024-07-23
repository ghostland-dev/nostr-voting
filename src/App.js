import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import CreateEvent from './components/CreateEvent';
// import SearchEvent from './components/SearchEvent';
import EventList from './components/EventList';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        {/* <Route path="/search-event" element={<SearchEvent />} /> */}
        <Route path="/events" element={<EventList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
