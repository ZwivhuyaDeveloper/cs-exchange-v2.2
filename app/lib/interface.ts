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
}

export interface simpleResearchCard {
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
