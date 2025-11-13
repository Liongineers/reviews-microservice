API-first definition: https://app.swaggerhub.com/apis/columbia-7bc/Reviews/2.0.0

### How to run local version

On terminal:
npm run start:dev

On browser:  
http://localhost:3000 for application  
http://localhost:3000/doc for documentation  

### How to locally use version deployed on Cloudrun

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

#### For users:
If you are simply using the microservice, you can make the following calls:  
```
TOKEN=$(./google-cloud-sdk/bin/gcloud auth print-identity-token)

curl -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
    https://reviews-microservice-471529071641.us-east1.run.app
```
Simply add the desired endpoint to the end of the https link

#### For developers:
Add the following to your-microservice.service.ts file:  
```
import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class YourMicroserviceService {
  private readonly reviewMicroservice =
    'https://reviews-microservice-471529071641.us-east1.run.app';

  private readonly auth = new GoogleAuth();

  // Example of function you can implement
  async getReviewsByUser(userId: string) {
    const client = await this.auth.getIdTokenClient(this.reviewMicroservice);
    const res = await client.request({
      url: `${this.reviewMicroservice}/reviews/user/${userId}`,
      method: 'GET',
    });
    return res.data;
  }
}
```
