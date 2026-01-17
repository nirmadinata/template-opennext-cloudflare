"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import {
    FeaturesSection,
    HeroSection,
    StatsSection,
    TestimonialsCarouselSection,
} from "@/features/visitor-home/components/organisms";
import { orpc } from "@/integrations/rpc/client";

/**
 * Client-Side Home Page Content
 *
 * Demonstrates TanStack Query integration with ORPC.
 * Data is fetched on the client using React Query hooks.
 */
export function ClientHomeContent() {
    const { data, isLoading, isError, error } = useQuery(
        orpc.home.getHomePageData.queryOptions()
    );

    if (isLoading) {
        return <HomePageSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-destructive text-2xl font-bold">
                        Error Loading Page
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {error?.message || "Something went wrong"}
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <main className="min-h-screen">
            <HeroSection data={data.hero} />
            <FeaturesSection data={data.features} />
            <StatsSection data={data.stats} />
            <TestimonialsCarouselSection data={data.testimonials} />
        </main>
    );
}

/**
 * Skeleton loader for the home page
 */
function HomePageSkeleton() {
    return (
        <main className="min-h-screen">
            {/* Hero Skeleton */}
            <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <Skeleton className="mx-auto mb-6 h-14 w-3/4" />
                    <Skeleton className="mx-auto mb-8 h-6 w-2/3" />
                    <Skeleton className="mx-auto h-12 w-32" />
                </div>
            </section>

            {/* Features Skeleton */}
            <section className="px-4 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <Skeleton className="mx-auto mb-4 h-10 w-64" />
                        <Skeleton className="mx-auto h-6 w-96" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Skeleton */}
            <section className="px-4 py-20">
                <div className="mx-auto max-w-4xl">
                    <Skeleton className="mx-auto mb-12 h-10 w-48" />
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="text-center">
                                <Skeleton className="mx-auto mb-2 h-12 w-20" />
                                <Skeleton className="mx-auto h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
