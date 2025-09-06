declare module 'fpcollect/src/fpCollect' {
  import { Fingerprint } from 'fpcollect';
  export function generateFingerprint(): Promise<Fingerprint>;
  export function addCustomFunction(name: string, isAsync: boolean, f: () => any | Promise<any>): void;
  export { generateFingerprint as default };
}

