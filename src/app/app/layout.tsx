import { Sidebar } from "@/components/sidebar";
// import { PortfolioDashboard } from "@/components/portfolioDashboard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;