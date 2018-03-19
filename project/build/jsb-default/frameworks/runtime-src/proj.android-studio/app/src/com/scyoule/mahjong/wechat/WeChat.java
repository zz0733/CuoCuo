package com.scyoule.mahjong.wechat;

import java.io.File;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.scyoule.mahjong.R;
import com.scyoule.mahjong.tools.PictureCompression;
import com.scyoule.mahjong.tools.ToastShow;
import com.scyoule.mahjong.tools.Util;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;

import org.cocos2dx.javascript.AppActivity;
import org.json.JSONException;
import org.json.JSONObject;

public class WeChat {

	public static void Login(IWXAPI api) {
		Log.d("WeChat", "---* Java Login *---");
		System.out.println(api);
		System.out.println(api.isWXAppInstalled());
		if (!api.isWXAppInstalled()) {
			ToastShow.shortToast("检测到未安装微信!");
		} else {
			SendAuth.Req req = new SendAuth.Req();
			req.scope = "snsapi_userinfo";
			req.state = "scyoule";
			api.sendReq(req);
		}
	}

	public static void ShareFriend(IWXAPI api, Context _instance, String info) {
		Log.d("WeChat", "---* Java WxShareFriend : " + info);
		if (!api.isWXAppInstalled()) {
			ToastShow.shortToast("检测到未安装微信!");
		} else {
			try {
				JSONObject obj = new JSONObject(info.toString());
				WXWebpageObject webpage = new WXWebpageObject();
				webpage.webpageUrl = obj.getString("url");
				WXMediaMessage msg = new WXMediaMessage(webpage);
				msg.title = obj.getString("title");
				msg.description = obj.getString("content");
				Bitmap bmp = BitmapFactory.decodeResource(_instance.getResources(), R.mipmap.wx_share_240);
				Bitmap thumb = Bitmap.createScaledBitmap(bmp, 100, 100, true);
				bmp.recycle();
				msg.thumbData = Util.bmpToByteArray(thumb, true);
				SendMessageToWX.Req req = new SendMessageToWX.Req();
				req.scene = SendMessageToWX.Req.WXSceneSession;
				req.message = msg;
				api.sendReq(req);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

	public static void ShareCircle(IWXAPI api, Context _instance, String info){
		if (!api.isWXAppInstalled()) {
			ToastShow.shortToast("检测到未安装微信!");
		} else {
			String rPath = AppActivity.copyFileToLocal("wx_share_circle.jpg");
			File file = new File(rPath);
			if (!file.exists()) {
				return;
			}
			PictureCompression.compSaveFile(rPath);
			WXImageObject imgObj = new WXImageObject();
			imgObj.setImagePath(rPath);
			WXMediaMessage msg = new WXMediaMessage();
			msg.mediaObject = imgObj;
			Bitmap bmpp = BitmapFactory.decodeFile(rPath);
			Bitmap bmp = PictureCompression.createBitmapThumbnail(bmpp, false);

			Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 142, 80, true);
			bmp.recycle();
			msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
			SendMessageToWX.Req req = new SendMessageToWX.Req();
			req.transaction = ("img" == null) ? String.valueOf(System.currentTimeMillis()) : "img" + System.currentTimeMillis();
			req.message = msg;
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
			api.sendReq(req);
		}
	}

	public static void ShareScreen(IWXAPI api) {
		if (!api.isWXAppInstalled()) {
			ToastShow.shortToast("检测到未安装微信!");
		} else {
			String rPath = AppActivity.copyFileToLocal("ScreenShoot.jpg");
			File file = new File(rPath);
			if (!file.exists()) {
				return;
			}
			PictureCompression.compSaveFile(rPath);
			WXImageObject imgObj = new WXImageObject();
			imgObj.setImagePath(rPath);
			WXMediaMessage msg = new WXMediaMessage();
			msg.mediaObject = imgObj;
			Bitmap bmpp = BitmapFactory.decodeFile(rPath);
			Bitmap bmp = PictureCompression.createBitmapThumbnail(bmpp, false);
			Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 142, 80, true);
			bmp.recycle();
			msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
			SendMessageToWX.Req req = new SendMessageToWX.Req();
			req.transaction = ("img" == null) ? String.valueOf(System.currentTimeMillis()) : "img" + System.currentTimeMillis();
			req.message = msg;
			req.scene = SendMessageToWX.Req.WXSceneSession;
			api.sendReq(req);
		}
	}

	public static void Pay(IWXAPI api, String info) {
		Log.d("WeChat", "---* Java Pay : " + info);
		if (api.isWXAppInstalled()) {
			try {
				JSONObject order = new JSONObject(info);
				PayReq req = new PayReq();
				req.appId = order.getString("AppId");
				req.partnerId = order.getString("PartnerId");
				req.prepayId = order.getString("PrepayId");
				req.nonceStr = order.getString("Noncestr");
				req.timeStamp = order.getString("Timestamp");
				req.packageValue = "Sign=WXPay";
				req.sign = order.getString("Sign");
				req.extData = "app data";
				api.sendReq(req);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		} else {
			ToastShow.shortToast("检测到未安装微信!");
		}
	}
}
