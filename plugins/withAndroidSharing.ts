import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withAndroidSharing: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    
    if (!androidManifest.application?.[0]) {
      return config;
    }

    const mainApplication = androidManifest.application[0];

    if (!mainApplication.activity) {
      mainApplication.activity = [];
    }

    const mainActivity = mainApplication.activity.find(
      (activity: any) => activity.$['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      if (!mainActivity['intent-filter']) {
        mainActivity['intent-filter'] = [];
      }

      // Add intent filter for SEND action
      mainActivity['intent-filter'].push({
        action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        data: [{ $: { 'android:mimeType': 'text/*' } }]
      });

      // Add intent filter for SEND_MULTIPLE action
      mainActivity['intent-filter'].push({
        action: [{ $: { 'android:name': 'android.intent.action.SEND_MULTIPLE' } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        data: [{ $: { 'android:mimeType': 'text/*' } }]
      });
    }

    return config;
  });
};

export default withAndroidSharing; 