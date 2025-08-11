import { simpleNewsCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape";
import React from "react";
import { NavMenu } from "../components/layout/NavMenu";
import NewsSection from "./components/news-section";
import ResearchDisplay from "./components/research-display";
import RelatedNews from '@/app/(product)/News/components/related-news';
import BottomPanel from "../components/layout/BottomPanel";
import MiddleSection from "./components/middle-section";
import EconomicSection from "./components/economic-section";


export const revalidate = 30; // revalidate at most 30 seconds

async function getData() {
  const query = `
  *[_type == 'news'] | order(publishedAt desc) {
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
      },
      "author": author->{
        name,
        avatar,
        role
      },
      
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function News() {
  const data: simpleNewsCard[] = await getData();

  console.log(data);

  return (
    <div className="bg-zinc-100 dark:bg-black w-full h-full">
      {/* Ticker */}
      <div className="w-full h-fit flex justify-center items-center py-1 px-1 md:py-1 ">
        <div className="border border-px dark:border-zinc-700 border-zinc-200 w-full">
          <TickerTape />
        </div>
      </div>

      <div className="flex-col-reverse flex md:flex-row lg:flex-row justify-center  sm:mt-1 gap-2 w-full">

        {/*Left-Section*/}
        <div className="lg:w-[460px] w-full gap-2  flex-col h-full">
          <div>
            <RelatedNews/>
          </div>
        </div>

        {/*middle-Section*/}
        <div className="w-full flex flex-col px-1 gap-1 mb-10 overflow-hidden sm:w-full">
          <div>
            <NewsSection data={data} />
          </div>
          <div>
            <MiddleSection data={data}  />
          </div>
          <div>
            <EconomicSection/>
          </div>
        </div>

        {/*Right-Section*/}
        <div className="bg-white hidden lg:block w-[460px]">
          <div>
            <ResearchDisplay/>
          </div>
        </div>
      </div>

            {/* Footer */}
      <footer
        className="z-50 flex h-fit items-center backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 bg-zinc-200/80 px-2 md:px-6 py-2 md:py-4
        sticky bottom-0 w-full
        lg:fixed lg:left-0 lg:bottom-0 lg:w-full"
        style={{ boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.08)' }}
      >
        <BottomPanel />
      </footer>

    </div>
  );
}