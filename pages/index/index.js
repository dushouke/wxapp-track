//index.js
Page({
  data: {
    histories: [],
    historyLongTouch: false
  },
  track: function (e) {
    wx.navigateTo({
      url: '../track/track?n=' + e.detail.value
    });
  },
  historyTouchstart: function (e) {
    this.setData({ historyLongTouch: false });
  },
  trackHistory: function (e) {
    if (this.data.historyLongTouch) {
      return;
    }

    wx.navigateTo({
      url: '../track/track?n=' + e.currentTarget.dataset.number
    });
  },
  scanNumber: function (e) {
    wx.scanCode({
      success: (res) => {
        wx.navigateTo({
          url: '../track/track?n=' + res.result
        });
      }
    })
  },
  showActon: function (e) {
    this.setData({ historyLongTouch: true });

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
              }
              else {
                removeKey = item.unique;
              }
            }
            that.setData({ 'histories': histories });

            if (removeKey) {
              wx.removeStorageSync(removeKey);
            }
          } catch (e) {
          }
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

            switch (data.Status) {
              case 'Delivered':
                data.css = "track-success";
                data.iconType = "success";
                break;
              case 'Expired':
              case 'DeliverFailed':
                data.css = "track-error";
                data.iconType = "warn";
                break;
              case 'Transit':
              case 'PickUp':
                data.css = "track-info";
                data.iconType = "waiting";
                break
              default:
                data.css = "track-null";
                data.iconType = "clear";
                break;
            };

            histories.push(data);
          }
        } catch (e) {
          //
        }
      }

      that.setData({ histories: histories });
    } catch (e) {
      //
    }
  }
})
