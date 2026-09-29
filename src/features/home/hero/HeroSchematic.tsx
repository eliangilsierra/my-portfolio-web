import type { CSSProperties } from 'react';
import type { SkillGroups } from '@/domain/about';
import { useI18n } from '@/i18n/useI18n';

/*
 * Geometry of the drawing, in viewBox units (560 x 330). Three layers form the request path
 * (frontend -> backend -> data & AI); DevOps is the delivery bus every layer drops onto.
 */
const NODE = { y: 44, width: 150, height: 96 } as const;
const NODE_X = [10, 205, 400] as const;
const BUS = { x: 10, y: 236, width: 540, height: 64 } as const;
const FLOW_Y = NODE.y + NODE.height / 2;
const PATH_LAYERS = ['frontend', 'backend', 'dataAi'] as const;

const box = (x: number, y: number, width: number, height: number) =>
  `M${x} ${y}h${width}v${height}h${-width}Z`;

const delay = (name: string, seconds: number) => ({ [name]: `${seconds}s` }) as CSSProperties;

interface HeroSchematicProps {
  skills: SkillGroups;
  className?: string;
}

/**
 * The system the portfolio is about, drawn as a schematic from the real skill groups. It draws
 * itself on load in CSS (strokes use pathLength="1"), and signal pulses travel along the wires with
 * SMIL, so none of it waits for JavaScript. Decorative: the same skills are listed as text further
 * down the page.
 */
export function HeroSchematic({ skills, className }: HeroSchematicProps) {
  const { t } = useI18n();

  const flows = NODE_X.slice(0, -1).map(
    (x) => `M${x + NODE.width} ${FLOW_Y}H${x + NODE.width + 45}`,
  );
  const drops = NODE_X.map((x) => `M${x + NODE.width / 2} ${NODE.y + NODE.height}V${BUS.y}`);

  return (
    <svg
      viewBox="0 0 560 330"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      strokeLinecap="square"
    >
      {/* Dimension line across the whole system. */}
      <g className="fade-on-load stroke-muted-foreground/60" style={delay('--fade-delay', 0.2)}>
        <path d="M10 14H550M10 9v10M550 9v10" strokeWidth="1" />
      </g>

      {PATH_LAYERS.map((layer, index) => {
        const x = NODE_X[index] ?? 0;
        // One tool per line keeps every label inside its box, whatever the tool names are.
        const tools = skills[layer].slice(0, 3);
        return (
          <g key={layer}>
            <rect
              x={x}
              y={NODE.y}
              width={NODE.width}
              height={NODE.height}
              className="fade-on-load fill-card"
              style={delay('--fade-delay', 0.5 + index * 0.18)}
            />
            <path
              d={box(x, NODE.y, NODE.width, NODE.height)}
              pathLength={1}
              strokeWidth="1.25"
              className="draw-on-load stroke-border-strong"
              style={delay('--draw-delay', 0.3 + index * 0.18)}
            />
            <rect x={x - 3} y={NODE.y - 3} width="6" height="6" className="fill-brand" />
            <g className="fade-on-load" style={delay('--fade-delay', 0.9 + index * 0.18)}>
              <text
                x={x + 14}
                y={NODE.y + 26}
                className="fill-foreground font-mono text-[11px] font-semibold tracking-[0.12em] uppercase"
              >
                {t.about.skillGroups[layer]}
              </text>
              {tools.map((tool, toolIndex) => (
                <text
                  key={tool}
                  x={x + 14}
                  y={NODE.y + 48 + toolIndex * 15}
                  className="fill-muted-foreground font-mono text-[9.5px]"
                >
                  {tool}
                </text>
              ))}
            </g>
          </g>
        );
      })}

      {/* Request path between layers, with arrowheads. */}
      {flows.map((d, index) => (
        <g key={d}>
          <path
            d={d}
            pathLength={1}
            strokeWidth="1.5"
            className="draw-on-load stroke-brand"
            style={delay('--draw-delay', 1.1 + index * 0.2)}
          />
          <path
            d={`M${(NODE_X[index + 1] ?? 0) - 7} ${FLOW_Y - 4}l7 4l-7 4`}
            strokeWidth="1.5"
            className="fade-on-load stroke-brand"
            style={delay('--fade-delay', 1.5 + index * 0.2)}
          />
        </g>
      ))}

      {/* Every layer ships through the delivery bus. */}
      {drops.map((d, index) => (
        <path
          key={d}
          d={d}
          strokeWidth="1"
          strokeDasharray="3 4"
          className="fade-on-load stroke-muted-foreground"
          style={delay('--fade-delay', 1.4 + index * 0.12)}
        />
      ))}

      <rect
        x={BUS.x}
        y={BUS.y}
        width={BUS.width}
        height={BUS.height}
        className="fade-on-load fill-card"
        style={delay('--fade-delay', 1.3)}
      />
      <path
        d={box(BUS.x, BUS.y, BUS.width, BUS.height)}
        pathLength={1}
        strokeWidth="1.25"
        className="draw-on-load stroke-accent-text"
        style={delay('--draw-delay', 1.2)}
      />
      <g className="fade-on-load" style={delay('--fade-delay', 1.8)}>
        <text
          x={BUS.x + 14}
          y={BUS.y + 25}
          className="fill-accent-text font-mono text-[11px] font-semibold tracking-[0.12em] uppercase"
        >
          {t.about.skillGroups.devops}
        </text>
        <text
          x={BUS.x + 14}
          y={BUS.y + 47}
          className="fill-muted-foreground font-mono text-[9.5px]"
        >
          {skills.devops.slice(0, 5).join(' · ')}
        </text>
      </g>

      {/* Signal pulses: they start once the drawing is complete. Hidden when motion is reduced. */}
      {[...flows, ...drops].map((d, index) => (
        <circle key={`pulse-${d}`} r="2.5" opacity="0" className="signal-pulse fill-accent">
          <set attributeName="opacity" to="1" begin={`${2.2 + index * 0.35}s`} />
          <animateMotion
            path={d}
            dur={index < flows.length ? '1.8s' : '2.4s'}
            begin={`${2.2 + index * 0.35}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
