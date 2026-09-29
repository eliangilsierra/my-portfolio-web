import { useMemo, useState } from 'react';
import { FilterBar } from '@/components/content/FilterBar';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { SHEETS } from '@/config/constants';
import { usePills } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';
import { PillCard } from './PillCard';
import { filterPills } from './search';

const PillsPage = () => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');

  const pills = usePills().getPills();
  const visiblePills = useMemo(() => filterPills(pills, query), [pills, query]);

  return (
    <>
      <PageHero
        sheet={SHEETS.pills}
        label={t.pills.badge}
        title={t.pills.title}
        description={t.pills.description}
      />

      <section className="sheet pt-12 md:pt-16">
        <Reveal delay={0.5}>
          <FilterBar
            searchQuery={query}
            onSearchChange={setQuery}
            placeholder={t.pills.searchPlaceholder}
          />
        </Reveal>

        <div className="mt-10 md:mt-14">
          {visiblePills.length > 0 ? (
            <ScrollReveal items="article" className="border-t border-border-strong">
              {visiblePills.map((pill) => (
                <PillCard key={pill.slug} pill={pill} headingLevel={2} />
              ))}
            </ScrollReveal>
          ) : (
            <p
              role="status"
              className="border-y border-border py-20 text-center text-lead text-muted-foreground"
            >
              {t.pills.empty}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export { PillsPage };
