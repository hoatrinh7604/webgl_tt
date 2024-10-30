
  var unityInstanceRef;
  var unsubscribe;
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var warningBanner = document.querySelector("#unity-warning");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }
  
  var Module = {
        setStatus: function (text) {
            if (!Module.loadingText) {
                Module.loadingText = document.getElementById('loadingText');
            }
            if (text) {
                Module.loadingText.innerHTML = text;
            }
        },
        monitorRunDependencies: function (left) {
            var totalDependencies = Module.expectedDependencies || 0;
            Module.expectedDependencies = Math.max(totalDependencies, left);
            var percentComplete = Math.round((totalDependencies - left) / totalDependencies * 100);
            Module.setStatus("Loading... " + percentComplete + "%");

            // Remove the loading text when loading is complete
            if (left === 0) {
                document.getElementById('loadingText').style.display = 'none';
            }
        }
    };
	
	// loading
	var progress = 0;  // Simulate progress for testing
        var dotCount = 1;
        var loadingInterval;
        
        function startLoadingLoop() {
            loadingInterval = setInterval(() => {
                dotCount = (dotCount % 3) + 1;  // Cycle between 1, 2, and 3 dots
                document.getElementById('dots').innerHTML = '.'.repeat(dotCount);
                
                // Simulate increasing progress (remove this in the actual project)
                progress += 1;
                if (progress >= 100) {
                    stopLoadingLoop();
                }
            }, 500);  // Update every 500ms
        }
        
        function stopLoadingLoop() {
            clearInterval(loadingInterval);
            document.getElementById('loadingText').innerHTML = "Loading complete!";
        }
        
        // Call this function to start the loading loop
        startLoadingLoop();

        // Simulate Unity's loading completion (for testing purposes)
        setTimeout(() => {
            progress = 100;
        }, 5000); 

  var buildUrl = "Build";
  var loaderUrl = buildUrl + "/WebGL.loader.js";
  var config = {
    dataUrl: buildUrl + "/WebGL.data.unityweb",
    frameworkUrl: buildUrl + "/WebGL.framework.js.unityweb",
    codeUrl: buildUrl + "/WebGL.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "CatChallenge",
    productVersion: "1.0.1.2",
    showBanner: unityShowBanner,
	cacheControl: function (url) {
  //return "immutable";
     return "no-store";
   },
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;

  render();

  loadingBar.style.display = "block";

  var script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
      //progressBarFull.style.width = 100 * progress + "%";
	  setPercentage(100 * progress);
	  //Module.setStatus("Loading... " + Math.round(progress * 100) + "%");
    }).then((unityInstance) => {
      unityInstanceRef = unityInstance;
	  stopLoadingLoop();
	  //Module.setStatus("Loading complete!");
	  //document.getElementById('loadingText').style.display = 'none';
      loadingBar.style.display = "none";
    }).catch((message) => {
      alert(message);
    });
  };
  document.body.appendChild(script);
  
  // Resize
  function render() {
	  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
		// Mobile device style: fill the whole browser client area with the game canvas:
		var meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
		document.getElementsByTagName('head')[0].appendChild(meta);
	  }
	  else{
		var ratio = 1080/2160;

		canvas.style.width  = window.innerHeight * ratio + "px";
		canvas.style.height = "100%";

		canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		canvas.width = canvas.height * ratio;
		canvas.style.position = "fixed";
		canvas.style.left = ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) / 2 - canvas.width / 2) + "px";
	  }
	};
		
	function resizeCanvas() {
	  var width = canvas.clientWidth;
	  var height = canvas.clientHeight;
	  if (canvas.width != width ||
		  canvas.height != height) {
		canvas.width = width;
		canvas.height = height;
			  
		// in this case just render when the window is resized.
		render();
	  }
	}

	window.addEventListener('resize', resizeCanvas);


const progressContainer = document.querySelector('.progress-container');

function setPercentage(pecent) {
  const percentage = pecent
  + '%';
  
  const progressEl = progressContainer.querySelector('.progress');
  //const percentageEl = progressContainer.querySelector('.percentage');
  
  progressEl.style.width = percentage;
  //percentageEl.innerText = percentage;
  //percentageEl.style.left = percentage;
}


// Caching control
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('ServiceWorker.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

            registration.addEventListener('updatefound', function() {
                const newWorker = registration.installing;

                newWorker.addEventListener('statechange', function() {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New content is available, inform the user
                            notifyUserAboutUpdate();
							//console.log('ServiceWorker Update!!!');
							//ForceReload();
                        }
                    }
                });
            });
        }).catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });

    // Listening for messages from the Service Worker
    navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data === 'newVersionAvailable') {
            notifyUserAboutUpdate();
			//console.log('ServiceWorker Update 1!!!');
			//ForceReload();
        }
    });
}

function notifyUserAboutUpdate() {
    alertAndForceUserAboutUpdate();
}

function notifyUserAboutUpdateByClickButton() {
	// Show a custom update message to the user
    const updateMessage = document.createElement('div');
    
    //updateMessage.innerText = 'New version available. Click to update!';
    updateMessage.style.position = 'fixed';
    updateMessage.style.bottom = '0';
    updateMessage.style.width = '100%';
    updateMessage.style.height = '100%';
    updateMessage.style.backgroundColor = 'transparent';
    updateMessage.style.textAlign = 'center';
    //updateMessage.style.color = '#FFFFFF';
    updateMessage.style.fontSize = '23px';
    updateMessage.style.padding = '10px';
    updateMessage.style.zIndex = '1000';
	document.body.appendChild(updateMessage);
	
	const popMessage = document.createElement('div');
	popMessage.innerText = 'New version available. Click to update!';
    popMessage.style.position = 'fixed';
    popMessage.style.bottom = '0';
    popMessage.style.width = '100%';
    popMessage.style.backgroundColor = '#29f051';
    popMessage.style.textAlign = 'center';
    popMessage.style.color = '#FFFFFF';
    popMessage.style.fontSize = '20px';
    popMessage.style.padding = '10px';
    popMessage.style.zIndex = '1000';
	
	updateMessage.appendChild(popMessage);
	
    

    updateMessage.addEventListener('click', () => {
        ForceReload();
      //alert('The application has been updated. Please clear your browser cache to ensure you have the latest version.');
    });
	
}

function alertAndForceUserAboutUpdate() {
	alert("New version available. Press OK to update!");
    ForceReload();
	
}

function ForceReload()
{
	//console.log('ServiceWorker Update 2!!!');
	if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('skipWaiting');
        }
		
		window.location.reload();
		//alert('The application has been updated. Please clear your browser cache to ensure you have the latest version.');
}

// Purchase
function sendTelegramPayment(botToken, providerToken, chatId, amount, currency) {
    const url = `https://api.telegram.org/bot${botToken}/sendInvoice`;

    const payload = JSON.stringify({
        unique_id: `${chatId}_${Date.now()}`,  // Unique payload ID
        data: '100 stars purchase'
    });

    const data = {
        chat_id: chatId,
        title: 'Buy 100 Stars',
        description: 'Purchase 100 Stars to use in the app',
        payload: payload,
        provider_token: providerToken,
        //start_parameter: 'get_100_stars',
        currency: currency,
        prices: [
            { label: '100 Stars', amount: amount }  // Define the item and its price
        ],
        photo_url: 'https://example.com/star-icon.png',  // Optional: image URL for the product
        photo_width: 512,
        photo_height: 512,
        need_shipping_address: false,  // Set true if you need the shipping address
        is_flexible: false  // Set true if the final price depends on shipping
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Payment sent:', result);
    })
    .catch(error => {
        console.error('Error sending payment:', error);
    });
}

function openInvoice(invoice_url)
{
	// Open the invoice
	try
	{
		window.Telegram.WebApp.openInvoice(invoice_url);
	}
	catch(error)
	{
		console.error(error.message);
		//console.log("TUK -- " + error.message);
		unityInstanceRef.SendMessage("GameElement", "ShowLogPopup", "Browser is not supported! Please try in the Telegram app!"); 
	}
}

window.Telegram.WebView.onEvent('invoice_closed', onInvoiceCloseCustom);

function onInvoiceCloseCustom(eventType, eventData)
{
	console.log("T-", JSON.stringify(eventData));
	if(unityInstanceRef != null)
	{
		if(eventData.status == "paid")
		{
			unityInstanceRef.SendMessage("GameElement", "OnPurchaseSuccess", JSON.stringify(eventData)); 
		}
	}
}

function isSupportStarPurchase()
{
	//if(Telegram && Telegram.WebApp.isVersionAtLeast('6.1'))
		return true;
	//return false;
}

// Ads
async function showADBanner(type)
  {
	  var data = JSON.parse(type);
	  //console.log("TUK data" + data.blockId);
	  //console.log("TUK data type" + data.type);
	  const BannerAdController = await window.Adsgram.init({ blockId: data.blockId, debug: false, debugBannerType: "FullscreenMedia" });
	  if(BannerAdController)
	  {
		  BannerAdController.show().then((result) => {
			// user watch ad till the end
			// your code to reward user
			//console.log("ADr" + result);
			
			console.log("AD Completed: " + JSON.stringify(result));
			if(unityInstanceRef)
			{
				unityInstanceRef.SendMessage("MegaADHandler", "OnRewardCompleted", JSON.stringify(data.type));
			}
			telemetreeTrackingStr("ADGram-Success|" + data.type);
			}).catch((result) => {
				// user get error during playing ad or skip ad
				// do nothing or whatever you want
				console.log("AD Failed: " + JSON.stringify(result));
				if(unityInstanceRef)
				{
					unityInstanceRef.SendMessage("MegaADHandler", "OnLoadFail", JSON.stringify(data.type));
				}
		  })
	  }
  }
  
  async function showADReward(type)
  {
	  var data = JSON.parse(type);
	  //console.log("TUK data" + data.blockId);
	  //console.log("TUK data type" + data.type);
	  const BannerAdController = await window.Adsgram.init({ blockId: data.blockId, debug: false, debugBannerType: "RewardedVideo" });
	  if(BannerAdController)
	  {
		  BannerAdController.show().then((result) => {
			// user watch ad till the end
			// your code to reward user
			//console.log("ADr" + result);
			
			console.log("AD Completed: " + JSON.stringify(result));
			if(unityInstanceRef)
			{
				unityInstanceRef.SendMessage("MegaADHandler", "OnRewardCompleted", JSON.stringify(data.type));
			}
			telemetreeTrackingStr("ADGram-Success|" + data.type);
			}).catch((result) => {
				// user get error during playing ad or skip ad
				// do nothing or whatever you want
				console.log("AD Failed: " + JSON.stringify(result));
				if(unityInstanceRef)
				{
					unityInstanceRef.SendMessage("MegaADHandler", "OnLoadFail", JSON.stringify(data.type));
				}
		  })
	  }
  }
  
  // Param
  function getLaunchParams()
{
	var launchParams = JSON.stringify(window.Telegram.WebApp);
	//console.log('launchParams = ', launchParams);
	return launchParams;
}
  
  // Tracking
  function telemetreeTrackingStr(data)
  {
	  if(telemetreeBuilder)
	  {
		  telemetreeBuilder.track(data, data);
	  }
  }
  
  function telemetreeTracking(data)
  {
	  if(telemetreeBuilder)
	  {
		  var trackingData = JSON.parse(data);
		  telemetreeBuilder.track(trackingData.t, trackingData.e);
	  }
  }
