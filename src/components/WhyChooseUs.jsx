import { Camera, Heart, Gem, Users } from "lucide-react";
import Reveal from "./Reveal";

const benefits = [
  {
    icon: Camera,
    title: "Years of Experience",
    description:
      "With 12+ years in the industry, we bring expertise, creativity, and a deep understanding of what makes every moment special.",
  },
  {
    icon: Heart,
    title: "Storytelling Approach",
    description:
      "We don’t just take photos — we capture emotions, relationships, and the little moments that make your story unique.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    description:
      "From photography and cinematography to editing and album creation, every detail receives the same level of care.",
  },
  {
    icon: Users,
    title: "Personalized Experience",
    description:
      "Every client is unique. We tailor our approach to match your vision, ensuring a photography experience that feels personal and meaningful.",
  },
];

import { BotanicalBranch, BotanicalCorner } from "./BotanicalDecoration";

export default function WhyChooseUs() {
  return (
    <section className="relative w-full bg-bg py-24 sm:py-28 lg:py-32 overflow-hidden border-b border-line/60">
      {/* Botanical leaf decorations on left edge and right/top corner */}
      <div className="absolute top-1/4 -left-10 pointer-events-none select-none hidden lg:block">
        <BotanicalBranch className="w-56 h-56" rotate={75} />
      </div>
      <div className="absolute -top-6 -right-6 pointer-events-none select-none hidden md:block">
        <BotanicalCorner className="w-48 h-48" rotate={90} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <header className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 justify-center">
              <span className="h-px w-8 sm:w-12 bg-gold/60" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                className="text-gold shrink-0"
                aria-hidden="true"
              >
                <path d="M7 0 L9 7 L7 14 L5 7 Z" fill="currentColor" />
              </svg>
              <span className="eyebrow text-[12px] sm:text-[13px] tracking-[0.32em] font-semibold text-gold-dark">
                Why Choose Us
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                className="text-gold shrink-0"
                aria-hidden="true"
              >
                <path d="M7 0 L9 7 L7 14 L5 7 Z" fill="currentColor" />
              </svg>
              <span className="h-px w-8 sm:w-12 bg-gold/60" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display font-medium text-[34px] sm:text-[46px] lg:text-[62px] leading-[1.08] tracking-tight text-ink mt-5">
              More Than <span className="text-gold-dark font-normal italic">Photographs</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-ink-soft max-w-2xl mx-auto font-display italic font-light leading-relaxed">
              We preserve emotions, stories, and the moments you’ll treasure forever.
            </p>
          </Reveal>
        </header>

        {/* 4 Benefit Cards in a row */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal
                key={b.title}
                delay={0.15 + i * 0.08}
                className="h-full flex flex-col"
              >
                <div className="bg-white rounded-xl border border-line/80 p-7 sm:p-8 shadow-sm hover:shadow-card hover:border-gold/50 transition-all duration-300 flex flex-col items-center text-center h-full group">
                  {/* Elegant circular icon area */}
                  <div className="w-16 h-16 rounded-full border border-gold/40 bg-bg-soft flex items-center justify-center text-gold-dark mx-auto shadow-sm group-hover:border-gold group-hover:scale-105 group-hover:bg-gold/10 group-hover:text-gold transition-all duration-300 mb-6">
                    <Icon size={26} strokeWidth={1.3} aria-hidden="true" />
                  </div>

                  {/* Benefit title */}
                  <h3 className="font-display text-xl sm:text-[22px] text-ink font-medium tracking-tight mb-3">
                    {b.title}
                  </h3>

                  {/* Short gold decorative divider */}
                  <div className="w-8 h-[1px] bg-gold/50 mx-auto mb-4 transition-all duration-300 group-hover:w-12 group-hover:bg-gold" />

                  {/* Short description */}
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
