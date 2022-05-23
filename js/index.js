(function ($) {
	$.fn.slide = function (options) {
		var opts = $.extend({}, $.fn.slide.defaults, options);
		return this.each(function () {
			var _this = $(this),
				slideBox = _this.children(),
				slideList = slideBox.children(),
				maxNum = slideList.length,
				btnPrev = '<button type="button" class="btn_prev">Prev</button>',
				btnNext = '<button type="button" class="btn_next">Next</button>',
				dotNav = $('<div class="dot_nav"></div>'),
				dotMake,
				curIdx = 0,
				moveIdx = 0,
				flag = false,
				downPos = 0,
				moveValue = 0,
				nextSlide = 0;
			slideList.each(function (i) {
				$(this).css("left", _this.width() * i);
			});
			// dot make
			for (i = 0; i < maxNum; i++) {
				dotMake = '<a href="#">' + (i + 1) + '</a>';
				dotNav.append(dotMake).children().eq(0).addClass("on");
			}
			// btn, dot
			_this.append(btnPrev, btnNext, dotNav);
			// opts btn
			if (!opts.button) {
				_this.children("button").hide()
			}
			// opts dot
			if (!opts.dot) {
				dotNav.hide()
			}
			// resize
			resize();
			$(window).resize(function () {
				resize();
			});
			// click
			_this.children("button").on('click', function () {
				// status
				if (flag) {
					return
				}
				flag = true;
				if ($(this).hasClass("btn_next")) {
					moveIdx++;
					if (moveIdx > maxNum - 1) {
						moveIdx = 0;
					}
					moveNext();
				} else {
					moveIdx--;
					if (moveIdx < 0) {
						moveIdx = maxNum - 1;
					}
					movePrev();
				}
			});
			// wheel
			_this.on('mousewheel', function (e, delta) {
				// status
				if (flag) {
					return
				}
				flag = true;
				if (delta < 0) {
					moveIdx++;
					if (moveIdx > maxNum - 1) {
						moveIdx = 0;
					}
					moveNext();
				} else {
					moveIdx--;
					if (moveIdx < 0) {
						moveIdx = maxNum - 1;
					}
					movePrev();
				}
			});
			dotNav.children().on('click', function () {
				// status
				if (flag) {
					return
				}
				flag = true;
				moveIdx = $(this).index();
				if (curIdx < moveIdx) {
					moveNext();
				} else if (curIdx > moveIdx) {
					movePrev();
				} else {
					flag = false;
				}
			});
			slideList.on("mousedown", function (e) {
				downPos = e.pageX;
				_this.on("mousemove", function (e) {
					_this.addClass("flick");
					$('img').on('dragstart', function (event) {
						event.preventDefault();
					});
					moveValue = e.pageX - downPos;
					console.log(moveValue);
					if (moveValue < 0) {
						nextSlide = curIdx + 1;
						if (nextSlide > maxNum - 1) {
							nextSlide = 0;
						}
						slideList.eq(curIdx).css("left", moveValue).siblings().css("left", -_this.width());
						slideList.eq(nextSlide).css("left", _this.width() + moveValue);
					} else {
						nextSlide = curIdx - 1;
						if (nextSlide < 0) {
							nextSlide = maxNum - 1;
						}
						slideList.eq(curIdx).css("left", moveValue).siblings().css("left", _this.width());
						slideList.eq(nextSlide).css("left", -_this.width() + moveValue);
					}
					/*

					_this.on("mouseleave",function(){

						_this.removeClass("flick").off("mousemove").off("mouseup");

						_this.trigger("mouseup");

					});

					*/
				}).mouseup(function (e) {
					_this.removeClass("flick").off("mousemove").off("mouseup");
					if (moveValue > -100 && moveValue < 0) {
						slideList.eq(curIdx).stop().animate({
							left: 0
						});
						slideList.eq(nexrSlide).stop().animate({
							left: _this.width()
						});
					} else if (moveValue < -100) {
						moveIdx++;
						if (moveIdx > maxNum - 1) {
							moveIdx = 0;
						}
						moveNext02();
					}
					if (moveValue < 100 && moveValue > 0) {
						slideList.eq(curIdx).stop().animate({
							left: 0
						});
						slideList.eq(nexrSlide).stop().animate({
							left: -_this.width()
						});
					} else if (moveValue > 100) {
						moveIdx--;
						if (moveIdx < 0) {
							moveIdx = maxNum - 1;
						}
						movePrev02();
					}
				});
			});

			function resize() {
				slideList.eq(curIdx).siblings().css("left", _this.width());
				slideBox.css("width", _this.width() * maxNum);
				_this.css("height", slideList.eq(curIdx).height());
			}

			function moveNext() {
				slideList.eq(curIdx).siblings().css("left", _this.width()).end().stop().animate({
					left: -_this.width()
				}, opts.duration);
				moveIndex();
			}

			function moveNext02() {
				slideList.eq(curIdx).stop().animate({
					left: -_this.width()
				}, opts.duration);
				moveIndex();
			}

			function movePrev() {
				slideList.eq(curIdx).siblings().css("left", -_this.width()).end().stop().animate({
					left: _this.width()
				}, opts.duration);
				moveIndex();
			}

			function movePrev02() {
				slideList.eq(curIdx).stop().animate({
					left: _this.width()
				}, opts.duration);
				moveIndex();
			}

			function moveIndex() {
				_this.stop().animate({
					height: slideList.eq(moveIdx).height()
				});
				slideList.eq(moveIdx).stop().animate({
					left: 0
				}, opts.duration, function () {
					curIdx = moveIdx;
					flag = false;
					dotNav.children().eq(moveIdx).addClass("on").siblings().removeClass("on");
				});
			}
		});
	}
	// 기본 옵션
	$.fn.slide.defaults = {
		duration: 500,
		dot: true,
		button: true
	};
})(jQuery);