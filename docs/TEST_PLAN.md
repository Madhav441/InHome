# Test Plan for InHome Unified MDM Platform

This document outlines the tests to verify the functionality of the InHome Unified MDM Platform. Each test must pass and reconcile after every change to ensure the platform's stability and correctness. Update this document whenever new components are built or new tests are identified.

---

## 1. **Core Tests**

### 1.1 Build Verification
- **Test**: Build all TypeScript packages.
- **Command**: `npm run build`
- **Expected Outcome**: All packages compile successfully without errors.

### 1.2 Dependency Installation
- **Test**: Install all dependencies.
- **Command**: `npm install`
- **Expected Outcome**: All dependencies are installed without errors.

### 1.3 Go Agent Build
- **Test**: Build the Go Windows agent.
- **Command**: `cd agents/desktop && go build ./...`
- **Expected Outcome**: The agent binary is created successfully.

---

## 2. **Backend API Tests**

### 2.1 Enrollment API
- **Test**: Simulate device enrollment.
- **Tool**: Postman or cURL
- **Endpoint**: `/api/enroll`
- **Payload**:
  ```json
  {
    "deviceId": "test-device",
    "platform": "android",
    "tenant": "test-tenant"
  }
  ```
- **Expected Outcome**: The API responds with a 200 status and a success message.

### 2.2 Policy Application
- **Test**: Apply a policy to a device.
- **Tool**: Postman or cURL
- **Endpoint**: `/api/policy/apply`
- **Payload**:
  ```json
  {
    "deviceId": "test-device",
    "policyId": "test-policy"
  }
  ```
- **Expected Outcome**: The API responds with a 200 status and confirms the policy application.

---

## 3. **Frontend Tests**

### 3.1 Web Console
- **Test**: Verify the web console loads correctly.
- **Steps**:
  1. Start the web console.
  2. Open the browser and navigate to `http://localhost:3000`.
- **Expected Outcome**: The login page is displayed without errors.

---

## 4. **Integration Tests**

### 4.1 End-to-End Device Enrollment
- **Test**: Simulate the complete enrollment process.
- **Steps**:
  1. Start the backend services.
  2. Use an Android emulator to send an enrollment request.
- **Expected Outcome**: The device is enrolled successfully, and the database reflects the new device.

### 4.2 Policy Enforcement
- **Test**: Verify that policies are enforced on enrolled devices.
- **Steps**:
  1. Apply a policy to a test device.
  2. Check the device logs for policy enforcement.
- **Expected Outcome**: The policy is applied, and the device reflects the changes.

---

## 5. **Secrets Management Tests**

### 5.1 Secrets Loading
- **Test**: Verify secrets are loaded correctly.
- **Steps**:
  1. Populate `infra/secrets/` with test credentials.
  2. Start the backend services.
- **Expected Outcome**: The services start without errors, and the secrets are accessible.

---

## 6. **Future Tests**
- Add new tests here as components are built or new scenarios are identified.

---

## Test Execution
- Run all tests after every change.
- Document any failures and their resolutions.
- Update this document with new tests and expected outcomes.