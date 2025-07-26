import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import SignalsManagementDashboard from './components/SignalsManagementDashboard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

async function checkUserPermissions(userId: string) {
  const userRole = await prisma.userRole.findUnique({
    where: { userId }
  });

  return userRole?.role === 'admin' || userRole?.role === 'analyst';
}

export default async function AdminSignalsPage() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Signal Management</h1>
        <p className="text-gray-600 mt-2">
          Create, edit, and manage trading signals for the platform
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <SignalsManagementDashboard userId={userId} />
      </Suspense>
    </div>
  );
}
