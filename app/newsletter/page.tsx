import { Metadata } from 'next';
import { PageLayout } from '@/templates';
import { NewsletterBox } from '@/components/organisms';

export const metadata: Metadata = {
  title: 'Tech Death Alerts Newsletter | Is This Tech Dead?',
  description:
    "Subscribe to our monthly tech obituaries and watch the slow, painful death of frameworks your coworkers won't shut up about.",
};

export default function NewsletterPage() {
  return (
    <PageLayout showBackLink={true}>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">
            Tech Death Alerts
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {`Stay informed about the technologies that are heading to the digital graveyard. 
            Our brutally honest newsletter tracks the slow death of hyped frameworks so you don't waste your time learning them.`}
          </p>
        </div>

        <NewsletterBox />

        <div className="mt-12 text-center text-zinc-500 text-sm border-t border-zinc-800 pt-6">
          <p>
            {`We'll never spam you. We only send emails when tech actually dies — which happens a lot more often than you'd think.`}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
