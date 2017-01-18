Page({
  data: {
    tracking: true,
    result: {},
    titleInfo: {}
  },
  onLoad: function (option) {
    var that = this;
    //console.log(option.n);
    wx.request({
      url: '/pages/track/mock_data.json',
      data: {
        account: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
      }
    });

    switch (data.Status) {
      case 'Delivered':
        that.setData({ titleInfo: { css: 'track-success', iconType: 'success' } });
        break;
      case 'Expired':
      case 'DeliverFailed':
        that.setData({ titleInfo: { css: 'track-error', iconType: 'warn' } });
        break;
      case 'Transit':
      case 'PickUp':
        that.setData({ titleInfo: { css: 'track-info', iconType: 'waiting' } });
        break
      default:
        that.setData({ titleInfo: { css: 'track-null', iconType: 'clear' } });
        break;
    }

    that.setData({ result: data });

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
                  console.log('remove success: ' + key);
                }
              });
            }
          }
        }
      }
    });

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
});

var data = {
  TrackingNumber: "1Z7500R0396832623",
  Status: "None",
  StatusDescription: "--",
  Exception: "NumberRuleNotMatch",
  Original: {
    Country: {
      CountryCode: null,
      CountryCnName: null,
      CountryEnName: null
    },
    Carrire: {
      Code: null,
      Type: null,
      Name: null,
      Url: null,
      Language: null
    },
    Status: "None",
    Exception: "NumberRuleNotMatch",
    SearchElapsed: null,
    CachedTime: null,
    Events: [],
    MatchedCarriers: [
      ""
    ]
  },
  Destination: {
    Country: {
      CountryCode: null,
      CountryCnName: null,
      CountryEnName: null
    },
    Carrire: {
      Code: null,
      Type: null,
      Name: null,
      Url: null,
      Language: null
    },
    Status: "None",
    Exception: "None",
    SearchElapsed: null,
    CachedTime: null,
    Events: [],
    MatchedCarriers: null
  },
  DeliverElapsed: null,
  Duration: ""
};
var data2 =
  {
    TrackingNumber: "1Z7500RA0396832623",
    Status: "Delivered",
    StatusDescription: "成功签收",
    Exception: "None",
    Original: {
      Country: {
        CountryCode: "US",
        CountryCnName: "美国",
        CountryEnName: "United States"
      },
      Carrire: {
        Code: "UPS",
        Type: "Express",
        Name: "UPS",
        Url: "http://www.ups.com/",
        Language: "en-us"
      },
      Status: "Delivered",
      Exception: "None",
      SearchElapsed: 1598,
      CachedTime: null,
      Events: [
        {
          Time: "2017-01-10 13:27:00",
          Location: "BRONX, NY, US",
          Event: "Delivered"
        },
        {
          Time: "2017-01-10 06:40:00",
          Location: "Bronx, NY, US",
          Event: "Out for Delivery"
        },
        {
          Time: "2017-01-10 03:34:00",
          Location: null,
          Event: "Arrival Scan"
        },
        {
          Time: "2017-01-10 03:05:00",
          Location: "Maspeth, NY, US",
          Event: "Departure Scan"
        },
        {
          Time: "2017-01-09 23:41:00",
          Location: "Maspeth, NY, US",
          Event: "Arrival Scan"
        },
        {
          Time: "2017-01-09 21:59:00",
          Location: "Hamilton, NJ, US",
          Event: "Departure Scan"
        },
        {
          Time: "2017-01-09 17:40:00",
          Location: null,
          Event: "Collection Scan"
        },
        {
          Time: "2017-01-09 16:19:00",
          Location: "US",
          Event: "Order Processed: Ready for UPS"
        }
      ],
      MatchedCarriers: [
        "UPS"
      ]
    },
    Destination: {
      Country: {
        CountryCode: null,
        CountryCnName: null,
        CountryEnName: null
      },
      Carrire: {
        Code: null,
        Type: null,
        Name: null,
        Url: null,
        Language: null
      },
      Status: "None",
      Exception: "None",
      SearchElapsed: null,
      CachedTime: null,
      Events: [],
      MatchedCarriers: null
    },
    DeliverElapsed: 1268,
    Duration: "21小时"
  };
var data1 =
  {
    TrackingNumber: "LX255744009CN",
    Status: "Transit",
    StatusDescription: "运输途中",
    Exception: "None",
    Original: {
      Country: {
        CountryCode: "CN",
        CountryCnName: "中国",
        CountryEnName: "China"
      },
      Carrire: {
        Code: "ChinaPostEub",
        Type: "Post",
        Name: "国际e邮宝",
        Url: "http://www.ems.com.cn",
        Language: "zh-cn"
      },
      Status: "Transit",
      Exception: "None",
      SearchElapsed: 9281,
      CachedTime: null,
      Events: [
        {
          Time: "2017-01-15 08:54:29",
          Location: 'UIUIU',
          Event: "离开厦门市 发往悉尼（经转）"
        },
        {
          Time: "2017-01-14 22:17:00",
          Location: "泉州市",
          Event: "泉州市速递物流分公司国际业务部已收件（揽投员姓名：黄金良,联系电话:13599147122）"
        }
      ],
      MatchedCarriers: [
        "ChinaPostEub"
      ]
    },
    Destination: {
      Country: {
        CountryCode: "AU",
        CountryCnName: "澳大利亚",
        CountryEnName: "Australia"
      },
      Carrire: {
        Code: "AustraliaPost",
        Type: "Post",
        Name: "澳大利亚邮政",
        Url: "http://auspost.com.au/",
        Language: "en-au"
      },
      Status: "Transit",
      Exception: "None",
      SearchElapsed: 2704,
      CachedTime: null,
      Events: [
        {
          Time: "2017-01-15 08:20:00",
          Location: "XIAMEN (CN)",
          Event: "Processed through facility"
        },
        {
          Time: "2017-01-14 22:17:00",
          Location: "CN-362051, CHINA",
          Event: "Received by overseas carrier"
        }
      ],
      MatchedCarriers: [
        "AustraliaPost"
      ]
    },
    DeliverElapsed: 637,
    Duration: "11小时"
  };