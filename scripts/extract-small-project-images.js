// Script to extract all images from small-projects into a flat array
import { baseArtworks } from '../src/data/artworks.js';

const smallProjects = baseArtworks.filter(artwork => artwork.category === 'small-projects');

console.log(`\nFound ${smallProjects.length} small projects`);
console.log('Projects:', smallProjects.map(p => p.title).join(', '));

const allImages = [];

smallProjects.forEach(project => {
  if (project.images && Array.isArray(project.images)) {
    project.images.forEach((img, index) => {
      allImages.push({
        id: `${project.id}-img-${index}`,
        src: img.src,
        thumbnail: img.thumbnail,
        alt: img.alt || `${project.title} - Image ${index + 1}`,
        projectTitle: project.title,
        projectId: project.id
      });
    });
  }
});

console.log(`\nTotal images extracted: ${allImages.length}`);
console.log('\nBreakdown by project:');
smallProjects.forEach(project => {
  const count = project.images?.length || 0;
  console.log(`  ${project.title}: ${count} images`);
});

console.log('\n--- JSON Output ---\n');
console.log(JSON.stringify(allImages, null, 2));
