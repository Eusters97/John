import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import FrontPageLayout from "@/components/FrontPageLayout";
import {
  Newspaper,
  Calendar,
  Clock,
  User,
  Search,
  Tag,
  TrendingUp,
  Globe,
  ArrowRight,
  MessageCircle,
  BarChart3,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author_id?: string;
  status: string;
  category?: string;
  tags?: string[];
  published_at: string;
  created_at: string;
  author_name?: string;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const defaultArticles: NewsArticle[] = [
    {
      id: "1",
      title: "Federal Reserve Signals Potential Rate Cuts",
      slug: "fed-signals-rate-cuts",
      content: `<h2>Fed Chair Hints at Dovish Policy Shift</h2>
        <p>In recent statements, Federal Reserve Chair Jerome Powell has indicated that the central bank may consider interest rate cuts in the coming months, citing concerns about global economic slowdown and inflation targets.</p>
        
        <h3>Market Impact</h3>
        <p>This announcement has significant implications for forex markets:</p>
        <ul>
        <li>USD may weaken against major currencies</li>
        <li>Increased volatility expected in USD pairs</li>
        <li>Opportunity for strategic positioning</li>
        </ul>`,
      excerpt: "Federal Reserve hints at dovish policy shift, creating new opportunities in forex markets.",
      status: "published",
      category: "Market News",
      tags: ["federal reserve", "interest rates", "USD", "market analysis"],
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author_name: "Market Analyst",
    },
    {
      id: "2",
      title: "European Central Bank Maintains Aggressive Stance",
      slug: "ecb-aggressive-stance",
      content: `<h2>ECB Holds Rates Steady Amid Inflation Concerns</h2>
        <p>The European Central Bank has decided to maintain its current interest rate policy, signaling continued commitment to fighting inflation despite economic headwinds.</p>`,
      excerpt: "ECB maintains hawkish policy stance, supporting EUR strength across major pairs.",
      status: "published",
      category: "Central Banks",
      tags: ["ECB", "interest rates", "EUR", "inflation"],
      published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      author_name: "ECB Correspondent",
    },
    {
      id: "3",
      title: "Asian Markets Rally on China Economic Data",
      slug: "asian-markets-rally-china",
      content: `<h2>Strong Chinese Manufacturing Data Boosts Asian Currencies</h2>
        <p>Positive manufacturing PMI data from China has sparked a rally across Asian currencies, with particular strength seen in AUD, NZD, and JPY pairs.</p>`,
      excerpt: "Chinese economic data drives Asian currency rally, creating new trading opportunities.",
      status: "published",
      category: "Market Analysis",
      tags: ["China", "Asian markets", "AUD", "JPY", "economic data"],
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      author_name: "Asia Market Correspondent",
    },
    {
      id: "4",
      title: "Gold Prices Surge Amid Global Uncertainty",
      slug: "gold-prices-surge-uncertainty",
      content: `<h2>Safe Haven Demand Drives Gold Higher</h2>
        <p>Gold prices have reached new multi-month highs as investors seek safe haven assets amid global economic uncertainty and geopolitical tensions.</p>`,
      excerpt: "Gold reaches new highs as safe haven demand increases, affecting major currency pairs.",
      status: "published",
      category: "Commodities",
      tags: ["gold", "safe haven", "commodities", "market volatility"],
      published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      author_name: "Commodities Analyst",
    },
  ];

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select(`
          *,
          user_profiles!news_articles_author_id_fkey(full_name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.warn('Using default news articles:', error.message);
        setArticles(defaultArticles);
      } else if (data && data.length > 0) {
        const formattedArticles = data.map(article => ({
          ...article,
          author_name: article.user_profiles?.full_name || 'News Team',
          tags: Array.isArray(article.tags) ? article.tags : []
        }));
        setArticles(formattedArticles);
      } else {
        setArticles(defaultArticles);
      }
    } catch (error) {
      console.warn('Using default news articles due to fetch error');
      setArticles(defaultArticles);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(articles.map(article => article.category).filter(Boolean))];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Market News': return BarChart3;
      case 'Central Banks': return Globe;
      case 'Market Analysis': return TrendingUp;
      case 'Commodities': return Tag;
      default: return Newspaper;
    }
  };

  return (
    <FrontPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-forex-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Newspaper className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold">Market News</h1>
                  <p className="text-sm md:text-lg text-forex-100 mt-2">
                    Latest market updates and economic analysis
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { label: "Breaking News", value: articles.length.toString(), icon: Newspaper },
                  { label: "Daily Updates", value: "5-10", icon: Clock },
                  { label: "Market Coverage", value: "24/7", icon: Globe },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-forex-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="min-h-[36px]"
                >
                  All Categories
                </Button>
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category);
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="min-h-[36px]"
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {category}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* News Articles Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 bg-gray-200 rounded-l-lg"></div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No news articles found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or selected categories.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Article */}
                {filteredArticles.length > 0 && (
                  <Card className="overflow-hidden border-2 border-forex-200 shadow-lg">
                    <div className="md:flex">
                      <div className="md:w-1/2 h-64 md:h-auto">
                        {filteredArticles[0].featured_image ? (
                          <img
                            src={filteredArticles[0].featured_image}
                            alt={filteredArticles[0].title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-forex-500 to-blue-500 flex items-center justify-center">
                            <Newspaper className="h-16 w-16 text-white" />
                          </div>
                        )}
                      </div>
                      <CardContent className="md:w-1/2 p-6 md:p-8">
                        <Badge className="bg-forex-500 text-white mb-4">
                          Featured Story
                        </Badge>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          {filteredArticles[0].title}
                        </h2>
                        
                        <p className="text-gray-600 mb-6 text-lg">
                          {filteredArticles[0].excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(filteredArticles[0].published_at)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {estimateReadTime(filteredArticles[0].content)} min read
                            </div>
                          </div>
                          
                          {filteredArticles[0].category && (
                            <Badge variant="secondary">
                              {filteredArticles[0].category}
                            </Badge>
                          )}
                        </div>
                        
                        <Button
                          className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                          onClick={() => navigate(`/news/${filteredArticles[0].slug}`)}
                        >
                          Read Full Article
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                )}

                {/* Other Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(1).map((article) => (
                    <Card key={article.id} className="overflow-hidden border-2 border-gray-100 hover:border-forex-200 transition-all duration-200 hover:shadow-lg">
                      {article.featured_image ? (
                        <div className="h-48 bg-gradient-to-r from-forex-500 to-blue-500 relative">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-r from-forex-500 to-blue-500 flex items-center justify-center">
                          <Newspaper className="h-12 w-12 text-white" />
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(article.published_at)}
                          </div>
                          
                          {article.category && (
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {article.author_name}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-forex-600 hover:text-forex-700"
                            onClick={() => navigate(`/news/${article.slug}`)}
                          >
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-forex-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Stay Ahead of the Markets
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Get real-time market updates, expert analysis, and profitable trading signals delivered to your Telegram.
                  </p>
                  <a
                    href="https://t.me/forex_traders_signalss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-forex-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-forex-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span>Join Free Telegram Channel</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </FrontPageLayout>
  );
}
