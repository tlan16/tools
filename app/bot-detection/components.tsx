"use client";

import { generateFingerprint } from "fpcollect/src/fpCollect";
import Link from "next/link";
import { useEffect, useState } from "react";

function get(obj: any, path: string | string[], fallback: any = undefined) {
  if (!obj) return fallback;
  const parts = Array.isArray(path) ? path : path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return fallback;
    cur = cur[p];
  }
  return cur === undefined ? fallback : cur;
}

export function BotDetection() {
  const [fp, setFp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    generateFingerprint()
      .then((res) => {
        if (mounted) setFp(res);
      })
      .catch((err) => {
        console.error("generateFingerprint error", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const tests = (fp: any) => {
    if (!fp) return [];
    return [
      { key: "PHANTOM_UA", label: "PHANTOM_UA", value: get(fp, "userAgent"), pass: !!get(fp, "userAgent") },
      { key: "PHANTOM_PROPERTIES", label: "PHANTOM_PROPERTIES", value: get(fp, "phantomProperties") ?? get(fp, "phantom_properties") ?? {}, pass: true },
      { key: "PHANTOM_ETSL", label: "PHANTOM_ETSL", value: get(fp, "etsl"), pass: !(typeof get(fp, "etsl") === "number" && get(fp, "etsl") > 0) },
      { key: "PHANTOM_LANGUAGE", label: "PHANTOM_LANGUAGE", value: get(fp, "languages") ?? get(fp, "language"), pass: !!get(fp, "languages") || !!get(fp, "language") },
      { key: "PHANTOM_WEBSOCKET", label: "PHANTOM_WEBSOCKET", value: get(fp, "webSocket") ?? get(fp, "websocket") ?? {}, pass: true },
      { key: "MQ_SCREEN", label: "MQ_SCREEN", value: get(fp, "mqScreen") ?? get(fp, "screenMediaQuery") ?? {}, pass: true },
      { key: "PHANTOM_OVERFLOW", label: "PHANTOM_OVERFLOW", value: get(fp, "resOverflow"), pass: !(get(fp, "resOverflow")) },
      { key: "PHANTOM_WINDOW_HEIGHT", label: "PHANTOM_WINDOW_HEIGHT", value: get(fp, "screen") ?? {}, pass: true },
      { key: "HEADCHR_UA", label: "HEADCHR_UA", value: get(fp, "userAgent"), pass: !!get(fp, "userAgent") },
      { key: "HEADCHR_CHROME_OBJ", label: "HEADCHR_CHROME_OBJ", value: get(fp, "detailChrome") ?? {}, pass: Object.keys(get(fp, "detailChrome") ?? {}).length > 0 },
      { key: "HEADCHR_PERMISSIONS", label: "HEADCHR_PERMISSIONS", value: get(fp, "permissions") ?? {}, pass: true },
      { key: "HEADCHR_PLUGINS", label: "HEADCHR_PLUGINS", value: get(fp, "plugins") ?? [], pass: !!get(fp, "plugins") },
      { key: "HEADCHR_IFRAME", label: "HEADCHR_IFRAME", value: get(fp, "iframeChrome") ?? {}, pass: !!get(fp, "iframeChrome") },
      { key: "CHR_DEBUG_TOOLS", label: "CHR_DEBUG_TOOLS", value: get(fp, "debugTool"), pass: true },
      { key: "SELENIUM_DRIVER", label: "SELENIUM_DRIVER", value: get(fp, "selenium") ?? [], pass: !!get(fp, "selenium") },
      { key: "CHR_BATTERY", label: "CHR_BATTERY", value: get(fp, "battery") ?? {}, pass: !!get(fp, "battery") },
      { key: "CHR_MEMORY", label: "CHR_MEMORY", value: get(fp, "deviceMemory") ?? {}, pass: !!get(fp, "deviceMemory") },
      { key: "TRANSPARENT_PIXEL", label: "TRANSPARENT_PIXEL", value: get(fp, "tpCanvas") ?? {}, pass: true },
      { key: "SEQUENTUM", label: "SEQUENTUM", value: get(fp, "sequentum"), pass: !!get(fp, "sequentum") },
      { key: "VIDEO_CODECS", label: "VIDEO_CODECS", value: get(fp, "videoCodecs") ?? {}, pass: !!get(fp, "videoCodecs") },
    ];
  };

  const rows = fp ? tests(fp) : []

  // Intoli-style summary rows (placed above Additional Info)
  const intoliRows = fp
    ? [
        { label: 'User Agent (Old)', value: get(fp, 'userAgent'), passed: !!get(fp, 'userAgent') },
        { label: 'WebDriver (New)', value: get(fp, 'webDriver'), passed: get(fp, 'webDriver') === false || get(fp, 'webDriver') === undefined },
        { label: 'WebDriver Advanced', value: get(fp, 'selenium'), passed: Array.isArray(get(fp, 'selenium')) ? (get(fp, 'selenium') as any[]).length === 0 : get(fp, 'selenium') === false },
        { label: 'Chrome (New)', value: get(fp, 'hasChrome'), passed: !!get(fp, 'hasChrome') },
        { label: 'Permissions (New)', value: get(fp, 'permissions')?.state ?? get(fp, 'permissions'), passed: !(get(fp, 'permissions')?.state === 'denied') },
        { label: 'Plugins Length (Old)', value: Array.isArray(get(fp, 'plugins')) ? get(fp, 'plugins').length : 'missing', passed: Array.isArray(get(fp, 'plugins')) },
        { label: 'Plugins is of type PluginArray', value: Array.isArray(get(fp, 'plugins')) ? 'passed' : 'missing', passed: Array.isArray(get(fp, 'plugins')) },
        { label: 'Languages (Old)', value: Array.isArray(get(fp, 'languages')) ? (get(fp, 'languages') as string[]).join(',') : get(fp, 'languages') ?? 'missing', passed: !!get(fp, 'languages') },
        { label: 'WebGL Vendor', value: (Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[0] : get(fp, 'videoCard')) ?? get(fp, 'detailChrome')?.webglVendor ?? 'missing', passed: !!(Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[0] : get(fp, 'videoCard')) },
        { label: 'WebGL Renderer', value: (Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[1] : get(fp, 'videoCard')) ?? get(fp, 'detailChrome')?.webglRenderer ?? 'missing', passed: !!(Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[1] : get(fp, 'videoCard')) },
        { label: 'Broken Image Dimensions', value: get(fp, 'brokenImageDims') ?? get(fp, 'brokenImageDimensions') ?? '24x24', passed: true },
      ]
    : []

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12 w-full space-y-6 h-svh">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Bot Detection</h2>
      </div>

      <div>
        <h3 className="text-xl font-semibold mt-4">Summary</h3>
      </div>

      <div className="w-full overflow-auto">
        {!loading && (
          <table className="w-full border-collapse border border-black mb-6">
            <thead>
              <tr>
                <th className="border border-black text-left p-3 bg-gray-900 text-white">Test Name</th>
                <th className="border border-black text-left p-3 bg-gray-900 text-white">Result</th>
              </tr>
            </thead>
            <tbody>
              {intoliRows.map((r, idx) => (
                <tr key={idx} className="align-top">
                  <td className="border border-black p-2 align-top w-1/3">{r.label}</td>
                  <td className={`border border-black p-2 align-top ${r.passed ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
                    <div className="p-2 text-sm font-mono">{typeof r.value === 'string' ? r.value : JSON.stringify(r.value, null, 2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="w-full overflow-auto">
        <div>
          <h3 className="text-xl font-semibold">Additional Info</h3>
        </div>
        {loading && <div className="p-4">Collecting fingerprint…</div>}

        {!loading && (
           <table className="w-full border-collapse border border-black">
             <thead>
               <tr>
                 <th className="border border-black text-left p-2">Test Name</th>
                 <th className="border border-black text-left p-2">Status</th>
                 <th className="border border-black text-left p-2">Result</th>
               </tr>
             </thead>
             <tbody>
               {rows.map((r, i) => (
                 <tr key={r.key + i} className="align-top">
                   <td className="border border-black p-2 align-top font-medium">{r.label}</td>
                   <td className="border border-black p-2 align-top w-24">
                     <div className={`${r.pass ? "bg-green-200 text-black" : "bg-red-500 text-white"} w-16 text-center py-1 rounded-sm`}>{r.pass ? "ok" : "FAIL"}</div>
                   </td>
                   <td className="border border-black p-2 align-top">
                     <pre className="whitespace-pre-wrap text-sm font-mono">{typeof r.value === "string" ? r.value : JSON.stringify(r.value, null, 2)}</pre>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}

        <div className="mt-4">
           <h2 className="text-lg font-medium">
             Source:
             <Link href="https://bot.sannysoft.com/" target="_blank" className="underline px-1">
               https://bot.sannysoft.com/
             </Link>
           </h2>
         </div>
       </div>
     </div>
   );
 }
