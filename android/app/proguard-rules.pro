# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep JavascriptInterface methods for WebView bridge (AndroidTTS & Capacitor)
-keepattributes *Annotation*,JavascriptInterface
-keepattributes Signature,InnerClasses,EnclosingMethod
-keepattributes SourceFile,LineNumberTable

-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep public class cz.fila73.familycalc.** { *; }
-keep class com.getcapacitor.** { *; }

