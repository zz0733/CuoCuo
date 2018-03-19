//
//  WXApiResponseManager.m
//  SDKSample
//
//  Created by Jeason on 15/7/14.
//
//

#import "ImageCompress.h"

@implementation ImageCompress

#pragma mark ImageWithImage 图片缩放
- (NSData *)ImageWithImage:(UIImage*)image scaledToSize:(CGSize)newSize
{
    UIGraphicsBeginImageContext(newSize);
    [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return UIImageJPEGRepresentation(newImage, 0.5);
}
// 调用UIImage *img = [UIImage imageWithData:[self imageWithImage:image scaledToSize:CGSizeMake(300, 300)]]

-(NSData *)zipNSDataWithImage:(UIImage *)sourceImage{
    //进行图像尺寸的压缩
    CGSize imageSize = sourceImage.size;//取出要压缩的image尺寸
    CGFloat width = imageSize.width;    //图片宽度
    CGFloat height = imageSize.height;  //图片高度
    //1.宽高大于1280(宽高比不按照2来算，按照1来算)
    if (width>1280) {
        if (width>height) {
            CGFloat scale = width/height;
            height = 1280;
            width = height*scale;
        }else{
            CGFloat scale = height/width;
            width = 1280;
            height = width*scale;
        }
        //2.高度大于1280
    }else if(height>1280){
        CGFloat scale = height/width;
        width = 1280;
        height = width*scale;
    }else{
    }
    UIGraphicsBeginImageContext(CGSizeMake(width, height));
    [sourceImage drawInRect:CGRectMake(0,0,width,height)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    //进行图像的画面质量压缩
    NSData *data=UIImageJPEGRepresentation(newImage, 1.0);
    if (data.length>100*1024) {
        if (data.length>1024*1024) {//1M以及以上
            data=UIImageJPEGRepresentation(newImage, 0.5); //0.7
        }else if (data.length>512*1024) {//0.5M-1M
            data=UIImageJPEGRepresentation(newImage, 0.6); //0.8
        }else if (data.length>200*1024) {
            //0.25M-0.5M
            data=UIImageJPEGRepresentation(newImage, 0.7); //0.9
        }
    }
    return data;
}

@end
