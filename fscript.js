(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports= factory( );
    } else {
        root.fscript = factory();
    }
}(this, function () {
    'use strict';
                    
    // use for create a metaclass
    function __makeClass__(classname,extendClass,attr,metaClass){
        if(metaClass){
            var classObj = metaClass.prototype.__new__.apply(this,arguments);
                classObj.prototype.__metaClass__ = metaClass;
            return classObj;
        }else if(extendClass){
            return extendClass.prototype.__metaClass__.prototype.__new__.apply(this,arguments);
        }else{
            return CLASS.prototype.__new__.apply(this,arguments);
        }
    }
    function CLASS(classname,extendClass,attr){
        return CLASS.prototype.__new__.apply(this,arguments);
    }
    CLASS.prototype={
        __new__:function(classname,extendClass,attr){
            var newClass = function(){
                return newClass.prototype.__new__.apply(this,arguments);
            }
            if(extendClass==CLASS){
                //create a meta class
                newClass.prototype = {
                    __new__:CLASS.prototype.__new__,
                    __attr__:attr,
                    __className__:classname,
                    __class__: newClass,
                    __extendsClasses__:[extendClass],
                    __baseClass__:extendClass,
                    __metaClass__:CLASS
                };
                attr.apply(newClass.prototype);
            }else{
                //create a normal class
                newClass.prototype = {
                    __new__:function(){
                        var Obj = {};
                        Obj[classname] = function(){};
                        newClass.prototype.__attr__.apply(Obj);
                        if(arguments.length)
                            Obj[classname].apply(Obj,arguments);
                        if(extendClass){
                            var upper = extendClass.prototype.__new__();
                            newClass.prototype.__extendsClasses__=newClass.prototype.__extendsClasses__.concat(extendClass.prototype.__extendsClasses__);
                            Obj.upper = upper;
                            for(var key in upper){
                                if(!Obj[key]){
                                    Obj[key]=upper[key];
                                }
                            }
                        }
                        return Obj;
                    },
                    __attr__:attr,
                    __className__:classname,
                    __class__: newClass,
                    __extendsClasses__:[extendClass],
                    __baseClass__:extendClass,
                    __metaClass__:CLASS
                };
            }
            return newClass;
        },
        __attr__:function(){this.CLASS=function(){}},
        __className__:"CLASS",
        __class__:CLASS,
        __baseClass__:null,
        __extendsClasses__:[],
        __metaClass__:CLASS
    };
    function upper(key,obj){
        if(obj.upper)
            return obj.upper[key];
        else
            return null;
    }
                                    
    return {CLASS:CLASS,__makeClass__:__makeClass__,upper:upper};
}));