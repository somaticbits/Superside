function sanitizeInput(input: string): string {
    const map: { [key: string]: string } = {
        '\\': '\\\\',
        '"': '\\"',
        "'": "\\'",
        '<': '\\<',
        '>': '\\>',
        '{': '\\{',
        '}': '\\}',
        '^': '\\^',
        '`': '\\`',
        '@': '\\@',
    };

    return `"${input.replace(/[\\'"<>{}^`@]/g, (m) => map[m])}"`;
}

export const getEmailTemplate = (characteristic: string, message: string) => {
    const sanitizedMessage = sanitizeInput(message);

    return `PREFIX bk: <http://www.burgerking.com/brand#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX gpt: <http://www.ontotext.com/gpt/>

SELECT ?emailCopy WHERE {
    # Define the characteristic and additional message
    VALUES (?characteristic ?additionalMessage) { 
        (${characteristic} ${sanitizedMessage}) 
    }

    # Get characteristic name
    ?characteristic rdfs:label ?characteristicName .

    # Collect do's
    {
        SELECT (GROUP_CONCAT(DISTINCT ?doExampleText; separator=", ") AS ?doExamples) WHERE {
            ?doExample rdf:type bk:VerbalIdentity ;
                       bk:hasCharacteristic ?characteristic ;
                       bk:exampleText ?doExampleText .
        }
    }

    # Collect don'ts
    {
        SELECT (GROUP_CONCAT(DISTINCT ?dontExampleText; separator=", ") AS ?dontExamples) WHERE {
            ?dontExample rdf:type bk:VerbalIdentity ;
                         bk:hasCharacteristic ?characteristic ;
                         bk:exampleText ?dontExampleText .
        }
    }

    # Construct the query for generating email copy
    BIND(CONCAT(
        "Can you provide copy for an email template answering the additional message using the ", 
        ?characteristicName, 
        " tone of voice? Also, please consider the do's and don'ts for this tone of voice.: Do's - ", 
        COALESCE(?doExamples, "No examples provided"), 
        "; Don'ts - ", 
        COALESCE(?dontExamples, "No examples provided"),
        ". Additional message: ", 
        ?additionalMessage,
        "Answer exactly in this format: Subject: [subject] Message: [message]. And never ever mention other foods than burgers."
    ) AS ?query)

    # Request the email copy using the constructed query
    ?emailCopy gpt:ask ?query .
}`
}