/* 
 * Auto Expanding Text Area (1.3.0)
 * by Chrys Bader (www.chrysbader.com) - chrysb@gmail.com
 * and Jakub Zelenka (www.bukka.eu) - jakub.zelenka@gmail.com
 *
 * Special thanks to:
 * Jake Chapa - jake@hybridstudio.com
 * John Resig - jeresig@gmail.com
 *
 * Copyright (c) 2008 - 2011 Chrys Bader (www.chrysbader.com)
 * Copyright (c) 2012 Chrys Bader & Jakub Zelenka
 *
 * Licensed under the GPL (GPL-LICENSE.txt) license. 
 *
 *
 * NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 *
 */
 
(function($) {
		  
	var self = null;

	var methods = {
		// initialization
		init: function(o) {
			// destroy object (unbind methods)
			methods.destroy.apply(this);
			
			this.each(function() {
				// get textarea
				var $textarea = $(this);
				
				// merge default and supplied options
				var options = $.extend({
					lineHeight: parseInt($textarea.css('line-height')),
					minHeight: parseInt($textarea.css('min-height')),
					maxHeight: parseInt($textarea.css('max-height')),
					expandCallback: function() {}
				}, o);
				
				if ($.browser.msie && (isNaN(options.line_height))) {
					// set the line height for IE
					$textarea.css('line-height','100%');
					options.lineHeight = parseInt($textarea.css('line-height'));
				}
				// save settings
				$textareay.data('autogrow', {
					options: options,
					dummy: null
				});
								
				$textarea
					.css({ overflow: 'hidden', display: 'block' })
					.bind('keyup.autogrow', function() {
						methods.update.apply($textarea);
					});
			});
			
			// initial update
			return methods.update.apply(this);
		},
		
		// destroy
		destroy: function() {
			return this.each(function() {
				$(this).unbind('.autogrow');
			});
		}

		// update 
		update: function() {
			return this.each(function() {
				var $textarea = $(this), settings = $textarea.data('autogrow');
				if (!settings || !settings.options) {
					$.error('Plugin jQuery.autogrow is not initialized!');
					return;
				}

				if (!settings.dummy) {
					settings.dummy = $('<div></div>')
						.css({
							'font-size'     : $textarea.css('font-size'),
							'font-family'   : $textarea.css('font-family'),
							'width'         : $textarea.css('width'),
							'padding-top'   : $textarea.css('padding-top'),
							'padding-right' : $textarea.css('padding-right'),
							'padding-bottom': $textarea.css('padding-bottom'),
							'padding-left'  : $textarea.css('padding-left'),
							'line-height'   : $line_height + 'px',
							'overflow-x'    : 'hidden',
							'position'      : 'absolute',
							'top'           : 0,
							'left'	        : -9999,
							'white-space'   : 'pre-wrap',
							'word-wrap'     : 'break-word'
						})
						.appendTo('body');
					$textarea.data('autogrow', settings);
				}
				var options = settings.options, dummy = settings.dummy;
				
				// Match dummy width (i.e. when using % width or "auto" and window has been resized)
				var dummyWidth = dummy.css('width');
				var textareaWidth = $textarea.css('width');
			
				// Strip HTML tags
				var html = $textarea.val().replace(/(<|>)/g, '');
			
				// IE is different, as per usual
				if (jQuery.browser.msie)
				{
					html = html.replace(/\n/g, '<BR>new');
				}
				else
				{
					html = html.replace(/\n/g, '<br>new');
				}

				// Grow if the text has been updated or textarea resized
				if (dummy.html() != html || dummyWidth != textareaWidth)
				{
					dummy.html(html);		 // update dummy content
					dummy.width(textareaWidth); // update dummy width to match
					
					if (options.maxHeight > 0 && (dummy.height() + options.lineHeight > options.maxHeight))
					{
						$textarea.css('overflow-y', 'auto');	
					}
					else
					{
						$textarea.css('overflow-y', 'hidden');
						if ($textarea.height() < dummy.height() + options.lineHeight || (dummy.height() < $textarea.height()))
						{	
							$textarea.animate({ height: (dummy.height() + options.lineHeight) + 'px'}, 100);	
						}
					}
				}
			
				if (options.expandCallback) {
					window.setTimeout(function() {
						options.expandCallback()
					}, 500);
				}
					
			});
		}
	};
		
 
	$.fn.autogrow = function(method)
	{
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.autogrow');
		}
	};

    /**
     * The autogrow object.
     *
     * @constructor
     * @name jQuery.autogrow
     * @param Object e The textarea to create the autogrow for.
     * @param Hash o A set of key/value pairs to set as configuration properties.
     * @cat Plugins/autogrow
     */
	
	$.autogrow = function(e, o)
	{
		$(e).autogrow(o);
	};
	
	jQuery.autogrow.fn = jQuery.autogrow.prototype = {
	  autogrow: '1.3.0'
	};
	
})(jQuery);
