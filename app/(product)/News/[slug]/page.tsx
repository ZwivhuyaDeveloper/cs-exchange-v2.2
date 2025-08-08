import { client } from "@/app/lib/sanity";
import { urlFor } from "@/app/lib/sanityImageUrl";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 30; // Revalidate every 30 seconds

interface NewsArticle {
  title: string;
  content: any;
  titleImage: any;
  publishedAt: string;
  author: {
    name: string;
    avatar: any;
    role: string;
  };
  categoryName: string;
}

export default async function NewsArticle({
  params,
}: {
  params: { slug: string };
}) {
  const query = `
    *[_type == 'news' && slug.current == $slug][0] {
      title,
      content,
      titleImage,
      publishedAt,
      "author": author->{
        name,
        avatar,
        role
      },
      "categoryName": category->name,
    }
  `;

  const article: NewsArticle = await client.fetch(query, { slug: params.slug });

  if (!article) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        {article.titleImage && (
          <div className="relative h-96 w-full">
            <Image
              src={urlFor(article.titleImage).url()}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            {article.author?.avatar && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={urlFor(article.author.avatar).url()}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-semibold">{article.author?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {article.categoryName && ` • ${article.categoryName}`}
              </p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <PortableText value={article.content} />
          </div>
        </div>
      </article>
    </div>
  );
}
