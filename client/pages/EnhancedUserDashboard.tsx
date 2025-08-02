import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import SimpleInvestmentPlans from "@/components/SimpleInvestmentPlans";
import EnhancedPaymentModal from "@/components/EnhancedPaymentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { nowPaymentsService } from "@/lib/nowpayments";
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
  Clock,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  PieChart,
  BarChart3,
  CreditCard,
  Download,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Phone,
  Gift,
  Loader2,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EnhancedUserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userStats, setUserStats] = useState({
    balance: 0,
    totalInvested: 0,
    totalProfit: 0,
    totalROI: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    pendingPayouts: 0,
    referralEarnings: 0
  });

  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCrypto, setWithdrawCrypto] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("");
  const [supportTicket, setSupportTicket] = useState({
    subject: "",
    category: "",
    description: ""
  });
  
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  // Check for passed state from frontpage investment redirect
  useEffect(() => {
    if (location.state?.selectedPlan && location.state?.action === 'invest') {
      const plan = location.state.selectedPlan;
      setSelectedPlan(plan.id);
      setInvestmentAmount(plan.minAmount.toString());
      // Auto-focus on plans tab
      navigate(`/dashboard?tab=plans`, { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    console.log('User effect triggered, user:', user);
    if (user) {
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      initializeUserData().then(() => {
        loadUserStats();
        checkTelegramConnection();
      }).catch(error => {
        console.error('Error in user initialization chain:', error);
      });
    }
  }, [user]);

  const initializeUserData = async () => {
    if (!user?.id) return;

    try {
      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // User profile doesn't exist, create it
        console.log('Creating user profile...');
        const { error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || 'User'
          });

        if (createError) {
          console.error('Failed to create user profile:', createError);
        } else {
          console.log('User profile created successfully');
        }
      }

      // Check if user balance exists
      const { data: balance, error: balanceError } = await supabase
        .from('user_balances')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (balanceError && balanceError.code === 'PGRST116') {
        // User balance doesn't exist, create it
        console.log('Creating user balance entry...');
        const { error: createBalanceError } = await supabase
          .from('user_balances')
          .insert({
            user_id: user.id,
            balance: 0.00 // Starting balance
          });

        if (createBalanceError) {
          console.error('Failed to create user balance:', createBalanceError);
        } else {
          console.log('User balance created successfully');
        }
      }
    } catch (error) {
      console.warn('Error initializing user data:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const loadUserStats = async () => {
    if (!user?.id) {
      console.warn('No user ID available for loading stats');
      return;
    }

    try {
      // First test basic Supabase connection
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .limit(1);

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Connection failed: ${testError.message}`);
      }

      console.log('Supabase connection successful, user profile exists:', !!testData?.length);

      // Try to load user balance first (simpler query)
      let userBalance = 0.00; // Default balance

      try {
        const { data: balanceData } = await supabase
          .from('user_balances')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (balanceData?.balance !== undefined) {
          userBalance = balanceData.balance;
        }
      } catch (balanceError) {
        console.warn('User balance table not available, using default balance');
      }

      // Try to load user investments (with simplified query)
      let investmentStats = {
        totalInvested: 0,
        totalProfit: 0,
        activeInvestments: 0,
        completedInvestments: 0,
      };

      try {
        const { data: investments, error } = await supabase
          .from('user_investments')
          .select('amount, status, actual_return')
          .eq('user_id', user.id);

        if (error) {
          console.warn('User investments table query failed:', error.message);
        } else if (investments) {
          investmentStats = investments.reduce((acc, inv) => {
            if (inv.status === 'active') acc.activeInvestments++;
            if (inv.status === 'completed') acc.completedInvestments++;
            acc.totalInvested += inv.amount || 0;
            if (inv.actual_return) acc.totalProfit += (inv.actual_return - (inv.amount || 0));
            return acc;
          }, investmentStats);
        }
      } catch (investmentError) {
        console.warn('User investments table not available, using default values');
      }

      // Calculate final stats
      const stats = {
        balance: userBalance,
        ...investmentStats,
        totalROI: investmentStats.totalInvested > 0 ? (investmentStats.totalProfit / investmentStats.totalInvested) * 100 : 0,
        pendingPayouts: 0,
        referralEarnings: 0.00
      };

      setUserStats(stats);
      console.log('User stats loaded successfully:', stats);
    } catch (error) {
      console.error('Error loading user stats:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Full error object:', error);

      // Set default stats on error
      const defaultStats = {
        balance: 0.00,
        totalInvested: 0,
        totalProfit: 0,
        totalROI: 0,
        activeInvestments: 0,
        completedInvestments: 0,
        pendingPayouts: 0,
        referralEarnings: 0.00
      };

      setUserStats(defaultStats);
      console.log('Using default stats due to error:', defaultStats);
    }
  };

  const checkTelegramConnection = async () => {
    if (!user?.id) {
      return;
    }

    try {
      // Check if user has connected Telegram
      const { data, error } = await supabase
        .from('user_profiles')
        .select('telegram_id')
        .eq('id', user.id)
        .single();

      if (!error && data?.telegram_id) {
        setTelegramConnected(true);
      }
    } catch (error) {
      console.error('Error checking telegram connection:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleDeposit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to make a deposit",
        variant: "destructive",
      });
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) < 60) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is $60 USD",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCrypto) {
      toast({
        title: "Select Cryptocurrency",
        description: "Please select a cryptocurrency for deposit",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create deposit payment
      const { payment, dbPayment } = await nowPaymentsService.createInvestmentPayment(
        user.id,
        '', // No investment ID for deposits
        parseFloat(depositAmount),
        selectedCrypto,
        `Account deposit - $${depositAmount}`
      );

      toast({
        title: "Deposit Created",
        description: "Please send the exact amount to the provided address.",
      });

      setShowPaymentModal(true);
    } catch (error) {
      toast({
        title: "Deposit Error",
        description: error instanceof Error ? error.message : "Failed to create deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to request a withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) > userStats.balance) {
      toast({
        title: "Invalid Amount",
        description: "Insufficient balance or invalid amount",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAddress || !withdrawCrypto || !withdrawNetwork) {
      toast({
        title: "Missing Information",
        description: "Please fill in all withdrawal details",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: parseFloat(withdrawAmount),
          crypto_currency: withdrawCrypto,
          wallet_address: withdrawAddress,
          network: withdrawNetwork,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for processing.",
      });

      // Reset form
      setWithdrawAmount("");
      setWithdrawAddress("");
      setWithdrawCrypto("");
      setWithdrawNetwork("");
    } catch (error) {
      toast({
        title: "Withdrawal Error",
        description: error instanceof Error ? error.message : "Failed to submit withdrawal request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSupportTicket = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a support ticket",
        variant: "destructive",
      });
      return;
    }

    if (!supportTicket.subject || !supportTicket.category || !supportTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: supportTicket.subject,
          category: supportTicket.category,
          description: supportTicket.description,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created. We'll respond within 24 hours.",
      });

      setSupportTicket({ subject: "", category: "", description: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramLogin = () => {
    // Open Telegram bot for connection
    window.open('https://t.me/forex_traders_signalss', '_blank');
    toast({
      title: "Telegram Connection",
      description: "Please start a chat with our bot to connect your account",
    });
  };

  const handleInvestment = (plan: any) => {
    if (!investmentAmount || parseFloat(investmentAmount) < plan.minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum amount for ${plan.name} is $${plan.minAmount}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(investmentAmount) > userStats.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit funds to your account first",
        variant: "destructive",
      });
      return;
    }

    // Process investment from account balance
    toast({
      title: "Investment Processing",
      description: "Your investment is being processed...",
    });

    // In a real app, this would create the investment record
  };

  const offerPlans = [
    {
      id: "flash",
      name: "Flash Deal",
      amount: 200,
      expectedReturn: 5000,
      roi: "2,500%",
      duration: "24 hours",
      description: "Limited time offer",
      timeLeft: "12:45:32",
      popular: true
    },
    {
      id: "weekend",
      name: "Weekend Special",
      amount: 500,
      expectedReturn: 12500,
      roi: "2,500%",
      duration: "48 hours",
      description: "Weekend only",
      timeLeft: "2:15:45",
      popular: false
    },
    {
      id: "vip-deal",
      name: "VIP Deal",
      amount: 1000,
      expectedReturn: 25000,
      roi: "2,500%",
      duration: "72 hours", 
      description: "Exclusive offer",
      timeLeft: "8:30:12",
      popular: false
    }
  ];

  const cryptoOptions = nowPaymentsService.getPopularCryptoCurrencies();

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Balance</p>
                      <p className="text-xl font-bold">${userStats.balance.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Invested</p>
                      <p className="text-xl font-bold">${userStats.totalInvested.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Profit</p>
                      <p className="text-xl font-bold text-green-600">${userStats.totalProfit.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">ROI</p>
                      <p className="text-xl font-bold text-green-600">{userStats.totalROI.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => navigate('/dashboard?tab=deposit')}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <ArrowDownToLine className="h-5 w-5" />
                    <span className="text-xs">Deposit</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard?tab=withdraw')}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <ArrowUpFromLine className="h-5 w-5" />
                    <span className="text-xs">Withdraw</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard?tab=plans')}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-xs">Invest</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard?tab=offers')}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <Gift className="h-5 w-5" />
                    <span className="text-xs">Offers</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'balance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  ${userStats.balance.toFixed(2)}
                </div>
                <p className="text-gray-600 mb-6">Available Balance</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    onClick={() => navigate('/dashboard?tab=deposit')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard?tab=withdraw')}
                    variant="outline"
                  >
                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'deposit':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <p className="text-gray-600">Add funds to your account using cryptocurrency</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Minimum deposit:</strong> $60 USD • Funds are available immediately after confirmation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deposit-amount">Deposit Amount (USD)</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="60.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                    <Select onValueChange={setSelectedCrypto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((crypto) => (
                          <SelectItem key={crypto.currency} value={crypto.currency}>
                            <div className="flex items-center space-x-2">
                              <img src={crypto.logo_url} alt={crypto.name} className="w-4 h-4" />
                              <span>{crypto.name} ({crypto.currency.toUpperCase()})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleDeposit} 
                    disabled={loading || !depositAmount || !selectedCrypto}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Deposit...
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Create Deposit
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Supported Cryptocurrencies</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cryptoOptions.slice(0, 6).map((crypto) => (
                      <div key={crypto.currency} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <img src={crypto.logo_url} alt={crypto.name} className="w-6 h-6" />
                        <span className="text-sm">{crypto.currency.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'withdraw':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <p className="text-gray-600">Request a withdrawal to your crypto wallet</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Available balance:</strong> ${userStats.balance.toFixed(2)} • Withdrawals are processed within 24 hours
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount">Withdrawal Amount (USD)</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="100.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={userStats.balance}
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdraw-crypto">Cryptocurrency</Label>
                    <Select onValueChange={setWithdrawCrypto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((crypto) => (
                          <SelectItem key={crypto.currency} value={crypto.currency}>
                            {crypto.name} ({crypto.currency.toUpperCase()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="withdraw-address">Wallet Address</Label>
                    <Input
                      id="withdraw-address"
                      placeholder="Enter your wallet address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdraw-network">Network</Label>
                    <Select onValueChange={setWithdrawNetwork}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="bep20">BEP20 (BSC)</SelectItem>
                        <SelectItem value="erc20">ERC20 (Ethereum)</SelectItem>
                        <SelectItem value="trc20">TRC20 (Tron)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleWithdraw} 
                    disabled={loading || !withdrawAmount || !withdrawAddress}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpFromLine className="mr-2 h-4 w-4" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Withdrawal Information</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Minimum withdrawal: $500 USD</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Network fees apply</li>
                    <li>• Double-check wallet address</li>
                    <li>• Withdrawals require email confirmation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'plans':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Plans</CardTitle>
                <p className="text-gray-600">Invest using your account balance</p>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Available Balance:</strong> ${userStats.balance.toFixed(2)} • 
                    All investments are processed from your account balance
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <SimpleInvestmentPlans allowPayments={false} redirectToLogin={false} />
          </div>
        );

      case 'offers':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Special Offers</CardTitle>
                <p className="text-gray-600">Limited time investment opportunities</p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerPlans.map((offer) => (
                <Card key={offer.id} className={`relative overflow-hidden ${offer.popular ? 'ring-2 ring-gold-500' : ''}`}>
                  {offer.popular && (
                    <div className="absolute top-0 right-0 bg-gold-500 text-white px-3 py-1 text-xs">
                      🔥 HOT DEAL
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{offer.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">{offer.roi}</div>
                    <p className="text-gray-600">{offer.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">Time Left:</div>
                      <div className="text-red-600 font-mono text-xl">{offer.timeLeft}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">${offer.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Return:</span>
                        <span className="font-semibold text-green-600">${offer.expectedReturn.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">{offer.duration}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600"
                      onClick={() => handleInvestment(offer)}
                      disabled={userStats.balance < offer.amount}
                    >
                      {userStats.balance >= offer.amount ? 'Invest Now' : 'Insufficient Balance'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'telegram':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Telegram Connection</CardTitle>
              <p className="text-gray-600">Connect your Telegram account to receive signals</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                {telegramConnected ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                    <h3 className="text-xl font-semibold text-green-600">Connected!</h3>
                    <p className="text-gray-600">Your Telegram account is connected and you're receiving signals.</p>
                    <Button
                      onClick={() => window.open('https://t.me/forex_traders_signalss', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Open Telegram Channel
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Send className="h-16 w-16 text-blue-600 mx-auto" />
                    <h3 className="text-xl font-semibold">Connect Your Telegram</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Connect your Telegram account to receive real-time forex signals and updates.
                    </p>
                    <Button
                      onClick={handleTelegramLogin}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Connect Telegram
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'referrals':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <p className="text-gray-600">Earn commission by referring new investors to our platform</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-4">Earn 10% Commission on Every Referral!</h3>
                <p className="text-gray-600 mb-4">
                  Share your unique referral link and earn 10% commission on every investment made by your referrals.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="referral-link">Your Referral Link</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="referral-link"
                        value={`https://www.forextraderssignals.com/?ref=${user?.id?.slice(0, 8) || 'user'}`}
                        readOnly
                        className="bg-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://www.forextraderssignals.com/?ref=${user?.id?.slice(0, 8) || 'user'}`);
                          toast({
                            title: "Copied!",
                            description: "Referral link copied to clipboard",
                          });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </Card>

                <Card className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">${userStats.referralEarnings.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </Card>

                <Card className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">10%</div>
                  <div className="text-sm text-gray-600">Commission Rate</div>
                </Card>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">How It Works</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Share your unique referral link with friends and family</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>When someone signs up and makes their first investment, you earn 10% commission</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Commissions are paid directly to your account balance</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>No limit on the number of referrals you can make</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Share on Social Media
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'active':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
              <p className="text-gray-600">Monitor your current investment positions</p>
            </CardHeader>
            <CardContent>
              {userStats.activeInvestments === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Investments</h3>
                  <p className="text-gray-500 mb-6">You don't have any active investments at the moment.</p>
                  <Button
                    onClick={() => navigate('/investment-plans')}
                    className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start Investing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* This would be populated with actual investment data */}
                    <div className="text-center text-gray-500">
                      Active investments will appear here when you make an investment.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'history':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Investment History</CardTitle>
              <p className="text-gray-600">View all your completed investments and returns</p>
            </CardHeader>
            <CardContent>
              {userStats.completedInvestments === 0 ? (
                <div className="text-center py-12">
                  <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Investment History</h3>
                  <p className="text-gray-500 mb-6">Your completed investments will appear here.</p>
                  <Button
                    onClick={() => navigate('/investment-plans')}
                    className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Make Your First Investment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Plan</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="text-left p-3">Return</th>
                          <th className="text-left p-3">ROI</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 text-gray-500" colSpan={6}>
                            No completed investments yet.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'transactions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <p className="text-gray-600">View all your deposits, withdrawals, and transactions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">All Transactions</Badge>
                    <Badge variant="outline">Deposits</Badge>
                    <Badge variant="outline">Withdrawals</Badge>
                    <Badge variant="outline">Investments</Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Method</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">TXN ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-gray-500" colSpan={6}>
                          No transactions yet. Your transaction history will appear here.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'support':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <p className="text-gray-600">Get help with deposits, withdrawals, or technical issues</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ticket-subject">Subject</Label>
                  <Input
                    id="ticket-subject"
                    placeholder="Brief description of your issue"
                    value={supportTicket.subject}
                    onChange={(e) => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="ticket-category">Category</Label>
                  <Select onValueChange={(value) => setSupportTicket(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit Issues</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal Issues</SelectItem>
                      <SelectItem value="investment">Investment Questions</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ticket-description">Description</Label>
                  <Textarea
                    id="ticket-description"
                    placeholder="Please provide detailed information about your issue..."
                    rows={5}
                    value={supportTicket.description}
                    onChange={(e) => setSupportTicket(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button
                  onClick={handleSupportTicket}
                  disabled={loading || !supportTicket.subject || !supportTicket.category}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Ticket...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Create Support Ticket
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Response Times</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Urgent issues: 2-4 hours</li>
                  <li>• General inquiries: 24 hours</li>
                  <li>• Technical issues: 48 hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <p className="text-gray-600">Update your account information and preferences</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>

                    <div>
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        placeholder="Enter your full name"
                        defaultValue={user?.user_metadata?.full_name || ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Withdrawal Settings</h3>

                    <div>
                      <Label htmlFor="btc-address">Bitcoin (BTC) Address</Label>
                      <Input
                        id="btc-address"
                        placeholder="Enter your BTC wallet address"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="eth-address">Ethereum (ETH) Address</Label>
                      <Input
                        id="eth-address"
                        placeholder="Enter your ETH wallet address"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="usdt-address">USDT Address</Label>
                      <Input
                        id="usdt-address"
                        placeholder="Enter your USDT wallet address"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferred-network">Preferred Network</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mainnet">Bitcoin Mainnet</SelectItem>
                          <SelectItem value="erc20">ERC20 (Ethereum)</SelectItem>
                          <SelectItem value="bep20">BEP20 (BSC)</SelectItem>
                          <SelectItem value="trc20">TRC20 (Tron)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive updates about your investments via email</div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Telegram Notifications</div>
                    <div className="text-sm text-gray-600">Get instant notifications via Telegram</div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Investment Alerts</div>
                    <div className="text-sm text-gray-600">Notifications when investments mature</div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Feature Coming Soon</h3>
              <p className="text-gray-500">This feature is under development and will be available soon.</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-gray-600">Manage your investments and track your portfolio</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Verified Account
          </Badge>
        </div>

        {renderTabContent()}
      </div>

      <EnhancedPaymentModal />
    </DashboardLayout>
  );
}
