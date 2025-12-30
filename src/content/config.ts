/**
 * Content Collections Configuration
 * Defines schemas for groups and FAQs
 */

import { defineCollection, z } from 'astro:content';

// Member schema
const memberSchema = z.object({
  id: z.string(),
  nameKr: z.string(),
  nameEn: z.string(),
  gender: z.enum(['male', 'female']),
  position: z.array(z.string()).optional(),
  birthYear: z.number().optional(),
  image: z.string().optional()
});

// Group schema
const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameKr: z.string().optional(),
  slug: z.string(),
  fandom: z.string().optional(),
  company: z.string().optional(),
  debutYear: z.number().optional(),
  color: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  members: z.array(memberSchema),
  pageTypes: z.array(z.enum(['name', 'stage-name', 'aesthetic'])),
  badge: z.enum(['HOT', 'NEW']).nullable().optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string())
  })
});

// FAQ schema
const faqSchema = z.object({
  groupId: z.string(),
  questions: z.array(z.object({
    question: z.string(),
    answer: z.string()
  }))
});

// Define collections
const groupsCollection = defineCollection({
  type: 'data',
  schema: groupSchema
});

const faqsCollection = defineCollection({
  type: 'data',
  schema: faqSchema
});

export const collections = {
  groups: groupsCollection,
  faqs: faqsCollection
};


