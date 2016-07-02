# Ajaxer as axer;
simplify ajax request in forms and anchors, just by adding
axer attributes


# Install
1. `git clone https://github.com/hassanalisalem/ajaxer.git`

2. Add `<script src="src/ajaxer.js"></script>` at the end of the file

# Usage
- Add axer to the form or anchor eg: `<form axer ...>`.
- axer attributes are :<br />
`axer-action` specify where to send the form data.<br />
`axer-action-result` specify where to put the response (it should take an id).<br />
`axer-loading` specify what is the id of the loading form.<br />
`axer-method` the method of your form.<br />
`axer-redirect` where to redirect the form or anchor after finish proccessing.<br />
`axer-before` the function name to call before start proccessing.<br />
`axer-after` function name to call after finishing proccessing.<br />

