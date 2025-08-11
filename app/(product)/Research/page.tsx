import { simpleResearchCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import { NavMenu } from "../components/layout/NavMenu";
import TickerTape from "../Dashboard/components/ui/TickerTape";
import ResearchSection from "./components/research-section";
import ResearchDisplay from "../News/components/research-display";
import { currentUser } from '@clerk/nextjs/server';
import PaymentGuard from '@/app/components/PaymentGuard';
import { UpgradeButton } from './components/UpgradeButton';

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

  // Get current user
  const user = await currentUser();
  
  // If no user is logged in, PaymentGuard will handle the redirect
  if (!user) {
    return <PaymentGuard><div>Loading...</div></PaymentGuard>;
  }
  
  // Check if user has explicit access via metadata
  const metadata = user.publicMetadata || {};
  const hasExplicitAccess = metadata.canAccessResearch === true;
  
  // If user doesn't have explicit access, show upgrade prompt
  if (!hasExplicitAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Premium Research Access Required</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Unlock exclusive research reports, in-depth analysis, and market insights with a premium subscription.
            </p>
            <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
              <UpgradeButton />
              
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Or explore our pricing plans
                </p>
                <a
                  href="/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View all pricing options →
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">In-Depth Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">Access comprehensive research reports and market analysis.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exclusive Content</h3>
              <p className="text-gray-600 dark:text-gray-400">Get early access to premium research and insights.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expert Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">Learn from industry experts and market analysts.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PaymentGuard>
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
    </PaymentGuard>
  );
}