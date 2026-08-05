import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Rooms from './pages/public/Rooms';
import RoomDetail from './pages/public/RoomDetail';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Reservation from './pages/public/Reservation';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRooms from './pages/admin/Rooms';
import AdminRoomForm from './pages/admin/RoomForm';
import AdminBookings from './pages/admin/Bookings';
import AdminAvailability from './pages/admin/Availability';
import AdminGallery from './pages/admin/Gallery';
import AdminSettings from './pages/admin/Settings';

import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" nest>
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
            <Route path="/ustawienia" component={AdminSettings} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
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
