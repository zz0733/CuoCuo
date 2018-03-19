package com.scyoule.mahjong.audio;

import java.io.IOException;
import android.media.MediaPlayer;

public class RecorderAndPlayUtil {
	public interface onPlayerCompletionListener {
		public void onPlayerCompletion();
	}

	private static onPlayerCompletionListener mPlayerCompletion = new onPlayerCompletionListener() {
		@Override
		public void onPlayerCompletion() {

		}
	};

	public void setOnPlayerCompletionListener(onPlayerCompletionListener l) {
		mPlayerCompletion = l;
	}

	private static MediaPlayer mPlayer = null;
	private static String mPlayingPath = null;
	private static AudioManager mRecorder = null;

	public RecorderAndPlayUtil() {
		mPlayer = new MediaPlayer();
		mRecorder = new AudioManager();
	}

	public static void startRecording(String path) {
		mRecorder.start(path);
	}

	public static void stopRecording() {
		mRecorder.stop();
	}

	public static void startPlaying(String filePath) {
		if (filePath == null) {
			return;
		}
		if (mPlayingPath != null && mPlayingPath.equals(filePath)
				&& mPlayer != null && mPlayer.isPlaying()) {
			stopPlaying();
			mPlayingPath = null;
			return;
		}
		mPlayingPath = filePath;
		stopPlaying();
		mPlayer = new MediaPlayer();
		mPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
			@Override
			public void onCompletion(MediaPlayer mp) {
				mPlayerCompletion.onPlayerCompletion();
			}
		});
		try {
			mPlayer.setDataSource(filePath);
			mPlayer.prepareAsync();
			mPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
				@Override
				public void onPrepared(MediaPlayer mp) {
					// TODO Auto-generated method stub
					mp.start();
				}
			});
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void stopPlaying() {
		if (mPlayer != null) {
			if (mPlayer.isPlaying()) {
				mPlayer.stop();
			}
		}
	}

	public void release() {
		stopRecording();
		if (mPlayer != null) {
			if (mPlayer.isPlaying()) {
				mPlayer.stop();
			}
			mPlayer.release();
		}
	}

	public String getRecorderPath() {
		return mRecorder.getFilePath();
	}

	public AudioManager getRecorder() {
		return mRecorder;
	}
}
