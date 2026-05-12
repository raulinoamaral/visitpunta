import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://visitpunta.com'
  const payload = await getPayload({ config })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/alojamientos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gastronomia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/recorridos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  // Places
  const { docs: places } = await payload.find({
    collection: 'places',
    limit: 500,
    depth: 0,
  })
  const placePages: MetadataRoute.Sitemap = places.map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Experiences
  const { docs: experiences } = await payload.find({
    collection: 'experiences',
    where: { published: { equals: true } },
    limit: 500,
    depth: 0,
  })
  const experiencePages: MetadataRoute.Sitemap = experiences.map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: new Date(e.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Articles
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { published: { equals: true } },
    limit: 500,
    depth: 0,
  })
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Destinations
  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    limit: 50,
    depth: 0,
  })
  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${baseUrl}/${d.slug}`,
    lastModified: new Date(d.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...destinationPages, ...placePages, ...experiencePages, ...articlePages]
}
