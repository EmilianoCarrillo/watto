(function($) {
  "use strict"; // Start of use strict

  // Closes the sidebar menu
  $("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $("#sidebar-wrapper").removeClass("active");
  });

  //#to-top button appears after scrolling
  var fixed = false;
  $(document).scroll(function() {
    if ($(this).scrollTop() > 250) {
      if (!fixed) {
        fixed = true;
        $('#to-top').show("slow", function() {
          $('#to-top').css({
            position: 'fixed',
            display: 'block'
          });
        });
      }
    } else {
      if (fixed) {
        fixed = false;
        $('#to-top').hide("slow", function() {
          $('#to-top').css({
            display: 'none'
          });
        });
      }
    }
  });

})(jQuery); // End of use strict

// Disable Google Maps scrolling
// See http://stackoverflow.com/a/25904582/1607849
// Disable scroll zooming and bind back the click event
var onMapMouseleaveHandler = function(event) {
  var that = $(this);
  that.on('click', onMapClickHandler);
  that.off('mouseleave', onMapMouseleaveHandler);
  that.find('iframe').css("pointer-events", "none");
}
var onMapClickHandler = function(event) {
  var that = $(this);
  // Disable the click handler until the user leaves the map area
  that.off('click', onMapClickHandler);
  // Enable scrolling zoom
  that.find('iframe').css("pointer-events", "auto");
  // Handle the mouse leave event
  that.on('mouseleave', onMapMouseleaveHandler);
}
// Enable map zooming with mouse scroll when the user clicks the map
$('.map').on('click', onMapClickHandler);



// ////////////// APP WATTO //////////////

var htmlElectrodomestico;
var i = 0;

function añadirElectrodomestico(){
  i++;
  htmlElectrodomestico = "<div class=\"container elementoElectrodomestico\" id=\""+i+"elemento\">\r\n<div class=\"row\" >\r\n <span class=\"idNumero\">"+i+"</span>\r\n<div class=\"col-3\">\r\n<input type=\"text\" class=\"form-control\" placeholder=\"Refrigerador\">\r\n</div>\r\n<div class=\"col-2\">\r\n<input type=\"text\" class=\"form-control\" placeholder=\"Samsung\">\r\n</div>\r\n<div class=\"col-2\">\r\n<input type=\"text\" class=\"form-control\" placeholder=\"RS25J5008SP\">\r\n</div>\r\n<div class=\"col-2\">\r\n<input type=\"number\" class=\"form-control\" placeholder=\"780\" id=\""+i+"potencia\" required=\"true\">\r\n</div>\r\n<div class=\"col-1\">\r\n<input type=\"number\" class=\"form-control\" placeholder=\"24\" id=\""+i+"horas\" required=\"true\">\r\n</div>\r\n<div class=\"col-1\">\r\n<button type=\"button\" class=\"btn btn-outline-danger\" onclick=\"eliminarElemento("+i+ ")\">Eliminar</button>\r\n</div>\r\n</div>\r\n</div>\r\n";
  $("#wrapper").append(htmlElectrodomestico);
}


function eliminarElemento(idElemento){
  $("#"+ idElemento +"elemento").remove();
}

var horasDelElemento, potenciaDelElemento;
var consumo, sumaConsumo = 0;
var periodoGral = 30;
var basico, intermedio, excedente, consumoVariable;

function changePeriodo(a){
  periodoGral = a;
}

function generarFactura(){
  sumaConsumo = 0;
  for (var j = 1; j <= i; j++) {
    horasDelElemento = $("#"+j+"horas").val();
    potenciaDelElemento = $("#"+j+"potencia").val();
    if (typeof(horasDelElemento) != "undefined" && typeof(potenciaDelElemento) != "undefined"){
      sumaConsumo += (potenciaDelElemento*horasDelElemento*periodoGral)/1000;
    }
  }

  consumoVariable = sumaConsumo;
  console.log(sumaConsumo);
  if (periodoGral == 30) {
    if (consumoVariable>140+75) {
      basico = 75;
      intermedio = 140;
      excedente = consumoVariable-basico-intermedio;
    } else if(consumoVariable>75 && consumoVariable <= 75+140){
      basico = 75;
      intermedio = consumoVariable-basico;
      excedente = 0;
    }else{
      basico = consumoVariable;
      intermedio = 0;
      excedente = 0;
    }
  } else{
    if (consumoVariable>280+150) {
      basico = 150;
      intermedio = 280;
      excedente = consumoVariable-basico-intermedio;
    } else if(consumoVariable>150 && consumoVariable <= 280+150){
      basico = 150;
      intermedio = consumoVariable-basico;
      excedente = 0;
    } else{
      basico = consumoVariable;
      intermedio = 0;
      excedente = 0;
    }
  }

  $("#kwhBasico").html(basico);
  $("#kwhIntermedio").html(intermedio);
  $("#kwhExcedente").html(excedente);

  $("#subtotalBasico").html("$"+Number((0.793 * basico).toFixed(2)));
  $("#subtotalIntermedio").html("$"+ Number((0.956*intermedio).toFixed(2)));
  $("#subtotalExcedente").html("$"+ Number((2.08*excedente).toFixed(2)));
  var subtotalSUMA = Number((0.793 * basico + 0.956*intermedio + 2.08*excedente).toFixed(2));
  $("#subtotalSuma").html("$"+subtotalSUMA);

  $("#energia").html("$"+subtotalSUMA);
  $("#iva").html("$"+ Number((subtotalSUMA*.16).toFixed(2)));
  var facSUMA = subtotalSUMA + subtotalSUMA*.16;
  $("#fac").html("$"+  Number((facSUMA).toFixed(2)));
  $("#dap").html("$"+  Number((facSUMA*0.06).toFixed(2)));
  $("#total").html("$"+  Number((facSUMA*0.06+facSUMA).toFixed(2)));




  console.log("básico: " + basico);
  console.log("intermedio: " + intermedio);
  console.log("excedente: " + excedente);
}
