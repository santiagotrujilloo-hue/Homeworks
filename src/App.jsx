import Navbar from './components/Shared/Navbar';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container page">
        <AppRoutes />
      </main>
    </>
  );
}
