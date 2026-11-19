package io.github.cristiancinzeaca.elgatoloco;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationAttributes;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/** The whole app: one full-screen WebView showing the game bundled in assets/www. */
public class MainActivity extends Activity {
    // The game is served from the APK under a private https address, so that
    // fetch(), audio decoding and saved progress behave exactly as on the web.
    private static final String HOST = "elgatoloco.app.local";
    private static final String START = "https://" + HOST + "/index.html";
    private static final int BG = Color.rgb(0xE6, 0xEB, 0xFF);

    private WebView web;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        if (Build.VERSION.SDK_INT >= 28) {
            getWindow().getAttributes().layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BG);
        web = new WebView(this);
        web.setBackgroundColor(BG);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);

        // Keep the game clear of the camera cut-out and of any bars still showing.
        root.setOnApplyWindowInsetsListener((v, in) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets i = in.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(i.left, i.top, i.right, i.bottom);
            } else {
                v.setPadding(in.getSystemWindowInsetLeft(), in.getSystemWindowInsetTop(),
                        in.getSystemWindowInsetRight(), in.getSystemWindowInsetBottom());
            }
            return in;
        });

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setTextZoom(100);

        web.addJavascriptInterface(new Bridge(), "ElGatoApp");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                if (!HOST.equals(req.getUrl().getHost())) return missing();
                String path = req.getUrl().getPath();
                if (path == null || path.equals("/")) path = "/index.html";
                if (path.contains("..")) return missing();
                try {
                    InputStream in = getAssets().open("www" + path);
                    Map<String, String> head = new HashMap<>();
                    head.put("Cache-Control", "no-cache");
                    return new WebResourceResponse(mime(path), null, 200, "OK", head, in);
                } catch (IOException e) {
                    return missing();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return !HOST.equals(req.getUrl().getHost()); // never leave the game
            }
        });

        if (saved == null || web.restoreState(saved) == null) web.loadUrl(START);
    }

    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found",
                new HashMap<String, String>(), new ByteArrayInputStream(new byte[0]));
    }

    private static String mime(String p) {
        String e = p.substring(p.lastIndexOf('.') + 1).toLowerCase();
        switch (e) {
            case "html": return "text/html";
            case "js": return "text/javascript";
            case "css": return "text/css";
            case "json": return "application/json";
            case "webp": return "image/webp";
            case "png": return "image/png";
            case "jpg": case "jpeg": return "image/jpeg";
            case "svg": return "image/svg+xml";
            case "mp3": return "audio/mpeg";
            case "ogg": return "audio/ogg";
            case "wav": return "audio/wav";
            case "woff2": return "font/woff2";
            default: return "application/octet-stream";
        }
    }

    /** What the game can ask of the phone. Called from JavaScript as ElGatoApp.vibrate("45,60,45"). */
    private class Bridge {
        @JavascriptInterface
        public void vibrate(String pattern) {
            try {
                String[] parts = pattern.split(",");
                long[] t = new long[Math.min(parts.length, 16) + 1];
                t[0] = 0; // the web pattern starts with a buzz, Android's with a pause
                for (int i = 1; i < t.length; i++) {
                    t[i] = Math.max(1, Math.min(2000, Long.parseLong(parts[i - 1].trim())));
                }
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v == null || !v.hasVibrator()) return;
                if (Build.VERSION.SDK_INT >= 33) {
                    v.vibrate(VibrationEffect.createWaveform(t, -1),
                            VibrationAttributes.createForUsage(VibrationAttributes.USAGE_MEDIA));
                } else if (Build.VERSION.SDK_INT >= 26) {
                    v.vibrate(VibrationEffect.createWaveform(t, -1), new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_GAME)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
                } else {
                    v.vibrate(t, -1);
                }
            } catch (Exception ignored) {
            }
        }
    }

    private void immersive() {
        if (Build.VERSION.SDK_INT >= 30) {
            android.view.WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.systemBars());
                c.setSystemBarsBehavior(
                        android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean has) {
        super.onWindowFocusChanged(has);
        if (has) immersive();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        // Back leaves a mini-game or a page for the map; on the map it closes the app.
        web.evaluateJavascript("(window.__back && window.__back()) ? 1 : 0", r -> {
            if (!"1".equals(r)) finish();
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        web.onPause(); // also silences sounds while the app is in the background
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onDestroy() {
        web.destroy();
        super.onDestroy();
    }
}
