import type { HomePageDataType } from "@/features/visitor-home/server/schemas";

import {
    FeaturesSection,
    HeroSection,
    StatsSection,
    StorageDemoSection,
    TestimonialsSection,
} from "../organisms";

interface HomePageTemplateProps {
    data: HomePageDataType;
}

/**
 * Home Page Template
 *
 * Composes all organisms into a complete home page layout.
 * Receives all data from the server and distributes to sections.
 */
export function HomePageTemplate({ data }: HomePageTemplateProps) {
    return (
        <main className="min-h-screen">
            <HeroSection data={data.hero} />
            <FeaturesSection data={data.features} />
            <StorageDemoSection />
            <StatsSection data={data.stats} />
            <TestimonialsSection data={data.testimonials} />
        </main>
    );
}
