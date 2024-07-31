export const getToneOfVoice = (characteristic: string) => {
    return `PREFIX bk: <http://www.burgerking.com/brand#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX gpt: <http://www.ontotext.com/gpt/>

            SELECT ?characteristicName ?emailCopy WHERE {
    
                ${characteristic} a bk:Characteristic ;
                        rdfs:label ?characteristicName .
    
                BIND(CONCAT("Can you provide copy for an email template using the ", ?characteristicName, " tone of voice?") AS ?query)
                ?emailCopy gpt:ask ?query .
            }`
}