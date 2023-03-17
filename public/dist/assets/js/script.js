$(function() {
    $(document).ready(function(){
            $("#tunes_slider").owlCarousel({
            margin: 10,
            items: 1,
            responsiveClass: !0,
            loop:true, 
            nav:false, 
            dots:true,
            autoplay:true,
            autoplayTimeout:8000 
            });
        });

        $(document).ready(function(){
            $("#viewership_slider").owlCarousel({
            margin: 10,
             items: 1,
             responsiveClass: !0,
             loop:true, 
             nav:true,
             dots:true, 
             autoplay:true,
             autoplayTimeout:12000 
            });
            });
            $(document).ready(function(){
                $("#ongoing_slider_wrapper").owlCarousel({
                margin: 10,
                 items: 1,
                 responsiveClass: !0,
                 loop:true, 
                 nav:true,
                 dots:true, 
                 autoplay:true,
                 autoplayTimeout:10000 
                });
                });
                $(document).ready(function(){
                    $("#hotshow_slider_wrapper").owlCarousel({
                    margin: 10,
                     items: 1,
                     responsiveClass: !0,
                     loop:false, 
                     nav:true,
                     dots:true, 
                     autoplay:true,
                     autoplayTimeout:9000 
                    });
                    });

});

 
    
   