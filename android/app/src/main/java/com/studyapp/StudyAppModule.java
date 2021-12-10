package com.studyapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.Callback;

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

}