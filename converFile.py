import pandas as pd

# Đường dẫn của file JSON ban đầu
json_file_path = "input.json"

# Đọc file JSON vào DataFrame
df = pd.read_json(json_file_path, orient="index")

# Đường dẫn của file CSV kết quả
csv_file_path = "output.csv"

# Lưu DataFrame thành file CSV
df.to_csv(csv_file_path)
