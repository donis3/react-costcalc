import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import NotFound from './components/pages/NotFound';

export default function Router() {
  return (
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/*' element={<NotFound />} />
      </Routes>
  );
}
