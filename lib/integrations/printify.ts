interface PrintifyProduct {
  id: string
  title: string
  description: string
  blueprint_id: number
  print_provider_id: number
  variants: PrintifyVariant[]
  print_areas: PrintifyPrintArea[]
}

interface PrintifyVariant {
  id: number
  price: number
  is_enabled: boolean
}

interface PrintifyPrintArea {
  variant_ids: number[]
  placeholders: PrintifyPlaceholder[]
}

interface PrintifyPlaceholder {
  position: string
  images: PrintifyImage[]
}

interface PrintifyImage {
  id: string
  name: string
  type: string
  height: number
  width: number
  x: number
  y: number
  scale: number
  angle: number
}

interface PrintifyOrder {
  external_id: string
  line_items: PrintifyLineItem[]
  shipping_method: number
  address_to: PrintifyAddress
}

interface PrintifyLineItem {
  product_id: string
  variant_id: number
  quantity: number
}

interface PrintifyAddress {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

class PrintifyAPI {
  private baseURL = 'https://api.printify.com/v1'
  private accessToken: string
  private shopId: string

  constructor(accessToken: string, shopId: string) {
    this.accessToken = accessToken
    this.shopId = shopId
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'MyV0App/1.0',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Printify API error: ${response.status} ${error}`)
    }

    return response.json()
  }

  async getShops() {
    return this.request('/shops.json')
  }

  async getProducts(page: number = 1, limit: number = 10) {
    return this.request(`/shops/${this.shopId}/products.json?page=${page}&limit=${limit}`)
  }

  async getAllProducts() {
    let allProducts: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await this.getProducts(page, 10)
      const products = response.data || []
      allProducts.push(...products)

      // If we got less than 10 products, we're done
      hasMore = products.length >= 10
      page++

      if (page > 20) {
        // Safety break to avoid infinite loops
        break
      }
    }

    return { data: allProducts }
  }

  async getProduct(productId: string) {
    return this.request(`/shops/${this.shopId}/products/${productId}.json`)
  }

  async createProduct(productData: Partial<PrintifyProduct>) {
    return this.request(`/shops/${this.shopId}/products.json`, {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(productId: string, productData: Partial<PrintifyProduct>) {
    return this.request(`/shops/${this.shopId}/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async createOrder(orderData: PrintifyOrder) {
    return this.request(`/shops/${this.shopId}/orders.json`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders() {
    return this.request(`/shops/${this.shopId}/orders.json`)
  }

  async getOrder(orderId: string) {
    return this.request(`/shops/${this.shopId}/orders/${orderId}.json`)
  }

  async uploadImage(fileName: string, imageUrl: string) {
    return this.request('/uploads/images.json', {
      method: 'POST',
      body: JSON.stringify({
        file_name: fileName,
        url: imageUrl,
      }),
    })
  }

  async getCatalogBlueprints() {
    return this.request('/catalog/blueprints.json')
  }

  async getPrintProviders(blueprintId: number) {
    return this.request(`/catalog/blueprints/${blueprintId}/print_providers.json`)
  }

  async getVariants(blueprintId: number, printProviderId: number) {
    return this.request(
      `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`
    )
  }
}

export { PrintifyAPI, type PrintifyOrder, type PrintifyLineItem, type PrintifyAddress }
