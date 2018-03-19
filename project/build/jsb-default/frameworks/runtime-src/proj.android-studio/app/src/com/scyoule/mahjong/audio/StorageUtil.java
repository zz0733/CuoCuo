package com.scyoule.mahjong.audio;

import android.os.Environment;
import android.util.Log;

public class StorageUtil {

	private static String TAG = StorageUtil.class.getName();

	public static boolean isStorageAvailable() {
		String sdStatus = Environment.getExternalStorageState();
		if (!sdStatus.equals(Environment.MEDIA_MOUNTED)) {
			Log.v(TAG, "SDCard Not Userful.");
			return false;
		}
		return true;
	}

	public static String getSDPath() {
		if (isStorageAvailable()) {

			return Environment.getExternalStorageDirectory().getAbsolutePath()
					+ "/";
		} else {
			return null;
		}
	}
}
