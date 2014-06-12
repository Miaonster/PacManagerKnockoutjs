'use strict';

var fs = require('fs');

define(function () {
  var data = {
    path: '/Users/witcher42/local/server/www/pac/SwitchyPac.js',
    remains: '',
    domains: null,

    options: {
      encoding: 'utf8'
    },

    init: function (/*path*/) {
      //this.path = path;

      var content = this.read(),
          match = /var domains = (\[([\s\r\n]*".*?",?)*[\s\r\n]*\])/g.exec(content),
          domains = eval(match[1]),
          remains = content.replace(match[0], '');

      this.domains = domains;
      this.remains = remains;
    },

    assemble: function () {
      var content;

      content = this.domains.join('",\n  "');
      content = content.replace('\\', '\\\\');
      content = 'var domains = [\n  "' + content + '"\n]' + this.remains;

      return content;
    },

    addDomain: function (domain) {
      this.domains.push(domain);
      this.save(this.assemble());
    },

    rmDomain: function (domain) {
      this.domains = _.without(this.domains, domain);
      this.save(this.assemble());
    },

    parseData: function () {
      var content = this.read(),
          match = /var domains = (\[([\s\r\n]*".*?",?)*[\s\r\n]*\])/g.exec(content);
      return match;
    },

    read: function () {
      return fs.readFileSync(this.path, this.options);
    },

    save: function (text) {
      try {
        return fs.writeFileSync(this.path, text, this.options);
      } catch (e) {
        return false;
      }
    }
  };

  data.init();

  return data;
});
