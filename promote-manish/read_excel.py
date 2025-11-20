import pandas as pd
import os

file_path = 'Manish AI 话术.xlsx'

try:
    # Read all sheets
    xls = pd.ExcelFile(file_path)
    print(f"Found sheets: {xls.sheet_names}")
    
    for sheet_name in xls.sheet_names:
        print(f"\n--- Sheet: {sheet_name} ---")
        df = pd.read_excel(xls, sheet_name=sheet_name)
        # Print the first few rows and columns to get an idea of the structure
        print(df.to_string())
except Exception as e:
    print(f"Error reading excel file: {e}")
