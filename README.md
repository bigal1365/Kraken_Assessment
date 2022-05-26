
**Dockerized JMeter Integration with InfluxDB **


**Requirements**
You should aim to include a total of at least 3-4 automated processes from market data only such as getAssetInfo, getOHLCData and so on . Please build a performance testing framework to handle those API calls. The scenario should run a ramp up for 5 minutes duration with only 4 concurrent users, you can use any open source tool to add monitoring. Please don't Overload those public API (4 concurrent users only) and Do not attempt to test for denial-of-service vulnerabilities by sending very large requests, large numbers of connection requests, etc., or otherwise attack the API endpoints.
1. This project must be completed by you alone and must be submitted within 3 days of receiving this document.
2. Do not use Kraken API clients written by others from GitHub or anywhere else. The project should be written by you from scratch.
3. You must include a Dockerfile, including an entry-point command that allows us to execute the tests by building and running the Docker image. Test execution should print results of individual tests, including basic details of assertion failures and overall pass/fail result, as would be done in a CI pipeline.


**Dockerized JMeter Integration with InfluxDB **

How to use it

Following are the prerequisites required for the integration:

   Docker
   JMeter 5.4
   Sample JMeter Test Plan
   
**Perforamance requirments feedbacks **:
 Missing API SLA - With 4 users we can manupliate traffic using think time and pacing 
 
 This is how I Did using Jmeter/docker
 There are many open source option
     Locust IO
     Gatling 
     Loadrunner 
     Jmeter
     Blazemeter 
     
Since I hadn't used JMeter for a few years, I plan to test myself

**Step 1.**
git clone https://github.com/bprasai/Kraken_Assessment.git
cd docker-jmeter
**
**Step 2.****
Run the Build script to download dependencies, including the docker CLI:

./build.sh


3) **Step 2.****
 Run the test script:
     ./test.sh
 
**   **==== HTML Test Report ====**
See HTML test report in tests/trivial/report/index.html**
Once you see the above message your test is completed 


**4) Test Results**


    Option 1) Once the test is completed then go to the ‘html’ folder given in the command and find the index.html to view the test results.
    
            open /tests/trivial/report.index html
            
    Option 2) Open --> https://eastus-1.azure.cloud2.influxdata.com/orgs/090a435db2ce75a4
        Login credentainal :bigal.prasai
        Password : Shared in email.
        
        
        
**  Technologies**
This section gives a brief overview of the technologies used in this solution. In a nutshell, JMeter runs the load tests, InfluxDB stores the test results, Grafana displays the test results, and all of these services are run in Docker.

**JMeter**

Apache JMeter is an open-source performance testing software application. JMeter conducts its testing by simulating a group of users sending requests to a target server (web application, database, etc.) and generates reports of the server response [1]. This is the software we use to put load on our web app.

**InfluxDB**

InfluxDB is a time series database that is mainly used to store monitoring data, metrics, real-time analytics and other data that is co-dependent on time [2]. InfluxDB provides the connection between JMeter and Grafana; InfluxDB listens to JMeter and stores the test results in a database, and Grafana reads the data from the InfluxDB database to display in its graphs.



**Docker**

Docker is an open-source software that runs software packages called containers, which gather all the software and dependencies together [4]. The basic Docker workflow is:

we write a Dockerfile in which we define our environment and install any dependencies
we build a Docker image from the Dockerfile
we run the Docker image to start a Docker container¹, which starts the service

        
        
      
      


     
 4)
