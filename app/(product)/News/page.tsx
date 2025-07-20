import { simpleNewsCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
;
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape";

import React from "react";
import { NavMenu } from "../Dashboard/components/layout/NavMenu";

import NewsSection from "./components/news-section";
import ResearchDisplay from "./components/research-display";
import RelatedNews from '@/app/(product)/News/components/related-news';


export const revalidate = 30; // revalidate at most 30 seconds

async function getData() {
  const query = `
  *[_type == 'news'] | order(_createdAt desc) {
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

export default async function News() {
  const data: simpleNewsCard[] = await getData();

  console.log(data);


  return (
    <div className="bg-zinc-100 dark:bg-black">
      {/* Navigation */}
      <div>
        <NavMenu/>
      </div>

      {/* <Ticker/> */}
      <div className="h-fit w-full  justify-center dark:bg-[#0F0F0F] bg-zinc-100 items-center flex mt-1 ">
        <TickerTape/>
      </div> 

      <div className="grid grid-flow-col justify-center mt-1 gap-2 w-full">

        {/*Left-Section*/}
        <div className=" w-[350px] gap-2 flex flex-col h-full">
          <div>
            {/*<GlobalIndicator/>*/}
          </div>
          <div>
            <RelatedNews/>
          </div>
        </div>

        {/*middle-Section*/}
        <div className="bg-white">
          <div>
            <NewsSection data={data} />
          </div>
        </div>

        {/*Right-Section*/}
        <div className="bg-white w-[350px]">
          <div>
            <ResearchDisplay/>
          </div>
        </div>
      </div>

    </div>
  );
}