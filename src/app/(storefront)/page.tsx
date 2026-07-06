import {
  getAboutSettings,
  getFeaturedProducts,
  getHeroSettings,
  getInstagramSettings,
  getNewArrivals,
  getWhyOrgnCards,
} from '@/lib/data';
import { AboutSection } from '@/components/storefront/AboutSection';
import { FeaturedCollection } from '@/components/storefront/FeaturedCollection';
import { Hero } from '@/components/storefront/Hero';
import { InstagramFeed } from '@/components/storefront/InstagramFeed';
import { NewArrivals } from '@/components/storefront/NewArrivals';
import { NewsletterSection } from '@/components/storefront/NewsletterSection';
import { WhyOrgn } from '@/components/storefront/WhyOrgn';

export default async function HomePage() {
  const [hero, featured, newArrivals, whyCards, instagram, about] = await Promise.all([
    getHeroSettings(),
    getFeaturedProducts(),
    getNewArrivals(),
    getWhyOrgnCards(),
    getInstagramSettings(),
    getAboutSettings(),
  ]);

  return (
    <>
      <Hero settings={hero} />
      <FeaturedCollection products={featured} />
      <AboutSection settings={about} />
      <NewArrivals products={newArrivals} />
      <WhyOrgn cards={whyCards} />
      <NewsletterSection />
      <InstagramFeed settings={instagram} />
    </>
  );
}
