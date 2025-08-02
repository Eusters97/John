import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  Copy,
  ExternalLink,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Target,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const userStats = {
    balance: 2450.00,
    totalROI: 23.5,
    totalInvested: 2000.00,
    signalsReceived: 84,
    profitableSignals: 73
  };

  const cryptoOptions = [
    { symbol: "BTC", name: "Bitcoin", wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
    { symbol: "ETH", name: "Ethereum", wallet: "0x742d35Cc6634C0532925a3b8D5c0B32C" },
    { symbol: "USDT", name: "Tether", wallet: "TG2fJ4Co6aP4SPo6FqhQZqCQF6X5XdKx" }
  ];

  const recentInvestments = [
    {
      id: 1,
      amount: 500,
      crypto: "BTC",
      date: "2024-01-15",
      status: "active",
      roi: "+12.3%"
    },
    {
      id: 2,
      amount: 1000,
      crypto: "ETH", 
      date: "2024-01-10",
      status: "completed",
      roi: "+28.7%"
    },
    {
      id: 3,
      amount: 500,
      crypto: "USDT",
      date: "2024-01-05",
      status: "completed", 
      roi: "+15.2%"
    }
  ];

  const liveSignals = [
    {
      pair: "EUR/USD",
      action: "BUY",
      entry: "1.0845",
      stopLoss: "1.0825",
      takeProfit: "1.0885",
      time: "30 min ago",
      status: "active"
    },
    {
      pair: "GBP/JPY",
      action: "SELL", 
      entry: "189.75",
      stopLoss: "190.25",
      takeProfit: "188.90",
      time: "2 hours ago",
      status: "profit"
    }
  ];

  const referralLink = `https://forexsignals.com/ref/${user?.id || 'user123'}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Track your investments, view signals, and manage your forex trading portfolio.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${userStats.balance.toLocaleString()}</div>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +{userStats.totalROI}% all time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${userStats.totalInvested.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Across all positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Signals Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{userStats.signalsReceived}</div>
              <p className="text-xs text-success-600 mt-1">
                {userStats.profitableSignals} profitable ({Math.round((userStats.profitableSignals/userStats.signalsReceived) * 100)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Telegram Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-success-500 text-white mb-2">Connected</Badge>
              <div>
                <a 
                  href="https://t.me/forex_traders_signalss" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  View Channel
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crypto Investment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-forex-600" />
                <span>Crypto Investment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crypto">Select Cryptocurrency</Label>
                <select 
                  id="crypto"
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {cryptoOptions.map(crypto => (
                    <option key={crypto.symbol} value={crypto.symbol}>
                      {crypto.symbol} - {crypto.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>

              {selectedCrypto && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-gray-900">Payment Details</h4>
                  <div>
                    <Label className="text-sm text-gray-600">Wallet Address</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-xs bg-white p-2 rounded border flex-1 break-all">
                        {cryptoOptions.find(c => c.symbol === selectedCrypto)?.wallet}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(
                          cryptoOptions.find(c => c.symbol === selectedCrypto)?.wallet || '',
                          'Wallet address'
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full bg-forex-600 hover:bg-forex-700">
                    Generate QR Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-forex-600" />
                <span>Live Signals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {liveSignals.map((signal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={signal.action === "BUY" ? "default" : "secondary"}
                        className={signal.action === "BUY" ? "bg-success-500" : "bg-danger-500"}
                      >
                        {signal.action === "BUY" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {signal.action}
                      </Badge>
                      <span className="font-semibold">{signal.pair}</span>
                    </div>
                    <Badge variant="outline" className={signal.status === "profit" ? "text-success-600" : "text-blue-600"}>
                      {signal.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Entry:</span> {signal.entry}
                    </div>
                    <div>
                      <span className="text-gray-500">SL:</span> {signal.stopLoss}
                    </div>
                    <div>
                      <span className="text-gray-500">TP:</span> {signal.takeProfit}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {signal.time}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                View All Signals
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Investment History & Referrals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Investment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-forex-600" />
                <span>Investment History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvestments.map(investment => (
                  <div key={investment.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold">${investment.amount} {investment.crypto}</div>
                      <div className="text-sm text-gray-500">{investment.date}</div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={investment.status === "completed" ? "default" : "secondary"}
                        className="mb-1"
                      >
                        {investment.status}
                      </Badge>
                      <div className="text-sm font-semibold text-success-600">{investment.roi}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Referrals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-forex-600" />
                <span>Referral Program</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Earn 10% commission on every referral's investment. Share your unique link below.
              </p>
              
              <div className="space-y-2">
                <Label>Your Referral Link</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={referralLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(referralLink, 'Referral link')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-500">Referrals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">$127</div>
                  <div className="text-sm text-gray-500">Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
