from flask import Flask, render_template, send_file
from flask_cors import CORS

import datetime, json, re, requests, time

app = Flask(__name__)
CORS(app)

last_time = 0
cache = 0
throttled = False

def get_voters():
  global last_time, cache, throttled
  if time.time() - last_time < 600:
    return cache
  last_time = time.time()
  page = 1
  count = 0
  while True:
    res = requests.get(f"https://api.stackexchange.com/2.2/badges/89/recipients?page={page}&fromdate=1623628800&site=scifi")
    if res.status_code != 200:
      throttled = True
      return cache
    data = res.json()
    count += len(data["items"])
    if data["has_more"]:
      page += 1
      continue
    cache = count
    throttled = False
    return cache

@app.route("/")
def serve_root():
  return render_template("index.html")

@app.route("/2048")
def serve_2048():
  return render_template("2048.html")

@app.route("/breakout")
def serve_breakout():
  return render_template("breakout.html")

@app.route("/snake")
def serve_snake():
  return render_template("snake.html")

@app.route("/pong")
def serve_pong():
  return render_template("pong.html")

@app.route("/sliding-puzzle")
@app.route("/sliding-puzzle/<int:size>")
def serve_sliding_puzzle(size = 4):
  return render_template("sliding-puzzle.html", size = size)

@app.route("/springs")
def serve_springs():
  return render_template("springs.html")

@app.route("/benchmark")
def serve_benchmark():
  return render_template("benchmark.html")

@app.route("/benchmark-reaction-time")
def serve_benchmark_reaction_time():
  return render_template("benchmark-reaction-time.html")

@app.route("/debate-timer")
def serve_debate_timer():
  return render_template("debate-timer.html")

@app.route("/mccollough")
def serve_mccollough():
  return render_template("mccollough.html")

@app.route("/cs145-utils")
def serve_cs145_utils():
  return render_template("cs145-utils.html")

@app.route("/keyboard")
def serve_keyboard():
  return render_template("keyboard.html")

@app.route("/nh/<int:id>")
def serve_nh(id):
  return send_file(f"/tmp/nhentai/{id}/final.pdf", attachment_filename = f"{id}.pdf")

@app.route("/election")
def serve_election():
  return render_template("cgcc-election.html", value = get_voters(), throttled = throttled)

if __name__ == "__main__":
  app.run(host = "0.0.0.0", port = 5678, debug = True)
