from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument("--log-level=3")
options.add_argument("--headless")
options.add_argument("--disable-gpu")

driver = webdriver.Chrome(options=options)
driver.get("http://34.159.189.85/login")
assert "React App" in driver.title

elem = driver.find_element(By.NAME, "email")
elem.clear()
elem.send_keys("testAccount@gmail.com")

elem = driver.find_element(By.NAME, "password")
elem.clear()
elem.send_keys("testAccount123")

elem = driver.find_element(By.CLASS_NAME, "btn")
elem.click()

time.sleep(3)

current_url = driver.current_url
assert current_url == "http://34.159.189.85/profile"
assert "No results found." not in driver.page_source

driver.close()

print("Test passed")