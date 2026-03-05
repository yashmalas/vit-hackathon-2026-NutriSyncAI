"""
Firebase Firestore utilities for reading/writing user data.
Requires GOOGLE_APPLICATION_CREDENTIALS env variable pointing to service account JSON.
"""
import os

# Lazy import so the app still starts without credentials
_db = None

def get_db():
    global _db
    if _db is None:
        try:
            import firebase_admin
            from firebase_admin import credentials, firestore
            if not firebase_admin._apps:
                cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json"))
                firebase_admin.initialize_app(cred)
            _db = firestore.client()
        except Exception:
            _db = None  # Runs without Firestore in demo mode
    return _db

def save_document(collection: str, doc_id: str, data: dict):
    db = get_db()
    if db:
        db.collection(collection).document(doc_id).set(data)
    # Silently pass in demo mode

def get_document(collection: str, doc_id: str):
    db = get_db()
    if db:
        doc = db.collection(collection).document(doc_id).get()
        if doc.exists:
            return doc.to_dict()
    return None
