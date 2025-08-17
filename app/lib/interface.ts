export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  role?: string;
  bio?: string;
  avatar?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  isStaff?: boolean;
  email?: string;
}

export interface Tag {
  name: string;
  color: string;
}

export interface Impact {
  name: string;
  color: string;
}

export interface simpleNewsCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];
  author: Author | null;
  keyPoints?: Array<{
    _key: string;
    point: string;
    description?: string;
  }>;
}

export interface fullNews {
  currentSlug: string;
  title: string;
  content: any;
  titleImage: any;
  headImage: any;
  contentImage: any;
  research: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];
  author: Author | null;
  keyPoints?: Array<{
    _key: string;
    point: string;
    description?: string;
  }>;
}

export interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export interface simpleResearchCard {
  author: Author | null;
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];

}

export interface fullResearch {
  currentSlug: string;
  title: string;
  content: any;
  titleImage: any;
  headImage: any;
  contentImage: any;
  research: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];

}

export type DateFormatOptions = {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
};
