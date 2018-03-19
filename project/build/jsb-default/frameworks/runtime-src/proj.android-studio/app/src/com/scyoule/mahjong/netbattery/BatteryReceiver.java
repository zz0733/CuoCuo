package com.scyoule.mahjong.netbattery;

import java.util.HashMap;
import java.util.Map;
import org.cocos2dx.javascript.AppActivity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.BatteryManager;
import android.os.Message;

public class BatteryReceiver extends BroadcastReceiver {
	Map<String, Object> map;
	private Message message;
	@Override
	public void onReceive(Context context, Intent intent) {
		String action = intent.getAction();
		if (action.equals(Intent.ACTION_BATTERY_CHANGED)) {
			map = new HashMap<String, Object>();
			map.put("level", "" + intent.getIntExtra("level", 0));
			map.put("scale", "" + intent.getIntExtra("scale", 0));

			map.put("status", ""+ intent.getIntExtra("status",BatteryManager.BATTERY_STATUS_UNKNOWN));
			map.put("plugType", "" + intent.getIntExtra("plugged", 0));
			
			if (map!=null) {
				message = new Message();
				message.obj = map;
				AppActivity._batteryHandler.dispatchMessage(message);
			}
		}
	}

}
