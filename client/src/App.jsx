import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const location = useLocation();
  const isPlaceRoute = location.pathname.startsWith('/place/');
  const isPublicBusinessProfile = /^\/business\/[^/]+$/.test(location.pathname) && location.pathname !== '/business/dashboard';
  const isConsultancyPage = location.pathname.endsWith('/consultancies');
  const hideChrome = isPlaceRoute || isPublicBusinessProfile || isConsultancyPage;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {!hideChrome && <Header />}
      <main className="flex-1 bg-[radial-gradient(circle_at_8%_8%,rgba(20,184,166,0.10),transparent_22rem),radial-gradient(circle_at_92%_35%,rgba(59,130,246,0.09),transparent_26rem)]">
        <AppRoutes />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsAppButton />}
    </div>
  );
}