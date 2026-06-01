import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Globe, 
  Dumbbell, 
  Coffee, 
  Compass, 
  Heart, 
  Shield, 
  Layers, 
  Code, 
  TrendingUp, 
  Smile, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Laptop, 
  Camera, 
  Scissors, 
  ShoppingBag, 
  Utensils, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Plus, 
  Wand2, 
  Edit3, 
  ImageIcon, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  Monitor, 
  Smartphone, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  Circle, 
  Mail, 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  Download, 
  Layout, 
  MessageSquare,
  Eye,
  Settings,
  History,
  Info,
  Database,
  User,
  ShoppingCart,
  LogIn,
  LogOut
} from 'lucide-react';
import { GeneratedWebsite, WebsiteSection, SectionItem, SectionType, WebsiteTheme } from './types';
import { generateFullHTML } from './utils/exporter';
import { supabase, SQL_SCHEMA_BLUEPRINT, supabaseUrl } from './utils/supabase';
import { SupabaseAuthPortal } from './components/SupabaseAuthPortal';

// Custom Map for rendering correct Lucide components based on string names
const iconMap: Record<string, React.ComponentType<any>> = {
  Coffee: Coffee,
  Globe: Globe,
  Compass: Compass,
  Heart: Heart,
  Shield: Shield,
  Sparkles: Sparkles,
  Layers: Layers,
  Code: Code,
  TrendingUp: TrendingUp,
  Smile: Smile,
  Dumbbell: Dumbbell,
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  Star: Star,
  Laptop: Laptop,
  Camera: Camera,
  Scissors: Scissors,
  ShoppingBag: ShoppingBag,
  Utensils: Utensils,
};

// Available Lucide icons list that user can manually assign in editor
const AVAILABLE_ICONS = Object.keys(iconMap);

// High-fidelity default website showing LUMINA.AI in Saas Business Startup class (cyberpunk-leaning)
const DEFAULT_WEBSITE: GeneratedWebsite = {
  id: 'web-default',
  name: 'LUMINA.AI',
  category: 'startup',
  tagline: 'Autonomous creator workspace for teams.',
  description: 'An advanced web-scale generation engine combining high-performance styling, content-enrichment services, and secure cloud schema configurations.',
  buttonText: 'Launch Engine',
  theme: {
    primaryColor: '#0A0A0A',
    secondaryColor: '#171717',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#00FF41',
    fontSans: 'Space Grotesk',
    fontMono: 'JetBrains Mono',
  },
  createdAt: new Date().toISOString(),
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      title: 'BUILD WITHOUT ANY LIMITS.',
      subtitle: 'FUTURE OF WORKFLOW',
      description: 'Autonomous workflow automation for distributed creative teams. Scalable, secure, and designed to generate instant high-fidelity software assets within a single responsive view.',
      layout: 'split',
      imagePrompt: 'A glowing bright cybernetic computer monitor displaying green digital code, high-contrast dark room aesthetics',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'sec-services',
      type: 'services',
      title: 'High-Performance Capabilities',
      subtitle: 'CORE MODULES',
      description: 'Built upon leading neural processors and engineered to optimize your output pipeline from wireframe to production bundle.',
      layout: 'grid',
      items: [
        {
          id: 'item-s1',
          title: 'Asset Synthesis',
          description: 'Synthesize raw copywriting, tailored vector assets, and bespoke layout frameworks seamlessly guided by artificial intelligence.',
          icon: 'Sparkles',
        },
        {
          id: 'item-s2',
          title: 'Direct Deployment',
          description: 'Compile single-view previews instantly into standalone Tailwind packages optimized with responsive assets and custom fonts.',
          icon: 'Laptop',
        },
        {
          id: 'item-s3',
          title: 'System Co-pilot',
          description: 'Rewrite, adjust, or completely re-engineer specific section modules inline via tailored user guidelines.',
          icon: 'Code',
        }
      ]
    },
    {
      id: 'sec-about',
      type: 'about',
      title: 'Unparalleled Precision Engine',
      subtitle: 'OUR MISSION',
      description: 'Our system breaks down the traditional boundaries of web design. By bypassing bloated libraries and generic framework templates, we assemble pristine, customized layout grids that prioritize readability, user focus, and bold brand presence above all else.',
      layout: 'split',
      imagePrompt: 'Minimal modern geometric architectural archway under clean ambient lighting',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'sec-testimonials',
      type: 'testimonials',
      title: 'Feedback From Developers',
      subtitle: 'TESTIMONIALS',
      description: 'Here is what creative directors and software development teams are saying about our direct generation interface.',
      layout: 'grid',
      items: [
        {
          id: 'item-t1',
          title: 'Marcus Vance',
          role: 'Principal Engineer, NetShift',
          description: 'The ability to live-refine individual landing page sections using natural language transformed our rapid prototyping cycles entirely. Clean code, beautiful font pairing.'
        },
        {
          id: 'item-t2',
          title: 'Sophia Sterling',
          role: 'Lead UI/UX Architect',
          description: 'Finally! A generator that delivers bold, clean layouts with beautiful spacing, instead of default pastel cards that look identical to every other SaaS template.'
        }
      ]
    },
    {
      id: 'sec-pricing',
      type: 'pricing',
      title: 'Modular Plans for Creators',
      subtitle: 'PRICING PLANS',
      description: 'Select the compile rate and model pipeline that fits your operational scale.',
      layout: 'grid',
      items: [
        {
          id: 'item-p1',
          title: 'Developer Core',
          price: 'Free',
          description: 'Transient browser-based sandbox state, high-fidelity Tailwind template exports, and base model completions.'
        },
        {
          id: 'item-p2',
          title: 'Production Compiler',
          price: '$29/mo',
          description: 'Continuous Gemini support, live AI image canvas synthesis, tailored UI refinement guidelines and absolute export files.'
        }
      ]
    }
  ],
};

const PRESET_VIBES = [
  { id: 'cyber', name: 'Tech Cyberpunk', primary: '#0A0A0A', secondary: '#121212', bg: '#0D0F12', text: '#F1F5F9', accent: '#00FF41', font: 'Space Grotesk' },
  { id: 'minimalist', name: 'Classic Minimalist', primary: '#000000', secondary: '#1A1A1A', bg: '#FAFAFA', text: '#18181B', accent: '#2563EB', font: 'Inter' },
  { id: 'sunset', name: 'Vivid Sunset', primary: '#2D1B22', secondary: '#4C1D30', bg: '#FFF8F6', text: '#2C1B20', accent: '#FA5F3D', font: 'Outfit' },
  { id: 'luxury', name: 'Luxe Champagne', primary: '#181A1B', secondary: '#2C2B2A', bg: '#F9F6F0', text: '#1C1917', accent: '#CAB38A', font: 'Playfair Display' },
  { id: 'forest', name: 'Nordic Forest', primary: '#1B2C24', secondary: '#2A3F33', bg: '#FAFDFB', text: '#1E2D24', accent: '#10B981', font: 'DM Sans' },
  { id: 'bold_typo', name: 'Bold Typography', primary: '#08080C', secondary: '#1E293B', bg: '#FAF9F6', text: '#0F172A', accent: '#FF0055', font: 'Syne' },
];

export default function App() {
  // Main state holds currently loaded dynamic website
  const [website, setWebsite] = useState<GeneratedWebsite>(DEFAULT_WEBSITE);
  const [history, setHistory] = useState<GeneratedWebsite[]>([DEFAULT_WEBSITE]);
  
  // Form states to control AI generation request
  const [category, setCategory] = useState('startup');
  const [businessName, setBusinessName] = useState('LUMINA.AI');
  const [shortDesc, setShortDesc] = useState('Autonomous creator workspace for modern web development.');
  const [buttonText, setButtonText] = useState('Launch Engine');
  const [styleVibe, setStyleVibe] = useState('Tech Cyberpunk');
  const [customInstructions, setCustomInstructions] = useState('');

  // App control states
  const [displayRoute, setDisplayRoute] = useState<'workspace' | 'security-portal'>('security-portal');
  const [activeTab, setActiveTab] = useState<'generate' | 'theme' | 'sections' | 'supabase' | 'history'>('generate');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // SUPABASE BACKEND STATES
  const [dbUser, setDbUser] = useState<any>(null);
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [userCart, setUserCart] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [dbStats, setDbStats] = useState({ users: 0, orders: 0, cart: 0, forms: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Client Portal UX State (In-Landing Page)
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'auth' | 'cart' | 'orders' | 'profile'>('cart');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  
  // Custom auth forms states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Contact Form Inputs
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');

  // Schema copying helper
  const [isSchemaCopied, setIsSchemaCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  
  // Custom interactive editing models
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [newSectionPrompt, setNewSectionPrompt] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null); // sectionId
  
  // Success copy feedback state
  const [isCopied, setIsCopied] = useState(false);
  const [isJsonCopied, setIsJsonCopied] = useState(false);

  // Scroll to section helper in preview screen
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Update website custom visual variables
  const handleUpdateThemeValue = (key: keyof WebsiteTheme, value: string) => {
    setWebsite(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value
      }
    }));
  };

  // Pre-load styled settings based on Selected Vibe Preset
  const applyPresetVibe = (preset: typeof PRESET_VIBES[0]) => {
    setWebsite(prev => ({
      ...prev,
      theme: {
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        backgroundColor: preset.bg,
        textColor: preset.text,
        accentColor: preset.accent,
        fontSans: preset.font,
        fontMono: 'JetBrains Mono'
      }
    }));
    setStyleVibe(preset.name);
  };

  // ==========================================
  // SUPABASE INTEGRATION OPERATIONS & ENGINE
  // ==========================================

  // 1. Fetch live row counts for the Developer Stats Tab
  const fetchSupabaseStats = async () => {
    try {
      setIsStatsLoading(true);
      setStatsError(null);
      
      const { count: users, error: uErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      const { count: orders, error: oErr } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
        
      const { count: cart, error: cErr } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true });
        
      const { count: forms, error: fErr } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });
      
      // If any table query triggers a missing relation error, we signal to the user to apply SQL schema
      if (uErr || oErr || cErr || fErr) {
        const primaryError = uErr || oErr || cErr || fErr;
        if (primaryError?.code === '42P01') {
          setStatsError("Tables not initialized yet. Execute the SQL blueprint in your Supabase console!");
        } else {
          setStatsError(primaryError?.message || "Connection active but tables query failed");
        }
      }

      setDbStats({
        users: users || 0,
        orders: orders || 0,
        cart: cart || 0,
        forms: forms || 0
      });
    } catch (err: any) {
      console.warn("Stats loading failed", err);
      setStatsError("Failed to fetch database stats. Verify your table definitions.");
    } finally {
      setIsStatsLoading(false);
    }
  };

  // 2. Fetch profile, historical orders, and active cart from Database for active user
  const fetchUserData = async (userId: string) => {
    try {
      // Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profile) {
        setDbProfile(profile);
        setAuthFullName(profile.full_name || '');
        setAuthPhone(profile.phone || '');
        setAuthAddress(profile.address || '');
      }

      // Cart
      const { data: cart } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);
        
      if (cart) {
        setUserCart(cart);
      }

      // Orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (orders) {
        setUserOrders(orders);
      }
    } catch (error) {
      console.error("Error refreshing active user session data", error);
    }
  };

  // 3. User Authentication handlers (Sign In / Sign Up / Sign Out / Sync)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Email and password parameters are required");
      return;
    }
    
    try {
      setIsAuthLoading(true);
      setAuthError(null);
      setAuthMessage(null);

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: {
            full_name: authFullName || 'Client Member'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setDbUser(data.user);
        // Explicitly fallback create profile table row in case trigger isn't ready
        const { error: profErr } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email: authEmail,
          full_name: authFullName || 'Client Member',
          phone: authPhone,
          address: authAddress,
          updated_at: new Date().toISOString()
        });

        if (profErr) console.warn("Notice: Profiles trigger note or profile manual entry upsert details:", profErr);
        
        setAuthMessage("Account successfully created! Welcome to your secure client workspace portal!");
        await fetchUserData(data.user.id);
        
        // Push guest cart up if we has guest items
        if (userCart.length > 0) {
          const syncedItems = userCart.map(item => ({
            user_id: data.user!.id,
            product_id: item.product_id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            website_name: website.name
          }));
          await supabase.from('cart_items').insert(syncedItems);
        }
        
        // Fresh reload
        await fetchUserData(data.user.id);
        fetchSupabaseStats();
        setPortalTab('cart');
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during secure account sign up.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please input email and password both");
      return;
    }

    try {
      setIsAuthLoading(true);
      setAuthError(null);
      setAuthMessage(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });

      if (error) throw error;

      if (data.user) {
        setDbUser(data.user);
        setAuthMessage("Logged in successfully!");
        await fetchUserData(data.user.id);
        
        // Push guest cart up to database
        const { data: existingCart } = await supabase.from('cart_items').select('*').eq('user_id', data.user.id);
        const localCartItems = [...userCart];
        
        if (localCartItems.length > 0) {
          for (const item of localCartItems) {
            const alreadyExists = existingCart?.find(e => e.product_id === item.product_id);
            if (alreadyExists) {
              await supabase.from('cart_items').update({
                quantity: alreadyExists.quantity + item.quantity
              }).eq('id', alreadyExists.id);
            } else {
              await supabase.from('cart_items').insert({
                user_id: data.user.id,
                product_id: item.product_id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                website_name: website.name
              });
            }
          }
        }

        await fetchUserData(data.user.id);
        fetchSupabaseStats();
        setPortalTab('cart');
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid authentication credentials, please review and try again");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setDbUser(null);
      setDbProfile(null);
      setUserCart([]);
      setUserOrders([]);
      setAuthMessage("Signed out safely.");
      fetchSupabaseStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;

    try {
      setIsAuthLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.from('profiles').upsert({
        id: dbUser.id,
        full_name: authFullName,
        phone: authPhone,
        address: authAddress,
        email: dbUser.email,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      setAuthMessage("Customer profile successfully updated!");
      await fetchUserData(dbUser.id);
      fetchSupabaseStats();
    } catch (err: any) {
      setAuthError(err.message || "Failed to update profile data.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 4. Cart interactions (Syncing with local states and server side Supabase records)
  const handleAddToCart = async (product: { id: string, title: string, price: string }) => {
    // Open portal sidebar automatically to give delightful visual feedback
    setIsPortalOpen(true);
    setPortalTab('cart');

    // Clean price numerical display
    const cleanPrice = product.price.replace(/[^\d.]/g, '') || '49';
    
    if (dbUser) {
      try {
        // Check if item is already in cart in DB
        const { data: existing } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', dbUser.id)
          .eq('product_id', product.id)
          .single();

        if (existing) {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart_items')
            .insert({
              user_id: dbUser.id,
              product_id: product.id,
              title: product.title,
              price: product.price,
              quantity: 1,
              website_name: website.name
            });
          if (error) throw error;
        }
        await fetchUserData(dbUser.id);
        fetchSupabaseStats();
      } catch (err) {
        console.error("Cart DB sync failed, falling back locally", err);
      }
    } else {
      // Local Cartesian implementation
      setUserCart(prev => {
        const index = prev.findIndex(item => item.product_id === product.id);
        if (index !== -1) {
          const copy = [...prev];
          copy[index] = { ...copy[index], quantity: copy[index].quantity + 1 };
          return copy;
        } else {
          return [...prev, {
            id: `local-item-${Date.now()}`,
            product_id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            website_name: website.name
          }];
        }
      });
    }
  };

  const handleUpdateCartQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }

    if (dbUser) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('id', cartItemId);
        if (error) throw error;
        await fetchUserData(dbUser.id);
        fetchSupabaseStats();
      } catch (err) {
        console.error(err);
      }
    } else {
      setUserCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (dbUser) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', cartItemId);
        if (error) throw error;
        await fetchUserData(dbUser.id);
        fetchSupabaseStats();
      } catch (err) {
        console.error(err);
      }
    } else {
      setUserCart(prev => prev.filter(item => item.id !== cartItemId));
    }
  };

  // 5. Checkout / Place order handler
  const handlePlaceOrder = async () => {
    if (userCart.length === 0) return;

    try {
      setIsAuthLoading(true);
      setAuthError(null);

      // Determine total price
      const totalPrice = userCart.reduce((sum, item) => {
        const numeric = parseFloat(item.price.replace(/[^\d.]/g, '')) || 49;
        return sum + (numeric * item.quantity);
      }, 0);

      const shippingAddressStr = dbProfile?.address || authAddress || 'Handled Digitally';
      const recipientNameStr = dbProfile?.full_name || authFullName || dbUser?.email || 'Guest Client';
      const recipientPhoneStr = dbProfile?.phone || authPhone || 'None';

      const orderRow = {
        user_id: dbUser?.id || null, // Allow checkout as anonymous guest if not logged in
        total_price: totalPrice,
        status: 'pending',
        shipping_address: shippingAddressStr,
        recipient_name: recipientNameStr,
        recipient_phone: recipientPhoneStr,
        website_name: website.name,
        items: userCart.map(i => ({ title: i.title, price: i.price, quantity: i.quantity })),
        created_at: new Date().toISOString()
      };

      const { data: newOrder, error: oErr } = await supabase
        .from('orders')
        .insert([orderRow])
        .select()
        .single();

      if (oErr) throw oErr;

      // Clean the database cart if authenticated
      if (dbUser) {
        const { error: cleanCartErr } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', dbUser.id);
        if (cleanCartErr) console.warn("Cart cleaning warning:", cleanCartErr);
        await fetchUserData(dbUser.id);
      } else {
        setUserCart([]); // Standard guest clean
      }

      setAuthMessage(`Order placed successfully! Transaction ID: ${newOrder?.id?.substring(0, 8).toUpperCase()}`);
      
      // Update stats and histories
      fetchSupabaseStats();
      if (dbUser) {
        setPortalTab('orders');
      } else {
        // If guest, show active cart with clear messages
        setPortalTab('cart');
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to submit transaction.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 6. Interactive landing page webform submission
  const handleSubmitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      setContactSuccessMsg("Full name and email fields are required to deliver message.");
      return;
    }

    try {
      setIsSubmittingContact(true);
      setContactSuccessMsg("");

      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            website_name: website.name,
            full_name: contactName,
            email: contactEmail,
            message: contactMessage || "No message included."
          }
        ]);

      if (error) throw error;

      setContactSuccessMsg("Inquiry submitted securely in database! Your support host will reach out shortly.");
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      fetchSupabaseStats();
    } catch (err: any) {
      console.error(err);
      setContactSuccessMsg(`Database offline or table missing: ${err.message || "Connection failure"}`);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // 7. Auto simulated submissions generator
  const triggerDevSubmissionsSimulate = async () => {
    try {
      setIsStatsLoading(true);
      
      // Submit a simulated inquiry
      const dummySubmission = {
        website_name: website.name,
        full_name: `Simulated User ${Math.floor(Math.random() * 900) + 100}`,
        email: `tester-${Date.now()}@example.com`,
        message: "This is an automatic test submission populated securely into the database."
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([dummySubmission]);

      if (error) throw error;
      fetchSupabaseStats();
    } catch (err: any) {
      alert(`Simulation failed: ${err.message || "Is the contact_submissions table created?"}`);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // 8. Auth state monitoring
  useEffect(() => {
    const initSessionSync = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setDbUser(session.user);
          await fetchUserData(session.user.id);
        }
      } catch (e) {
        console.warn("Initial session sync error", e);
      }
      
      // Gather stats at setup
      fetchSupabaseStats();
    };

    initSessionSync();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setDbUser(session.user);
        await fetchUserData(session.user.id);
      } else {
        setDbUser(null);
        setDbProfile(null);
        setUserCart([]);
        setUserOrders([]);
      }
      fetchSupabaseStats();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [website.name]);

  // ==========================================

  // Inbound real-time updates for business description on standard inputs
  const handleEditSectionDirectly = (sectionId: string, updatedSection: WebsiteSection) => {
    setWebsite(prev => {
      const index = prev.sections.findIndex(s => s.id === sectionId);
      if (index === -1) return prev;
      const copy = [...prev.sections];
      copy[index] = updatedSection;
      return { ...prev, sections: copy };
    });
  };

  // Delete section comfortably
  const handleDeleteSection = (sectionId: string) => {
    if (website.sections.length <= 1) {
      alert("A landing page needs at least one section to display.");
      return;
    }
    setWebsite(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  // Re-order layout positions
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= website.sections.length) return;
    
    setWebsite(prev => {
      const copy = [...prev.sections];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return { ...prev, sections: copy };
    });
  };

  // Helper simulated logs for authentic cyberpunk generator interface
  const runSimulatedLogs = (onComplete: () => void) => {
    setGenerationLogs([]);
    const messages = [
      `[INIT] Booting GEN_SITE v2.5 server-side worker...`,
      `[AUTH] Authenticating Google Gemini model pipeline...`,
      `[PARSE] Processing identity context for: '${businessName || "Your Brand"}'`,
      `[STYLE] Balancing design schema with vibe preset: '${styleVibe}'`,
      `[GEMINI] Dispatching structured layouts context...`,
      `[AI] Formulating copy blocks for ${category.toUpperCase()} sections...`,
      `[GRAPHICS] Preparing neural image placement markers...`,
      `[RENDER] Unifying responsive grid structures...`,
      `[COMPLETED] Construction finished! Syncing preview viewport.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < messages.length) {
        setGenerationLogs(prev => [...prev, messages[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 450);
  };

  // Primary API Call: Generative landing page creator
  const handleSubmitGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSelectedSectionId(null);

    // Start logging sequence
    runSimulatedLogs(async () => {
      try {
        const response = await fetch('/api/generate-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            name: businessName,
            description: shortDesc,
            buttonText,
            styleVibe,
            customInstructions: customInstructions
          })
        });

        if (!response.ok) {
          const errObj = await response.json();
          throw new Error(errObj.error || "Failed API response");
        }

        const data: GeneratedWebsite = await response.json();
        
        // Ensure image prompts have valid placeholders initially, and assign unique IDs to sections and their items
        const finalizedData: GeneratedWebsite = {
          ...data,
          id: data.id || `web-${Date.now()}`,
          theme: {
            ...data.theme,
            // Fallbacks in case format came generic
            primaryColor: data.theme.primaryColor || '#0A0A0A',
            backgroundColor: data.theme.backgroundColor || '#ffffff',
            textColor: data.theme.textColor || '#0f172a',
            accentColor: data.theme.accentColor || '#00FF41',
            fontSans: data.theme.fontSans || 'Space Grotesk',
            fontMono: 'JetBrains Mono'
          },
          sections: (data.sections || []).map((sec, secIdx) => ({
            ...sec,
            id: sec.id || `sec-${secIdx}-${Date.now()}`,
            items: (sec.items || []).map((item, itemIdx) => ({
              ...item,
              id: item.id || `item-${secIdx}-${itemIdx}-${Date.now()}`
            }))
          }))
        };

        setWebsite(finalizedData);
        setHistory(prev => [finalizedData, ...prev.filter(item => item.id !== finalizedData.id)]);
        setIsGenerating(false);

      } catch (err: any) {
        console.error(err);
        setGenerationLogs(prev => [...prev, `[ERROR] Failed context pipeline: ${err.message}. Reverting to local fallback.`]);
        setIsGenerating(false);
        alert(`API Error: ${err.message}. Ensure GEMINI_API_KEY is properly configured.`);
      }
    });
  };

  // API Call: Individual inline section refinement using Gemini
  const handleRefineSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !refinePrompt.trim()) return;

    setIsRefining(true);
    try {
      const response = await fetch('/api/refine-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: editingSection,
          instructions: refinePrompt,
          businessContext: {
            name: website.name,
            category: website.category,
            tagline: website.tagline,
            description: website.description
          }
        })
      });

      if (!response.ok) {
        throw new Error("Section update failed.");
      }

      const updatedSectionData = await response.json();
      const randomizedId = editingSection.id; // Keep original ID
      
      const completeRefinedSec: WebsiteSection = {
        ...updatedSectionData,
        id: randomizedId, // Ensure state matches
        imageUrl: editingSection.imageUrl, // Keep original image if generated
        items: (updatedSectionData.items || []).map((item: any, idx: number) => ({
          ...item,
          id: item.id || `item-refine-${idx}-${Date.now()}`
        }))
      };

      handleEditSectionDirectly(randomizedId, completeRefinedSec);
      setEditingSection(null);
      setRefinePrompt('');

    } catch (err: any) {
      alert(`Could not refine section via AI: ${err.message}`);
    } finally {
      setIsRefining(false);
    }
  };

  // API Call: Create new custom section based on prompt instructions
  const handleAddNewSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionPrompt.trim()) return;

    setIsAddingSection(true);
    try {
      const response = await fetch('/api/add-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: newSectionPrompt,
          businessContext: {
            name: website.name,
            category: website.category,
            tagline: website.tagline,
            description: website.description
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not construct section.");
      }

      const generatedSec: WebsiteSection = await response.json();
      
      const completeSec: WebsiteSection = {
        ...generatedSec,
        id: generatedSec.id || `sec-${Date.now()}`,
        items: (generatedSec.items || []).map((item: any, idx: number) => ({
          ...item,
          id: item.id || `item-add-${idx}-${Date.now()}`
        }))
      };
      
      // Push new section to layout
      setWebsite(prev => ({
        ...prev,
        sections: [...prev.sections, completeSec]
      }));

      setNewSectionPrompt('');
      setActiveTab('sections'); // Focus tab to let user see list

      // Smooth scroll preview to bottom
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.scrollTo({
            top: previewRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300);

    } catch (err: any) {
      alert(`Error creating custom section: ${err.message}`);
    } finally {
      setIsAddingSection(false);
    }
  };

  // API Call: Generates custom vector art or photo illustration via gemini-2.5-flash-image
  const handleGenerateSectionImage = async (secId: string, customPrompt: string) => {
    setIsGeneratingImage(secId);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt })
      });

      if (!response.ok) throw new Error("Image generating failed");
      const result = await response.json();

      if (result.imageUrl) {
        setWebsite(prev => {
          const index = prev.sections.findIndex(s => s.id === secId);
          if (index === -1) return prev;
          const updated = [...prev.sections];
          updated[index] = { ...updated[index], imageUrl: result.imageUrl };
          return { ...prev, sections: updated };
        });
      } else {
        alert("Image compiler returned fallback status. Using aesthetic local placeholders instead.");
      }
    } catch (err: any) {
      alert(`Image Generation unavailable: Check server status.`);
    } finally {
      setIsGeneratingImage(null);
    }
  };

  // Utilities: Clipboard Copy tools
  const handleCopyHTML = () => {
    const fullHTML = generateFullHTML(website);
    navigator.clipboard.writeText(fullHTML);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(website, null, 2));
    setIsJsonCopied(true);
    setTimeout(() => setIsJsonCopied(false), 2000);
  };

  // Force local download output
  const handleDownloadIndexHtml = () => {
    const fullHTML = generateFullHTML(website);
    const element = document.createElement("a");
    const file = new Blob([fullHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${website.name.toLowerCase().replace(/\s+/g, '-')}-website.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (displayRoute === 'security-portal') {
    return (
      <SupabaseAuthPortal
        dbUser={dbUser}
        dbProfile={dbProfile}
        userOrders={userOrders}
        userCart={userCart}
        isAuthLoading={isAuthLoading}
        authError={authError}
        authMessage={authMessage}
        setAuthError={setAuthError}
        setAuthMessage={setAuthMessage}
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onEnterWorkspace={() => setDisplayRoute('workspace')}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authFullName={authFullName}
        setAuthFullName={setAuthFullName}
        authPhone={authPhone}
        setAuthPhone={setAuthPhone}
        authAddress={authAddress}
        setAuthAddress={setAuthAddress}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        dbStats={dbStats}
        fetchStats={fetchSupabaseStats}
      />
    );
  }

  return (
    <div id="app-root" className="flex h-screen w-full bg-[#070707] text-[#E5E7EB] overflow-hidden font-sans">
      
      {/* LEFT CONTROL PANEL - IN THEME ACCENT (#00FF41, dark base) */}
      <aside className="w-[380px] h-full border-r border-[#1a1a1a] flex flex-col bg-[#0A0A0A] overflow-hidden shrink-0">
        
        {/* LOGO FRAME */}
        <div className="p-6 border-b border-[#181818] select-none flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white leading-none">
                GEN_<span className="text-[#00FF41]">SITE</span>
              </h1>
              <span className="text-[10px] font-mono tracking-[0.34em] text-neutral-500 uppercase mt-1 block">v2.5 Engine</span>
            </div>
            <div className="flex bg-[#121212] border border-[#222] rounded p-1.5 gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
              <span className="text-[9px] font-mono text-neutral-400">ENGINE_LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0A0D0A]/50 border border-[#00FF41]/20 mt-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping shrink-0"></span>
            <span className="text-[9px] font-mono text-neutral-400 tracking-wide">
              Official Platform: <span className="text-[#00FF41] font-bold">AleeXstudio Developers</span>
            </span>
          </div>

          {/* SUPABASE SECURE BADGE */}
          <button
            type="button"
            onClick={() => setDisplayRoute('security-portal')}
            className={`mt-2 flex items-center justify-between w-full px-3 py-2 rounded-lg border text-left cursor-pointer transition-all duration-200 select-none ${
              dbUser 
                ? 'bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/30' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {dbUser ? (
                <div className="w-5 h-5 rounded-md bg-[#00FF41]/20 border border-[#00FF41]/40 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-[#00FF41]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                </div>
              )}
              <div className="truncate text-left leading-none">
                <p className="text-[10px] font-bold text-white tracking-wide">
                  {dbUser ? (dbProfile?.full_name || 'Active Creator') : 'SUPABASE STATUS'}
                </p>
                <span className="text-[8.5px] font-mono text-zinc-500 truncate block">
                  {dbUser ? dbUser.email : 'Click to Register & Sync Cloud'}
                </span>
              </div>
            </div>
            <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
              dbUser ? 'bg-[#00FF41]/15 text-[#00FF41]' : 'bg-amber-400/10 text-amber-500'
            }`}>
              {dbUser ? 'SYNCED' : 'UNSYNCED'}
            </span>
          </button>
        </div>

        {/* WORKSPACE SECTIONS MENU */}
        <div className="flex border-b border-[#181818] text-[10px] font-mono select-none">
          <button 
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'generate' ? 'border-[#00FF41] text-white bg-[#121212]' : 'border-transparent text-neutral-400 hover:text-white'}`}
          >
            GEN
          </button>
          <button 
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'theme' ? 'border-[#00FF41] text-white bg-[#121212]' : 'border-transparent text-neutral-400 hover:text-white'}`}
          >
            STYLE
          </button>
          <button 
            onClick={() => setActiveTab('sections')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'sections' ? 'border-[#00FF41] text-white bg-[#121212]' : 'border-transparent text-neutral-400 hover:text-white'}`}
          >
            LAYOUT
          </button>
          <button 
            onClick={() => setActiveTab('supabase')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors text-amber-400 font-bold ${activeTab === 'supabase' ? 'border-[#00FF41] bg-[#121212]' : 'border-transparent text-neutral-400 hover:text-white'}`}
            title="Supabase Database Management"
          >
            DATABASE
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2.5 text-center border-b-2 transition-colors relative ${activeTab === 'history' ? 'border-[#00FF41] text-white bg-[#121212]' : 'border-transparent text-neutral-400 hover:text-white'}`}
            title="Generation History"
          >
            <History className="w-3.5 h-3.5 mx-auto" />
            {history.length > 1 && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#00FF41] rounded-full"></span>
            )}
          </button>
        </div>

        {/* SCROLLABLE SIDEBAR ACTIONS CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: GENERATION FORM */}
          {activeTab === 'generate' && (
            <form onSubmit={handleSubmitGenerate} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  [01] Category SELECT
                </label>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2e2e2e] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00FF41] appearance-none cursor-pointer"
                  >
                    <option value="startup">Startup SaaS Portal</option>
                    <option value="restaurant">Bistro Café / Restaurant</option>
                    <option value="travel">Expeditions & Tours Agency</option>
                    <option value="fitness">Workout Studio / Gym</option>
                    <option value="portfolio">Personal Director Portfolio</option>
                    <option value="education">Academy Online Courses</option>
                    <option value="beauty">Aesthetic Styling Salon</option>
                    <option value="shop">Creative eCommerce Store</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  [02] Platform Identity Name
                </label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. TRIP_CRAFT.AI"
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00FF41] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  [03] Short Business Bio
                </label>
                <textarea 
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={3}
                  placeholder="Give a brief summary of services or target group..."
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-md px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#00FF41] resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  [04] Main Button Text
                </label>
                <input 
                  type="text" 
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Explore Core"
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-md px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#00FF41]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  [05] Tone / Theme Vibe
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_VIBES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => applyPresetVibe(v)}
                      className={`text-left px-3 py-2 rounded border text-xs font-medium transition-all ${styleVibe === v.name ? 'bg-[#121212] border-[#00FF41] text-white' : 'bg-transparent border-[#222] text-neutral-400 hover:border-neutral-500'}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.accent }}></span>
                        <span className="truncate">{v.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 border-t border-[#181818] pt-4">
                <label className="block text-[11px] uppercase tracking-wider text-[#00FF41] font-mono flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-[#00FF41]" />
                  Custom AI Directives
                </label>
                <textarea 
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={2}
                  placeholder="E.g., 'Make it focus heavily on subscription model', 'Include detailed bistro menu items', 'Prefer ultra-bold grid patterns'"
                  className="w-full bg-[#121212] border border-[#2e2e2e] rounded-md px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00FF41] resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-white text-black font-black text-xs py-4 uppercase tracking-widest hover:bg-[#00FF41] transition-all disabled:bg-neutral-800 disabled:text-neutral-500 cursor-pointer shadow-lg hover:shadow-[#00FF41]/10 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    GENERATING_SITE...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-black" />
                    GENERATE ASSETS
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: LIVE STYLE CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="p-3 bg-[#121212] border border-[#222] rounded text-xs leading-relaxed text-neutral-400 font-mono">
                [THEME_VECTORS] Adjust colors and typography variables in real-time below. These update the preview and export outputs immediately.
              </div>

              <div className="space-y-4">
                {/* Theme Color Selectors */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Primary Branding Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={website.theme.primaryColor}
                      onChange={(e) => handleUpdateThemeValue('primaryColor', e.target.value)}
                      className="w-10 h-10 border border-[#333] rounded bg-transparent cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={website.theme.primaryColor}
                      onChange={(e) => handleUpdateThemeValue('primaryColor', e.target.value)}
                      className="flex-1 bg-[#121212] border border-[#2e2e2e] rounded text-xs px-3 font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Coordinating Secondary</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={website.theme.secondaryColor}
                      onChange={(e) => handleUpdateThemeValue('secondaryColor', e.target.value)}
                      className="w-10 h-10 border border-[#333] rounded bg-transparent cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={website.theme.secondaryColor}
                      onChange={(e) => handleUpdateThemeValue('secondaryColor', e.target.value)}
                      className="flex-1 bg-[#121212] border border-[#2e2e2e] rounded text-xs px-3 font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Dynamic Accent Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={website.theme.accentColor}
                      onChange={(e) => handleUpdateThemeValue('accentColor', e.target.value)}
                      className="w-10 h-10 border border-[#333] rounded bg-transparent cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={website.theme.accentColor}
                      onChange={(e) => handleUpdateThemeValue('accentColor', e.target.value)}
                      className="flex-1 bg-[#121212] border border-[#2e2e2e] rounded text-xs px-3 font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Page Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={website.theme.backgroundColor}
                      onChange={(e) => handleUpdateThemeValue('backgroundColor', e.target.value)}
                      className="w-10 h-10 border border-[#333] rounded bg-transparent cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={website.theme.backgroundColor}
                      onChange={(e) => handleUpdateThemeValue('backgroundColor', e.target.value)}
                      className="flex-1 bg-[#121212] border border-[#2e2e2e] rounded text-xs px-3 font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Content Typography Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={website.theme.textColor}
                      onChange={(e) => handleUpdateThemeValue('textColor', e.target.value)}
                      className="w-10 h-10 border border-[#333] rounded bg-transparent cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={website.theme.textColor}
                      onChange={(e) => handleUpdateThemeValue('textColor', e.target.value)}
                      className="flex-1 bg-[#121212] border border-[#2e2e2e] rounded text-xs px-3 font-mono text-white"
                    />
                  </div>
                </div>

                {/* Typography Choice */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Primary Typography Family</label>
                  <select 
                    value={website.theme.fontSans}
                    onChange={(e) => handleUpdateThemeValue('fontSans', e.target.value)}
                    className="w-full bg-[#121212] border border-[#2e2e2e] rounded px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Space Grotesk">Space Grotesk (Modern Bold)</option>
                    <option value="Inter">Inter (Sleek Clean)</option>
                    <option value="Outfit">Outfit (Energetic Rounded)</option>
                    <option value="Playfair Display">Playfair Display (Premium Serifs)</option>
                    <option value="Syne">Syne (Display Artistic)</option>
                    <option value="DM Sans">DM Sans (Readable Corporate)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#181818] flex gap-2">
                <button 
                  onClick={() => {
                    setWebsite(prev => ({
                      ...prev,
                      theme: { ...DEFAULT_WEBSITE.theme }
                    }));
                  }}
                  className="flex-1 bg-transparent hover:bg-neutral-900 border border-[#333] hover:border-neutral-500 text-xs py-2 rounded font-mono text-center flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  REST_VECTORS
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LAYOUT SECTIONS & CUSTOM AI BUILDER */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              
              {/* Build new section with text instructions */}
              <div className="p-4 bg-[#111] border border-[#222] rounded-lg space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#00FF41] flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Insert Custom Block
                </h4>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Generate a perfectly structured layout section (e.g., FAQ, pricing, service tier) instantly.
                </p>
                <form onSubmit={handleAddNewSection} className="space-y-2 pt-1">
                  <textarea
                    value={newSectionPrompt}
                    onChange={(e) => setNewSectionPrompt(e.target.value)}
                    placeholder="E.g., 'An accordion FAQ block with 4 common questions about pricing and delivery timelines'"
                    rows={3}
                    className="w-full bg-[#050505] border border-[#333] rounded px-2.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#00FF41]"
                  />
                  <button
                    type="submit"
                    disabled={isAddingSection || !newSectionPrompt.trim()}
                    className="w-full bg-white text-black hover:bg-[#00FF41] font-bold text-[10px] uppercase py-2 tracking-wider transition-all disabled:opacity-40 disabled:text-neutral-500 flex items-center justify-center gap-1"
                  >
                    {isAddingSection ? (
                      <>
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        SYNTHESIZING...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5" />
                        COMPILE CUSTOM BLOCK
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Sections List */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">Sections Hierarchy</label>
                
                {website.sections.map((sec, idx) => (
                  <div 
                    key={sec.id} 
                    className={`p-3 bg-[#121212] border rounded flex items-center justify-between group transition-all ${selectedSectionId === sec.id ? 'border-[#00FF41]' : 'border-[#222] hover:border-neutral-700'}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-600">0{idx + 1}</span>
                        <h4 className="text-xs font-bold text-white truncate">{sec.title}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest pl-4">{sec.type}</span>
                    </div>

                    {/* Hierarchy Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button 
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === website.sections.length - 1}
                        className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingSection(sec);
                          setRefinePrompt('');
                        }}
                        className="p-1 text-[#00FF41] hover:text-white"
                        title="Refine with AI"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1 text-red-500 hover:text-red-400"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE BACKEND PANEL */}
          {activeTab === 'supabase' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  [01] Back-End Sync Status
                </label>
                <div className="p-4 rounded-xl bg-green-950/20 border border-green-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                    <h3 className="font-bold text-xs text-green-400 font-mono">SUPABASE CONNECTED</h3>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono leading-tight break-all">
                    Project ID: {supabaseUrl.match(/https:\/\/([^.]+)\.supabase/)?.[1] || 'vhcpbtclheayxdqfwqlu'}<br/>
                    URL: {supabaseUrl}
                  </p>
                </div>
              </div>

              {/* LIVE MONITOR STATS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                    [02] Live Counters Monitor
                  </label>
                  <button 
                    type="button" 
                    onClick={fetchSupabaseStats} 
                    disabled={isStatsLoading}
                    className="text-[9px] hover:text-[#00FF41] font-mono flex items-center gap-1 transition-colors border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900"
                  >
                    <RefreshCw className={`w-2 h-2 ${isStatsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {statsError ? (
                  <div className="p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/30 text-[10px] text-yellow-500 font-mono leading-normal">
                    <Info className="w-3.5 h-3.5 inline mr-1.5 shrink-0 align-text-bottom text-amber-500" />
                    {statsError}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="p-3 bg-[#111] border border-[#222] rounded-lg">
                      <span className="text-[9px] text-neutral-500 block uppercase">Profiles</span>
                      <span className="text-lg font-bold text-white block mt-0.5">{dbStats.users}</span>
                      <span className="text-[8px] text-[#00FF41] mt-1 block">Live Row sync</span>
                    </div>
                    <div className="p-3 bg-[#111] border border-[#222] rounded-lg">
                      <span className="text-[9px] text-neutral-500 block uppercase">Transactions</span>
                      <span className="text-lg font-bold text-white block mt-0.5">{dbStats.orders}</span>
                      <span className="text-[8px] text-[#00FF41] mt-1 block">Checkout log</span>
                    </div>
                    <div className="p-3 bg-[#111] border border-[#222] rounded-lg">
                      <span className="text-[9px] text-neutral-500 block uppercase">Cart Items</span>
                      <span className="text-lg font-bold text-white block mt-0.5">{dbStats.cart}</span>
                      <span className="text-[8px] text-[#00FF41] mt-1 block">Active digital</span>
                    </div>
                    <div className="p-3 bg-[#111] border border-[#222] rounded-lg">
                      <span className="text-[9px] text-neutral-500 block uppercase">Form Leads</span>
                      <span className="text-lg font-bold text-white block mt-0.5">{dbStats.forms}</span>
                      <span className="text-[8px] text-[#00FF41] mt-1 block">Contact box</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SIMULATION CONTROLS */}
              <div className="space-y-1.5 bg-[#121212] p-4 rounded-xl border border-[#222]">
                <div className="flex items-center gap-1.5 text-neutral-300 font-bold text-[11px] uppercase font-mono mb-1">
                  <Database className="w-3.5 h-3.5 text-amber-500" />
                  Simulation Toolbox
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal mb-3 font-sans">
                  Instantly trigger an API submission to the Supabase database without touching the frontend live forms!
                </p>
                <button
                  type="button"
                  onClick={triggerDevSubmissionsSimulate}
                  disabled={isStatsLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-mono font-bold text-[10px] py-2 rounded uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Simulate Form Submission
                </button>
              </div>

              {/* SQL SCHEMAS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                    [03] SQL DDL Blueprint Setup
                  </label>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText(SQL_SCHEMA_BLUEPRINT);
                      setIsSchemaCopied(true);
                      setTimeout(() => setIsSchemaCopied(false), 2000);
                    }}
                    className="text-[9px] text-[#00FF41] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {isSchemaCopied ? "COPIED" : "COPY SQL"}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#222] overflow-hidden">
                  <p className="text-[10.5px] text-neutral-400 leading-normal mb-2 font-sans">
                    Execute this complete blueprint in your <span className="text-white font-bold">Supabase SQL Editor</span> to initialize all four required database tables safely:
                  </p>
                  <pre className="text-[9px] text-zinc-400/80 font-mono h-40 overflow-y-auto bg-black p-2 rounded border border-[#1b1b1b] select-all">
                    {SQL_SCHEMA_BLUEPRINT}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GENERATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase text-neutral-400">Created Versions</label>
              
              {history.length === 0 ? (
                <p className="text-[10px] text-neutral-500 italic">No historical models logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((hist) => (
                    <div 
                      key={hist.id}
                      onClick={() => setWebsite(hist)}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${website.id === hist.id ? 'bg-[#121212] border-[#00FF41] text-white' : 'bg-transparent border-[#222] text-neutral-400 hover:bg-[#111]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{hist.name}</span>
                        <span className="text-[9px] font-mono text-neutral-500">{hist.category}</span>
                      </div>
                      <p className="text-[10px] truncate mt-1 opacity-70 italic">{hist.tagline}</p>
                      <div className="flex items-center justify-between mt-2 text-[8px] font-mono text-neutral-500">
                        <span>{new Date(hist.createdAt).toLocaleTimeString()}</span>
                        <span className="text-[#00FF41]">[SELECT_MODEL]</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* COMPILER OUTPUT LOGS BAR */}
        <div className="p-4 border-t border-[#181818] bg-[#080808]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">// SYSTEM_COMPILER_LOGS</span>
            {isGenerating && (
              <span className="text-[9px] text-[#00FF41] font-mono animate-pulse">COMPILING_WEB</span>
            )}
          </div>
          <div className="h-20 overflow-y-auto font-mono text-[9px] text-neutral-400 bg-[#0c0c0c] border border-[#1b1b1b] rounded p-2 space-y-1 select-none">
            {generationLogs.length === 0 ? (
              <span className="text-neutral-600 block italic">System idle. Choose category & name then click Generate.</span>
            ) : (
              generationLogs.map((log, lIdx) => (
                <div key={lIdx} className="truncate select-text">
                  <span className="text-[#00FF41]">&gt;</span> {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* DEVELOPER SIGNATURE FOOTER */}
        <div className="px-4 py-3 bg-[#040404] border-t border-[#141414] flex items-center justify-between text-[10px] font-mono select-none">
          <span className="text-neutral-500 uppercase tracking-widest">// DEVS_SIGNATURE</span>
          <div className="flex items-center gap-1.5 text-[#00FF41] font-black tracking-wide bg-[#00FF41]/10 px-2.5 py-1 rounded border border-[#00FF41]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>AleeXstudio</span>
          </div>
        </div>

      </aside>

      {/* DETAILED SECTION REFINEMENT MODAL / DIALOG */}
      {editingSection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-[#2e2e2e] rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#00FF41]" />
                <h3 className="text-xs font-mono uppercase text-white">REWRITE SECTION WITH AI COMPILER</h3>
              </div>
              <button 
                onClick={() => setEditingSection(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleRefineSection} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Target Section</label>
                <div className="p-2.5 bg-[#151515] rounded text-xs select-none">
                  <span className="font-bold text-white block">{editingSection.title}</span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{editingSection.type}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#00FF41] uppercase tracking-wider mb-2">
                  What would you like to update?
                </label>
                <textarea
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="E.g., 'Make the services focus heavily on automated intelligence consultancy', 'Reword testimonials to sound elite and warm', 'Add a third plan called Premium Pro at $99/mo'"
                  rows={4}
                  className="w-full bg-[#121212] border border-[#2e2e2e] focus:border-[#00FF41] text-xs text-white p-3 rounded-lg outline-none resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="flex-1 border border-[#333] hover:border-neutral-500 text-neutral-300 font-mono text-xs py-2.5 rounded-lg transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isRefining || !refinePrompt.trim()}
                  className="flex-1 bg-white hover:bg-[#00FF41] text-black font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isRefining ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      RE-COMPILING SPEC...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      REWRITE SECTION
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CORE DISPLAY CANVAS: PREVIEW ON RIGHT */}
      <main className="flex-1 h-full flex flex-col bg-[#0C0F16] overflow-hidden">
        
        {/* CANVAS CONTROLS HEADER */}
        <header className="h-[73px] border-b border-[#181818] px-8 flex items-center justify-between shrink-0 bg-[#080a0f] select-none">
          
          {/* Window Mock Dot Controls / Status */}
          <div className="flex items-center gap-6">
            <div className="flex gap-1.5 matches">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/30 border border-[#ef4444]/50"></span>
              <span className="w-3 h-3 rounded-full bg-[#eab308]/30 border border-[#eab308]/50"></span>
              <span className="w-3 h-3 rounded-full bg-[#22c55e]/30 border border-[#22c55e]/50"></span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest hidden lg:block">
              LIVE_PREVIEW // CANVAS_RENDER.JS
            </div>
          </div>

          {/* VIEWPORT CONTROLLER */}
          <div className="flex bg-[#121212]/90 border border-[#2e2e2e] p-1 rounded-lg">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${viewMode === 'desktop' ? 'bg-[#00FF41] text-black' : 'text-neutral-400 hover:text-white'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              DESKTOP
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${viewMode === 'mobile' ? 'bg-[#00FF41] text-black' : 'text-neutral-400 hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              MOBILE
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${viewMode === 'code' ? 'bg-[#00FF41] text-black' : 'text-neutral-400 hover:text-white'}`}
            >
              <Code className="w-3.5 h-3.5" />
              RAW_JSON
            </button>
          </div>

          {/* EXPORTS COMMANDS */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyHTML}
              className="bg-[#121212] border border-[#333] hover:border-neutral-500 text-white font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              title="Copy beautiful Tailwind single file HTML code to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                  COPIED!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  COPY_HTML
                </>
              )}
            </button>
            
            <button 
              onClick={handleDownloadIndexHtml}
              className="bg-white hover:bg-[#00FF41] text-black font-bold font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
              title="Save index.html on your local device"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              DOWNLOAD
            </button>
          </div>

        </header>

        {/* CONTAINER PREVIEW VIEWPORT AREA */}
        <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center relative">
          
          {/* BACKGROUND MATTE WATERMARK */}
          <span className="absolute bottom-6 left-6 text-[10px] font-mono text-neutral-800 tracking-wider uppercase select-none">
            GEN_SITE_SANDBOX_STATION // {new Date().toLocaleDateString()}
          </span>

          {/* CODE JSON VIEW MODE */}
          {viewMode === 'code' ? (
            <div className="w-full max-w-4xl bg-[#030509] border border-[#222] rounded-xl p-6 font-mono text-xs overflow-x-auto relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={handleCopyJSON}
                  className="bg-[#151515] border border-[#333] hover:border-neutral-40 relative z-10 text-white px-3 py-1.5 rounded text-[10px] flex items-center gap-1 transition-all"
                >
                  {isJsonCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                      COPIED_JSON!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      COPY_JSON
                    </>
                  )}
                </button>
              </div>
              <pre className="text-emerald-500">{JSON.stringify(website, null, 2)}</pre>
            </div>
          ) : (
            
            /* SITE LAYOUT SIMULATED CONTAINER WINDOW */
            <div 
              ref={previewRef}
              className={`w-full bg-white text-[#0f172a] shadow-2xl overflow-y-auto transition-all ${viewMode === 'mobile' ? 'max-w-[400px] h-[750px] rounded-3xl border-[12px] border-black relative' : 'max-w-6xl rounded-xl border border-[#333] min-h-[80vh]'}`}
              style={{
                fontFamily: `'${website.theme.fontSans}', sans-serif`,
                backgroundColor: website.theme.backgroundColor,
                color: website.theme.textColor
              }}
            >
              {/* MOBILE SPEAKER SLOT */}
              {viewMode === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-50 flex items-center justify-center">
                  <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1"></div>
                </div>
              )}

              {/* SIMULATED RESPONSIVE WEBSITE */}
              <div>
                
                {/* WEBSITE INTERACTIVE HEADER/NAV */}
                <nav 
                  className="sticky top-0 z-40 backdrop-blur-md border-b flex items-center justify-between py-4 px-6 md:px-10 transition-all"
                  style={{
                    backgroundColor: `${website.theme.backgroundColor}cc`,
                    borderColor: `${website.theme.primaryColor}15`
                  }}
                >
                  <a href="#" className="flex items-center gap-2 select-none pointer-events-none">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: website.theme.primaryColor }}>
                      {website.name.charAt(0)}
                    </div>
                    <span className="font-extrabold text-base tracking-tight" style={{ color: website.theme.textColor }}>{website.name}</span>
                  </a>

                  {/* NAV ITEMS LINK HIGHLIGHTS */}
                  <div className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider">
                    {website.sections.filter(s => s.type !== 'hero').map((s) => (
                      <span 
                        key={s.id} 
                        onClick={() => setSelectedSectionId(s.id)}
                        className={`cursor-pointer hover:opacity-100 transition-opacity ${selectedSectionId === s.id ? 'opacity-100 font-bold' : 'opacity-60'}`}
                        style={{ color: website.theme.textColor }}
                      >
                        {s.title.substring(0, 15)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* DIGITAL SHOPPING CART RECEPTACLE BUTTON */}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsPortalOpen(true);
                        setPortalTab('cart');
                      }}
                      className="relative p-2 rounded-full hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border text-xs"
                      style={{ 
                        borderColor: `${website.theme.textColor}1a`, 
                        color: website.theme.textColor,
                        backgroundColor: `${website.theme.primaryColor}0d` 
                      }}
                      title="Digital Shopping Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {userCart.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center animate-bounce shadow-md" style={{ backgroundColor: website.theme.accentColor }}>
                          {userCart.reduce((acc, current) => acc + current.quantity, 0)}
                        </span>
                      )}
                    </button>

                    {/* CLIENT PROFILE PORTAL BUTTON */}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsPortalOpen(true);
                        setPortalTab(dbUser ? 'profile' : 'auth');
                      }}
                      className="p-2 rounded-full hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border text-xs"
                      style={{ 
                        borderColor: `${website.theme.textColor}1a`, 
                        color: website.theme.textColor,
                        backgroundColor: `${website.theme.primaryColor}0d` 
                      }}
                      title={dbUser ? `Logged In: ${dbUser.email}` : "Client Portal Security Center"}
                    >
                      <User className="w-3.5 h-3.5" />
                      {dbUser && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 absolute md:relative md:ml-1 mt-1 md:mt-0"></span>
                      )}
                    </button>

                    {/* ORIGINAL CALL TO ACTION FOR THE ENHANCED LAYOUT */}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsPortalOpen(true);
                        setPortalTab('auth');
                      }}
                      className="px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all select-none hover:scale-105 cursor-pointer block"
                      style={{ backgroundColor: website.theme.accentColor, color: '#ffffff' }}
                    >
                      {website.buttonText}
                    </button>
                  </div>
                </nav>

                {/* WEBSITE RENDERED DYNAMIC CONTENT BLOCKS */}
                <div className="space-y-0">
                  {website.sections.map((sec, secIdx) => {
                    const isSelected = selectedSectionId === sec.id;
                    const bgStyle = sec.type === 'hero' 
                      ? { backgroundColor: website.theme.primaryColor, color: '#ffffff' } 
                      : { backgroundColor: website.theme.backgroundColor, color: website.theme.textColor };

                    return (
                      <section 
                        key={sec.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSectionId(sec.id);
                        }}
                        className={`relative py-16 px-6 md:px-12 border-b group/sec transition-all ${isSelected ? 'ring-4 ring-[#00FF41] ring-offset-2 ring-offset-[#0C0F16]' : 'border-transparent'}`}
                        style={{
                          ...bgStyle,
                          borderColor: `${website.theme.primaryColor}0a`
                        }}
                      >

                        {/* SECTION METADATA CONTROL OVERLAY - SHOWN ON HOVER */}
                        <div className="absolute top-2 right-4 z-30 opacity-0 group-hover/sec:opacity-100 transition-opacity bg-[#0A0A0A] border border-[#222] rounded px-3 py-1.5 flex items-center gap-3 text-xs font-mono shadow-xl text-white select-none">
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">[SECTION: {sec.type}]</span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSection(sec);
                              setRefinePrompt('');
                            }}
                            className="text-[#00FF41] font-bold hover:underline flex items-center gap-1"
                          >
                            <Wand2 className="w-3 h-3" />
                            AI_EDIT
                          </button>

                          <div className="w-[1px] h-3.5 bg-neutral-800"></div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSection(sec.id);
                            }}
                            className="text-red-500 font-bold hover:underline"
                          >
                            DEL
                          </button>
                        </div>

                        {/* RENDERED HERO LAYOUT */}
                        {sec.type === 'hero' && (
                          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            
                            <div className="lg:col-span-7 space-y-5">
                              {sec.subtitle && (
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border`}
                                      style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              
                              {/* Direct text-editing overlays */}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className={`w-full bg-transparent border-none p-0 leading-tight focus:outline-none focus:ring-1 focus:ring-white text-white transition-all ${
                                  (website.theme.fontSans === 'Syne' || website.theme.fontSans === 'Outfit')
                                    ? 'font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter uppercase'
                                    : 'font-black text-3xl md:text-5xl lg:text-6xl tracking-tight'
                                }`}
                              />

                              <textarea 
                                value={sec.description || ''}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, description: e.target.value });
                                }}
                                rows={3}
                                className="w-full bg-transparent font-normal text-sm md:text-base opacity-85 text-neutral-300 resize-none border-none p-0 focus:ring-1 focus:ring-white focus:outline-none leading-relaxed"
                              />

                              <div className="flex flex-wrap gap-4 pt-2">
                                <span className="px-6 py-3 rounded-xl font-bold bg-[#ffffff] text-[#0A0A0A] text-xs shadow-lg font-mono">
                                  {website.buttonText}
                                </span>
                                <span className="px-6 py-3 rounded-xl font-medium border border-white/20 text-white text-xs bg-white/5 font-mono">
                                  Learn More
                                </span>
                              </div>
                            </div>

                            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                              {sec.imageUrl ? (
                                <div className="rounded-2xl overflow-hidden shadow-2xl relative group/img aspect-[4/3] bg-neutral-950/30">
                                  <img src={sec.imageUrl} alt={website.name} className="w-full h-full object-cover" />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateSectionImage(sec.id, sec.imagePrompt || sec.title);
                                    }}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center font-mono text-[11.5px] uppercase tracking-wider text-white transition-opacity font-bold"
                                  >
                                    <ImageIcon className="w-4 h-4 mr-1 text-[#00FF41]" />
                                    Regenerate AI Image
                                  </button>
                                </div>
                              ) : (
                                <div className="aspect-[4/3] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-white/5 relative">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateSectionImage(sec.id, sec.imagePrompt || sec.title);
                                    }}
                                    disabled={isGeneratingImage === sec.id}
                                    className="px-5 py-3 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-white text-[11px] font-mono uppercase tracking-wider text-white font-bold transition-all flex items-center justify-center gap-1.5"
                                  >
                                    {isGeneratingImage === sec.id ? (
                                      <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00FF41]" />
                                        COMPILING...
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 className="w-3.5 h-3.5 text-[#00FF41]" />
                                        GENERATE AI IMAGE
                                      </>
                                    )}
                                  </button>
                                  <p className="text-[10px] text-white/50 leading-relaxed mt-2.5 max-w-[210px]">
                                    Creates a customized {sec.imagePrompt ? "illustration" : "vector visual"} matching this section subject.
                                  </p>
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                        {/* SERVICES & FEATURES LAYOUT */}
                        {(sec.type === 'services' || sec.type === 'features') && (
                          <div className="max-w-5xl mx-auto space-y-8">
                            <div className="text-center max-w-2xl mx-auto space-y-3">
                              {sec.subtitle && (
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase`}
                                      style={{ backgroundColor: `${website.theme.accentColor}1A`, color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent text-center font-black text-2xl md:text-3xl tracking-tight focus:ring-1 focus:ring-offset-1 border-none focus:outline-none"
                                style={{ color: website.theme.textColor }}
                              />
                              {sec.description && (
                                <p className="text-xs md:text-sm opacity-80 leading-relaxed">{sec.description}</p>
                              )}
                            </div>

                            {/* Service Items Grid */}
                            {sec.items && sec.items.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {sec.items.map((item, itemIdx) => {
                                  const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Sparkles;
                                  return (
                                    <div 
                                      key={item.id}
                                      className="p-6 rounded-2xl border transition-all duration-300 relative group/card"
                                      style={{ 
                                        borderColor: `${website.theme.primaryColor}1a`,
                                        backgroundColor: website.theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141824'
                                      }}
                                    >
                                      {/* Icon Selection Trigger */}
                                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative" style={{ backgroundColor: `${website.theme.primaryColor}10`, color: website.theme.accentColor }}>
                                        <IconComponent className="w-5 h-5" />
                                        
                                        {/* Dropdown overlay to modify icon */}
                                        <select
                                          value={item.icon || 'Sparkles'}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, icon: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                          title="Change Lucide Icon"
                                        >
                                          {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                      </div>

                                      <input 
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => {
                                          const updatedItems = [...(sec.items || [])];
                                          updatedItems[itemIdx] = { ...item, title: e.target.value };
                                          handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                        }}
                                        className="w-full bg-transparent font-bold text-base mb-1 border-none p-0 focus:ring-1 focus:outline-none"
                                        style={{ color: website.theme.textColor }}
                                      />
                                      <textarea 
                                        value={item.description}
                                        onChange={(e) => {
                                          const updatedItems = [...(sec.items || [])];
                                          updatedItems[itemIdx] = { ...item, description: e.target.value };
                                          handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                        }}
                                        rows={3}
                                        className="w-full bg-transparent text-xs opacity-75 resize-none border-none p-0 focus:ring-1 focus:outline-none leading-relaxed"
                                      />
                                      
                                      <button 
                                        type="button"
                                        onClick={() => handleAddToCart({ id: item.id, title: item.title, price: item.price || '$39' })}
                                        className="mt-3.5 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold text-white transition-opacity hover:opacity-90 cursor-pointer w-fit"
                                        style={{ backgroundColor: website.theme.accentColor }}
                                      >
                                        <ShoppingCart className="w-3 h-3" />
                                        ADD_TO_CART ({item.price || '$39'})
                                      </button>
                                      
                                      {/* Mini delete service button */}
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updatedItems = (sec.items || []).filter(it => it.id !== item.id);
                                          handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                        }}
                                        className="absolute bottom-2 right-2 p-1 bg-red-950/10 hover:bg-red-500/10 text-red-600 rounded opacity-0 group-hover/card:opacity-100 transition-opacity"
                                        title="Delete Card"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}

                                {/* Add list item trigger */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextId = `item-${Date.now()}`;
                                    const updatedItems = [...(sec.items || []), {
                                      id: nextId,
                                      title: 'System Capability',
                                      description: 'Provide an engaging description outlining professional, effective client support.',
                                      icon: 'Sparkles'
                                    }];
                                    handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                  }}
                                  className="border-2 border-dashed py-8 px-6 rounded-2xl flex flex-col items-center justify-center text-xs font-mono opacity-40 hover:opacity-100 transition-opacity"
                                  style={{ borderColor: `${website.theme.textColor}2a` }}
                                >
                                  <Plus className="w-5 h-5 mb-1 text-center" />
                                  ADD_CAPABILITY_CARD
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ABOUT LAYOUT */}
                        {sec.type === 'about' && (
                          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            
                            <div className="lg:col-span-5 relative">
                              {sec.imageUrl ? (
                                <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-neutral-950/30 group/img relative">
                                  <img src={sec.imageUrl} alt="About Us" className="w-full h-full object-cover animate-fade-in" />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateSectionImage(sec.id, sec.imagePrompt || sec.title);
                                    }}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center font-mono text-[11.5px] uppercase tracking-wider text-white transition-opacity font-bold animate-fade-in"
                                  >
                                    <ImageIcon className="w-4 h-4 mr-1 text-[#00FF41]" />
                                    Regenerate AI Image
                                  </button>
                                </div>
                              ) : (
                                <div className="aspect-[4/3] border-2 border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-stone-100/5 bg-neutral-50 relative" style={{ borderColor: `${website.theme.textColor}1a` }}>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateSectionImage(sec.id, sec.imagePrompt || sec.title);
                                    }}
                                    disabled={isGeneratingImage === sec.id}
                                    className="px-5 py-3 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-black text-[11px] font-mono uppercase tracking-wider text-white font-bold transition-all flex items-center justify-center gap-1.5"
                                  >
                                    {isGeneratingImage === sec.id ? (
                                      <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00FF41]" />
                                        GENERATING...
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 className="w-3.5 h-3.5 text-[#00FF41]" />
                                        GENERATE AI PHOTO
                                      </>
                                    )}
                                  </button>
                                  <p className="text-[10px] opacity-60 leading-relaxed mt-2.5 max-w-[210px]">
                                    Builds a customized high-fidelity visual matching: "{sec.imagePrompt || 'About block description'}"
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="lg:col-span-1 border-none"></div>

                            <div className="lg:col-span-6 space-y-4">
                              {sec.subtitle && (
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent font-black text-2xl md:text-3.5xl border-none p-0 focus:ring-1 focus:outline-none"
                                style={{ color: website.theme.textColor }}
                              />
                              <textarea 
                                value={sec.description || ''}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, description: e.target.value });
                                }}
                                rows={6}
                                className="w-full bg-transparent font-normal text-xs md:text-sm opacity-80 leading-relaxed resize-none border-none p-0 focus:ring-1 focus:outline-none"
                              />
                            </div>

                          </div>
                        )}

                        {/* TESTIMONIALS LAYOUT */}
                        {sec.type === 'testimonials' && (
                          <div className="max-w-5xl mx-auto space-y-8">
                            <div className="text-center max-w-2xl mx-auto space-y-3">
                              {sec.subtitle && (
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase`}
                                      style={{ backgroundColor: `${website.theme.accentColor}1A`, color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent text-center font-black text-2xl md:text-3xl tracking-tight focus:ring-1 border-none focus:outline-none"
                                style={{ color: website.theme.textColor }}
                              />
                            </div>

                            {sec.items && sec.items.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {sec.items.map((item, itemIdx) => (
                                  <div 
                                    key={item.id}
                                    className="p-8 rounded-2xl border flex flex-col justify-between relative group/testi"
                                    style={{ 
                                      borderColor: `${website.theme.primaryColor}1a`,
                                      backgroundColor: website.theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141824'
                                    }}
                                  >
                                    <div>
                                      <span className="text-4xl font-serif leading-none block select-none" style={{ color: website.theme.accentColor }}>“</span>
                                      <textarea 
                                        value={item.description}
                                        onChange={(e) => {
                                          const updatedItems = [...(sec.items || [])];
                                          updatedItems[itemIdx] = { ...item, description: e.target.value };
                                          handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                        }}
                                        rows={3}
                                        className="w-full bg-transparent text-xs md:text-sm opacity-90 leading-relaxed resize-none italic border-none p-0 focus:ring-1 focus:outline-none"
                                      />
                                    </div>

                                    <div className="flex items-center gap-3 mt-4">
                                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: website.theme.primaryColor, color: '#ffffff' }}>
                                        {item.title.charAt(0)}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <input 
                                          type="text"
                                          value={item.title}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, title: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          className="w-full bg-transparent font-semibold text-xs border-none p-0 focus:ring-1 focus:outline-none block"
                                          style={{ color: website.theme.textColor }}
                                        />
                                        <input 
                                          type="text"
                                          value={item.role || ''}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, role: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          placeholder="e.g. Creator"
                                          className="w-full bg-transparent text-[10px] opacity-60 border-none p-0 focus:ring-1 focus:outline-none block -mt-0.5"
                                        />
                                      </div>
                                    </div>

                                    {/* Mini remove testimonial */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedItems = (sec.items || []).filter(it => it.id !== item.id);
                                        handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                      }}
                                      className="absolute bottom-3 right-3 p-1 bg-red-950/10 hover:bg-red-500/10 text-red-600 rounded opacity-0 group-hover/testi:opacity-100 transition-opacity"
                                      title="Delete Testimonial"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextId = `item-${Date.now()}`;
                                    const updatedItems = [...(sec.items || []), {
                                      id: nextId,
                                      title: 'Audrey Hepburn',
                                      role: 'Product Director',
                                      description: 'The layout grids are robust, pixel-perfect, and exceptionally simple for direct updates.'
                                    }];
                                    handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                  }}
                                  className="border-2 border-dashed py-10 px-8 rounded-2xl flex flex-col items-center justify-center text-xs font-mono opacity-40 hover:opacity-100 transition-opacity"
                                  style={{ borderColor: `${website.theme.textColor}2a` }}
                                >
                                  <Plus className="w-5 h-5 mb-1 text-center" />
                                  ADD_CLIENT_TESTIMONIAL
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* PRICING PLANS LAYOUT */}
                        {sec.type === 'pricing' && (
                          <div className="max-w-5xl mx-auto space-y-8">
                            <div className="text-center max-w-2xl mx-auto space-y-3">
                              {sec.subtitle && (
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase`}
                                      style={{ backgroundColor: `${website.theme.accentColor}1A`, color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent text-center font-black text-2xl md:text-3xl tracking-tight focus:ring-1 border-none focus:outline-none"
                                style={{ color: website.theme.textColor }}
                              />
                            </div>

                            {sec.items && sec.items.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {sec.items.map((item, itemIdx) => {
                                  const isPopular = itemIdx === 0 || itemIdx === 1 && (sec.items?.length || 0) >= 2;
                                  return (
                                    <div 
                                      key={item.id}
                                      className="p-8 rounded-3xl border flex flex-col justify-between relative group/price"
                                      style={{ 
                                        borderColor: isPopular ? website.theme.accentColor : `${website.theme.primaryColor}1a`,
                                        backgroundColor: isPopular ? (website.theme.backgroundColor === '#ffffff' ? '#ffffff' : '#151e2e') : (website.theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141824')
                                      }}
                                    >
                                      {isPopular && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest text-white font-extrabold" style={{ backgroundColor: website.theme.accentColor }}>
                                          Popular Choice
                                        </span>
                                      )}

                                      <div>
                                        <input 
                                          type="text"
                                          value={item.title}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, title: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          className="w-full bg-transparent font-bold text-sm uppercase tracking-wider opacity-75 border-none p-0 focus:ring-1 focus:outline-none block mb-2"
                                          style={{ color: website.theme.textColor }}
                                        />

                                        <div className="my-3 flex items-baseline gap-1">
                                          <input 
                                            type="text"
                                            value={item.price || ''}
                                            onChange={(e) => {
                                              const updatedItems = [...(sec.items || [])];
                                              updatedItems[itemIdx] = { ...item, price: e.target.value };
                                              handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                            }}
                                            placeholder="Price"
                                            className="w-24 bg-transparent font-black text-3xl md:text-4xl border-none p-0 focus:ring-1 focus:outline-none"
                                            style={{ color: website.theme.textColor }}
                                          />
                                        </div>

                                        <textarea 
                                          value={item.description}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, description: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          rows={3}
                                          className="w-full bg-transparent text-xs opacity-80 leading-relaxed resize-none border-none p-0 focus:ring-1 focus:outline-none"
                                        />
                                      </div>

                                      <button 
                                        type="button"
                                        onClick={() => handleAddToCart({ id: item.id, title: `${website.name} - ${item.title}`, price: item.price || '$49' })}
                                        className="w-full py-2.5 rounded-xl font-bold font-mono text-[10px] uppercase tracking-wider mt-6 transition-all hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                                        style={{ 
                                          backgroundColor: isPopular ? website.theme.accentColor : `${website.theme.textColor}1a`,
                                          color: isPopular ? '#ffffff' : website.theme.textColor
                                        }}
                                      >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        ADD TO CART ({item.price || '$49'})
                                      </button>

                                      {/* Mini remove tier */}
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updatedItems = (sec.items || []).filter(it => it.id !== item.id);
                                          handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                        }}
                                        className="absolute bottom-3 right-3 p-1 bg-red-950/10 hover:bg-red-500/10 text-red-600 rounded opacity-0 group-hover/price:opacity-100 transition-opacity"
                                        title="Delete Tier"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextId = `item-${Date.now()}`;
                                    const updatedItems = [...(sec.items || []), {
                                      id: nextId,
                                      title: 'Professional',
                                      price: '$59/mo',
                                      description: 'Expanded compilation speeds, 10 continuous AI refinements per session, and dedicated system support.'
                                    }];
                                    handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                  }}
                                  className="border-2 border-dashed py-12 px-8 rounded-3xl flex flex-col items-center justify-center text-xs font-mono opacity-40 hover:opacity-100 transition-opacity"
                                  style={{ borderColor: `${website.theme.textColor}2a` }}
                                >
                                  <Plus className="w-5 h-5 mb-1 text-center" />
                                  ADD_PRICING_TIER
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* DETAILED FAQ ACCORDIONS */}
                        {sec.type === 'faqs' && (
                          <div className="max-w-4xl mx-auto space-y-6">
                            <div className="text-center max-w-2xl mx-auto space-y-3 mb-4">
                              {sec.subtitle && (
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase`}
                                      style={{ backgroundColor: `${website.theme.accentColor}1A`, color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent text-center font-black text-2xl md:text-3xl tracking-tight focus:ring-1 border-none focus:outline-none"
                                style={{ color: website.theme.textColor }}
                              />
                            </div>

                            {sec.items && sec.items.length > 0 && (
                              <div className="space-y-4">
                                {sec.items.map((item, itemIdx) => (
                                  <div 
                                    key={item.id}
                                    className="p-5 rounded-xl border relative group/faq"
                                    style={{ 
                                      borderColor: `${website.theme.primaryColor}12`,
                                      backgroundColor: website.theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141824'
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: website.theme.accentColor }}></span>
                                      <div className="flex-1">
                                        <input 
                                          type="text"
                                          value={item.title}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, title: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          className="w-full bg-transparent font-bold text-xs md:text-sm mb-1 border-none p-0 focus:ring-1 focus:outline-none"
                                          style={{ color: website.theme.textColor }}
                                        />
                                        <textarea 
                                          value={item.description}
                                          onChange={(e) => {
                                            const updatedItems = [...(sec.items || [])];
                                            updatedItems[itemIdx] = { ...item, description: e.target.value };
                                            handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                          }}
                                          rows={2}
                                          className="w-full bg-transparent text-xs opacity-75 resize-none border-none p-0 focus:ring-1 focus:outline-none leading-relaxed"
                                        />
                                      </div>
                                    </div>

                                    {/* Mini remove FAQ */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedItems = (sec.items || []).filter(it => it.id !== item.id);
                                        handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                      }}
                                      className="absolute top-3 right-3 p-1 bg-red-950/10 hover:bg-red-500/10 text-red-600 rounded opacity-0 group-hover/faq:opacity-100 transition-opacity"
                                      title="Delete FAQ"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextId = `item-${Date.now()}`;
                                    const updatedItems = [...(sec.items || []), {
                                      id: nextId,
                                      title: 'How long until my generated assets compile?',
                                      description: 'The standard compiler takes between 400 and 1500 milliseconds for live sync visualization.'
                                    }];
                                    handleEditSectionDirectly(sec.id, { ...sec, items: updatedItems });
                                  }}
                                  className="w-full border-2 border-dashed py-4 rounded-xl flex items-center justify-center text-xs font-mono opacity-40 hover:opacity-100 transition-opacity gap-1.5"
                                  style={{ borderColor: `${website.theme.textColor}2a` }}
                                >
                                  <Plus className="w-4 h-4" />
                                  ADD_FAQ_ITEM
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* STANDARD CONTACT BLOCK */}
                        {sec.type === 'contact' && (
                          <div className="max-w-4xl mx-auto space-y-6">
                            <div className="text-center max-w-2xl mx-auto space-y-3">
                              {sec.subtitle && (
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase`}
                                      style={{ backgroundColor: `${website.theme.accentColor}1A`, color: website.theme.accentColor }}>
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent text-center font-black text-2xl md:text-3xl tracking-tight focus:ring-1 border-none focus:outline-none animate-none"
                                style={{ color: website.theme.textColor }}
                              />
                              <textarea 
                                value={sec.description || ''}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, description: e.target.value });
                                }}
                                rows={2}
                                className="w-full bg-transparent text-center text-xs opacity-75 resize-none border-none p-0 focus:ring-1 focus:outline-none leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-6">
                              <div className="md:col-span-5 space-y-4">
                                <div className="p-4 rounded-xl border flex items-start gap-3" style={{ borderColor: `${website.theme.primaryColor}1a` }}>
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: `${website.theme.primaryColor}15`, color: website.theme.accentColor }}>
                                    <Mail className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs">Direct Mailbox</h4>
                                    <p className="text-[11px] opacity-70 mt-0.5">hello@{website.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                                  </div>
                                </div>
                                <div className="p-4 rounded-xl border flex items-start gap-3" style={{ borderColor: `${website.theme.primaryColor}1a` }}>
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: `${website.theme.primaryColor}15`, color: website.theme.accentColor }}>
                                    <Phone className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs font-mono">STATION DIRECT</h4>
                                    <p className="text-[11px] opacity-70 mt-0.5">+1 (800) {website.name.length * 3 + 120}-8493</p>
                                  </div>
                                </div>
                              </div>

                              <form 
                                className="md:col-span-7 p-6 border rounded-2xl space-y-3" 
                                style={{ borderColor: `${website.theme.primaryColor}25` }} 
                                onSubmit={handleSubmitContactForm}
                              >
                                {contactSuccessMsg && (
                                  <div className="p-2.5 rounded text-[10px] font-mono select-none leading-normal" style={{ backgroundColor: `${website.theme.accentColor}1A`, color: website.theme.accentColor }}>
                                    {contactSuccessMsg}
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[8px] font-mono uppercase tracking-wider mb-1 opacity-60">Full Name</label>
                                    <input 
                                      type="text" 
                                      placeholder="John Doe" 
                                      required
                                      value={contactName}
                                      onChange={(e) => setContactName(e.target.value)}
                                      className="w-full px-3 py-2 rounded border text-xs focus:ring-1" 
                                      style={{ borderColor: `${website.theme.primaryColor}1a`, backgroundColor: website.theme.backgroundColor === '#ffffff' ? '#ffffff' : '#141824', color: website.theme.textColor }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-mono uppercase tracking-wider mb-1 opacity-60">Recipient Mail</label>
                                    <input 
                                      type="email" 
                                      placeholder="john@example.com" 
                                      required
                                      value={contactEmail}
                                      onChange={(e) => setContactEmail(e.target.value)}
                                      className="w-full px-3 py-2 rounded border text-xs focus:ring-1" 
                                      style={{ borderColor: `${website.theme.primaryColor}1a`, backgroundColor: website.theme.backgroundColor === '#ffffff' ? '#ffffff' : '#141824', color: website.theme.textColor }} 
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono uppercase tracking-wider mb-1 opacity-60">Inquiry Message</label>
                                  <textarea 
                                    placeholder="Tell us about your requirements..." 
                                    value={contactMessage}
                                    rows={2}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full px-3 py-2 rounded border text-xs focus:ring-1 resize-none" 
                                    style={{ borderColor: `${website.theme.primaryColor}1a`, backgroundColor: website.theme.backgroundColor === '#ffffff' ? '#ffffff' : '#141824', color: website.theme.textColor }} 
                                  />
                                </div>
                                <button 
                                  type="submit" 
                                  disabled={isSubmittingContact}
                                  className="w-full py-2 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-mono font-bold text-[10px] rounded uppercase mt-2 select-text cursor-pointer transition-colors"
                                >
                                  {isSubmittingContact ? "SUBMITTING TO SUPABASE..." : "Send Database Inquiry (Secure)"}
                                </button>
                              </form>
                            </div>
                          </div>
                        )}

                        {/* CUSTOM / GENERIC AI BLOCK */}
                        {sec.type === 'custom' && (
                          <div className="max-w-5xl mx-auto space-y-4">
                            <div className="text-center max-w-2xl mx-auto space-y-2">
                              {sec.subtitle && (
                                <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-mono uppercase font-bold">
                                  {sec.subtitle}
                                </span>
                              )}
                              <input 
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  handleEditSectionDirectly(sec.id, { ...sec, title: e.target.value });
                                }}
                                className="w-full bg-transparent text-center font-black text-2xl tracking-tight focus:ring-1 border-none focus:outline-none"
                                style={{ color: website.theme.textColor }}
                              />
                            </div>
                            <textarea 
                              value={sec.description || ''}
                              onChange={(e) => {
                                handleEditSectionDirectly(sec.id, { ...sec, description: e.target.value });
                              }}
                              rows={4}
                              className="w-full bg-transparent text-center text-xs md:text-sm opacity-80 leading-relaxed resize-none border-none p-0 focus:ring-1 focus:outline-none max-w-4xl mx-auto block"
                            />
                          </div>
                        )}

                      </section>
                    );
                  })}
                </div>

                {/* PREMIUM FOOTER */}
                <footer 
                  className="py-12 px-6 border-t font-sans select-none"
                  style={{
                    borderColor: `${website.theme.primaryColor}10`,
                    color: website.theme.textColor,
                    backgroundColor: website.theme.backgroundColor
                  }}
                >
                  <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs select-none" style={{ backgroundColor: website.theme.primaryColor }}>
                        {website.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-xs block">{website.name}</span>
                        <span className="text-[10px] opacity-60 block">{website.tagline}</span>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-50 font-mono tracking-wider">
                      &copy; 2026 {website.name}. Developed & Powered by <span className="text-[#00FF41] font-semibold">AleeXstudio Developers</span>. All rights reserved.
                    </span>
                  </div>
                </footer>

                {/* INTERACTIVE CUSTOMER CLIENT PORTAL PANEL */}
                {isPortalOpen && (
                  <div 
                    className="absolute top-0 right-0 h-full w-[360px] max-w-full bg-[#0E131F] text-zinc-100 z-50 flex flex-col border-l shadow-2xl animate-in slide-in-from-right duration-300 select-none pb-4"
                    style={{ borderColor: `${website.theme.accentColor}30`, fontFamily: `'Inter', sans-serif` }}
                  >
                    {/* PANEL HEADER */}
                    <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#121929]">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-amber-500" />
                        <div>
                          <h3 className="font-extrabold text-xs tracking-wider uppercase text-white font-mono">{website.name} Portal</h3>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Secured via Supabase</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsPortalOpen(false);
                          setAuthMessage(null);
                          setAuthError(null);
                        }}
                        className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* STATUS TOAST BANNER */}
                    {(authMessage || authError) && (
                      <div className="p-3 border-b border-zinc-805 text-[10.5px] leading-relaxed select-none">
                        {authMessage && (
                          <div className="p-2.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono">
                            <CheckCircle className="w-3.5 h-3.5 inline mr-1.5 shrink-0 align-text-bottom" />
                            {authMessage}
                          </div>
                        )}
                        {authError && (
                          <div className="p-2.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                            <Info className="w-3.5 h-3.5 inline mr-1.5 shrink-0 align-text-bottom" />
                            {authError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PORTAL NAVIGATIONAL TABS */}
                    <div className="flex bg-[#0A0D14] border-b border-zinc-800 text-[10px] font-mono uppercase font-bold select-none divide-x divide-zinc-850">
                      <button 
                        type="button"
                        onClick={() => { setPortalTab('cart'); setAuthError(null); setAuthMessage(null); }}
                        className={`flex-1 py-3 text-center transition-colors cursor-pointer ${portalTab === 'cart' ? 'bg-[#121929] text-white font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Cart ({userCart.length})
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setPortalTab(dbUser ? 'profile' : 'auth'); setAuthError(null); setAuthMessage(null); }}
                        className={`flex-1 py-3 text-center transition-colors cursor-pointer ${portalTab === 'profile' || portalTab === 'auth' ? 'bg-[#121929] text-white font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Profile
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setPortalTab('orders'); setAuthError(null); setAuthMessage(null); }}
                        className={`flex-1 py-3 text-center transition-colors cursor-pointer ${portalTab === 'orders' ? 'bg-[#121929] text-white font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Orders ({userOrders.length})
                      </button>
                    </div>

                    {/* TAB VIEWS CONTAINER */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">

                      {/* 1. DIGITAL SHOPPERS CART */}
                      {portalTab === 'cart' && (
                        <div className="space-y-4 h-full flex flex-col justify-between">
                          {userCart.length === 0 ? (
                            <div className="text-center py-12 space-y-3 my-auto">
                              <ShoppingCart className="w-8 h-8 text-zinc-600 mx-auto opacity-70" />
                              <h4 className="font-bold text-xs text-zinc-300">Your Cart is Currently Empty</h4>
                              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                                Add items to your cart by clicking the "Add to Cart" or "Choose Plan" buttons on services/pricing lists inside the website landing page preview area!
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 flex-1 overflow-y-auto">
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Current Selections</label>
                              <div className="space-y-2">
                                {userCart.map((item) => {
                                  return (
                                    <div key={item.id} className="p-3 bg-[#111622] rounded-lg border border-zinc-800/80 flex items-center justify-between gap-2">
                                      <div className="truncate pr-1">
                                        <h4 className="font-bold text-xs text-white truncate text-left">{item.title}</h4>
                                        <span className="text-[10px] font-mono text-zinc-400 block mt-0.5 text-left" style={{ color: website.theme.accentColor }}>{item.price} each</span>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <div className="flex bg-[#0A0D14] border border-zinc-800 rounded overflow-hidden text-[10px] font-mono">
                                          <button 
                                            type="button" 
                                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                                            className="px-1.5 py-0.5 hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                                          >-</button>
                                          <span className="px-2 py-0.5 text-white">{item.quantity}</span>
                                          <button 
                                            type="button" 
                                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                                            className="px-1.5 py-0.5 hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                                          >+</button>
                                        </div>
                                        <button 
                                          type="button" 
                                          onClick={() => handleRemoveFromCart(item.id)}
                                          className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                          title="Remove"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="p-3.5 bg-[#0a0d14] rounded-xl border border-zinc-800 space-y-2.5 mt-4 text-xs font-mono">
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Subtotal:</span>
                                  <span className="text-zinc-300">
                                    ${userCart.reduce((sum, item) => sum + ((parseFloat(item.price.replace(/[^\d.]/g, '')) || 39) * item.quantity), 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Fulfillment:</span>
                                  <span className="text-[10px] text-zinc-400">Secure Digital Delivery</span>
                                </div>
                                <div className="h-px bg-zinc-800 my-1"></div>
                                <div className="flex justify-between text-white font-bold font-sans text-sm">
                                  <span>Total Price:</span>
                                  <span style={{ color: website.theme.accentColor }}>
                                    ${userCart.reduce((sum, item) => sum + ((parseFloat(item.price.replace(/[^\d.]/g, '')) || 39) * item.quantity), 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Checkout actions */}
                              <div className="space-y-2 pt-2">
                                {!dbUser && (
                                  <p className="text-[9.5px] text-zinc-500 leading-normal text-center italic font-sans mb-1">
                                    * Checkout as Guest will process order immediately but won't record in user account dashboard profiles.
                                  </p>
                                )}
                                <button
                                  type="button"
                                  onClick={handlePlaceOrder}
                                  disabled={isAuthLoading}
                                  className="w-full py-2.5 hover:opacity-90 text-black font-extrabold text-xs tracking-wider rounded-lg uppercase cursor-pointer flex items-center justify-center gap-1.5"
                                  style={{ backgroundColor: website.theme.accentColor }}
                                >
                                  {isAuthLoading ? "Processing Checkout..." : "🛒 Complete Checkout"}
                                </button>
                                
                                {!dbUser && (
                                  <button
                                    type="button"
                                    onClick={() => { setPortalTab('auth'); }}
                                    className="w-full text-center py-2 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-[10px] font-mono uppercase cursor-pointer bg-[#0A0D14]"
                                  >
                                    Sign In First to Log Order
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. AUTHENTICATION (LOGIN/SIGNUP) */}
                      {portalTab === 'auth' && (
                        <div className="space-y-4">
                          {dbUser ? (
                            <div className="p-4 bg-zinc-90 w-full rounded-xl border border-zinc-850 space-y-3">
                              <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-amber-500" />
                                <div className="text-left">
                                  <h4 className="font-bold text-xs text-white">Authenticated Session</h4>
                                  <span className="text-[10px] text-zinc-500 font-mono truncate block max-w-[200px]">{dbUser.email}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleSignOut}
                                className="w-full py-2 border border-red-500/40 text-red-00 hover:bg-red-950/20 rounded font-mono text-[10px] uppercase cursor-pointer"
                              >
                                Sign Out safely
                              </button>
                            </div>
                          ) : (
                            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3 text-xs text-left">
                              <h4 className="font-mono text-[11px] font-bold text-zinc-300 uppercase tracking-wider block border-b border-zinc-800 pb-1">
                                {isSignUp ? "Register Account" : "Access Customer Space"}
                              </h4>
                              
                              {isSignUp && (
                                <div className="space-y-1">
                                  <label className="block text-[9px] font-mono uppercase text-zinc-500">Your Full Name</label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="Jane Doe" 
                                    value={authFullName}
                                    onChange={(e) => setAuthFullName(e.target.value)}
                                    className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 focus:ring-1 focus:outline-none text-zinc-100" 
                                  />
                                </div>
                              )}

                              <div className="space-y-1">
                                <label className="block text-[9px] font-mono uppercase text-zinc-500">Email Address</label>
                                <input 
                                  type="email" 
                                  required
                                  placeholder="customer@example.com" 
                                  value={authEmail}
                                  onChange={(e) => setAuthEmail(e.target.value)}
                                  className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 focus:ring-1 focus:outline-none text-zinc-100" 
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[9px] font-mono uppercase text-zinc-500">Secret Password</label>
                                <input 
                                  type="password" 
                                  required
                                  placeholder="••••••••" 
                                  value={authPassword}
                                  onChange={(e) => setAuthPassword(e.target.value)}
                                  className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 focus:ring-1 focus:outline-none text-zinc-100" 
                                />
                              </div>

                              {isSignUp && (
                                <>
                                  <div className="space-y-1">
                                    <label className="block text-[9px] font-mono uppercase text-zinc-500">Contact Number</label>
                                    <input 
                                      type="text" 
                                      placeholder="+1 (555) 0192-2384" 
                                      value={authPhone}
                                      onChange={(e) => setAuthPhone(e.target.value)}
                                      className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 text-zinc-100" 
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-[9px] font-mono uppercase text-zinc-500">Delivery Address</label>
                                    <input 
                                      type="text" 
                                      placeholder="123 Ocean Drive, Suite 10" 
                                      value={authAddress}
                                      onChange={(e) => setAuthAddress(e.target.value)}
                                      className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 text-zinc-100" 
                                    />
                                  </div>
                                </>
                              )}

                              <button 
                                type="submit" 
                                disabled={isAuthLoading}
                                className="w-full py-2 bg-zinc-100 hover:bg-white text-[#0E131F] font-bold uppercase rounded cursor-pointer transition-all tracking-wider text-[10px] font-mono mt-3"
                              >
                                {isAuthLoading ? "Authenticating securely..." : (isSignUp ? "🚀 Secure Signup" : "🔑 Secure Sign In")}
                              </button>

                              <button 
                                type="button"
                                onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); setAuthMessage(null); }}
                                className="w-full text-center text-[10px] text-zinc-500 hover:text-zinc-200 block underline mt-2 cursor-pointer font-sans"
                              >
                                {isSignUp ? "Already have account? Sign In" : "Don't have account? Register"}
                              </button>
                            </form>
                          )}
                        </div>
                      )}

                      {/* 3. PROFILE DETAILS */}
                      {portalTab === 'profile' && (
                        <div className="space-y-4">
                          {!dbUser ? (
                            <div className="text-center py-10 space-y-4">
                              <Shield className="w-6 h-6 text-zinc-500 mx-auto" />
                              <h4 className="font-bold text-xs text-zinc-300">Profile Lock Enabled</h4>
                              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Please Sign In under the Profile tab to access and manage your customer account details.</p>
                              <button 
                                type="button" 
                                onClick={() => setPortalTab('auth')}
                                className="px-3 py-1.5 bg-[#121929] hover:bg-zinc-800 text-white rounded text-[10px] font-mono uppercase cursor-pointer"
                              >Activate Login</button>
                            </div>
                          ) : (
                            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs text-left">
                              <h4 className="font-mono text-[11px] font-bold text-zinc-300 uppercase tracking-wider block border-b border-zinc-800 pb-1">
                                Customer Identity Profile
                              </h4>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-mono uppercase text-zinc-500">Primary Email</label>
                                <input type="email" disabled value={dbUser.email || ''} className="w-full p-2 rounded bg-zinc-950 border border-zinc-850 opacity-40 cursor-not-allowed text-zinc-400" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-mono uppercase text-zinc-500">Full Name</label>
                                <input 
                                  type="text" 
                                  placeholder="Jane Smith" 
                                  value={authFullName}
                                  onChange={(e) => setAuthFullName(e.target.value)}
                                  className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 text-white" 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-mono uppercase text-zinc-500">Contact Telephone</label>
                                <input 
                                  type="text" 
                                  placeholder="+1 (202) 555-0143" 
                                  value={authPhone}
                                  onChange={(e) => setAuthPhone(e.target.value)}
                                  className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 text-white" 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-mono uppercase text-zinc-500">Shipping/Delivery Destination</label>
                                <input 
                                  type="text" 
                                  placeholder="450 Golden Gate Avenue, San Francisco" 
                                  value={authAddress}
                                  onChange={(e) => setAuthAddress(e.target.value)}
                                  className="w-full p-2 rounded bg-[#090C15] border border-zinc-800 text-white" 
                                />
                              </div>
                              <button 
                                type="submit" 
                                disabled={isAuthLoading}
                                className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-neutral-900 font-bold uppercase rounded cursor-pointer tracking-wider text-[10px] font-mono mt-2"
                              >
                                {isAuthLoading ? "Saving securely..." : "💾 Update Profile Details"}
                              </button>
                            </form>
                          )}
                        </div>
                      )}

                      {/* 4. ORDERS HISTORY SCREEN */}
                      {portalTab === 'orders' && (
                        <div className="space-y-4">
                          {!dbUser ? (
                            <div className="text-center py-10 space-y-4">
                              <Shield className="w-6 h-6 text-zinc-500 mx-auto" />
                              <h4 className="font-bold text-xs text-zinc-300">Authentication Required</h4>
                              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Order history is restricted to authenticated user accounts. Please register or sign in.</p>
                              <button 
                                type="button" 
                                onClick={() => setPortalTab('auth')}
                                className="px-3 py-1.5 bg-[#121929] hover:bg-zinc-800 text-white rounded text-[10px] font-mono uppercase cursor-pointer"
                              >Sign In Now</button>
                            </div>
                          ) : userOrders.length === 0 ? (
                            <div className="text-center py-12 space-y-2 my-auto">
                              <History className="w-8 h-8 text-zinc-600 mx-auto opacity-70" />
                              <h4 className="font-bold text-xs text-zinc-300">No Orders Logged Yet</h4>
                              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                                You haven't placed any orders with this account yet. Add items to your Cart and check out!
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Purchase History Logs</label>
                              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                                {userOrders.map((ord) => (
                                  <div key={ord.id} className="p-3 bg-[#111622] rounded-lg border border-zinc-800 space-y-2 text-[11px] text-left">
                                    <div className="flex justify-between items-center text-[10px] font-mono">
                                      <span className="text-[#00FF41] font-bold">ORD_{ord.id.substring(0,6).toUpperCase()}</span>
                                      <span className="text-zinc-500">{new Date(ord.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="space-y-1">
                                      {ord.items?.map((p: any, pIdx: number) => (
                                        <div key={pIdx} className="flex justify-between text-zinc-300 text-[10.5px]">
                                          <span className="truncate max-w-[150px]">{p.title} <span className="text-zinc-500 font-mono text-[10px]">x{p.quantity}</span></span>
                                          <span className="font-semibold text-zinc-400">{p.price}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="h-px bg-zinc-800"></div>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Status: <span className="text-amber-500 font-mono">{ord.status}</span></span>
                                      <span className="font-bold text-white">${ord.total_price ? parseFloat(ord.total_price).toFixed(2) : '39.00'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
