# DIA Data Contract Monitor

---

## Usage

`docker build -t diadata-monitor:latest -f Dockerfile .` <br>
`docker run -e 'emailPassword=xxxxxxxxxxx' diadata-monitor:latest`

---

## Playbooks

---

### To add new contracts

1. Add the abi in the artifacts directory (json)
2. Append the list in the config.yaml -> contracts subheader
3. Make sure that the timestampVariable and the eventName is correct
4. Done!

---

### To add new transports

1. Create the class of the transport you'd want to use.
2. Define 2 functions, success and error in that class - that handles the publish of error messages of the following format:

   ```json
   {
     contract: {
      name,
      address
     },
     type: type of error,
     body: error body
   }
   ```

3. The error message handler must convert the above json object into the required structure of the transport
4. Export the class into the allNotifierIngress script
5. Make an entry in the config.yaml with the format as the email transport has.

---
