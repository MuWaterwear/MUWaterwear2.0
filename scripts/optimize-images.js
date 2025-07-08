const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const OPTIMIZED_DIR = path.join(__dirname, '../public/images/optimized');

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Function to get file size in MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Function to optimize PNG files using Sharp
async function optimizePNG(inputPath, outputPath) {
  try {
    const originalSize = getFileSizeMB(inputPath);
    console.log(`Optimizing PNG: ${path.basename(inputPath)} (${originalSize}MB)`);
    
    // Use Sharp to optimize and convert to WebP
    const webpOutputPath = outputPath.replace('.png', '.webp');
    
    await sharp(inputPath)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ quality: 80 })
      .toFile(webpOutputPath);
    
    // Also create optimized PNG version
    await sharp(inputPath)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath);
    
    const newSize = getFileSizeMB(webpOutputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Optimized: ${path.basename(webpOutputPath)} (${newSize}MB) - ${savings}% smaller`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

// Function to optimize SVG files using Sharp (for basic optimization)
async function optimizeSVG(inputPath, outputPath) {
  try {
    const originalSize = getFileSizeMB(inputPath);
    console.log(`Optimizing SVG: ${path.basename(inputPath)} (${originalSize}MB)`);
    
    // For now, just copy the SVG (Sharp doesn't handle SVG optimization well)
    // In a real scenario, you'd use svgo directly
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    
    // Basic SVG optimization - remove comments and unnecessary whitespace
    const optimizedSvg = svgContent
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Compress whitespace
      .replace(/> </g, '><'); // Remove spaces between tags
    
    fs.writeFileSync(outputPath, optimizedSvg);
    
    const newSize = getFileSizeMB(outputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Optimized SVG: ${path.basename(outputPath)} (${newSize}MB) - ${savings}% smaller`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

// Function to find and optimize large files
async function optimizeLargeFiles() {
  console.log('🔍 Scanning for large image files...\n');
  
  const findLargeFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findLargeFiles(filePath, fileList);
      } else if (stat.isFile()) {
        const sizeInMB = stat.size / (1024 * 1024);
        const ext = path.extname(file).toLowerCase();
        
        // Target files larger than 1MB
        if (sizeInMB > 1 && ['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
          fileList.push({
            path: filePath,
            size: sizeInMB,
            ext: ext
          });
        }
      }
    });
    
    return fileList;
  };
  
  const largeFiles = findLargeFiles(PUBLIC_IMAGES_DIR);
  
  // Sort by size (largest first)
  largeFiles.sort((a, b) => b.size - a.size);
  
  console.log(`Found ${largeFiles.length} files larger than 1MB:\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of largeFiles.slice(0, 20)) { // Process first 20 largest files
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, file.path);
    const outputPath = path.join(OPTIMIZED_DIR, relativePath);
    const outputDir = path.dirname(outputPath);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    totalOriginalSize += file.size;
    
    if (file.ext === '.svg') {
      await optimizeSVG(file.path, outputPath);
    } else {
      await optimizePNG(file.path, outputPath);
    }
    
    // Calculate optimized size
    const webpPath = outputPath.replace('.png', '.webp');
    if (fs.existsSync(webpPath)) {
      const stats = fs.statSync(webpPath);
      totalOptimizedSize += stats.size / (1024 * 1024);
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log('\n📊 Optimization Summary:');
  console.log(`Original size: ${totalOriginalSize.toFixed(2)}MB`);
  console.log(`Optimized size: ${totalOptimizedSize.toFixed(2)}MB`);
  console.log(`Total savings: ${totalSavings}%`);
  
  console.log('\n✅ Image optimization complete!');
  console.log(`📂 Optimized images saved to: ${OPTIMIZED_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('1. Update your components to use the optimized WebP images');
  console.log('2. Consider implementing a fallback to PNG for browsers that don\'t support WebP');
  console.log('3. Update your image imports to use the optimized versions');
}

// Run the optimization
optimizeLargeFiles().catch(console.error); 