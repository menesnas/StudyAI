import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - Ekranın sol kenarına tam bitişik */}
      <div className="fixed left-0 top-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Main Content - Sidebar'ın yanında */}
      <div className="flex-1 ml-64 bg-gray-900 overflow-hidden">
        <div className="h-full overflow-y-auto flex justify-center">
          <div className="w-full max-w-5xl px-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;