'use strict';
//var wallpaper, overlay; //globals

var replaceWidget = function (key) {
    var value = elements[key];
    Object.keys(value).forEach(function (skey) { //loop styles on the object
        var styleVal = value[skey];
        if (skey != 'type') {
            document.getElementById(key).style.cssText += skey + ":" + styleVal;
        }
    });
}
var loadexjsfile = function (id, over) {
    var link = 'http://lockplus.us/creator/widgets/' + id + '.js';
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", link);
    fileref.async = true;
    if (fileref !== "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    fileref.onload = function () {
        try {
            replaceWidget(id);
        } catch (err) {
            alert(err);
        }
    }
};

var LockPlus = {
    loadedFonts: [],
    setWallpaper: function () {
        if (showWallpaper) {
            document.getElementById('wallpaper').src = wallpaper;
        }
    },
    setOverlay: function () {
        document.querySelector('.screenoverlay').style.backgroundImage = 'url(' + overlay + ')';
        document.querySelector('.svg').src = overlay;
        if (overlay.split('/')[1].split(';')[0] === 'svg' || overlay.split('/')[1].split(';')[0] === 'svg+xml') {
            showSVG('.svg', true);
        }
    },
    remakeDIV: function (id) {
        var div = document.createElement('div');
        div.id = id;
        if (id !== 'icon' && id !== 'unlock' && id.substring(0, 4) !== 'text' && id.substring(0, 3) !== 'box' && id.substring(0, 3) !== 'app') {
            div.innerHTML = "*"; //preload font
            div.style.pointerEvents = "none";
        }
        document.getElementById('screenElements').appendChild(div);
    },
    stageFont: function (font) {
        if (LockPlus.loadedFonts.indexOf(font) === -1) {
            LockPlus.loadedFonts.push(font);
        }
    },
    injectFont: function () {
        var css = "";
        for (var i = 0; i < LockPlus.loadedFonts.length; i++) {
            css += "\n@font-face{\nfont-family:'" + LockPlus.loadedFonts[i] + "';\nsrc:url('user/" + LockPlus.loadedFonts[i] + ".otf');\n}"
        }
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
        //puts(document.head.innerHTML);
    },
    createElements: function () {
        Object.keys(elements).forEach(function (key) {
            if (elements[key].type == 'widget') {
                loadexjsfile(key, true);
            } else {
                LockPlus.remakeDIV(key); //loop object and place items
                var value = elements[key];
                if (key === 'icon') {
                    var img = document.createElement('img');
                    img.className = 'icon';
                    img.id = 'iconDiv';
                    document.getElementById('icon').appendChild(img);
                }
                Object.keys(value).forEach(function (skey) { //loop styles on the object
                    var styleVal = value[skey],
                        img;
                    if (skey === 'data-prefix' || skey === 'data-suffix') {
                        if (skey === 'data-prefix') {
                            document.getElementById(key).setAttribute('data-prefix', styleVal);
                        }
                        if (skey === 'data-suffix') {
                            document.getElementById(key).setAttribute('data-suffix', styleVal);
                        }
                    } else {
                        document.getElementById(key).style.cssText += skey + ":" + styleVal;
                    }
                    if (skey === 'font-family') {
                        LockPlus.stageFont(styleVal);
                    }
                    if (key === 'icon') { //resize img inside #icon
                        document.getElementById('icon').style.cssText += skey + ":" + styleVal; //icon container div
                        if (skey !== 'position' && skey !== 'font-family') {
                            if (skey === 'width' || skey === 'height') {
                                document.querySelector('.icon').style.cssText += skey + ":" + styleVal; //icon image
                            }
                        }
                    } else if (key.substring(0, 4) === 'text' && skey === 'innerHTML') {
                        document.getElementById(key).innerHTML = styleVal;
                    }
                });
            }
        });
        loadClock();
        LockPlus.injectFont();
    },
    init: function () {
        if (wallpaper !== null && wallpaper.length > 10) {
            this.setWallpaper();
        }
        if (overlay !== null && overlay.length > 10) {
            this.setOverlay();
        }
        if (elements !== null) {
            this.createElements();
        }
    }
};

LockPlus.init();
