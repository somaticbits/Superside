// export const identity = ```
// PREFIX ns1: <http://superside.org/burger-king#>
// PREFIX gpt: <http://www.ontotext.com/gpt/>
//
// SELECT ?subject ?predicate ?object ?query WHERE {
//     ?subject ?predicate ?object .
//     FILTER(?subject = ns1:Identity)
//
//     BIND(CONCAT("What information is available about ", STR(ns1:Identity), "?") AS ?query)
//
//     ?subject gpt:ask ?query .
// }
// ```