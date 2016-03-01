'use strict';

let interval = setInterval(function () {
  const path = window.location.pathname;
  const pathnameParts = path.split('/');
  const isRepo = /^\/[^/]+\/[^/]+/.test(path);
  const filename = pathnameParts[pathnameParts.length - 1];

  if (isRepo && filename === 'package.json') {
    const username = pathnameParts[1];
    const repo = pathnameParts[2];
    const branch = pathnameParts[4];
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          addLinksToNpm(JSON.parse(xmlhttp.responseText));
        }

        clearInterval(interval);
      }
    }
    xmlhttp.open('GET', `https://raw.githubusercontent.com/${username}/${repo}/${branch}/package.json`, true);
    xmlhttp.send();
  }
}, 1000);

const addLinksToNpm = function (pckg) {
  const dependencies = Object.assign({}, pckg.dependencies, pckg.devDependencies, pckg.optionalDependencies);

  let raw = document.getElementsByTagName('tbody')[0].innerHTML;

  Object.keys(dependencies).forEach(function (module) {
    const expression = new RegExp(module, 'g');
    raw = raw.replace(expression, makeLink(module));
  });

  document.getElementsByTagName('tbody')[0].innerHTML = raw;
};

const makeLink = function (module) {
  return `<a href="https://www.npmjs.com/package/${module}" target="_blank">${module}</a>`;
}