const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const OPTIMIZED_DIR = path.join(__dirname, '../public/images/optimized');

// Image size configurations for different use cases
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 1080 }
};

// Quality settings for different formats
const QUALITY_SETTINGS = {
  webp: 80,
  avif: 70,
  jpeg: 85,
  png: 90
};

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Function to get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to optimize a single image with multiple sizes and formats
async function optimizeImage(inputPath, outputDir, baseFilename) {
  try {
    const originalSize = getFileSizeKB(inputPath);
    console.log(`\nOptimizing: ${baseFilename} (${originalSize}KB)`);
    
    const results = [];
    
    // Generate optimized versions for each size
    for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
      const sizeDir = path.join(outputDir, sizeName);
      ensureDirectoryExists(sizeDir);
      
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Skip if original is smaller than target size
      if (metadata.width <= dimensions.width && metadata.height <= dimensions.height && sizeName !== 'thumbnail') {
        continue;
      }
      
      // Generate WebP version (primary)
      const webpPath = path.join(sizeDir, `${baseFilename}.webp`);
      await image
        .resize(dimensions.width, dimensions.height, { 
          fit: 'inside', 
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .webp({ quality: QUALITY_SETTINGS.webp })
        .toFile(webpPath);
      
      // Generate AVIF version (most efficient)
      const avifPath = path.join(sizeDir, `${baseFilename}.avif`);
      try {
        await image
          .resize(dimensions.width, dimensions.height, { 
            fit: 'inside', 
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .avif({ quality: QUALITY_SETTINGS.avif })
          .toFile(avifPath);
      } catch (avifError) {
        console.log(`   AVIF not supported for ${sizeName}, skipping...`);
      }
      
      // Generate fallback PNG/JPEG
      const isTransparent = metadata.channels === 4;
      const fallbackPath = path.join(sizeDir, `${baseFilename}.${isTransparent ? 'png' : 'jpg'}`);
      
      if (isTransparent) {
        await image
          .resize(dimensions.width, dimensions.height, { 
            fit: 'inside', 
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png({ quality: QUALITY_SETTINGS.png, compressionLevel: 9 })
          .toFile(fallbackPath);
      } else {
        await image
          .resize(dimensions.width, dimensions.height, { 
            fit: 'inside', 
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255 }
          })
          .jpeg({ quality: QUALITY_SETTINGS.jpeg })
          .toFile(fallbackPath);
      }
      
      const webpSize = getFileSizeKB(webpPath);
      const fallbackSize = getFileSizeKB(fallbackPath);
      
      results.push({
        size: sizeName,
        webp: { path: webpPath, size: webpSize },
        fallback: { path: fallbackPath, size: fallbackSize }
      });
      
      console.log(`   ${sizeName}: WebP ${webpSize}KB, Fallback ${fallbackSize}KB`);
    }
    
    // Calculate total savings
    const totalOptimizedSize = results.reduce((sum, result) => 
      sum + parseFloat(result.webp.size), 0
    );
    const savings = ((originalSize - totalOptimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ Total savings: ${savings}%`);
    return results;
    
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return [];
  }
}

// Function to generate image manifest for fast lookups
function generateImageManifest(optimizedImages) {
  const manifest = {};
  
  optimizedImages.forEach(({ originalPath, results }) => {
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, originalPath);
    const pathKey = relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
    
    manifest[pathKey] = {};
    results.forEach(result => {
      manifest[pathKey][result.size] = {
        webp: `/images/optimized/${result.size}/${path.basename(result.webp.path)}`,
        fallback: `/images/optimized/${result.size}/${path.basename(result.fallback.path)}`,
        webpSize: result.webp.size,
        fallbackSize: result.fallback.size
      };
    });
  });
  
  const manifestPath = path.join(OPTIMIZED_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Image manifest generated: ${manifestPath}`);
  
  return manifest;
}

// Function to find and optimize product images
async function optimizeProductImages() {
  console.log('🔍 Scanning for product images...\n');
  
  const findImageFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findImageFiles(filePath, fileList);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        const sizeInKB = stat.size / 1024;
        
        // Target all product images, prioritize larger ones
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          fileList.push({
            path: filePath,
            size: sizeInKB,
            ext: ext,
            isLarge: sizeInKB > 100 // Prioritize files larger than 100KB
          });
        }
      }
    });
    
    return fileList;
  };
  
  const imageFiles = findImageFiles(PUBLIC_IMAGES_DIR);
  
  // Prioritize large files and product images
  const prioritizedFiles = imageFiles
    .filter(file => {
      const isProductImage = file.path.includes('ACCESSORIES') || 
                           file.path.includes('APPAREL') || 
                           file.path.includes('gear');
      return isProductImage || file.isLarge;
    })
    .sort((a, b) => b.size - a.size);
  
  console.log(`Found ${prioritizedFiles.length} product images to optimize:\n`);
  
  const optimizedImages = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of prioritizedFiles) {
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, file.path);
    const outputDir = path.join(OPTIMIZED_DIR, path.dirname(relativePath));
    const baseFilename = path.basename(file.path, path.extname(file.path));
    
    ensureDirectoryExists(outputDir);
    
    totalOriginalSize += file.size;
    
    const results = await optimizeImage(file.path, outputDir, baseFilename);
    
    if (results.length > 0) {
      optimizedImages.push({
        originalPath: file.path,
        results: results
      });
      
      totalOptimizedSize += results.reduce((sum, result) => 
        sum + parseFloat(result.webp.size), 0
      );
    }
  }
  
  // Generate manifest file for fast lookups
  const manifest = generateImageManifest(optimizedImages);
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log('\n📊 Optimization Summary:');
  console.log(`Original size: ${(totalOriginalSize / 1024).toFixed(2)}MB`);
  console.log(`Optimized size: ${(totalOptimizedSize / 1024).toFixed(2)}MB`);
  console.log(`Total savings: ${totalSavings}%`);
  console.log(`Images optimized: ${optimizedImages.length}`);
  
  console.log('\n✅ Image optimization complete!');
  console.log(`📂 Optimized images saved to: ${OPTIMIZED_DIR}`);
  console.log(`📋 Manifest file: ${OPTIMIZED_DIR}/manifest.json`);
  
  console.log('\n💡 Next steps:');
  console.log('1. Use the OptimizedImage component in your React components');
  console.log('2. Import the manifest.json file for fast image lookups');
  console.log('3. Update your product data to reference optimized images');
  console.log('4. Consider implementing service worker caching for images');
  
  return manifest;
}

// Run the optimization
optimizeProductImages().catch(console.error); 