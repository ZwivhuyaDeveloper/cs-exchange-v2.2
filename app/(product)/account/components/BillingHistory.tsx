'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Download, Receipt, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';

// Mock data - in a real app, this would come from an API
const MOCK_INVOICES = [
  {
    id: 'INV-001',
    date: '2025-07-15',
    amount: 29.99,
    status: 'paid' as const,
    plan: 'Pro Monthly',
    downloadUrl: '#',
  },
  {
    id: 'INV-002',
    date: '2025-06-15',
    amount: 29.99,
    status: 'paid' as const,
    plan: 'Pro Monthly',
    downloadUrl: '#',
  },
  {
    id: 'INV-003',
    date: '2025-05-15',
    amount: 9.99,
    status: 'paid' as const,
    plan: 'Basic Monthly',
    downloadUrl: '#',
  },
  {
    id: 'INV-004',
    date: '2025-04-15',
    amount: 9.99,
    status: 'refunded' as const,
    plan: 'Basic Monthly',
    downloadUrl: '#',
  },
];

type Invoice = typeof MOCK_INVOICES[number];

export function BillingHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would download the invoice PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">Paid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800">Refunded</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your billing history and receipts.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No billing history</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
              You haven't made any purchases yet. Your billing history will appear here once you subscribe to a plan.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {format(new Date(invoice.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{invoice.plan}</div>
                      <div className="text-sm text-muted-foreground">Invoice #{invoice.id}</div>
                    </TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="ml-2">PDF</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
