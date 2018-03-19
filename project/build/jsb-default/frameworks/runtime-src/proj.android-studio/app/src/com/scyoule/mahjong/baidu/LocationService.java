package com.scyoule.mahjong.baidu;

import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.location.LocationClientOption.LocationMode;
import android.content.Context;

public class LocationService {
	private LocationClient client = null;
	private LocationClientOption mOption, DIYoption;
	private Object objLock = new Object();

	/***
	 * 
	 * @param locationContext
	 */
	public LocationService(Context locationContext) {
		synchronized (objLock) {
			if (client == null) {
				client = new LocationClient(locationContext);
				client.setLocOption(getDefaultLocationClientOption());
			}
		}
	}

	/***
	 * 
	 * @param listener
	 * @return
	 */
	public boolean registerListener(BDLocationListener listener) {
		boolean isSuccess = false;
		if (listener != null) {
			client.registerLocationListener(listener);
			isSuccess = true;
		}
		return isSuccess;
	}

	public void unregisterListener(BDLocationListener listener) {
		if (listener != null) {
			client.unRegisterLocationListener(listener);
		}
	}

	/***
	 * 
	 * @param option
	 * @return isSuccessSetOption
	 */
	public boolean setLocationOption(LocationClientOption option) {
		boolean isSuccess = false;
		if (option != null) {
			if (client.isStarted())
				client.stop();
			DIYoption = option;
			client.setLocOption(option);
		}
		return isSuccess;
	}

	public LocationClientOption getOption() {
		return DIYoption;
	}

	/***
	 *
	 * @return DefaultLocationClientOption
	 */
	public LocationClientOption getDefaultLocationClientOption() {
		if (mOption == null) {
			mOption = new LocationClientOption();
			mOption.setLocationMode(LocationMode.Hight_Accuracy);
			mOption.setCoorType("bd09ll");
			mOption.setScanSpan(0);
			mOption.setIsNeedAddress(true);
			mOption.setIsNeedLocationDescribe(false);
			mOption.setNeedDeviceDirect(false);
			mOption.setLocationNotify(false);
			mOption.setIgnoreKillProcess(false);
			mOption.setIsNeedLocationDescribe(false);
			mOption.setIsNeedLocationPoiList(false);
			mOption.SetIgnoreCacheException(true);
			mOption.setIsNeedAltitude(false);
		}
		return mOption;
	}

	public void start() {
		synchronized (objLock) {
			if (client != null && !client.isStarted()) {
				client.start();
			}
		}
	}

	public void stop() {
		synchronized (objLock) {
			if (client != null && client.isStarted()) {
				client.stop();
			}
		}
	}

	public boolean requestHotSpotState() {
		return client.requestHotSpotState();
	}
}
