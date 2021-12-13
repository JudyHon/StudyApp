/**
 * COMP4521 Group 25
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

package com.studyapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.Callback;

import android.widget.Toast;

public class StudyAppModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private SensorModule sensorModule;

  public StudyAppModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "StudyAppModule";
  }

  @ReactMethod
  public boolean start() {
    if (sensorModule == null) {
        sensorModule = new SensorModule(reactContext);
    }
    return sensorModule.start();
  }

  @ReactMethod
  public void stop() {
    if (sensorModule != null) {
        sensorModule.stop();
    }
  }

  @ReactMethod
  public void showToast(String message) {
    CharSequence text = message;
    int duration = Toast.LENGTH_SHORT;
    Toast toast = Toast.makeText(reactContext, text, duration);
    toast.show();
  }

}