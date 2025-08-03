import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Upload,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  MessageSquare,
  Star,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

interface Ebook {
  id: string;
  title: string;
  description: string;
  author: string;
  file_url: string;
  cover_image_url: string;
  category: string;
  is_free: boolean;
  required_investment_amount: number;
  download_count: number;
  is_published: boolean;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  category: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url: string;
  location: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  kyc_status: string;
  is_admin: boolean;
  created_at: string;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  user_profiles: { full_name: string; email: string };
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // State for different content types
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Form states
  const [ebookForm, setEbookForm] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    is_free: false,
    required_investment_amount: 0,
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    is_published: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (activeTab === "ebooks") loadEbooks();
    if (activeTab === "blog") loadBlogPosts();
    if (activeTab === "testimonials") loadTestimonials();
    if (activeTab === "users") loadUsers();
    if (activeTab === "payments") loadPayments();
  }, [activeTab]);

  const loadEbooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ebooks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select("*, user_profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    bucket: string = "ebooks",
  ): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleEbookUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload file to Supabase storage
      const fileUrl = await uploadFile(selectedFile, "ebooks");

      // Save ebook metadata to database
      const { error } = await supabase.from("ebooks").insert({
        ...ebookForm,
        file_url: fileUrl,
        file_size: selectedFile.size,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ebook uploaded successfully",
      });

      // Reset form
      setEbookForm({
        title: "",
        description: "",
        author: "",
        category: "",
        is_free: false,
        required_investment_amount: 0,
      });
      setSelectedFile(null);

      // Reload ebooks
      loadEbooks();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload ebook",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBlogCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const slug = blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { error } = await supabase.from("blog_posts").insert({
        ...blogForm,
        slug,
        author_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      // Reset form
      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        is_published: false,
      });

      // Reload blog posts
      loadBlogPosts();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTestimonialApproval = async (id: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_approved: !isApproved })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Testimonial ${!isApproved ? "approved" : "rejected"}`,
      });

      loadTestimonials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  const updateUserKYC = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ kyc_status: status })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `KYC status updated to ${status}`,
      });

      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">
            Manage your forex platform content and users
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Admin Access
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="ebooks" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Ebooks</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Blog</span>
          </TabsTrigger>
          <TabsTrigger value="promos" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Promos</span>
          </TabsTrigger>
          <TabsTrigger
            value="testimonials"
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Testimonials</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Payments
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {payments
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ebooks</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ebooks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {ebooks.filter((e) => e.is_published).length} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blog Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogPosts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {blogPosts.filter((b) => b.is_published).length} published
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ebooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload New Ebook</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEbookUpload} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={ebookForm.title}
                      onChange={(e) =>
                        setEbookForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={ebookForm.author}
                      onChange={(e) =>
                        setEbookForm((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={ebookForm.description}
                    onChange={(e) =>
                      setEbookForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setEbookForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forex-basics">
                          Forex Basics
                        </SelectItem>
                        <SelectItem value="technical-analysis">
                          Technical Analysis
                        </SelectItem>
                        <SelectItem value="trading-strategies">
                          Trading Strategies
                        </SelectItem>
                        <SelectItem value="risk-management">
                          Risk Management
                        </SelectItem>
                        <SelectItem value="psychology">
                          Trading Psychology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment-amount">
                      Required Investment ($)
                    </Label>
                    <Input
                      id="investment-amount"
                      type="number"
                      value={ebookForm.required_investment_amount}
                      onChange={(e) =>
                        setEbookForm((prev) => ({
                          ...prev,
                          required_investment_amount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Ebook File (PDF)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Ebook
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Ebooks List */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Ebooks</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {ebooks.map((ebook) => (
                    <div
                      key={ebook.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{ebook.title}</h4>
                        <p className="text-sm text-gray-600">
                          by {ebook.author}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              ebook.is_published ? "success" : "secondary"
                            }
                          >
                            {ebook.is_published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{ebook.category}</Badge>
                          <span className="text-sm text-gray-500">
                            {ebook.download_count} downloads
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Blog Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBlogCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-title">Title</Label>
                  <Input
                    id="blog-title"
                    value={blogForm.title}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blogForm.excerpt}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={blogForm.content}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blog-category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setBlogForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market-analysis">
                          Market Analysis
                        </SelectItem>
                        <SelectItem value="trading-tips">
                          Trading Tips
                        </SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="published"
                      checked={blogForm.is_published}
                      onChange={(e) =>
                        setBlogForm((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Blog Post
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">
                              {testimonial.name}
                            </h4>
                            <div className="flex items-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {testimonial.content}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                testimonial.is_approved
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {testimonial.is_approved ? "Approved" : "Pending"}
                            </Badge>
                            {testimonial.is_featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              {testimonial.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant={
                              testimonial.is_approved ? "outline" : "default"
                            }
                            onClick={() =>
                              toggleTestimonialApproval(
                                testimonial.id,
                                testimonial.is_approved,
                              )
                            }
                          >
                            {testimonial.is_approved ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promos" className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Promotional Pages</h2>
              <p className="text-gray-600">
                Create and manage promotional landing pages with custom themes
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Create New Promo Page
            </Button>
          </div>

          {/* Existing Promo Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Promo Page 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Black Friday Special
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      50% off all investment plans
                    </p>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium">Dark Gold</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">2,340</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-medium">156 (6.7%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">Nov 20, 2024</span>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Promo Page 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">New Year Boost</CardTitle>
                    <p className="text-sm text-gray-600">
                      Start 2024 with guaranteed returns
                    </p>
                  </div>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium">Luxury Blue</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-medium">0 (0%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">Dec 28, 2024</span>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create New Promo Card */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Create New Promo Page
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Design a custom promotional landing page
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Theme Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Available Themes</CardTitle>
              <p className="text-gray-600">
                Choose from pre-designed themes for your promotional pages
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Theme 1 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mb-3"></div>
                  <h4 className="font-medium">Golden Opportunity</h4>
                  <p className="text-xs text-gray-600">
                    Luxury gold theme with elegant animations
                  </p>
                </div>

                {/* Theme 2 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded mb-3"></div>
                  <h4 className="font-medium">Professional Blue</h4>
                  <p className="text-xs text-gray-600">
                    Clean and professional business theme
                  </p>
                </div>

                {/* Theme 3 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded mb-3"></div>
                  <h4 className="font-medium">Success Green</h4>
                  <p className="text-xs text-gray-600">
                    Growth-focused theme with success elements
                  </p>
                </div>

                {/* Theme 4 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-3"></div>
                  <h4 className="font-medium">Dark Elite</h4>
                  <p className="text-xs text-gray-600">
                    Premium dark theme for exclusive offers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Promotional Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Active Promos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    15,240
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    1,087
                  </div>
                  <div className="text-sm text-gray-600">Conversions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">7.1%</div>
                  <div className="text-sm text-gray-600">
                    Avg Conversion Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{user.full_name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              user.kyc_status === "approved"
                                ? "success"
                                : user.kyc_status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            KYC: {user.kyc_status}
                          </Badge>
                          {user.is_admin && (
                            <Badge variant="outline">Admin</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {user.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          onValueChange={(value) =>
                            updateUserKYC(user.id, value)
                          }
                          defaultValue={user.kyc_status}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          ${payment.amount} {payment.currency.toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {payment.user_profiles?.full_name} (
                          {payment.user_profiles?.email})
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              payment.payment_status === "finished"
                                ? "success"
                                : payment.payment_status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {payment.payment_status}
                          </Badge>
                          <Badge variant="outline">
                            {payment.payment_method}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Website Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Website Name</Label>
                  <Input
                    id="site-name"
                    defaultValue="FREE FOREX SIGNALS PROVIDER"
                    placeholder="Website name"
                  />
                </div>

                <div>
                  <Label htmlFor="site-description">Website Description</Label>
                  <Textarea
                    id="site-description"
                    defaultValue="Professional forex trading signals and investment platform"
                    placeholder="Website description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    defaultValue="support@forexsignals.com"
                    placeholder="Support email address"
                  />
                </div>

                <div>
                  <Label htmlFor="telegram-channel">Telegram Channel</Label>
                  <Input
                    id="telegram-channel"
                    defaultValue="@forex_traders_signalss"
                    placeholder="Telegram channel username"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Website Settings
                </Button>
              </CardContent>
            </Card>

            {/* Investment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="min-investment">
                    Minimum Investment (USD)
                  </Label>
                  <Input
                    id="min-investment"
                    type="number"
                    defaultValue="200"
                    placeholder="Minimum investment amount"
                  />
                </div>

                <div>
                  <Label htmlFor="min-deposit">Minimum Deposit (USD)</Label>
                  <Input
                    id="min-deposit"
                    type="number"
                    defaultValue="60"
                    placeholder="Minimum deposit amount"
                  />
                </div>

                <div>
                  <Label htmlFor="roi-percentage">Default ROI Percentage</Label>
                  <Input
                    id="roi-percentage"
                    type="number"
                    defaultValue="2500"
                    placeholder="ROI percentage"
                  />
                </div>

                <div>
                  <Label htmlFor="investment-duration">
                    Default Duration (days)
                  </Label>
                  <Input
                    id="investment-duration"
                    type="number"
                    defaultValue="10"
                    placeholder="Investment duration in days"
                  />
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Update Investment Settings
                </Button>
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Website Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Upload New Logo</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended size: 200x50px, PNG or SVG format
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-gray-500">Current Logo Preview</div>
                  <div className="mt-4 text-2xl font-bold bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
                    FREE FOREX SIGNALS PROVIDER
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </CardContent>
            </Card>

            {/* Popup Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Popup Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="popup-enabled" defaultChecked />
                  <Label htmlFor="popup-enabled">Enable Welcome Popup</Label>
                </div>

                <div>
                  <Label htmlFor="popup-title">Popup Title</Label>
                  <Input
                    id="popup-title"
                    defaultValue="🎉 Welcome Exclusive Offer!"
                    placeholder="Popup title"
                  />
                </div>

                <div>
                  <Label htmlFor="popup-content">Popup Content</Label>
                  <Textarea
                    id="popup-content"
                    defaultValue="Get started with just $100 and earn $2,500 in 24 hours! Limited time offer for new investors."
                    placeholder="Popup content"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="popup-show-count">
                    Times to Show (per user)
                  </Label>
                  <Input
                    id="popup-show-count"
                    type="number"
                    defaultValue="10"
                    placeholder="Number of times to show popup"
                  />
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Update Popup Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
