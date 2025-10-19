// Lightweight client-side include utility
// Finds elements with data-include and injects the referenced HTML
// Example: <div data-include="/components/header.html"></div>
(function(){
  function includeFragments(){
    var includeNodes = document.querySelectorAll('[data-include]');
    if(!includeNodes || includeNodes.length === 0) return;

    includeNodes.forEach(function(node){
      var url = node.getAttribute('data-include');
      if(!url) return;
      fetch(url, { cache: 'no-cache' })
        .then(function(res){ return res.text(); })
        .then(function(html){ node.innerHTML = html; })
        .catch(function(){ /* ignore include failures */ });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', includeFragments);
  } else {
    includeFragments();
  }
})();


