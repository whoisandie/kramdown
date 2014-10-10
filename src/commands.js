var listRE = /^(\s*)([*+-]|(\d+)\.)(\s+)/,
    elistRE = /^(\s*)([*+-]|(\d+)\.)(\s*)$/,
    unorderedBullets = '*+-';

CodeMirror.commands.newlineAndIndentContinueMarkdownList = function(cm) {
  if (cm.getOption('disableInput')) {
    return CodeMirror.Pass;
  }
  var ranges = cm.listSelections(), replacements = [];
  for (var i = 0; i < ranges.length; i++) {
    var pos = ranges[i].head, match, ematch;
    var inList = cm.getStateAfter(pos.line).list !== false;

    if(!ranges[i].empty() || (ematch = cm.getLine(pos.line).match(elistRE))){
      cm.execCommand('delLineLeft');
      cm.execCommand('newlineAndIndent');
      return;
    }

    if (!ranges[i].empty() || !inList || !(match = cm.getLine(pos.line).match(listRE))) {
      cm.execCommand('newlineAndIndent');
      return;
    }

    var indent = match[1], after = match[4];
    var bullet = unorderedBullets.indexOf(match[2]) >= 0
      ? match[2]
      : (parseInt(match[3], 10) + 1) + '.';

    replacements[i] = '\n' + indent + bullet + after;
  }

  cm.replaceSelections(replacements);
};