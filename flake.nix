{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixpkgs-unstable";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
    };
    android-nixpkgs.url = "github:tadfisher/android-nixpkgs";
  };

  outputs =
    { self
    , nixpkgs
    , flake-utils
    , android-nixpkgs
    , ...
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let

      pkgs = import nixpkgs {
        inherit system;
        config = {
          android_sdk.accept_license = true;
          allowUnfree = true;
        };
      };
      corepackEnable = pkgs.runCommand "corepack-enable" { } ''
        mkdir -p $out/bin
        ${pkgs.nodejs_20}/bin/corepack enable --install-directory $out/bin
      '';
      pinnedJDK = pkgs.jdk17;
      buildToolsVersion = "34.0.0";
      ndkVersion = "25.1.8937393";
      androidComposition = pkgs.androidenv.composeAndroidPackages {
        cmdLineToolsVersion = "8.0";
        toolsVersion = "26.1.1";
        platformToolsVersion = "34.0.4";
        buildToolsVersions = [ buildToolsVersion "33.0.1" ];
        includeEmulator = false;
        emulatorVersion = "30.3.4";
        platformVersions = [ "34" ];
        includeSources = false;
        includeSystemImages = false;
        systemImageTypes = [ "google_apis_playstore" ];
        abiVersions = [ "armeabi-v7a" "arm64-v8a" ];
        cmakeVersions = [ "3.10.2" "3.22.1" ];
        includeNDK = true;
        ndkVersions = [ ndkVersion ];
        useGoogleAPIs = false;
        useGoogleTVAddOns = false;
        includeExtras = [
          "extras;google;gcm"
        ];
      };
      sdk = androidComposition.androidsdk;
    in
    {
      formatter = pkgs.alejandra;

      devShells = {
        default = pkgs.mkShell rec {
          buildInputs = with pkgs; [
            nodejs_20
            corepackEnable
            pinnedJDK
            sdk
            pkg-config
          ];
          JAVA_HOME = pinnedJDK;
          ANDROID_SDK_ROOT = "${androidComposition.androidsdk}/libexec/android-sdk";
          ANDROID_NDK_ROOT = "${ANDROID_SDK_ROOT}/ndk-bundle";

          GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_SDK_ROOT}/build-tools/${buildToolsVersion}/aapt2";
        };
      };
    });
}
