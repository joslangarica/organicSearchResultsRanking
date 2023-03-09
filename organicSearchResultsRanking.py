#Importing the required libraries
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

#Set up the webdriver
driver = webdriver.Chrome()
driver.get('https://www.google.com/')

#Make the search query a variable to make it easier to change
query = 'Quantum Consciousness'

#Wait for the search input field to become visible
search_input = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'q')))
search_input.send_keys(query)
search_input.submit()

#Create a list to save the results in a JSON file
json_list = []

#Loop through the first 3 pages of search results
for i in range(15):
    #Find all the search results
    results = driver.find_elements(By.CSS_SELECTOR, 'div.g')

    #Loop through the search results
    for index, result in enumerate(results):

        #Get the title, URL and description for each result
        title = result.find_element(By.CSS_SELECTOR, 'h3').text
        url = result.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
        

        #Create a dictionary for each result
        result_dict = {
            'title': title,
            'url': url,
            'organic_ranking': index + 1 + (i * 10)
        }

        #Append the result to the list of results
        json_list.append(result_dict)

    #Navigate to the next page of search results
    try:
        next_button = driver.find_element(By.XPATH, '//a[@id="pnnext"]')
        next_button.click()
    except:
        #No more pages of search results
        break

# Save the results in a JSON file with a timestamp
timestamp = time.strftime("%Y-%m-%d %H-%M-%S")
filename = query + '_' + timestamp + '_organic_ranking.json'
with open(filename, 'w') as fp:
    json.dump(json_list, fp, indent=4)

#Close the browser window
driver.close()
