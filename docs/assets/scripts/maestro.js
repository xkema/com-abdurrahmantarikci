// JavaScript Document
// Copyright (c) 2011 Kemal Yılmaz. All rights reserved.
// http://kemalyilmaz.com
//
// related site: https://abdurrahmantarikci.com/

$(document).ready(function () {
    var _siteRootPath = 'https://abdurrahmantarikci.com//';
    _indexPageName = '';
    var _indexPageNameShort = 'index'; /*__redirect(_indexPageNameShort,_siteRootPath);*/
    _api_images_1 = [];
    _api_titles_1 = [];
    _api_descriptions_1 = [];
    __createGalleries();
    __initializeWebsiteDOM();
    $(window).resize(function (e) {
        __contentScreenReadability($(this));
    });
    $('#navigation a').not('.link-imece').on('click', function (e) {
        var _target = '#/' + $(this).attr('href').split('.')[0];

        if (_target == '#/#fotograflar') {
            $.prettyPhoto.open(_api_images_1, _api_titles_1, _api_descriptions_1);
            return false;
        }
        if ((_target == '#/' + _indexPageNameShort) || (_target == '#/#')) {
            _target = '#/home';
        }
        $.bbq.pushState(_target);
        return false;
    });
    $(window).bind('hashchange', function (e) {
        if (window.location.hash) {
            var _target = window.location.hash.replace(/#\//, '');
            if (_target == '#!prettyPhoto') {
                return false;
            }
        } else {
            var _splitArray = window.location.href.split('/');
            var _currentPage = _splitArray[_splitArray.length - 1].split('.')[0];
            if (_currentPage != _indexPageNameShort && _currentPage != '') {
                window.location = _siteRootPath + _indexPageName + '#/' + _currentPage;
                return false;
            }
            var _target = 'home';
        }
        __loadRemotePage(_target, 'html');
    });
    $(window).trigger('hashchange');
});
$(window).load(function () {});

function __initializeWebsiteDOM() {
    $('img').mousedown(function (e) {
        e.preventDefault();
    });
    __contentScreenReadability($(window));
    $('#content-screen').ajaxError(function (e, jqXHR, ajaxSettings, thrownError) {
        $('#content-load-spinner').hide();
        var _notFoundPage = ajaxSettings.url.split('?')[0];
        if (ajaxSettings.dataType == 'script') {
            __showLogScreen('Error : Failed to load page script(s). Some parts of the page may not work as expected.');
        }
        if (ajaxSettings.dataType == 'html') {
            __showLogScreen('Error : Failed to load remote data from "' + _notFoundPage + '" Some parts of the page may not seem as expected.');
        }
    });
}
function __redirect(indexPageName, siteRoot) {
    var _cSplitArray = window.location.href.split('/');
    var _cPage = _cSplitArray[_cSplitArray.length - 1].split('.')[0];
    if (_cPage == indexPageName) {
        window.location = siteRoot;
        return false;
    }
}
function __loadRemotePage(target, extension) {
    if (target == 'home') {
        $('#content-load-spinner').show();
        __toggleNamesAndSocialHolder('show');
        $('#content-screen').stop(true, true).fadeTo(200, 0, function () {
            $('#content-screen').html('');
            $('#content-load-spinner').hide();
        });
        return false;
    } else {
        $('#content-load-spinner').show();
        __toggleNamesAndSocialHolder('hide', function () {
            $('#content-screen').stop(true, true).fadeTo(200, 0, function () {
                $.ajax({
                    url: target + '.' + extension,
                    success: __ajaxPageContentSuccess,
                    dataType: 'html',
                    cache: false
                });
            });
        });
    }
}
function __ajaxPageContentSuccess(data, textStatus, jqXHR) {
    $.getScript('assets/scripts/tuner.min.js');
    $('#content-load-spinner').hide();
    $('#content-screen').html('').html($(data).find('.page-content')).stop(true, true).fadeTo(200, 1, function () {
        __contentScreenReadability($(window));
    });
}
function __toggleNamesAndSocialHolder(operation, callback) {
    if (operation == 'show') {
        if ($('#social-media-links-holder').length) {
            $('#social-media-links-holder').animate({
                'top': 354,
                opacity: 1
            }, 800, 'easeInOutCirc');
        }
        if ($('#names-holder').length) {
            $('#names-holder').animate({
                'top': 272,
                opacity: 1
            }, 1000, 'easeInOutCirc', function () {
                if (typeof callback == 'function') {
                    callback.call();
                }
            });
        }
    } else if (operation == 'hide') {
        if ($('#names-holder').length) {
            $('#names-holder').animate({
                'top': -200,
                opacity: 0.1
            }, 250, 'easeInOutQuart');
        }
        if ($('#social-media-links-holder').length) {
            $('#social-media-links-holder').animate({
                'top': -200,
                opacity: 0.1
            }, 450, 'easeInOutQuart', function () {
                if (typeof callback == 'function') {
                    callback.call();
                }
            });
        }
    }
}
function __showLogScreen(message) {
    if ($('#log-messages-screen').css('display') != 'block') {
        $('#log-messages-screen > p').remove();
    }
    $('#log-messages-screen').prepend('<p>' + message + '</p>').css({
        'display': 'block'
    }).stop(true, false).animate({
        'left': 100
    }, 700, 'easeInCirc', function () {
        var $_logScreen = $(this);
        if (typeof _timeOutForLogScreen != 'undefined') {
            window.clearTimeout(_timeOutForLogScreen);
        }
        _timeOutForLogScreen = window.setTimeout(function () {
            $_logScreen.animate({
                'left': -600
            }, 500, 'easeInOutCirc', function () {
                $_logScreen.css({
                    'display': 'none'
                });
            });
        }, 3000);
    });
}
function __contentScreenReadability(currentScreen) {
    if (typeof currentScreen != 'undefined') {
        if (currentScreen.width() < 1025) {
            $('#content-screen').css({
                'backgroundColor': '#111111'
            });
        } else {
            $('#content-screen').css({
                'backgroundColor': 'transparent'
            });
        }
    }
}
function __createGalleries() {
    $("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'normal',
        theme: 'facebook',
        opacity: 0.64,
        social_tools: false,
        show_title: false
    });
    $.extend(_api_images_1, ['assets/photos/01.jpg', 'assets/photos/02.jpg', 'assets/photos/03.jpg', 'assets/photos/04.jpg', 'assets/photos/05.jpg', 'assets/photos/06.jpg', 'assets/photos/07.jpg', 'assets/photos/08.jpg', 'assets/photos/09.jpg', 'assets/photos/10.jpg', 'assets/photos/11.jpg', 'assets/photos/12.jpg', 'assets/photos/13.jpg', 'assets/photos/14.jpg', 'assets/photos/15.jpg', 'assets/photos/16.jpg', 'assets/photos/17.jpg', 'assets/photos/18.jpg', 'assets/photos/19.jpg', 'assets/photos/20.jpg', 'assets/photos/21.jpg', 'assets/photos/22.jpg', 'assets/photos/23.jpg', 'assets/photos/24.jpg', 'assets/photos/25.jpg', 'assets/photos/26.jpg', 'assets/photos/27.jpg', 'assets/photos/28.jpg', 'assets/photos/29.jpg', 'assets/photos/30.jpg', 'assets/photos/31.jpg', 'assets/photos/32.jpg', 'assets/photos/33.jpg', 'assets/photos/34.jpg', 'assets/photos/35.jpg', 'assets/photos/36.jpg', 'assets/photos/37.jpg', 'assets/photos/38.jpg', 'assets/photos/39.jpg', 'assets/photos/40.jpg', 'assets/photos/41.jpg', 'assets/photos/42.jpg']);
}
function __debug(debugObject) {
    var _debugText = '';
    if (_debugText.length > 1) {
        for (var i in debugObject) {
            _debugText += i + '----' + debugObject[i] + '\r\n';
            _debugText += '---------------------------------------------\r\n';
            _debugText += '---------------------------------------------\r\n';
        }
    } else {
        _debugText = debugObject;
    }
    if (window.console && window.console.log) {
        window.console.log(_debugText);
    } else {
        alert(_debugText);
    }
}