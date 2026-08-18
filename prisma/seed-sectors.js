/* eslint-disable @typescript-eslint/no-var-requires */
// Seeds the Sector table from the existing static content files
// (/content/{locale}/sectors.json). Run with:
//   DATABASE_URL=file:./dev.db node prisma/seed-sectors.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const locales = ['en', 'tr', 'ru'];

async function main() {
  const contentByLocale = {};
  for (const locale of locales) {
    const file = path.join(process.cwd(), 'content', locale, 'sectors.json');
    contentByLocale[locale] = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  const items = contentByLocale.en.sectors;
  let created = 0;
  let updated = 0;

  for (const [index, item] of items.entries()) {
    const content = {};
    for (const locale of locales) {
      const row = contentByLocale[locale].sectors.find(
        (s) => s.id === item.id,
      );
      content[locale] = {
        title: row ? row.title : item.title,
        description: row ? row.description : item.description,
        longDescription: row ? row.longDescription : item.longDescription,
      };
    }

    const existing = await prisma.sector.findUnique({
      where: { slug: item.id },
    });

    const data = {
      slug: item.id,
      icon: item.icon,
      image: item.image,
      order: index,
      content: JSON.stringify(content),
    };

    if (existing) {
      await prisma.sector.update({ where: { slug: item.id }, data });
      updated += 1;
    } else {
      await prisma.sector.create({ data });
      created += 1;
    }
  }

  console.log(`Seed tamamlandı: ${created} yeni, ${updated} güncellendi.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
