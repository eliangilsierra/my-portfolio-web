import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';
import { SectionBadge, type BadgeTone } from './SectionBadge';

const BACKGROUNDS = {
  brand: 'bg-linear-to-br from-brand/10 via-background to-accent/10',
  accent: 'bg-linear-to-br from-accent/10 via-background to-brand/10',
  muted: 'bg-secondary/30',
} as const;

export type HeroTone = keyof typeof BACKGROUNDS;

interface HeroSectionProps {
  tone?: HeroTone;
  /** Tailwind max-width class for the content column. */
  widthClassName?: string;
  children: ReactNode;
}

/** Page header band with a tinted background and an entrance animation. */
export function HeroSection({
  tone = 'brand',
  widthClassName = 'max-w-3xl',
  children,
}: HeroSectionProps) {
  return (
    <section className={cn('relative overflow-hidden py-16', BACKGROUNDS[tone])}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className={widthClassName}>{children}</Reveal>
      </div>
    </section>
  );
}

interface PageHeroProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  tone?: HeroTone;
}

/** Standard hero for list-style pages: badge, h1 and a short description. */
export function PageHero({ icon, badge, title, description, tone = 'brand' }: PageHeroProps) {
  const badgeTone: BadgeTone = tone === 'accent' ? 'accent' : 'brand';

  return (
    <HeroSection tone={tone}>
      <SectionBadge icon={icon} tone={badgeTone} className="mb-6">
        {badge}
      </SectionBadge>
      <h1 className="mb-4 font-heading text-5xl font-bold">{title}</h1>
      <p className="text-xl text-muted-foreground">{description}</p>
    </HeroSection>
  );
}
