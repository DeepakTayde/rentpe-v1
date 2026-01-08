import { Link } from "react-router-dom";
import { Home, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Find a Home", href: "/search" },
    { name: "List Property", href: "/list-property" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Community", href: "/community" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Vendor Policy", href: "/vendor-policy" },
  ],
};

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-navy text-navy-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Home className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-navy-foreground">
                Rent<span className="text-accent">Pe</span>
              </span>
            </Link>
            <p className="text-navy-foreground/70 text-sm leading-relaxed mb-6">
              India's Smart Living Operating System. Digitizing renting, payments, maintenance, and daily services into one unified platform.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-navy-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-navy-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-navy-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-navy-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-navy-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cities Section */}
        <div className="mt-12 pt-8 border-t border-navy-foreground/10">
          <h4 className="font-display font-semibold mb-4">Available Cities</h4>
          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/city/${city.toLowerCase()}`}
                className="px-4 py-2 rounded-lg bg-navy-foreground/10 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-navy-foreground/70">
          <a href="mailto:support@rentpe.in" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Mail className="w-4 h-4" />
            support@rentpe.in
          </a>
          <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Phone className="w-4 h-4" />
            +91 98765 43210
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Mumbai, India
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-foreground/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-navy-foreground/60">
            © {new Date().getFullYear()} RentPe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-navy-foreground/60">
            <Link to="/terms" className="hover:text-accent transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
