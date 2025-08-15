"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, Settings, User, LogOut, ChevronDown, ChevronRight, Star, Heart, Eye } from 'lucide-react'
import React from 'react'

const Page = () => {
  const [activeMenu, setActiveMenu] = React.useState('horizontal');
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Menu Styles</h1>
          <Badge variant="outline">UI Components</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Horizontal Menu */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Horizontal Menu</h3>
            <div className="flex space-x-1 mb-4">
              {['horizontal', 'vertical', 'dropdown'].map((type) => (
                <Button
                  key={type}
                  variant={activeMenu === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveMenu(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
            
            <div className="bg-background rounded-lg border border-crypto-border p-4">
              <nav className="flex items-center space-x-6">
                <a href="#" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
                <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </nav>
            </div>
          </Card>

          {/* Vertical Menu */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Vertical Menu</h3>
            <div className="bg-background rounded-lg border border-crypto-border p-4">
              <nav className="space-y-2">
                <a href="#" className="flex items-center justify-between p-2 rounded-md bg-primary text-primary-foreground">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">New</Badge>
                </a>
                <a href="#" className="flex items-center justify-between p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-crypto-card transition-colors">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-crypto-card transition-colors">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </a>
              </nav>
            </div>
          </Card>
        </div>

        {/* Dropdown Menu */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Dropdown Menu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg border border-crypto-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">User Menu</span>
                <Badge variant="outline">Dropdown</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-crypto-card cursor-pointer">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-crypto-card cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </div>
                <div className="border-t border-crypto-border my-2"></div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-crypto-card cursor-pointer text-red-500">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg border border-crypto-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Actions Menu</span>
                <Badge variant="outline">Context</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-crypto-card cursor-pointer">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-crypto-card cursor-pointer">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Favorite</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-crypto-card cursor-pointer">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Like</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg border border-crypto-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Navigation</span>
                <Badge variant="outline">Tree</Badge>
              </div>
              <div className="space-y-1">
                <div 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-crypto-card cursor-pointer"
                  onClick={() => toggleExpanded('dashboard')}
                >
                  <span className="text-sm">Dashboard</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedItems.includes('dashboard') ? 'rotate-90' : ''}`} />
                </div>
                {expandedItems.includes('dashboard') && (
                  <div className="ml-4 space-y-1">
                    <div className="p-2 rounded-md hover:bg-crypto-card cursor-pointer text-sm text-muted-foreground">
                      Overview
                    </div>
                    <div className="p-2 rounded-md hover:bg-crypto-card cursor-pointer text-sm text-muted-foreground">
                      Analytics
                    </div>
                  </div>
                )}
                <div 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-crypto-card cursor-pointer"
                  onClick={() => toggleExpanded('settings')}
                >
                  <span className="text-sm">Settings</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedItems.includes('settings') ? 'rotate-90' : ''}`} />
                </div>
                {expandedItems.includes('settings') && (
                  <div className="ml-4 space-y-1">
                    <div className="p-2 rounded-md hover:bg-crypto-card cursor-pointer text-sm text-muted-foreground">
                      Account
                    </div>
                    <div className="p-2 rounded-md hover:bg-crypto-card cursor-pointer text-sm text-muted-foreground">
                      Security
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Components */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Menu Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Breadcrumb Navigation</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <nav className="flex items-center space-x-2 text-sm">
                  <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <a href="#" className="text-muted-foreground hover:text-foreground">Trading</a>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">CFD Trading</span>
                </nav>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Tab Navigation</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <div className="flex space-x-1">
                  <Button variant="default" size="sm">Overview</Button>
                  <Button variant="outline" size="sm">Analytics</Button>
                  <Button variant="outline" size="sm">Settings</Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Pagination</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">Previous</Button>
                  <div className="flex space-x-1">
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <span className="px-2 text-muted-foreground">...</span>
                    <Button variant="outline" size="sm">10</Button>
                  </div>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Sidebar Navigation</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 rounded-md bg-primary text-primary-foreground">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-crypto-card cursor-pointer">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-crypto-card cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Examples */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">React Component</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <pre className="text-xs text-muted-foreground overflow-x-auto">
{`const NavigationMenu = () => {
  return (
    <nav className="flex items-center space-x-6">
      <a href="#" className="flex items-center space-x-2 
         text-foreground hover:text-primary transition-colors">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </a>
      {/* More menu items */}
    </nav>
  );
};`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">CSS Classes</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <div className="space-y-2 text-sm">
                  <div><code className="bg-muted px-1 rounded">hover:bg-crypto-card</code> - Hover background</div>
                  <div><code className="bg-muted px-1 rounded">transition-colors</code> - Smooth transitions</div>
                  <div><code className="bg-muted px-1 rounded">text-muted-foreground</code> - Muted text color</div>
                  <div><code className="bg-muted px-1 rounded">border-crypto-border</code> - Border styling</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 