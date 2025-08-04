import { cn } from "@/lib/utils";

interface KeyPoint {
  _key: string;
  point: string;
  description?: string;
}

interface KeyPointsProps {
  points: KeyPoint[];
  className?: string;
  title?: string;
}

export function KeyPoints({ points, className, title = 'Key Points' }: KeyPointsProps) {
  console.log('KeyPoints component received points:', points);
  if (!points?.length) {
    console.log('No points to display');
    return null;
  }

  return (
    <div className={cn("my-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500", className)}>
      <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">{title}</h3>
      <ul className="space-y-4">
        {points.map((item) => (
          <li key={item._key} className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-3 mt-0.5">
              <svg className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-blue-900 dark:text-blue-100">{item.point}</span>
              {item.description && (
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
