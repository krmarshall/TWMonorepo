import fg from 'fast-glob';
import { outputFileSync } from 'fs-extra/esm';

const exportSitemap = () => {
  const siteAddress = 'https://www.totalwarhammerplanner.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  const skillPaths = fg.sync(process.env.CWD + '/output/skills/**/*.json', { onlyFiles: true });
  const techPaths = fg.sync(process.env.CWD + '/output/techs/**/*.json', { onlyFiles: true });

  skillPaths.forEach((path) => {
    const splitArray = path.split('/');
    const lastIndex = splitArray.length - 1;
    const nodeSet = splitArray[lastIndex].replace('.json', '');
    const faction = splitArray[lastIndex - 1];
    const mod = splitArray[lastIndex - 2];

    xml += `<url>
<loc>${siteAddress}/planner/${mod}/${faction}/${nodeSet}</loc>
<changefreq>monthly</changefreq>
</url>`;
  });

  techPaths.forEach((path) => {
    const splitArray = path.split('/');
    const lastIndex = splitArray.length - 1;
    const nodeSet = splitArray[lastIndex].replace('.json', '');
    const mod = splitArray[lastIndex - 1];
    xml += `<url>
<loc>${siteAddress}/tech/${mod}/${nodeSet}</loc>
<changefreq>monthly</changefreq>
</url>`;
  });

  xml += `\n</urlset>\n`;
  outputFileSync('../TWPlanner/frontend/public/sitemap.xml', xml);
};

export default exportSitemap;
