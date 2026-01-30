import re
import spacy

nlp = spacy.load("en_core_web_sm")

PHONE_PATTERN = re.compile(r'\b\d{10}\b')
EMAIL_PATTERN = re.compile(r'\b[\w\.-]+@[\w\.-]+\.\w+\b')
AADHAAR_PATTERN = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
URL_PATTERN = re.compile(r'https?://\S+|www\.\S+')

def regex_sanitize(text):
    text = PHONE_PATTERN.sub("[PHONE_NUMBER]", text)
    text = EMAIL_PATTERN.sub("[EMAIL]", text)
    text = AADHAAR_PATTERN.sub("[ID_NUMBER]", text)
    text = URL_PATTERN.sub("[URL]", text)
    return text


def spacy_sanitize(text):
    doc = nlp(text)
    sanitized_text = text

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            sanitized_text = sanitized_text.replace(ent.text, "[PERSON]")
        elif ent.label_ in ["GPE", "LOC"]:
            sanitized_text = sanitized_text.replace(ent.text, "[LOCATION]")
        elif ent.label_ == "ORG":
            sanitized_text = sanitized_text.replace(ent.text, "[ORGANIZATION]")

    return sanitized_text


def sanitize_text(user_text):
    first_protection = regex_sanitize(user_text)
    sec_protection = spacy_sanitize(sec_protection)
    return sec_protection

text = input("Enter Text: ")
new_text = sanitize_text
print(new_text)