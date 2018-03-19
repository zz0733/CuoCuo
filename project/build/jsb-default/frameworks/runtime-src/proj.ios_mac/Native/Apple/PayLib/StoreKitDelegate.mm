//
//  StoreKitDelegate.cpp
//  GuanDan
//
//  Created by lizh on 15/11/3.
//
//

#include "StoreKitDelegate.h"

@implementation iAPProductsRequestDelegate
- (void)productsRequest:(SKProductsRequest *)request
     didReceiveResponse:(SKProductsResponse *)response
{
    // release old
    if (_iosiap->skProducts) {
        [(NSArray *)(_iosiap->skProducts) release];
    }
    // record new product
    _iosiap->skProducts = [response.products retain];
    
    for (int index = 0; index < [response.products count]; index++) {        SKProduct *skProduct = [response.products objectAtIndex:index];
        
        // check is valid
        bool isValid = true;
        for (NSString *invalidIdentifier in response.invalidProductIdentifiers) {
            NSLog(@"invalidIdentifier:%@", invalidIdentifier);
            if ([skProduct.productIdentifier isEqualToString:invalidIdentifier]) {
                isValid = false;
                break;
            }
        }
        
        if (!_iosiap->iOSProducts)
        {
            _iosiap->iOSProducts = new IOSProduct;
        }
        
        //_iosiap->iOSProducts->productIdentifier = std::string([skProduct.productIdentifier UTF8String]);
        //_iosiap->iOSProducts->localizedTitle = std::string([skProduct.localizedTitle UTF8String]);
        //_iosiap->iOSProducts->localizedDescription = std::string([skProduct.localizedDescription UTF8String]);
        
        // locale price to string
//        NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
//        [formatter setFormatterBehavior:NSNumberFormatterBehavior10_4];
//        [formatter setNumberStyle:NSNumberFormatterCurrencyStyle];
//        [formatter setLocale:skProduct.priceLocale];
//        NSString *priceStr = [formatter stringFromNumber:skProduct.price];
//        [formatter release];
        //_iosiap->iOSProducts->localizedPrice = std::string([priceStr UTF8String]);
        _iosiap->iOSProducts->index = index;
        _iosiap->iOSProducts->isValid = isValid;
        //_iosiap->iOSProducts.push_back(iosProduct);
    }
}

- (void)requestDidFinish:(SKRequest *)request
{
    _iosiap->delegate->onRequestProductsFinish();
    [request.delegate release];
    [request release];
}

- (void)request:(SKRequest *)request didFailWithError:(NSError *)error
{
    NSLog(@"%@", error);
    _iosiap->delegate->onRequestProductsError((int)[error code]);
}

@end

@implementation iAPTransactionObserver

- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    for (SKPaymentTransaction *transaction in transactions) {
        std::string identifier([transaction.payment.productIdentifier UTF8String]);
        IOSiAPPaymentEvent event;
        
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchasing:
                event = IOSIAP_PAYMENT_PURCHASING;
                return;
            case SKPaymentTransactionStatePurchased:
                event = IOSIAP_PAYMENT_PURCHAED;
                break;
            case SKPaymentTransactionStateFailed:
                event = IOSIAP_PAYMENT_FAILED;
                NSLog(@"==ios payment error:%@", transaction.error);
                break;
            case SKPaymentTransactionStateRestored:
                // NOTE: consumble payment is NOT restorable
                event = IOSIAP_PAYMENT_RESTORED;
                break;
                
            case SKPaymentTransactionStateDeferred:
                event = IOSIAP_PAYMENT_REMOVED;
                break;
                
        }
    
        std::string receipt = "";
        if (transaction.transactionReceipt.base64Encoding.length > 0)
        {
            receipt = [transaction.transactionReceipt.base64Encoding UTF8String];
        }
        
        std::string transaction_id = "";
        if (transaction.transactionIdentifier.length > 0)
        {
            transaction_id = [transaction.transactionIdentifier UTF8String];
        }
        
        _iosiap->delegate->onPaymentEvent(identifier, event, (int)transaction.payment.quantity, transaction_id, receipt);
        
        if (event != IOSIAP_PAYMENT_PURCHASING) {
            [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
        }
    }
}

- (void)paymentQueue:(SKPaymentQueue *)queue removedTransactions:(NSArray *)transactions
{
    for (SKPaymentTransaction *transaction in transactions) {
        std::string identifier([transaction.payment.productIdentifier UTF8String]);
    
        std::string receipt = "";
        if (transaction.transactionReceipt.base64Encoding.length > 0)
        {
            receipt = [transaction.transactionReceipt.base64Encoding UTF8String];
        }
        
        std::string transaction_id = "";
        if (transaction.transactionIdentifier.length > 0)
        {
            transaction_id = [transaction.transactionIdentifier UTF8String];
        }
        
        _iosiap->delegate->onPaymentEvent(identifier, IOSIAP_PAYMENT_REMOVED, (int)transaction.payment.quantity, transaction_id, receipt);
    }
}

@end