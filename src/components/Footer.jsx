import { artistInfo } from '../data/artist';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-charcoal border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-warm-white font-display text-2xl font-bold mb-3">
              MR. JON
            </h3>
            <p className="text-muted-gray text-sm mb-4">
              Art without Boundaries.
            </p>
            <p className="text-warm-white/60 text-sm">
              Visual artist specializing in murals, branding, and digital art.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-warm-white text-sm font-medium uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('work')}
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-warm-white text-sm font-medium uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href={artistInfo.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={artistInfo.contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={artistInfo.contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-white/70 hover:text-warm-white transition-colors text-sm"
                >
                  Telegram
                </a>
              </li>
            </ul>
            <div className="text-warm-white/70 text-sm">
              <p className="mb-1">{artistInfo.contact.phone}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-warm-white/50 text-sm">
              © {currentYear} Mr. Jon. All rights reserved.
            </p>
            <p className="text-warm-white/50 text-sm">
              Ethiopian Visual Artist
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
