const rules =  [
  // if it says it's a webview, let's go with that
  'WebView',
  // iOS webview will be the same as safari but missing "Safari"
  '(iPhone|iPod|iPad)(?!.*Safari)',
  // Android Lollipop and Above: webview will be the same as native but it will contain "wv"
  // Android KitKat to Lollipop webview will put Version/X.X Chrome/{version}.0.0.0
  'Android.*(;\\s+wv|Version/\\d.\\d\\s+Chrome/\\d+(\\.0){3})',
  // old chrome android webview agent
  'Linux; U; Android'
];

const webviewRegExp = new RegExp(`(${  rules.join('|')  })`, 'ig')

export default function isWebview() {
  return !!navigator.userAgent.match(webviewRegExp) || window.ReactNativeWebView
}

export function isPortkeyApp() {
  return window.ReactNativeWebView;
}

export function isPortkeyAppWithDiscover() {
  const ua = navigator.userAgent;
  return ua.indexOf('Portkey did Mobile') !== -1;
}

// readonly browser, don't show login
export function isActivityBrowser() {
  return isPortkeyApp() && !isPortkeyAppWithDiscover();
}

export function isNightElfApp() {
  return isWebview() && !isPortkeyApp();
}