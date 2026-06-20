import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/web-logo.png"
                alt="K&N"
                className="h-12 w-12 object-cover scale-[0.82] [clip-path:circle(50%)]"
              />
              <div>
                <div className="font-bold text-lg text-primary">K&N Enterprises</div>
                <div className="text-xs text-muted-foreground tracking-wider">RESEARCH · INNOVATION · TECHNOLOGY</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Building Digital Solutions for the Future. A Government of India Registered Startup.
            </p>
          </div>

          {/* Credentials */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Credentials</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Government of India Registered Startup</li>
              <li>Recognized under Startup India</li>
              <li>Registered under MSME (Ministry of MSME, GoI)</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Barasat, West Bengal, 700125
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                6909993204 &amp; 8906554583
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                knenterprise.official@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          &copy; {year} K&N Enterprises. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
