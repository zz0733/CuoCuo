package com.scyoule.mahjong.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

import com.scyoule.mahjong.tools.ToastShow;
import org.cocos2dx.javascript.AppActivity;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        AppActivity.wx_api.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq req) {
        switch (req.getType()) {
            case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
                break;
            case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
                break;
            default:
                break;
        }
    }

    @Override
    public void onResp(BaseResp resp) {
        if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH) {
            switch (resp.errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    SendAuth.Resp sendResp = (SendAuth.Resp) resp;
                    AppActivity.wx_code = sendResp.code;
                    AppActivity.LoadWXUserInfo();
                    ToastShow.shortToast("登录成功");
                    finish();
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    ToastShow.shortToast("取消登录");
                    AppActivity.WxCancelLogin();
                    break;
                case BaseResp.ErrCode.ERR_AUTH_DENIED:
                    ToastShow.shortToast("认证被否决");
                    AppActivity.WxCancelLogin();
                    break;
                case BaseResp.ErrCode.ERR_UNSUPPORT:
                    ToastShow.shortToast("不支持错误");
                    AppActivity.WxCancelLogin();
                    break;
                default:
                    ToastShow.shortToast("未知原因");
                    AppActivity.WxCancelLogin();
                    break;
            }
        } else if (resp.getType() == ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX) {
            switch (resp.errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    if (AppActivity._wxShareType == "circle") {
                        AppActivity.WxShareResult(true);
                    }
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    ToastShow.shortToast("取消分享");
                    break;
                case BaseResp.ErrCode.ERR_SENT_FAILED:
                    ToastShow.shortToast("发送失败");
                    break;
                default:
                    ToastShow.shortToast("未知原因");
                    break;
            }
        }
        finish();
    }
}
