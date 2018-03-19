//
//  StoreKitInterface.mm
//  GuanDan
//
//  Created by lizh on 15/10/27.
//
//

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "StoreKitInterface.h"
#include "StoreKitDelegate.h"

void IOSiAP::requestProducts(std::vector <std::string> &productIdentifiers)
{
    NSMutableSet *set = [NSMutableSet setWithCapacity:productIdentifiers.size()];
    std::vector <std::string>::iterator iterator;
    for (iterator = productIdentifiers.begin(); iterator != productIdentifiers.end(); iterator++) {
        [set addObject:[NSString stringWithUTF8String:(*iterator).c_str()]];
    }
    
    SKProductsRequest *productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:set];
    
    iAPProductsRequestDelegate *delegate = [[iAPProductsRequestDelegate alloc] init];
    delegate.iosiap = this;
    productsRequest.delegate = delegate;
    
    [productsRequest start];
}

void IOSiAP::paymentWithProduct(IOSProduct *iosProduct, int quantity)
{
    if (!skTransactionObserver)
    {
        iAPTransactionObserver *Observer = [[iAPTransactionObserver alloc] init];
        Observer.iosiap = this;
        skTransactionObserver = Observer;
        [[SKPaymentQueue defaultQueue] addTransactionObserver:Observer];
    }
    
    SKProduct *skProduct = [(NSArray *)(skProducts) objectAtIndex:iosProduct->index];
    SKMutablePayment *payment = [SKMutablePayment paymentWithProduct:skProduct];
    payment.quantity = quantity;
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}

IOSProduct *IOSiAP::iOSProductByIdentifier(std::string &identifier)
{
    /*std::vector <IOSProduct *>::iterator iterator;
    for (iterator = iOSProducts.begin(); iterator != iOSProducts.end(); iterator++) {
        IOSProduct *iosProduct = *iterator;
        if (iosProduct->productIdentifier == identifier) {
            return iosProduct;
        }
    }*/
    
    return nullptr;
}

#endif
