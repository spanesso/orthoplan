var URL_SERVICES = "http://neuromedia.com.co/servicios/";

var ID_NEW_SELECTED = 0;
var ID_PROMOTION_SELECTED = 0;
var OFFICES_MAP;


// Init App
var myApp = new Framework7({
    modalTitle: 'Framework7',
    // Enable Material theme
    material: true,
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
});
// Add another view, which is in right panel
var rightView = myApp.addView('.view-right', {
});




//****************************************************************  
//*********                                            ***********  
//*********        FUNCIONES GLOBALES                  ***********  
//*********                                            *********** 
//**************************************************************** 




function close_modal() {
    myApp.closeModal();
}
function show_notification_message(message) {
    myApp.addNotification({
        message: message,
        button: {
            text: 'Ok',
            color: 'white'
        }
    });
}
function onOffline() {
    show_notification_message("Hubo un error de conexión, intentalo de nuevo más tarde.")
}

function validate_email(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function close_session() {
    myApp.closePanel('left');
    myApp.formDeleteData('session');
    mainView.router.load({url: 'login.html'});
}

function list_news_by_json(news_list) {

    $("#home_news_preloader_container").css("display", "none");
    $("#home_news_list").html("");

    for (var i = 0; i < news_list.length; i++) {

        var news_item = "<li class='swipeout'>" +
                "<div class='swipeout-content'>" +
                "<a class='item-link item-content new-detail-item' data-id='" + news_list[i].id + "'>" +
                "<div class='item-inner'>" +
                "<div class='item-title-row'>" +
                "<div class='item-title new-home-tittle'><b>" + news_list[i].nombre + "</b></div>" +
                "<div class='item-after'>" + news_list[i].fecha_publicado + "</div>" +
                "</div>" +
                "</div>" +
                "</a>" +
                "</div>" +
                "</li>";

        $("#home_news_list").append(news_item);
    }


    $(".new-detail-item").click(function () {
        var new_id = $(this).attr("data-id");

        ID_NEW_SELECTED = new_id;

        mainView.router.load({url: 'new_detail.html'});


    });



}

function get_new_detail_by_id(id_new) {
    $.ajax({
        url: URL_SERVICES + "traerNoticiaPorID.php?id=" + id_new,
        type: "GET",
        dataType: 'text',
        success: function (data) {

            var data_parse = JSON.parse(data);
            if (data_parse.status == 200) {

                var new_detail = data_parse.data;

                $("#new_detail_img_container").css("background-image", "url('" + new_detail.foto + "')");
                $("#new_detail_tittle").text(new_detail.nombre);
                $("#new_detail_date").text(new_detail.fecha_publicado);
                $("#new_detail_description").text(new_detail.descripcion);


            } else {
                onOffline();
            }



        },
        error: function () {
            onOffline();
        }
    });
}
function get_promotions_detail_by_id(id_promotion) {
    $.ajax({
        url: URL_SERVICES + "traerPromocionPorID.php?id=" + id_promotion,
        type: "GET",
        dataType: 'text',
        success: function (data) {

            var data_parse = JSON.parse(data);
            if (data_parse.status == 200) {

                var promotion_detail = data_parse.data;

                $("#promotion_detail_img_container").css("background-image", "url('" + promotion_detail.imagen + "')");
                $("#promotion_detail_tittle").text(promotion_detail.nombre);
                $("#promotiondetail_date").text("Vence: " + promotion_detail.vencimiento);
                $("#promotion_detail_description").text(promotion_detail.descripcion);


            } else {
                onOffline();
            }



        },
        error: function () {
            onOffline();
        }
    });
}

function charge_news() {
    $("#home_news_preloader_container").css("display", "block");
    $("#home_news_list").html("");

    $.ajax({
        url: URL_SERVICES + "traerTodoNoticias.php",
        type: "GET",
        dataType: 'text',
        success: function (data) {

            var news_parse = JSON.parse(data);
            if (news_parse.status == 200) {
                var news_list = news_parse.data;
                list_news_by_json(news_list);
            } else {
                show_notification_message(news_parse.message);
            }
        },
        error: function () {
            onOffline();
        }
    });
}
function charge_offices() {




    $.ajax({
        url: URL_SERVICES + "traerTodoSedes.php",
        type: "GET",
        dataType: 'text',
        success: function (data) {



            var data_parse = JSON.parse(data);

            if (data_parse.status == 200) {

                var offices_list = data_parse.data;


                for (var i = 0; i < offices_list.length; i++) {



                    var office_content = "<div class='card ks-card-header-pic'>" +
                            "<div class='card-content'>" +
                            "<div style='background-image:url(" + offices_list[i].foto + ");' valign='bottom' class='card-header color-white no-border'>" + offices_list[i].nombre + "</div>" +
                            "<div class='card-content'> " +
                            "<div class='card-content-inner'>" +
                            "<p>" + offices_list[i].ciudad + "</p>" +
                            "<p>" + offices_list[i].direccion + "</p>" +
                            "<p>" + offices_list[i].correo + "</p>" +
                            "<p>" + offices_list[i].telefono1 + "</p>" +
                            "<p>" + offices_list[i].telefono2 + "</p>" +
                            "</div>" +
                            "</div>" +
                            "</div>";


                    var infowindow = new google.maps.InfoWindow({
                        content: office_content
                    });


                    var office_lat = parseFloat(offices_list[i].latitud);
                    var office_lng = parseFloat(offices_list[i].longitud);

                    var office_position = {lat: office_lat, lng: office_lng};

                    var marker = new google.maps.Marker({
                        position: office_position,
                        map: OFFICES_MAP,
                        title: offices_list[i].nombre
                    });
                    marker.addListener('click', function () {
                        infowindow.open(OFFICES_MAP, marker);
                    });

                }

            } else {
                show_notification_message(news_parse.message);
            }
        },
        error: function () {
            onOffline();
        }
    });
}
function show_promotions() {



    $.ajax({
        url: URL_SERVICES + "traerTodoPromociones.php",
        type: "GET",
        dataType: 'text',
        success: function (data) {

            var data_parse = JSON.parse(data);

            if (data_parse.status == 200) {

                var promotions_list = data_parse.data;

                $("#promotion_card_container").html("");
                for (var i = 0; i < promotions_list.length; i++) {

                    var promotion_template =
                            "<div class='col-50'>" +
                            "<div class='card ks-card-header-pic' style='margin-top: 5px;margin-bottom: 5px;'>" +
                            "<div style='background-image:url(" + promotions_list[i].imagen + ")' valign='bottom' class='card-header color-white no-border'>Journey To Mountains</div>" +
                            "<div class='card-content'>" +
                            "<div class='card-content-inner'> " +
                            "<p>" + promotions_list[i].nombre + "</p>" +
                            "<p>Vence: " + promotions_list[i].vencimiento + "</p>" +
                            "</div>" +
                            "<a href='#' data-id=" + promotions_list[i].id + "  style='right: -15px; bottom: -25px;'class='floating-button color-pink show-promotion-detail'>" +
                            "<i class='icon icon-plus'></i></a>" +
                            "</div>" +
                            "</div>" +
                            "</div>";

                    $("#promotion_card_container").append(promotion_template);
                }

                $(".show-promotion-detail").click(function () {

                    var id_promotion = $(this).attr("data-id");

                    ID_PROMOTION_SELECTED = id_promotion;

                    mainView.router.load({url: 'promotion_detail.html'});



                });

            } else {
                show_notification_message(data_parse.message);
            }
        },
        error: function () {
            onOffline();
        }
    });
}
function show_agreements() {



    $.ajax({
        url: URL_SERVICES + "traerTodoConvenios.php",
        type: "GET",
        dataType: 'text',
        success: function (data) {

            var data_parse = JSON.parse(data);

            if (data_parse.status == 200) {

                var agreement_list = data_parse.data;

                $("#agreement_list").html("");
                for (var i = 0; i < agreement_list.length; i++) {

                    var agreement_template =
                            "<div class='col-25'>" +
                            "<img style='max-width:100%;' src='" + agreement_list[i].imagen + "'/>" +
                            "</div>";

                    $("#agreement_list").append(agreement_template);
                }
 
            } else {
                show_notification_message(data_parse.message);
            }
        },
        error: function () {
            onOffline();
        }
    });
}



//*****************************************************************  
//*********                agreement                       ************ 
//***************************************************************** 

myApp.onPageInit('agreement', function (page) {

    show_agreements();
});
//*****************************************************************  
//*********                SALES                       ************ 
//***************************************************************** 

myApp.onPageInit('sales', function (page) {

    show_promotions();
});
//*****************************************************************  
//*********                LOGIN                       ************ 
//***************************************************************** 

myApp.onPageInit('login', function (page) {




    $("#login_btn").click(function () {


        var is_empty = false;

        $(".item-input-field-login").each(function () {
            if ($(this).val() === "")
                is_empty = true;
        });

        if (!is_empty) {

            var username = $("#username").val();
            var password = $("#password").val();


            var log_data = {
                'username': username,
                'password': password
            };


            $.ajax({
                url: URL_SERVICES + "logearUsuario.php",
                type: "POST",
                data: log_data,
                success: function (data) {

                    var data_parse = JSON.parse(data);

                    if (data_parse.status == 200) {

                        myApp.formStoreData('session', data_parse.data);

                        mainView.router.load({url: 'home.html'});
                    } else {
                        show_notification_message(data_parse.message);
                    }
                },
                error: function () {
                    onOffline();
                }
            });
        } else {
            show_notification_message("Todos los campos son obligatorios.");
        }
    });


});


//*****************************************************************  
//*********               promotion_detail                       ************ 
//***************************************************************** 

myApp.onPageInit('promotion_detail', function (page) {

    get_promotions_detail_by_id(ID_PROMOTION_SELECTED);

});
//*****************************************************************  
//*********                NEW DETAIL                       ************ 
//***************************************************************** 

myApp.onPageInit('new_detail', function (page) {

    get_new_detail_by_id(ID_NEW_SELECTED);

});



//*****************************************************************  
//*********                offices                       ************ 
//***************************************************************** 

myApp.onPageInit('offices', function (page) {


    var windowHeight = $(window).height() - 56;
    $('#map').css('height', windowHeight + 'px');



    OFFICES_MAP = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 3.4375000000000004, lng: -76.52277777777778},
        zoom: 10
    });

    charge_offices();
});

//*****************************************************************  
//*********                HOME                       ************ 
//***************************************************************** 

myApp.onPageInit('home', function (page) {

    charge_news();

});
//*****************************************************************  
//*********                REGISTRO                       ************ 
//***************************************************************** 

myApp.onPageInit('register', function (page) {

    $("#btn_register").click(function () {

        var is_empty = false;

        $(".input-field-register").each(function () {
            if ($(this).val() === "")
                is_empty = true;
        });

        if (!is_empty) {
            var name = $("#name").val();
            var username = $("#username_reg").val();
            var email = $("#email").val();
            var phonenumber = $("#phonenumber").val();
            var password_reg = $("#password_reg").val();
            var password_reg_confirm = $("#password_reg_confirm").val();
            var cellnumber = $("#cellnumber").val();
            var city = $("#city option:selected").val();

            if (city !== "0") {
                if (validate_email(email)) {

                    if (password_reg === password_reg_confirm) {

                        var reg_data = {
                            'name': name,
                            'username': username,
                            'email': email,
                            'phonenumber': phonenumber,
                            'cellnumber': cellnumber,
                            'password': password_reg,
                            'city': city
                        };


                        $.ajax({
                            url: URL_SERVICES + "nuevoUsuario.php",
                            type: "POST",
                            data: reg_data,
                            success: function (data) {


                                console.log("data---->" + data);

                                var data_parse = JSON.parse(data);

                                if (data_parse.status == 200) {

                                    var session_data = {
                                        'id': data_parse.data.id,
                                        'name': name,
                                        'username': username,
                                        'email': email,
                                        'phonenumber': phonenumber,
                                        'cellnumber': cellnumber,
                                        'password': password_reg,
                                        'city': city
                                    };


                                    myApp.formStoreData('session', session_data);
                                    mainView.router.load({url: 'home.html'});
                                } else {
                                    show_notification_message(data_parse.message);
                                }
                            },
                            error: function () {
                                onOffline();
                            }
                        });
                    } else {
                        show_notification_message("Las contraseñas no coninciden");
                    }
                } else {
                    show_notification_message("El correo ingresado no es válido.");
                }
            } else {
                show_notification_message("Debes seleccionar una ciudad.");
            }
        } else {
            show_notification_message("Todos los campos son obligatorios.");
        }





    });


});
//*****************************************************************  
//*********                SPLASH                      ************ 
//***************************************************************** 
var OP_PAGE_SPLASH = myApp.onPageInit('splash', function (page) {
    // myApp.formDeleteData('session');

    close_modal();
    setTimeout(function () {
        var storedData = myApp.formGetData('session');
        if (storedData !== undefined) {
            mainView.router.load({url: 'home.html'});
        }
        else {
            mainView.router.load({url: 'login.html'});
            //   mainView.router.load({url: 'home.html'});
        }
    }, 1000);
});

//*****************************************************************  
//*********                CORDOVA                     ************ 
//***************************************************************** 
var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function (id) {

        document.addEventListener("backbutton", function (e) {
            COUNT_BACK++;
            if (COUNT_BACK == 2) {

                COUNT_BACK = 0;
                show_close_app_modal();
            }
            else {
                e.preventDefault();
            }
        }, false);

        LP_PAGE_SPLASH.trigger();
    }
};
app.initialize();
//OP_PAGE_SPLASH.trigger();



 