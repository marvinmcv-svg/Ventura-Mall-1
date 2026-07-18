import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { StatsBar } from "@/components/site/stats-bar";
import { StorySection } from "@/components/site/story-section";
import { Stores } from "@/components/site/stores";
import { Experiences } from "@/components/site/experiences";
import { Dining } from "@/components/site/dining";
import { Promos } from "@/components/site/promos";
import { Events } from "@/components/site/events";
import { Cinema } from "@/components/site/cinema";
import { Gallery } from "@/components/site/gallery";
import { Visit } from "@/components/site/visit";
import { Faq } from "@/components/site/faq";
import { Newsletter } from "@/components/site/newsletter";
import { SiteFooter } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { AdminPortal } from "@/components/admin/admin-portal";
import { AdminTrigger } from "@/components/admin/admin-trigger";
import { ClientContentProvider } from "@/components/site/client-content-provider";
import { PageTracker } from "@/components/site/page-tracker";

export default function Home() {
  return (
    <ClientContentProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <PageTracker />
        <ScrollProgress />
        <SiteHeader />
        <main className="flex-1">
          <Hero />
          <Marquee />
          <StatsBar />
          <Stores />
          <StorySection />
          <Experiences />
          <Dining />
          <Cinema />
          <Events />
          <Gallery />
          <Promos />
          <Visit />
          <Faq />
          <Newsletter />
        </main>
        <SiteFooter />
        <AdminTrigger />
        <AdminPortal />
      </div>
    </ClientContentProvider>
  );
}
