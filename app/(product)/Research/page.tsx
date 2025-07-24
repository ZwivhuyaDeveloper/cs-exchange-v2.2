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
            <RelatedResearch/>
          </div>
        </div>

        {/*middle-Section*/}
        <div className="bg-white">
          <div>
            <ResearchSection data={data} />
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