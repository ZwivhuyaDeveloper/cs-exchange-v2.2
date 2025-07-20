// app/signals/[id]/page.tsx
import { client } from "@/app/lib/sanity";
import { CryptoSignal } from "@/app/lib/interface";
import GainCalculator from "@/app/(product)/Edge/components/ProfitCalculator";
import CryptoSignalCard from "@/app/(product)/Edge/components/SignalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SIGNAL_BY_SLUG_QUERY } from "@/app/lib/queries";


export default async function SignalPage({ params }: { params: { slug: string } }) {
  const signal = await client.fetch<CryptoSignal>(SIGNAL_BY_SLUG_QUERY, { 
    slug: params.slug // This matches the $slug in the query
  });
  
  if (!signal) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-red-500">Signal not found.</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <CryptoSignalCard signal={signal} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <GainCalculator signal={signal} />
        
        <Card>
          <CardHeader>
            <CardTitle>Token Details</CardTitle>
          </CardHeader>
          <CardContent>
            { !signal.token ? (
              <div className="text-red-500">Token data is missing for this signal.</div>
            ) : (
            <div className="space-y-2">
              <div>
                <Label className="text-muted-foreground text-sm">Symbol</Label>
                <p className="font-medium">{signal.token?.symbol || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Name</Label>
                <p className="font-medium">{signal.token?.name || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Blockchain</Label>
                <p className="font-medium">{signal.token?.blockchain || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Contract Address</Label>
                <p className="font-mono text-sm truncate">
                  {signal.token?.contractAddress || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">CoinGecko ID</Label>
                <p className="font-medium">{signal.token?.coingeckoId || 'N/A'}</p>
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {signal.associatedContent && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Related Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div>
                <h3 className="font-medium">{signal.associatedContent.title}</h3>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-blue-600"
                  asChild
                >
                  <a href={
                    signal.associatedContent._type === 'news'
                      ? `/article/${signal.associatedContent.slug}`
                      : signal.associatedContent._type === 'research'
                        ? `/analysis/${signal.associatedContent.slug}`
                        : '#'
                  }>
                    View Content
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Performance History</h3>
        {/* Chart component would go here */}
        <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
          Performance Chart Placeholder
        </div>
      </div>
    </div>
  );
}