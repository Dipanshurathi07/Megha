"""Flask app for a little multi-page love website."""

from flask import Flask, abort, send_from_directory

app = Flask(__name__)

PAGES = {
    "home": "index.html",
    "love": "love.html",
    "question": "question.html",
    "memories": "memories.html",
    "reasons": "reasons.html",
    "surprise": "surprise.html",
    "quiz": "quiz.html",
    "rate": "rate.html",
    "game": "game.html",
    "promise": "promise.html",
}


@app.get("/")
def home():
    return send_from_directory(app.root_path, PAGES["home"])


@app.get("/<page>")
def show_page(page):
    filename = PAGES.get(page)
    if filename is None:
        abort(404)
    return send_from_directory(app.root_path, filename)


if __name__ == "__main__":
    print("Megha's little love website: http://127.0.0.1:8000")
    app.run(host="127.0.0.1", port=8000, debug=False)
