package com.scyoule.mahjong.wxapi;

import org.cocos2dx.javascript.AppActivity;

import com.scyoule.mahjong.R;
import com.scyoule.mahjong.tools.ToastShow;
import com.scyoule.mahjong.wechat.Constants;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {
	private IWXAPI api;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
//		setContentView(R.layout.pay_result);
		api = WXAPIFactory.createWXAPI(this, Constants.APP_ID);
		api.handleIntent(getIntent(), this);
	}

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		setIntent(intent);
		api.handleIntent(intent, this);
	}

	@Override
	public void onReq(BaseReq req) {
	}

	@Override
	public void onResp(BaseResp resp) {
		if (resp.errCode == 0) {
			ToastShow.shortToast("微信支付成功");
			AppActivity.WxPayResult(true);
		} else {
			ToastShow.shortToast("微信支付失败");
			AppActivity.WxPayResult(false);
		}
		finish();
	}
}
