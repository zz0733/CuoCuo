#ifndef applepay_h
#define applepay_h

#include "cocos2d.h"
USING_NS_CC;

class ApplePay {

public:
    static void Pay(std::string info);
    static void ReApplePayResult(int result, std::string receipt);
};

#endif //applepay_h
