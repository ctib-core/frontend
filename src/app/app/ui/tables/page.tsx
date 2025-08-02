"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Eye, Edit, Trash2 } from 'lucide-react'
import React from 'react'

// Mock data for tables
const CRYPTO_DATA = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 45000, change: 2.5, marketCap: '850B', volume: '25B', status: 'active' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: -1.2, marketCap: '360B', volume: '15B', status: 'active' },
  { id: 3, name: 'Solana', symbol: 'SOL', price: 100, change: 5.8, marketCap: '45B', volume: '2B', status: 'active' },
  { id: 4, name: 'Cardano', symbol: 'ADA', price: 0.5, change: -0.8, marketCap: '18B', volume: '800M', status: 'inactive' }
];

const USER_DATA = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', lastLogin: '1 day ago' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'inactive', lastLogin: '1 week ago' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', lastLogin: '3 hours ago' }
];

const Page = () => {
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const sortedCryptoData = [...CRYPTO_DATA].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Tables</h1>
          <Badge variant="outline">UI Components</Badge>
        </div>

        {/* Basic Table */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Table</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRYPTO_DATA.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell className="font-medium">{crypto.name}</TableCell>
                  <TableCell>{crypto.symbol}</TableCell>
                  <TableCell>${crypto.price.toLocaleString()}</TableCell>
                  <TableCell className={crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </TableCell>
                  <TableCell>${crypto.marketCap}</TableCell>
                  <TableCell>
                    <Badge variant={crypto.status === 'active' ? 'default' : 'secondary'}>
                      {crypto.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Sortable Table */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Sortable Table</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-crypto-card"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-crypto-card"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Price</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-crypto-card"
                  onClick={() => handleSort('change')}
                >
                  <div className="flex items-center space-x-2">
                    <span>24h Change</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-crypto-card"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCryptoData.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell className="font-medium">{crypto.name}</TableCell>
                  <TableCell>${crypto.price.toLocaleString()}</TableCell>
                  <TableCell className={crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </TableCell>
                  <TableCell>${crypto.marketCap}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Selectable Table */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Selectable Table</h3>
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedRows(selectedRows.length === USER_DATA.length ? [] : USER_DATA.map(u => u.id))}
            >
              {selectedRows.length === USER_DATA.length ? 'Deselect All' : 'Select All'}
            </Button>
            {selectedRows.length > 0 && (
              <span className="ml-4 text-sm text-muted-foreground">
                {selectedRows.length} item(s) selected
              </span>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === USER_DATA.length}
                    onChange={() => setSelectedRows(selectedRows.length === USER_DATA.length ? [] : USER_DATA.map(u => u.id))}
                    className="rounded border-crypto-border"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USER_DATA.map((user) => (
                <TableRow key={user.id} className={selectedRows.includes(user.id) ? 'bg-crypto-card' : ''}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(user.id)}
                      onChange={() => toggleRowSelection(user.id)}
                      className="rounded border-crypto-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Compact Table */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Compact Table</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2">Asset</TableHead>
                <TableHead className="py-2">Price</TableHead>
                <TableHead className="py-2">Change</TableHead>
                <TableHead className="py-2">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRYPTO_DATA.slice(0, 3).map((crypto) => (
                <TableRow key={crypto.id} className="hover:bg-crypto-card">
                  <TableCell className="py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {crypto.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{crypto.name}</div>
                        <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">${crypto.price.toLocaleString()}</TableCell>
                  <TableCell className={`py-2 ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </TableCell>
                  <TableCell className="py-2 text-sm">${crypto.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Table with Pagination */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Table with Pagination</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USER_DATA.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">#{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing 1 to {USER_DATA.length} of {USER_DATA.length} results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
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
{`import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const DataTable = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>${item.price}</TableCell>
            <TableCell>{item.change}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Table Features</h4>
              <div className="bg-background rounded-lg border border-crypto-border p-4">
                <div className="space-y-2 text-sm">
                  <div><code className="bg-muted px-1 rounded">hover:bg-crypto-card</code> - Row hover effect</div>
                  <div><code className="bg-muted px-1 rounded">cursor-pointer</code> - Clickable headers</div>
                  <div><code className="bg-muted px-1 rounded">font-medium</code> - Bold text styling</div>
                  <div><code className="bg-muted px-1 rounded">text-muted-foreground</code> - Secondary text</div>
                  <div><code className="bg-muted px-1 rounded">Badge</code> - Status indicators</div>
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