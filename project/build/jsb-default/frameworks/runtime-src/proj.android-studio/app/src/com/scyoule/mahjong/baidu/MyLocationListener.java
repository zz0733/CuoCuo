package com.scyoule.mahjong.baidu;

import org.cocos2dx.javascript.AppActivity;
import org.json.JSONException;
import org.json.JSONObject;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;

public class MyLocationListener implements BDLocationListener {
	@Override
	public void onReceiveLocation(BDLocation location) {
		if (null != location && location.getLocType() != BDLocation.TypeServerError) {
			JSONObject obj = new JSONObject();
			try {
				obj.put("lat", location.getLongitude());
				obj.put("lng", location.getLatitude());
				obj.put("locdesc", location.getAddrStr());
			} catch (JSONException e) {
				e.printStackTrace();
			}
			AppActivity.reBaiDuLocation(obj.toString());
		}
	}

}
