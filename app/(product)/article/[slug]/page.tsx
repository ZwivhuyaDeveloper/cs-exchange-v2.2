import { fullNews } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { NavMenu } from "@/app/(product)/Dashboard/components/layout/NavMenu";
import RelatedNews from "@/components/News/related-news";
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import React from "react";
import { Badge } from '@/components/ui/badge';
import Research from "@/components/News/research-display";
import ResearchDisplay from "@/components/News/research-display";

export const revalidate = 30; // revalidate at most 30 seconds

async function getData(slug: string) {
  const query = `
    *[_type == "news" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
          title,
          content,
          titleImage,
          headImage,
          research,
          contentImage,
          publishedAt,
          "categoryName": category->name,
          category,
      }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullNews = await getData(params.slug);

  return (
    <div className="bg-zinc-100">

      {/* <NavBar/> */}
      <div className="">
        <NavMenu/>
      </div>

      {/* <Ticker/> */}
      <div className="h-fit w-full  justify-center dark:bg-[#0F0F0F] bg-zinc-100 items-center flex mt-1 ">
        <TickerTape/>
      </div> 

      <div className=" grid grid-flow-col gap-2 mt-1 ">

        {/*Left-Section*/}
        <div className="bg-white w-[340px]">
          <div>
            <RelatedNews/>
          </div>
        </div>
        {/*Middle-Section*/}
        <div className="w-full flex flex-col justify-center items-center bg-white">
          <h1>
            <span className=" mt-8 px-15 text-lg flex gap-1 flex-row justify-between text-start text-zinc-500  font-semibold tracking-wide ">
              <h1 className="flex flex-row gap-1 font-semibold text-2xl"><p className="font-bold text-blue-500">Todays</p>Headlines</h1>
              <Badge className="w-fit bg-blue-400/20 text-blue-400 border-px border-blue-400 ">{data.categoryName}</Badge>
            </span>
            <span className="mt-5 block px-15 text-3xl text-start font-semibold sm:text-4xl">
              {data.title}
            </span>
          </h1>
          <div className="justify-center items-center flex">
            <Image
              src={urlFor(data.titleImage).url()}
              width={1000}
              height={500}
              alt="Title Image"
              priority
              className="rounded-lg mt-8 border"
            />
          </div>
          <div className="mt-5 text-lg flex flex-row text-zinc-500 w-full justify-start px-20 gap-1">
          </div>
          <div className="mt-16 prose text-lg px-20 prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
            <PortableText value={data.content} />
          </div>

          <div className="justify-center items-center flex">
            <Image
              src={urlFor(data.headImage).url()}
              width={1000}
              height={400}
              alt="Title Image"
              priority
              className="rounded-lg mt-8 border"
            />
          </div>

          <div className="mt-16 prose text-lg px-20 prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
            <PortableText value={data.research} />
          </div>
          <div className="justify-center items-center flex">
            <Image
              src={urlFor(data.contentImage).url()}
              width={1000}
              height={400}
              alt="Title Image"
              priority
              className="rounded-lg mt-8 border"
            />
          </div>
        </div>
        {/*Right-Section*/}
        <div className="bg-white w-[340px]">
          <div>
            <ResearchDisplay/>
          </div>
        </div>

      </div>
    </div>
  );
}