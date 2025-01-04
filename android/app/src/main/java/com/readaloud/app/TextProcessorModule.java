package com.readaloud.app;

import android.app.Activity;
import android.content.Intent;
import expo.modules.kotlin.modules.Module;
import expo.modules.kotlin.modules.ModuleDefinition;

public class TextProcessorModule extends Module {
  @Override
  public void definition(ModuleDefinition definition) {
    definition.name("TextProcessor");

    definition.function("handleProcessedText", (String text) -> {
      Activity activity = getAppContext().getCurrentActivity();
      if (activity != null) {
        Intent intent = new Intent(activity, MainActivity.class);
        intent.putExtra("PROCESSED_TEXT", text);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        activity.startActivity(intent);
      }
      return null;
    });
  }
} 