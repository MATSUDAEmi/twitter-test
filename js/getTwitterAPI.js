// Generated by CoffeeScript 1.12.3
(function() {
  var TwitterAPIonBrowser,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TwitterAPIonBrowser = (function() {
    function TwitterAPIonBrowser(oauthKeys) {
      this.get = bind(this.get, this);
      this.parameters = {
        oauth_signature_method: 'HMAC-SHA1',
        oauth_consumer_key: oauthKeys.consumerKey,
        oauth_token: oauthKeys.accessToken
      };
      this.secret = {
        consumerSecret: oauthKeys.consumerSecret,
        tokenSecret: oauthKeys.accessTokenSecret
      };
    }

    TwitterAPIonBrowser.prototype.get = function(api, apiParams, callback) {
      var headTag, k, message, ref, reqParams, scriptTag, tmpCallback, v;
      tmpCallback = "__twitter_api_on_browser_" + (Number(new Date()));
      reqParams = {};
      ref = this.parameters;
      for (k in ref) {
        v = ref[k];
        reqParams[k] = v;
      }
      for (k in apiParams) {
        v = apiParams[k];
        reqParams[k] = v;
      }
      reqParams.callback = tmpCallback;
      api = "https://api.twitter.com/1.1/" + api + ".json";
      message = {
        method: 'GET',
        action: api,
        parameters: reqParams
      };
      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, this.secret);
      scriptTag = document.createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.src = OAuth.addToURL(api, reqParams);
      window[tmpCallback] = function(data) {
        callback(data);
        return setTimeout(function() {
          var e;
          scriptTag.parentNode.removeChild(scriptTag);
          try {
            return delete window[tmpCallback];
          } catch (error) {
            e = error;
            return window[tmpCallback] = void 0;
          }
        }, 1000);
      };
      scriptTag.onerror = function() {
        return callback();
      };
      headTag = document.getElementsByTagName('head').item(0);
      return headTag.appendChild(scriptTag);
    };

    return TwitterAPIonBrowser;

  })();

  this.TwitterAPIonBrowser = TwitterAPIonBrowser;

}).call(this);
