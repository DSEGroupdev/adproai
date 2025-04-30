import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '@clerk/nextjs';
import prisma from '../lib/prisma';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { userId } = auth();
        if (!userId) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to your Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your ad generation account
          </p>
        </div>

        <div className="mt-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Plan</h2>
          <div className="mt-4">
            <p className="text-lg">
              Current Plan: <span className="font-semibold">{user?.plan || 'Free'}</span>
            </p>
            <p className="text-lg mt-2">
              Ads Generated This Month: <span className="font-semibold">{user?.adsGenerated || 0}</span>
            </p>
            <p className="text-lg mt-2">
              Monthly Limit: <span className="font-semibold">{user?.plan === 'PREMIUM' ? '100' : '3'} ads</span>
            </p>
          </div>

          {user?.plan === 'FREE' && (
            <div className="mt-6">
              <button
                onClick={() => router.push('/pricing')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 