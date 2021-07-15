import requests

def get_voters():
  page = 1
  count = 0
  while True:
    res = requests.get(f"https://api.stackexchange.com/2.2/badges/89/recipients?page={page}&fromdate=1623628800&site=scifi")
    if res.status_code != 200:
      return f"QUERY FAILED [{res.status_code}]"
    data = res.json()
    count += len(data["items"])
    if data["has_more"]:
      page += 1
      continue
    return count