import { Lightbulb } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterBar } from '@/components/content/FilterBar';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
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
        icon={Lightbulb}
        badge={t.pills.badge}
        title={t.pills.title}
        description={t.pills.description}
        tone="muted"
      />

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={0.2}>
            <FilterBar
              searchQuery={query}
              onSearchChange={setQuery}
              placeholder={t.pills.searchPlaceholder}
            />
          </Reveal>

          <div className="mt-12">
            {visiblePills.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visiblePills.map((pill, index) => (
                  <PillCard key={pill.slug} pill={pill} index={index} headingLevel={2} />
                ))}
              </div>
            ) : (
              <p role="status" className="py-20 text-center text-xl text-muted-foreground">
                {t.pills.empty}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export { PillsPage };
