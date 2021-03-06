/**
 * combobox - jQuery EasyUI 1.3
 * 
 * Licensed under the GPL terms To use it on other terms please contact us
 * 
 * Copyright(c) 2009-2012 stworthy [ stworthy@gmail.com ]
 * 
 */
( function( $ ) {
    function scrollTo( target, value ) {
        var panel = $( target ).combo( "panel" );
        var item = panel.find( "div.combobox-item[value=\"" + value + "\"]" );
        if( item.length ) {
            if( item.position().top <= 0 ) {
                var h = panel.scrollTop() + item.position().top;
                panel.scrollTop( h );
            } else {
                if( item.position().top + item.outerHeight() > panel.height() ) {
                    var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
                    panel.scrollTop( h );
                }
            }
        }
    }
    ;
    function selectPrev( target ) {
        var panel = $( target ).combo( "panel" );
        var values = $( target ).combo( "getValues" );
        var item = panel.find( "div.combobox-item[value=\"" + values.pop() + "\"]" );
        if( item.length ) {
            var prev = item.prev( ":visible" );
            if( prev.length ) {
                item = prev;
            }
        } else {
            item = panel.find( "div.combobox-item:visible:last" );
        }
        var value = item.attr( "value" );
        select( target, value );
        scrollTo( target, value );
    }
    ;
    function selectNext( target ) {
        var panel = $( target ).combo( "panel" );
        var values = $( target ).combo( "getValues" );
        var item = panel.find( "div.combobox-item[value=\"" + values.pop() + "\"]" );
        if( item.length ) {
            var next = item.next( ":visible" );
            if( next.length ) {
                item = next;
            }
        } else {
            item = panel.find( "div.combobox-item:visible:first" );
        }
        var value = item.attr( "value" );
        select( target, value );
        scrollTo( target, value );
    }
    ;
    function select( target, value ) {
        var opts = $.data( target, "combobox" ).options;
        var data = $.data( target, "combobox" ).data;
        if( opts.multiple ) {
            var values = $( target ).combo( "getValues" );
            for( var i = 0; i < values.length; i++ ) {
                if( values[i] == value ) {
                    return;
                }
            }
            values.push( value );
            setValues( target, values );
        } else {
            setValues( target, [value] );
        }
        for( var i = 0; i < data.length; i++ ) {
            if( data[i][opts.valueField] == value ) {
                opts.onSelect.call( target, data[i] );
                return;
            }
        }
    }
    ;
    function unselect( target, value ) {
        var opts = $.data( target, "combobox" ).options;
        var data = $.data( target, "combobox" ).data;
        var values = $( target ).combo( "getValues" );
        for( var i = 0; i < values.length; i++ ) {
            if( values[i] == value ) {
                values.splice( i, 1 );
                setValues( target, values );
                break;
            }
        }
        for( var i = 0; i < data.length; i++ ) {
            if( data[i][opts.valueField] == value ) {
                opts.onUnselect.call( target, data[i] );
                return;
            }
        }
    }
    ;
    function setValues( target, values, remainText ) {
        var opts = $.data( target, "combobox" ).options;
        var data = $.data( target, "combobox" ).data;
        var panel = $( target ).combo( "panel" );
        panel.find( "div.combobox-item-selected" ).removeClass( "combobox-item-selected" );
        var vv = [], ss = [];
        for( var i = 0; i < values.length; i++ ) {
            var v = values[i];
            var s = v;
            for( var j = 0; j < data.length; j++ ) {
                if( data[j][opts.valueField] == v ) {
                    s = data[j][opts.textField];
                    break;
                }
            }
            vv.push( v );
            ss.push( s );
            panel.find( "div.combobox-item[value=\"" + v + "\"]" ).addClass( "combobox-item-selected" );
        }
        $( target ).combo( "setValues", vv );
        if( !remainText ) {
            $( target ).combo( "setText", ss.join( opts.separator ) );
        }
    }
    ;
    function transformData( target ) {
        var opts = $.data( target, "combobox" ).options;
        var data = [];
        $( ">option", target ).each( function() {
            var item = {};
            item[opts.valueField] = $( this ).attr( "value" ) != undefined ? $( this ).attr( "value" ) : $( this ).html();
            item[opts.textField] = $( this ).html();
            item["selected"] = $( this ).attr( "selected" );
            data.push( item );
        } );
        return data;
    }
    ;
    function loadData( target, data, remainText ) {
        var opts = $.data( target, "combobox" ).options;
        var panel = $( target ).combo( "panel" );
        $.data( target, "combobox" ).data = data;
        var values = $( target ).combobox( "getValues" );
        panel.empty();
        for( var i = 0; i < data.length; i++ ) {
            var v = data[i][opts.valueField];
            var s = data[i][opts.textField];
            var item = $( "<div class=\"combobox-item\"></div>" ).appendTo( panel );
            item.attr( "value", v );
            if( opts.formatter ) {
                item.html( opts.formatter.call( target, data[i] ) );
            } else {
                item.html( s );
            }
            if( data[i]["selected"] ) {
                ( function() {
                    for( var i = 0; i < values.length; i++ ) {
                        if( v == values[i] ) {
                            return;
                        }
                    }
                    values.push( v );
                } )();
            }
        }
        if( opts.multiple ) {
            setValues( target, values, remainText );
        } else {
            if( values.length ) {
                setValues( target, [values[values.length - 1]], remainText );
            } else {
                setValues( target, [], remainText );
            }
        }
        opts.onLoadSuccess.call( target, data );
        $( ".combobox-item", panel ).hover( function() {
            $( this ).addClass( "combobox-item-hover" );
        }, function() {
            $( this ).removeClass( "combobox-item-hover" );
        } ).click( function() {
            var item = $( this );
            if( opts.multiple ) {
                if( item.hasClass( "combobox-item-selected" ) ) {
                    unselect( target, item.attr( "value" ) );
                } else {
                    select( target, item.attr( "value" ) );
                }
            } else {
                select( target, item.attr( "value" ) );
                $( target ).combo( "hidePanel" );
            }
        } );
    }
    ;
    function request( target, url, param, remainText ) {
        var opts = $.data( target, "combobox" ).options;
        if( url ) {
            opts.url = url;
        }
        param = param || {};
        if( opts.onBeforeLoad.call( target, param ) == false ) {
            return;
        }
        opts.loader.call( target, param, function( data ) {
            loadData( target, data, remainText );
        }, function() {
            opts.onLoadError.apply( this, arguments );
        } );
    }
    ;
    function doQuery( target, q ) {
        var opts = $.data( target, "combobox" ).options;
        if( opts.multiple && !q ) {
            setValues( target, [], true );
        } else {
            setValues( target, [q], true );
        }
        if( opts.mode == "remote" ) {
            request( target, null, {
                q : q
            }, true );
        } else {
            var panel = $( target ).combo( "panel" );
            panel.find( "div.combobox-item" ).hide();
            var data = $.data( target, "combobox" ).data;
            for( var i = 0; i < data.length; i++ ) {
                var v = data[i][opts.valueField];
                var s = data[i][opts.textField];
                if( opts.formatter ) { s = opts.formatter.call( target, data[i] ); }
                var item = panel.find( "div.combobox-item[value=\"" + v + "\"]" );
                
                if( opts.filter.call( target, q, data[i] ) ) {
                    item.show();
                    if( s == q ) {  // 判断输入已经完成
                        setValues( target, [v], true );
                        item.addClass( "combobox-item-selected" );
                    }
                    // CUSTOM 高亮
                    if( opts.highlighter ) {
                        item.html( opts.highlighter.call( target, q, s ) );
                    }
                } else {
                    item.text( s );
                }
            }
        }
    }
    ;
    function create( target ) {
        var opts = $.data( target, "combobox" ).options;
        $( target ).addClass( "combobox-f" );
        $( target ).combo( $.extend( {}, opts, {
            onShowPanel : function() {
                $( target ).combo( "panel" ).find( "div.combobox-item" ).show();
                scrollTo( target, $( target ).combobox( "getValue" ) );
                opts.onShowPanel.call( target );
            }
        } ) );
    }
    ;
    $.fn.combobox = function( options, param ) {
        if( typeof options == "string" ) {
            var method = $.fn.combobox.methods[options];
            if( method ) {
                return method( this, param );
            } else {
                return this.combo( options, param );
            }
        }
        options = options || {};
        return this.each( function() {
            var state = $.data( this, "combobox" );
            if( state ) {
                $.extend( state.options, options );
                create( this );
            } else {
                state = $.data( this, "combobox", {
                    options : $.extend( {}, $.fn.combobox.defaults, $.fn.combobox.parseOptions( this ), options )
                } );
                create( this );
                loadData( this, transformData( this ) );
            }
            if( state.options.data ) {
                loadData( this, state.options.data );
            }
            request( this );
        } );
    };
    $.fn.combobox.methods = {
        options : function( jq ) {
            return $.data( jq[0], "combobox" ).options;
        },
        getData : function( jq ) {
            return $.data( jq[0], "combobox" ).data;
        },
        setValues : function( jq, values ) {
            return jq.each( function() {
                setValues( this, values );
            } );
        },
        setValue : function( jq, value ) {
            return jq.each( function() {
                setValues( this, [value] );
            } );
        },
        clear : function( jq ) {
            return jq.each( function() {
                $( this ).combo( "clear" );
                var panel = $( this ).combo( "panel" );
                panel.find( "div.combobox-item-selected" ).removeClass( "combobox-item-selected" );
            } );
        },
        loadData : function( jq, data ) {
            return jq.each( function() {
                loadData( this, data );
            } );
        },
        reload : function( jq, url ) {
            return jq.each( function() {
                request( this, url );
            } );
        },
        select : function( jq, value ) {
            return jq.each( function() {
                select( this, value );
            } );
        },
        unselect : function( jq, value ) {
            return jq.each( function() {
                unselect( this, value );
            } );
        }
    };
    $.fn.combobox.parseOptions = function( target ) {
        var t = $( target );
        return $.extend( {}, $.fn.combo.parseOptions( target ), $.parser.parseOptions( target, ["valueField", "textField", "mode",
                "method", "url"] ) );
    };
    $.fn.combobox.defaults = $.extend( {}, $.fn.combo.defaults, {
        valueField : "id",
        textField : "name",
        // CUSTOM : code Field
        codeField : "code",
        mode : "local",
        method : "post",
        url : null,
        data : null,
        keyHandler : {
            up : function() {
                selectPrev( this );
            },
            down : function() {
                selectNext( this );
            },
            enter : function() {
                var values = $( this ).combobox( "getValues" );
                $( this ).combobox( "setValues", values );
                $( this ).combobox( "hidePanel" );
            },
            query : function( q ) {
                doQuery( this, q );
            }
        },
        filter : function( q, row ) {
            var target = $(this);
            var opts = target.combobox( "options" );
            var text = row[opts.textField];
            if( opts.formatter ) { text = opts.formatter.call( target, row ); }
            return ~text.toLowerCase().indexOf( q.toLowerCase() );
        },
        formatter : function( row ) {
            var opts = $( this ).combobox( "options" );
            // CUSTOM : 'code - text'
            if( row[opts.codeField] ) {
                return row[opts.codeField] + " - " + row[opts.textField];
            }
            return row[opts.textField];
        },
        // CUSTOM : 自定义的高亮算法
        highlighter: function ( q, text ) {
            var query = q.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return text.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
               return "<b class='highlight'>" + match + "</b>";
            });
        },
        loader : function( param, onSuccess, onError ) {
            var opts = $( this ).combobox( "options" );
            if( !opts.url ) {
                return false;
            }
            $.ajax( {
                type : opts.method,
                url : opts.url,
                data : param,
                dataType : "json",
                success : function( data ) {
                    onSuccess( data );
                },
                error : function() {
                    onError.apply( this, arguments );
                }
            } );
        },
        onBeforeLoad : function( _57 ) {
        },
        onLoadSuccess : function() {
        },
        onLoadError : function() {
        },
        onSelect : function( record ) {
        },
        onUnselect : function( record ) {
        }
    } );
} )( jQuery );
