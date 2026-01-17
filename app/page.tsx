import { HomePageTemplate } from "@/features/visitor-home/components";
import { serverRpc } from "@/integrations/rpc/server";

/**
 * Home Page
 *
 * Server-rendered home page using the server RPC client.
 * Data is fetched at request time (SSR).
 */
export default async function Page() {
    const data = await serverRpc.home.getHomePageData();

    return <HomePageTemplate data={data} />;
}
