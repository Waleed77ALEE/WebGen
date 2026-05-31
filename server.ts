import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize Gemini client lazily to avoid startup crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;AQ.Ab8RN6KDjAbX65dUf8DBg8Sm6rZOVJ3l-yoyAeTBeCIxb6GHkg
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it to your Secrets under Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,AQ.Ab8RN6KDjAbX65dUf8DBg8Sm6rZOVJ3l-yoyAeTBeCIxb6GHkg
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Accept larger payloads for custom content
  app.use(express.json({ limit: "15mb" }));

  // Helper schema for structured output from gemini-3.5-flash
  const websiteResponseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Highly customized or polished business name matching user preference" },
      category: { type: Type.STRING, description: "Category of the website" },
      tagline: { type: Type.STRING, description: "A punchy, elegant, and modern marketing tagline (4 to 8 words)" },
      description: { type: Type.STRING, description: "A persuasive, beautifully worded marketing introduction for the business (2 to 3 sentences)" },
      buttonText: { type: Type.STRING, description: "A clear call-to-action button label" },
      theme: {
        type: Type.OBJECT,
        properties: {
          primaryColor: { type: Type.STRING, description: "A hex and high contrast dominant color representing the tone/brand, e.g. #0f172a or #2563eb" },
          secondaryColor: { type: Type.STRING, description: "A coordinating dark secondary accent color in hex format" },
          backgroundColor: { type: Type.STRING, description: "Clean background color in hex: usually off-white (#fafafa, #f8fafc) or deep slate (#0b0f19) based on client request" },
          textColor: { type: Type.STRING, description: "Highly readable high-contrast pairing matching background. Dark gray #1e293b if light bg, soft slate #f1f5f9 if dark bg" },
          accentColor: { type: Type.STRING, description: "A vibrant accent color in hex, e.g., #f59e0b, #db2777, or #10b981" },
          fontSans: { type: Type.STRING, description: "Choose matching display font: 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'Outfit' | 'DM Sans' | 'Syne'" },
          fontMono: { type: Type.STRING, description: "Choose supporting technical or mono accent font: 'JetBrains Mono' | 'Fira Code' | 'Share Tech Mono'" },
        },
        required: ["primaryColor", "secondaryColor", "backgroundColor", "textColor", "accentColor", "fontSans", "fontMono"],
      },
      sections: {
        type: Type.ARRAY,
        description: "List of 4 to 6 content sections for the website landing page. Must include a 'hero', 'services' or 'features' section, either 'about' or 'testimonials', and a 'pricing' or 'faqs' or 'contact' section based on category.",
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Type of section: 'services' | 'about' | 'features' | 'testimonials' | 'pricing' | 'faqs' | 'contact'" },
            title: { type: Type.STRING, description: "Section title, e.g. 'Crafted Specialties' or 'What Our Clients Love'" },
            subtitle: { type: Type.STRING, description: "Optional short subtext or category banner, 2-4 words" },
            description: { type: Type.STRING, description: "A beautifully written narrative description or descriptive header" },
            layout: { type: Type.STRING, description: "Layout design constraint: 'grid' | 'split' | 'accordion' | 'list' | 'centered'" },
            imagePrompt: { type: Type.STRING, description: "Highly detailed illustration prompt (including style, atmosphere, color palette) suitable to generate a matching background or photo for this section via AI, e.g., 'A modern airy plant café filled with wooden tables and warm lighting'" },
            items: {
              type: Type.ARRAY,
              description: "Array of detailed items/cards inside this section (for services, testimonials, pricing, faqs)",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique short identifier (e.g. s1, s2, faq1)" },
                  title: { type: Type.STRING, description: "Title of the service, the name of the reviewer, the pricing tier name, or the FAQ question" },
                  description: { type: Type.STRING, description: "Detailed description, testimonial quote, pricing features, or the FAQ answer (20 to 55 words)" },
                  price: { type: Type.STRING, description: "Optional price (e.g., '$49/mo' or '$15') - required if section type is 'pricing'" },
                  role: { type: Type.STRING, description: "Optional customer role or location (e.g. 'CEO, TechCorp' or 'Austin, TX') - useful for testimonials" },
                  icon: { type: Type.STRING, description: "Name of a matching Lucide React icon (e.g. 'Coffee', 'Globe', 'Compass', 'Map', 'Heart', 'Shield', 'Sparkles', 'Layers', 'Code', 'TrendingUp', 'Smile', 'Dumbbell', 'Briefcase', 'GraduationCap', 'Star')" },
                },
                required: ["id", "title", "description"],
              },
            },
          },
          required: ["type", "title", "layout", "imagePrompt"],
        },
      },
    },
    required: ["name", "category", "tagline", "description", "buttonText", "theme", "sections"],
  };

  // Endpoint 1: Generate full website structured content
  app.post("/api/generate-website", async (req, res) => {
    try {
      const { category, name, description, buttonText, styleVibe, customInstructions } = req.body;
      const client = getGeminiClient();

      const userPrompt = `
      Create a high-fidelity, complete layout and content structure for a website.
      Business Name: ${name || "Untitled"}
      Category: ${category || "general"}
      Core Business Description: ${description || "A professional modern business."}
      Preferred Call-to-action Button: ${buttonText || "Get Started"}
      Styling/Vibe Preference: ${styleVibe || "Modern Minimalist"}
      Special Custom Instructions: ${customInstructions || "No special requests."}

      Deliver a thoroughly filled out, gorgeous website state with 4 to 6 sections. 
      Do NOT include generic mock placeholders like 'lorem ipsum'. Provide highly context-rich, engaging copywriting customized to this business.
      Assign appropriate Lucide icons for services/features, such as 'Coffee', 'Compass', 'Dumbbell', 'Star', 'Briefcase', etc.
      Also tailor the theme color hexes based on the user's Style Vibe.
      For example, 'Tech Futuristic' might use dark background #090d16 with neon highlights. 'High-End Luxury' might use sophisticated cream/warm gold/deep charcoal. 'Modern Minimalist' might use pristine slate/off-white #f8fafc and charcoal text. 'Bold Typography' uses a clean high-contrast background, an ultra-vibrant accent such as #FF0055, and the 'Syne' or 'Outfit' font-sans, combining heavy typographic weights.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "You are an elite web architect and UI/UX copywriter who creates stunning digital portfolios, SaaS startups, coffee shops, and local service sites. You only return valid JSON matching the requested schema. Provide inspiring, warm, and highly persuasive text.",
          responseMimeType: "application/json",
          responseSchema: websiteResponseSchema,
        },
      });

      if (!response.text) {
        throw new Error("No text output received from Gemini API.");
      }

      const generatedObj = JSON.parse(response.text.trim());
      // Give it an ID and timestamp
      generatedObj.id = `web-${Date.now()}`;
      generatedObj.createdAt = new Date().toISOString();

      res.json(generatedObj);
    } catch (error: any) {
      console.error("Failed to generate website:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred during website generation." });
    }
  });

  // Endpoint 2: Generate section refinement or addition (Gemini rewrite endpoint)
  app.post("/api/refine-section", async (req, res) => {
    try {
      const { section, instructions, businessContext } = req.body;
      const client = getGeminiClient();

      const prompt = `
      We have an existing website section for the business "${businessContext.name}" (${businessContext.category}).
      Section details:
      ${JSON.stringify(section, null, 2)}

      The user has requested the following refinement or update to this section:
      "${instructions}"

      Rewrite and return the redesigned section JSON object matching the original structure. Ensure the tone is perfect and fits the instructions.
      Make sure to change the titles, subtitles, descriptions, or list items as requested.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional copywriter. Rewrite or refine the section according to instructions, and return ONLY a valid JSON block mapping the same structure as the input section.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              description: { type: Type.STRING },
              layout: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    price: { type: Type.STRING },
                    role: { type: Type.STRING },
                    icon: { type: Type.STRING }
                  },
                  required: ["id", "title", "description"]
                }
              }
            },
            required: ["type", "title", "layout", "imagePrompt"]
          }
        }
      });

      if (!response.text) {
        throw new Error("Failed to refine section using Gemini.");
      }

      const refinedSection = JSON.parse(response.text.trim());
      res.json(refinedSection);
    } catch (error: any) {
      console.error("Failed to refine section:", error);
      res.status(500).json({ error: error.message || "Failed to edit section." });
    }
  });

  // Endpoint 3: ADD a brand new custom section using AI
  app.post("/api/add-section", async (req, res) => {
    try {
      const { prompt, businessContext } = req.body;
      const client = getGeminiClient();

      const userPrompt = `
      We are designing a website for "${businessContext.name}" in category "${businessContext.category}".
      Business tagline: "${businessContext.tagline}"

      Generate a brand new, highly engaging frontend section of type 'services' | 'about' | 'features' | 'testimonials' | 'pricing' | 'faqs' | 'contact' | 'custom' based on this prompt:
      "${prompt}"

      Return a JSON mapping the standard section schema. Make it rich, interesting, and direct. Change layout to represent either grid, split, accordion, list, or centered.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "Generate a single complete, beautiful website section. Return ONLY a valid JSON matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Section type: e.g. testimonials, pricing, services, about, custom" },
              title: { type: Type.STRING, description: "The title of the section" },
              subtitle: { type: Type.STRING, description: "Optional subheader" },
              description: { type: Type.STRING, description: "Main section paragraph text" },
              layout: { type: Type.STRING, description: "grid | split | accordion | list | centered" },
              imagePrompt: { type: Type.STRING, description: "An explicit visual prompt for creating an illustrative image for this topic" },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    price: { type: Type.STRING },
                    role: { type: Type.STRING },
                    icon: { type: Type.STRING }
                  },
                  required: ["id", "title", "description"]
                }
              }
            },
            required: ["type", "title", "layout", "imagePrompt"]
          }
        }
      });

      if (!response.text) {
        throw new Error("Failed to generate custom section.");
      }

      const generatedSection = JSON.parse(response.text.trim());
      generatedSection.id = `sec-${Date.now()}`;
      res.json(generatedSection);
    } catch (error: any) {
      console.error("Failed to add section:", error);
      res.status(500).json({ error: error.message || "Failed to build custom section." });
    }
  });

  // Helper to match input prompts with curated, high-resolution aesthetic Unsplash images when model rates/quotas are exceeded.
  function getFallbackImageUrl(prompt: string): string {
    const lowerPrompt = (prompt || "").toLowerCase();
    
    // High-performance developers/coding/cyber/tech matching
    if (
      lowerPrompt.includes("cyber") || 
      lowerPrompt.includes("code") || 
      lowerPrompt.includes("monitor") || 
      lowerPrompt.includes("developer") || 
      lowerPrompt.includes("tech") || 
      lowerPrompt.includes("software") || 
      lowerPrompt.includes("application") ||
      lowerPrompt.includes("workflow")
    ) {
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80";
    }
    
    // Analytics / business chart metrics matching
    if (
      lowerPrompt.includes("chart") || 
      lowerPrompt.includes("analytic") || 
      lowerPrompt.includes("market") || 
      lowerPrompt.includes("sales") || 
      lowerPrompt.includes("growth") ||
      lowerPrompt.includes("business") ||
      lowerPrompt.includes("statistic")
    ) {
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80";
    }

    // Design/aesthetic/creative agency/workshop/architecture matching
    if (
      lowerPrompt.includes("design") || 
      lowerPrompt.includes("creative") || 
      lowerPrompt.includes("art") || 
      lowerPrompt.includes("architect") || 
      lowerPrompt.includes("illustration") ||
      lowerPrompt.includes("geometric") || 
      lowerPrompt.includes("archway") || 
      lowerPrompt.includes("room")
    ) {
      return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80";
    }

    // Service/customer support/satisfaction matching
    if (
      lowerPrompt.includes("customer") || 
      lowerPrompt.includes("service") || 
      lowerPrompt.includes("contact") || 
      lowerPrompt.includes("support") || 
      lowerPrompt.includes("help") || 
      lowerPrompt.includes("consulting")
    ) {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80";
    }

    // About/Team/office/people collaboration matching
    if (
      lowerPrompt.includes("about") || 
      lowerPrompt.includes("team") || 
      lowerPrompt.includes("people") || 
      lowerPrompt.includes("co-pilot") || 
      lowerPrompt.includes("collaboration") ||
      lowerPrompt.includes("workspace") ||
      lowerPrompt.includes("office")
    ) {
      return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80";
    }

    // Default beautiful premium visual fallback
    return "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80";
  }

  // Endpoint 4: Get Gemini generated illustrative base64 image for sections! 
  app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;
    try {
      const client = getGeminiClient();
      console.log("Generating custom image via gemini-2.5-flash-image for prompt:", prompt);
      const cleanPrompt = `${prompt}. Minimal modern vector illustration, isolated background, elegant corporate clean tech aesthetic, high resolution.`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: cleanPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      let foundImageBase64 = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            foundImageBase64 = part.inlineData.data;
            break;
          }
        }
      }

      if (foundImageBase64) {
        res.json({ imageUrl: `data:image/png;base64,${foundImageBase64}` });
      } else {
        throw new Error("No image data returned from generator.");
      }
    } catch (error: any) {
      console.log("Serving rich placeholder image matching context themes, rate parameters bypassed successfully.");
      const fallbackUrl = getFallbackImageUrl(prompt);
      res.json({ imageUrl: fallbackUrl });
    }
  });

  // Vite Integration for Dev / Serving Built Files for Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA catch-all
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully on port ${PORT}`);
  });
}

startServer();
