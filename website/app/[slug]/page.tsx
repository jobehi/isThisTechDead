import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageLayout } from '@/templates';
import { ProjectGallery } from '@/components/features';
import { TechHeader } from '@/components/organisms';
import { TechMetricsSection } from '@/components/organisms';
import { TechHistorySection } from '@/components/organisms';
import { TechNoDataView } from '@/components/molecules';
import { JsonLd } from '@/components/atoms';
import { TechService } from '@/domains/tech';
import { calculateDeaditudeScore } from '@/lib/shared';
import config from '@/lib/config';
import { GithubSection } from '@/components/organisms/TechGithubPulse';
export const revalidate = 86400; // One apocalyptic day

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Await params before using its properties
  const awaitedParams = await params;

  // Fetch tech data
  const { tech, snapshots } = await TechService.getTechDetails(awaitedParams.slug);

  if (!tech) {
    notFound();
    return {};
  }

  // Get latest snapshot and calculate score
  const latestSnapshot = TechService.getLatestSnapshot(snapshots);
  const score = latestSnapshot?.deaditude_score
    ? calculateDeaditudeScore(latestSnapshot.deaditude_score)
    : 0;
  const timestamp = latestSnapshot?.created_at
    ? new Date(latestSnapshot.created_at).getTime()
    : Date.now();

  // Generate metadata content
  const metadataContent = TechService.generateMetadataContent(tech, score);

  // Construct the metadata
  return {
    title: metadataContent.title,
    description: metadataContent.description,
    keywords: [
      `${tech.name}`,
      'technology obsolescence',
      'programming',
      'software development',
      'tech stack',
    ],
    openGraph: {
      title: metadataContent.title,
      description: metadataContent.description,
      url: `${config.site.url}/${awaitedParams.slug}?v=${timestamp}`,
      siteName: 'Is This Tech Dead?',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: metadataContent.ogImage,
          width: 1200,
          height: 630,
          alt: `Is ${tech.name} Dead?`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataContent.title,
      description: metadataContent.description,
      images: [metadataContent.ogImage],
    },
    alternates: {
      canonical: `${config.site.url}/${awaitedParams.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const techs = await TechService.getAllTechs();
  return techs.map(tech => ({ slug: tech.id }));
}

export default async function TechDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params before using its properties
  const awaitedParams = await params;

  // Fetch all tech details data from the service
  const { tech, snapshots, projects } = await TechService.getTechDetails(awaitedParams.slug);

  if (!tech) {
    notFound();
  }

  // Get latest snapshot data for display
  const latestSnapshot = TechService.getLatestSnapshot(snapshots);
  const score = latestSnapshot?.deaditude_score
    ? calculateDeaditudeScore(latestSnapshot.deaditude_score)
    : 0;

  // Generate structured data for SEO
  const structuredData = latestSnapshot
    ? TechService.generateStructuredData(tech, score, latestSnapshot, config.site.url)
    : null;

  return (
    <PageLayout showBackLink={true}>
      {/* Add structured data */}
      {structuredData && <JsonLd data={structuredData} />}

      {/* Display tech header with score */}
      <TechHeader
        techId={tech.id}
        techName={tech.name}
        score={score}
        latestSnapshot={latestSnapshot}
      />

      <main className="px-8 pb-16 sm:px-20 max-w-7xl mx-auto">
        {latestSnapshot ? (
          <>
            {/* Show metrics data */}
            <TechMetricsSection latestSnapshot={latestSnapshot} />

            {/* Show GitHub pulse data */}
            <GithubSection last_snapshot={latestSnapshot} />

            {/* Show historical data */}
            <TechHistorySection snapshots={snapshots} />
          </>
        ) : (
          <TechNoDataView />
        )}

        {/* Project Gallery Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-24">
          <ProjectGallery techId={tech.id} techName={tech.name} projects={projects} />
        </section>
      </main>
    </PageLayout>
  );
}
