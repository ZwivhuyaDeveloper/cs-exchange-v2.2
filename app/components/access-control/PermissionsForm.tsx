'use client';

import { updateUserMetadata } from '@/app/types/actions';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface PermissionsState {
  canAccessProducts: boolean;
  canAccessResearch: boolean;
}

export default function PermissionsForm() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<PermissionsState>({
    canAccessProducts: false,
    canAccessResearch: false
  });

  // Initialize form with user's current permissions
  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata as Partial<PermissionsState>;
      setPermissions({
        canAccessProducts: !!metadata.canAccessProducts,
        canAccessResearch: !!metadata.canAccessResearch
      });
    }
  }, [user, isLoaded]);

  const handlePermissionChange = (field: keyof PermissionsState) => {
    setPermissions(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await updateUserMetadata(user.id, {
        ...permissions
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update the user object with new permissions
      await user.reload();
      alert('Permissions updated successfully!');
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert(error instanceof Error ? error.message : 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Please sign in to manage permissions.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Permissions</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="products"
            checked={permissions.canAccessProducts}
            onChange={() => handlePermissionChange('canAccessProducts')}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="products" className="ml-2 text-gray-700">
            Access to Products
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="research"
            checked={permissions.canAccessResearch}
            onChange={() => handlePermissionChange('canAccessResearch')}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="research" className="ml-2 text-gray-700">
            Access to Research
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Saving...' : 'Save Permissions'}
        </button>
      </form>
    </div>
  );
}