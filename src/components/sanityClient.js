// src/components/sanityClient.js
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Create client
export const client = sanityClient({
  projectId: '2z2myouw', // replace with your project ID
  dataset: 'production',
  apiVersion: '2025-10-11',
  useCdn: true,
})

// Image URL builder
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
