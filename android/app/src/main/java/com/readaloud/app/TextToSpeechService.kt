package com.readaloud.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import android.widget.Toast
import java.util.*

class TextToSpeechService : Service(), TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var textToRead: String? = null
    private var languageCode: String? = null
    private val CHANNEL_ID = "ReadAloudService"
    private val NOTIFICATION_ID = 1
    private var isInitialized = false

    override fun onCreate() {
        super.onCreate()
        Log.d("TextToSpeechService", "onCreate called")
        try {
            createNotificationChannel()
            startForegroundWithNotification()
            initTextToSpeech()
        } catch (e: Exception) {
            handleError("Failed to create service", e)
        }
    }

    private fun initTextToSpeech() {
        try {
            Log.d("TextToSpeechService", "Initializing TTS")
            tts = TextToSpeech(applicationContext, this).apply {
                setOnUtteranceProgressListener(createUtteranceProgressListener())
            }
        } catch (e: Exception) {
            handleError("Failed to initialize TTS", e)
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                val name = "ReadAloud Service"
                val descriptionText = "Text-to-speech service"
                val importance = NotificationManager.IMPORTANCE_LOW
                val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                    description = descriptionText
                    setSound(null, null)
                    enableLights(false)
                    enableVibration(false)
                }
                val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.createNotificationChannel(channel)
                Log.d("TextToSpeechService", "Notification channel created")
            } catch (e: Exception) {
                handleError("Failed to create notification channel", e)
            }
        }
    }

    private fun startForegroundWithNotification() {
        try {
            val notification = createNotification("Initializing text to speech...")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
            Log.d("TextToSpeechService", "Started foreground service")
        } catch (e: Exception) {
            handleError("Failed to start foreground service", e)
        }
    }

    private fun createNotification(text: String): Notification {
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            Notification.Builder(this)
        }

        return builder
            .setContentTitle("ReadAloud")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .setAutoCancel(false)
            .build()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("TextToSpeechService", "onStartCommand called")
        try {
            val text = intent?.getStringExtra("text")
            languageCode = intent?.getStringExtra("language") ?: Locale.getDefault().language
            
            if (text.isNullOrEmpty()) {
                handleError("No text provided")
                return START_NOT_STICKY
            }
            textToRead = text
            Log.d("TextToSpeechService", "Received text to read: ${text.take(50)}... in language: $languageCode")
            
            if (isInitialized) {
                speakText()
            } else {
                Log.d("TextToSpeechService", "TTS not initialized yet, will speak when ready")
            }
        } catch (e: Exception) {
            handleError("Error in onStartCommand", e)
        }
        return START_NOT_STICKY
    }

    override fun onInit(status: Int) {
        Log.d("TextToSpeechService", "onInit called with status: $status")
        if (status == TextToSpeech.SUCCESS) {
            try {
                tts?.let { tts ->
                    // First try the selected/default language
                    var locale = try {
                        Locale(languageCode ?: Locale.getDefault().language)
                    } catch (e: Exception) {
                        Log.e("TextToSpeechService", "Error creating locale, falling back to system default", e)
                        Locale.getDefault()
                    }

                    // Try to set the language
                    var result = tts.setLanguage(locale)
                    
                    // If the language is not available, try system default
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        Log.w("TextToSpeechService", "Selected language not available: ${locale.language}, trying system default")
                        locale = Locale.getDefault()
                        result = tts.setLanguage(locale)
                    }

                    // If system default also fails, try English as last resort
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        Log.w("TextToSpeechService", "System default language not available: ${locale.language}, trying English")
                        locale = Locale.US
                        result = tts.setLanguage(locale)
                    }

                    when (result) {
                        TextToSpeech.LANG_MISSING_DATA -> {
                            handleError("Language data is missing for all attempted languages")
                            return
                        }
                        TextToSpeech.LANG_NOT_SUPPORTED -> {
                            handleError("No supported language available")
                            return
                        }
                        else -> {
                            Log.d("TextToSpeechService", "Language set successfully to: ${locale.displayLanguage}")
                            isInitialized = true
                            speakText()
                        }
                    }
                } ?: run {
                    handleError("TTS is null after initialization")
                }
            } catch (e: Exception) {
                handleError("Error in onInit", e)
            }
        } else {
            handleError("Failed to initialize TextToSpeech with status: $status")
        }
    }

    private fun createUtteranceProgressListener() = object : UtteranceProgressListener() {
        override fun onStart(utteranceId: String?) {
            Log.d("TextToSpeechService", "Started speaking")
            updateNotification("Reading text aloud...")
        }

        override fun onDone(utteranceId: String?) {
            Log.d("TextToSpeechService", "Finished speaking")
            stopSelf()
        }

        override fun onError(utteranceId: String?) {
            handleError("Error while speaking")
        }
    }

    private fun updateNotification(text: String) {
        try {
            val notification = createNotification(text)
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(NOTIFICATION_ID, notification)
        } catch (e: Exception) {
            handleError("Failed to update notification", e)
        }
    }

    private fun speakText() {
        try {
            val text = textToRead
            if (text.isNullOrEmpty()) {
                handleError("No text to speak")
                return
            }

            Log.d("TextToSpeechService", "Speaking text: ${text.take(50)}...")
            val params = HashMap<String, String>().apply {
                put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "messageId")
            }
            
            val result = tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params)
            if (result == TextToSpeech.ERROR) {
                handleError("Failed to speak text")
            }
        } catch (e: Exception) {
            handleError("Error in speakText", e)
        }
    }

    private fun handleError(message: String, e: Exception? = null) {
        val fullMessage = if (e != null) "$message: ${e.message}" else message
        Log.e("TextToSpeechService", fullMessage, e)
        showToast(message)
        stopSelf()
    }

    private fun showToast(message: String) {
        try {
            Toast.makeText(applicationContext, message, Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Log.e("TextToSpeechService", "Failed to show toast", e)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        Log.d("TextToSpeechService", "onDestroy called")
        try {
            tts?.stop()
            tts?.shutdown()
            super.onDestroy()
        } catch (e: Exception) {
            Log.e("TextToSpeechService", "Error in onDestroy", e)
        }
    }
} 