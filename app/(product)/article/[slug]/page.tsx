import { fullNews } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { NavMenu } from "@/app/(product)/components/layout/NavMenu";
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import React from "react";
import { Badge } from '@/components/ui/badge';
import ResearchDisplay from "../../News/components/research-display";
import RelatedNews from '@/app/(product)/News/components/related-news';
import { formatDate } from "@/app/lib/dateUtils";




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
      {/* Ticker */}
      <div className="w-full h-fit flex justify-center items-center py-1 px-1 md:py-1 ">
        <div className="border border-px dark:border-zinc-700 border-zinc-200 w-full">
          <TickerTape />
        </div>
      </div>


      <div className=" flex-col-reverse flex md:flex-row lg:flex-row justify-center  sm:mt-1 gap-2 w-full ">

        {/*Left-Section*/}
        <div className="bg-white hidden w-full sm:w-[340px] ">
          <div>
            <RelatedNews/>
          </div>
        </div>

        {/*Middle-Section*/}
        <div className="w-full flex flex-col justify-center items-center bg-white">
          <h1>
            <span className=" mt-8 sm:px-15 px-8 text-lg flex gap-1 flex-row justify-between text-start text-zinc-500  font-semibold tracking-wide ">
              <h1 className="flex flex-row gap-1 font-semibold text-2xl"><p className="font-bold text-[#0E76FD] dark:text-[#00FFC2]">Todays</p>Headlines</h1>
              <Badge className="w-fit bg-blue-400/20 text-[#0E76FD] dark:text-[#00FFC2] border-px border-[#0E76FD] dark:border-[#00FFC2] dark:bg-[#00FFC2]/10 ">{data.categoryName}</Badge>
            </span>
            <span className="mt-5 block sm:px-15 px-8 text-3xl text-start font-semibold sm:text-4xl">
              {data.title}
            </span>
          </h1>
          <div className="justify-center items-center sm:px-0 px-4  flex">
            <Image
              src={urlFor(data.titleImage).url()}
              width={1000}
              height={500}
              alt="Title Image"
              priority
              className="rounded-lg mt-8 border"
            />
          </div>
          <div className="mt-5 text-lg flex flex-row text-zinc-500 w-full justify-start sm:px-20 px-4 gap-1">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {formatDate(data.publishedAt, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="sm:mt-16 mt-8 prose text-lg px-6 sm:px-20 prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
            <PortableText value={data.content} />
          </div>

          <div className="justify-center sm:px-0 px-4 items-center flex">
            <Image
              src={urlFor(data.headImage).url()}
              width={1000}
              height={400}
              alt="Title Image"
              priority
              className="rounded-lg mt-8 border"
            />
          </div>

          <div className="mt-16 prose text-lg px-4 sm:px-20 prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
            <PortableText value={data.research} />
          </div>
          <div className="justify-center sm:px-0 px-4 items-center flex">
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
        <div className="bg-white hidden sm:block w-[340px]">
          <div>
            <ResearchDisplay/>
          </div>
        </div>

      </div>
    </div>
  );
}