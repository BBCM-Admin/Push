/*pub-5207971588252467
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var admobid = {};
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		initAd();
        var pushNotification = window.plugins.pushNotification;
		
        //pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"363747113879","ecb":"app.onNotificationGCM"});
		try{
			alert(device.platform);		
		} catch(e){
			alert(e.message);
		}
		if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
			//alert("We have Android");
			pushNotification.register(
			app.successHandler,
			app.errorHandler,
			{
				"senderID":"363747113879",
				"ecb":"app.onNotificationGCM"
			});
		} else if ( device.platform == 'blackberry10'){
			/*pushNotification.register(
			successHandler,
			errorHandler,
			{
				invokeTargetId : "replace_with_invoke_target_id",
				appId: "replace_with_app_id",
				ppgUrl:"replace_with_ppg_url", //remove for BES pushes
				ecb: "pushNotificationHandler",
				simChangeCallback: replace_with_simChange_callback,
				pushTransportReadyCallback: replace_with_pushTransportReady_callback,
				launchApplicationOnPush: true
			});*/
		} else { //iOS
			//alert("We have iOS");
			pushNotification.register(
			app.tokenHandler,
			app.errorHandler,
			{
				"badge":"true",
				"sound":"true",
				"alert":"true",
				"ecb":"app.onNotificationAPN"
			});
		}

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		
		alert('Received Event: ' + id);
	
        console.log('Received Event: ' + id);
    },
	
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Callback Success! Result = '+result)
    },
	
	tokenHandler: function(result) {
		//for iOS
        alert('device token = ' + result);	
		  
		 $.ajax({
			type : "POST",
			url : "http://tops.tuthill.com/cssp/test.cfm?passthrough=true",
			data: { token: result },
			beforeSend : function() {
				  alert("Sending Token...");
			},
			success : function(response) {
				alert("Token Sent");
			}
		});		  
    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    },
	onNotificationAPN: function(event) {//iOS
        if ( event.alert )
		{
			navigator.notification.alert(event.alert);
		}
	
		if ( event.sound )
		{
			var snd = new Media(event.sound);
			snd.play();
		}
	
		if ( event.badge )
		{
			pushNotification.setApplicationIconBadgeNumber(app.successHandler, app.errorHandler, event.badge);
		}
    }	
	
	if( /(android)/i.test(navigator.userAgent) ) { 
		admobid = { // for Android
			banner: 'pub-5207971588252467/5956070865',
			interstitial: 'pub-6869992474017983/5956070865'
		};
	} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
		admobid = { // for iOS
			banner: 'pub-5207971588252467/5956070865',
			interstitial: 'pub-5207971588252467/5956070865'
		};
	} else {
		admobid = { // for Windows Phone
			banner: 'pub-5207971588252467/5956070865',
			interstitial: 'pub-5207971588252467/5956070865'
		};
	}
	
	function initAd(){
		
		 var defaultOptions = {
            // bannerId: admobid.banner,
            // interstitialId: admobid.interstitial,
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            bgColor: 'black', // color name, or '#RRGGBB'
            // x: integer,		// valid when set position to 0 / POS_XY
            // y: integer,		// valid when set position to 0 / POS_XY
            isTesting: true, // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        };
        AdMob.setOptions( defaultOptions );
		alert(admobid.banner);
		// it will display smart banner at top center, using the default options
		if(AdMob) AdMob.createBanner( admobid.banner );	
	}
};
