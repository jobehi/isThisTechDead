import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Terms & Privacy | Is This Tech Dead?',
  description: 'Legal stuff. Our terms of service and privacy policy.',
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="absolute top-40 right-10 opacity-10 select-none pointer-events-none">
        <Image src="/old_pc.png" alt="" width={200} height={0} />
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-5 w-5 rounded-full bg-lime-500 animate-pulse" />
        <p className="text-zinc-500 text-sm uppercase tracking-wider">Legal & Privacy</p>
      </div>

      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-zinc-400 mb-8 text-lg">
        aka: <span className="text-lime-400 font-mono">{`"Don't sue us, bro."`}</span>
      </p>

      <div className="space-y-8 mb-16">
        <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="text-lime-400 font-mono mr-2">01</span>
            Acceptance of Death
          </h2>
          <p className="text-zinc-400">
            {`By using this site, you accept that technology is mortal and that sarcasm is a valid coping mechanism. 
            If you don't agree, close the tab. We won't notice.`}
          </p>
        </div>

        <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="text-lime-400 font-mono mr-2">02</span>
            Intellectual Property
          </h2>
          <p className="text-zinc-400">
            {`We built this with dead tech and a lot of caffeine. All content is original unless otherwise stated. 
            Don't steal it unless you improve it and link back to us.`}
          </p>
        </div>

        <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="text-lime-400 font-mono mr-2">03</span>
            Accuracy Disclaimer
          </h2>
          <p className="text-zinc-400">
            {`This site makes fun of tech dying. Some of it is serious. Some of it is satire. 
            If you take business decisions based on this site, that's on you, my guy.`}
          </p>
        </div>

        <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="text-lime-400 font-mono mr-2">04</span>
            User-Generated Content (Project Submissions)
          </h2>
          <p className="text-zinc-400 mb-3">
            {`You may submit information about your projects built using the technologies featured on this site ("User-Generated Content" or "UGC"), including project name, URLs, description, self-roast, and screenshots.`}
          </p>
          <p className="text-zinc-400 mb-3">
            {`By submitting UGC, you grant Is This Tech Dead? a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify (for formatting, moderation, or display purposes), adapt, publish, translate, create derivative works from, distribute, and display such UGC on the site and in promotional materials.`}
          </p>
          <p className="text-zinc-400 mb-3">
            {`You represent and warrant that you own or otherwise control all of the rights to the UGC that you post; that the content is accurate; that use of the content you supply does not violate this policy and will not cause injury to any person or entity; and that you will indemnify Is This Tech Dead? for all claims resulting from content you supply.`}
          </p>
          <p className="text-zinc-400 mb-3">
            {`Do not submit any UGC that is illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties or objectionable. Don't post anything unironically built with XML. We reserve the right (but not the obligation) to review, approve, reject, remove, or edit such content in our sole discretion.`}
          </p>
          <p className="text-zinc-400 text-sm italic">
            {`This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">Terms of Service</a> apply.`}
          </p>
        </div>

        <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="text-lime-400 font-mono mr-2">05</span>
            Service Availability
          </h2>
          <p className="text-zinc-400">
            {`We host this thing on Vercel and Supabase. If it crashes, that's either our fault or the fault of a library we made fun of. Either way: not our problem.`}
          </p>
        </div>

        <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <span className="text-lime-400 font-mono mr-2">06</span>
            Changes to These Terms
          </h2>
          <p className="text-zinc-400">
            {`We might update these when we remember. You should check occasionally. Or don't. Whatever.`}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-12 mt-16">
        <div className="relative">
          <div className="absolute -top-6 left-0 flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="text-lime-500 text-xl">🔐</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 mt-8">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8 text-lg">
          aka: <span className="text-lime-400 font-mono">{`"We're not creepy."`}</span>
        </p>

        <div className="space-y-8">
          <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="text-lime-400 font-mono mr-2">01</span>
              What We Collect (and Why)
            </h2>
            <p className="text-zinc-400 mb-3">
              {`We use Simple Analytics for website traffic analysis. It's privacy-focused – no cookies, no fingerprinting, no IP address storage. We just see general traffic trends, like which pages are popular.`}
            </p>
            <p className="text-zinc-400 mb-3">
              {`If you subscribe, we collect your email address via Buttondown to send you updates. That's it.`}
            </p>
            <p className="text-zinc-400 mb-3">
              <strong>Project Submissions:</strong> When you submit a project, we collect the
              information you provide: project name, URLs, description, self-roast, and optionally,
              a screenshot. Screenshots are stored securely via Supabase Storage. We use this
              information solely to display your project on the site after approval. Do not submit
              anything personally identifiable. Want your data removed? file an issue on github.
            </p>
            <p className="text-zinc-400 mb-3">
              <strong>reCAPTCHA:</strong> To prevent spam and abuse on project submissions, we use
              Google reCAPTCHA v3. This service collects hardware and software information, such as
              device and application data, and sends it to Google for analysis to determine whether
              you are human. This is subject to the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-400 hover:underline"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-400 hover:underline"
              >
                Terms of Service
              </a>
              .
            </p>
            <p className="text-zinc-400">
              <strong>Server Logs:</strong> Like most websites, our hosting provider (Vercel) may
              automatically log basic information like your IP address, browser type, and access
              times for security and operational purposes. This data is typically kept for a limited
              time.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="text-lime-400 font-mono mr-2">02</span>
              Your Rights
            </h2>
            <p className="text-zinc-400">
              Want your data removed? Just unsubscribe from the newsletter. You can also email us to
              be deleted from our extremely tiny, soon-to-be-full 100-person list.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="text-lime-400 font-mono mr-2">03</span>
              Data Retention
            </h2>
            <p className="text-zinc-400">
              {`Newsletter data is kept for as long as you're subscribed. Analytics data is kept by Simple Analytics for 1 month. Because that's free. And we're cheap.`}
            </p>
          </div>

          <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors bg-zinc-900/30">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="text-lime-400 font-mono mr-2">04</span>
              Third Parties (Who We Share Data With)
            </h2>
            <p className="text-zinc-400 mb-3">
              {`We minimize data sharing but rely on a few essential services:`}
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1">
              <li>
                <strong>Simple Analytics:</strong> For website analytics (anonymous data).
              </li>
              <li>
                <strong>Buttondown:</strong> To manage our newsletter subscriptions (your email).
              </li>
              <li>
                <strong>Supabase:</strong> Our backend provider for storing project submission data
                and screenshots.
              </li>
              <li>
                <strong>Google reCAPTCHA:</strong> For bot detection (hardware/software info).
              </li>
              <li>
                <strong>Vercel:</strong> Our hosting provider (standard server logs).
              </li>
            </ul>
            <p className="text-zinc-400 mt-3">
              {`We recommend reviewing their respective privacy policies if you have concerns.`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-zinc-500 text-sm">
        <p>{`This is probably the first terms page you've actually read completely.`}</p>
        <p className="text-xs mt-1">{`Congratulations on being a weirdo.`}</p>
      </div>
    </div>
  );
}
