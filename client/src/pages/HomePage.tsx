import { AmbientCanvas } from '../components/ambient/AmbientCanvas'
import { NavBar } from '../components/nav/NavBar'
import { AboutSection } from '../components/sections/AboutSection'
import { ContactSection } from '../components/sections/ContactSection'
import { FooterSection } from '../components/sections/FooterSection'
import { HeroSection } from '../components/sections/HeroSection'
import { ProfileSection } from '../components/sections/ProfileSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { StatsSection } from '../components/sections/StatsSection'

export function HomePage() {
  return (
    <div className="relative min-h-screen">
      <AmbientCanvas />
      <NavBar />
      <main>
        <HeroSection />
        <ProfileSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <StatsSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  )
}
