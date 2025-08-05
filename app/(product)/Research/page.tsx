import { simpleResearchCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import { NavMenu } from "../components/layout/NavMenu";
import TickerTape from "../Dashboard/components/ui/TickerTape";
import ResearchSection from "./components/research-section";
import ResearchDisplay from "../News/components/research-display";
import { currentUser } from '@clerk/nextjs/server';

export const revalidate = 30; // revalidate at most 30 seconds

async function getData() {
  const query = `
  *[_type == 'research'] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage,
      publishedAt,
      "categoryName": category->name,
      category,
      "tags": tags[]->{
        name,
        color
      },
      "impacts": impacts[]->{
        name,
        color
      }
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function Research() {
  const data: simpleResearchCard[] = await getData();
  console.log('Research data loaded:', data.length, 'items');

  const user = await currentUser();
  const metadata = user?.publicMetadata || {};
  
  if (!metadata.canAccessResearch) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to view the Research page</p>
        <p className="mt-2">
          Contact support to request access to this feature
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 dark:bg-black">
      {/* Navigation */}
      <div>
        <NavMenu/>
      </div>

      <div className="h-fit w-full justify-center dark:bg-[#0F0F0F] bg-zinc-100 items-center flex mt-1">
        <TickerTape/>
      </div> 

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Related Research</h2>
            </div>
          </div>
          {/* Middle Section - Main Content */}
          <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-4">
            <h1 className="text-2xl font-bold mb-6">Latest Research</h1>
            <ResearchSection data={data} />
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Research Display</h2>
              <p className="text-muted-foreground mb-4">Access research insights and market data</p>
              <ResearchDisplay/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}