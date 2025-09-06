"use client";

import {generateFingerprint} from "fpcollect/src/fpCollect";
import Link from "next/link";
import {useEffect, useState} from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {github} from "react-syntax-highlighter/dist/esm/styles/hljs";


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

function formatValue(v: any) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") {
    const entries = Object.entries(v as Record<string, any>);
    if (entries.length === 0) return "{}";
    return entries
      .slice(0, 10)
      .map(([k, val]) => `${k}: ${typeof val === "object" ? (Array.isArray(val) ? val.join(", ") : "[obj]") : String(val)}`)
      .join("; ");
  }
  return String(v);
}

export function BotDetection() {
  const [fp, setFp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copyStatus, setCopyStatus] = useState<string>("");

  const toggleExpand = (key: string) => {
    setExpanded((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus(""), 2000);
    } catch (e) {
      setCopyStatus("Failed");
      window.setTimeout(() => setCopyStatus(""), 2000);
    }
  };

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
      {key: "PHANTOM_UA", label: "PHANTOM_UA", value: get(fp, "userAgent"), pass: !!get(fp, "userAgent")},
      {
        key: "PHANTOM_PROPERTIES",
        label: "PHANTOM_PROPERTIES",
        value: get(fp, "phantomProperties") ?? get(fp, "phantom_properties") ?? {},
        pass: true
      },
      {
        key: "PHANTOM_ETSL",
        label: "PHANTOM_ETSL",
        value: get(fp, "etsl"),
        pass: !(typeof get(fp, "etsl") === "number" && get(fp, "etsl") > 0)
      },
      {
        key: "PHANTOM_LANGUAGE",
        label: "PHANTOM_LANGUAGE",
        value: get(fp, "languages") ?? get(fp, "language"),
        pass: !!get(fp, "languages") || !!get(fp, "language")
      },
      {
        key: "PHANTOM_WEBSOCKET",
        label: "PHANTOM_WEBSOCKET",
        value: get(fp, "webSocket") ?? get(fp, "websocket") ?? {},
        pass: true
      },
      {
        key: "MQ_SCREEN",
        label: "MQ_SCREEN",
        value: get(fp, "mqScreen") ?? get(fp, "screenMediaQuery") ?? {},
        pass: true
      },
      {
        key: "PHANTOM_OVERFLOW",
        label: "PHANTOM_OVERFLOW",
        value: get(fp, "resOverflow"),
        pass: !(get(fp, "resOverflow"))
      },
      {key: "PHANTOM_WINDOW_HEIGHT", label: "PHANTOM_WINDOW_HEIGHT", value: get(fp, "screen") ?? {}, pass: true},
      {key: "HEADCHR_UA", label: "HEADCHR_UA", value: get(fp, "userAgent"), pass: !!get(fp, "userAgent")},
      {
        key: "HEADCHR_CHROME_OBJ",
        label: "HEADCHR_CHROME_OBJ",
        value: get(fp, "detailChrome") ?? {},
        pass: Object.keys(get(fp, "detailChrome") ?? {}).length > 0
      },
      {key: "HEADCHR_PERMISSIONS", label: "HEADCHR_PERMISSIONS", value: get(fp, "permissions") ?? {}, pass: true},
      {key: "HEADCHR_PLUGINS", label: "HEADCHR_PLUGINS", value: get(fp, "plugins") ?? [], pass: !!get(fp, "plugins")},
      {
        key: "HEADCHR_IFRAME",
        label: "HEADCHR_IFRAME",
        value: get(fp, "iframeChrome") ?? {},
        pass: !!get(fp, "iframeChrome")
      },
      {key: "CHR_DEBUG_TOOLS", label: "CHR_DEBUG_TOOLS", value: get(fp, "debugTool"), pass: true},
      {key: "SELENIUM_DRIVER", label: "SELENIUM_DRIVER", value: get(fp, "selenium") ?? [], pass: !!get(fp, "selenium")},
      {key: "CHR_BATTERY", label: "CHR_BATTERY", value: get(fp, "battery") ?? {}, pass: !!get(fp, "battery")},
      {key: "CHR_MEMORY", label: "CHR_MEMORY", value: get(fp, "deviceMemory") ?? {}, pass: !!get(fp, "deviceMemory")},
      {key: "TRANSPARENT_PIXEL", label: "TRANSPARENT_PIXEL", value: get(fp, "tpCanvas") ?? {}, pass: true},
      {key: "SEQUENTUM", label: "SEQUENTUM", value: get(fp, "sequentum"), pass: !!get(fp, "sequentum")},
      {key: "VIDEO_CODECS", label: "VIDEO_CODECS", value: get(fp, "videoCodecs") ?? {}, pass: !!get(fp, "videoCodecs")},
    ];
  };

  const rows = fp ? tests(fp) : []

  // Intoli-style summary rows (placed above Additional Info)
  const intoliRows = fp
    ? [
      {label: 'User Agent (Old)', value: get(fp, 'userAgent'), passed: !!get(fp, 'userAgent')},
      {
        label: 'WebDriver (New)',
        value: get(fp, 'webDriver'),
        passed: get(fp, 'webDriver') === false || get(fp, 'webDriver') === undefined
      },
      {
        label: 'WebDriver Advanced',
        value: get(fp, 'selenium'),
        passed: Array.isArray(get(fp, 'selenium')) ? (get(fp, 'selenium') as any[]).length === 0 : get(fp, 'selenium') === false
      },
      {label: 'Chrome (New)', value: get(fp, 'hasChrome'), passed: !!get(fp, 'hasChrome')},
      {
        label: 'Permissions (New)',
        value: get(fp, 'permissions')?.state ?? get(fp, 'permissions'),
        passed: !(get(fp, 'permissions')?.state === 'denied')
      },
      {
        label: 'Plugins Length (Old)',
        value: Array.isArray(get(fp, 'plugins')) ? get(fp, 'plugins').length : 'missing',
        passed: Array.isArray(get(fp, 'plugins'))
      },
      {
        label: 'Plugins is of type PluginArray',
        value: Array.isArray(get(fp, 'plugins')) ? 'passed' : 'missing',
        passed: Array.isArray(get(fp, 'plugins'))
      },
      {
        label: 'Languages (Old)',
        value: Array.isArray(get(fp, 'languages')) ? (get(fp, 'languages') as string[]).join(',') : get(fp, 'languages') ?? 'missing',
        passed: !!get(fp, 'languages')
      },
      {
        label: 'WebGL Vendor',
        value: (Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[0] : get(fp, 'videoCard')) ?? get(fp, 'detailChrome')?.webglVendor ?? 'missing',
        passed: !!(Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[0] : get(fp, 'videoCard'))
      },
      {
        label: 'WebGL Renderer',
        value: (Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[1] : get(fp, 'videoCard')) ?? get(fp, 'detailChrome')?.webglRenderer ?? 'missing',
        passed: !!(Array.isArray(get(fp, 'videoCard')) ? get(fp, 'videoCard')[1] : get(fp, 'videoCard'))
      },
      {
        label: 'Broken Image Dimensions',
        value: get(fp, 'brokenImageDims') ?? get(fp, 'brokenImageDimensions') ?? '24x24',
        passed: true
      },
    ]
    : []

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12 w-full space-y-6 h-svh">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Bot Detection</h2>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mt-6">Summary</h3>
      </div>

      {loading && <div className="p-4">Collecting fingerprint…</div>}

      <div className="w-full overflow-auto">
        {!loading && (
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
            <tr>
              <th className="border border-gray-300 text-left p-3 bg-gray-100 text-black">Test Name</th>
              <th className="border border-gray-300 text-left p-3 bg-gray-100 text-black">Result</th>
            </tr>
            </thead>
            <tbody>
            {intoliRows.map((r, idx) => (
              <tr key={idx} className="align-top">
                <td className="border border-gray-300 p-2 align-top w-1/3">{r.label}</td>
                <td className={`border border-gray-300 p-2 align-top ${r.passed ? 'bg-green-100 text-black' : 'bg-red-100 text-black'}`}>
                  <div className="p-2 text-sm">{formatValue(r.value)}</div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="w-full overflow-auto">
        <div>
          <h3 className="text-2xl font-semibold mt-6">Additional Info</h3>
        </div>

        {!loading && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
            <tr>
              <th className="border border-gray-300 text-left p-3 bg-gray-100 text-black">Test Name</th>
              <th className="border border-gray-300 text-left p-3 bg-gray-100 text-black">Status</th>
              <th className="border border-gray-300 text-left p-3 bg-gray-100 text-black">Result</th>
            </tr>
            </thead>
            <tbody>
            {rows.map((r, i) => (
              <tr key={r.key + i} className="align-top">
                <td className="border border-gray-300 p-2 align-top font-medium">{r.label}</td>
                <td className="border border-gray-300 p-2 align-top w-24">
                  <div
                    className={`${r.pass ? "bg-green-100 text-black" : "bg-red-100 text-black"} w-16 text-center py-1 rounded-sm`}>{r.pass ? "ok" : "FAIL"}</div>
                </td>
                <td className="border border-gray-300 p-2 align-top">
                  <div className="text-sm">{formatValue(r.value)}</div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="w-full overflow-auto">
        <div>
          <h3 className="text-2xl font-semibold mt-6">Some details</h3>
        </div>

        {!loading && fp && (
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <tbody>
              {(() => {
                const details: Array<{ k: string; v: any }> = [];
                // navigator-like properties
                details.push({
                  k: 'navigator.cookieEnabled',
                  v: get(fp, 'navigator.cookieEnabled') ?? get(fp, 'cookieEnabled')
                });
                details.push({
                  k: 'navigator.doNotTrack',
                  v: get(fp, 'navigator.doNotTrack') ?? get(fp, 'doNotTrack') ?? 'unspecified'
                });
                details.push({k: 'navigator.msDoNotTrack', v: get(fp, 'navigator.msDoNotTrack') ?? 'undefined'});
                details.push({k: 'navigator.sendBeacon', v: get(fp, 'navigator.sendBeacon') ?? ' '});
                details.push({k: 'navigator.userAgent', v: get(fp, 'userAgent')});
                details.push({k: 'navigator.appName', v: get(fp, 'navigator.appName') ?? 'Netscape'});
                details.push({k: 'navigator.vendor', v: get(fp, 'navigator.vendor') ?? 'Google Inc.'});
                details.push({k: 'navigator.appCodeName', v: get(fp, 'navigator.appCodeName') ?? 'Mozilla'});
                details.push({k: 'navigator.getUserMedia', v: get(fp, 'navigator.getUserMedia') ?? ''});
                details.push({k: 'navigator.sayswho', v: get(fp, 'navigator.sayswho') ?? 'undefined'});
                details.push({k: 'navigator.javaEnabled', v: get(fp, 'navigator.javaEnabled') ?? false});
                details.push({k: 'navigator.plugins', v: get(fp, 'plugins') ?? []});
                details.push({
                  k: 'screen.width',
                  v: get(fp, 'screen.wInnerWidth') ?? get(fp, 'screen.width') ?? get(fp, 'screen')?.width ?? get(fp, 'screen')
                });
                details.push({
                  k: 'screen.height',
                  v: get(fp, 'screen.wInnerHeight') ?? get(fp, 'screen.height') ?? get(fp, 'screen')?.height ?? get(fp, 'screen')
                });
                details.push({
                  k: 'screen.colorDepth',
                  v: get(fp, 'screen.sColorDepth') ?? get(fp, 'screen.colorDepth') ?? 0
                });
                details.push({
                  k: 'navigator.language',
                  v: Array.isArray(get(fp, 'languages')) ? get(fp, 'languages').join(',') : get(fp, 'languages') ?? get(fp, 'language')
                });
                details.push({k: 'navigator.loadPurpose', v: get(fp, 'navigator.loadPurpose') ?? 'undefined'});
                details.push({
                  k: 'navigator.platform',
                  v: get(fp, 'platform') ?? get(fp, 'navigator.platform') ?? 'MacIntel'
                });
                details.push({
                  k: 'navigator.mediaDevices',
                  v: (get(fp, 'multimediaDevices') ? `audioinput: id = ${get(fp, 'multimediaDevices').micros ?? ''} videoinput: id = ${get(fp, 'multimediaDevices').webcams ?? ''}` : '')
                });
                details.push({k: 'navigator.getBattery details', v: get(fp, 'battery') ?? ''});

                // canvas hashes (best-effort from fp fields)
                details.push({
                  k: 'Canvas1',
                  v: get(fp, 'canvas1') ?? get(fp, 'canvasHash1') ?? get(fp, 'tpCanvas') ?? ''
                });
                details.push({k: 'Canvas2', v: get(fp, 'canvas2') ?? get(fp, 'canvasHash2') ?? ''});
                details.push({k: 'Canvas3 (iframe sandbox)', v: get(fp, 'canvas3') ?? get(fp, 'canvasHash3') ?? ''});
                details.push({k: 'Canvas4 (iframe sandbox)', v: get(fp, 'canvas4') ?? get(fp, 'canvasHash4') ?? ''});
                details.push({k: 'Canvas5 (iframe)', v: get(fp, 'canvas5') ?? get(fp, 'canvasHash5') ?? ''});

                return details.map((d, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="border border-gray-300 p-2 align-top w-1/3 font-medium text-sm">{d.k}</td>
                    <td className="border border-gray-300 p-2 align-top text-sm">{formatValue(d.v)}</td>
                   </tr>
                 ));
               })()}
               </tbody>
             </table>
           </div>
         )}
       </div>

      {/* Raw JSON section - collapsed by default with copy button */}
      <div className="w-full overflow-auto">
        <div>
          <h3 className="text-2xl font-semibold mt-6">Raw JSON</h3>
        </div>
        {!loading && fp && (
          <div className="p-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleExpand('rawJSON')}
                className="text-sm underline"
                aria-expanded={expanded['rawJSON']}
              >
                {expanded['rawJSON'] ? 'Hide raw JSON' : 'Show raw JSON'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(fp, null, 2))}
                  className="text-sm underline"
                  disabled={copyStatus === 'Copied'}
                >
                  Copy
                </button>
                {/* copy feedback */}
                {copyStatus && (
                  <span className={`text-sm font-medium ${copyStatus === 'Copied' ? 'text-green-600' : 'text-red-600'}`} role="status" aria-live="polite">
                    {copyStatus}
                  </span>
                )}
              </div>
            </div>
            {expanded['rawJSON'] && (
              <SyntaxHighlighter language="json5" style={github}>
                {JSON.stringify(fp, null, 2)}
              </SyntaxHighlighter>
             )}
          </div>
        )}
      </div>

      <div className="mt-4">
         <h2 className="text-lg font-medium">
           Source:
           <Link href="https://bot.sannysoft.com/" target="_blank" className="underline px-1">
             https://bot.sannysoft.com/
           </Link>
         </h2>
       </div>
     </div>
   );
 }
