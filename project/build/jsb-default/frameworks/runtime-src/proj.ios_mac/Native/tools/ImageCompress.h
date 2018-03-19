//
//  WXApiResponseManager.h
//  SDKSample
//
//  Created by Jeason on 15/7/14.
//
//

#import <Foundation/Foundation.h>

@interface ImageCompress : NSObject

-(NSData *)ImageWithImage:(UIImage*)image scaledToSize:(CGSize)newSize;

-(NSData *)zipNSDataWithImage:(UIImage *)sourceImage;

@end
