import { MapPin, Phone, Clock } from "lucide-react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { branches as defaultBranches } from "../data/branches";
import { useAdminData } from "../admin/context/AdminDataContext";

export default function Branches() {
  const { branches: adminBranches } = useAdminData();

  const branchesList = (adminBranches && adminBranches.length > 0
    ? adminBranches.filter((b) => b.active !== false)
    : defaultBranches
  ).map((b) => ({
    ...b,
    city: b.city || b.name || "Studio Branch",
    tag: b.tag || b.name || "Studio",
    desc: b.desc || b.description || b.address || "",
    address: b.address || "",
    phone: b.phone || "+91 93457 06609",
    hours: b.hours || "Mon – Sun, 08:00 AM – 09:00 PM",
    image: b.image || "/images/gallery/branches/kalladaikurichi.jpg",
  }));
  return (
    <>
      <Seo
        title="Branches"
        description="Visit SUBASH STUDIO across Chennai, Coimbatore and Madurai."
      />

      {/* =========================
          PAGE HEADER
      ========================== */}
      <section className="pt-40 pb-20 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Find Us"
          title="Three studios, one door always open."
          desc="Walk in for a consultation, an album preview, or simply to see the space where your photographs will be made."
        />
      </section>

      {/* =========================
          BRANCHES
      ========================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-28 space-y-10">
        {branchesList.map((b, i) => (
          <Reveal key={b.city} delay={i * 0.08}>
            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-0
                rounded-md
                overflow-hidden
                shadow-card
                border
                border-line/60
                bg-card
              "
            >

              {/* =========================
                  BRANCH IMAGE
              ========================== */}
              <div
                className={`
                  aspect-[4/3]
                  lg:aspect-auto
                  ${i % 2 === 1 ? "lg:order-2" : ""}
                `}
              >
                <img
                  src={b.image}
                  alt={`SUBASH STUDIO ${b.city} branch`}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    hover:scale-105
                  "
                />
              </div>

              {/* =========================
                  BRANCH DETAILS
              ========================== */}
              <div className="p-9 md:p-12 flex flex-col justify-center">

                <p className="eyebrow mb-3">
                  {b.tag}
                </p>

                <h3 className="font-display text-3xl text-ink mb-4">
                  {b.city}
                </h3>

                <p className="text-sm text-ink-soft leading-relaxed mb-7">
                  {b.desc}
                </p>

                {/* Address */}
                <div className="space-y-3 text-sm text-ink">

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="text-gold-dark mt-0.5 shrink-0"
                    />

                    <span>
                      {b.address}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone
                      size={17}
                      className="text-gold-dark shrink-0"
                    />

                    <span>
                      {b.phone}
                    </span>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-center gap-3">
                    <Clock
                      size={17}
                      className="text-gold-dark shrink-0"
                    />

                    <span>
                      {b.hours}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}