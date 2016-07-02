# Ajaxer as axer;
simplify ajax request fro forms and anchors, just by adding
axer attributes


# Install
1. `git clone https://github.com/hassanalisalem/ajaxer.git`

2. Add `<script src="src/ajaxer.js"></script>` at the end of the file

# Usage
- Add axer to the form or anchor eg: `<form axer ...>`.
- axer attributes are :__
`axer-action` specify where to send the form data.__
`axer-action-result` specify where to put the response (it should take an id).__
`axer-loading` specify what is the id of the loading form.__
`axer-method` the method of your form.__
`axer-redirect` where to redirect the form or anchor after finish proccessing.__
`axer-before` the function name to call before start proccessing.__
`axer-after` function name to call after finishing proccessing.__

