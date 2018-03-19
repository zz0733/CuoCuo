#include <jni.h>

#ifndef _Included_MP3Recorder
#define _Included_MP3Recorder
#ifdef __cplusplus
extern "C" {
#endif

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_init
  (JNIEnv *, jclass, jint, jint, jint, jint, jint);

JNIEXPORT jint JNICALL Java_org_cocos2dx_javascript_AppActivity_encode
  (JNIEnv *, jclass, jshortArray, jshortArray, jint, jbyteArray);

JNIEXPORT jint JNICALL Java_org_cocos2dx_javascript_AppActivity_flush
  (JNIEnv *, jclass, jbyteArray);

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_close
  (JNIEnv *, jclass);

#ifdef __cplusplus
}
#endif
#endif
