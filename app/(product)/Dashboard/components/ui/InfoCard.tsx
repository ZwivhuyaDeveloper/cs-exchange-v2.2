import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InfoCardProps } from './componentData';

export function InfoCard({ title, description, dataSources, note, lastUpdated }: InfoCardProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-foreground">
          <Info className="h-3 w-3" />
          <span className="sr-only">Info</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 overflow-hidden  left-0  bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-white/20 dark:border-zinc-700/50 shadow-lg">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <div className="mt-4">
            <h5 className="text-xs font-medium mb-1">Data Sources:</h5>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {dataSources.map((source, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-medium mr-1">•</span>
                  <div>
                    <span className="font-medium">{source.name}:</span> {source.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {note && (
            <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
              {note}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2 text-right">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
