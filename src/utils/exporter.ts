import { GeneratedWebsite } from "../types";

export function getFontFamilyStylesheet(fontName: string): string {
  const fontSlug = fontName.replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@300;400;500;600;700;800&display=swap`;
}

export function generateFullHTML(website: GeneratedWebsite): string {
  const { name, tagline, description, theme, sections, buttonText } = website;
  
  // Normalize font names for styling rules
  const bodyFontFamily = theme.fontSans;
  
  // Generate section markups dynamically
  const sectionsHTML = sections.map((sec) => {
    const bgStyle = sec.type === 'hero' ? '' : `background-color: ${theme.backgroundColor}; color: ${theme.textColor};`;
    
    // Check if section type has list items
    let listContentHTML = '';
    if (sec.items && sec.items.length > 0) {
      if (sec.type === 'services' || sec.type === 'features') {
        listContentHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            ${sec.items.map(item => `
              <div class="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg" style="border-color: ${theme.primaryColor}1a; background-color: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141b2e'}" id="item-${item.id}">
                ${item.icon ? `
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style="background-color: ${theme.primaryColor}1a; color: ${theme.accentColor}">
                    <i data-lucide="${item.icon}" class="w-6 h-6"></i>
                  </div>
                ` : ''}
                <h3 class="text-xl font-semibold mb-2" style="color: ${theme.textColor}">${item.title}</h3>
                <p class="text-sm opacity-80 leading-relaxed">${item.description}</p>
              </div>
            `).join('')}
          </div>
        `;
      } else if (sec.type === 'testimonials') {
        listContentHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            ${sec.items.map(item => `
              <div class="p-8 rounded-2xl border relative flex flex-col justify-between" style="border-color: ${theme.primaryColor}1a; background-color: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141b2e'}" id="item-${item.id}">
                <div>
                  <div class="text-3xl font-serif mb-4" style="color: ${theme.accentColor}">“</div>
                  <p class="italic text-base opacity-90 leading-relaxed mb-6">${item.description}</p>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style="background-color: ${theme.primaryColor}; color: white">
                    ${item.title.charAt(0)}
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm" style="color: ${theme.textColor}">${item.title}</h4>
                    ${item.role ? `<span class="text-xs opacity-60">${item.role}</span>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (sec.type === 'pricing') {
        listContentHTML = `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            ${sec.items.map((item, idx) => {
              const isPopular = idx === 1; // Middle tier popular
              return `
                <div class="p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${isPopular ? 'scale-105 shadow-xl' : ''}" 
                     style="border-color: ${isPopular ? theme.accentColor : theme.primaryColor + '15'}; 
                            background-color: ${isPopular ? (theme.backgroundColor === '#ffffff' ? '#ffffff' : '#17223b') : (theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141b2e')}" id="item-${item.id}">
                  ${isPopular ? `
                    <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style="background-color: ${theme.accentColor}">
                      Most Popular
                    </span>
                  ` : ''}
                  <div>
                    <h3 class="text-lg font-bold uppercase tracking-wider opacity-70 mb-2">${item.title}</h3>
                    <div class="my-4">
                      <span class="text-4xl font-extrabold" style="color: ${theme.textColor}">${item.price || '$29'}</span>
                    </div>
                    <p class="text-sm opacity-80 mb-6">${item.description}</p>
                  </div>
                  <button class="w-full py-3 rounded-xl font-semibold transition-all" 
                          style="background-color: ${isPopular ? theme.accentColor : theme.primaryColor + '1a'}; 
                                 color: ${isPopular ? '#ffffff' : theme.textColor}">
                    Get Started
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else if (sec.type === 'faqs') {
        listContentHTML = `
          <div class="max-w-3xl mx-auto space-y-4 mt-8">
            ${sec.items.map(item => `
              <div class="p-6 rounded-xl border" style="border-color: ${theme.primaryColor}1a; background-color: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#141b2e'}" id="item-${item.id}">
                <h3 class="text-base font-semibold mb-2 flex items-center gap-3" style="color: ${theme.textColor}">
                  <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${theme.accentColor}"></span>
                  ${item.title}
                </h3>
                <p class="text-sm opacity-80 leading-relaxed pl-4">${item.description}</p>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    // Default Section layout templates
    if (sec.type === 'hero') {
      return `
        <!-- Hero Section -->
        <section class="relative min-h-[85vh] flex items-center justify-center py-20 px-4 md:px-10 overflow-hidden" style="background-color: ${theme.primaryColor}; color: #ffffff;">
          <!-- Ambient circles -->
          <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 filter blur-3xl" style="background-color: ${theme.accentColor}"></div>
          <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-25 filter blur-3xl" style="background-color: ${theme.secondaryColor}"></div>
          
          <div class="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div class="lg:col-span-7 flex flex-col justify-center text-left">
              ${sec.subtitle ? `
                <span class="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border w-fit" 
                      style="border-color: rgba(255,255,255,0.2); background-color: rgba(255,255,255,0.05);">
                  ${sec.subtitle}
                </span>
              ` : ''}
              <h1 class="${
                (theme.fontSans === 'Syne' || theme.fontSans === 'Outfit')
                  ? 'text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase'
                  : 'text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight'
              } mb-6 leading-tight">
                ${sec.title}
              </h1>
              <p class="text-lg md:text-xl opacity-90 font-light mb-8 max-w-xl leading-relaxed">
                ${sec.description || description}
              </p>
              <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <a href="#contact" class="px-8 py-4 rounded-xl font-semibold shadow-lg text-center transition-all hover:scale-[1.02]" 
                   style="background-color: ${theme.accentColor}; color: #ffffff;">
                  ${buttonText}
                </a>
                <a href="#services" class="px-8 py-4 rounded-xl font-semibold border text-center transition-all hover:bg-white/10" 
                   style="border-color: rgba(255,255,255,0.3); color: #ffffff;">
                  Learn More
                </a>
              </div>
            </div>
            <div class="lg:col-span-5 relative">
              ${sec.imageUrl ? `
                <div class="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500">
                  <img src="${sec.imageUrl}" alt="${name}" class="w-full h-full object-cover" />
                </div>
              ` : `
                <div class="aspect-[4/3] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center border shadow-2xl relative" 
                     style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1)">
                  <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: ${theme.accentColor}2a">
                    <i data-lucide="Sparkles" class="w-8 h-8" style="color: ${theme.accentColor}"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-2">${name}</h3>
                  <p class="text-sm opacity-70">${tagline}</p>
                </div>
              `}
            </div>
          </div>
        </section>
      `;
    }

    if (sec.type === 'about') {
      return `
        <!-- About Section -->
        <section id="about" class="py-20 px-4 md:px-10 border-b" style="${bgStyle} border-borderColor: ${theme.primaryColor}10;">
          <div class="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-5">
              ${sec.imageUrl ? `
                <div class="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                  <img src="${sec.imageUrl}" alt="About" class="w-full h-full object-cover" />
                </div>
              ` : `
                <div class="aspect-[4/3] rounded-2xl flex flex-col items-center justify-center p-8 text-center border" 
                     style="background-color: ${theme.primaryColor}05; border-color: ${theme.primaryColor}1a">
                  <i data-lucide="Briefcase" class="w-12 h-12 mb-4" style="color: ${theme.accentColor}"></i>
                  <h3 class="text-lg font-bold">${name}</h3>
                  <p class="text-xs opacity-60">Established 2026</p>
                </div>
              `}
            </div>
            <div class="lg:col-span-7">
              ${sec.subtitle ? `<span class="text-xs font-semibold uppercase tracking-wider" style="color: ${theme.accentColor}">${sec.subtitle}</span>` : ''}
              <h2 class="text-3xl md:text-4xl font-extrabold mt-2 mb-6" style="color: ${theme.textColor}">${sec.title}</h2>
              <div class="prose max-w-none text-base opacity-80 leading-relaxed space-y-4">
                <p>${sec.description || description}</p>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    if (sec.type === 'contact') {
      return `
        <!-- Contact Section -->
        <section id="contact" class="py-20 px-4 md:px-10" style="background-color: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : '#0c0f16'}; color: ${theme.textColor};">
          <div class="container max-w-4xl mx-auto text-center mb-12">
            ${sec.subtitle ? `<span class="text-xs font-bold uppercase tracking-widest" style="color: ${theme.accentColor}">${sec.subtitle}</span>` : ''}
            <h2 class="text-3xl md:text-4xl font-extrabold mt-2" style="color: ${theme.textColor}">${sec.title}</h2>
            <p class="text-base opacity-75 mt-3 max-w-lg mx-auto">${sec.description || 'Have questions or ready to partner? Message us and we’ll get back to you immediately.'}</p>
          </div>
          
          <div class="container max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div class="md:col-span-5 space-y-6">
              <div class="p-6 rounded-2xl border" style="border-color: ${theme.primaryColor}1a; background-color: ${theme.backgroundColor}">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: ${theme.primaryColor}1a; color: ${theme.accentColor}">
                    <i data-lucide="MessageSquare" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h4 class="font-bold">Contact Email</h4>
                    <p class="text-sm opacity-70 mt-1">hello@${name.toLowerCase().replace(/\s+/g, '')}.com</p>
                  </div>
                </div>
              </div>
              <div class="p-6 rounded-2xl border" style="border-color: ${theme.primaryColor}1a; background-color: ${theme.backgroundColor}">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: ${theme.primaryColor}1a; color: ${theme.accentColor}">
                    <i data-lucide="Phone" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h4 class="font-bold">Phone Support</h4>
                    <p class="text-sm opacity-70 mt-1">+1 (800) ${name.length * 3 + 124}-${name.length * 11 + 452}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form class="md:col-span-7 p-8 rounded-2xl border space-y-4" style="border-color: ${theme.primaryColor}1a; background-color: ${theme.backgroundColor}" onsubmit="event.preventDefault(); alert('Sign up complete! (In a real application this would submit content)');">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Full Name</label>
                  <input type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2" style="background-color: ${theme.backgroundColor === '#ffffff' ? '#ffffff' : '#141b2e'}; border-color: ${theme.primaryColor}2a; outline: none;" required />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Email Address</label>
                  <input type="email" placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2" style="background-color: ${theme.backgroundColor === '#ffffff' ? '#ffffff' : '#141b2e'}; border-color: ${theme.primaryColor}2a; outline: none;" required />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Your message</label>
                <textarea rows="4" placeholder="How can we help you?" class="w-full px-4 py-3 rounded-xl border text-sm" style="background-color: ${theme.backgroundColor === '#ffffff' ? '#ffffff' : '#141b2e'}; border-color: ${theme.primaryColor}2a; outline: none;" required></textarea>
              </div>
              <button type="submit" class="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90" style="background-color: ${theme.primaryColor}">
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>
      `;
    }

    // Default Fallback Section (Services, Features, Testimonials listings, dynamic cards etc.)
    return `
      <!-- Section: ${sec.title} -->
      <section id="${sec.type}" class="py-20 px-4 md:px-10 border-b" style="${bgStyle} border-color: ${theme.primaryColor}10;">
        <div class="container max-w-6xl mx-auto">
          <div class="text-center max-w-2xl mx-auto mb-12">
            ${sec.subtitle ? `<span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2" style="background-color: ${theme.primaryColor}1a; color: ${theme.accentColor}">${sec.subtitle}</span>` : ''}
            <h2 class="text-3xl md:text-4xl font-extrabold" style="color: ${theme.textColor}">${sec.title}</h2>
            ${sec.description ? `<p class="mt-4 text-base opacity-85 leading-relaxed">${sec.description}</p>` : ''}
          </div>
          
          ${listContentHTML}
        </div>
      </section>
    `;
  }).join('\n');

  // Full self-contained Page Markup
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${tagline}</title>
  
  <!-- Tailwind CSS Integration -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Preconnected Google Web Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${getFontFamilyStylesheet(bodyFontFamily)}" rel="stylesheet">
  
  <!-- Tailwind Design Tokens -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            custom: ["${bodyFontFamily}", "sans-serif"],
          },
          colors: {
            brandPrimary: "${theme.primaryColor}",
            brandSecondary: "${theme.secondaryColor}",
            brandAccent: "${theme.accentColor}",
          }
        }
      }
    }
  </script>
  
  <style>
    body {
      font-family: "${bodyFontFamily}", sans-serif;
    }
  </style>
</head>
<body style="background-color: ${theme.backgroundColor}; color: ${theme.textColor};">

  <!-- Main Navigation Bar -->
  <nav class="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300" style="background-color: ${theme.backgroundColor}cc; border-color: ${theme.primaryColor}15;">
    <div class="max-w-6xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
      <a href="#" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md" style="background-color: ${theme.primaryColor}">
          ${name.charAt(0)}
        </div>
        <span class="font-extrabold text-lg tracking-tight" style="color: ${theme.textColor}">${name}</span>
      </a>
      
      <!-- Nav items -->
      <div class="hidden md:flex items-center gap-6 text-sm font-medium">
        ${sections.filter(s => s.type !== 'hero').map(s => `
          <a href="#${s.type}" class="hover:opacity-80 transition-all opacity-70" style="color: ${theme.textColor}">${s.title}</a>
        `).join('')}
      </div>

      <div>
        <a href="#contact" class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]" style="background-color: ${theme.primaryColor}; color: #ffffff;">
          ${buttonText}
        </a>
      </div>
    </div>
  </nav>

  <main>
    ${sectionsHTML}
  </main>

  <!-- Premium Footer -->
  <footer class="py-12 px-4 border-t" style="border-color: ${theme.primaryColor}15; background-color: ${theme.backgroundColor}; color: ${theme.textColor};">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg" style="background-color: ${theme.primaryColor}">
          ${name.charAt(0)}
        </div>
        <div>
          <h4 class="font-bold text-sm text-left">${name}</h4>
          <p class="text-xs opacity-60 mt-0.5">${tagline}</p>
        </div>
      </div>
      
      <p class="text-xs opacity-50">&copy; 2026 ${name}. Developed & Powered by <strong style="color: ${theme.accentColor || '#00FF41'}">AleeXstudio Developers</strong>. All rights reserved.</p>
    </div>
  </footer>

  <!-- Lucide CDN to render crisp clean SVG icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    // Injects SVG shapes in place of elements with the 'data-lucide' attribute
    lucide.createIcons();
  </script>

</body>
</html>`;
}
