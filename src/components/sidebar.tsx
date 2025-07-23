"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Building2,
  Vault,
  FolderOpen,
  Droplets,
  ArrowLeftRight,
  Menu,
  FileText,
  BarChart,
  FileEdit,
  DollarSign,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Mail,
  // User
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Portfolio");
  const router = useRouter()

  const navigationItems = [
    { name: "markets", icon: BarChart3, count: 1 },
    { name: "trading", icon: TrendingUp, count: 1 },
    { name: "wallet", icon: Wallet, count: 1 },
    { name: "loans", icon: Building2, count: 1 },
    { name: "vaults", icon: Vault, count: 1 },
    { name: "portfolio", icon: FolderOpen, count: 1 },
    { name: "liquidity pools", icon: Droplets, count: 1 },
    { name: "swap", icon: ArrowLeftRight, count: 1 },
  ];

  const uiElements = [
    { name: "Menu Styles", icon: Menu },
    { name: "Tables", icon: FileText },
    { name: "Charts", icon: BarChart },
    { name: "Forms", icon: FileEdit },
    { name: "Pricing", icon: DollarSign },
    { name: "Settings", icon: Settings },
    { name: "Modals/Pop-Ups", icon: HelpCircle },
  ];

  const supportItems = [
    { name: "Documentation", icon: FileText },
    { name: "Support", icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-crypto-darker border-r border-crypto-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-crypto-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <Link href="/" className="text-foreground font-semibold text-lg">Predict</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-1">
              <Search className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground">Austin Robertson</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Pages Section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            PAGES
          </h3>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  // onClick={() => setActiveItem(item.name)
                  onClick={() => router.push(`/app/${item.name}`)

                  }
                  className={
                    cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      activeItem === item.name
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-crypto-card"
                    )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{item.name}</span>
                  </div>
                  <span className="text-xs">{item.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* UI Elements Section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            UI ELEMENTS
          </h3>
          <div className="space-y-1">
            {uiElements.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-crypto-card transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documentation & Support */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            DOCUMENTATION & SUPPORT
          </h3>
          <div className="space-y-1">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-crypto-card transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div >
  );
};

export { Sidebar };