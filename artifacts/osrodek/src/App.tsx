import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import Rooms from './pages/public/Rooms';
import RoomDetail from './pages/public/RoomDetail';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Reservation from './pages/public/Reservation';

// Admin — ładowany leniwie w osobnym chunku, żeby goście strony publicznej
// nie pobierali kodu panelu (ok. połowa bundla).
const AdminLayout = lazy(() =>
  import('./components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminRooms = lazy(() => import('./pages/admin/Rooms'));
const AdminRoomForm = lazy(() => import('./pages/admin/RoomForm'));
const AdminBookings = lazy(() => import('./pages/admin/Bookings'));
const AdminAvailability = lazy(() => import('./pages/admin/Availability'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminPosts = lazy(() => import('./pages/admin/Posts'));

import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" nest>
        <Suspense fallback={<AdminFallback />}>
          <AdminLayout>
            <Switch>
              <Route path="/login" component={AdminLogin} />
              <Route path="/" component={AdminDashboard} />
              <Route path="/pokoje" component={AdminRooms} />
              <Route path="/pokoje/nowy" component={AdminRoomForm} />
              <Route path="/pokoje/:id/edytuj" component={AdminRoomForm} />
              <Route path="/rezerwacje" component={AdminBookings} />
              <Route path="/dostepnosc" component={AdminAvailability} />
              <Route path="/galeria" component={AdminGallery} />
              <Route path="/aktualnosci" component={AdminPosts} />
              <Route path="/ustawienia" component={AdminSettings} />
              <Route component={NotFound} />
            </Switch>
          </AdminLayout>
        </Suspense>
      </Route>

      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      <Route path="/pokoje">
        <PublicLayout>
          <Rooms />
        </PublicLayout>
      </Route>
      <Route path="/pokoj/:id">
        {params => (
          <PublicLayout>
            <RoomDetail id={params.id} />
          </PublicLayout>
        )}
      </Route>
      <Route path="/galeria">
        <PublicLayout>
          <Gallery />
        </PublicLayout>
      </Route>
      <Route path="/kontakt">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      <Route path="/rezerwacja">
        <PublicLayout>
          <Reservation />
        </PublicLayout>
      </Route>

      {/* Fallback */}
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
