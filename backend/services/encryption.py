from passlib.context import CryptContext

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashed_equals(plain: str, encrypted: str) -> bool:
    "Check if a plain string should be equal to the encrypted one"
    return crypt_context.verify(plain, encrypted)

def hashify(input: str) -> str:
    "Encrypt a string"
    return crypt_context.hash(input)
