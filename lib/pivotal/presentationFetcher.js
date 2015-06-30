function PresentationFetcher() {
}

//var Presentation = require("presentation");

PresentationFetcher.prototype.fetch = function(jsonPath) {
  var deferred = $.Deferred();
  $.getJSON(jsonPath)
    .done(function(json){
      var presentation = new Object();
      presentation.title = PresentationFetcher.prototype.getTitle(json.title);
      $.when(PresentationFetcher.prototype.getSlides(json.slides))
        .done(function(slides) {
          presentation.slides = slides;
          deferred.resolve(presentation);
        });
    });
  return deferred.promise();
};

//$.when.apply($, promises).then(function(){ doSomething()});

PresentationFetcher.prototype.getSlides = function(slideNames) {
  var deferred = $.Deferred();
  var defers = [], defer;
  var toComplete = [];
  var slides = [];
  $.each(slideNames, function(index, value) {
    if ( ! $.isArray(value) ) {
      defer = PresentationFetcher.prototype.getSlideContent(value);
      defers.push(defer);
      toComplete.push(defer);
    } else {
      var vDefers = [], vDefer;
      $.each(value, function(vIndex, vValue) {
        vDefer = PresentationFetcher.prototype.getSlideContent(vValue);
        vDefers.push(vDefer);
        toComplete.push(vDefer);
      });
      defers.push(vDefers);
    }
  });
  $.when.apply($, toComplete)
    .done(function() {
      for( i=0; i<defers.length; i++) {
        if (! $.isArray(defers[i])) {
          slides[i] = defers[i].responseText;
        } else {
          var vSlides = [];
          $.each(defers[i], function(vIndex, vValue) {
            vSlides.push(vValue.responseText);
          });
          slides[i] = vSlides;
        }
      }
      deferred.resolve(slides);
    });
  return deferred.promise();
};

PresentationFetcher.prototype.getSlideContent = function(slideName) {
  return $.get("slides/" + slideName)
    .done(function(content) {
      return content;
    })
    .fail(function(){
      //throw new Error("Could not retrieve slide content from file: slides/" + slideName);
    });
};

PresentationFetcher.prototype.getTitle = function(title) {
  if (title == null || title.trim() == "") {
    return "Pivotal";
  } else {
    return title;
  }
};
/*
PresentationFetcher.prototype.getSlideContent = function(slideName) {
  var content;
  $.get("slides/" + slideName)
    .done(function(data) {

    })
    .fail(function() {

    });
}*/

/*
SlideFetcher.prototype.getSlideSection = function(content) {
  var $sectionEl = $('<section></section>');
  $sectionEl.attr('data-markdown', '');
  var $scriptEl = $('<script></script>');
  $scriptEl.attr('type', 'text/template');
  $scriptEl.text(content);
  $sectionEl.append($scriptEl);
  return $sectionEl;
}
*/
//module.exports = PresentationFetcher;

/*
function fetchSlides() {
    $.getJSON( "slides/presentation.json", function( data ) {
      docuement.title = getTitle(data.title);
      parseJson(data, document.title, );
    });
}

function processJson(json) {
  var $parentEl = $("div.slides");
  $.each(json.slides, function( index, value ) {
    if ( ! $.isArray(value) ) {
      $.get("slides/" + value, function(content) {
        $parentEl.append(getSlideSection(content));
      }, "text");

    } else {
      var $sectionEl = $("<section></section>");

    }
  });
}

function getTitle(title) {
  if (title == null || title.trim() == "") {
    return "Pivotal";
  } else {
    return title;
  }
}

function getSlides(slides) {


}


*/
