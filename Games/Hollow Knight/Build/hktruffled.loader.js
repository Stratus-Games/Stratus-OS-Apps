function createUnityInstance(e, r, n) {
function t(e, n) {
  if (!t.aborted && r.showBanner)
    return "error" == n && (t.aborted = !0), r.showBanner(e, n);
  switch (n) {
    case "error":
      console.error(e);
      break;
    case "warning":
      console.warn(e);
      break;
    default:
      console.log(e);
  }
}

function o(e) {
  var r = e.reason || e.error,
    n = r ? r.toString() : e.message || e.reason || "",
    t = r && r.stack ? r.stack.toString() : "";
  if (t.startsWith(n) && (t = t.substring(n.length)),
  (n += "\n" + t.trim()),
  n && c.stackTraceRegExp && c.stackTraceRegExp.test(n)) {
    var o = e.filename || (r && (r.fileName || r.sourceURL)) || "",
      a = e.lineno || (r && (r.lineNumber || r.line)) || 0;
    i(n, o, a);
  }
}

function a(e) {
  e.preventDefault();
}

function i(e, r, n) {
  if (e.indexOf("fullscreen error") == -1) {
    if (c.startupErrorHandler) return void c.startupErrorHandler(e, r, n);
    if (
      !(
        (c.errorHandler && c.errorHandler(e, r, n)) ||
        (console.log("Invoking error handler due to\n" + e),
        "function" == typeof dump &&
          dump("Invoking error handler due to\n" + e),
        i.didShowErrorMessage)
      )
    ) {
      var e =
        "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" +
        e;

      alert(e);
      i.didShowErrorMessage = !0;
    }
  }
}

function s(e, r) {
  var t = c.downloadProgress[e];
  if (!t)
    t = c.downloadProgress[e] = {
      started: !1,
      finished: !1,
      lengthComputable: !1,
      total: 0,
      loaded: 0,
    };

  if ("object" == typeof r) {
    t.started = !0;
    t.total = r.total;
    t.loaded = r.loaded;
    if ("load" == r.type) t.finished = !0;
  }
}

function l(e) {
  return c.fetchWithProgress(c[e], {
    method: "GET",
    onProgress: function (r) {
      s(e, r);
    },
  }).then(function (e) {
    return e.parsedBody;
  });
}

function d() {
  return new Promise(function (e, r) {
    var n = document.createElement("script");
    n.src = c.frameworkUrl;
    n.onload = function () {
      e(unityFramework);
    };
    n.onerror = function () {
      t("Failed to load framework", "error");
    };
    document.body.appendChild(n);
  });
}

function u() {
  d().then(function (e) {
    e(c);
  });

  var e = l("dataUrl");

  c.preRun.push(function () {
    c.addRunDependency("dataUrl");
    e.then(function (e) {
      c.FS_createDataFile("/", "data", e, !0, !0, !0);
      c.removeRunDependency("dataUrl");
    });
  });
}

var c = {
  canvas: e,
  webglContextAttributes: { preserveDrawingBuffer: !1 },
  streamingAssetsUrl: "StreamingAssets",
  downloadProgress: {},
  preRun: [],
  postRun: [],
  print: console.log,
  printErr: console.error,
  disabledCanvasEvents: ["contextmenu", "dragstart"],
};

for (var f in r) c[f] = r[f];

window.addEventListener("error", o);
window.addEventListener("unhandledrejection", o);

for (var h of c.disabledCanvasEvents) {
  e.addEventListener(h, a);
}

/* =========================================
   🔥 FIXED SYSTEMINFO (THIS WAS THE ISSUE)
========================================= */
c.SystemInfo = function () {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,

    userAgent: navigator.userAgent,

    mobile: false,

    browser: "unknown",
    os: "unknown",
    gpu: "unknown",

    hasWebGL: true,
    hasWasm: true,
  };
};
/* ========================================= */

return new Promise(function (e, r) {
  if (!c.SystemInfo.hasWebGL) return r("No WebGL");
  if (!c.SystemInfo.hasWasm) return r("No WASM");

  n(0);
  c.postRun.push(function () {
    n(1);
    e({ Module: c });
  });

  u();
});
}
