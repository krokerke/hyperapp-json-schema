# Hyperapp JSON-Schema
### Hyperapp Higher Order App to add support for json-schema based state

make your application state validate itself via json-schema-validators.
additionally to things part of a typesystem (flow, typescript, ..), you can validate specific needs for each value.

compared to other frameworks and their form-validator plugins we work on the whole statetree instead of specific forms
to ensure valid data for any state we have.

### WIP!

This is more a experiment than a working lib (still working with basic examples, though).

ToDo

* optimizing
* testing with bigger examples
* replace ajv with smaller lib or none (was the easiest for experimenting)
  * make the hoa independent from ajv or any other json-schema-validator
  * allow creating own validator (with third party libs, too) via hoa-options object
* maybe add additional options (for example: don't prevent state updates on invalid actions)
