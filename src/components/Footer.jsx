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
    <footer className="relative bg-gradient-to-br from-light-blue/30 via-white to-sky-blue/20 border-t border-primary-blue/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-primary-blue font-stencil text-xl md:text-2xl mb-3 tracking-wide">
              {artistInfo.name}
            </h3>
            <p className="text-slate-light text-sm mb-4">
              Art without Boundaries.
            </p>
            <p className="text-slate-text/70 text-sm">
              Visual artist specializing in murals, branding, and digital art.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-slate-text text-sm font-medium uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('work')}
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('behind-the-art')}
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  Films
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-slate-text text-sm font-medium uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href={artistInfo.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={artistInfo.contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={artistInfo.contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={artistInfo.contact.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-text/70 hover:text-primary-blue transition-colors text-sm"
                >
                  YouTube
                </a>
              </li>
            </ul>
            <div className="text-slate-text/70 text-sm">
              <p className="mb-1">{artistInfo.contact.phone}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-blue/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-text/60 text-sm">
              © {currentYear} {artistInfo.name}. All rights reserved.
            </p>
            <p className="text-slate-text/60 text-sm">
              Developed by <a href="https://github.com/ruth2105" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:text-dark-blue transition-colors">Ruth Mesfin</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
