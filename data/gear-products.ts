import gearData from './gear-products.json'

// Filter products by category
export const wetsuits = gearData.filter(product => product.category === 'diving')

// Filter wakeboards first (marine products with wakeboard/wakesurf in name)
export const wakeboards = gearData.filter(product => 
  product.category === 'marine' && 
  (product.name.toLowerCase().includes('wakeboard') || product.name.toLowerCase().includes('wakesurf'))
)

// Filter paddleBoards (marine products that are NOT wakeboards)
export const paddleBoards = gearData.filter(product => 
  product.category === 'marine' && 
  !(product.name.toLowerCase().includes('wakeboard') || product.name.toLowerCase().includes('wakesurf'))
)

export const bags = gearData.filter(product => product.category === 'packs')
export const coolers = gearData.filter(product => product.category === 'storage')

// Export all gear products
export const allGearProducts = gearData
export default gearData 