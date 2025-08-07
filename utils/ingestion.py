from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import FAISS
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub
def run_llm():
    loader = CSVLoader(file_path="./data/Natural Resources Data (2).csv", encoding="utf-8")
    raw_document = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=30)
    docs = text_splitter.split_documents(documents=raw_document)

    embeddings =OllamaEmbeddings(model="llama3.2")
    vector_store = FAISS.from_documents(docs, embedding=embeddings)

    vector_store.save_local("faiss_index_react")

    new_vector = FAISS.load_local("faiss_index_react", embeddings=embeddings, allow_dangerous_deserialization=True)

    retirieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    combine_docs_chain = create_stuff_documents_chain(
        OllamaLLM(model="llama3.2"),
        retirieval_qa_chat_prompt
    )
    print(docs)

    retrieval_chain = create_retrieval_chain(
        new_vector.as_retriever(),
        combine_docs_chain
    )

    res = retrieval_chain.invoke({"input": "Give me summary of the land"})
    print(res["answer"])


if __name__ == "__main__":
    print("Running main.py......")
    run_llm()