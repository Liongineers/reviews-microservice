API-first definition: https://app.swaggerhub.com/apis/columbia-7bc/Reviews/2.0.0

## How to run local version

On terminal:
npm install
npm run start:dev

On browser:  
http://localhost:3000 for application  
http://localhost:3000/doc for documentation  

## How to locally use version deployed on Cloudrun

⚠️ You will need to be given IAM permissions to do this  
ℹ️ All bash commands are run on the same level as google-cloud-sdk folder in documentation

Install and instantiate following instructions here:  
https://cloud.google.com/sdk/docs/install

Running the following should prompt you to log in and choose your project:  
```./google-cloud-sdk/bin/gcloud init```  
The project you should choose is cloud-computing-473717

You could also do this manually by running the following:  
```./google-cloud-sdk/bin/gcloud auth login```  
```./google-cloud-sdk/bin/gcloud config set project cloud-computing-473717```  

You should now be able to run curl commands like so: 
```
TOKEN=$(./google-cloud-sdk/bin/gcloud auth print-identity-token)

curl -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
    https://reviews-microservice-471529071641.us-east1.run.app
```

## Endpoint Guide (Cloudshell)
### Test Database Connection
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://reviews-microservice-471529071641.us-east1.run.app/reviews/test-db
```

### Create New Review 
```
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "writer_id": "aa34a41e-f01d-4728-a853-f3789953ac7b",
    "seller_id": "0bca48a2-fc00-4c4b-abfe-47f8c60e5a4c",
    "rating": 3,
    "comment": "OK service."
  }' \
  https://reviews-microservice-471529071641.us-east1.run.app/reviews
```

### Get Review by a Writer
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://reviews-microservice-471529071641.us-east1.run.app/reviews/writer/aa34a41e-f01d-4728-a853-f3789953ac7b
```

### Get Reviews for a Seller
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://reviews-microservice-471529071641.us-east1.run.app/reviews/seller/f97cdd57-1873-4309-808f-04245778025d
```

### Update a Review
```
curl -X PATCH \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 3,
    "comment": "Ok service, could do better."
  }' \
  https://reviews-microservice-471529071641.us-east1.run.app/reviews/62733e68-9a80-44ac-8bb3-69c660fd6c56
```

### Delete a Review
```
curl -X DELETE \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://reviews-microservice-471529071641.us-east1.run.app/reviews/62733e68-9a80-44ac-8bb3-69c660fd6c56
```