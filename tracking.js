
  function tracking(data)
  {
	  if(telemetreeBuilder)
	  {
		  var trackingData = JSON.parse(data);
		  telemetreeBuilder.track(trackingData.t, trackingData.e);
	  }
  }
  
  function jsTracking(data)
  {
	  if(telemetreeBuilder)
	  {
		  telemetreeBuilder.track(data, data);
	  }
  }
