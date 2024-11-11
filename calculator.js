var savedTopPos = 100;
var savedLeftPos = 750;

var calcOn = false;
var minimmized = false;

var readyNext = false;
var equationSet = false;

var input = document.getElementById('calc_head_input');
input.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9 \,\.]/, '');
});

checkCalcCookies();

function checkCalcCookies(){
    var alive = getCookie('calc_alive_cookie');
    if(alive == 1){
        calcOn = true;
        $("#Calculator-hide").attr('id', 'Calculator');
        var elem = document.getElementById('Calculator');
        dragElement(elem);
        var top = getCookie('calc_top_cookie');
        if(top != 0 && top != ''){
            savedTopPos = top;
            elem.style.top = savedTopPos+'px';
        }
        var left = getCookie('calc_left_cookie');
        if(left != 0 && left != ''){
            savedLeftPos = left;
            elem.style.left = savedLeftPos+'px';
        }

        var calcVal = getCookie('calc_val_cookie');

        if(calcVal != '0' && calcVal != ''){
                var calcHeader = getCookie('calc_header_cookie');
                $('#prev_eq').html(calcHeader);
                $('#calc_head_input').val(calcVal);
        }

        var isMin = getCookie('minimized');

        if(isMin != '0' && isMin != ''){
            minCalc(true);
            minimmized = true;
            savedTopPos = 935;
            elem.style.top = '935px';
        }
    }

}

$( function() {
    $( "#tog_mycalc" ).on( "click", function() {  
    if ( calcOn ) {
        //!TURN OFF
        $("#div_mycalc-active").attr('id', 'div_mycalc');
        $("#Calculator").attr('id', 'Calculator-hide');
        setCookie('calc_alive_cookie',0,7);
        setCookie('calc_top_cookie',100,7);
        setCookie('calc_left_cookie',750,7);
        setCookie('minimized',0,7);
      } else {
        //*TURN ON
        $("#div_mycalc").attr('id', 'div_mycalc-active');
        $("#Calculator-hide").attr('id', 'Calculator');
        dragElement(document.getElementById("Calculator"));
        setCookie('calc_alive_cookie',1,7);
        setCookie('minimized',0,7);
      }
      calcOn = !calcOn;
    });
  } );

function closeCalc(){
    $("#div_mycalc-active").attr('id', 'div_mycalc');
    $("#Calculator").attr('id', 'Calculator-hide');
    calcOn = false;
    setCookie('calc_alive_cookie',0,7);
    setCookie('minimized',0,7);
}
var isPinned = false;
function pinCalc(){
    isPinned = !isPinned;
    if(isPinned){
        $("#pin-calc").val("📍");
    }else{
        $("#pin-calc").val("📌");
    }
}

function minCalc(inspct = false){
    if(!minimmized){
        $("#min-calc").val('◳');
        var elemTop = document.getElementById('Calculator').style.top;
        elemTop = elemTop.replace("px", "");
        elemTop = elemTop.replace("%", "");
        var elemViewTop = document.getElementById('Calculator');
        var viewportOffset = elemViewTop.getBoundingClientRect();
        // these are relative to the viewport, i.e. the window
        var elemViewTop = viewportOffset.top;
        elemtop = eval((elemTop + '-' + elemViewTop) + '+935');
        document.getElementById("Calculator").style.top = elemtop+'px';
        document.getElementById("Calculator").style.left = '0px';
        var newElemID = document.getElementById('Calculator');
        var newElemViewTop = newElemID.getBoundingClientRect();
        newElemViewTop = newElemViewTop.top;
        savedTopPos = newElemViewTop;
        savedLeftPos = 0;
        setCookie('calc_top_cookie',savedTopPos,7);
        setCookie('calc_left_cookie',0,7);
        setCookie('minimized',1,7);
    }else{
        var elemTop = document.getElementById('Calculator').style.top;
        elemTop = elemTop.replace("px", "");
        elemTop = elemTop.replace("%", "");
        elemtop = eval(elemTop + '-735');
        $("#min-calc").val('—');
        document.getElementById("Calculator").style.top = elemtop+'px';
        document.getElementById("Calculator").style.left = '750px';
        savedTopPos = 100;
        savedLeftPos = 750;
        setCookie('calc_top_cookie',savedTopPos,7);
        setCookie('calc_left_cookie',savedLeftPos,7);
        setCookie('minimized',0,7);
    }
    if(!inspct){
        minimmized = !minimmized;
    }
}

function FormatCalculator(){
    let exist = $('#calc_head_input').val();
    if(exist == ''){
        $('#calc_head_input').val(0);
    }else{
        const splitby = exist.split('.');
        var retdat = splitby[0].replaceAll(",", "");
        var format = Number(retdat).toLocaleString("en-US");
        if(splitby.length > 1){
            format = format+'.'+splitby[1];
        }
        $('#calc_head_input').val(format);
    }

    setCookie('calc_header_cookie',$('#prev_eq').html(),7);
    setCookie('calc_val_cookie',$('#calc_head_input').val(),7);
}


function AppendToCalc(val){
    var exist = $('#calc_head_input').val();
    if(!readyNext){
        if(exist == '0'){
            $('#calc_head_input').val(val);
        }else{
            $('#calc_head_input').val(exist+val);
        }
    }else{
        $('#calc_head_input').val(val);
        readyNext = false;
    }
    FormatCalculator();
}

function DelFroCalc(typ){
    var exist = $('#calc_head_input').val();
    if(exist != ''){

        var remove = exist.slice(0, -1);
        if(typ == 1){
            if(remove != ''){
                $('#calc_head_input').val(remove);
            }else{
                $('#calc_head_input').val(0);
            }
        }else if (typ == 2){
            $('#prev_eq').html('&nbsp;');
            $('#calc_head_input').val('');
            readyNext = false;
            equationSet = false;
        }else if (typ == 3){
            $('#calc_head_input').val('');
            readyNext = false;
        }

    }
    FormatCalculator();
}

function AdjCalc(typ){
    var exist = $('#calc_head_input').val();
    if(exist != ''){

        if(typ == '+/-'){
            let letter = exist.charAt(0);
            if(letter == '-'){
                var remove = exist.substring(1);
                $('#calc_head_input').val(remove);
            }else{
                $('#calc_head_input').val('-'+exist);
            }
            readyNext = false;
        }else if(typ == '%'){
            var math =  eval(exist+"/100");
            $('#prev_eq').html(math);
            $('#calc_head_input').val(math);
            readyNext = true;
        }else if(typ == 'x²'){
            var math =  eval(exist+"*"+exist);
            $('#prev_eq').html('sqr('+exist+')');
            $('#calc_head_input').val(math);
            readyNext = true;
        }else if(typ == '²√x'){
            var math =  Math.sqrt(exist);
            $('#prev_eq').html('√('+exist+')');
            $('#calc_head_input').val(math);
            readyNext = true;
        }else if(typ == '1/x'){
            var math =  eval("1/"+exist);
            $('#prev_eq').html("1/("+math+')');
            $('#calc_head_input').val(math);
        }else if(typ == '.' && !exist.includes('.')){
            var deci = exist+'.';
            $('#calc_head_input').val(deci);
        }

    }
    FormatCalculator();
}

function ExecCalc(eq){
    var exist = $('#calc_head_input').val();
    if(exist != ''){

        if(equationSet){
            EqualCalc(eq);
        }else{
            $('#prev_eq').html(exist+eq);
            readyNext = true;
            equationSet = true;
        }

    }
    FormatCalculator();
}

function EqualCalc(typ = ''){
    var exist = $('#calc_head_input').val();
    if(exist != ''){
        var prev = $('#prev_eq').html();
        var all_math = prev+exist;
        var eq_clean = all_math.replaceAll("✕", "*");
        eq_clean = eq_clean.replaceAll(",", "");
        eq_clean = eq_clean.replaceAll("÷", "/");
        eq_clean = eq_clean.replaceAll("=", "");
        var mathequat = '';
        if(typ == '' && equationSet){
            mathequat = eval(eq_clean);
            mathequat = getCalcDeciVal(mathequat);
            $('#prev_eq').html(all_math+'=');
            $('#calc_head_input').val(mathequat);
            readyNext = true;
            equationSet = false;
        }else if(equationSet){
            mathequat =  eval(eq_clean);
            mathequat = getCalcDeciVal(mathequat);
            $('#prev_eq').html(mathequat+typ);
            $('#calc_head_input').val(mathequat);
            readyNext = true;
        }

    }
    FormatCalculator();
}

function getCalcDeciVal(mathequat){
    mathequat = mathequat.toString();
    if(mathequat.includes('.')){
        const splitby = mathequat.split('.');
        var cntZer = 0;
        for (var i = 0; i < splitby[1].length; i++) {
            console.log(i);
            if(splitby[1].charAt(i) == '0'){
                cntZer++;
                console.log(cntZer);
            }else{
                break;
            }
        }
        cntZer++;
        mathequat = (eval(mathequat)).toFixed(cntZer);
    }
    return mathequat;
}

//*Draggable Element Code

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        if(!minimmized){
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        saveCalcPos();
    }
}

$(window).scroll(function(){

    if(!isPinned){
        if(calcOn){
            migrateCalculator("Calculator");
        }else{
            migrateCalculator("Calculator-hide");
        }
    }
    
});

function saveCalcPos(){
    var elem = document.getElementById('Calculator');
    var viewportOffset = elem.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    var elemtop = viewportOffset.top;
    var elemleft = viewportOffset.left;
    savedTopPos = elemtop;
    savedLeftPos = elemleft;
    setCookie('calc_top_cookie',savedTopPos,7);
    setCookie('calc_left_cookie',savedLeftPos,7);
}

function migrateCalculator(id){
    var jqelem = $('#'+id);
    var newTop = eval(($(window).scrollTop()) + "+" + savedTopPos);
    var newLeft = eval(($(window).scrollLeft()) + "+" + savedLeftPos);
    jqelem.css({"top": (newTop) + "px", "left":(newLeft) + "px"});
}

//*Create Cookie Function
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}