import type { ReactNode } from 'react';
import { useThemeStore } from '../store';
import Notification from './Notification';
import NavBar from './NavBar';

interface LayoutProps {
  children: ReactNode;
}

// Helper function for theme color (can be kept outside or moved inside if preferred)
const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'green': return 'cyber-green';
    case 'red': return 'cyber-red';
    case 'purple': return 'cyber-purple';
    default: return 'cyber-blue';
  }
};

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useThemeStore();
  const themeColor = getThemeColor(theme);

  return (
    // Root container: sets up flex column layout and relative positioning context
    <div className="relative flex min-h-screen flex-col bg-cyber-black overflow-hidden">

      {/* Background Border Lines */}
      {/* Positioned absolutely, behind other content (z-0), non-interactive */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"> {/* Added pointer-events-none here too */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-${themeColor}-glow shadow-${themeColor}-sm`} />
        <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-${themeColor}-glow shadow-${themeColor}-sm`} />
        <div className={`absolute left-0 top-0 bottom-0 w-[1px] bg-${themeColor}-glow shadow-${themeColor}-sm`} />
        <div className={`absolute right-0 top-0 bottom-0 w-[1px] bg-${themeColor}-glow shadow-${themeColor}-sm`} />
      </div>

      {/* Scanlines Effect Overlay */}
      {/* Positioned absolutely, behind other content (z-0), non-interactive */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-scanlines opacity-5" />

      {/* Navigation Bar */}
      {/* Rendered before main content in DOM, check its internal styling (position, z-index) */}
      {/* Added a z-index to ensure it's above the main content if needed */}
      <div className="relative z-20"> {/* Wrap NavBar to control its stacking context relative to main */}
           <NavBar />
      </div>


      {/* Main Content Area */}
      {/* Takes up remaining space, added explicit z-index to place it above background */}
      <main className="relative z-10 flex flex-1 flex-col p-4"> {/* Added relative and z-10 */}
          {children}
      </main>

      {/* Notification Component */}
      {/* Rendered last, check its internal styling (position, z-index) */}
      {/* Notifications often need a high z-index to appear over everything */}
      <Notification />

    </div>
  );
};

export default Layout;
