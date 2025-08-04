import { Card, CardContent } from "@/components/ui/card";
import { simpleResearchCard } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavMenu } from "../components/layout/NavMenu";
import TickerTape from "../Dashboard/components/ui/TickerTape";
import RelatedResearch from "./components/related-research";
import ResearchSection from "./components/research-section";
import ResearchDisplay from "../News/components/research-display";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth-utils';
import { notFound } from 'next/navigation';

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
  const { userId } = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in?redirect_url=' + encodeURIComponent('/research'));
  }

  // Check if user has permission to access research
  const hasAccess = await hasPermission('canAccessResearch');
  
  // If user doesn't have access, redirect to unauthorized page
  if (!hasAccess) {
    notFound(); // or redirect to a specific unauthorized page
  }

  // Fetch research data
  const data: simpleResearchCard[] = await getData();
  console.log('Research data loaded for user:', userId, data.length, 'items');

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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Latest Research</h1>
              <div className="text-sm text-muted-foreground">
                Premium Content Access
              </div>
            </div>
            {data.length > 0 ? (
              <ResearchSection data={data} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No research available</h3>
                <p className="text-muted-foreground mt-2">Check back later for new research reports</p>
              </div>
            )}
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