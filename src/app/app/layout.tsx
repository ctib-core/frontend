import { Sidebar } from "@/components/sidebar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
// import { PortfolioDashboard } from "@/components/portfolioDashboard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <div className="flex h-screen bg-background w-full overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 bg-background">
          {children}
        </div>
      </div>
    </ReactQueryProvider>
  );
};

export default layout;