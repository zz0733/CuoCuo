package com.scyoule.mahjong.tools;

import org.cocos2dx.lib.Cocos2dxHelper;

import android.app.AlertDialog;
import android.widget.Toast;

public class ToastShow
{

	private ToastShow()
	{
		throw new UnsupportedOperationException("cannot be instantiated");
	}

	public static void shortToast(final String info) {
		Cocos2dxHelper.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(Cocos2dxHelper.getActivity(), info, Toast.LENGTH_SHORT).show();
			}
		});
	}

	public static void longToast(final String info) {
		Cocos2dxHelper.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(Cocos2dxHelper.getActivity(), info, Toast.LENGTH_LONG).show();
			}
		});
	}

	public static void showToast(final String info, final int duration) {
		Cocos2dxHelper.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(Cocos2dxHelper.getActivity(), info, duration).show();
			}
		});
	}

	public static void showAlertDialog(final String title, final String message){
		Cocos2dxHelper.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				AlertDialog alertDialog = new AlertDialog.Builder(Cocos2dxHelper.getActivity()).create();
				alertDialog.setTitle(title);
				alertDialog.setMessage(message);
				alertDialog.show();
			}
		});
	}

}