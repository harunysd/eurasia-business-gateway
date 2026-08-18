import { setRequestLocale } from 'next-intl/server';
import { SectionHero } from '@/components/SectionHero';
import type { Locale } from '@/i18n/routing';

// TODO: This is placeholder boilerplate. Have real legal text drafted and
// reviewed before going live.

const copy: Record<Locale, { title: string; paragraphs: string[] }> = {
  en: {
    title: 'Terms of Use',
    paragraphs: [
      'These terms govern your use of the Eurasia Business Gateway website. By accessing or using the site, you accept these terms.',
      'The content on this website is provided for general information purposes only. While we aim to keep it accurate and up to date, we make no warranties regarding its completeness or reliability and accept no liability for decisions taken solely on the basis of this content.',
      'You agree not to use this website in any way that is unlawful, that could damage the site, or that interferes with its normal operation. You also agree not to attempt to gain unauthorised access to any part of the site.',
      'All intellectual property in this website — including the name, logo, text and design — is owned by Eurasia Business Gateway and may not be reproduced without prior written permission.',
      'We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.',
    ],
  },
  tr: {
    title: 'Kullanım Şartları',
    paragraphs: [
      'Bu şartlar, Eurasia Business Gateway web sitesinin kullanımınızı düzenler. Siteye erişerek veya kullanarak bu şartları kabul etmiş olursunuz.',
      'Bu web sitesindeki içerik yalnızca genel bilgi amaçlı sunulur. Doğru ve güncel tutmaya çalışsak da, eksiksizliği veya güvenilirliği konusunda hiçbir garanti vermiyoruz ve yalnızca bu içeriğe dayanılarak alınan kararlar için sorumluluk kabul etmiyoruz.',
      'Web sitesini yasadışı, siteye zarar verebilecek veya normal çalışmasını engelleyecek herhangi bir şekilde kullanmamayı kabul edersiniz. Ayrıca sitenin herhangi bir bölümüne yetkisiz erişim sağlamaya çalışmamayı da kabul edersiniz.',
      'Bu web sitesindeki tüm fikri mülkiyet — ad, logo, metin ve tasarım dahil — Eurasia Business Gateway\'e aittir ve önceden yazılı izin alınmadan çoğaltılamaz.',
      'Bu şartları zaman zaman güncelleyebiliriz. Değişiklikler yayınlandıktan sonra web sitesini kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz anlamına gelir.',
    ],
  },
  ru: {
    title: 'Условия использования',
    paragraphs: [
      'Эти условия регулируют использование вами веб-сайта Eurasia Business Gateway. Получая доступ к сайту или используя его, вы принимаете данные условия.',
      'Содержимое этого веб-сайта предоставляется исключительно в целях общей информации. Хотя мы стремимся к его точности и актуальности, мы не даём гарантий относительно его полноты или надёжности и не несём ответственности за решения, принятые исключительно на основе этого содержимого.',
      'Вы соглашаетесь не использовать этот веб-сайт каким-либо незаконным образом, способом, который может повредить сайт, или который мешает его нормальной работе. Вы также соглашаетесь не пытаться получить несанкционированный доступ к любой части сайта.',
      'Вся интеллектуальная собственность на этом веб-сайте — включая название, логотип, текст и дизайн — принадлежит Eurasia Business Gateway и не может воспроизводиться без предварительного письменного разрешения.',
      'Мы можем периодически обновлять эти условия. Продолжение использования веб-сайта после публикации изменений означает принятие обновлённых условий.',
    ],
  },
};

type Params = { locale: Locale };

export default async function TermsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = copy[locale];

  return (
    <>
      <SectionHero
        title={c.title.toUpperCase()}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
      />
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="mb-8 text-3xl font-extrabold uppercase tracking-tight text-navy md:text-4xl">
            {c.title}
          </h1>
          <div className="space-y-6 text-base leading-relaxed text-gray">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
