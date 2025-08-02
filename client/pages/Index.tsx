import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FrontPageLayout from "@/components/FrontPageLayout";
import CookieBanner from "@/components/CookieBanner";
import PaymentModal from "@/components/PaymentModal";
import { useInvestment } from "@/contexts/InvestmentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageCircle,
  Shield,
  Zap,
  Users,
  DollarSign,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Target,
  CheckCircle
} from "lucide-react";

export default function Index() {
  const { setCurrentOffer, setShowPaymentModal } = useInvestment();
  const [stats, setStats] = useState({
    signalsSent: 1247,
    winRate: 87.3,
    avgROI: 12.5,
    activeUsers: 3421
  });

  // Animate counters on load
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        signalsSent: prev.signalsSent + Math.floor(Math.random() * 3),
        winRate: 87.3 + (Math.random() - 0.5) * 0.2,
        avgROI: 12.5 + (Math.random() - 0.5) * 0.5,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleInvestNow = (plan: any) => {
    setCurrentOffer({
      isActive: true,
      plan: plan.name,
      amount: plan.minAmount,
      expectedReturn: plan.expectedReturn,
      duration: plan.duration,
      roi: plan.roi
    });
    setShowPaymentModal(true);
  };

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-forex-600" />,
      title: "Free Telegram Signals",
      description: "Get real-time forex signals delivered directly to your Telegram. No hidden fees, completely free."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-success-600" />,
      title: "8x-15x ROI Potential",
      description: "Our signals have historically delivered 8x to 15x returns on investment with proper risk management."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Risk Management",
      description: "Every signal includes stop loss and take profit levels to protect your capital."
    },
    {
      icon: <Zap className="h-8 w-8 text-gold-600" />,
      title: "Real-Time Alerts",
      description: "Instant notifications when new trading opportunities arise in the forex market."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Expert Analysis",
      description: "Signals backed by professional traders with years of forex market experience."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-success-600" />,
      title: "Crypto Integration",
      description: "Seamlessly invest with cryptocurrency payments and track your portfolio growth."
    }
  ];

  const recentSignals = [
    {
      pair: "EUR/USD",
      action: "BUY",
      entry: "1.0845",
      stopLoss: "1.0825",
      takeProfit: "1.0885",
      time: "30 minutes ago",
      status: "active",
      change: "+0.34%",
      confidence: "High"
    },
    {
      pair: "GBP/JPY",
      action: "SELL",
      entry: "189.75",
      stopLoss: "190.25",
      takeProfit: "188.90",
      time: "2 hours ago",
      status: "profit",
      change: "+2.47%",
      confidence: "Very High"
    },
    {
      pair: "USD/CAD",
      action: "BUY",
      entry: "1.3520",
      stopLoss: "1.3495",
      takeProfit: "1.3565",
      time: "5 hours ago",
      status: "profit",
      change: "+3.13%",
      confidence: "High"
    }
  ];

  const investmentPlans = [
    {
      id: "starter",
      name: "Starter Plan",
      minAmount: 100,
      maxAmount: 999,
      roi: "2,500%",
      duration: "24 hours",
      description: "Perfect for beginners",
      popular: false,
      expectedReturn: 2500,
      features: ["24/7 Support", "Telegram Signals", "Instant Payout"]
    },
    {
      id: "premium",
      name: "Premium Plan",
      minAmount: 1000,
      maxAmount: 4999,
      roi: "400%",
      duration: "3 days",
      description: "Most popular choice",
      popular: true,
      expectedReturn: 4000,
      features: ["Priority Support", "VIP Signals", "Fast Processing", "Risk Management"]
    },
    {
      id: "vip",
      name: "VIP Plan",
      minAmount: 5000,
      maxAmount: 20000,
      roi: "600%",
      duration: "7 days",
      description: "Maximum returns",
      popular: false,
      expectedReturn: 30000,
      features: ["Personal Manager", "Exclusive Signals", "Priority Payout", "Advanced Analytics"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Verified Trader",
      avatar: "SM",
      content: "I started with just $100 and couldn't believe when I got $2,500 back in 24 hours! This platform changed my life. The signals are incredibly accurate and the support team is amazing.",
      rating: 5,
      verified: true
    },
    {
      name: "David Chen",
      role: "Professional Trader",
      avatar: "DC",
      content: "Best forex signals channel on Telegram! 87% win rate is not a joke. I've been following for 6 months and my portfolio is up 340%. Highly recommended!",
      rating: 5,
      verified: true
    },
    {
      name: "Maria Rodriguez",
      role: "Investment Manager",
      avatar: "MR",
      content: "Amazing platform! I've earned $12,500 from a $1,000 investment in just 3 days. Professional service and excellent customer support.",
      rating: 5,
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-forex-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-forex-500 to-blue-500 text-white">
              🔥 87.3% Win Rate • 12.5% Avg ROI
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-forex-600 to-blue-600 bg-clip-text text-transparent">
                FREE FOREX SIGNALS
              </span>
              <br />
              <span className="text-gray-800">That Actually Work</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join 3,400+ traders getting profitable forex signals delivered directly to Telegram. 
              Free access, 8x-15x ROI potential, and expert risk management included.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a 
                href="https://t.me/forex_traders_signalss" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Join Free Telegram</span>
              </a>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-forex-600 text-forex-600 hover:bg-forex-600 hover:text-white transition-all duration-200"
              >
                View Live Signals
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: "Signals Sent", value: stats.signalsSent.toLocaleString() },
                { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%` },
                { label: "Avg ROI", value: `${stats.avgROI.toFixed(1)}%` },
                { label: "Active Users", value: stats.activeUsers.toLocaleString() }
              ].map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Signals?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven track record, professional analysis, and completely free access to profitable forex signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-forex-200 transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Signals Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-forex-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Signals
            </h2>
            <p className="text-xl text-gray-600">
              Preview of our recent trading signals and their performance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentSignals.map((signal, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={signal.action === "BUY" ? "default" : "secondary"}
                        className={signal.action === "BUY" ? "bg-success-500" : "bg-danger-500"}
                      >
                        {signal.action === "BUY" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {signal.action}
                      </Badge>
                      <span className="font-bold text-lg">{signal.pair}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={signal.status === "profit" ? "text-success-600 border-success-600" : "text-blue-600 border-blue-600"}
                    >
                      {signal.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Entry:</span>
                      <div className="font-semibold">{signal.entry}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Stop Loss:</span>
                      <div className="font-semibold">{signal.stopLoss}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Take Profit:</span>
                      <div className="font-semibold text-success-600">{signal.takeProfit}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className={`font-semibold capitalize ${signal.status === "profit" ? "text-success-600" : "text-blue-600"}`}>
                        {signal.status}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {signal.time}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="https://t.me/forex_traders_signalss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-forex-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-forex-600 hover:to-blue-600 transition-all duration-200 font-semibold"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Get All Signals Free</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Traders Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful traders using our signals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      {testimonial.avatar}
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      {testimonial.verified && (
                        <Badge className="bg-success-500 text-white text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-forex-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Trading Profitably?
          </h2>
          <p className="text-xl text-forex-100 mb-8">
            Join our Telegram channel and start receiving free, profitable forex signals today.
          </p>
          <a 
            href="https://t.me/forex_traders_signalss" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-white text-forex-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <MessageCircle className="h-6 w-6" />
            <span>Join Free Telegram Now</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-forex-600 to-forex-500 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">FREE FOREX SIGNALS</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Professional forex signals delivered free to your Telegram. 
                Join thousands of profitable traders worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="https://t.me/forex_traders_signalss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/blog" className="block text-gray-400 hover:text-white transition-colors">Blog</Link>
                <Link to="/news" className="block text-gray-400 hover:text-white transition-colors">News</Link>
                <a href="https://t.me/forex_traders_signalss" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">Telegram</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Risk Disclaimer</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Free Forex Signals Provider. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Trading forex involves substantial risk and may not be suitable for all investors.
            </p>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
