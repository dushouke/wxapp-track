var common = require('../../utils/util.js');
var mockDatas = require('../../utils/mock_datas.js');
Page({
  data: {
    number: null,
    tracking: true,
    result: {},
    titleInfo: {}
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.number,
      desc: '快递：' + that.data.number + '的跟踪信息。',
      path: '/pages/track/track?n=' + that.data.number
    }
  },
  onPullDownRefresh: function () {
    if (this.data.tracking) {
      wx.stopPullDownRefresh();
      return;
    }

    callTrackApi(this, 'PullDownRefresh');
  },
  onLoad: function (option) {
    if (!option.n) {
      return;
    }

    var that = this;

    //console.log(option.n);
    that.setData({
      number: option.n
    });

    setTimeout(function () {
      callTrackApi(that);
    }, 5000);

  }
});

function callTrackApi(that, on) {
  wx.request({
    url: '/pages/track/mock_data.json',
    data: {
      account: ''
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      that.setData({
        tracking: false
      });
      if (on === 'PullDownRefresh') {
        wx.stopPullDownRefresh();
      }

      handleTracData(that, res.data);
      console.log(res.data);

    },
    fail: function (res) {
      that.setData({
        tracking: false
      });
      if (on === 'PullDownRefresh') {
        wx.stopPullDownRefresh();
      }

      if (getApp().globalData.mockData) {
        var data = mockDatas[parseInt((Math.random() * 10) % 3)];
        handleTracData(that, data);
      }
      console.log(res);
    }
  });
}

function handleTracData(that, data) {

  var titleInfo = common.trackStateStyle(data.Status);
  that.setData({
    titleInfo: titleInfo
  });

  that.setData({
    result: data
  });

  //ensure max history
  wx.getStorageInfo({
    success: function (res) {
      var keys = res.keys;

      var tnCount = 0;
      for (var i in keys.reverse()) {
        var key = keys[i];

        if (key.startsWith('TN::')) {
          tnCount++;

          if (tnCount >= 10) {
            wx.removeStorage({
              key: key,
              success: function (res) {
                //console.log('remove success: ' + key);
              }
            });
          }
        }
      }
    }
  });

  //story history
  wx.setStorage({
    key: 'TN::' + data.TrackingNumber,
    data: {
      TrackingNumber: data.TrackingNumber,
      Status: data.Status,
      Original: {
        CountryCnName: data.Original.Country.CountryCnName,
        CarrireName: data.Original.Carrire.Name
      },
      Destination: {
        CountryCnName: data.Destination.Country.CountryCnName,
        CarrireName: data.Destination.Carrire.Name
      },
      LastEvent: data.Destination.Events.length === 0 ? (data.Original.Events.length === 0 ? null : data.Original.Events[0]) : data.Destination.Events[0]
    }
  });

}