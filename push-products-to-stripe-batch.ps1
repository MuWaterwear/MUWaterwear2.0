# PowerShell script to batch create products in Stripe
# Run with: .\push-products-to-stripe-batch.ps1

$stripeCLI = "./stripe-cli/stripe.exe"
$jsonFile = "stripe-products-sync.json"

# Check if JSON file exists
if (-not (Test-Path $jsonFile)) {
    Write-Host "Error: $jsonFile not found. Run sync script first." -ForegroundColor Red
    exit 1
}

# Read the JSON file
$products = Get-Content $jsonFile | ConvertFrom-Json

Write-Host "Creating $($products.Count) products in Stripe..." -ForegroundColor Green
Write-Host "=" * 60

$successCount = 0
$errorCount = 0
$createdProducts = @()

foreach ($product in $products) {
    try {
        Write-Host "Creating: $($product.name) - $($product.price/100)" -ForegroundColor Cyan
        
        # Create product
        $productResult = & $stripeCLI products create --name="$($product.name)" --description="$($product.description)" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            # Extract product ID from result
            $productId = ($productResult | Select-String "id.*prod_").ToString().Split('"')[3]
            
            # Create price for the product
            $priceResult = & $stripeCLI prices create --unit-amount=$($product.price) --currency=usd --product=$productId 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                $priceId = ($priceResult | Select-String "id.*price_").ToString().Split('"')[3]
                
                $createdProducts += @{
                    name = $product.name
                    product_id = $productId
                    price_id = $priceId
                    price = $product.price
                    printify_id = $product.printify_id
                }
                
                Write-Host "Created: $($product.name) (Product: $productId, Price: $priceId)" -ForegroundColor Green
                $successCount++
            } else {
                            Write-Host "Failed to create price for: $($product.name)" -ForegroundColor Red
            Write-Host "   Error: $priceResult" -ForegroundColor Red
                $errorCount++
            }
        } else {
                    Write-Host "Failed to create product: $($product.name)" -ForegroundColor Red
        Write-Host "   Error: $productResult" -ForegroundColor Red
            $errorCount++
        }
        
        # Small delay to avoid rate limiting
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Host "Exception creating $($product.name): $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

# Save the created products to a file
$createdProducts | ConvertTo-Json -Depth 3 | Out-File "stripe-created-products.json"

Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "=" * 60
Write-Host "Successfully created: $successCount products" -ForegroundColor Green
Write-Host "Failed: $errorCount products" -ForegroundColor Red
Write-Host "Results saved to: stripe-created-products.json" -ForegroundColor Cyan

if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Review stripe-created-products.json for product/price IDs"
    Write-Host "2. Update your webhook to use these Stripe product IDs"
    Write-Host "3. Test the checkout process with the new products"
}

Write-Host ""
Write-Host "Batch creation completed!" -ForegroundColor Green 