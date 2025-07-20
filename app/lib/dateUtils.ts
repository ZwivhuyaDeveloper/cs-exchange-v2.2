// app/lib/dateUtils.ts
export function formatDate(
  dateString: string, 
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function isRecent(dateString: string, days = 3): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays <= days;
}