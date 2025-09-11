import streamlit as st
import pandas as pd
from geopy.geocoders import Nominatim

geocoder = Nominatim(user_agent="GetLoc")

st.write("""
    Geographic Information System AI
""")

location_input = st.chat_input("Enter your location")

if location_input:
    try:
        location_data = geocoder.geocode(location_input)
        
        if location_data:
            
            lat = location_data.latitude
            lon = location_data.longitude
            
            data = pd.DataFrame({
                'latitude': [lat],
                'longitude': [lon]
            })
            
            st.map(data=data)
            
            st.write(f"**Address:** {location_data.address}")
            st.write(f"**Coordinates:** {lat:.6f}, {lon:.6f}")
            
        else:
            st.write("Location not found. Please try a different search term.")
            
    except Exception as e:
        st.error(f"An error occurred while geocoding: {str(e)}")
else:
    st.write("Please enter a location to get started.")
