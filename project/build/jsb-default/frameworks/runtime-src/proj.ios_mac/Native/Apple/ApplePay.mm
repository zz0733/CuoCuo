#include "ApplePay.h"
#include "StoreKitBridge.h"
#import "OCPhoneDevice.h"
#include "cocos2d.h"

void ApplePay::Pay(std::string info)
{
    std::vector <std::string> productIdentifiers;
    const char* Identifier = info.c_str();
    productIdentifiers.push_back(std::string(Identifier));
    StoreKitBridge::getInstance()->requestProducts(productIdentifiers);
}

void ApplePay::ReApplePayResult(int result, std::string receipt)
{
    NSString *nsStr = [NSString stringWithCString:receipt.c_str()
                                         encoding:[NSString defaultCStringEncoding]];
    [OCPhoneDevice ReApplePayResult:result :nsStr];
}
