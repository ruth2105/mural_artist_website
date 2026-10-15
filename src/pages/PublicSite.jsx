import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import ArtworkGallery from '../components/ArtworkGallery';
import ProjectViewer from '../components/ProjectViewer';
import AboutSection from '../components/AboutSection';
import ProcessSection from '../components/ProcessSection';
import ServicesSection from '../components/ServicesSection';
import CommissionSection from '../components/CommissionSection';
import SocialSection from '../components/SocialSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function PublicSite() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseViewer = () => {
    setSelectedProject(null);
  };

  const handleNavigateProject = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-near-black text-warm-white">
      <Navbar />
      
      <main>
        <Hero />
        <Introduction />
        <ArtworkGallery onProjectClick={handleProjectClick} />
        <AboutSection />
        <ProcessSection />
        <ServicesSection />
        <CommissionSection />
        <SocialSection />
        <ContactSection />
      </main>

      <Footer />

      <ProjectViewer
        project={selectedProject}
        onClose={handleCloseViewer}
        onNavigate={handleNavigateProject}
      />
    </div>
  );
}
