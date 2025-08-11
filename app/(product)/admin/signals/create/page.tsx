import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SignalCreateForm from './components/SignalCreateForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserPermissions(userId: string) {
  const userRole = await prisma.userRole.findUnique({
    where: { userId }
  });

  return userRole?.role === 'admin' || userRole?.role === 'analyst';
}

export default async function CreateSignalPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has admin or analyst permissions
  const hasPermission = await checkUserPermissions(userId);
  
  if (!hasPermission) {
    redirect('/signals?error=insufficient-permissions');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/signals">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Signals
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Create New Signal</h1>
        <p className="text-gray-600 mt-2">
          Create a new trading signal with detailed analysis and recommendations
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Signal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SignalCreateForm userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}
