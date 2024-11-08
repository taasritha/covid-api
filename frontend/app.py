import streamlit as st
import requests
import pandas as pd

# Set the base URL of your backend API
API_URL = "http://localhost:8000/covid"

# Initialize session state variables for login
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "username" not in st.session_state:
    st.session_state.username = ""
if "region" not in st.session_state:
    st.session_state.region = ""

# Function to fetch data from the backend
def fetch_data(endpoint):
    try:
        response = requests.get(f"{API_URL}/{endpoint}")
        response.raise_for_status()
        data = response.json()
        
        # Ensure that each item in the data is a dictionary before trying to delete _id
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and "_id" in item:
                    del item["_id"]
        
        # If the data is a single dictionary (e.g., for detailed data), remove the _id
        elif isinstance(data, dict) and "_id" in data:
            del data["_id"]
        
        return data
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching data: {e}")
        return None


# Function for Normal User page (viewing tables)
def normal_user_page():
    st.title("COVID-19 Tracking Dashboard - Normal User")

    # Dropdown to choose the type of data to view
    view_option = st.selectbox("Select Data to View", ["Active Cases by Region", 
                                                      "Detailed COVID-19 Statistics by Region", 
                                                      "Hospital Resources by Region", 
                                                      "Vaccination Status by Region"])

    # Based on selection, fetch and display the corresponding data
    if view_option == "Active Cases by Region":
        st.subheader("Active COVID-19 Cases by Region")
        cases_data = fetch_data("cases")
        if cases_data:
            st.dataframe(pd.DataFrame(cases_data))

    elif view_option == "Detailed COVID-19 Statistics by Region":
        st.subheader("COVID-19 Statistics by Region (Active Cases, Recoveries, Deaths)")
        region = st.text_input("Enter Region Name")
        if region:
            detailed_data = fetch_data(f"cases/{region}")
            if detailed_data:
                st.dataframe(pd.DataFrame([detailed_data]))
            else:
                st.error("No data found for the selected region.")

    elif view_option == "Hospital Resources by Region":
        st.subheader("Hospital Resources (Beds, Ventilators, ICU)")
        hospitals_data = fetch_data("hospitals/resources")
        if hospitals_data:
            st.dataframe(pd.DataFrame(hospitals_data))

    elif view_option == "Vaccination Status by Region":
        st.subheader("Vaccination Status (Doses Given, % of Population Vaccinated)")
        vaccination_data = fetch_data("vaccination-status")
        if vaccination_data:
            st.dataframe(pd.DataFrame(vaccination_data))

# Function for Hospitals' page (login and update)
def hospital_page():
    st.title("COVID-19 Dashboard - Hospital Login")

    if not st.session_state.logged_in:
        # Display login form
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        if st.button("Login"):
            # Dummy login logic (replace with backend authentication)
            if username == "mumbai_hospital" and password == "mumbai":
                st.session_state.logged_in = True
                st.session_state.username = username
                st.session_state.region = "mumbai"
            elif username == "delhi_hospital" and password == "delhi":
                st.session_state.logged_in = True
                st.session_state.username = username
                st.session_state.region = "delhi"
            elif username == "bangalore_hospital" and password == "bangalore":
                st.session_state.logged_in = True
                st.session_state.username = username
                st.session_state.region = "bangalore"
            else:
                st.error("Invalid credentials!")

    if st.session_state.logged_in:
        # Show authenticated content for the logged-in user
        st.success(f"Welcome, {st.session_state.username}! Region: {st.session_state.region.capitalize()}")

        # Fetch and display region-specific data
        region = st.session_state.region.lower()
        cases_data = fetch_data(f"cases/{region}")
        if cases_data:
            st.dataframe(pd.DataFrame([cases_data]))

        hospital_resources = fetch_data(f"hospitals/resources/{region}")
        if hospital_resources:
            st.subheader("Current Hospital Resources")
            st.dataframe(pd.DataFrame([hospital_resources]))

            # Update section
            st.subheader("Update COVID-19 Data")
            update_section = st.radio("Select Update Type", ("Cases Data", "Hospital Resources"))

            if update_section == "Cases Data":
                active_cases = st.number_input("Active Cases", min_value=0, value=cases_data['active_cases'])
                recoveries = st.number_input("Recoveries", min_value=0, value=cases_data['recoveries'])
                deaths = st.number_input("Deaths", min_value=0, value=cases_data['deaths'])

                if st.button("Update Cases Data"):
                    update_data = {
                        "active_cases": active_cases,
                        "recoveries": recoveries,
                        "deaths": deaths
                    }
                    response = requests.put(f"{API_URL}/cases/update/{region}", json=update_data)
                    if response.status_code == 200:
                        st.success("Cases data updated successfully!")
                    else:
                        st.error(f"Failed to update cases data: {response.text}")

            elif update_section == "Hospital Resources":
                beds_available = st.number_input("Beds Available", min_value=0, value=hospital_resources.get('beds_available', 0))
                ventilators_available = st.number_input("Ventilators Available", min_value=0, value=hospital_resources.get('ventilators_available', 0))
                icu_capacity = st.number_input("ICU Capacity", min_value=0, value=hospital_resources.get('icu_capacity', 0))

                if st.button("Update Hospital Resources"):
                    update_data = {
                        "beds_available": beds_available,
                        "ventilators_available": ventilators_available,
                        "icu_capacity": icu_capacity
                    }
                    response = requests.put(f"{API_URL}/hospitals/resources/update/{region}", json=update_data)
                    if response.status_code == 200:
                        st.success("Hospital resources updated successfully!")
                    else:
                        st.error(f"Failed to update hospital resources: {response.text}")

# Main function for page navigation
def main():
    st.sidebar.title("Navigation")
    page = st.sidebar.radio("Choose a page", ("Normal User", "Hospital"))

    if page == "Normal User":
        normal_user_page()
    elif page == "Hospital":
        hospital_page()

if __name__ == "__main__":
    main()
