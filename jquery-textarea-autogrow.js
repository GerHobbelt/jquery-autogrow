/* 
 * Auto Expanding Text Area (1.3.0)
 *
 * Licensed under the GPL License
 * Copyright (c) 2014 Scribe Inc. <scribenet.com>
 * Copyright (c) 2008 Chrys Bader <chrysbader.com>
 */
 
(function(jQuery) {

    var self = null;
 
    jQuery.fn.autogrow = function(o)
    {   
        return this.each(function() {
            new jQuery.autogrow(this, o);
        });
    };


    /**
     * @param Object e The textarea to create the autogrow for
     * @param Hash   o A set of key/value pairs to set as configuration properties
     */
    jQuery.autogrow = function (e, o)
    {
        this.options         = o || {};
        this.dummy           = null;
        this.interval        = null;
        this.line_height     = this.options.lineHeight || parseInt(jQuery(e).css('line-height'));
        this.min_height      = this.options.minHeight  || parseInt(jQuery(e).css('min-height'));
        this.max_height      = this.options.maxHeight  || parseInt(jQuery(e).css('max-height'));
        this.expand_callback = this.options.expandCallback;
        this.textarea        = jQuery(e);

        if(this.line_height == NaN) {
            this.line_height = 0;
        }

        this.init();
    };

    jQuery.autogrow.fn = jQuery.autogrow.prototype = {
        autogrow: '1.3.0'
    };

    jQuery.autogrow.fn.extend = jQuery.autogrow.extend = jQuery.extend;

    jQuery.autogrow.fn.extend({

        init: function() {          
            var self = this;            
            this.textarea.css({overflow: 'hidden', display: 'block'});
            this.textarea.bind('focus', function() { self.startExpand() } ).bind('blur', function() { self.stopExpand() });
            this.checkExpand(); 
        },

        startExpand: function() {              
            var self = this;
            this.interval = window.setInterval(function() {self.checkExpand()}, 400);
        },

        stopExpand: function() {
            clearInterval(this.interval);   
        },

        checkExpand: function() {
            if (this.dummy == null) {
                this.dummy = jQuery('<div></div>');
                this.dummy.css({
                    'font-size'     : this.textarea.css('font-size'),
                    'font-family'   : this.textarea.css('font-family'),
                    'width'         : this.textarea.css('width'),
                    'padding-top'   : this.textarea.css('padding-top'),
                    'padding-right' : this.textarea.css('padding-right'),
                    'padding-bottom': this.textarea.css('padding-bottom'),
                    'padding-left'  : this.textarea.css('padding-left'),
                    'line-height'   : this.line_height + 'px',
                    'overflow-x'    : 'hidden',
                    'position'      : 'absolute',
                    'top'           : 0,
                    'left'          : -9999,
                    'white-space'   : 'pre-wrap',
                    'word-wrap'     : 'break-word'
                }).appendTo('body');
            }

            this.textarea.css('min-height', '100px'); 

            var dummyWidth = this.dummy.css('width');
            var textareaWidth = this.textarea.css('width');

            var html = this.textarea.val().replace(/(<|>)/g, '');

            if (jQuery.browser.msie) {
                html = html.replace(/\n/g, '<BR>new');
            } else {
                html = html.replace(/\n/g, '<br>new');
            }

            if (this.dummy.html() != html || dummyWidth != textareaWidth) {
                this.dummy.html(html);
                this.dummy.width(textareaWidth);

                if (this.max_height > 0 && (this.dummy.height() + this.line_height > this.max_height)) {
                    this.textarea.css('overflow-y', 'auto');   
                } else {
                    this.textarea.css('overflow-y', 'hidden');
                    if (this.textarea.height() < this.dummy.height() + this.line_height || (this.dummy.height() < this.textarea.height())) {   
                        this.textarea.animate({height: (this.dummy.height() + this.line_height) + 'px'}, 100);  
                    }
                }
            }

            if (this.expand_callback) {
                var self = this;
                window.setTimeout(function(){self.expand_callback()},500);
            }
        }

     });
})(jQuery);