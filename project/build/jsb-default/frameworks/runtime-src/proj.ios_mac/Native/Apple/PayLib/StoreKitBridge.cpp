#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "StoreKitBridge.h"
#include "ApplePay.h"

StoreKitBridge*  shareStoreKitBridge = nullptr;

StoreKitBridge* StoreKitBridge::getInstance(){
    if(shareStoreKitBridge == nullptr){
        shareStoreKitBridge = new StoreKitBridge();
    }
    return shareStoreKitBridge;
}

StoreKitBridge::StoreKitBridge()
{
    iap = new IOSiAP();
    iap->skTransactionObserver = nullptr;
    iap->skProducts = nullptr;
    iap->delegate = this;
    iap->iOSProducts = nullptr;
}

StoreKitBridge::~StoreKitBridge()
{
    delete iap;
}

void StoreKitBridge::requestProducts(std::vector <std::string> &productIdentifiers)
{
    CCLOG("----- * productIdentifiers *-----");
    delete iap->iOSProducts;
    iap->iOSProducts = nullptr;
    iap->requestProducts(productIdentifiers);
}

void StoreKitBridge::onRequestProductsFinish(void)
{
    //必须在onRequestProductsFinish后才能去请求iAP产品数据。
    //IOSProduct *product = iap->iOSProductByIdentifier(identifier);
    // 然后可以发起付款请求。
    if (iap->iOSProducts)
    {
        iap->paymentWithProduct(iap->iOSProducts, 1);
    }
    else
    {
        ApplePay::ReApplePayResult(0, "");
    }
}

void StoreKitBridge::onRequestProductsError(int code)
{
    //这里requestProducts出错了，不能进行后面的所有操作。
    ApplePay::ReApplePayResult(1, "");
}

void StoreKitBridge::onPaymentEvent(std::string &identifier, IOSiAPPaymentEvent event, int quantity, std::string &transaction_id, std::string &receipt)
{
    if (event == IOSIAP_PAYMENT_FAILED)
    {
        //购买失败
        ApplePay::ReApplePayResult(2, "");
    }
    else if (event == IOSIAP_PAYMENT_PURCHAED)
    {
        //购买成功，提交app返回的凭证receipt至服务器验证
        ApplePay::ReApplePayResult(3, receipt);
    }
    else if (event == IOSIAP_PAYMENT_REMOVED)
    {
        //用户取消购买
        ApplePay::ReApplePayResult(4, "");
    }
}

#endif
