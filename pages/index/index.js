var common = require('../../utils/util.js');

Page({
  data: {
    histories: [],
    historyLongTouch: false
  },
  onShareAppMessage: function () {
    return {
      title: '国际包裹查询工具',
      desc: '',
      path: '/pages/index/index'
    }
  },
  track: function (e) {
    toTrackPage(e.detail.value);
  },
  historyTouchstart: function (e) {
    this.setData({
      historyLongTouch: false
    });
  },
  trackHistory: function (e) {
    if (this.data.historyLongTouch) {
      return;
    }

    toTrackPage(e.currentTarget.dataset.number);
  },
  scanNumber: function (e) {
    wx.scanCode({
      success: function (res) {
        toTrackPage(res.result);
      }
    })
  },
  showActon: function (e) {
    this.setData({
      historyLongTouch: true
    });

    var that = this,
      n = e.currentTarget.dataset.number;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: 'red',
      success: function (res) {
        if (res.tapIndex === 0) {
          try {
            var histories = [],
              removeKey = null;
            for (var i in that.data.histories) {
              var item = that.data.histories[i];
              if (item.TrackingNumber !== n) {
                histories.push(item);
              } else {
                removeKey = item.unique;
              }
            }
            that.setData({
              'histories': histories
            });

            if (removeKey) {
              wx.removeStorageSync(removeKey);
            }
          } catch (e) {}
        }
      }
    });
  },
  onShow: function () {
    var that = this;
    try {
      var res = wx.getStorageInfoSync(),
        keys = res.keys,
        histories = [];

      for (var i in keys.reverse()) {
        var key = keys[i]

        if (!key.startsWith('TN::')) {
          continue;
        }

        try {
          var data = wx.getStorageSync(key);
          if (data) {
            data.unique = key;

            var trackStateStyle = common.trackStateStyle(data.Status);
            data.css = trackStateStyle.css;
            data.iconType = trackStateStyle.iconType;

            histories.push(data);
          }
        } catch (e) {
          //
        }
      }

      that.setData({
        histories: histories
      });
    } catch (e) {
      //
    }
  }
});

function toTrackPage(number) {
  if (!number) {
    wx.showToast({
      title: '输入不能为空。',
      duration: 1500,
      icon:'warn'
    });

    return;
  }
  wx.navigateTo({
    url: '../track/track?n=' + number
  });
}