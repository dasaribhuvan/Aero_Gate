import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

THRESHOLD = 0.6

def compare_embeddings(query_embedding, stored_embedding):
    """
    Compare two face embeddings using cosine similarity
    """

    query_embedding = query_embedding.reshape(1, -1)
    stored_embedding = stored_embedding.reshape(1, -1)

    score = cosine_similarity(query_embedding, stored_embedding)[0][0]

    return float(score)