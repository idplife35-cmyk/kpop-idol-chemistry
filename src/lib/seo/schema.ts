/**
 * Schema.org Generator Utilities
 * Generates structured data for SEO
 */

const SITE_URL = 'https://kpopnamegenerator.com';
const SITE_NAME = 'KPOP Idol Chemistry';

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Organization Schema - Site-wide
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [
      'https://twitter.com/kpopnamegen'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'idplife35@gmail.com',
      contactType: 'customer service'
    }
  };
}

/**
 * WebApplication Schema - For generator pages
 */
export function generateWebAppSchema(options: {
  name: string;
  description: string;
  url: string;
  groupName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: 'Entertainment',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '12500',
      bestRating: '5',
      worstRating: '1'
    },
    ...(options.groupName && {
      about: {
        '@type': 'MusicGroup',
        name: options.groupName
      }
    })
  };
}

/**
 * FAQPage Schema
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
    }))
  };
}

/**
 * ItemList Schema - For listing groups
 */
export function generateItemListSchema(options: {
  name: string;
  description: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options.name,
    description: options.description,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      ...(item.description && { description: item.description })
    }))
  };
}

/**
 * Combined Schema Generator for Group Pages
 */
export function generateGroupPageSchema(options: {
  groupName: string;
  slug: string;
  description: string;
  faqs: FAQItem[];
}) {
  const url = `${SITE_URL}/${options.slug}-name-generator/`;
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebAppSchema({
        name: `${options.groupName} Name Generator`,
        description: options.description,
        url,
        groupName: options.groupName
      }),
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: `${options.groupName} Name Generator`, url: `/${options.slug}-name-generator/` }
      ]),
      generateFAQSchema(options.faqs)
    ]
  };
}

/**
 * Home Page Schema
 */
export function generateHomePageSchema(groups: { name: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebAppSchema({
        name: 'KPOP Name Generator - Create Your K-Pop Idol Name',
        description: 'Generate your K-Pop name and discover your chemistry with BTS, BLACKPINK, NewJeans, and more! Free Korean name generator for K-Pop fans.',
        url: SITE_URL
      }),
      generateItemListSchema({
        name: 'K-Pop Group Name Generators',
        description: 'Choose your favorite K-Pop group to generate your idol name',
        items: groups.map(g => ({
          name: `${g.name} Name Generator`,
          url: `/${g.slug}-name-generator/`,
          description: `Generate your ${g.name} idol name and chemistry score`
        }))
      })
    ]
  };
}


