from flask import Flask, request, redirect
import string, random

app = Flask(__name__)
urls = {}

def gen_key():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

@app.route('/', methods=['POST'])
def shorten():
    long_url = request.json['url']
    key = gen_key()
    urls[key] = long_url
    return {"short_url": request.host_url + key}

@app.route('/<key>')
def go(key):
    return redirect(urls.get(key, '/'))

if __name__ == '__main__':
    app.run()
