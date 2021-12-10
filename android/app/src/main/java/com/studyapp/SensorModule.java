package com.studyapp;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import androidx.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SensorModule implements SensorEventListener {
    private SensorManager sensorManager;
    private Sensor lightSensor;
    private boolean isRegistered = false;

    private ReactContext reactContext;


    public SensorModule(ReactApplicationContext reactContext) {
        this.sensorManager = (SensorManager)reactContext.getSystemService(reactContext.SENSOR_SERVICE);
        this.lightSensor = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
        this.reactContext = reactContext;
    }

    public boolean start() {
        if (lightSensor != null && isRegistered == false) {
            sensorManager.registerListener(this, lightSensor, SensorManager.SENSOR_DELAY_UI);
            isRegistered = true;
            return true;
        }
        return false;
    }

    public void stop() {
        if (isRegistered == true) {
            sensorManager.unregisterListener(this);
            isRegistered = false;
        }
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    float[] mLight;

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        Sensor sensor = sensorEvent.sensor;
        WritableMap map = Arguments.createMap();

        if (sensor.getType() == Sensor.TYPE_LIGHT)
            mLight = sensorEvent.values;
        if (mLight != null) {
            map.putDouble("light", mLight[0]);
            sendEvent("LightSensor", map);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}