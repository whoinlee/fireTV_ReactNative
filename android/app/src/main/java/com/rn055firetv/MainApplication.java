package com.rn055firetv;

import android.app.Application;

import com.facebook.react.ReactApplication;
//-- commented out by WhoIN, for testing, on 06/11/18
//import com.github.kevinejohn.keyevent.KeyEventPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
//import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage()
      );
    }

      //-- commented out by WhoIN, for testing, on 06/11/18
      //new KeyEventPackage() ---> this goes inside of the List object :: https://www.npmjs.com/package/react-native-keyevent

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
      //-- commented out by WhoIN, for testing, on 06/11/18
//    SoLoader.init(this, /* native exopackage */ false);
  }
}
