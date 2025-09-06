declare module 'fpcollect' {
  // Screen information interface
  export interface ScreenInfo {
    wInnerHeight: number;
    wOuterHeight: number;
    wOuterWidth: number;
    wInnerWidth: number;
    wScreenX: number;
    wPageXOffset: number;
    wPageYOffset: number;
    cWidth: number;
    cHeight: number;
    sWidth: number;
    sHeight: number;
    sAvailWidth: number;
    sAvailHeight: number;
    sColorDepth: number;
    sPixelDepth: number;
    wDevicePixelRatio: number;
  }

  // Multimedia devices interface
  export interface MultimediaDevices {
    speakers?: number;
    micros?: number;
    webcams?: number;
    devicesBlockedByBrave?: boolean;
  }

  // Resource overflow information
  export interface ResOverflow {
    depth: number;
    errorMessage: string;
    errorName: string;
    errorStacklength: number;
  }

  // Chrome details interface
  export interface ChromeDetails {
    webstore?: number;
    runtime?: number;
    app?: number;
    csi?: number;
    loadTimes?: number;
    properties?: string;
    connect?: number;
    sendMessage?: number;
  }

  // Permissions interface
  export interface Permissions {
    state: string;
    permission: string;
  }

  // Audio codecs interface
  export interface AudioCodecs {
    ogg: string;
    mp3: string;
    wav: string;
    m4a: string;
    aac: string;
  }

  // Video codecs interface
  export interface VideoCodecs {
    ogg: string;
    h264: string;
    webm: string;
  }

  // Error object for failed operations
  export interface FingerprintError {
    error: true;
    message: string;
  }

  // Main fingerprint result interface
  export interface Fingerprint {
    plugins: string[] | FingerprintError;
    mimeTypes: string[] | FingerprintError;
    userAgent: string | FingerprintError;
    platform: string | FingerprintError;
    languages: string[] | string | FingerprintError;
    screen: ScreenInfo | FingerprintError;
    touchScreen: [number, boolean, boolean] | FingerprintError;
    videoCard: [string, string] | string | FingerprintError;
    multimediaDevices: MultimediaDevices | FingerprintError;
    productSub: string | FingerprintError;
    navigatorPrototype: string[] | FingerprintError;
    etsl: number | FingerprintError;
    screenDesc: string | FingerprintError;
    phantomJS: boolean[] | FingerprintError;
    nightmareJS: boolean | FingerprintError;
    selenium: boolean[] | FingerprintError;
    webDriver: boolean | FingerprintError;
    webDriverValue: boolean | undefined | FingerprintError;
    errorsGenerated: (string | number | undefined)[] | FingerprintError;
    resOverflow: ResOverflow | FingerprintError;
    accelerometerUsed: boolean | FingerprintError;
    screenMediaQuery: boolean | FingerprintError;
    hasChrome: boolean | FingerprintError;
    detailChrome: ChromeDetails | string | FingerprintError;
    permissions: Permissions | FingerprintError;
    iframeChrome: string | FingerprintError;
    debugTool: boolean | FingerprintError;
    battery: boolean | FingerprintError;
    deviceMemory: number | FingerprintError;
    tpCanvas: Uint8ClampedArray | string | FingerprintError;
    sequentum: boolean | FingerprintError;
    audioCodecs: AudioCodecs | FingerprintError;
    videoCodecs: VideoCodecs | FingerprintError;
  }

  // Custom function type
  export type CustomFunction = () => any | Promise<any>;

  // Main fpCollect interface
  export interface FpCollect {
    addCustomFunction(name: string, isAsync: boolean, f: CustomFunction): void;
    generateFingerprint(): Promise<Fingerprint>;
  }

  // Provide both named and default exports for compatibility with different import styles.
  export function generateFingerprint(): Promise<Fingerprint>;
  export function addCustomFunction(name: string, isAsync: boolean, f: CustomFunction): void;

  const fpCollect: FpCollect;
  export default fpCollect;
}

// Also declare the internal path used in imports so TypeScript can resolve it.
declare module 'fpcollect/src/fpCollect' {
  export * from 'fpcollect';
  import fp from 'fpcollect';
  export default fp;
}
