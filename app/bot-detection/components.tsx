"use client";

import {generateFingerprint} from "fpcollect/src/fpCollect";
import Link from "next/link";
import {useEffect, useState} from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {github} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {useQuery} from "@tanstack/react-query";
import {Codeblock} from "@/components/codeblock/codeblock";


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
  const [copyStatus, setCopyStatus] = useState<string>("");
  const {isPending, data: fingerprint} = useQuery({
    queryKey: ['bot-detection'],
    queryFn: generateFingerprint,
    retry: 10,
  })

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

  const rows = fingerprint ? tests(fingerprint) : []

  // Intoli-style summary rows (placed above Additional Info)
  const intoliRows = fingerprint
    ? [
      {label: 'User Agent (Old)', value: get(fingerprint, 'userAgent'), passed: !!get(fingerprint, 'userAgent')},
      {
        label: 'WebDriver (New)',
        value: get(fingerprint, 'webDriver'),
        passed: get(fingerprint, 'webDriver') === false || get(fingerprint, 'webDriver') === undefined
      },
      {
        label: 'WebDriver Advanced',
        value: get(fingerprint, 'selenium'),
        passed: Array.isArray(get(fingerprint, 'selenium')) ? (get(fingerprint, 'selenium') as any[]).length === 0 : get(fingerprint, 'selenium') === false
      },
      {label: 'Chrome (New)', value: get(fingerprint, 'hasChrome'), passed: !!get(fingerprint, 'hasChrome')},
      {
        label: 'Permissions (New)',
        value: get(fingerprint, 'permissions')?.state ?? get(fingerprint, 'permissions'),
        passed: !(get(fingerprint, 'permissions')?.state === 'denied')
      },
      {
        label: 'Plugins Length (Old)',
        value: Array.isArray(get(fingerprint, 'plugins')) ? get(fingerprint, 'plugins').length : 'missing',
        passed: Array.isArray(get(fingerprint, 'plugins'))
      },
      {
        label: 'Plugins is of type PluginArray',
        value: Array.isArray(get(fingerprint, 'plugins')) ? 'passed' : 'missing',
        passed: Array.isArray(get(fingerprint, 'plugins'))
      },
      {
        label: 'Languages (Old)',
        value: Array.isArray(get(fingerprint, 'languages')) ? (get(fingerprint, 'languages') as string[]).join(',') : get(fingerprint, 'languages') ?? 'missing',
        passed: !!get(fingerprint, 'languages')
      },
      {
        label: 'WebGL Vendor',
        value: (Array.isArray(get(fingerprint, 'videoCard')) ? get(fingerprint, 'videoCard')[0] : get(fingerprint, 'videoCard')) ?? get(fingerprint, 'detailChrome')?.webglVendor ?? 'missing',
        passed: !!(Array.isArray(get(fingerprint, 'videoCard')) ? get(fingerprint, 'videoCard')[0] : get(fingerprint, 'videoCard'))
      },
      {
        label: 'WebGL Renderer',
        value: (Array.isArray(get(fingerprint, 'videoCard')) ? get(fingerprint, 'videoCard')[1] : get(fingerprint, 'videoCard')) ?? get(fingerprint, 'detailChrome')?.webglRenderer ?? 'missing',
        passed: !!(Array.isArray(get(fingerprint, 'videoCard')) ? get(fingerprint, 'videoCard')[1] : get(fingerprint, 'videoCard'))
      },
      {
        label: 'Broken Image Dimensions',
        value: get(fingerprint, 'brokenImageDims') ?? get(fingerprint, 'brokenImageDimensions') ?? '24x24',
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

      {isPending && <div className="p-4">Collecting fingerprint…</div>}

      <div className="w-full overflow-auto">
        {!isPending && (
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
                <td
                  className={`border border-gray-300 p-2 align-top ${r.passed ? 'bg-green-100 text-black' : 'bg-red-100 text-black'}`}>
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

        {!isPending && (
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

        {!isPending && fingerprint && (
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <tbody>
              {(() => {
                const details: Array<{ k: string; v: any }> = [];
                // navigator-like properties
                details.push({
                  k: 'navigator.cookieEnabled',
                  v: get(fingerprint, 'navigator.cookieEnabled') ?? get(fingerprint, 'cookieEnabled')
                });
                details.push({
                  k: 'navigator.doNotTrack',
                  v: get(fingerprint, 'navigator.doNotTrack') ?? get(fingerprint, 'doNotTrack') ?? 'unspecified'
                });
                details.push({
                  k: 'navigator.msDoNotTrack',
                  v: get(fingerprint, 'navigator.msDoNotTrack') ?? 'undefined'
                });
                details.push({k: 'navigator.sendBeacon', v: get(fingerprint, 'navigator.sendBeacon') ?? ' '});
                details.push({k: 'navigator.userAgent', v: get(fingerprint, 'userAgent')});
                details.push({k: 'navigator.appName', v: get(fingerprint, 'navigator.appName') ?? 'Netscape'});
                details.push({k: 'navigator.vendor', v: get(fingerprint, 'navigator.vendor') ?? 'Google Inc.'});
                details.push({k: 'navigator.appCodeName', v: get(fingerprint, 'navigator.appCodeName') ?? 'Mozilla'});
                details.push({k: 'navigator.getUserMedia', v: get(fingerprint, 'navigator.getUserMedia') ?? ''});
                details.push({k: 'navigator.sayswho', v: get(fingerprint, 'navigator.sayswho') ?? 'undefined'});
                details.push({k: 'navigator.javaEnabled', v: get(fingerprint, 'navigator.javaEnabled') ?? false});
                details.push({k: 'navigator.plugins', v: get(fingerprint, 'plugins') ?? []});
                details.push({
                  k: 'screen.width',
                  v: get(fingerprint, 'screen.wInnerWidth') ?? get(fingerprint, 'screen.width') ?? get(fingerprint, 'screen')?.width ?? get(fingerprint, 'screen')
                });
                details.push({
                  k: 'screen.height',
                  v: get(fingerprint, 'screen.wInnerHeight') ?? get(fingerprint, 'screen.height') ?? get(fingerprint, 'screen')?.height ?? get(fingerprint, 'screen')
                });
                details.push({
                  k: 'screen.colorDepth',
                  v: get(fingerprint, 'screen.sColorDepth') ?? get(fingerprint, 'screen.colorDepth') ?? 0
                });
                details.push({
                  k: 'navigator.language',
                  v: Array.isArray(get(fingerprint, 'languages')) ? get(fingerprint, 'languages').join(',') : get(fingerprint, 'languages') ?? get(fingerprint, 'language')
                });
                details.push({k: 'navigator.loadPurpose', v: get(fingerprint, 'navigator.loadPurpose') ?? 'undefined'});
                details.push({
                  k: 'navigator.platform',
                  v: get(fingerprint, 'platform') ?? get(fingerprint, 'navigator.platform') ?? 'MacIntel'
                });
                details.push({
                  k: 'navigator.mediaDevices',
                  v: (get(fingerprint, 'multimediaDevices') ? `audioinput: id = ${get(fingerprint, 'multimediaDevices').micros ?? ''} videoinput: id = ${get(fingerprint, 'multimediaDevices').webcams ?? ''}` : '')
                });
                details.push({k: 'navigator.getBattery details', v: get(fingerprint, 'battery') ?? ''});

                // canvas hashes (best-effort from fp fields)
                details.push({
                  k: 'Canvas1',
                  v: get(fingerprint, 'canvas1') ?? get(fingerprint, 'canvasHash1') ?? get(fingerprint, 'tpCanvas') ?? ''
                });
                details.push({k: 'Canvas2', v: get(fingerprint, 'canvas2') ?? get(fingerprint, 'canvasHash2') ?? ''});
                details.push({
                  k: 'Canvas3 (iframe sandbox)',
                  v: get(fingerprint, 'canvas3') ?? get(fingerprint, 'canvasHash3') ?? ''
                });
                details.push({
                  k: 'Canvas4 (iframe sandbox)',
                  v: get(fingerprint, 'canvas4') ?? get(fingerprint, 'canvasHash4') ?? ''
                });
                details.push({
                  k: 'Canvas5 (iframe)',
                  v: get(fingerprint, 'canvas5') ?? get(fingerprint, 'canvasHash5') ?? ''
                });

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
        {!isPending && fingerprint && (
          <div className="p-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(fingerprint, null, 2))}
                  className="text-sm underline"
                  disabled={copyStatus === 'Copied'}
                >
                  Copy
                </button>
                {/* copy feedback */}
                {copyStatus && (
                  <span className={`text-sm font-medium ${copyStatus === 'Copied' ? 'text-green-600' : 'text-red-600'}`}
                        role="status" aria-live="polite">
                    {copyStatus}
                  </span>
                )}
              </div>
            </div>
            <Codeblock language="json5" theme="github-light" showLanguage={false}>
              {JSON.stringify(fingerprint, null, 2)}
            </Codeblock>
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
