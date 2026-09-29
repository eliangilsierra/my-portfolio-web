import { Award, Calendar, Code, User } from 'lucide-react';
import { PageHero } from '@/components/content/HeroSection';
import { Reveal } from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/content/useContent';
import type { SkillGroups } from '@/content/types';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useI18n } from '@/i18n/useI18n';

const SKILL_GROUPS: { key: keyof SkillGroups; icon: string }[] = [
  { key: 'frontend', icon: '🎨' },
  { key: 'backend', icon: '⚙️' },
  { key: 'devops', icon: '🚀' },
  { key: 'dataAi', icon: '🤖' },
];

const AboutPage = () => {
  const { t } = useI18n();
  const { tagline, bio, skills, certifications, timeline } = useContent().getAbout();

  useDocumentMeta(t.meta.about);

  return (
    <>
      <PageHero icon={User} badge={t.about.badge} title={t.about.title} description={tagline} />

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal inView className="glass mb-12 rounded-2xl p-8">
              <p className="text-lg leading-relaxed text-foreground/90">{bio}</p>
            </Reveal>

            <Reveal inView delay={0.1} className="mb-12">
              <div className="mb-6 flex items-center gap-2">
                <Code className="h-6 w-6 text-brand" aria-hidden="true" />
                <h2 className="font-heading text-3xl font-bold">{t.about.skills}</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {SKILL_GROUPS.map(({ key, icon }) => (
                  <div key={key} className="glass rounded-xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
                      <span className="text-2xl" aria-hidden="true">
                        {icon}
                      </span>
                      {t.about.skillGroups[key]}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {skills[key].map((skill) => (
                        <li key={skill}>
                          <Badge variant="secondary" className="font-mono">
                            {skill}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal inView delay={0.2} className="mb-12">
              <div className="mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-accent" aria-hidden="true" />
                <h2 className="font-heading text-3xl font-bold">{t.about.certifications}</h2>
              </div>

              <ul className="glass space-y-3 rounded-xl p-6">
                {certifications.map((certification) => (
                  <li key={certification} className="flex items-start gap-3">
                    <span className="mt-1 text-accent" aria-hidden="true">
                      ✓
                    </span>
                    <span className="text-foreground/90">{certification}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal inView delay={0.3}>
              <div className="mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-brand" aria-hidden="true" />
                <h2 className="font-heading text-3xl font-bold">{t.about.timeline}</h2>
              </div>

              <ol className="glass space-y-6 rounded-xl p-6">
                {timeline.map((item, index) => (
                  <li key={`${item.year}-${item.event}`} className="flex gap-4">
                    <div className="flex flex-col items-center" aria-hidden="true">
                      <div className="h-3 w-3 rounded-full bg-brand" />
                      {index < timeline.length - 1 && (
                        <div className="mt-2 w-0.5 flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="mb-1 font-mono text-sm text-brand">{item.year}</div>
                      <div className="text-foreground/90">{item.event}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
