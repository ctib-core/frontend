"use client"
import { useState, useEffect } from "react";
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
  LogOut,
  // User
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAccount, useConnect } from '@particle-network/connectkit';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Portfolio");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Particle Network ConnectKit hooks
  const { address, isConnected } = useAccount();
  const { connect, data: userData } = useConnect();

  // Fix hydration error by ensuring client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  console.log("Sidebar - isConnected:", isConnected);
  console.log("Sidebar - address:", address);
  console.log("Sidebar - userData:", userData);

  // Function to get display name
  const getDisplayName = () => {
    console.log("getDisplayName called - isConnected:", isConnected, "address:", address);
    
    if (!mounted) {
      return "Loading...";
    }
    
    if (!isConnected) {
      return "Connect Wallet";
    }

    // If wallet is connected, show truncated address
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    return "Connected";
  };

  // Function to get user avatar
  const getUserAvatar = () => {
    // For ConnectKit, we don't have direct access to social login avatars
    // We'll use a default avatar or generate one based on the address
    return "";
  };

  // Don't render the disconnect button until mounted to prevent hydration mismatch
  const shouldShowDisconnect = mounted && isConnected;

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
    <div className="w-full bg-crypto-darker border-r border-crypto-border flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="p-3 border-b border-crypto-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">E</span>
            </div>
            <Link href="/" className="text-foreground font-semibold text-sm">Predict</Link>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Search className="w-3 h-3 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Bell className="w-3 h-3 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Mail className="w-3 h-3 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Pages Section */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            PAGES
          </h3>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  prefetch={true}
                  href={`/app/${item.name}`}
                  className={
                    cn(
                      "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors cursor-pointer",
                      activeItem === item.name
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-crypto-card"
                    )}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="capitalize text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs">{item.count}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* UI Elements Section */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            UI ELEMENTS
          </h3>
          <div className="space-y-1">
            {uiElements.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-crypto-card transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documentation & Support */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            DOCUMENTATION & SUPPORT
          </h3>
          <div className="space-y-1">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-crypto-card transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer with User Profile */}
      {mounted && (
        <div className="p-3 border-t border-crypto-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full">
                {getUserAvatar() && (
                  <Image
                    src={getUserAvatar()}
                    width={24}
                    height={24}
                    alt="User Avatar" 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{getDisplayName()}</span>
            </div>
            {shouldShowDisconnect && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-red-400 hover:text-red-300"
                onClick={() => {
                  // Handle disconnect logic here
                  console.log("Disconnect clicked");
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { Sidebar };