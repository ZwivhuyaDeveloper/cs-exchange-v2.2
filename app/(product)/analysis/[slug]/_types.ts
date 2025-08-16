import { Metadata, ResolvingMetadata } from 'next';

export type AnalysisPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type GenerateMetadataProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
