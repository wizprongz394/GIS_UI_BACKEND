from langchain.prompts import PromptTemplate
from langchain_ollama import ChatOllama

def extract_location(query: str):
    llm = ChatOllama(model="llama3.2", temperature=1)
    template = """
        Extract all and only location names from the following text. Return only the location names, one per line.
        Include cities, countries, states, landmarks, and any geographical references.
        
        Text: "{input}"
        
        Locations:
    """
    prompt = PromptTemplate.from_template(template) 

    chain = prompt | llm

    res = chain.invoke(input={"input": query})
    print(res.content)
    return res.content

if __name__ == "__main__":
    extract_location("I want to know about the land near Kasba Police station in Kasba near 92 KN SEN Road.")
