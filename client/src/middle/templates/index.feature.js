<% files.forEach(function(file) { %>
import * as <%- file %> from "./<%-file%>";
<% }); %>
module.exports = {
<% files.forEach(function(file) { %>
  <%- file %>,
<% }); %>
}