function getMarkdownSection(content) {
  var $sectionEl = $('<section></section>');
  $sectionEl.attr('data-markdown', '');
  var $scriptEl = $('<script></script>');
  $scriptEl.attr('type', 'text/template');
  $scriptEl.text(content);
  $sectionEl.append($scriptEl);
  return $sectionEl;
}
