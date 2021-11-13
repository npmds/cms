// var snippets = document.querySelectorAll('pre');
// [].forEach.call(snippets, function (snippet) {
//     snippet.firstChild.insertAdjacentHTML('beforebegin',
//         '<button class="btn-clipboard" data-clipboard-snippet>Copy</button>'
//     );
// });
$("pre").each(function(){
    $(this).prepend('<button class="btn-clipboard" data-clipboard-snippet>Copy</button>')
});
var clipboardSnippets = new ClipboardJS('[data-clipboard-snippet]', {
    target: function (trigger) {
        return trigger.nextElementSibling;
    }
});
clipboardSnippets.on('success', function (e) {
    e.clearSelection();
    showTooltip(e.trigger, 'Copied!');
});
clipboardSnippets.on('error', function (e) {
    showTooltip(e.trigger, fallbackMessage(e.action));
});

// var btns = document.querySelectorAll('.btn-clipboard');
// for (var i = 0; i < btns.length; i++) {
//     btns[i].addEventListener('mouseleave', clearTooltip);
//     btns[i].addEventListener('blur', clearTooltip);
// }
//
// function clearTooltip(e) {
//     e.currentTarget.setAttribute('class', 'btn-clipboard');
//     e.currentTarget.removeAttribute('title');
// }

function showTooltip(elem, msg) {
    $(elem).attr("title", msg).tooltip("fixTitle").tooltip("show");
}

function fallbackMessage(action) {
    var actionMsg = '';
    var actionKey = (action === 'cut' ? 'X' : 'C');
    if (/iPhone|iPad/i.test(navigator.userAgent)) {
        actionMsg = 'No support :(';
    } else if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
    } else {
        actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
    }
    return actionMsg;
}