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
driver.get("http://34.159.189.85/register")
assert "React App" in driver.title

elem = driver.find_element(By.NAME, "first_name")
elem.clear()
elem.send_keys("te")

error_msg = driver.find_elements(By.CLASS_NAME, "text-danger")[0].get_attribute("innerHTML")
assert error_msg == "Name must be at least 3 characters"
print("test_register_fail_validation.py: test_register_fail_validation_first_name passed")

elem = driver.find_element(By.NAME, "last_name")
elem.clear()
elem.send_keys("te")

error_msg = driver.find_elements(By.CLASS_NAME, "text-danger")[1].get_attribute("innerHTML")
assert error_msg == "Name must be at least 3 characters"
print("test_register_fail_validation.py: test_register_fail_validation_last_name passed")

elem = driver.find_element(By.NAME, "email")
elem.clear()
elem.send_keys("testAccount")

error_msg = driver.find_elements(By.CLASS_NAME, "text-danger")[2].get_attribute("innerHTML")
assert error_msg == "Invalid email format"
print("test_register_fail_validation.py: test_register_fail_validation_email passed")

elem = driver.find_element(By.NAME, "password")
elem.clear()
elem.send_keys("testAccount")

error_msg = driver.find_elements(By.CLASS_NAME, "text-danger")[3].get_attribute("innerHTML")
assert error_msg == "Password must be at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase letter"
print("test_register_fail_validation.py: test_register_fail_validation_password passed")

elem = driver.find_element(By.NAME, "password_confirm")
elem.clear()
elem.send_keys("testAccount123")

error_msg = driver.find_elements(By.CLASS_NAME, "text-danger")[4].get_attribute("innerHTML")
assert error_msg == "Passwords do not match"
print("test_register_fail_validation.py: test_register_fail_validation_password_confirm passed")

driver.close()

print("All tests passed")