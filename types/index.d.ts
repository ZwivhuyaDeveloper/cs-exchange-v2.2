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
