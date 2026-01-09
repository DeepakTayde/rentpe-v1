import { ReactNode } from "react";
import MobileBottomNav from "./MobileBottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mobile-bottom-spacing">
      {children}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;