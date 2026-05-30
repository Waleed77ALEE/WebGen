export type SectionType = 
  | 'hero' 
  | 'services' 
  | 'about' 
  | 'features' 
  | 'testimonials' 
  | 'pricing' 
  | 'faqs' 
  | 'contact' 
  | 'custom';

export interface SectionItem {
  id: string;
  title: string;
  description: string;
  price?: string; // For pricing
  role?: string; // For testimonials
  avatar?: string; // For testimonials (base64 or icon name)
  icon?: string; // Lucide icon name
}

export interface WebsiteSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  description?: string;
  items?: SectionItem[];
  imagePrompt?: string;
  imageUrl?: string; // Base64 or standard URL
  layout?: 'grid' | 'split' | 'accordion' | 'list' | 'centered';
}

export interface WebsiteTheme {
  primaryColor: string; // e.g. "#2563eb"
  secondaryColor: string; // e.g. "#1e40af"
  backgroundColor: string; // e.g. "#ffffff"
  textColor: string; // e.g. "#1f2937"
  accentColor: string; // e.g. "#f59e0b"
  fontSans: string; // Name of font, e.g. 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'Outfit'
  fontMono: string; // Name of font, e.g. 'JetBrains Mono' | 'Fira Code'
}

export interface GeneratedWebsite {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  buttonText: string;
  theme: WebsiteTheme;
  sections: WebsiteSection[];
  createdAt: string;
}

export interface GenerationHistoryItem {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  website: GeneratedWebsite;
}
