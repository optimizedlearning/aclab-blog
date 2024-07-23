document.addEventListener("DOMContentLoaded", function() {
    var tocList = document.getElementById("toc-list");
    var headers = document.querySelectorAll("h2._sec, h3._sec");
    var toc = "";
  
    headers.forEach(function(header) {
      var id = header.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      header.id = id;
      if (header.tagName.toLowerCase() === 'h2') {
        toc += `<li class="post-sec"><a href="#${id}">${header.textContent}</a></li>`;
      } else if (header.tagName.toLowerCase() === 'h3') {
        toc += `<li class="post-subsec"><a href="#${id}">${header.textContent}</a></li>`;
      }
    });
  
    tocList.innerHTML = toc;
  });
  