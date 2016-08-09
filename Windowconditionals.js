// output functions are configurable.  This one just appends some text
// to a pre element.
var textValue = '';
function checker() {
    var textarea = document.getElementById('yourcode');
    textValue=textarea.value;  //-> don't use .innerHTML since there is no HTML in a textarea element
    }

function outf(text) { 
    var mypre = document.getElementById("output"); 
    mypre.innerHTML = mypre.innerHTML + text; 
} 
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
$(document).delegate('#yourcode', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

    // put caret at right position again
    $(this).get(0).selectionStart =
    $(this).get(0).selectionEnd = start + 1;
  }
});

function runit() { 
   var prog = document.getElementById("yourcode").value; 
   var mypre = document.getElementById("output"); 
   mypre.innerHTML = ''; 
   Sk.pre = "output";
   Sk.configure({output:outf, read:builtinRead}); 
   (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
 
   });
   myPromise.then(function(mod) {
       console.log('success');
       document.getElementById("columnright").innerHTML="";
   },
       function(err) {    
       console.log(err.toString());        
        if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad token") >= 0) { //print(slk")
        document.getElementById("columnright").innerHTML=err.toString() +"<br><br> It looks like you've forgotten to close your quotes on this line.";
        }
        else if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad input")>=0  && textValue.indexOf('print')!= -1) { //print(slk slslslsl)
        document.getElementById("columnright").innerHTML=err.toString() +"<br><br> Don't forget to put quotation marks around the sentence that you're trying to print, close your parentheses and separate strings and integers with commas."
        }
        else if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad input") >= 0 && textValue.indexOf('for')!=-1 && textValue.indexOf('range')!=-1) { //for i in range(3):
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br> You are having a "+'"for __ in range (__):"'+" problem. Make sure all the code you want in the loop is indented, you formatted the loop correctly, and the number is in parentheses and is followed by a colon.";
        }
        else if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad input") >= 0 && textValue.indexOf('for')!=-1 && textValue.indexOf('elem')!=-1) { //for elem in:
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br> You are having a "+'"for elem in __:"'+" problem. Make sure all the code you want in the loop is indented, you formatted the loop correctly, and that you are searching for elems in a list and not anything else.";
        }
        else if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad input") >= 0 && textValue.indexOf('for')!=-1) { //for:
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br> You are having some issue with a for loop. Try using a "+'"for elem in __:"'+" or "+'"for __ in range (__):"'+"loop.";
        }
        else if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad input") >= 0 && textValue.indexOf('if')!=-1) { //if x=5:
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br> You are having some issue with an "+'"if __:"'+ " conditional.<br> If you are checking that a variable equals something, make sure you use double equal signs. Make sure if, elif, and else are spelled correctly and that you used a semicolon and indented after declaring your conditional.";
        }
        else if (err.toString().indexOf("ParseError") >=0 && err.toString().indexOf("bad input")>=0 && textValue.indexOf ('def') !=-1 ){//function error
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You are having a "+'"def function_name (parameter):"'+" problem. Make sure you put parentheses after the name of your function, with parameters inside them if you have any, and a colon at the end of the line."  
        }
        else if (err.toString().indexOf("ParseError") >= 0 && err.toString().indexOf("bad input")>=0 ) { //def function (:
        document.getElementById("columnright").innerHTML=err.toString() +"<br><br> Don't forget to close your parentheses."
        }
        else if (err.toString().indexOf("NameError") >= 0 && err.toString().indexOf("not defined") >= 0 && textValue.indexOf('=')!=-1) { //print(slk) and print slk
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br>Check that you're using equal signs correctly. When assigning a variable a value you should use one equal sign, but when checking if two things are equivalent you should use two";
        }
        else if (err.toString().indexOf("NameError") >= 0 && err.toString().indexOf("not defined") >= 0) { //print(slk) and print slk
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br>It looks like you're trying to use a variable or function you haven't defined yet (or spelled wrong). Make sure if you're trying to print something it is surrounded by quotes and parentheses like " +'("this").';
        }
        else if (err.toString().indexOf("TokenError") >= 0 && err.toString().indexOf("EOF") >= 0) { //print(slk
            document.getElementById("columnright").innerHTML=err.toString() +"<br><br>Make sure you've closed all your grouping symbols (like parentheses and brackets) so the program can detect the end of your file.";
        }
        else if (err.toString().indexOf("ImportError") >= 0 && err.toString().indexOf("stdin") >= 0) { //running it blank
            document.getElementById("columnright").innerHTML  =err.toString() +"<br><br>You didn't input any code. Type something into the console!";
        }
        else if (err.toString().indexOf("ImportError") >= 0 && err.toString().indexOf("no module") >= 0) { //import pygame or something else
            document.getElementById("columnright").innerHTML  =err.toString() +"<br><br>You're trying to import some module that our website doesn't support yet. Sorry!";
        }
        else if (err.toString().indexOf("TypeError") >=0 && err.toString().indexOf("str")>=0 && err.toString().indexOf("int")>=0){//string+int error
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You can't mix integers and strings. Make sure you stick to one type of variable by casting it to either "+'"str(your_integer)" or "int(your_string)".'
        }
        else if (err.toString().indexOf("SyntaxError") >=0 && err.toString().indexOf("unicode")>=0 && err.toString().indexOf("character")>=0){//special characters
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> We're sorry, our website doesn't support Lenny or any special characters. ( ͡° ͜ʖ ͡°)"
        }
        else if (err.toString().indexOf("IndexError") >=0 && err.toString().indexOf("list")>=0){//index error
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You are having a problem with your list. Make sure you index starting from 0 and don't go past the last index."
        }
        else if (err.toString().indexOf("UnboundLocalError") >=0 && err.toString().indexOf("referenced before assignment")>=0){//referencing variable after use error
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You are having a problem with declaring your variable. Make sure you declare your variable before using it and inside your function."
        }
        else if (err.toString().indexOf("ZeroDivisionError") >=0){//dividing by 0
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You can't divide by 0!!!!!!! Siri would be ashamed of you."
        }
        else if (err.toString().indexOf("AttributeError") >=0&& err.toString().indexOf("tuple")>=0){//list=()
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You are having a" +'"list=[]" error. Make sure you include brackets when you declare your list.'
        }
        else if (err.toString().indexOf("TypeError") >=0&& err.toString().indexOf("indexing")>=0){//list.append[]
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You are having a" +'"list.function()" error. Make sure your syntax and spelling is correct.'
        }
        else if (err.toString().indexOf("TypeError") >=0&& err.toString().indexOf("arguments")>=0) {//not declaring list before calling functions
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> You are having an issue with parameters. Make sure you have the correct amount of attributes in the parentheses of your function and that your lists are declared before you use them."
        }
        else if (err.toString().indexOf("AttributeError") >=0){//list=()
            document.getElementById("columnright").innerHTML=err.toString()+"<br><br> Make sure you are spelling everything correctly and have the right amount of parameters."
        }
        else {document.getElementById("columnright").innerHTML  =err.toString() +"<br><br>Sorry, but we haven't seen this type of error before. Check out one of the resources below for help.";}
   });
} 




