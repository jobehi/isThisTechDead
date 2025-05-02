'use client';

import Link from 'next/link';
import { GlitchText } from '@/components/molecules';
import { PageLayout } from '@/templates';
import config from '@/lib/config';

export default function NotFound() {
  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-16">
          <h1 className="text-8xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            <GlitchText text="404" intensity="high" glitchOnHover={false} />
          </h1>

          <h2 className="text-2xl font-bold text-zinc-100 mb-8">This Tech Was Too Dead To Find</h2>

          <p className="text-zinc-400 mb-10 text-lg">
            {`The page you're looking for has either been deprecated, abandoned by its maintainers, or never existed in the first place. Much like that framework you chose for your last project.`}
          </p>

          <div className="max-w-md mx-auto p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50 mb-10">
            <p className="font-mono text-red-400 mb-2">$ curl -I {config.site.url}/this-page</p>
            <p className="font-mono text-zinc-500">HTTP/1.1 404 Not Found</p>
            <p className="font-mono text-zinc-500">Content-Type: text/plain</p>
            <p className="font-mono text-zinc-500">X-Dead-Tech-Count: TOO_MANY_TO_COUNT</p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-black bg-lime-400 rounded-md hover:bg-lime-500 transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
