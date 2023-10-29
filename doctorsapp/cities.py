import pandas as pd
filepath='doctorsapp/static/list_of_cities.xlsx'
df=pd.read_excel(filepath)
city_list= df['City'].tolist()
city_tuples=[('','Select city ...')]+[(city,city) for city in city_list]
