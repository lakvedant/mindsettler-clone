import { useEffect } from "react";

/**
 * SEO Component for dynamic page-level meta tags
 * Uses native DOM manipulation instead of react-helmet-async
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Additional keywords (comma-separated)
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.image - OG image URL
 * @param {string} props.type - OG type (website, article, etc.)
 * @param {Object} props.schema - Additional schema.org JSON-LD
 */
const SEO = ({
  title = "Mindsettler",
  description = "Professional online therapy and mental health counseling services. Book sessions with licensed therapists for anxiety, depression, stress management, and emotional wellness.",
  keywords = "",
  canonical = "",
  image = "https://mindsettler.com/og-image.png",
  type = "website",
  schema = null,
  noindex = false,
}) => {
  const siteName = "Mindsettler";
  const baseUrl = "https://mindsettler.com";
  
  // Base keywords that apply to all pages
  const baseKeywords = "online therapy, mental health, counseling, psychologist, therapist, anxiety treatment, depression help, stress management, CBT, cognitive behavioral therapy, emotional wellness, mental wellness, therapy booking, online counseling, mental health support, mindfulness, self-care";
  
  // Combine base keywords with page-specific keywords
  const allKeywords = keywords ? `${keywords}, ${baseKeywords}` : baseKeywords;
  
  // Format title
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  
  // Canonical URL
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Helper function to set or create meta tag
    const setMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary Meta Tags
    setMeta('title', fullTitle);
    setMeta('description', description);
    setMeta('keywords', allKeywords);
    
    // Robots
    const robotsContent = noindex 
      ? "noindex, nofollow" 
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    setMeta('robots', robotsContent);

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Open Graph / Facebook
    setMeta('og:type', type, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:site_name', siteName, true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:url', canonicalUrl);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // Schema.org JSON-LD
    let schemaScript = document.querySelector('script[data-seo-schema]');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('data-seo-schema', 'true');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Cleanup function
    return () => {
      // Reset to default title on unmount if needed
    };
  }, [fullTitle, description, allKeywords, canonicalUrl, image, type, schema, noindex, siteName]);

  return null;
};

// Pre-configured SEO for common pages
export const HomeSEO = () => (
  <SEO
    title="Online Therapy & Mental Health Counseling | Book a Session"
    description="Start your mental wellness journey with Mindsettler. Book online therapy sessions with licensed therapists for CBT, DBT, anxiety, depression, and stress management. Professional mental health support from the comfort of your home."
    keywords="mental wellness journey, book therapy session, online mental health, virtual therapy, teletherapy, therapy from home, mental health platform, wellness app, therapy app"
    canonical="/"
  />
);

export const AboutSEO = () => (
  <SEO
    title="About Us - Our Mission for Mental Wellness"
    description="Learn about Mindsettler's mission to make mental health support accessible to everyone. Meet our team of licensed therapists and discover our evidence-based approach to emotional wellness."
    keywords="about mindsettler, mental health mission, therapy team, licensed therapists, mental health professionals, our story, mental wellness company"
    canonical="/about"
  />
);

export const BookingSEO = () => (
  <SEO
    title="Book a Therapy Session - Schedule Your Appointment"
    description="Book your therapy session with Mindsettler. Choose from various evidence-based therapies including CBT, DBT, ACT, and more. Online and in-person sessions available. Flexible scheduling with licensed therapists."
    keywords="book therapy, schedule appointment, therapy booking, online session, in-person therapy, therapy appointment, schedule counseling, book psychologist, book counselor"
    canonical="/booking"
    schema={{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Therapy Session Booking",
      "provider": {
        "@type": "MedicalBusiness",
        "name": "Mindsettler"
      },
      "serviceType": "Mental Health Counseling",
      "areaServed": "Worldwide",
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceType": "Online Booking"
      }
    }}
  />
);

export const ResourcesSEO = () => (
  <SEO
    title="Mental Health Resources - Articles, Guides & Tips"
    description="Explore Mindsettler's mental health resources. Read articles on anxiety, depression, stress management, mindfulness, self-care, and emotional wellness. Free guides and tips for your mental health journey."
    keywords="mental health articles, therapy resources, anxiety guides, depression articles, stress tips, mindfulness guides, self-care tips, mental health blog, wellness articles, psychology articles, mental health education"
    canonical="/resources"
    type="article"
  />
);

export const ContactSEO = () => (
  <SEO
    title="Contact Us - Get in Touch"
    description="Contact Mindsettler for any questions about our therapy services. We're here to help you start your mental wellness journey. Reach out to our support team today."
    keywords="contact mindsettler, therapy support, mental health help, get in touch, customer support, therapy questions, counseling inquiry"
    canonical="/contact"
  />
);

export const CorporateSEO = () => (
  <SEO
    title="Corporate Mental Health Services - Employee Wellness Programs"
    description="Mindsettler's corporate mental health services. Boost employee wellbeing with our workplace wellness programs, stress management workshops, and corporate counseling solutions."
    keywords="corporate wellness, employee mental health, workplace wellness, corporate counseling, employee assistance, workplace stress, corporate therapy, business wellness, team mental health, HR wellness program"
    canonical="/corporate-services"
  />
);

export const AuthenticationSEO = () => (
  <SEO
    title="Login / Sign Up - Access Your Account"
    description="Sign in or create your Mindsettler account to book therapy sessions, track your progress, and access personalized mental health resources."
    keywords="login, sign up, create account, therapy account, mental health login"
    canonical="/authentication"
    noindex={true}
  />
);

export const ProfileSEO = () => (
  <SEO
    title="My Profile - Manage Your Account"
    description="Manage your Mindsettler profile, view upcoming sessions, and track your mental wellness journey."
    canonical="/profile"
    noindex={true}
  />
);

export const NotFoundSEO = () => (
  <SEO
    title="Page Not Found - 404"
    description="The page you're looking for doesn't exist. Return to Mindsettler's homepage to continue your mental wellness journey."
    noindex={true}
  />
);

export default SEO;
