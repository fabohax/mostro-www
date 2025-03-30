'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Register from '@/app/auth/register/page';

export default function Auth() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white w-full p-0 font-mono">
      <div className="text-center space-y-4 w-full">
        <Link href="/auth/login">
            <Button className="bg-lime-500 text-black cursor-pointer hover:bg-white lg:w-1/3 mb-2">
            Login 
            </Button>
        </Link>
        <Register/>
      </div>
      <div className='fixed bottom-0 text-center py-4 w-full text-sm'>
        <p className="text-gray-400">
          By logging in, you agree to our <a href="/terms" className="text-lime-500">Terms of Service</a> and <a href="/privacy" className="text-lime-500">Privacy Policy</a>.
        </p>
        <p className="text-gray-400">No personal data is stored. All data is stored locally.</p>
        <p className="text-gray-400">This is a demo app. Please use at your own risk.</p>
      </div>
    </div>
  );
}
