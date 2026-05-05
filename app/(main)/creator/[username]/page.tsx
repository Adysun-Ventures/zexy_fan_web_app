'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function CreatorUsernameRedirect() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  useEffect(() => {
    if (username) {
      // Redirect to public route
      router.replace(`/creator/${username}`);
    }
  }, [username, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
