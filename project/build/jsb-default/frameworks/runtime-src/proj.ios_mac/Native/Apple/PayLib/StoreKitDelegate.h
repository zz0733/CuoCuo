//
//  StoreKitDelegate.h
//  GuanDan
//
//  Created by lizh on 15/11/3.
//
//

#ifndef StoreKitDelegate_h
#define StoreKitDelegate_h

#include "StoreKitInterface.h"
#include <StoreKit/StoreKit.h>

@interface iAPProductsRequestDelegate : NSObject<SKProductsRequestDelegate>
@property (nonatomic, assign) IOSiAP *iosiap;
@end

@interface iAPTransactionObserver : NSObject<SKPaymentTransactionObserver>
@property (nonatomic, assign) IOSiAP *iosiap;
@end

#endif /* StoreKitDelegate_h */
