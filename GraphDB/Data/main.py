import fitz  # PyMuPDF
import spacy
import networkx as nx
from rdflib import Graph, URIRef, Namespace
import re

# Load spaCy model
nlp = spacy.load("en_core_web_sm")


def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file, cleans it by removing unwanted characters, and returns the cleaned text.

    Args:
        pdf_path (str): The path to the PDF file.

    Returns:
        str: The cleaned extracted text.
    """
    # Open the PDF file
    pdf_document = fitz.open(pdf_path)

    # Initialize an empty string to store the extracted text
    extracted_text = ""

    # Define a function to clean unwanted characters
    def clean_text(text):
        # Use a regular expression to keep only alphanumeric characters and spaces
        # We don't need the numbers for the tone of voice
        cleaned_text = re.sub(r'[^A-Za-z\s]', '', text)

        # Can be used for further processing (brand identity - colors, fonts, etc.)
        #cleaned_text = re.sub(r'[^A-Za-z0-9\s]', '', text)

        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        return cleaned_text

    # Iterate through each page
    for page_num in range(len(pdf_document)):
        # Get the page
        page = pdf_document.load_page(page_num)
        # Extract text from the page
        page_text = page.get_text().strip()
        # Clean the extracted text
        cleaned_text = clean_text(page_text)
        # Append cleaned text to the result
        extracted_text += cleaned_text

    return extracted_text


def preprocess_text(text):
    """
    Processes the text using spaCy to extract structured data.

    Args:
        text (str): The text to be processed.

    Returns:
        list: A list of tokenized sentences.
    """
    # Process the text with spaCy
    doc = nlp(text)

    # Extract structured data
    structured_data = []
    for sent in doc.sents:
        tokens = [token.text for token in sent]
        structured_data.append(tokens)

    return structured_data

def convert_to_graphdb_format(structured_data):
    """
    Converts structured data into a directed graph format.

    Args:
        structured_data (list): A list of tokenized sentences.

    Returns:
        networkx.DiGraph: A directed graph representing the structured data.
    """
    # Create a directed graph
    graph = nx.DiGraph()

    # Add nodes and edges to the graph
    for sentence in structured_data:
        for i in range(len(sentence) - 1):
            graph.add_edge(sentence[i], sentence[i + 1])

    return graph

def create_rdf_file(graph, rdf_file_path):
    """
    Creates an RDF file from a directed graph.

    Args:
        graph (networkx.DiGraph): The directed graph to be converted to RDF.
        rdf_file_path (str): The path where the RDF file will be saved.
    """
    # Create an RDF graph
    rdf_graph = Graph()
    EX = Namespace("http://superside.org/burger-king#")

    # Add nodes and edges to the RDF graph
    for edge in graph.edges(data=True):
        subject, object_ = edge[0], edge[1]
        rdf_graph.add((URIRef(EX[subject]), URIRef(EX["relatedTo"]), URIRef(EX[object_])))

    # Serialize the RDF graph to a file
    rdf_graph.serialize(destination=rdf_file_path, format="turtle")


if __name__ == "__main__":
    pdf_path = "burger-king-2020-TOV.pdf"
    text = extract_text_from_pdf(pdf_path)
    print(text)
    structured_data = preprocess_text(text)
    graph = convert_to_graphdb_format(structured_data)
    print(graph.edges())
    create_rdf_file(graph, "output-tov.ttl")