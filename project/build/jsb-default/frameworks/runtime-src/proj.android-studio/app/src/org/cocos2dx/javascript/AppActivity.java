/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import org.cocos2dx.javascript.SDKWrapper;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.content.IntentFilter;

import com.baidu.location.BDLocationListener;
import com.scyoule.mahjong.audio.AudioManager;
import com.scyoule.mahjong.audio.RecorderAndPlayUtil;
import com.scyoule.mahjong.baidu.LocationApplication;
import com.scyoule.mahjong.baidu.LocationService;
import com.scyoule.mahjong.baidu.MyLocationListener;
import com.scyoule.mahjong.tools.JsonUtils;
import com.scyoule.mahjong.wechat.Constants;
import com.scyoule.mahjong.wechat.WeChat;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.scyoule.mahjong.netbattery.BatteryReceiver;
import com.scyoule.mahjong.netbattery.NetReceiver;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class AppActivity extends Cocos2dxActivity {
    private static AppActivity _instance;
    private final static String TAG = "AppActivity";

    public static IWXAPI wx_api;
    public static String wx_code = null;
    public static String _wxShareType = null;

    public static Handler _batteryHandler;
    private Map<String, Object> _netBatteryMap;
    private static int _batteryStatus = 0;
    private static int _batteryLevel = 0;
    private BroadcastReceiver _batteryReceiver;
    public static Handler _netHandler;
    private static int _netStatus = 0;
    private NetReceiver _netReceiver;
    private static WifiManager _wifiManager = null;
    private static int _wifiStrength = 0;
    private static int _signal = 0;
    private static boolean _isRegister = false;
    private static boolean _isHandler = false;

    private static Handler _audioHandler = new Handler();
    private static boolean _isRecording = false;
    private static boolean _isLittleTime = false;
    private static boolean _isSendAudio = false;
    private static RecorderAndPlayUtil _audioRecorder = null;
    private static TimerTask _timerTask = null;
    private static Timer _timer = null;
    private static Thread _delayedThread = null;

    private static BDLocationListener _baiduListener = new MyLocationListener();
    private static LocationService _locationService = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW

        SDKWrapper.getInstance().init(this);

        _instance = this;
        wx_api = WXAPIFactory.createWXAPI(this, Constants.APP_ID, false);
        wx_api.registerApp(Constants.APP_ID);

        _locationService = ((LocationApplication) getApplication()).locationService;
        _locationService.registerListener(_baiduListener);

        BatteryHandler();
        NetHandler();
        _wifiManager = (WifiManager)getApplicationContext().getSystemService(WIFI_SERVICE);
        RegisterReceiver();

        AudioHandler();
    }

    @SuppressLint("HandlerLeak")
    private void BatteryHandler(){
        _batteryHandler = new Handler(){
            @Override
            public void handleMessage(Message msg){
                _netBatteryMap = (Map<String, Object>) msg.obj;
                int batteryStatus = -1;
                switch (Integer.parseInt(_netBatteryMap.get("plugType").toString())) {
                    case 2:
                        batteryStatus = 2;
                        break;
                    case 1:
                        batteryStatus = 1;
                        break;
                    case 0:
                        batteryStatus = 0;
                        break;
                    default:
                        break;
                }
                double max = Double.parseDouble(_netBatteryMap.get("scale")+"");
                double min = Double.parseDouble(_netBatteryMap.get("level")+"");
                int batteryLevel = (int)((min/max)*100);
                if(batteryStatus != _batteryStatus || batteryLevel != _batteryLevel){
                    _batteryStatus = batteryStatus;
                    _batteryLevel = batteryLevel;
                    if(_isHandler){
                        JavaToJsOnGLThread("re_battery", null);
                    }
                }
            }
        };
    }
    @SuppressLint("HandlerLeak")
    private void NetHandler(){
        _netHandler = new Handler(){
            @Override
            public void handleMessage(Message msg){
                _netStatus = Integer.parseInt(msg.obj.toString());
                if(_isHandler){
                    JavaToJsOnGLThread("re_net", null);
                }
            }
        };
    }

    public static void JsToJavaOnGLThread (final String index, final String info) {
        _instance.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                switch (index) {
                    case "wx_login":
                        WeChat.Login(wx_api);
                        break;
                    case "wx_share_friend":
                        WeChat.ShareFriend(wx_api, _instance, info);
                        break;
                    case "wx_share_circle":
                        WeChat.ShareCircle(wx_api, _instance, info);
                        break;
                    case "wx_share_screen":
                        WeChat.ShareScreen(wx_api);
                        break;
                    case "wx_pay":
                        WeChat.Pay(wx_api, info);
                        break;
                    case "baidu_getlocation":
                        _locationService.start();
                    default:
                        break;
                }
            }
        });
    }
    public static void JavaToJsOnGLThread (final String index, final String data) {
        _instance.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String str = "";
                switch (index) {
                    case "re_wx_login":
                        try {
                            JSONObject obj = new JSONObject(data);
                            String openid = obj.getString("openid");
                            String token = obj.getString("token");
                            str = "require('JSPhoneWeChat').WxReLogin(\"" + openid + "\", \"" + token + "\");";
                            Cocos2dxJavascriptJavaBridge.evalString(str);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        break;
                    case "re_wx_cancel_login":
                        str = "require('JSPhoneWeChat').WxReLogin(\"" + false + "\", \"" + false + "\");";
                        Cocos2dxJavascriptJavaBridge.evalString(str);
                        break;
                    case "re_wx_share_result":
                        str = "require('JSPhoneWeChat').WxReShareResult(\"" + Boolean.parseBoolean(data) + "\");";
                        Cocos2dxJavascriptJavaBridge.evalString(str);
                        break;
                    case "re_wx_pay_result":
                        str = "require('JSPhoneWeChat').WxRePayResult(\"" + Boolean.parseBoolean(data) + "\");";
                        Cocos2dxJavascriptJavaBridge.evalString(str);
                        break;
                    case "re_battery":
                        str = "require('JSPhoneNetBattery').reBattery(\"" + _batteryStatus + "\", \"" + _batteryLevel + "\");";
                        Cocos2dxJavascriptJavaBridge.evalString(str);
                        break;
                    case "re_net":
                        WifiInfo info = _wifiManager.getConnectionInfo();
                        _wifiStrength = WifiManager.calculateSignalLevel(info.getRssi(), 5);
                        str = "require('JSPhoneNetBattery').reNet(\"" + _netStatus + "\", \"" + _wifiStrength + "\", \"" + _signal + "\");";
                        Cocos2dxJavascriptJavaBridge.evalString(str);
                        break;
                    case "re_baidu_location":
                        try {
                            JSONObject obj = new JSONObject(data);
                            String lng = obj.getString("lng");
                            String lat = obj.getString("lat");
                            String locdesc = obj.getString("locdesc");
                            str = "require('JSPhoneBaiDu').reBaiDuLocation(\"" + lng + "\", \"" + lat + "\", \"" + locdesc + "\");";
                            Cocos2dxJavascriptJavaBridge.evalString(str);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    default:
                        break;
                }
            }
        });
    }

    public static void WxLogin(){
        JsToJavaOnGLThread("wx_login", null);
    }
    public static void WxShareFriend(String info){
        _wxShareType = "friend";
        JsToJavaOnGLThread("wx_share_friend", info);
    }
    public static void WxShareCircle(String info){
        _wxShareType = "circle";
        JsToJavaOnGLThread("wx_share_circle", info);
    }
    public static void WxShareFriendScreen(String filename) {
        _wxShareType = "screen";
        JsToJavaOnGLThread("wx_share_screen", filename);
    }
    public static void WxPay(String info) {
        JsToJavaOnGLThread("wx_pay", info);
    }
    public static void LoadWXUserInfo() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                String urlStart = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=";
                String urlEnd = "&grant_type=authorization_code";
                String url = urlStart + Constants.APP_ID + "&secret="+ Constants.APP_SECRET+ "&code=" + wx_code + urlEnd;
                Log.d("WeChat", "---* accessTokenUrl: " + url);
                try {
                    JSONObject tokenResult = JsonUtils.initSSLWithHttpClinet(url);
                    System.out.println("-----1 tokenResult : " + tokenResult);
                    if (null != tokenResult) {
                        String openid = tokenResult.getString("openid").toString().trim();
                        String token = tokenResult.getString("access_token").toString().trim();
                        System.out.println("----- wx_openid : " + openid);
                        System.out.println("----- wx_token  : " + token );
                        JSONObject obj = new JSONObject();
                        obj.put("openid", openid);
                        obj.put("token", token);
                        JavaToJsOnGLThread("re_wx_login", obj.toString());
                    }
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
        }).start();
    }
    public static void WxCancelLogin(){
        Log.d(TAG, "---* Java WxCancelLogin *---");
        JavaToJsOnGLThread("re_wx_cancel_login", null);
    }
    public static void WxShareResult(Boolean result){
        _wxShareType = null;
        JavaToJsOnGLThread("re_wx_share_result", result.toString());
    }
    public static void WxPayResult(Boolean result){
        JavaToJsOnGLThread("re_wx_pay_result", result.toString());
    }

    private void RegisterReceiver(){
        _isRegister = true;
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_BATTERY_CHANGED);
        _batteryReceiver = new BatteryReceiver();
        this.registerReceiver(_batteryReceiver, filter);

        IntentFilter wifiFilter = new IntentFilter();
        wifiFilter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);
        wifiFilter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
        wifiFilter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
        _netReceiver = new NetReceiver();
        this.registerReceiver(_netReceiver, wifiFilter);
    }
    public static void getNetBatteryStatus(){
        _isHandler = true;
        JavaToJsOnGLThread("re_battery", null);
        JavaToJsOnGLThread("re_net", null);
    }
    public static void SetSignal(int signal){
        if(_signal != signal && _isHandler){
            _signal = signal;
            JavaToJsOnGLThread("re_net", null);
        }
    }

    public static void getBaiDuLocation(){
        JsToJavaOnGLThread("baidu_getlocation", null);
    }
    public static void reBaiDuLocation(String loc){
        _locationService.stop();
        JavaToJsOnGLThread("re_baidu_location", loc);
    }

    public static String copyFileToLocal(String file) {
        boolean sdExist = Environment.getExternalStorageState().equals(android.os.Environment.MEDIA_MOUNTED);
        if (sdExist) {
            String pathString = Environment.getExternalStorageDirectory() + "/";
            File f1 = new File(pathString);
            if (!f1.exists()) {
                f1.mkdirs();
            }
            String path = pathString + file;
            File[] files = getContext().getFilesDir().listFiles();
            for (int i = 0; i < files.length; i++) {
                // files[i].delete();
                if (files[i].getName().equals(file)) {
                    File sharefileRoot = getContext().getFilesDir().getAbsoluteFile();
                    try {
                        InputStream is = new FileInputStream(sharefileRoot + "/" + file);
                        FileOutputStream os = new FileOutputStream(path);
                        byte[] buffer = new byte[1024];
                        int count = 0;
                        while ((count = is.read(buffer)) > 0) {
                            os.write(buffer, 0, count);
                        }
                        is.close();
                        os.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return path;
                }
            }
        }
        return "";
    }

    @SuppressLint("HandlerLeak")
    private void AudioHandler(){
        _audioRecorder = new RecorderAndPlayUtil();
        _audioRecorder.getRecorder().setHandle(new Handler() {
            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case AudioManager.MSG_REC_STARTED:
                        break;
                    case AudioManager.MSG_REC_STOPPED:
                        if (_isSendAudio) {
                            _isSendAudio = false;
                            if (_isLittleTime) {
                                if (_audioRecorder.getRecorderPath() != null) {
                                    File file = new File(_audioRecorder
                                            .getRecorderPath());
                                    file.delete();
                                }
                                return;
                            }
                        }
                        break;
                    case AudioManager.MSG_ERROR_GET_MIN_BUFFERSIZE:
                        initRecording();
                        break;
                    case AudioManager.MSG_ERROR_CREATE_FILE:
                        initRecording();
                        break;
                    case AudioManager.MSG_ERROR_REC_START:
                        initRecording();
                        break;
                    case AudioManager.MSG_ERROR_AUDIO_RECORD:
                        initRecording();
                        break;
                    case AudioManager.MSG_ERROR_AUDIO_ENCODE:
                        initRecording();
                        break;
                    case AudioManager.MSG_ERROR_WRITE_FILE:
                        initRecording();
                        break;
                    case AudioManager.MSG_ERROR_CLOSE_FILE:
                        initRecording();
                        break;
                }
            }
        });
    }
    private void initRecording(){
        _timer.cancel();
        _timerTask.cancel();
        _audioRecorder.stopRecording();
        _isRecording = false;
    }
    public static void startAudio(String path){
        PackageManager pm = _instance.getPackageManager();
        boolean permission = (PackageManager.PERMISSION_GRANTED == pm.checkPermission("android.permission.RECORD_AUDIO","com.scyoule.mahjong"));
        if (permission) {
            if (_delayedThread == null) {
                _delayedThread = new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        } finally {
                            _delayedThread = null;
                        }
                    }
                });
                _delayedThread.start();
            } else {
                return;
            }
            _isRecording = true;
            _isLittleTime = true;
            _timerTask = new TimerTask() {
                int i = 30;
                @Override
                public void run() {
                    _isLittleTime = false;
                    i--;
                    _audioHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            if (i < 11 && i != 0 && (i % 2 == 0)) {
                            }
                        }
                    });
                    if (i == 0) {
                        _isSendAudio = true;
                        _audioHandler.post(new Runnable() {
                            @Override
                            public void run() {
                            }
                        });
                    }
                    if (i < 0) {
                    }
                }
            };
            _audioRecorder.startRecording(path + ".mp3");
            _timer = new Timer(true);
            _timer.schedule(_timerTask, 1000, 1000);
        } else {
            return;
        }
    }
    public static void stopAudio(){
        _audioRecorder.stopRecording();
    }
    public static void playAudio(String path){
        _audioRecorder.startPlaying(path+".mp3");
    }

    public static void init(int inSamplerate, int outChannel, int outSamplerate, int outBitrate) {
        init(inSamplerate, outChannel, outSamplerate, outBitrate, 7);
    }
    public native static void init(int inSamplerate, int outChannel, int outSamplerate, int outBitrate, int quality);
    public native static int encode(short[] buffer_l, short[] buffer_r, int samples, byte[] mp3buf);
    public native static int flush(byte[] mp3buf);
    public native static void close();
    /*------------------------------------------------------------------*/
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        Log.i(TAG, "---* Java 执行了 onResume *---");
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        Log.i(TAG, "---* Java 执行了 onPause *---");
        super.onPause();
        SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        Log.i(TAG, "---* Java 执行了 onDestroy *---");
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
        if (_isRegister) {
            this.unregisterReceiver(_batteryReceiver);
            this.unregisterReceiver(_netReceiver);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.i(TAG, "---* Java 执行了 onActivityResult *---");
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        Log.i(TAG, "---* Java 执行了 onNewIntent *---");
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        Log.i(TAG, "---* Java 执行了 onRestart *---");
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        Log.i(TAG, "---* Java 执行了 onStop *---");
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        Log.i(TAG, "---* Java 执行了 onBackPressed *---");
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        Log.i(TAG, "---* Java 执行了 onConfigurationChanged *---");
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        Log.i(TAG, "---* Java 执行了 onRestoreInstanceState *---");
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        Log.i(TAG, "---* Java 执行了 onSaveInstanceState *---");
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        Log.i(TAG, "---* Java 执行了 onStart *---");
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }
}
