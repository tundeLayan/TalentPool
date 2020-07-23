const $animation_elements = $('.add__animate');
const $window = $(window);

function checkElementInView() {
    const window_height = $window.height();
    const window_top_position = $window.scrollTop();
    const window_bottom_position = (window_top_position + window_height);

    $.each($animation_elements, function() {
        const $element = $(this);
        const element_height = $element.outerHeight();
        const element_top_position = $element.offset().top;
        const element_bottom_position = (element_top_position + element_height);

        //check to see if this current container is within viewport
        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
            $element.addClass('animate__slideInLeft');
        }
    });
}

$window.on('scroll resize', checkElementInView);
$window.trigger('scroll');
