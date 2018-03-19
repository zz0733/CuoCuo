#import "Audio.h"
#import <AVFoundation/AVFoundation.h>
#import "lame.h"

static NSString * nsspeekPath;
static NSString * nsplayPath;
static NSString * audioFileSavePath;
static NSString * timeStr1;
static NSString * timeStr2;
static NSString * timeStr3;
static NSInteger  transNum;

@interface Audio ()<AVAudioPlayerDelegate, AVAudioRecorderDelegate>

@end

@implementation Audio
{
    NSTimer* timer;
    int recordTime;
    int playTime;
    NSInteger playDuration;
    NSInteger zhuangtai;
    AVAudioRecorder * _audioRecorder;
    AVAudioPlayer * _audioPlayer;
    AVAudioSession * audioSession;
    NSURL * recordUrl;
    NSURL * recordPlayUrl;
    NSURL * recordPlayUrlMp3;
    NSURL * mp3FilePath;
    NSURL * cafFilePath;
}

+ (void)startAudio: (NSString *) path
{
    NSLog(@"---* OC startAudio path : %@", path);
    Audio * startAudio = [Audio new];
    nsspeekPath = [[NSString alloc] initWithString:path];
    startAudio->zhuangtai = 1;
    NSTimeInterval time = [[NSDate date] timeIntervalSince1970];
    long long int date = (long long int)time;
    NSString * timeStr = [NSString stringWithFormat:@"%lld",date];
    timeStr1 = [[NSString alloc] initWithString:timeStr];
    [startAudio NSAudio];
}

+ (void)stopAudio
{
    NSLog(@"---* OC stopAudio *---");
    Audio * stopAudio = [Audio new];
    stopAudio->zhuangtai = 2;
    NSTimeInterval time = [[NSDate date] timeIntervalSince1970];
    long long int date = (long long int)time;
    NSString * timeStr = [NSString stringWithFormat:@"%lld",date];
    timeStr2 = [[NSString alloc] initWithString:timeStr];
    NSNumber *number = [NSNumber numberWithInt:11];
    transNum = [number integerValue];
    [stopAudio NSAudio];
}

+ (void)playAudio: (NSString *) path
{
    NSLog(@"---* OC playAudio path : %@", path);
    Audio * playAudio = [Audio new];
    nsplayPath = [[NSString alloc] initWithString:path];
    playAudio->zhuangtai = 3;
    long long int date = (long long int)time;
    NSString * timeStr = [NSString stringWithFormat:@"%lld",date];
    timeStr3 = [[NSString alloc] initWithString:timeStr];
    [playAudio NSAudio];
}

+ (NSInteger)getVoiceLength
{
    return [timeStr2 integerValue] - [timeStr1 integerValue];
}

- (void)RecordInit
{
    NSMutableDictionary *recordSetting = [[NSMutableDictionary alloc] init];
    [recordSetting setValue:[NSNumber numberWithInt:kAudioFormatLinearPCM] forKey:AVFormatIDKey];
    [recordSetting setValue:[NSNumber numberWithFloat:11025.0] forKey:AVSampleRateKey];
    [recordSetting setValue:[NSNumber numberWithInt:2] forKey:AVNumberOfChannelsKey];
    [recordSetting setValue:[NSNumber numberWithInt:16] forKey:AVLinearPCMBitDepthKey];
    [recordSetting setValue:[NSNumber numberWithInt:AVAudioQualityHigh] forKey:AVEncoderAudioQualityKey];
    recordUrl = [NSURL URLWithString:[nsspeekPath stringByAppendingString:@".caf"]];
    _audioRecorder = [[AVAudioRecorder alloc] initWithURL:recordUrl settings:recordSetting error:nil];
    _audioRecorder.meteringEnabled = YES;
    _audioRecorder.delegate = self;
}

- (void)NSAudio
{
    audioSession = [AVAudioSession sharedInstance];//得到AVAudioSession单例对象
    switch(zhuangtai){
        case 1:
        {
            [self RecordInit];
            if (![_audioRecorder isRecording]) {
                [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];//设置类别,表示该应用同时支持播放和录音
                //[audioSession setActive:NO error:nil];//启动音频会话管理,此时会阻断后台音乐的播放.
                [_audioRecorder prepareToRecord];
                [_audioRecorder peakPowerForChannel:0.0];
                [_audioRecorder record];
                recordTime = 0;
            }
        }
            break;
        case 2:{
            [audioSession setCategory:AVAudioSessionCategorySoloAmbient error:nil];
            [_audioRecorder stop];       //录音停止
            //[audioSession setActive:NO error:nil];//一定要在录音停止以后再关闭音频会话管理（否则会报错），此时会延续后台音乐播放
            [timer invalidate];
            mp3FilePath = [NSURL URLWithString:[nsspeekPath stringByAppendingString:@".mp3"]];
            cafFilePath = [NSURL URLWithString:[nsspeekPath stringByAppendingString:@".caf"]];
            [self transformCAFToMP3:cafFilePath transformCAFToMP3T:mp3FilePath];  // .caf 转 .mp3
        }
            break;
        case 3:
        {
            [audioSession setCategory:AVAudioSessionCategorySoloAmbient error:nil];
            //[audioSession setActive:YES error:nil];
            //播放录音文件
            recordPlayUrl = [NSURL URLWithString:[nsplayPath stringByAppendingString:@".mp3"]];
            if (recordPlayUrl != nil){
                NSString *str = [recordPlayUrl absoluteString];   //url>string
                NSFileManager* manager = [NSFileManager defaultManager];
                if ([manager fileExistsAtPath:str]){
                    NSLog(@"===== 播放文件大小 : %llu", [[manager attributesOfItemAtPath:str error:nil] fileSize]);
                }else{
                    NSLog(@"===== 播放文件文件不存在");
                }
                NSError *error;
                _audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:recordPlayUrl error:&error];
                if (error)
                {
                    NSLog(@"===== Error in audioPlayer : %@",[error localizedDescription]);
                }
            }
            [_audioPlayer prepareToPlay];
            _audioPlayer.volume = 1;
            [_audioPlayer play];
            playDuration = (int) _audioPlayer.duration;
            NSLog(@"===== 音频时长为 : %li",(long)playDuration);
            [self audioPlayTimeStart];
            playTime = 0;
        }
    }
}

- (void)recordTimeStart {
    timer = [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(recordTimeTick) userInfo:nil repeats:YES];
}

- (void)recordTimeTick {
    recordTime += 1;
    if (recordTime == 30) {
        recordTime = 0;
        [_audioRecorder stop];
        //[[AVAudioSession sharedInstance] setActive:YES error:nil];
        [timer invalidate];
        return;
    }
}

- (void)audioPlayTimeStart {
    timer = [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(playTimeTick) userInfo:nil repeats:YES];
}

- (void)playTimeTick {
    if (playTime == playDuration) {
        playTime = 0;
        [_audioPlayer stop];
        //[[AVAudioSession sharedInstance] setActive:YES error:nil];
        [timer invalidate];
        return;
    }
    if (![_audioPlayer isPlaying]) {
        return;
    }
    playTime += 1;
}

- (void)transformCAFToMP3:caffilepath
       transformCAFToMP3T:mp3filepath
{
    cafFilePath = caffilepath;
    mp3FilePath = mp3filepath;
    @try {
        int read, write;
        FILE *pcm = fopen([[cafFilePath absoluteString] cStringUsingEncoding:1], "rb");
        fseek(pcm, 4*1024, SEEK_CUR);
        FILE *mp3 = fopen([[mp3FilePath absoluteString] cStringUsingEncoding:1], "wb");
        const long PCM_SIZE = 8192;
        const int MP3_SIZE = 8192;
        short int pcm_buffer[PCM_SIZE*2];
        unsigned char mp3_buffer[MP3_SIZE];
        lame_t lame = lame_init();
        lame_set_in_samplerate(lame, 11025.0);
        lame_set_VBR(lame, vbr_default);
        lame_init_params(lame);
        do {
            read = fread(pcm_buffer, 2*sizeof(short int), PCM_SIZE, pcm);
            if (read == 0)
                write = lame_encode_flush(lame, mp3_buffer, MP3_SIZE);
            else
                write = lame_encode_buffer_interleaved(lame, pcm_buffer, read, mp3_buffer, MP3_SIZE);
            fwrite(mp3_buffer, write, 1, mp3);
        } while (read != 0);
        lame_close(lame);
        fclose(mp3);
        fclose(pcm);
    }
    @catch (NSException *exception) {
        NSLog(@"%@",[exception description]);
    }
    @finally {
        NSLog(@"===== MP3 转换成功: %@",mp3FilePath);
        NSString *str = [mp3FilePath absoluteString];
        audioFileSavePath = [[NSString alloc] initWithString:str];
        NSFileManager* manager = [NSFileManager defaultManager];
        if ([manager fileExistsAtPath:str]){
            NSLog(@"===== 转换文件大小 : %llu", [[manager attributesOfItemAtPath:str error:nil] fileSize]);
        }else{
            NSLog(@"===== 转换文件大小: 文件不存在");
        }
    }
}

@end
