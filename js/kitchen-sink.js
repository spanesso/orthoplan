var URL_SERVICES = "http://neuromedia.com.co/servicios/";


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



//*****************************************************************  
//*********                SALES                       ************ 
//***************************************************************** 

myApp.onPageInit('sales', function (page) {

    $("#login_button").click(function () {
        alert("PRUEBA");
    });


});
//*****************************************************************  
//*********                LOGIN                       ************ 
//***************************************************************** 

myApp.onPageInit('login', function (page) {




    $("#login_btn").click(function () {

        mainView.router.load({url: 'home.html'});

//        var is_empty = false;
//
//        $(".item-input-field-login").each(function () {
//            if ($(this).val() === "")
//                is_empty = true;
//        });
//
//        if (!is_empty) {
//
//            var username = $("#username").val();
//            var password = $("#password").val();
//
//
//            var log_data = {
//                'username': username,
//                'password': password
//            };
//
//
//            $.ajax({
//                url: URL_SERVICES + "logearUsuario.php",
//                type: "POST",
//                data: log_data,
//                success: function (data) {
//
//                    var data_parse = JSON.parse(data);
//
//                    if (data_parse.status == 200) {
//                        mainView.router.load({url: 'home.html'});
//                    } else {
//                        show_notification_message(data_parse.message);
//                    }
//                },
//                error: function () {
//                    onOffline();
//                }
//            });
//        } else {
//            show_notification_message("Todos los campos son obligatorios.");
//        }
    });


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
            var username = $("#username").val();
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

                                var data_parse = JSON.parse(data);

                                if (data_parse.status == 200) {
                                    myApp.formStoreData('session', reg_data);
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
//app.initialize();
OP_PAGE_SPLASH.trigger();



 