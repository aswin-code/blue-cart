
(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1000,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 4000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'html',
        transition: function (url) { window.location.href = url; }
    });

    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height() / 2;

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display', 'flex');
        } else {
            $("#myBtn").css('display', 'none');
        }
    });

    $('#myBtn').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if ($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
    }
    else {
        var posWrapHeader = 0;
    }


    if ($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top', 0);
    }
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top', posWrapHeader - $(this).scrollTop());
    }

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top', 0);
        }
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top', posWrapHeader - $(this).scrollTop());
        }
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function () {
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for (var i = 0; i < arrowMainMenu.length; i++) {
        $(arrowMainMenu[i]).on('click', function () {
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function () {
        if ($(window).width() >= 992) {
            if ($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display', 'none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function () {
                if ($(this).css('display') == 'block') {

                    $(this).css('display', 'none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });

        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function () {
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity', '0');
    });

    $('.js-hide-modal-search').on('click', function () {
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity', '1');
    });

    $('.container-search-header').on('click', function (e) {
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({ filter: filterValue });
        });

    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine: 'best-available',
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });
    });

    var isotopeButton = $('.filter-tope-group button');

    $(isotopeButton).each(function () {
        $(this).on('click', function () {
            for (var i = 0; i < isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click', function () {
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if ($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }
    });

    $('.js-show-search').on('click', function () {
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if ($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }
    });




    /*==================================================================
    [ Cart ]*/
    $('.js-show-cart').on('click', function () {
        const userid = $('.js-show-modal1').attr('userid')

        axios.get(`/users/${userid}/carts`).then(async e => {
            let total = 0;
            let output = '';
            if (e.data.user.cart.length == 0) {
                output = `
            <div class="col-md-12">
              <div class="card">
                <div class="card-body cart">
                  <div class="col-sm-12 empty-cart-cls text-center">
                    <img src="https://i.imgur.com/dCdflKN.png" width="130" height="130" class="img-fluid mb-4 mr-3">
                    <h3><strong>Your Cart is Empty</strong></h3>
                    <h4>Add something to make me happy :)</h4>
                    <a href="/users/${e.data.user._id}" class="btn btn-primary cart-btn-transform m-3"
                      data-abc="true">continue
                      shopping</a>
                  </div>
                </div>
              </div>
            </div>
          `
            } else {
                output = '';
                for (i in e.data.user.cart) {
                    total += e.data.user.cart[i].total

                    output += `<li class="header-cart-item flex-w flex-t m-b-12">
                    <div class="header-cart-item-img">
                    <img src="/images/items/${e.data.user.cart[i].product.image}" alt="IMG">
                    </div>
                    
                    <div class="header-cart-item-txt p-t-8">
                    <a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
                    ${e.data.user.cart[i].product.productName}
                    </a>
                    
                    <span class="header-cart-item-info">
                    ${e.data.user.cart[i].qty} × ${e.data.user.cart[i].product.discountPrice}
                    </span>
                    </div>
                    </li>`
                }
            }
            $('.header-cart-total').text(`Total : ${total}`)
            await $('.header-cart-wrapitem').html(output)

        })
        $('.js-panel-cart').addClass('show-header-cart');

    });

    $('.js-hide-cart').on('click', function () {
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click', function () {
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click', function () {
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function () {
        var numProduct = Number($(this).next().val());
        if (numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function () {
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });



    /*==================================================================
    [ +/- num product cart ]*/
    $('.btn-num-product-down-cart').on('click', function () {
        let userid = $('#userid').val()
        let cartid = $(this).attr('proid')
        let price = $(this).attr('price') * -1
        var numProduct = Number($(this).next().val());
        if (numProduct > 0) {
            axios.patch(`/users/${userid}/carts`, { qty: -1, cartid, price }).then(e => {
                if (e.data.cart.qty > 0) {

                    $(this).next().val(`${e.data.cart.qty}`);
                    $(this).closest('td').next().text(`₹${e.data.cart.total}`)
                    $('.total').text(`₹${e.data.total}`)
                    $('.subtotal').text(`₹${e.data.total + 50}`)
                } else {
                    window.location.reload()

                }
            })
        }
    });

    $('.btn-num-product-up-cart').on('click', function () {
        let userid = $('#userid').val()
        let cartid = $(this).attr('proid')
        let price = $(this).attr('price')
        let total = $('.column-5-total').text()
        console.log(total)
        axios.patch(`/users/${userid}/carts`, { qty: 1, cartid, price }).then(e => {
            console.log(e.data)

            $(this).prev().val(`${e.data.cart.qty}`);
            $(this).closest('td').next().text(`₹${e.data.cart.total}`)
            $('.total').text(`₹${e.data.total}`)
            $('.subtotal').text(`₹${e.data.total + 50}`)
        })
    });

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function () {
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function () {
            var index = item.index(this);
            var i = 0;
            for (i = 0; i <= index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for (var j = i; j < item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function () {
            var index = item.index(this);
            rated = index;
            $(input).val(index + 1);
        });

        $(this).on('mouseleave', function () {
            var i = 0;
            for (i = 0; i <= rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for (var j = i; j < item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });

    /*==================================================================
    [ Show modal1 ]*/
    $('.js-show-modal1').on('click', function (e) {
        e.preventDefault();
        const userid = $(this).attr('userid')
        const proid = $(this).attr('proid')
        axios.post(`/users/${userid}/products/${proid}`, {}).then(e => {

            $('.modal1name').text(e.data.product.productName)
            $('.modal1price').text('₹' + e.data.product.discountPrice)
            $('.modal1details').text(e.data.product.description)
            $('.modal1mag').attr('href', `/images/items/${e.data.product.image}`)
            $('.item-slick3').attr('data-thumb', `/images/items/${e.data.product.image}`)
            $('.modal1productimage').attr('src', `/images/items/${e.data.product.image}`)
            $('.modal1proid').attr('productid', `${e.data.product._id}`)
            $('.js-modal1').addClass('show-modal1')
        }
        )

    });

    $('.js-hide-modal1').on('click', function () {
        $('.js-modal1').removeClass('show-modal1');
    });

    /*==================================================================
       [ Show modal1 ]*/



})(jQuery);