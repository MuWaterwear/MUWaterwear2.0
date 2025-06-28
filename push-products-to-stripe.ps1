# PowerShell script to push products to Stripe
$stripeCli = "./stripe-cli/stripe.exe"
$productsFile = "stripe-products.json"

# Check if products file exists
if (-not (Test-Path $productsFile)) {
    Write-Host "Products file not found: $productsFile" -ForegroundColor Red
    exit 1
}

# Read products from JSON file
$products = Get-Content $productsFile | ConvertFrom-Json

Write-Host "Starting to push $($products.Count) products to Stripe..." -ForegroundColor Green

foreach ($product in $products) {
    Write-Host "Creating product: $($product.name)" -ForegroundColor Yellow
    
    # Create product
    $productResult = & $stripeCli products create --name="$($product.name)" --description="$($product.description)"
    
    if ($LASTEXITCODE -eq 0) {
        # Extract product ID from the result
        $productId = ($productResult | ConvertFrom-Json).id
        Write-Host "  Product created with ID: $productId" -ForegroundColor Green
        
        # Create price for the product
        Write-Host "  Creating price for product: $($product.name)" -ForegroundColor Yellow
        $priceResult = & $stripeCli prices create --unit-amount=$($product.price) --currency=$($product.currency) --product=$productId
        
        if ($LASTEXITCODE -eq 0) {
            $priceId = ($priceResult | ConvertFrom-Json).id
            Write-Host "  Price created with ID: $priceId" -ForegroundColor Green
        } else {
            Write-Host "  Failed to create price for product: $($product.name)" -ForegroundColor Red
        }
    } else {
        Write-Host "  Failed to create product: $($product.name)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Finished pushing products to Stripe!" -ForegroundColor Green
Write-Host "You can view your products at: https://dashboard.stripe.com/test/products" -ForegroundColor Cyan 