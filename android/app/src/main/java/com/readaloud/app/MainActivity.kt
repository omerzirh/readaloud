package com.readaloud.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.content.Context
import org.json.JSONObject
import java.util.Locale

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  private val PERMISSION_REQUEST_CODE = 123
  private var pendingSharedText: String? = null

  private fun getSelectedLanguage(): String {
    try {
      val prefs = applicationContext.getSharedPreferences("readaloud", Context.MODE_PRIVATE)
      val ttsSettings = prefs.getString("@AsyncStorage:ttsSettings", null)
      if (ttsSettings != null) {
        val json = JSONObject(ttsSettings)
        return json.getString("language").split("-")[0]
      }
    } catch (e: Exception) {
      Log.e("MainActivity", "Error reading language from AsyncStorage", e)
    }
    return Locale.getDefault().language
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    try {
      if (handleSharedText(intent)) {
        finish()
        return
      }
      setTheme(R.style.AppTheme)
      super.onCreate(null)
    } catch (e: Exception) {
      Log.e("MainActivity", "Error in onCreate", e)
      showError("Failed to handle shared text")
      finish()
    }
  }

  override fun onNewIntent(intent: Intent?) {
    try {
      if (handleSharedText(intent)) {
        finish()
        return
      }
      super.onNewIntent(intent)
    } catch (e: Exception) {
      Log.e("MainActivity", "Error in onNewIntent", e)
      showError("Failed to handle shared text")
      finish()
    }
  }

  private fun handleSharedText(intent: Intent?): Boolean {
    try {
      Log.d("MainActivity", "Handling intent: ${intent?.action}")
      if (intent?.action == Intent.ACTION_SEND && intent.type?.startsWith("text/") == true) {
        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
        if (sharedText.isNullOrEmpty()) {
          showError("No text received")
          return true
        }
        
        Log.d("MainActivity", "Received shared text: ${sharedText.take(50)}...")
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          if (checkNotificationPermission()) {
            startTTSService(sharedText)
          } else {
            pendingSharedText = sharedText
            requestNotificationPermission()
          }
        } else {
          startTTSService(sharedText)
        }
        return true
      }
      return false
    } catch (e: Exception) {
      Log.e("MainActivity", "Error handling shared text", e)
      showError("Failed to process shared text")
      return true
    }
  }

  private fun checkNotificationPermission(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      ContextCompat.checkSelfPermission(
        this,
        Manifest.permission.POST_NOTIFICATIONS
      ) == PackageManager.PERMISSION_GRANTED
    } else {
      true
    }
  }

  private fun requestNotificationPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      ActivityCompat.requestPermissions(
        this,
        arrayOf(Manifest.permission.POST_NOTIFICATIONS),
        PERMISSION_REQUEST_CODE
      )
    }
  }

  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<out String>,
    grantResults: IntArray
  ) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    if (requestCode == PERMISSION_REQUEST_CODE) {
      if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        pendingSharedText?.let { startTTSService(it) }
      } else {
        showError("Notification permission is required for background reading")
      }
      pendingSharedText = null
      finish()
    }
  }

  private fun startTTSService(text: String) {
    val serviceIntent = Intent(applicationContext, TextToSpeechService::class.java).apply {
      putExtra("text", text)
      val language = getSelectedLanguage()
      Log.d("MainActivity", "Using language from storage: $language")
      putExtra("language", language)
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      startForegroundService(serviceIntent)
    } else {
      startService(serviceIntent)
    }
  }

  private fun showError(message: String) {
    try {
      Toast.makeText(applicationContext, message, Toast.LENGTH_SHORT).show()
    } catch (e: Exception) {
      Log.e("MainActivity", "Failed to show error toast", e)
    }
  }

  override fun getMainComponentName(): String = "main"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              super.invokeDefaultOnBackPressed()
          }
          return
      }
      super.invokeDefaultOnBackPressed()
  }
}
