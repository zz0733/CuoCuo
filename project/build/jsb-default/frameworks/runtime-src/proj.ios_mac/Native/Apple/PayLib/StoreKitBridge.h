//
//  StoreKitBridge.h
//  GuanDan
//
//  Created by lizh on 15/10/28.
//
//

#ifndef StoreKitBridge_h
#define StoreKitBridge_h

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include <stdio.h>
#include "StoreKitInterface.h"

class StoreKitBridge : public IOSiAPDelegate
{
public:
    static StoreKitBridge *getInstance();
    
    StoreKitBridge();
    ~StoreKitBridge();
    IOSiAP *iap;
    
    void requestProducts(std::vector <std::string> &productIdentifiers);
    virtual void onRequestProductsFinish(void);
    virtual void onRequestProductsError(int code);
    virtual void onPaymentEvent(std::string &identifier, IOSiAPPaymentEvent event, int quantity, std::string &transaction_id, std::string &receipt);
};

#endif
#endif /* StoreKitBridge_h */
