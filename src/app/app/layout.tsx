import { Sidebar } from "@/components/sidebar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
// import { PortfolioDashboard } from "@/components/portfolioDashboard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <div className="flex h-screen fixed bg-background w-full shrink">
        <Sidebar />
        {children}
      </div>
    </ReactQueryProvider>
  );
};

export default layout;