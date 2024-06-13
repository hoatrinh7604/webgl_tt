const tonUnitySdkManager = new TON_UNITY_SDK.TonUnitySdkManager({
  tonConnectUiCreateOptions: {
    manifestUrl:
      "https://demo-dapp.walletbot.net/demo-dapp/tonconnect-manifest.json",
  },
});

tonUnitySdkManager.callFunction("connectWallet");
