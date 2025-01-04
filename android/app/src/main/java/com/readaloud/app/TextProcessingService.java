package com.readaloud.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class TextProcessingService extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        CharSequence text = getIntent().getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
        if (text != null) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("PROCESSED_TEXT", text.toString());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(intent);
        }
        
        finish();
    }
} 