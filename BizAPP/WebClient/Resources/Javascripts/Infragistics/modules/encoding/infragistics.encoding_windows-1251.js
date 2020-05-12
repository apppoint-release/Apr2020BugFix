﻿/*!@license
* Infragistics.Web.ClientUI infragistics.encoding_windows-1251.js 17.1.20171.1012
*
* Copyright (c) 2011-2017 Infragistics Inc.
*
* http://www.infragistics.com/
*
* Depends:
*     jquery-1.4.4.js
*     jquery.ui.core.js
*     jquery.ui.widget.js
*     infragistics.util.js
*/
(function(factory){if(typeof define==="function"&&define.amd){define(["./infragistics.util","./infragistics.dv.simple.core"],factory)}else{factory(igRoot)}})(function($){(function($){$.ig=$.ig||{};var $$t={};$.ig.globalDefs=$.ig.globalDefs||{};$.ig.globalDefs.$$a3=$$t;$.ig.$currDefinitions=$$t;$.ig.util.bulkDefine(["Encoding:b","Object:c","Type:d","Boolean:e","ValueType:f","Void:g","IConvertible:h","IFormatProvider:i","Number:j","String:k","IComparable:l","Number:m","IComparable$1:n","IEquatable$1:o","Number:p","Number:q","Number:r","NumberStyles:s","Enum:t","Array:u","IList:v","ICollection:w","IEnumerable:x","IEnumerator:y","NotSupportedException:z","Error:aa","Number:ab","String:ac","StringComparison:ad","RegExp:ae","CultureInfo:af","DateTimeFormatInfo:ag","Calendar:ah","Date:ai","Number:aj","DayOfWeek:ak","DateTimeKind:al","CalendarWeekRule:am","NumberFormatInfo:an","CompareInfo:ao","CompareOptions:ap","IEnumerable$1:aq","IEnumerator$1:ar","IDisposable:as","StringSplitOptions:at","Number:au","Number:av","Number:aw","Number:ax","Number:ay","Number:az","Assembly:a0","Stream:a1","SeekOrigin:a2","RuntimeTypeHandle:a3","MethodInfo:a4","MethodBase:a5","MemberInfo:a6","ParameterInfo:a7","TypeCode:a8","ConstructorInfo:a9","PropertyInfo:ba","UTF8Encoding:bb","InvalidOperationException:bc","NotImplementedException:bd","Script:be","Decoder:bf","UnicodeEncoding:bg","Math:bh","AsciiEncoding:bi","ArgumentNullException:bj","DefaultDecoder:bk","ArgumentException:bl","IEncoding:bm","Dictionary$2:bn","IDictionary$2:bo","ICollection$1:bp","IDictionary:bq","IEqualityComparer$1:br","EqualityComparer$1:bs","IEqualityComparer:bt","DefaultEqualityComparer$1:bu","KeyValuePair$2:bv","Thread:bw","ThreadStart:bx","MulticastDelegate:by","IntPtr:bz","StringBuilder:b0","Environment:b1","SingleByteEncoding:b2","RuntimeHelpers:b5","RuntimeFieldHandle:b6","Array:cd","Windows1251Encoding:c6","AbstractEnumerable:df","Func$1:dg","AbstractEnumerator:dh","GenericEnumerable$1:di","GenericEnumerator$1:dj"]);var $a=$.ig.intDivide,$b=$.ig.util.cast,$c=$.ig.util.defType,$d=$.ig.util.defEnum,$e=$.ig.util.getBoxIfEnum,$f=$.ig.util.getDefaultValue,$g=$.ig.util.getEnumValue,$h=$.ig.util.getValue,$i=$.ig.util.intSToU,$j=$.ig.util.nullableEquals,$k=$.ig.util.nullableIsNull,$l=$.ig.util.nullableNotEquals,$m=$.ig.util.toNullable,$n=$.ig.util.toString$1,$o=$.ig.util.u32BitwiseAnd,$p=$.ig.util.u32BitwiseOr,$q=$.ig.util.u32BitwiseXor,$r=$.ig.util.u32LS,$s=$.ig.util.unwrapNullable,$t=$.ig.util.wrapNullable,$u=String.fromCharCode,$v=$.ig.util.castObjTo$t;$c("SingleByteEncoding:b2","Encoding",{ae:null,ab:null,af:0,ag:null,ac:function(){},init:function(a,b){if(a>0){switch(a){case 1:this.init1.apply(this,arguments);break}return}$$t.$b.init.call(this);this.ah(b)},init1:function(a,b,c){$$t.$b.init.call(this);this.ah(b);this.ag=c},ah:function(a){this.af=a;this.ab=this.ac();if(this.ab==null){return}this.ae=new $$t.bn($$t.$ac.$type,$$t.$j.$type,0);for(var b=0;b<this.ab.length;b++){var c=this.ab[b];if(c!="￿"){this.ae.add(c,b)}}},fallbackCharacter:function(){return"?"},codePage:function(){return this.af},name:function(){return this.ag},getByteCount:function(a,b,c){return c},getBytes2:function(a,b,c,d,e){for(var f=b;f<b+c;f++){if(this.ae.containsKey(a[f])){d[e+f-b]=this.ae.item(a[f])}else{d[e+f-b]=this.getBytes1(this.fallbackCharacter().toString())[0]}}return c},getString1:function(a,b,c){var d=this.ab;var e=new $$t.b0(0);for(var f=b;f<b+c;f++){if(d[a[f]]!="￿"){e.h(d[a[f]])}}return e.toString()},$type:new $.ig.Type("SingleByteEncoding",$$t.$b.$type,[$$t.$bm.$type])},true);$c("Windows1251Encoding:c6","SingleByteEncoding",{ai:null,ac:function(){return this.ai},init:function(){this.ai=["\0","","","","","","","","\b","	","\n","","\f","\r","","","","","","","","","","","","","","","","","",""," ","!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~","","Ђ","Ѓ","‚","ѓ","„","…","†","‡","€","‰","Љ","‹","Њ","Ќ","Ћ","Џ","ђ","‘","’","“","”","•","–","—","","™","љ","›","њ","ќ","ћ","џ"," ","Ў","ў","Ј","¤","Ґ","¦","§","Ё","©","Є","«","¬","­","®","Ї","°","±","І","і","ґ","µ","¶","·","ё","№","є","»","ј","Ѕ","ѕ","ї","А","Б","В","Г","Д","Е","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я","а","б","в","г","д","е","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"];$$t.$b2.init1.call(this,1,1251,"windows-1251")},$type:new $.ig.Type("Windows1251Encoding",$$t.$b2.$type)},true);$$t.$b2.ad="?"})(igRoot)});