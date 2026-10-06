import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setColorSpace('bt709');
Config.setConcurrency(null);
