import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck,
  Users,
  FileText,
  Grid,
  LogOut,
  Mail,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Calendar,
  DollarSign,
  Sun,
  Moon,
  X,
  Pencil,
  Coins,
  Newspaper,
  Sparkles,
} from "lucide-react";
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  is_marquee?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_id: string | null;
  status: string;
  created_at: string;
  video_url: string | null;
  video_type: string | null;
  thumbnail_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ServiceItem {
  id?: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  image_url: string | null;
  process: string[];
  created_at?: string;
}

export interface EstimatorService {
  id: string;
  key: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

export interface InvestmentTip {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

const DEFAULT_TIPS: InvestmentTip[] = [
  {
    id: "tip-1",
    title: "The Power of Compounding via SIP",
    category: "Mutual Funds",
    content: "<p>Compounding is often called the eighth wonder of the world. By starting a Systematic Investment Plan (SIP) early, you allow your interest to earn interest over time. For example, investing ₹10,000 monthly for 20 years at a 12% expected annual return could grow to over ₹99 Lakhs, with your own investment being only ₹24 Lakhs.</p><strong>Key Takeaways:</strong><ul><li>Start early: Even a 5-year delay can cut your final corpus by half.</li><li>Consistency: Automate your monthly investments to remove emotional bias.</li><li>Top-up: Increase your SIP by 5-10% every year as your income grows.</li></ul>",
    created_at: new Date().toISOString(),
  },
  {
    id: "tip-2",
    title: "Tax Saving under Section 80C & Beyond",
    category: "Tax Planning",
    content: "<p>Smart tax planning is the first step to wealth creation. Under Section 80C of the Income Tax Act, you can deduct up to ₹1.5 Lakhs from your taxable income. Key instruments include ELSS Mutual Funds (which have the shortest lock-in period of 3 years), PPF, and National Savings Certificates.</p><strong>Best Tax-Saving Strategies:</strong><ul><li>ELSS Funds: Benefit from equity returns while saving tax.</li><li>NPS (Section 80CCD(1B)): Save an additional ₹50,000 on top of the 80C limit.</li><li>Health Insurance (Section 80D): Claim deductions on premium paid for self and parents.</li></ul>",
    created_at: new Date().toISOString(),
  },
  {
    id: "tip-3",
    title: "Emergency Funds: Your Financial Shield",
    category: "Smart Savings",
    content: "<p>Before allocating money to high-yield equity funds, ensure you have an emergency fund. This fund should cover at least 6 months of your unavoidable monthly expenses (rent, food, EMIs, insurance premiums). Keep this money in liquid mutual funds or high-yield savings accounts that offer immediate access.</p><strong>Tips for Emergency Fund:</strong><ul><li>Calculate accurately: Include all essential bills and healthcare premiums.</li><li>High Liquidity: Do not lock it in long-term FDs or equity.</li><li>Replenish first: If you draw from it, make refilling it your number one priority.</li></ul>",
    created_at: new Date().toISOString(),
  },
  {
    id: "tip-4",
    title: "Equity vs Debt: Finding the Right Asset Mix",
    category: "Asset Allocation",
    content: "<p>An optimal asset allocation protects you from market volatility. Younger investors can afford to allocate 70-80% of their savings to equities for long-term growth, whereas those closer to retirement should skew towards debt or fixed income for stability.</p><strong>Allocation Rules of Thumb:</strong><ul><li>Rule of 100: Subtract your age from 100 to find your ideal equity allocation percentage.</li><li>Rebalance annually: Shift gains from equity to debt (or vice versa) to maintain your target mix.</li><li>Diversify globally: Allocate 10-15% in international funds to hedge geographic risk.</li></ul>",
    created_at: new Date().toISOString(),
  },
];

type Tab = "overview" | "leads" | "blogs" | "services" | "estimator" | "tips" | "news";

const DEFAULT_ESTIMATOR_SERVICES: EstimatorService[] = [
  {
    id: "1",
    key: "pvtLtd",
    name: "Pvt Ltd Incorporation",
    description: "Digital Signature, DIN, MoA/AoA, PAN/TAN",
    price: 5999,
    created_at: "",
  },
  {
    id: "2",
    key: "gst",
    name: "GST Registration",
    description: "Government GSTIN registration & certificate",
    price: 1499,
    created_at: "",
  },
  {
    id: "3",
    key: "trademark",
    name: "Trademark Application",
    description: "Brand name, logo & legal class filing",
    price: 4999,
    created_at: "",
  },
  {
    id: "4",
    key: "audit",
    name: "ROC & Audit Compliance",
    description: "Annual returns calendar & dedicated auditor",
    price: 3999,
    created_at: "",
  },
];

const insertHtmlTag = (
  tag: string,
  value: string,
  setValue: (v: string) => void,
  textareaId: string
) => {
  const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);
  
  let replacement = "";
  if (tag === "b") {
    replacement = `<strong>${selectedText || "bold text"}</strong>`;
  } else if (tag === "i") {
    replacement = `<em>${selectedText || "italic text"}</em>`;
  } else if (tag === "u") {
    replacement = `<u>${selectedText || "underlined text"}</u>`;
  } else if (tag === "h3") {
    replacement = `<h3>${selectedText || "Heading 3"}</h3>`;
  } else if (tag === "p") {
    replacement = `<p>${selectedText || "paragraph text"}</p>`;
  } else if (tag === "li") {
    replacement = `<li>${selectedText || "list item"}</li>`;
  } else if (tag === "ul") {
    replacement = `<ul>\n  <li>${selectedText || "list item"}</li>\n</ul>`;
  }

  const newValue = text.substring(0, start) + replacement + text.substring(end);
  setValue(newValue);

  // Refocus and select
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
  }, 10);
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Panel" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme changing states
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Dashboard Stats & Lists States
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [estimatorServices, setEstimatorServices] = useState<EstimatorService[]>([]);
  const [investmentTips, setInvestmentTips] = useState<InvestmentTip[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Wealth Creation Tip Form States
  const [newTipTitle, setNewTipTitle] = useState("");
  const [newTipCategory, setNewTipCategory] = useState("Mutual Funds");
  const [newTipContent, setNewTipContent] = useState("");
  const [selectedTip, setSelectedTip] = useState<InvestmentTip | null>(null);
  const [editingTip, setEditingTip] = useState<InvestmentTip | null>(null);

  // News Form States
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newNewsImageUrl, setNewNewsImageUrl] = useState("");
  const [isUploadingNewsImage, setIsUploadingNewsImage] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newNewsIsMarquee, setNewNewsIsMarquee] = useState(false);

  // Creation Form States
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogSlug, setNewBlogSlug] = useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("");
  const [newBlogVideoUrl, setNewBlogVideoUrl] = useState("");

  // Services dynamic tab state
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [serviceSubTab, setServiceSubTab] = useState<"list" | "add">("list");
  
  // Add Service Form State
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceSlug, setNewServiceSlug] = useState("");
  const [newServiceShort, setNewServiceShort] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceImageUrl, setNewServiceImageUrl] = useState("");
  const [newServiceProcess, setNewServiceProcess] = useState<string[]>([]);
  const [newServiceStepText, setNewServiceStepText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Edit Service Form State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editServiceSlug, setEditServiceSlug] = useState("");
  const [editServiceShort, setEditServiceShort] = useState("");
  const [editServiceDescription, setEditServiceDescription] = useState("");
  const [editServiceImageUrl, setEditServiceImageUrl] = useState("");
  const [editServiceProcess, setEditServiceProcess] = useState<string[]>([]);
  const [editServiceStepText, setEditServiceStepText] = useState("");

  // Viewing Service state
  const [viewingService, setViewingService] = useState<ServiceItem | null>(null);

  // Check auth state and sync theme on mount
  useEffect(() => {
    const session = sessionStorage.getItem("admin_logged_in");
    if (session === "true") {
      setIsAuthenticated(true);
      fetchDashboardData();
    }

    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const isDark = savedTheme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      setTheme("dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  // Set up real-time database subscription for live stats
  useEffect(() => {
    if (!isAuthenticated) return;

    // Create channel to listen for changes on leads, vlogs, and services
    const channel = supabase
      .channel("admin-realtime-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          console.log("Realtime leads update received:", payload);
          fetchDashboardData(true); // Silent update in background!
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vlogs" },
        (payload) => {
          console.log("Realtime vlogs update received:", payload);
          fetchDashboardData(true); // Silent update in background!
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        (payload) => {
          console.log("Realtime services update received:", payload);
          fetchDashboardData(true); // Silent update in background!
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        (payload) => {
          console.log("Realtime news update received:", payload);
          fetchDashboardData(true); // Silent update in background!
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "investment_tips" },
        (payload) => {
          console.log("Realtime tips update received:", payload);
          fetchDashboardData(true); // Silent update in background!
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!envEmail || !envPassword) {
      toast.error("Admin credentials are not configured in environment files.");
      setIsSubmitting(false);
      return;
    }

    if (loginEmail === envEmail && loginPassword === envPassword) {
      sessionStorage.setItem("admin_logged_in", "true");
      setIsAuthenticated(true);
      toast.success("Welcome back, Administrator!");
      fetchDashboardData();
    } else {
      toast.error("Invalid administrator credentials.");
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsAuthenticated(false);
    toast.info("Logged out safely.");
  };

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setIsLoadingData(true);
    try {
      // 1. Fetch Leads
      const { data: leadsData, error: leadsErr } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (leadsErr) throw leadsErr;
      setLeads(leadsData || []);

      // 2. Fetch Vlogs
      const { data: blogsData, error: blogsErr } = await supabase
        .from("vlogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (blogsErr) throw blogsErr;
      setBlogs(blogsData || []);

      // 3. Fetch Categories
      const { data: catData, error: catErr } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (catErr) throw catErr;
      setCategories(catData || []);

      // 4. Fetch Estimator Services
      try {
        const { data: estData, error: estErr } = await supabase
          .from("estimator_services" as "leads")
          .select("*")
          .order("key", { ascending: true });
        if (!estErr && estData && estData.length > 0) {
          const typedEstData = estData as unknown as EstimatorService[];
          // Sort to match order of defaults
          const sortedData = [...typedEstData].sort((a, b) => {
            const keysOrder = ["pvtLtd", "gst", "trademark", "audit"];
            return keysOrder.indexOf(a.key) - keysOrder.indexOf(b.key);
          });
          setEstimatorServices(sortedData);
        } else {
          setEstimatorServices(DEFAULT_ESTIMATOR_SERVICES);
        }
      } catch (e) {
        console.warn("Estimator services table not loaded yet, falling back to defaults.", e);
        setEstimatorServices(DEFAULT_ESTIMATOR_SERVICES);
      }

      // 5. Fetch Services
      try {
        const { data: servData, error: servErr } = await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: true });
        if (!servErr && servData) {
          setServicesList(servData as unknown as ServiceItem[]);
        }
      } catch (e) {
        console.warn("Services table not loaded yet or empty.", e);
      }

      // 6. Fetch Investment Tips
      try {
        const { data: tipsData, error: tipsErr } = await supabase
          .from("investment_tips" as any)
          .select("*")
          .order("created_at", { ascending: false });
        if (!tipsErr && tipsData && tipsData.length > 0) {
          setInvestmentTips(tipsData as unknown as InvestmentTip[]);
        } else {
          setInvestmentTips(DEFAULT_TIPS);
        }
      } catch (e) {
        console.warn("Investment tips table not loaded yet or empty.", e);
        setInvestmentTips(DEFAULT_TIPS);
      }

      // 7. Fetch News
      try {
        const { data: newsData, error: newsErr } = await supabase
          .from("news" as any)
          .select("*")
          .order("created_at", { ascending: false });
        if (!newsErr && newsData && newsData.length > 0) {
          setNewsList(newsData as unknown as NewsItem[]);
        } else {
          setNewsList([]);
        }
      } catch (e) {
        console.warn("News table not loaded yet or empty.", e);
        setNewsList([]);
      }
    } catch (err) {
      console.error(err);
      if (!silent) {
        const error = err as Error;
        toast.error(error.message || "Failed to load database records.");
      }
    } finally {
      if (!silent) setIsLoadingData(false);
    }
  };

  // Leads Operations
  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
      if (error) throw error;
      toast.success("Lead status updated.");
      setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);
      if (error) throw error;
      toast.success("Lead entry removed successfully.");
      setLeads(leads.filter((l) => l.id !== leadId));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  // Cost Estimator Operations
  const handleUpdateEstimatorService = async (
    key: string,
    name: string,
    description: string,
    price: number,
  ) => {
    try {
      const { error } = await (
        supabase.from("estimator_services" as "leads") as unknown as {
          update: (payload: Record<string, unknown>) => {
            eq: (col: string, val: string) => Promise<{ error: Error | null }>;
          };
        }
      )
        .update({ name, description, price })
        .eq("key", key);

      if (error) throw error;
      toast.success(`Estimator service "${name}" updated successfully!`);
      // Update local state
      setEstimatorServices(
        estimatorServices.map((s) => (s.key === key ? { ...s, name, description, price } : s)),
      );
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to save to database. Make sure migrations are run!");
    }
  };

  // Categories Operations
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCategoryName, slug })
        .select();

      if (error) throw error;
      toast.success(`Category "${newCategoryName}" created!`);
      if (data) setCategories([...categories, ...data]);
      setNewCategoryName("");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${catName}"?`)) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", catId);
      if (error) throw error;
      toast.success("Category deleted.");
      setCategories(categories.filter((c) => c.id !== catId));
    } catch (err) {
      toast.error("Cannot delete category as blog posts might be linked to it.");
    }
  };

  // Services CRUD Operations
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServiceDescription.trim()) {
      toast.error("Service Name and Description are required.");
      return;
    }

    const slug = newServiceSlug.trim() || newServiceName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const { data, error } = await supabase
        .from("services")
        .insert({
          name: newServiceName,
          slug,
          short: newServiceShort || `${newServiceName} setup.`,
          description: newServiceDescription,
          image_url: newServiceImageUrl || null,
          process: newServiceProcess,
        })
        .select();

      if (error) throw error;
      toast.success(`Service "${newServiceName}" created successfully!`);
      if (data) {
        setServicesList([...servicesList, ...(data as unknown as ServiceItem[])]);
      }

      // Reset Form
      setNewServiceName("");
      setNewServiceSlug("");
      setNewServiceShort("");
      setNewServiceDescription("");
      setNewServiceImageUrl("");
      setNewServiceProcess([]);
      setNewServiceStepText("");
      setServiceSubTab("list");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.id) return;

    try {
      const { error } = await supabase
        .from("services")
        .update({
          name: editServiceName,
          slug: editServiceSlug,
          short: editServiceShort,
          description: editServiceDescription,
          image_url: editServiceImageUrl || null,
          process: editServiceProcess,
        })
        .eq("id", editingService.id);

      if (error) throw error;
      toast.success(`Service "${editServiceName}" updated successfully!`);
      
      // Update local state
      setServicesList(
        servicesList.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: editServiceName,
                slug: editServiceSlug,
                short: editServiceShort,
                description: editServiceDescription,
                image_url: editServiceImageUrl || null,
                process: editServiceProcess,
              }
            : s
        )
      );

      setEditingService(null);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      toast.success(`Service "${name}" deleted.`);
      setServicesList(servicesList.filter((s) => s.id !== id));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const addStepToNewService = () => {
    if (!newServiceStepText.trim()) return;
    setNewServiceProcess([...newServiceProcess, newServiceStepText.trim()]);
    setNewServiceStepText("");
  };

  const removeStepFromNewService = (idx: number) => {
    setNewServiceProcess(newServiceProcess.filter((_, i) => i !== idx));
  };

  const addStepToEditService = () => {
    if (!editServiceStepText.trim()) return;
    setEditServiceProcess([...editServiceProcess, editServiceStepText.trim()]);
    setEditServiceStepText("");
  };

  const removeStepFromEditService = (idx: number) => {
    setEditServiceProcess(editServiceProcess.filter((_, i) => i !== idx));
  };

  const startEditService = (s: ServiceItem) => {
    setEditingService(s);
    setEditServiceName(s.name);
    setEditServiceSlug(s.slug);
    setEditServiceShort(s.short);
    setEditServiceDescription(s.description);
    setEditServiceImageUrl(s.image_url || "");
    setEditServiceProcess(s.process || []);
    setEditServiceStepText("");
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `service-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setUrl(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      const error = err as Error;
      toast.error(`Upload failed: ${error.message}. Make sure migration has run.`);
    } finally {
      setIsUploading(false);
    }
  };

  // Vlogs Operations
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogSlug.trim() || !newBlogContent.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("vlogs")
        .insert({
          title: newBlogTitle,
          slug: newBlogSlug,
          excerpt: newBlogExcerpt || null,
          content: newBlogContent,
          category_id: newBlogCategory || null,
          status: "published",
          video_url: newBlogVideoUrl || null,
          video_type: "youtube",
          thumbnail_url: null,
        })
        .select();

      if (error) throw error;
      toast.success("Vlog post published successfully!");
      if (data) setBlogs([...blogs, ...data]);

      // Reset Form
      setNewBlogTitle("");
      setNewBlogSlug("");
      setNewBlogExcerpt("");
      setNewBlogContent("");
      setNewBlogCategory("");
      setNewBlogVideoUrl("");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;
    try {
      const { error } = await supabase.from("vlogs").delete().eq("id", blogId);
      if (error) throw error;
      toast.success("Vlog post deleted successfully.");
      setBlogs(blogs.filter((b) => b.id !== blogId));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const autoGenerateSlug = (title: string) => {
    setNewBlogTitle(title);
    setNewBlogSlug(
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    );
  };

  // Investment Tips Operations
  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipTitle.trim() || !newTipCategory.trim() || !newTipContent.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("investment_tips" as any)
        .insert({
          title: newTipTitle,
          category: newTipCategory,
          content: newTipContent,
        })
        .select();

      if (error) throw error;
      toast.success("Investment tip published successfully!");
      if (data) setInvestmentTips([...investmentTips, ...(data as unknown as InvestmentTip[])]);

      // Reset Form
      setNewTipTitle("");
      setNewTipCategory("Mutual Funds");
      setNewTipContent("");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const startEditTip = (tip: InvestmentTip) => {
    setEditingTip(tip);
    setNewTipTitle(tip.title);
    setNewTipCategory(tip.category);
    setNewTipContent(tip.content);
  };

  const cancelEditTip = () => {
    setEditingTip(null);
    setNewTipTitle("");
    setNewTipCategory("Mutual Funds");
    setNewTipContent("");
  };

  const handleUpdateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTip) return;
    if (!newTipTitle.trim() || !newTipCategory.trim() || !newTipContent.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (editingTip.id.startsWith("tip-")) {
        // Fallback tip. Save to Supabase as a new entry.
        const { data, error } = await supabase
          .from("investment_tips" as any)
          .insert({
            title: newTipTitle,
            category: newTipCategory,
            content: newTipContent,
          })
          .select();

        if (error) throw error;
        toast.success("Default tip customized and saved to database!");
        if (data) {
          setInvestmentTips(
            investmentTips.map((t) => (t.id === editingTip.id ? (data[0] as unknown as InvestmentTip) : t))
          );
        }
      } else {
        // Database tip. Update it.
        const { data, error } = await supabase
          .from("investment_tips" as any)
          .update({
            title: newTipTitle,
            category: newTipCategory,
            content: newTipContent,
          })
          .eq("id", editingTip.id)
          .select();

        if (error) throw error;
        toast.success("Investment tip updated successfully!");
        if (data) {
          setInvestmentTips(
            investmentTips.map((t) => (t.id === editingTip.id ? (data[0] as unknown as InvestmentTip) : t))
          );
        }
      }

      // Reset Edit State
      setEditingTip(null);
      setNewTipTitle("");
      setNewTipCategory("Mutual Funds");
      setNewTipContent("");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteTip = async (tipId: string, tipTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${tipTitle}"?`)) return;
    try {
      if (tipId.startsWith("tip-")) {
        toast.success("Fallback tip removed from preview.");
        setInvestmentTips(investmentTips.filter((t) => t.id !== tipId));
        return;
      }

      const { error } = await supabase.from("investment_tips" as any).delete().eq("id", tipId);
      if (error) throw error;
      toast.success("Investment tip deleted successfully.");
      setInvestmentTips(investmentTips.filter((t) => t.id !== tipId));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  // News Operations
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim() || !newNewsContent.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("news" as any)
        .insert({
          title: newNewsTitle,
          content: newNewsContent,
          image_url: newNewsImageUrl || null,
          is_marquee: newNewsIsMarquee,
        })
        .select();

      if (error) throw error;
      toast.success("News article published successfully!");
      if (data) {
        setNewsList([...newsList, ...(data as unknown as NewsItem[])]);
      }

      // Reset form
      setNewNewsTitle("");
      setNewNewsContent("");
      setNewNewsImageUrl("");
      setNewNewsIsMarquee(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const startEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewNewsTitle(item.title);
    setNewNewsContent(item.content);
    setNewNewsImageUrl(item.image_url || "");
    setNewNewsIsMarquee(item.is_marquee || false);
  };

  const cancelEditNews = () => {
    setEditingNews(null);
    setNewNewsTitle("");
    setNewNewsContent("");
    setNewNewsImageUrl("");
    setNewNewsIsMarquee(false);
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    if (!newNewsTitle.trim() || !newNewsContent.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      // Database update
      const { data, error } = await supabase
        .from("news" as any)
        .update({
          title: newNewsTitle,
          content: newNewsContent,
          image_url: newNewsImageUrl || null,
          is_marquee: newNewsIsMarquee,
        })
        .eq("id", editingNews.id)
        .select();

      if (error) throw error;
      toast.success("News article updated successfully!");
      if (data) {
        setNewsList(
          newsList.map((n) => (n.id === editingNews.id ? (data[0] as unknown as NewsItem) : n))
        );
      }

      setEditingNews(null);
      setNewNewsTitle("");
      setNewNewsContent("");
      setNewNewsImageUrl("");
      setNewNewsIsMarquee(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteNews = async (newsId: string, newsTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${newsTitle}"?`)) return;
    try {
      const { error } = await supabase.from("news" as any).delete().eq("id", newsId);
      if (error) throw error;
      toast.success("News article deleted successfully.");
      setNewsList(newsList.filter((n) => n.id !== newsId));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  // ----------------------------------------------------
  // AUTH PANEL (LOGIN VIEW)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 backdrop-blur-md p-8 shadow-card hover:border-primary/20 transition-all duration-300">
          <div className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in with your configured environment credentials
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-600 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? "Authenticating..." : "Authorize Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-medium text-primary hover:underline">
              Back to public site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD VIEW (MAIN PORTAL)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* 1. SIDEBAR CONTROLS */}
      <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border bg-card/40 backdrop-blur-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-6 border-b border-border">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-primary to-purple-500 text-white text-[12px] font-extrabold shadow-md shadow-primary/20">
              A
            </span>
            <div>
              <p className="font-semibold text-sm leading-none">Admin Panel</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "leads", label: "Leads", icon: Users, badge: leads.length },
              { id: "estimator", label: "Cost Estimator", icon: DollarSign },
              { id: "blogs", label: "Vlog Editor", icon: FileText, badge: blogs.length },
              { id: "services", label: "Services", icon: Grid, badge: servicesList.length },
              { id: "tips", label: "Wealth Tips", icon: Coins, badge: investmentTips.length },
              { id: "news", label: "News Editor", icon: Newspaper, badge: newsList.length },
            ].map((tabItem) => {
              const IconComp = tabItem.icon;
              const isActive = activeTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id as Tab)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <IconComp className="h-4.5 w-4.5" /> {tabItem.label}
                  </span>
                  {tabItem.badge !== undefined && tabItem.badge > 0 && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {tabItem.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BODY */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-hidden">
        {/* Dynamic header navigation */}
        <header className="flex items-center justify-between border-b border-border pb-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold capitalize tracking-tight text-foreground">
              {activeTab} Management
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Direct live connection to startup database schema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-amber-400 hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-700 hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>
            <button
              onClick={() => fetchDashboardData()}
              disabled={isLoadingData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {isLoadingData ? "Syncing..." : "Sync Database"}
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------
            TAB VIEW: OVERVIEW
            ---------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  label: "Lead Inquiries",
                  value: leads.length,
                  icon: Users,
                  color: "text-primary",
                },
                {
                  label: "Vlog Publications",
                  value: blogs.length,
                  icon: FileText,
                  color: "text-indigo-400",
                },
                {
                  label: "Active Services",
                  value: servicesList.length,
                  icon: Grid,
                  color: "text-emerald-400",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-card hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {card.label}
                    </span>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground mt-4">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500" /> Active Database Sync
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Leads Activity Card */}
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
              <h3 className="text-base font-semibold text-foreground">Recent Inquiries</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Most recent incoming contact leads
              </p>

              <div className="mt-5 space-y-3">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            lead.status === "new"
                              ? "bg-primary/25 text-primary animate-pulse"
                              : lead.status === "contacted"
                                ? "bg-amber-500/25 text-amber-500"
                                : lead.status === "converted"
                                  ? "bg-emerald-500/25 text-emerald-500"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.email} · {lead.phone || "No Phone"}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-muted text-primary"
                    >
                      Manage <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {leads.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No lead inquiries found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB VIEW: LEADS CRM TABLE
            ---------------------------------------------------- */}
        {activeTab === "leads" && (
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Client Detail</th>
                    <th className="px-6 py-4">Service Required</th>
                    <th className="px-6 py-4">Message Details</th>
                    <th className="px-6 py-4">Status Tag</th>
                    <th className="px-6 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{lead.email}</p>
                        {lead.phone && (
                          <p className="text-xs text-muted-foreground mt-0.5">{lead.phone}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {lead.service || "General Inquiry"}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">
                          {lead.message || (
                            <span className="italic text-muted-foreground">No message</span>
                          )}
                        </p>
                        <span className="text-[10px] text-muted-foreground block mt-1.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleUpdateLeadStatus(lead.id, e.target.value);
                          }}
                          className={`rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold ${
                            lead.status === "new"
                              ? "text-primary border-primary/30"
                              : lead.status === "contacted"
                                ? "text-amber-500 border-amber-500/30"
                                : lead.status === "converted"
                                  ? "text-emerald-500 border-emerald-500/30"
                                  : "text-muted-foreground"
                          }`}
                        >
                          <option value="new">New Inquiry</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted Client</option>
                          <option value="lost">Lost Lead</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead.id);
                          }}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No active client leads in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB VIEW: BLOG EDITOR / PUBLISHER
            ---------------------------------------------------- */}
        {activeTab === "blogs" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Create new vlog form */}
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
              <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <Plus className="h-4.5 w-4.5 text-primary" /> Create & Publish Vlog Reel
              </h3>

              <form onSubmit={handleCreateBlog} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Vlog Title <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    value={newBlogTitle}
                    onChange={(e) => autoGenerateSlug(e.target.value)}
                    placeholder="GST registration steps..."
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    YouTube Link / Shorts URL <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    value={newBlogVideoUrl}
                    onChange={(e) => setNewBlogVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/shorts/VIDEO_ID"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Short Excerpt
                  </label>
                  <input
                    value={newBlogExcerpt}
                    onChange={(e) => setNewBlogExcerpt(e.target.value)}
                    placeholder="Quick summary of this vlog..."
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Full Content/Description Markdown <span className="text-primary">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    placeholder="Write detailed information for this vlog here. Markdown support is enabled."
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-[1.01]"
                >
                  Publish Vlog Reel
                </button>
              </form>
            </div>

            {/* List of Published Vlogs */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Published Vlog Reels</h3>
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="rounded-xl border border-border bg-card/60 p-5 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground leading-tight truncate">
                        {blog.title}
                      </p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase border border-primary/20">
                          {blog.video_type || "No Video"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBlog(blog.id, blog.title)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 ml-4 cursor-pointer"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
                {blogs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No vlogs found in Supabase.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB VIEW: CATEGORIES
            ---------------------------------------------------- */}
        {/* ----------------------------------------------------
            TAB VIEW: SERVICES (DYNAMIC SERVICES MANAGER)
            ---------------------------------------------------- */}
        {activeTab === "services" && (
          <div className="space-y-6">
            {/* Tab sub-navigation */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setServiceSubTab("list")}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    serviceSubTab === "list"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Services List ({servicesList.length})
                </button>
                <button
                  onClick={() => setServiceSubTab("add")}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    serviceSubTab === "add"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Plus className="inline h-3.5 w-3.5 mr-1" /> Add Service
                </button>
              </div>
            </div>

            {/* SUBTAB: SERVICES LIST */}
            {serviceSubTab === "list" && (
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
                <h3 className="text-base font-semibold text-foreground mb-4">Active Services</h3>
                
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {servicesList.map((service) => (
                    <div
                      key={service.id || service.slug}
                      className="group flex flex-col rounded-xl border border-border bg-background/50 overflow-hidden shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300"
                    >
                      {/* Image header */}
                      <div className="h-32 bg-muted relative overflow-hidden">
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary/10 to-purple-500/10 text-primary">
                            <Grid className="h-10 w-10 opacity-40" />
                          </div>
                        )}
                        <span className="absolute top-2 right-2 rounded-lg bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border">
                          {service.process ? service.process.length : 0} Steps
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold text-foreground line-clamp-1">{service.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.short}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                          <button
                            onClick={() => setViewingService(service)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> View
                          </button>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => startEditService(service)}
                              className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Service"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => service.id && handleDeleteService(service.id, service.name)}
                              className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {servicesList.length === 0 && (
                    <div className="col-span-full text-center py-12 text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/80">
                      <p>No active dynamic services found in Supabase.</p>
                      <p className="text-xs mt-1">Add your first service to launch dynamic routing!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB: ADD NEW SERVICE FORM */}
            {serviceSubTab === "add" && (
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card max-w-3xl">
                <h3 className="text-base font-semibold text-foreground mb-4">Add a New Service</h3>
                
                <form onSubmit={handleCreateService} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Service Name <span className="text-primary">*</span>
                    </label>
                    <input
                      required
                      value={newServiceName}
                      onChange={(e) => {
                        setNewServiceName(e.target.value);
                        setNewServiceSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                        );
                      }}
                      placeholder="e.g. LLP Registration"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Short Subtitle / Excerpt <span className="text-primary">*</span>
                    </label>
                    <input
                      required
                      value={newServiceShort}
                      onChange={(e) => setNewServiceShort(e.target.value)}
                      placeholder="e.g. Limited Liability Partnership setup."
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Image Option (URL or Upload)
                    </label>
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <input
                        value={newServiceImageUrl}
                        onChange={(e) => setNewServiceImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      />
                      <label className="rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center">
                        {isUploading ? "Uploading..." : "Upload File"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setNewServiceImageUrl)}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Description HTML Editor <span className="text-primary">*</span>
                    </label>
                    <HtmlEditor
                      id="newServiceDescription"
                      value={newServiceDescription}
                      setValue={setNewServiceDescription}
                      placeholder="Write comprehensive service guidelines here. HTML tags supported."
                    />
                  </div>

                  <div className="space-y-1.5 border-t border-border pt-4">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Process Steps List
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={newServiceStepText}
                        onChange={(e) => setNewServiceStepText(e.target.value)}
                        placeholder="e.g. SPICe+ filing (Takes 4-5 days)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addStepToNewService();
                          }
                        }}
                        className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={addStepToNewService}
                        className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Add Step
                      </button>
                    </div>

                    {newServiceProcess.length > 0 && (
                      <ol className="mt-3 space-y-2 rounded-xl border border-border bg-muted/20 p-4">
                        {newServiceProcess.map((step, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between text-sm text-foreground bg-background/60 rounded-lg px-3 py-2 border border-border/80"
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-bold text-xs text-primary">{index + 1}.</span>
                              {step}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeStepFromNewService(index)}
                              className="text-rose-500 hover:bg-rose-500/10 rounded p-1 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-[1.01]"
                    >
                      Publish Service
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB VIEW: ESTIMATOR (COST ESTIMATOR)
            ---------------------------------------------------- */}
        {activeTab === "estimator" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
              <h3 className="text-base font-semibold text-foreground">
                Interactive Cost Calculator Editor
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update the names, descriptions, and pricing amounts of the 4 core compliance
                services displayed on the public Hero widget.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {estimatorServices.map((service) => (
                <EstimatorServiceCard
                  key={service.key}
                  service={service}
                  onSave={handleUpdateEstimatorService}
                />
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB VIEW: TIPS (WEALTH CREATION TIPS)
            ---------------------------------------------------- */}
        {activeTab === "tips" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Create/Edit Tip Form */}
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {editingTip ? `Edit Guide: ${editingTip.title}` : "Publish New Investment Guide"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingTip
                    ? "Modify the title, category, or content of your published guide."
                    : "Write detailed financial articles, tax saving tips, or budgeting guidance for the Wealth Creation page."}
                </p>
              </div>

              <form onSubmit={editingTip ? handleUpdateTip : handleCreateTip} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Article Title *
                    </label>
                    <input
                      required
                      value={newTipTitle}
                      onChange={(e) => setNewTipTitle(e.target.value)}
                      placeholder="e.g. Navigating ELSS Mutual Funds"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Category / Tag *
                    </label>
                    <select
                      required
                      value={newTipCategory}
                      onChange={(e) => setNewTipCategory(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                    >
                      <option value="Mutual Funds">Mutual Funds</option>
                      <option value="Tax Planning">Tax Planning</option>
                      <option value="Smart Savings">Smart Savings</option>
                      <option value="Asset Allocation">Asset Allocation</option>
                      <option value="Retirement">Retirement</option>
                      <option value="Loans & Debt">Loans & Debt</option>
                      <option value="Financial Planning">Financial Planning</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Guide Content (HTML/Markdown Supported) *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={newTipContent}
                    onChange={(e) => setNewTipContent(e.target.value)}
                    placeholder="Write detailed paragraphs, tables, or list items about this financial strategy..."
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-all font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-3">
                  {editingTip && (
                    <button
                      type="button"
                      onClick={cancelEditTip}
                      className="rounded-full bg-muted/40 hover:bg-muted/80 px-6 py-3 text-sm font-semibold text-foreground transition-all cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-[1.01]"
                  >
                    {editingTip ? "Update Investment Guide" : "Publish Investment Guide"}
                  </button>
                </div>
              </form>
            </div>

            {/* Published Tips List */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
                <h3 className="text-base font-semibold text-foreground">
                  Published Tips ({investmentTips.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View and manage current finance articles displayed on the Wealth Creation frontend. Click to preview.
                </p>

                <div className="space-y-3 mt-6 max-h-[600px] overflow-y-auto pr-1">
                  {investmentTips.map((tip) => (
                    <div
                      key={tip.id}
                      onClick={() => setSelectedTip(tip)}
                      className="rounded-xl border border-border bg-card/60 p-4 flex items-start justify-between gap-4 cursor-pointer hover:border-primary/30 hover:bg-card transition-all group"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase border border-primary/20">
                          {tip.category}
                        </span>
                        <h4 className="font-semibold text-xs text-foreground mt-2 truncate group-hover:text-primary transition-colors">
                          {tip.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Published: {new Date(tip.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditTip(tip);
                          }}
                          className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          title="Edit Tip"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTip(tip.id, tip.title);
                          }}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Tip"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {investmentTips.length === 0 && (
                    <div className="text-center py-10">
                      <Coins className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No investment guides found. Add one above!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB VIEW: NEWS (COMPANY NEWS & INSIGHTS)
            ---------------------------------------------------- */}
        {activeTab === "news" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Create/Edit News Form */}
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {editingNews ? `Edit News: ${editingNews.title}` : "Publish News Article"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingNews
                    ? "Modify the title, image/thumbnail, or main content of this news article."
                    : "Add regulatory announcements, business insights, or tax alerts for the News page."}
                </p>
              </div>

              <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Article Title <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                    placeholder="e.g. RBI Changes Repo Rate: Implications for Startups"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Thumbnail Image Option (URL or Upload)
                  </label>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                      value={newNewsImageUrl}
                      onChange={(e) => setNewNewsImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                    <label className="rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center">
                      {isUploading ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setNewNewsImageUrl)}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Content Editor (HTML & links supported) <span className="text-primary">*</span>
                  </label>
                  <HtmlEditor
                    id="newNewsContent"
                    value={newNewsContent}
                    setValue={setNewNewsContent}
                    placeholder="Write detailed news content here. Plain text URLs will automatically become clickable links in the frontend!"
                  />
                </div>

                <div className="flex items-center gap-3 bg-muted/20 border border-border p-3 rounded-xl">
                  <input
                    type="checkbox"
                    id="newNewsIsMarquee"
                    checked={newNewsIsMarquee}
                    onChange={(e) => setNewNewsIsMarquee(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border accent-primary bg-transparent cursor-pointer"
                  />
                  <label htmlFor="newNewsIsMarquee" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                    Pin/Feature in Scrolling Strip
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">
                      Check this to highlight this headline in the homepage ticker.
                    </span>
                  </label>
                </div>

                <div className="pt-3 border-t border-border flex justify-between gap-3">
                  {editingNews && (
                    <button
                      type="button"
                      onClick={cancelEditNews}
                      className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-[1.01]"
                  >
                    {editingNews ? "Update News Article" : "Publish News Article"}
                  </button>
                </div>
              </form>
            </div>

            {/* Published News List */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
                <h3 className="text-base font-semibold text-foreground">
                  Published News ({newsList.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View and manage current news articles displayed on the News frontend. Click to preview.
                </p>

                <div className="space-y-3 mt-6 max-h-[600px] overflow-y-auto pr-1">
                  {newsList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedNews(item)}
                      className="rounded-xl border border-border bg-card/60 p-4 flex items-start justify-between gap-4 cursor-pointer hover:border-primary/30 hover:bg-card transition-all group"
                    >
                      <div className="min-w-0 flex-1 flex gap-3">
                        {/* Thumbnail image mini preview */}
                        <div className="w-10 h-10 rounded bg-muted border border-border overflow-hidden shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary bg-primary/10">
                              <Newspaper className="h-4.5 w-4.5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            {item.is_marquee && (
                              <span className="rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary px-1.5 py-0.5 tracking-wider uppercase shrink-0 flex items-center gap-0.5" title="Featured in Ticker Marquee">
                                <Sparkles className="h-2 w-2 text-primary" /> Ticker
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Published: {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditNews(item);
                          }}
                          className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNews(item.id, item.title);
                          }}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {newsList.length === 0 && (
                    <div className="text-center py-10">
                      <Newspaper className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No news articles published. Add one above!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Maximized view for Lead Query */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4 mb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">Lead Inquiry Details</h3>
                <p className="text-xs text-muted-foreground">
                  Received{" "}
                  {new Date(selectedLead.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  Full Name
                </span>
                <p className="font-semibold text-foreground">{selectedLead.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                    Phone Number
                  </span>
                  <p className="font-semibold text-foreground">
                    {selectedLead.phone || "Not Provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                    Service Requested
                  </span>
                  <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary mt-0.5">
                    {selectedLead.service || "General Inquiry"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                    Status
                  </span>
                  <span className="inline-block rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground capitalize mt-0.5">
                    {selectedLead.status || "New"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Message Details
                </span>
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {selectedLead.message || (
                    <span className="italic text-muted-foreground">No message text filled.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleDeleteLead(selectedLead.id);
                  setSelectedLead(null);
                }}
                className="rounded-xl bg-rose-500 hover:bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/10 transition-colors cursor-pointer"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maximized view for Investment Tip */}
      {selectedTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl relative animate-scale-up max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedTip(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4 mb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Coins className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedTip.title}</h3>
                <span className="inline-block text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase border border-primary/20 mt-1">
                  {selectedTip.category}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 text-sm leading-relaxed max-h-[50vh] text-foreground/80 space-y-3 pr-1">
              <p className="text-[10px] text-muted-foreground">
                Published on: {new Date(selectedTip.created_at).toLocaleString("en-IN")}
              </p>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedTip.content }} 
              />
            </div>

            <div className="pt-4 border-t border-border mt-5 flex justify-end">
              <button
                onClick={() => setSelectedTip(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maximized view for News Article */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl relative animate-scale-up max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4 mb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Newspaper className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedNews.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Published: {new Date(selectedNews.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 text-sm leading-relaxed max-h-[50vh] text-foreground/80 space-y-4 pr-1">
              {selectedNews.image_url && (
                <img
                  src={selectedNews.image_url}
                  alt={selectedNews.title}
                  className="w-full h-40 object-cover rounded-xl border border-border"
                />
              )}
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: selectedNews.content }} 
              />
            </div>

            <div className="pt-4 border-t border-border mt-5 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maximized view for Service details */}
      {viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-0 shadow-2xl relative overflow-hidden animate-scale-up max-h-[85vh] flex flex-col">
            <button
              onClick={() => setViewingService(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header image banner */}
            <div className="h-48 bg-muted relative shrink-0">
              {viewingService.image_url ? (
                <img
                  src={viewingService.image_url}
                  alt={viewingService.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary/10 to-purple-500/10 text-primary">
                  <Grid className="h-12 w-12 opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            {/* Scrollable description */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{viewingService.name}</h3>
                <p className="text-muted-foreground mt-1.5 font-medium">{viewingService.short}</p>
              </div>

              <div className="border-t border-border pt-5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Detailed Information
                </span>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed space-y-3 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: viewingService.description }}
                />
              </div>

              {viewingService.process && viewingService.process.length > 0 && (
                <div className="border-t border-border pt-5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                    Implementation Process
                  </span>
                  <ol className="grid gap-3 sm:grid-cols-2">
                    {viewingService.process.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-muted/30 rounded-xl p-3 border border-border/60">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {idx + 1}
                        </span>
                        <span className="text-foreground/80 text-xs font-medium leading-normal">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border shrink-0 bg-muted/10 flex justify-end">
              <button
                onClick={() => setViewingService(null)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Close Full View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl relative overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-5 border-b border-border shrink-0 bg-muted/10">
              <h3 className="text-base font-bold text-foreground">Edit Service Details</h3>
            </div>

            <form onSubmit={handleUpdateService} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Service Name <span className="text-primary">*</span>
                </label>
                <input
                  required
                  value={editServiceName}
                  onChange={(e) => {
                    setEditServiceName(e.target.value);
                    setEditServiceSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                    );
                  }}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Short Subtitle / Excerpt <span className="text-primary">*</span>
                </label>
                <input
                  required
                  value={editServiceShort}
                  onChange={(e) => setEditServiceShort(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Image Option (URL or Upload)
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={editServiceImageUrl}
                    onChange={(e) => setEditServiceImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                  <label className="rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center">
                    {isUploading ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setEditServiceImageUrl)}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Description HTML Editor <span className="text-primary">*</span>
                </label>
                <HtmlEditor
                  id="editServiceDescription"
                  value={editServiceDescription}
                  setValue={setEditServiceDescription}
                  placeholder="Service description in details. HTML supported."
                />
              </div>

              <div className="space-y-1.5 border-t border-border pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Process Steps List
                </label>
                <div className="flex gap-2">
                  <input
                    value={editServiceStepText}
                    onChange={(e) => setEditServiceStepText(e.target.value)}
                    placeholder="Add step..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStepToEditService();
                      }
                    }}
                    className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={addStepToEditService}
                    className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Add Step
                  </button>
                </div>

                {editServiceProcess.length > 0 && (
                  <ol className="mt-3 space-y-2 rounded-xl border border-border bg-muted/20 p-4 max-h-48 overflow-y-auto">
                    {editServiceProcess.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm text-foreground bg-background/60 rounded-lg px-3 py-1.5 border border-border/80"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-xs text-primary">{index + 1}.</span>
                          {step}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStepFromEditService(index)}
                          className="text-rose-500 hover:bg-rose-500/10 rounded p-1 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface EstimatorServiceCardProps {
  service: EstimatorService;
  onSave: (key: string, name: string, description: string, price: number) => Promise<void>;
}

function EstimatorServiceCard({ service, onSave }: EstimatorServiceCardProps) {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if service updates from DB
  useEffect(() => {
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
  }, [service]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(service.key, name, description, Number(price));
    setIsSaving(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 shadow-card hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-border pb-3 mb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase">
          {service.key.slice(0, 2)}
        </span>
        <div>
          <h4 className="text-sm font-semibold text-foreground capitalize">
            {service.key} Service
          </h4>
          <p className="text-[10px] text-muted-foreground">Key: {service.key}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Service Name
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Sub-items / Description
          </label>
          <input
            required
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Service Fee (₹ Rupees)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-sm font-medium text-muted-foreground">
              ₹
            </span>
            <input
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background/50 pl-7 pr-3 py-2 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/10 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

interface HtmlEditorProps {
  id: string;
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
}

function HtmlEditor({ id, value, setValue, placeholder }: HtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Sync state from value ONLY if the innerHTML is actually different.
  // This prevents React cursor resets when typing.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      setValue(editorRef.current.innerHTML);
    }
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const executeCommand = (command: string, arg: string = "") => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
    updateActiveFormats();
  };

  return (
    <div className="rounded-xl border border-border bg-background/50 overflow-hidden focus-within:border-primary transition-all relative">
      {/* Editor toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-muted/40 border-b border-border/80 p-2 shrink-0 select-none">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // MAGIC: prevents stealing focus from editor!
          onClick={() => executeCommand("bold")}
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
            activeFormats.bold
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]"
              : "hover:bg-muted text-foreground"
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // MAGIC: prevents stealing focus from editor!
          onClick={() => executeCommand("italic")}
          className={`rounded px-2.5 py-1 text-xs italic transition-all cursor-pointer ${
            activeFormats.italic
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]"
              : "hover:bg-muted text-foreground"
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // MAGIC: prevents stealing focus from editor!
          onClick={() => executeCommand("underline")}
          className={`rounded px-2.5 py-1 text-xs underline transition-all cursor-pointer ${
            activeFormats.underline
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]"
              : "hover:bg-muted text-foreground"
          }`}
          title="Underline"
        >
          U
        </button>
      </div>

      <div className="relative min-h-[160px]">
        {/* Placeholder overlay */}
        {!value && (
          <span className="absolute top-3 left-4 text-sm text-muted-foreground pointer-events-none select-none">
            {placeholder || "Write description..."}
          </span>
        )}

        <div
          ref={editorRef}
          id={id}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onClick={updateActiveFormats}
          onFocus={updateActiveFormats}
          className="w-full bg-transparent px-4 py-3 text-sm outline-none min-h-[160px] prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed overflow-y-auto"
          style={{ outline: "none" }}
        />
      </div>
    </div>
  );
}
