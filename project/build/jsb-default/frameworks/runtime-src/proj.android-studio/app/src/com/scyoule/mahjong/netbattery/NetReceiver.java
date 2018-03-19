package com.scyoule.mahjong.netbattery;

import org.cocos2dx.javascript.AppActivity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Message;
import android.telephony.PhoneStateListener;
import android.telephony.ServiceState;
import android.telephony.SignalStrength;
import android.telephony.TelephonyManager;

public class NetReceiver extends BroadcastReceiver {
	String packnameString = null;
	private Message message;
	private int netSta = -1;

	@Override
	public void onReceive(Context context, Intent intent) {
		packnameString = context.getPackageName();

		ConnectivityManager connectMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo mobNetInfo = connectMgr.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
		NetworkInfo wifiNetInfo = connectMgr.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
		int status = 0;
		if (!mobNetInfo.isConnected() && !wifiNetInfo.isConnected()) {
			status = 0;
		} else if (mobNetInfo.isConnected()) {
			status = 4;
		} else if (wifiNetInfo.isConnected()) {
			status = 5;
		}
		
		if(status != 5) {
			getPhoneState(context);
		}
		//TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
		if (netSta != status) {
			netSta = status;
			message = new Message();
			message.obj = status;
			AppActivity._netHandler.dispatchMessage(message);
		}
	}

	public static void getPhoneState(Context context) {
		final TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
		PhoneStateListener MyPhoneListener = new PhoneStateListener() {
			@Override
			public void onServiceStateChanged(ServiceState serviceState) {
				super.onServiceStateChanged(serviceState);
			}

			@Override
			public void onSignalStrengthsChanged(SignalStrength signalStrength) {
				String signalinfo = signalStrength.toString();
				String[] parts = signalinfo.split(" ");
				int ltedbm = Integer.parseInt(parts[9]);
				int asu = signalStrength.getGsmSignalStrength();
				int dbm = -113 + 2 * asu;

				if (telephonyManager.getNetworkType() == TelephonyManager.NETWORK_TYPE_LTE) {
				    AppActivity.SetSignal(4);
				} else if (telephonyManager.getNetworkType() == TelephonyManager.NETWORK_TYPE_HSDPA
						|| telephonyManager.getNetworkType() == TelephonyManager.NETWORK_TYPE_HSPA
						|| telephonyManager.getNetworkType() == TelephonyManager.NETWORK_TYPE_HSUPA
						|| telephonyManager.getNetworkType() == TelephonyManager.NETWORK_TYPE_UMTS) {
					if (dbm > -75) {
						AppActivity.SetSignal(4);
					} else if (dbm > -85) {
						AppActivity.SetSignal(3);
					} else if (dbm > -95) {
						AppActivity.SetSignal(2);
					} else if (dbm > -100) {
						AppActivity.SetSignal(1);
					} else {
						AppActivity.SetSignal(0);
					}
				} else {
					if (asu < 0 || asu >= 99) {
						AppActivity.SetSignal(0);
					} else if (asu >= 16) {
						AppActivity.SetSignal(4);
					} else if (asu >= 8) {
						AppActivity.SetSignal(3);
					} else if (asu >= 4) {
						AppActivity.SetSignal(2);
					} else {
						AppActivity.SetSignal(1);
					}
				}
				super.onSignalStrengthsChanged(signalStrength);
			}
		};
		telephonyManager.listen(MyPhoneListener, PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);
	}
}
