/// <reference types="next" />
/// <reference types="next/image-types/global" />

export interface DataSource {
  name: string;
  description: string;
}

export interface InfoCardProps {
  title: string;
  description: string;
  dataSources: DataSource[];
  note?: string;
  lastUpdated: string;
}

type PageProps = {
  params: { [key: string]: string | string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
};