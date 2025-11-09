"""
Test script for Vehicle Verification API
Run this script to test all verification endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/vehicles"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(message):
    print(f"{Colors.GREEN}[OK] {message}{Colors.END}")

def print_error(message):
    print(f"{Colors.RED}[ERROR] {message}{Colors.END}")

def print_info(message):
    print(f"{Colors.BLUE}[INFO] {message}{Colors.END}")

def print_warning(message):
    print(f"{Colors.YELLOW}[WARNING] {message}{Colors.END}")

def print_section(title):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{Colors.END}\n")


# Test 1: Check if server is running
def test_server_connection():
    print_section("Test 1: Server Connection")
    try:
        response = requests.get(f"{BASE_URL}/api/vehicles/", timeout=5)
        if response.status_code in [200, 401, 403]:
            print_success("Server is running and accessible")
            return True
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to server. Make sure Django server is running on port 8000")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# Test 2: Verify Vehicle Endpoint (requires authentication)
def test_verify_vehicle_endpoint(vehicle_id=1, jwt_token=None):
    print_section(f"Test 2: Verify Vehicle Endpoint (Vehicle ID: {vehicle_id})")
    
    if not jwt_token:
        print_warning("No JWT token provided. This endpoint requires authentication.")
        print_info("To test this endpoint, you need to:")
        print_info("1. Login to get a JWT token")
        print_info("2. Pass the token as a cookie")
        return False
    
    try:
        cookies = {'jwt': jwt_token}
        response = requests.post(
            f"{API_URL}/{vehicle_id}/verify/",
            cookies=cookies,
            timeout=30
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print_success("Verification triggered successfully!")
                print_info(f"Verification Status: {data.get('verification_status')}")
                return True
            else:
                print_error(f"Verification failed: {data.get('error')}")
                return False
        elif response.status_code == 401:
            print_error("Authentication required. Please provide valid JWT token.")
            return False
        elif response.status_code == 403:
            print_error("Permission denied. You must own the vehicle to verify it.")
            return False
        elif response.status_code == 404:
            print_error("Vehicle not found.")
            return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# Test 3: Get Verification Status
def test_verification_status(vehicle_id=1):
    print_section(f"Test 3: Get Verification Status (Vehicle ID: {vehicle_id})")
    
    try:
        response = requests.get(
            f"{API_URL}/{vehicle_id}/verification-status/",
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_success("Verification status retrieved successfully!")
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            print(f"\nVerification Details:")
            print(f"   Status: {data.get('verification_status', 'N/A')}")
            print(f"   Is Verified: {data.get('is_verified', False)}")
            print(f"   Score: {data.get('verification_score', 'N/A')}")
            print(f"   Attempts: {data.get('attempts', 0)}")
            return True
        elif response.status_code == 404:
            print_error("Vehicle not found.")
            return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# Test 4: Get Verification History
def test_verification_history(vehicle_id=1):
    print_section(f"Test 4: Get Verification History (Vehicle ID: {vehicle_id})")
    
    try:
        response = requests.get(
            f"{API_URL}/{vehicle_id}/verification-history/",
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_success("Verification history retrieved successfully!")
            
            print(f"\nHistory Summary:")
            print(f"   Total Attempts: {data.get('total_attempts', 0)}")
            print(f"   Current Status: {data.get('current_status', 'N/A')}")
            print(f"   Is Verified: {data.get('is_verified', False)}")
            print(f"   Results Count: {len(data.get('results', []))}")
            
            if data.get('results'):
                print(f"\n   Latest Results:")
                for i, result in enumerate(data.get('results', [])[:3], 1):
                    print(f"      {i}. Score: {result.get('overall_confidence_score', 'N/A')}%, "
                          f"Passed: {result.get('verification_passed', False)}, "
                          f"Date: {result.get('created_at', 'N/A')}")
            return True
        elif response.status_code == 404:
            print_error("Vehicle not found.")
            return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# Test 5: Check Vehicle List Includes Verification Fields
def test_vehicle_list_with_verification():
    print_section("Test 5: Vehicle List with Verification Fields")
    
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} vehicles")
            
            if data:
                first_vehicle = data[0]
                verification_fields = [
                    'verification_status',
                    'is_verified',
                    'verification_score',
                    'latest_verification'
                ]
                
                print(f"\nChecking Verification Fields in Response:")
                for field in verification_fields:
                    if field in first_vehicle:
                        print_success(f"   Field '{field}' present: {first_vehicle.get(field)}")
                    else:
                        print_error(f"   Field '{field}' missing!")
                
                return True
            else:
                print_warning("No vehicles found in database")
                return True
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


# Test 6: Check Individual Vehicle Endpoint
def test_vehicle_detail_with_verification(vehicle_id=1):
    print_section(f"Test 6: Vehicle Detail with Verification (Vehicle ID: {vehicle_id})")
    
    try:
        response = requests.get(f"{API_URL}/{vehicle_id}/", timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_success("Vehicle details retrieved successfully!")
            
            print(f"\nVehicle Info:")
            print(f"   {data.get('manufacturer', 'N/A')} {data.get('model', 'N/A')}")
            print(f"   Year: {data.get('year', 'N/A')}")
            print(f"   Fuel Type: {data.get('fuel_type', 'N/A')}")
            print(f"   Vehicle Type: {data.get('vehicle_type', 'N/A')}")
            
            print(f"\nVerification Info:")
            print(f"   Status: {data.get('verification_status', 'pending')}")
            print(f"   Is Verified: {data.get('is_verified', False)}")
            print(f"   Score: {data.get('verification_score', 'N/A')}")
            
            if data.get('latest_verification'):
                latest = data['latest_verification']
                print(f"\n   Latest Verification:")
                print(f"      Confidence Score: {latest.get('overall_confidence_score', 'N/A')}%")
                print(f"      Passed: {latest.get('verification_passed', False)}")
                print(f"      Needs Review: {latest.get('requires_manual_review', False)}")
            
            return True
        elif response.status_code == 404:
            print_error("Vehicle not found.")
            return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def main():
    print(f"""
{Colors.BLUE}============================================================
  Vehicle Verification API Test Suite
============================================================{Colors.END}
    """)
    
    print_info("Testing Vehicle Verification API endpoints...")
    print_info("Make sure your Django server is running on http://localhost:8000\n")
    
    results = []
    
    # Run all tests
    results.append(("Server Connection", test_server_connection()))
    
    if results[0][1]:  # If server is accessible
        results.append(("Vehicle List with Verification", test_vehicle_list_with_verification()))
        results.append(("Vehicle Detail with Verification", test_vehicle_detail_with_verification(1)))
        results.append(("Verification Status", test_verification_status(1)))
        results.append(("Verification History", test_verification_history(1)))
        
        # This test requires authentication
        print_section("Test 7: Verify Vehicle (Authentication Required)")
        print_warning("This endpoint requires authentication (JWT token)")
        print_info("To test the verification trigger:")
        print_info("1. Login via /api/users/login/ to get JWT cookie")
        print_info("2. Create a vehicle with images")
        print_info("3. Call POST /api/vehicles/{id}/verify/")
        print_info("\nExample curl command:")
        print(f"{Colors.YELLOW}curl -X POST http://localhost:8000/api/vehicles/1/verify/ \\")
        print(f"  -H 'Cookie: jwt=YOUR_JWT_TOKEN_HERE'{Colors.END}\n")
    
    # Summary
    print_section("Test Summary")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        if result:
            print_success(f"{test_name}: PASSED")
        else:
            print_error(f"{test_name}: FAILED")
    
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  Results: {passed}/{total} tests passed")
    print(f"{'='*60}{Colors.END}\n")
    
    if passed == total:
        print_success("All tests passed! The verification API is working correctly.")
    else:
        print_warning(f"{total - passed} test(s) failed. Please check the errors above.")
    
    print(f"\n{Colors.BLUE}Next Steps:{Colors.END}")
    print("1. Set up your .env file with OPENAI_API_KEY")
    print("2. Login and get a JWT token")
    print("3. Create a vehicle listing with images")
    print("4. Call the verify endpoint to test AI verification")
    print("\n" + "="*60 + "\n")


if __name__ == "__main__":
    main()

