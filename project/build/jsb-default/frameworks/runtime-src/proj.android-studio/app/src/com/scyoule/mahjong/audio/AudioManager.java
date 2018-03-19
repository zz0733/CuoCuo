package com.scyoule.mahjong.audio;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.cocos2dx.javascript.AppActivity;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Handler;
import android.util.Log;

public class AudioManager {

    private String mFilePath = null;
    private int sampleRate = 0;
    private boolean isRecording = false;
    private boolean isPause = false;
    private Handler handler = null;

    public static final int MSG_REC_STARTED = 1;

    public static final int MSG_REC_STOPPED = 2;

    public static final int MSG_REC_PAUSE = 3;

    public static final int MSG_REC_RESTORE = 4;

    public static final int MSG_ERROR_GET_MIN_BUFFERSIZE = -1;

    public static final int MSG_ERROR_CREATE_FILE = -2;

    public static final int MSG_ERROR_REC_START = -3;

    public static final int MSG_ERROR_AUDIO_RECORD = -4;

    public static final int MSG_ERROR_AUDIO_ENCODE = -5;

    public static final int MSG_ERROR_WRITE_FILE = -6;

    public static final int MSG_ERROR_CLOSE_FILE = -7;

    public AudioManager() {
        this.sampleRate = 8000;
    }

    public void start(final String audioPath) {
        if (isRecording) {
            return;
        }
        new Thread() {
            @Override
            public void run() {
                String fileDir = StorageUtil.getSDPath() + "LameMP3/Voice/";
                File dir = new File(fileDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                mFilePath = audioPath;
                android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_URGENT_AUDIO);
                final int minBufferSize = AudioRecord.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
                if (minBufferSize < 0) {
                    if (handler != null) {
                        handler.sendEmptyMessage(MSG_ERROR_GET_MIN_BUFFERSIZE);
                    }
                    return;
                }
                AudioRecord audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, minBufferSize * 2);

                short[] buffer = new short[sampleRate * (16 / 8) * 1 * 5];
                byte[] mp3buffer = new byte[(int) (7200 + buffer.length * 2 * 1.25)];

                FileOutputStream output = null;
                try {
                    output = new FileOutputStream(new File(mFilePath));
                } catch (FileNotFoundException e) {
                    if (handler != null) {
                        handler.sendEmptyMessage(MSG_ERROR_CREATE_FILE);
                    }
                    return;
                }
                AppActivity.init(sampleRate, 1, sampleRate, 32);
                isRecording = true;
                isPause = false;
                try {
                    try {
                        audioRecord.startRecording();
                    } catch (IllegalStateException e) {
                        if (handler != null) {
                            handler.sendEmptyMessage(MSG_ERROR_REC_START);
                        }
                        return;
                    }

                    try {
                        if (handler != null) {
                            handler.sendEmptyMessage(MSG_REC_STARTED);
                        }

                        int readSize = 0;
                        boolean pause = false;
                        while (isRecording) {
                            if (isPause) {
                                if (!pause) {
                                    handler.sendEmptyMessage(MSG_REC_PAUSE);
                                    pause = true;
                                }
                                continue;
                            }
                            if (pause) {
                                handler.sendEmptyMessage(MSG_REC_RESTORE);
                                pause = false;
                            }
                            /*--End--*/
                            readSize = audioRecord.read(buffer, 0,
                                    minBufferSize);
                            if (readSize < 0) {
                                if (handler != null) {
                                    handler.sendEmptyMessage(MSG_ERROR_AUDIO_RECORD);
                                }
                                break;
                            } else if (readSize == 0) {
                                ;
                            } else {
                                int encResult = AppActivity.encode(buffer,
                                        buffer, readSize, mp3buffer);
                                if (encResult < 0) {
                                    if (handler != null) {
                                        handler.sendEmptyMessage(MSG_ERROR_AUDIO_ENCODE);
                                    }
                                    break;
                                }
                                if (encResult != 0) {
                                    try {
                                        output.write(mp3buffer, 0, encResult);
                                    } catch (IOException e) {
                                        if (handler != null) {
                                            handler.sendEmptyMessage(MSG_ERROR_WRITE_FILE);
                                        }
                                        break;
                                    }
                                }
                            }
							/*--End--*/
                        }
                        int flushResult = AppActivity.flush(mp3buffer);
                        if (flushResult < 0) {
                            if (handler != null) {
                                handler.sendEmptyMessage(MSG_ERROR_AUDIO_ENCODE);
                            }
                        }
                        if (flushResult != 0) {
                            try {
                                output.write(mp3buffer, 0, flushResult);
                            } catch (IOException e) {
                                if (handler != null) {
                                    handler.sendEmptyMessage(MSG_ERROR_WRITE_FILE);
                                }
                            }
                        }
                        try {
                            output.close();
                        } catch (IOException e) {
                            if (handler != null) {
                                handler.sendEmptyMessage(MSG_ERROR_CLOSE_FILE);
                            }
                        }
						/*--End--*/
                    } finally {
                        audioRecord.stop();
                        audioRecord.release();
                    }
                } finally {
                    AppActivity.close();
                    isRecording = false;
                }
                if (handler != null) {
                    handler.sendEmptyMessage(MSG_REC_STOPPED);
                }
            }
        }.start();
    }

    public void stop() {
        isRecording = false;
    }

    public void pause() {
        isPause = true;
    }

    public void restore() {
        isPause = false;
    }

    public boolean isRecording() {
        return isRecording;
    }

    public boolean isPaus() {
        if (!isRecording) {
            return false;
        }
        return isPause;
    }

    public String getFilePath() {
        return mFilePath;
    }

    public void setHandle(Handler handler) {
        this.handler = handler;
    }
}
