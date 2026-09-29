import { CapabilityMap } from '@/components/blueprint/CapabilityMap';
import { SectionHeading } from '@/components/blueprint/SectionHeading';
import { Stamp } from '@/components/blueprint/Stamp';
import { PageHero } from '@/components/content/HeroSection';
import { RevealText } from '@/components/motion/RevealText';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { SHEETS } from '@/config/constants';
import { useAbout } from '@/content/hooks';
import { useI18n } from '@/i18n/useI18n';

const pad = (value: number) => String(value).padStart(2, '0');

const AboutPage = () => {
  const { t } = useI18n();
  const { tagline, bio, certifications, timeline } = useAbout();

  return (
    <>
      <PageHero
        sheet={SHEETS.about}
        label={t.about.badge}
        title={t.about.title}
        description={tagline}
      />

      <section aria-labelledby="approach-title" className="sheet pt-24 md:pt-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 id="approach-title" className="annotation text-muted-foreground lg:col-span-2">
            <span className="text-brand">A</span> / {t.about.approach}
          </h2>
          <RevealText className="font-heading text-[clamp(1.6rem,3.3vw,3rem)] leading-[1.18] font-light tracking-[-0.02em] lg:col-span-10">
            {bio}
          </RevealText>
        </div>
      </section>

      <section aria-labelledby="skills-title" className="sheet pt-24 md:pt-36">
        <SectionHeading
          index="B"
          label={t.about.skills}
          title={t.about.skills}
          description={t.about.skillsDescription}
          id="skills-title"
        />
        <CapabilityMap />
      </section>

      <section aria-labelledby="certifications-title" className="sheet pt-24 md:pt-36">
        <SectionHeading
          index="C"
          label={t.about.certifications}
          title={t.about.certifications}
          id="certifications-title"
        />
        <ScrollReveal items="li">
          <ul className="grid gap-px border border-border bg-border md:grid-cols-3">
            {certifications.map((certification, index) => (
              <li
                key={certification}
                className="flex min-h-56 flex-col justify-between gap-10 bg-background p-6 md:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="annotation text-muted-foreground">C.{pad(index + 1)}</span>
                  <Stamp />
                </div>
                <p className="font-heading text-xl leading-snug font-semibold tracking-tight md:text-2xl">
                  {certification}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      <section aria-labelledby="timeline-title" className="sheet pt-24 md:pt-36">
        <SectionHeading
          index="D"
          label={t.about.timeline}
          title={t.about.timeline}
          id="timeline-title"
        />
        <ScrollReveal items="tbody tr">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{t.about.timeline}</caption>
            <thead>
              <tr className="border-y border-border-strong">
                <th
                  scope="col"
                  className="w-20 py-3 pr-4 annotation font-medium text-muted-foreground md:w-32"
                >
                  {t.about.timelineColumns.revision}
                </th>
                <th
                  scope="col"
                  className="w-20 py-3 pr-4 annotation font-medium text-muted-foreground md:w-32"
                >
                  {t.about.timelineColumns.year}
                </th>
                <th scope="col" className="py-3 annotation font-medium text-muted-foreground">
                  {t.about.timelineColumns.change}
                </th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((item, index) => (
                <tr
                  key={`${item.year}-${item.event}`}
                  className="group border-b border-border transition-colors hover:bg-card"
                >
                  <td className="py-5 pr-4 align-baseline annotation text-brand md:py-7">
                    R{pad(timeline.length - index)}
                  </td>
                  <td className="py-5 pr-4 align-baseline font-mono text-sm md:py-7">
                    {item.year}
                  </td>
                  <td className="py-5 align-baseline text-lg leading-snug md:py-7 md:text-xl">
                    {item.event}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollReveal>
      </section>
    </>
  );
};

export { AboutPage };
