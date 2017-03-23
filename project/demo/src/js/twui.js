//自定义滚动事件(减少滚动时滚动事件重复触发次数)
$.event.special.lazyScroll = {
    setup: function (data) {
        var timer = 0;

        $(this).on('scroll.lazyScroll', function (event) {
            if (!timer) {
                timer = setTimeout(function () {
                    $(this).triggerHandler('lazyScroll');
                    timer = 0;
                }, 150);
            }
        });
    },
    teardown: function () {
        $(this).off('scroll.lazyScroll');
    }
};

//自定义resize事件(减少窗口大小变化时resize事件重复触发次数)
$.event.special.lazyResize = {
    setup: function (data) {
        var timer = 0;

        $(this).on('resize.lazyResize', function (event) {
            if (!timer) {
                timer = setTimeout(function () {
                    $(this).triggerHandler('lazyResize');
                    timer = 0;
                }, 200);
            }
        });
    },
    teardown: function () {
        $(this).off('resize.lazyResize');
    }
};

var UI = {
    //浮窗数组:记录所有打开的浮窗,最后一个指向当前激活的浮窗
    floatList: [],
    //函数:打开浮窗
    openFloat: function (targetQueryString) {
        var $floatBg = $('<div class="m-float-bg"></div>'),
            $target = $(targetQueryString);

        if ($target.length === 0) {
            return;
        }

        //只有打开第一个浮窗时，才创建浮窗背景
        if (UI.floatList.length === 0) {
            $('body').append($floatBg);
            $('body').addClass('m-float-open');
        }

        $target.show();
        UI.floatList.push($target);
    },
    //函数:关闭浮窗
    closeFloat: function () {
        var $float = null;

        //关闭当前浮窗
        if (UI.floatList.length != 0) {
            $float = UI.floatList.pop();
            $float.hide();
        }

        //当最后一个浮窗关闭时，关闭浮窗背景
        if (UI.floatList.length === 0) {
            $('.m-float-bg').remove();
            $('body').removeClass('m-float-open');
        }
    },
    //函数:移动固定容器
    moveFixedbox: function ($targets) {
        var scrollTop = $(window).scrollTop(),
            top = 0;

        $targets.each(function () {
            top = $(this).data('top');

            if (scrollTop > top) {
                $(this).css('top', 0);
            } else {
                $(this).css('top', top - scrollTop);
            }
        });
    },
    //函数:显示返回顶部按钮
    showToTop: function ($target) {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > 60) {
            $target.fadeIn();
        } else {
            $target.fadeOut();
        }
    },
    //可收缩或展开内容的"更多"按钮的显示与隐藏
    switchMore: function () {
        var $flexBox = $('.js-flexBox'),
            lineHeight = $flexBox.find('li').outerHeight(true),
            contentHeight = $flexBox.find('.m-xul').outerHeight();

        if (contentHeight > 2 * lineHeight) {
            $('.js-more').show();
        } else {
            $('.js-more').hide();
        }
    },
    //初始化升缩文本的展开与收起
    initRsText: function ($rsTexts) {
        $rsTexts.each(function () {
            var rstext = '',
                dataparam = '',
                charnum = 200,
                subStr = '',
                textLength = 0,
                $riseSwitch = null,
                $shrinkSwitch=null,
                $temp=$('<div></div>'),
                riseSwitchHtml = '<span class="u-rstext-switch" data-as="rstext-riseswitch">展开<span>︾</span></span>',
                shrinkSwitchHtml = '<span class="u-rstext-switch" data-as="rstext-shrinkswitch">收起<span>︽</span></span>';

            $riseSwitch = $(this).find('[data-as="rstext-riseswitch"]');
            $shrinkSwitch = $(this).find('[data-as="rstext-shrinkswitch"]');

            //如果存在自定义的展开开关，获取其对应的html
            if ($riseSwitch.length > 0) {
                $temp.append($riseSwitch);
                riseSwitchHtml = $temp.html();
            }

            //如果存在自定义的关闭开关，获取其对应的html
            if ($shrinkSwitch.length > 0) {
                $temp = $('<div></div>');
                $temp.append($shrinkSwitch);
                shrinkSwitchHtml = $temp.html();
            }

            rstext = $(this).html();
            textLength = rstext.length;
            dataparam = $(this).data('param');

            //如果指定了限制字符数且指定的字符数能转换为整数就用指定的字符数作限制字符数，否则默认最多显示200个字符
            if (typeof dataparam != "undefined") {
                charnum = isNaN(parseInt(dataparam)) ? 200 : parseInt(dataparam);
            }

            //仅当文本字符数大于限制字符个数时，才显示切换开关
            if (textLength > charnum) {
                subStr = rstext.substring(0, charnum);
                $(this).html(subStr + '...' + riseSwitchHtml);
            }

            //单击展开开关:显示全部文字
            $(this).on('click', '[data-as="rstext-riseswitch"]', function () {
                var $rstext = $(this).parent();
                $rstext.html(rstext + shrinkSwitchHtml);
            });

            //单击收起开关:截断部份文字
            $(this).on('click', '[data-as="rstext-shrinkswitch"]', function () {
                var $rstext = $(this).parent();
                subStr = rstext.substring(0, charnum);
                $rstext.html(subStr + '...' + riseSwitchHtml);
            });
        });
    },
    //初始化fixedbox的各种尺寸及保存相关尺寸
    initSizeFixedBox: function ($fixedBox) {
        var top = 0,
            bottomY=0,
            left = 0,
            width = 0,
            outerWidth = 0,
            outerHeight = 0,
            originalStyle = '',
            xRelated = '',
            yRelated = '',
            marginLeft = 0,
            $xRelated = null,
            $yRelated = null,
            $me = null;

        if ($fixedBox === undefined) {
            $fixedBox = $('[data-as="fixedbox"]');
        }

        $fixedBox.each(function () {
            $me = $(this);

            //以下语句与if判断都是针对浏览器resize时，fixedbox重新保存正确的尺寸值
            $me.removeClass('m-fixedbox-top');
            $me.removeClass('m-fixedbox-bottom');

            if ($me.data('style') != undefined) {
                originalStyle = $me.data('style');
            } else {
                originalStyle = $me.attr('style') ? $me.attr('style') : '';
            }

            $me.attr('style', originalStyle);

            //fixedbox的position转换为fixed时，有可能会破坏右侧容器(需手动在data-x-related中指定这些元素)的布局，以下语句记录这些元素最初的margin-left值
            xRelated = $me.data('xRelated');
            yRelated = $me.data('yRelated');

            if (xRelated != undefined) {
                $xRelated = $(xRelated);

                $xRelated.each(function () {
                    if ($(this).data('marginLeft') === undefined) {
                        $(this).data('marginLeft', $(this).css('margin-left'));
                    } else {
                        $(this).css('margin-left', $(this).data('marginLeft'));
                    }
                });
            }

            //fixedbox的position转换为fixed时，有可能会破坏下方容器(需手动在data-y-related中指定这些元素)的布局，以下语句记录这些元素最初的margin-top值
            if (yRelated != undefined) {
                $yRelated = $(yRelated);

                $yRelated.each(function () {
                    if ($(this).data('marginTop') === undefined) {
                        $(this).data('marginTop', $(this).css('margin-top'));
                    } else {
                        $(this).css('margin-top', $(this).data('marginTop'));
                    }
                });
            }

            top = $me.offset().top;
            bottomY = top + $me.outerHeight();
            left = $me.offset().left;
            width = $me.outerWidth();
            outerWidth=$me.outerWidth(true);
            outerHeight=$me.outerHeight(true);

            //用js动态添加的fixedbox有可能不带data-as="fixedbox"属性，此行添加此属性
            $me.attr('data-as', 'fixedbox');

            //记录fixedbox在正常状态下的top值
            $me.data('top', top);

            //记录fixedbox底端的坐标
            $me.data('bottomY', bottomY);

            //记录fixedbox在正常状态下left值(为避免当容器是以float:right等指定的位置时，把该容器转换为:position:fixed时left发生变化)
            $me.data('left', left);

            //记录fixedbox在正常状态下width(为避免当容器是以百分比指定宽度时，把该容器转换为:position:fixed时宽度发生变化)
            $me.data('width', width);

            //当fixedbox从正常状态转变为position:fixed时，如果对其右边的元素的位置有影响,outerWidth中记录对影响元素左边补白的距离
            $me.data('outerWidth',outerWidth);

            //当fixedbox从正常状态转变为position:fixed时，如果对其下方的元素的位置有影响,outerHeight中记录对影响元素上边补白的距离
            $me.data('outerHeight',outerHeight);

            //记录fixedbox最初的style值，该值在浏览器resize时也不会被重新计算
            $me.data('style', originalStyle);
        });
    },
    //fixedbox影响的容器补白
    fillRelatedBox: function ($fixedBox) {
        var xRelated = '',
            yRelated = '',
            $xRelated = null,
            $yRelated = null;

        xRelated = $fixedBox.data('xRelated');
        yRelated = $fixedBox.data('yRelated');

        //为在fixedbox容器中在data-x-related属性中指定的元素左边补白
        if (xRelated != undefined) {
            $xRelated = $(xRelated);
            outerWidth = parseFloat($fixedBox.data('outerWidth'));

            $xRelated.each(function () {
                marginLeft = isNaN(parseFloat($(this).data('marginLeft'))) ? 0 : parseFloat($(this).data('marginLeft'));
                $(this).css('margin-left', (outerWidth + marginLeft) + 'px');
            });
        }

        //为在fixedbox容器中在data-y-related属性中指定的元素上边补白
        if (yRelated != undefined) {
            $yRelated = $(yRelated);
            outerHeight = parseFloat($fixedBox.data('outerHeight'));

            $yRelated.each(function () {
                marginTop = isNaN(parseFloat($(this).data('marginTop'))) ? 0 : parseFloat($(this).data('marginTop'));
                $(this).css('margin-top', (outerHeight + marginTop) + 'px');
            });
        }
    },
    //移除fixedbox影响的容器补白
    recoveryRelatedBox: function ($fixedBox) {
        var xRelated = '',
            yRelated = '',
            $xRelated = null,
            $yRelated = null;

        xRelated = $fixedBox.data('xRelated');
        yRelated = $fixedBox.data('yRelated');

        //去掉fixedbox容器中在data-x-related属性中指定的元素左边补白
        if (xRelated != undefined) {
            $xRelated = $(xRelated);

            $xRelated.each(function () {
                $(this).css('margin-left', $(this).data('marginLeft'));
            });
        }

        //去掉fixedbox容器中在data-y-related属性中指定的元素的上方补白
        if (yRelated != undefined) {
            $yRelated = $(yRelated);

            $yRelated.each(function () {
                $(this).css('margin-Top', $(this).data('marginTop'));
            });
        }
    },
    //滚动fixedbox
    scrollFixedBox: function ($fixedBox) {
        var scrollTop = $(window).scrollTop(),
            currentY = scrollTop + $(window).height(),
            parentLimit = 0,
            bottomY = 0,
            originalTop = 0,
            left = 0,
            width = 0,
            outerWidth = 0,
            outerHeight = 0,
            attrStyle = '',
            marginLeft = 0,
            marginTop = 0,
            $me = null;

        $fixedBox.each(function () {
            $me = $(this);
            originalTop = $me.data('top');
            bottomY = $me.data('bottomY');
            left = $me.data('left') + 'px';
            width = $me.data('width') + 'px';
            attrStyle = $me.data('style');
            position = $me.data('position');
            parentLimit=$me.data('parentLimit');

            if (parentLimit != undefined) {
                parentLimit = $me.parent().offset().top - $(window).height() + (isNaN(parseInt(parentLimit)) ? 0 : parseInt(parentLimit));
            }

            if (position === undefined) {
                //当滚动条位置大于fixedbox在正常状态下的位置时，才把该容器转变为fixedbox,反之恢复正常状态
                if (scrollTop > originalTop) {

                    $me.addClass('m-fixedbox-top');
                    $me.css({ 'left': left, 'width': width });

                    //fixedbox影响的容器补白
                    UI.fillRelatedBox($me);

                } else {
                    $me.removeClass('m-fixedbox-top');
                    $me.attr('style', attrStyle);

                    //移除fixedbox影响的容器补白
                    UI.recoveryRelatedBox($me);
                }
            } else {
                //当滚动条位置加浏览器窗体高度小于fixedbox在正常状态下的位置时，才把该容器转变为fixedbox,反之恢复正常状态
                if (currentY > bottomY) {
                    $me.removeClass('m-fixedbox-bottom');
                    $me.attr('style', attrStyle);

                    //移除fixedbox影响的容器补白
                    UI.recoveryRelatedBox($me);
                } else {
                    //如果fixedbox指定了data-parent-limit属性来限制其触发条件，那么只有当滚动条的top大于其限制位置时，才把容器转变为fixedbox
                    if ((parentLimit != undefined) && (scrollTop < parentLimit)) {
                        $me.removeClass('m-fixedbox-bottom');
                        $me.attr('style', attrStyle);

                        //移除fixedbox影响的容器补白
                        UI.recoveryRelatedBox($me);
                    } else {
                        $me.addClass('m-fixedbox-bottom');
                        $me.css({ 'left': left, 'width': width });

                        //fixedbox影响的容器补白
                        UI.fillRelatedBox($me);
                    }
                }
            }
        });
    },
    //初始化fixedbox
    initFixedBox: function ($fixedBox, eventFlag) {
        if ($fixedBox === undefined) {
            $fixedBox = $('[data-as="fixedbox"]');
        }

        UI.initSizeFixedBox($fixedBox);
        UI.scrollFixedBox($fixedBox);

        if (eventFlag === true) {
            //绑定浏览器滚动事件
            $(window).on('lazyScroll.fixedBox', function () {
                UI.scrollFixedBox($fixedBox);
            });

            //浏览器resize时重新保存fixedbox的尺寸
            $(window).on('lazyResize.fixedBox',function () {
                UI.initSizeFixedBox($fixedBox);
                UI.scrollFixedBox($fixedBox);
            });
        }
    },
    //初始化bottombox
    initBottomBox: function ($bottomBox) {
        var top = 0,
            windowHeight = $(window).height(),
            heightDiff=0,
            dataParam='';

        $bottomBox.each(function () {
            top = $(this).offset().top;
            dataParam = $(this).attr('data-param');

            if (dataParam !== undefined) {
                dataParam = isNaN(parseInt(dataParam)) ? 0 : parseInt(dataParam);
            } else {
                dataParam = 0;
            }

            heightDiff = windowHeight - top - dataParam;

            if (heightDiff >= 0) {
                $(this).css('min-height', heightDiff);
            }
        })
    }
};

//页面初使化时，检查当前页是否存在相关元素，如果存在，绑定相应的事件
$(document).ready(function () {
    var $openFloat = $('[data-toggle="float"]'),
        $closeFloat = $('[data-dismiss="float"]'),
        $toTop = $('.js-toTop'),
        $rsTexts = $('[data-as="rstext"]'),
        $fixedBox = $('[data-as="fixedbox"]'),
        $tabFixedBox = $('.tab-pane [data-as="fixedbox"]'),
        $bottomBox = $('[data-as="bottombox"]');

    //禁用过度效果
    $.support.transition = false;

    //初始化tooltips
    $("[data-toggle='tooltip']").tooltip();

    //当页面存在浮窗打开按钮，给该按钮绑定click打开浮窗事件
    if ($openFloat.length > 0) {
        $openFloat.click(function (event) {
            var targetString = $(this).data('target');

            //阻止a元素默认事件
            event.preventDefault();

            //如按钮没有指定data-target属性,检查其href属性
            if (typeof targetString === "undefined") {
                targetString = $(this).attr('href');
            }

            //当data-target被指定或按钮有href值时，才执行打开浮窗函数
            if (typeof targetString != "undefined") {
                UI.openFloat(targetString);
            }
        });
    }

    //给所有的浮窗关闭按钮绑定click关闭浮窗事件
    if ($closeFloat.length > 0) {

        $closeFloat.click(function () {
            UI.closeFloat();
        });
    }

    //如果存在fixedbox容器，页面加载时初始化所有的fixedbox容器
    if ($fixedBox.length > 0) {
        UI.initFixedBox($fixedBox,true);
    }

    //如果当前页存在tab-pane标签，且其包含有fixedbox容器，那么在其显示的时候重新初始化fixedbox
    if ($tabFixedBox.length > 0) {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
            var $fixedBox = $('.tab-pane.active').find('[data-as="fixedbox"]');

            UI.initFixedBox($fixedBox, false);
        });
    }

    //如果存在bottombox容器，页面加载时初始化所有的bottombox容器
    if ($bottomBox.length > 0) {
        UI.initBottomBox($bottomBox);

        $(window).on('lazyResize.bottomBox', function () {
            UI.initBottomBox($bottomBox);
        });
    }

    //如果存在js-toTop控件，滚动窗体到超出一屏浏览器宽度时，显示该控件
    if ($toTop.length > 0) {
        $(window).scroll(function () {
            UI.showToTop($toTop);
        });
    }

    //检索栏展开按钮隐藏
    $(".m-search-lst > div > ul").each(function (i) {
        if (i <= 2) {
            $(this).parent().show();
        }

        if ($(this).height() > 40) {
            $(this).next().show();
        } else {
            $(this).next().hide();
        }
    });

    //检索栏展开
    $(".j-fold").on("click", function () {
        $(this).parent().toggleClass("search-unfold");
        $(this).prev().prev().height($(this).prev().height());
        $(this).toggleClass("j-unfold");
    });

    /* 搜索列表栏展开 (更多) */
    $(".u-unfold").on("click", function () {
        $(this).parent().parent().addClass("m-search-fold");
        $(this).parent().parent().children().removeClass("m-search-last-item");
        $(this).parent().parent().children(".m-search-item").last().addClass("m-search-last-item");
        $(this).parent().parent().find("ul").each(function () {
            if ($(this).height() > 40) {
                $(this).next().show();
            } else {
                $(this).next().hide();
            }
        });
        $(this).hide();
        $(this).next(".u-fold").show();
    });

    /* 搜索列表栏收起 (收起) */
    $(".u-fold").on("click", function () {
        $(this).parent().parent().removeClass("m-search-fold");
        $(this).parent().parent().children(".m-search-item").first().next().next().addClass("m-search-last-item");
        $(this).hide();
        $(this).prev(".u-unfold").show();
    });

    //查询条件筛选区选中效果实现
    $('.m-search-lst').on('click', 'li>a', function () {
        var $parent = $(this).parent(),
            $ul = $parent.parent(),
            dataModel = $ul.data('model'),
            dataRange = $(this).data('range');

        //如果为单选模式，每次只选中一个筛选条件
        if (dataModel === 'single') {
            $parent.siblings().removeClass('active');
        }

        //全部选中效果切换
        if (dataRange != "all") {
            $ul.find('[data-range="all"]').parent().removeClass('active');
        } else {
            $parent.siblings().removeClass('active');
        }

        $parent.toggleClass('active');
    });

    //当页面存在收缩文本,对升缩文本进行初始化
    if ($rsTexts.length > 0) {
        UI.initRsText($rsTexts);
    }

    // 模拟单选按钮
    $(".u-radio-btn").click(function () {
        $(".u-radio-in").hide();
        $(this).find(".u-radio-in").toggle();
    });

    //点赞 取消点赞的切换
    $('.support').click(function () {
        $('.support ').toggleClass('quxiao');
        $('.u-tooltip').removeClass("bounceOut").addClass("animated bounceIn").show();
        if ($('.support ').hasClass('quxiao')) {
            $('.support ').find(".u-tooltip").html('点赞成功')
            $('.support ').attr('title', '取消点赞');
        } else {
            $('.support ').find(".u-tooltip").html('取消点赞')
            $('.support ').attr('title', '点赞');
        }
        setTimeout(function () {
            $('.u-tooltip').removeClass("bounceIn").addClass("bounceOut").hide();
        }, 1000);
    });
});

//试题-显示答案解析
$(".m-right-answers .m-checkbox input[type=checkbox]").click(function () {
    $(this).parents().parents().parents().siblings(".right-answers").fadeToggle();
});

//试题-试题选项长度较短时，一行显示两个或四个，只有较长时才一行显示一个
$(".m-single-choice .m-test-detail, .m-checking .m-test-detail").each(function () {
    var maxWidth = $(this).width() - 30;
    var lis = $(this).find("li"), level = 4;
    var width = 0;
    lis.each(function (index, element) {
        $(element).css("display", "inline-block");
        var tempWidth = $(element).width() + 30;
        if (width < tempWidth) {
            width = tempWidth;
        }

    });
    if (width < maxWidth / 4) {
        level = 4;
    }
    else if (width < maxWidth / 2) {
        level = 2;
    }
    else {
        level = 1;
    }

    var liWidth = maxWidth / level;
    lis.each(function (index, element) {
        $(element).css("width", liWidth)
    });

});

//换肤
$(".s-ffffff").click(function () {
    $(this).toggleClass("u-active").siblings(".m-skin").removeClass("u-active");
    $(".g-questions").removeClass("skin-eyeshield");
})

$(".s-f0f9e6").click(function () {
    $(this).toggleClass("u-active").siblings(".m-skin").removeClass("u-active");
    $(".g-questions").addClass("skin-eyeshield");
})

//显示隐藏跟读题状态
$('.btn-sound').click(function () {
    $(this).parent().toggleClass('playing');
});

