var TRACK_STORAGE_KEY_PREFIX = "TN::";

function trackStateStyle(status) {
    var result = {};

    switch (status) {
        case 'Delivered':
            result = {
                css: 'track-success',
                iconType: 'success'
            };
            break;
        case 'Expired':
        case 'DeliverFailed':
            result = {
                css: 'track-error',
                iconType: 'warn'
            };
            break;
        case 'Transit':
        case 'PickUp':
            result = {
                css: 'track-info',
                iconType: 'waiting'
            };
            break
        default:
            result = {
                css: 'track-null',
                iconType: 'clear'
            };
            break;
    }

    return result;
}

module.exports.trackStateStyle = trackStateStyle;
module.exports.TRACK_STORAGE_KEY_PREFIX = TRACK_STORAGE_KEY_PREFIX;