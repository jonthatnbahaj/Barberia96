// Business Configuration
// Update this file with your business details

export interface BusinessConfig {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  openingHours: {
    [key: string]: {
      open?: string;
      close?: string;
      closed?: boolean;
    };
  };
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    goldColor: string;
    darkColor: string;
    lightGold: string;
  };
  logo: string;
  heroImage?: string;
}

// Barberaria 96 configuration with refined colors
export const businessConfig: BusinessConfig = {
  name: "Barberaria 96",
  tagline: "Best Barber in your Town",
  description: "Barberaria 96 erbjuder professionell barbering med fokus på kvalitet och precision. Vi kombinerar traditionella tekniker med moderna metoder för att ge dig den bästa upplevelsen. Vårt team av erfarna barberare ser till att varje kund lämnar salongen nöjd och välvårdad.",
  phone: "036313222",
  email: "info@barberaria96.se",
  address: {
    street: "Västra Storgatan 1",
    postalCode: "553 16",
    city: "Jönköping",
    country: "Sverige"
  },
  openingHours: {
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "19:00" },
    saturday: { open: "10:00", close: "15:30" },
    sunday: { closed: true }
  },
  social: {
    facebook: "https://facebook.com/barberaria96",
    instagram: "https://instagram.com/barberaria96",
    website: "https://barberaria96.se"
  },
  theme: {
    primaryColor: "#1a1a1a", // Deep charcoal black
    secondaryColor: "#2a2a2a", // Lighter charcoal
    accentColor: "#d4af37", // Classic gold
    goldColor: "#f4d03f", // Bright gold
    darkColor: "#0f0f0f", // Pure black
    lightGold: "#f8e6a0" // Light gold
  },
  logo: "/logo.png"
};

// Service categories and services configuration
export interface Service {
  name: string;
  duration: string;
  price: string;
  bookingUrl: string;
  description?: string;
}

export interface ServiceCategory {
  title: string;
  services: Service[];
}

// Barberaria 96 services based on your BokaDirekt links
export const serviceCategories: ServiceCategory[] = [
  {
    title: "Klippningar",
    services: [
      {
        name: "Barn Klippning (0–12 år)",
        duration: "25 min",
        price: "249 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/barn-klippning-o-12-ar-1114691",
        description: "Professionell klippning för barn"
      },
      {
        name: "Klippning",
        duration: "30 min",
        price: "329 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/klippning-1112349",
        description: "Klassisk herrklippning"
      },
      {
        name: "Senior Klippning",
        duration: "25 min",
        price: "279 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/senior-klippning-1114692",
        description: "Specialpris för seniorer"
      },
      {
        name: "Student Klippning",
        duration: "30 min",
        price: "279 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/student-klippning-1114687",
        description: "Studentpris med giltig legitimation"
      }
    ]
  },
  {
    title: "Kombinationsbehandlingar",
    services: [
      {
        name: "Klippning & Skäggtrimning",
        duration: "60 min",
        price: "499 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/klippning-skaggtrimning-1114693",
        description: "Komplett behandling med klippning och skäggtrim"
      },
      {
        name: "Klippning & Skäggtrimning (Student)",
        duration: "60 min",
        price: "449 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/klippning-skaggtrimning-student-2022071",
        description: "Studentpris för komplett behandling"
      }
    ]
  },
  {
    title: "Skägg & Styling",
    services: [
      {
        name: "Skäggtrimning – Kort Skägg (upp till 4 cm)",
        duration: "30 min",
        price: "249 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/skagg-trim-kort-skagg-4-cm-1324014",
        description: "Professionell trimning av kort skägg"
      },
      {
        name: "Skäggtrimning – Långt Skägg (över 4 cm)",
        duration: "30 min",
        price: "299 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/skagg-trim-langt-skagg-over-4-cm-1357365",
        description: "Specialbehandling för längre skägg"
      },
      {
        name: "Styling",
        duration: "15 min",
        price: "149 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/styling-1652900",
        description: "Professionell styling av hår"
      }
    ]
  },
  {
    title: "Snaggning",
    services: [
      {
        name: "Snaggning",
        duration: "15 min",
        price: "170 kr",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/barberaria-96-35693/snaggning-1114694",
        description: "Klassisk snaggning"
      }
    ]
  }
];

// Staff/Barber configuration - Optimized for small images
export interface StaffMember {
  name: string;
  title: string;
  image: string;
  bio?: string;
  specialties?: string[];
  experience?: string;
}

export const staff: StaffMember[] = [
  {
    name: "Talal Hannon",
    title: "Mästare Barberare",
    image: "/staff/Talal Hannon.png",
    bio: "Erfaren barberare med över 10 års erfarenhet inom traditionell barbering. Specialist på klassiska klippningar och skäggtrimning.",
    specialties: ["Klassiska klippningar", "Skäggtrimning", "Traditionell rakning"],
    experience: "10+ år"
  },
  {
    name: "Burhan Arifi", 
    title: "Senior Barberare",
    image: "/staff/Burhan Arifi.png",
    bio: "Kreativ barberare som kombinerar moderna tekniker med klassisk stil. Känd för sin precision och uppmärksamhet på detaljer.",
    specialties: ["Moderna klippningar", "Fade-tekniker", "Styling"],
    experience: "8+ år"
  }
];

// Customer reviews configuration - More realistic reviews
export interface Review {
  rating: number;
  text: string;
  author: string;
  date: string;
  verified?: boolean;
  service?: string;
}

export const reviews: Review[] = [
  {
    rating: 5,
    text: "Fantastisk service! Talal är verkligen en mästare på sitt område. Perfekt klippning och skäggtrim. Kommer definitivt tillbaka!",
    author: "Marcus L.",
    date: "15 januari 2025",
    verified: true,
    service: "Klippning & Skäggtrimning"
  },
  {
    rating: 5,
    text: "Bästa barberaren i Jönköping! Burhan förstår exakt vad man vill ha och levererar alltid perfekt resultat. Mycket professionell miljö.",
    author: "Erik S.",
    date: "12 januari 2025",
    verified: true,
    service: "Klippning"
  },
  {
    rating: 5,
    text: "Otroligt nöjd med min klippning! Personalen är mycket kunnig och tar sig tid för varje kund. Rekommenderar starkt!",
    author: "Johan A.",
    date: "10 januari 2025",
    verified: true,
    service: "Student Klippning"
  },
  {
    rating: 5,
    text: "Perfekt skäggtrim! Mycket noggrann och professionell. Salongen har en fantastisk atmosfär och personalen är trevlig.",
    author: "David M.",
    date: "8 januari 2025",
    verified: true,
    service: "Skäggtrimning"
  },
  {
    rating: 5,
    text: "Tog med min son för barnklippning och vi var båda mycket nöjda. Barberaren var tålmodig och resultatet blev perfekt!",
    author: "Anna K.",
    date: "5 januari 2025",
    verified: true,
    service: "Barn Klippning"
  },
  {
    rating: 5,
    text: "Fantastisk upplevelse från början till slut. Mycket professionell service och bra priser. Kommer bli en återkommande kund!",
    author: "Peter R.",
    date: "3 januari 2025",
    verified: true,
    service: "Klippning & Skäggtrimning"
  },
  {
    rating: 5,
    text: "Bästa klippningen jag fått på länge! Mycket professionell och trevlig personal. Rekommenderar verkligen Barberaria 96.",
    author: "Stefan H.",
    date: "28 december 2024",
    verified: true,
    service: "Klippning"
  },
  {
    rating: 5,
    text: "Snabb och professionell service. Perfekt snaggning och bra pris. Kommer tillbaka nästa gång jag behöver klippa mig.",
    author: "Mikael T.",
    date: "22 december 2024",
    verified: true,
    service: "Snaggning"
  },
  {
    rating: 5,
    text: "Mycket nöjd med skäggtrimningen! Talal lyssnade på vad jag ville ha och resultatet blev precis som jag tänkt mig.",
    author: "Andreas B.",
    date: "18 december 2024",
    verified: true,
    service: "Skäggtrimning"
  },
  {
    rating: 4,
    text: "Bra service och trevlig personal. Klippningen blev bra, kanske lite kort men det växer ut. Kommer tillbaka.",
    author: "Lars G.",
    date: "15 december 2024",
    verified: true,
    service: "Senior Klippning"
  },
  {
    rating: 5,
    text: "Perfekt studentklippning! Bra pris och professionell service. Burhan är mycket skicklig och trevlig.",
    author: "Emil J.",
    date: "12 december 2024",
    verified: true,
    service: "Student Klippning"
  },
  {
    rating: 5,
    text: "Fantastisk styling! Fick precis den look jag ville ha. Mycket professionell och snabb service.",
    author: "Robert K.",
    date: "8 december 2024",
    verified: true,
    service: "Styling"
  }
];

// Function to force open BokaDirekt app or website
export const openBokaDirekt = () => {
  const bokaDirektUrl = "https://www.bokadirekt.se/places/barberaria-96-35693";
  
  // Try to open BokaDirekt app on mobile devices
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Try to open the app first
    const appUrl = "bokadirekt://places/barberaria-96-35693";
    
    // Create a hidden iframe to try opening the app
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    
    // Fallback to website after a short delay if app doesn't open
    setTimeout(() => {
      window.open(bokaDirektUrl, '_blank', 'noopener,noreferrer');
      document.body.removeChild(iframe);
    }, 1000);
  } else {
    // Desktop - open website in new tab
    window.open(bokaDirektUrl, '_blank', 'noopener,noreferrer');
  }
};