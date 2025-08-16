import { fullNews } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/app/(product)/components/ui/BackButton';
import { KeyPoints } from "@/app/(product)/components/KeyPoints";
import ResearchDisplay from "../../News/components/research-display";
import RelatedNews from '@/app/(product)/News/components/related-news';
import { formatDate } from "@/app/lib/dateUtils";

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
          "author": author->{
            name,
            avatar
          },
          "keyPoints": keyPoints[]{
            _key,
            point,
            description
          }
      }[0]`;

  const data = await client.fetch(query);
  return data;
}

export const revalidate = 30;
export const dynamic = 'force-dynamic';

// Fix: Use the exact type structure Next.js expects
export default async function Page({
  params
}: {
  params: { slug: string }
}) {
  const data: fullNews = await getData(params.slug);

  return (
    <div className="bg-zinc-100 dark:bg-black">
      {/* Ticker */}
      <div className="w-full h-fit flex justify-center items-center py-1 px-1 md:py-1 ">
        <div className="border border-px dark:border-zinc-700 border-zinc-200 w-full">
          <TickerTape />
        </div>
      </div>

      <div className="flex-col-reverse flex md:flex-row lg:flex-row justify-center sm:mt-1 gap-2 w-full">
        {/* Left-Section */}
        <div className="hidden w-full sm:w-[340px]">
          <div>
            <RelatedNews/>
          </div>
        </div>

        {/* Middle-Section */}
        <div className="w-full flex flex-col justify-center items-center mb-20 sm:mb-5 bg-white dark:bg-[#0f0f0f]">
          <div className="w-full px-4 sm:px-8 mt-6">
            <BackButton />
          </div>
          <div className="w-full">
            <div className="mt-8 px-8 flex justify-between items-center">
              <h1 className="flex gap-1 font-semibold text-2xl">
                <span className="font-bold text-[#0E76FD] dark:text-[#00FFC2]">Todays</span>
                <span>Headlines</span>
              </h1>
              <Badge className="bg-blue-400/20 text-[#0E76FD] dark:text-[#00FFC2] border border-[#0E76FD] dark:border-[#00FFC2] dark:bg-[#00FFC2]/10">
                {data.categoryName}
              </Badge>
            </div>
            <h1 className="mt-5 px-8 text-3xl font-semibold sm:text-4xl">
              {data.title}
            </h1>
          </div>
          
          <div className="w-full px-4 sm:px-0 mt-8 flex justify-center">
            <Image
              src={urlFor(data.titleImage).url()}
              width={1000}
              height={500}
              alt="Title Image"
              priority
              className="rounded-lg border"
            />
          </div>
          
          <div className="mt-5 w-full px-4 sm:px-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {data.author?.avatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={urlFor(data.author.avatar).url()}
                    width={32}
                    height={32}
                    alt={data.author.name || 'Author'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {data.author?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(data.publishedAt, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="sm:mt-16 mt-8 px-6 sm:px-20 prose prose-lg prose-blue dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
            <PortableText value={data.content} />
          </div>

          {data.keyPoints && data.keyPoints.length > 0 && (
            <div className="px-6 sm:px-20 mt-12">
              <KeyPoints 
                points={data.keyPoints} 
                title="Key Takeaways"
                className="max-w-4xl mx-auto"
              />
            </div>
          )}

          <div className="w-full px-4 sm:px-0 mt-8 flex justify-center">
            <Image
              src={urlFor(data.headImage).url()}
              width={1000}
              height={400}
              alt="Head Image"
              priority
              className="rounded-lg border"
            />
          </div>

          <div className="mt-16 px-4 sm:px-20 prose prose-lg prose-blue dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
            <PortableText value={data.research} />
          </div>
          
          <div className="w-full px-4 sm:px-0 mt-8 flex justify-center">
            <Image
              src={urlFor(data.contentImage).url()}
              width={1000}
              height={400}
              alt="Content Image"
              priority
              className="rounded-lg border"
            />
          </div>
        </div>
        
        {/* Right-Section */}
        <div className="bg-white hidden w-[340px]">
          <div>
            <ResearchDisplay/>
          </div>
        </div>
      </div>
    </div>
  );
}