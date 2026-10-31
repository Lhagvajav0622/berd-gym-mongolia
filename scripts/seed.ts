/**
 * Adds the starting packages (from the design) when the packages table is
 * empty. Safe to run on every deploy: it never overwrites admin edits.
 */
import "dotenv/config";
import postgres from "postgres";

const PACKAGES = [
  { name: "1 сар", subtitle: "Чөлөөт бүртгэл", days: 30, price: 300000, old: null, featured: false,
    features: ["Бүх тренажер, төхөөрөмж", "06:00–22:00 нээлттэй", "Хувцас солих өрөө, шүршүүр"] },
  { name: "Багштай анги", subtitle: "Мэргэжлийн дасгалжуулагчтай", days: 30, price: 250000, old: 300000, featured: true,
    features: ["7 хоногт 4–5 удаа бэлтгэл", "Хоолны дэглэм · Cardio · Fitness", "Хувийн төлөвлөгөө"] },
  { name: "3 сарын багц", subtitle: "Урт хугацааны хямдрал", days: 90, price: 480000, old: 600000, featured: false,
    features: ["3 сар тасралтгүй", "Бүх тренажер, цаг", "Сард 160,000₮"] },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[seed] DATABASE_URL not set, skipping");
    return;
  }
  const sql = postgres(url, { max: 1, connect_timeout: 15 });
  const [{ n }] = await sql`select count(*)::int as n from packages`;
  if (n === 0) {
    let i = 0;
    for (const p of PACKAGES) {
      await sql`insert into packages (name, subtitle, duration_days, price_mnt, old_price_mnt, features, featured, sort_order)
        values (${p.name}, ${p.subtitle}, ${p.days}, ${p.price}, ${p.old}, ${sql.json(p.features)}, ${p.featured}, ${i++})`;
    }
    console.log(`[seed] added ${PACKAGES.length} packages`);
  } else {
    console.log("[seed] packages exist, nothing to do");
  }
  await sql.end();
}

main().catch((e) => {
  console.error("[seed] failed:", e);
  process.exit(1);
});
