import { localFont } from '../../local-fonts';

const anton = localFont('Anton');
const inter = localFont('Inter');

export const DISPLAY = anton.fontFamily;
export const BODY = inter.fontFamily;
export const fontLoaders = [anton.load, inter.load];
